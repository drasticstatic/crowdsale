// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0; // '^' means use at least this version

/* This is a crowdsale contract that allows users to buy tokens with Ether
    It manages the sale of tokens, tracks how many are sold, and handles the funds
    The owner can set the price and finalize the sale when it's complete */

    /* *** = Addeded Whitelist functionality:
        - Require that investors get whitelisted to buy tokens
        - Add investors to the whitelist from a special script or from a separate user interface
        - Store whitelisted users in smart contract
        - Create function to allow only owner to add people to whitelist
        - Only let people who are whitelisted buy tokens*/

import "hardhat/console.sol";
import "./Token.sol"; // Importing our custom token contract

contract Crowdsale {
    address public owner; // The address that deployed this contract and has special permissions
    Token public token; // 'Token' = Reference to our token contract
    uint256 public price; // Price of each token in wei (1 ETH = 10^18 wei)
    uint256 public maxTokens; // Maximum number of tokens available for sale
    uint256 public tokensSold; // Tracks how many tokens have been sold so far
    // Add whitelist functionality:
    bool public whitelistEnabled; // Flag to enable/disable whitelist functionality
    address[] private allAddresses;// to track all addresses
    // Add open/closed functionality:
    bool public isOpen = false;
    uint256 public openingTime;
    // Add min/max contribution functionality:
    uint256 public minContribution;
    uint256 public maxContribution;

    /* More variables to track:
        uint256 public tokensRemaining; // amount of tokens remaining
        uint256 public tokensAvailable; // amount of tokens available for sale
        uint256 public tokensReservedForSale; // amount of tokens reserved for sale
        uint256 public tokensBurned; // amount of tokens burned
        uint256 public tokensMinted; // amount of tokens minted
        uint256 public tokensDistributed; // amount of tokens distributed
        uint256 public tokensClaimed; // amount of tokens claimed
        uint256 public tokensUnclaimed; // amount of tokens unclaimed
        uint256 public tokensRefunded; // amount of tokens refunded
        uint256 public tokensRefundedClaimed; // amount of tokens refunded claimed
        uint256 public tokensRefundedUnclaimed; // amount of tokens refunded unclaimed
        uint256 public tokensRefundedBurned; // amount of tokens refunded burned
        uint256 public tokensRefundedMinted; // amount of tokens refunded minted
        uint256 public tokensRefundedDistributed; // amount of tokens refunded distributed
        */
    
    // Events let frontend applications know when something happens on the blockchain
    event Buy(uint256 amount, address buyer); // Emitted when someone buys tokens
    event Finalize(uint256 tokensSold, uint256 ethRaised); // Emitted when the sale ends m- how much ETH was raised

    // *** Added mapping to manage a whitelist of addresses
    mapping(address => bool) public whitelist;
    // mapping not gas efficient, switch to merkle proofs for larger whitelists
    // Mapping is like a dictionary that stores addresses and whether they are whitelisted (true/false)
    // Mekle tree is a data structure that allows efficient and secure verification of large sets of data
    // Merkle proofs are used to verify that an address is part of a whitelist without storing all addresses on-chain

    // Constructor runs once when the contract is deployed
    constructor(
        Token _token, // Address of the token contract
        uint256 _price, // Price per token in wei
        uint256 _maxTokens, // Maximum tokens for sale
        uint256 _openingTime, // Opening time of the crowdsale
        uint256 _minContribution, // Minimum contribution per transaction
        uint256 _maxContribution // Maximum contribution per transaction
    ) {
        owner = msg.sender; // Set the deployer as the owner
        token = _token; // Store the token contract reference
        price = _price; // Set the initial token price
        maxTokens = _maxTokens; // Set the maximum tokens available
        whitelistEnabled = true; // Start with whitelist enabled
        openingTime = _openingTime; // Set the opening time
        minContribution = _minContribution; // Set the minimum contribution
        maxContribution = _maxContribution; // Set the maximum contribution
        whitelistEnabled = true; // Start with whitelist enabled
    }

    // Modifiers are used to change the behavior of functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not and must be the owner"); // Check if caller is owner
        // prevents a non-owner from calling the function
        _; // '_;' = Continue executing the function body below
    }
    modifier onlyWhitelisted() {
    if (whitelistEnabled) { //Updated: now will only check 'if' the sender is whitelisted WHEN the whitelist feature IS enabled
        // If whitelist is disabled, it will skip the check and allow anyone to proceed
        require(whitelist[msg.sender] == true, "Address not whitelisted");
    } // Check if caller is whitelisted
        // == is comparison operator, checks if the address is whitelisted*/
        // prevents a non-whitelisted address from calling the function
        _; //
    }
    modifier onlyWhenOpen() {
        require(isOpen, "Sale is not open");
        require(block.timestamp >= openingTime, "Sale has not started yet");
        _;
    }

    // === Open/Close functionality === to restrict when the crowdsale is active
    function openSale() public onlyOwner {
        isOpen = true; // Set the sale to open
    }

    function closeSale() public onlyOwner {
        isOpen = false; // Set the sale to closed
    }

    // === Whitelist functionality === to restrict who can buy tokens
        // *** Added this function to allow only owner to add people to whitelist
    function addToWhitelist(address _address) public onlyOwner {
        if (!whitelist[_address]) {
            allAddresses.push(_address);
        }
        whitelist[_address] = true;//The contract's 'getWhitelistedAddresses' only returns addresses where whitelist[address] == true
    }
        // *** Added this function to allow only owner to remove people from whitelist
    function removeFromWhitelist(address _address) public onlyOwner {
        require(whitelist[_address], "Address not whitelisted"); // Check if address is already whitelisted
        whitelist[_address] = false;
    }
        // *** Added this function to allow only owner to toggle whitelist requirement
    function toggleWhitelist(bool _enabled) public onlyOwner {
        whitelistEnabled = _enabled;
    }

    // Function to get Whitelisted addresses
        // This function returns an array of all whitelisted addresses
        // Note: This is not gas efficient for large whitelists, consider using Merkle proofs for larger whitelists
    function getWhitelistedAddresses() public view returns (address[] memory) {
        // Count whitelisted addresses first
        uint256 count = 0;
        for (uint256 i = 0; i < allAddresses.length; i++) {
            if (whitelist[allAddresses[i]]) {
                count++;
            }
        }
        // Create result array with ONLY ACTIVE whitelist entries
        address[] memory result = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allAddresses.length; i++) {
            if (whitelist[allAddresses[i]]) {
                result[index] = allAddresses[i];
                index++;
            }
        }
        return result;
    }

    // Special function that runs when someone sends ETH directly to the contract to buy tokens
    // --> https://docs.soliditylang.org/en/v0.8.15/contracts.html#receive-ether-function
    receive() external payable onlyWhitelisted { //external = only callable from outside the contract, visible in both the contract and the blockchain
        // Added modifier: onlyWhitelisted = only whitelisted addresses can call this function
        
        uint256 amount = msg.value / price; // Calculate how many tokens they can buy
        buyTokens(amount * 1e18); // Buy the tokens (converting to token decimal format)
        // 1e18 (10^18) is used to convert the amount of tokens to the same decimal format as the token contract
    }

    // Function to buy tokens by sending ETH
    function buyTokens(uint256 _amount) public payable onlyWhitelisted onlyWhenOpen { // payable (modifyer) allows to send ether to smart contract
        // Added modifiers: onlyWhitelisted & onlyWhenOpen

        // Check min/max contribution:
        require(_amount >= minContribution, "Amount is less than minimum contribution");
        require(_amount <= maxContribution, "Amount exceeds maximum contribution");

        // Calculate cost
        uint256 cost = (_amount * price) / 1e18;
    
        // Check that enough ETH was sent:
        require(msg.value >= cost, "Insufficient ETH sent"); // <-- added error message to require statement
            // amount of ether sent in with transaction - must be equal to the amount of tokens bought
        // Check that the contract has enough tokens to sell:
        require(token.balanceOf(address(this)) >= _amount, "Not enough tokens available"); // <-- added error message to require statement
            // 'this' = current contract (crowdsale)
        // Transfer tokens to the buyer:
        require(token.transfer(msg.sender, _amount), "Token transfer failed"); // <-- added error message to require statement

        // Update the total tokens sold
        tokensSold += _amount;

        // Emit an event that the frontend can listen for
        emit Buy(_amount, msg.sender); // <-- msg.sender = buyer
    }

    // Function to change the token price (only owner can call)
    function setPrice(uint256 _price) public onlyOwner { // <-- note modifier: onlyOwner = only the owner can call this function
        price = _price;
    }

    // Function to finalize/end the sale and withdraw funds (only owner can call)
    function finalize() public onlyOwner {// <-- note modifier: onlyOwner = only the owner can call this function
        // Transfer any remaining tokens back to the owner/creator
        require(token.transfer(owner, token.balanceOf(address(this))), "Token transfer failed"); // <-- added error message to require statement

        // Transfer all ETH from sales to the owner/creator
        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value: value}(""); // Low-level call to send ETH - note empty string
        require(sent, "Failed to send ETH"); // <-- added error message to require statement

        // Emit event with sale results
        emit Finalize(tokensSold, value);
    }
}

// ========= END OF CROWDSALE.SOL ==========

/* ---REQUIRE--- statement in Solidity is a critical function that acts as a guard condition:
    It checks if a condition is true before executing the rest of the function.
        If the condition is true, the function continues execution
        If the condition is false, the function immediately stops, reverts all changes, and returns an error message
    Syntax: require(condition, "Error message");

In this code: require is used to ensure:
    Verifying the correct amount of ETH was sent
    Ensuring the contract has enough tokens to sell
    Confirming token transfers were successful
    Restricting certain functions to the owner only

Gas efficiency: When a require statement fails, it refunds any unused gas to the caller, making it more economical than other error handling approaches.
    This is important for users, as it prevents them from losing gas fees on failed transactions.

This is a fundamental security feature in Solidity that helps prevent invalid transactions and protects both users and contract owners from unexpected behavior.
*/
