const { expect } = require('chai'); // Chai is an assertion library
const { ethers } = require('hardhat'); // Ethers.js is a library for interacting with Ethereum

/* This file contains tests for the Crowdsale contract
  Tests ensure that our smart contract works as expected before deploying to the blockchain
  Each test checks a specific functionality of the contract */

// Helper function to convert normal numbers to token amounts with 18 decimals
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
  // For example, tokens(1) = 1000000000000000000 (1 with 18 zeros)
}

// Alias for tokens function to make code more readable when dealing with ETH
const ether = tokens

// --- MAIN TEST SUITE FOR THE CROWDSALE CONTRACT ---:
describe('Crowdsale', () => {
  // Variables to store contract instances and test accounts
  let token, crowdsale
  let deployer, user1

  // This runs before each test to set up a fresh environment
  beforeEach(async () => {
    // Load/get contract factories (templates) from Hardhat
    const Crowdsale = await ethers.getContractFactory('Crowdsale')
    const Token = await ethers.getContractFactory('Token')

    // Deploy the Token contract with initial parameters
    token = await Token.deploy('Dapp University', 'DAPP', '1000000')

    // Configure/get test accounts from Hardhat
    accounts = await ethers.getSigners()
    deployer = accounts[0] // First account is the deployer
    user1 = accounts[1]    // Second account is a regular user

    /* Deploy the Crowdsale contract with:
      - token address
      - price of 1 ETH per token
      - maximum of 1,000,000 tokens for sale */
    crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000') // <-- 1 token = 1 ether, 1000000 max tokens

    // Transfer all tokens to the Crowdsale contract to be sold
    let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000))
    await transaction.wait() // Wait for transaction to be mined
  })

  // --- TEST CASE FOR CONTRACT DEPLOYMENT --- :
  describe('Deployment', () => {
    // Test that tokens were transferred to the crowdsale contract (initial token balance)
    // This checks if the Crowdsale contract has the correct amount of tokens
    it('sends tokens to the Crowdsale contract', async () => {
      expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000))
    })

    // Test that the price was set correctly
    it('returns the price', async () => {
      expect(await crowdsale.price()).to.equal(ether(1))
    })

    // Test that the token address was set correctly
    it('returns token address', async () => {
      expect(await crowdsale.token()).to.equal(token.address)
    })
  })

  // --- TEST CASES FOR CROWDSALE FUNCTIONALITY --- :

    // --- ADD A NEW TEST CASE TO CHECK BUYING AND TRANSFERRING TOKENS --- :
      describe('Buying Tokens', () => {
        let transaction, result
        let amount = tokens(10) // Define amount of tokens to buy (10 tokens)
    
        describe('Success', () => { // This section tests the successful purchase scenario
            // Set up a token purchase before each test
          beforeEach(async () => {
            // Setup: User1 buys 10 tokens by sending 10 ETH to the contract
            // The connect() method specifies which account is making the transaction
            transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) })
            result = await transaction.wait()
          })
    
          it('transfers tokens', async () => {
            // Test 1: Check that tokens were transferred correctly
              // Crowdsale contract should have 10 fewer tokens (999990 instead of 1000000)
            expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990))
              // User1 should now have 10 tokens in their wallet
              // Check that the user received tokens in exchange for their ETH
            expect(await token.balanceOf(user1.address)).to.equal(amount)
          })
    
          it('updates tokensSold', async () => { // <-- Check that the tokensSold variable is updated correctly
            // Test 2: Check that the contract's internal counter is updated
              // The tokensSold variable tracks how many tokens have been sold
            expect(await crowdsale.tokensSold()).to.equal(amount)
          })
    
          it('emits a buy event', async () => {
            // Test 3: Check that the contract emitted the correct event
              // Events are important for frontend applications and tracking activity
              // --> https://hardhat.org/hardhat-chai-matchers/docs/reference#.emit
            await expect(transaction).to.emit(crowdsale, "Buy") // <-- Emit buy event from crowdsale contract 
              .withArgs(amount, user1.address)// <-- Check that the event was emitted with the correct arguments
          })
        })
  
      describe('Failure', () => { // This section tests scenarios where the purchase should fail
  
        it('rejects insufficent ETH', async () => {
          // Test: Ensure the contract rejects purchases with insufficient ETH
            // Here we try to buy 10 tokens but send 0 ETH, which should fail
          await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted
        })
      })
    })

    // --- TEST CASE FOR SENDING ETH DIRECTLY TO THE CROWDSALE CONTRACT --- :
      // This tests the "fallback" or "receive" function that handles direct ETH transfers
    describe('Sending ETH', () => {
      let transaction, result
      let amount = ether(10)
  
      describe('Success', () => {
  
        beforeEach(async () => {
          // User1 sends ETH directly to the contract address (not calling a specific function)
          transaction = await user1.sendTransaction({ to: crowdsale.address, value: amount })
          result = await transaction.wait()
        })
  
        it('updates contracts ether balance', async () => {
        // Check that the contract's ETH balance increased by the amount sent
          expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
        })
  
        it('updates user token balance', async () => {
        // Check that the user received tokens in exchange for their ETH
        // The exchange rate is determined by the contract's price setting
          expect(await token.balanceOf(user1.address)).to.equal(amount)
        })
      })
    })
  
    // --- TEST CASE FOR UPDATING TOKEN PRICE --- :
      // Only the contract owner should be able to change the price
    describe('Updating Price', () => {
      let transaction, result
      let price = ether(2) // New price: 2 ETH per token
  
      describe('Success', () => {
  
        beforeEach(async () => {
        // The deployer (owner) updates the price to 2 ETH per token
          transaction = await crowdsale.connect(deployer).setPrice(ether(2))
          result = await transaction.wait() // Wait for transaction to be mined
        })
  
        it('updates the price', async () => {
        // Check that the price was updated correctly
          expect(await crowdsale.price()).to.equal(ether(2))
        })
      })
  
      describe('Failure', () => {
  
        it('prevents non-owner from updating price', async () => {
        // Check that a regular user (non-owner) cannot update the price
          // The transaction should be reverted (fail)
          await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted
        })
      })
    })

    // --- TEST CASE FOR FINALIZING CROWDSALE --- :
      // This is typically done when the sale ends or all tokens are sold
    describe('Finalzing Sale', () => {
      let transaction, result
      let amount = tokens(10) // 10 tokens to buy
      let value = ether(10) // 10 ETH to spend
  
      describe('Success', () => {
  
        beforeEach(async () => {
          // First, user1 buys some tokens
            // User1 buys 10 tokens for 10 ETH
          transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value })
          result = await transaction.wait()// Wait for transaction to be mined
  
          transaction = await crowdsale.connect(deployer).finalize()
          result = await transaction.wait()// Wait for transaction to be mined
        })
  
        it('transfers remaining tokens to owner', async () => {
          // Check that all remaining tokens were transferred to the owner
            // Check that the Crowdsale contract has 0 tokens left
            // The deployer (owner) should have the remaining tokens
          expect(await token.balanceOf(crowdsale.address)).to.equal(0)
          expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990))
        })
  
        it('transfers ETH balance to owner', async () => {
        // Check that all ETH collected was transferred to the owner
          expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(0)
        })
  
        it('emits Finalize event', async () => {
        // Check that the Finalize event was emitted with correct parameters
          // --> https://hardhat.org/hardhat-chai-matchers/docs/reference#.emit
          await expect(transaction).to.emit(crowdsale, "Finalize")
            .withArgs(amount, value)
        })
      })
  
      describe('Failure', () => {
  
        it('prevents non-owner from finalizing', async () => {
        // Check that a regular user (non-owner) cannot finalize the sale
          // The transaction should be reverted (fail)
          await expect(crowdsale.connect(user1).finalize()).to.be.reverted
        })
  
      })
    })
  })
  