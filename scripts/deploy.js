// ========== DEPLOYMENT SCRIPT ==========
/* This script deploys two smart contracts to the blockchain:
    1. A Token contract (ERC20 token)
    2. A Crowdsale contract (for selling the tokens)
  
 * WHAT THIS SCRIPT DOES:
    - Creates a new cryptocurrency token
    - Sets up a crowdsale where people can buy this token
    - Transfers all tokens to the crowdsale contract
 */

/* Hardhat Runtime Environment required explicitly here
    This is optional but useful for running the script in a standalone fashion through `node <script>`.
    You can also run a script with `npx hardhat run <script>`
      If you do that, Hardhat will compile your contracts, add the Hardhat Runtime Environment's members to the global scope, and execute the script */
      const hre = require("hardhat");
      /* ↑ hre = Hardhat Runtime Environment
            ethers = Ethers.js library (included in hre)
            getContractFactory = Function to get a contract factory (used to deploy contracts) */
      
      /* HOW TO RUN THIS SCRIPT:
       ***** npx hardhat run scripts/deploy.js --network localhost *****
          ↑ This command runs the deploy.js script using Hardhat
          --network localhost = Specifies the network to use for deployment
            localhost = Local Ethereum network provided by Hardhat (for testing)
            local host is default if not specified
       
       * DEPLOYING TO A REAL NETWORK:
          If you want to deploy to a different network, specify the network name:
            npx hardhat run scripts/deploy.js --network <network_name>
            Example: npx hardhat run scripts/deploy.js --network rinkeby
       */
      
      /* EXAMPLE DEPLOYMENT RESULTS:
       * Token deployed to Hardhat: 0x5FbDB2315678afecb367f032d93F642f64180aa3
       * Crowdsale deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
       * Tokens transferred to Crowdsale 
       */
      
      async function main() {
        // ===== CONFIGURATION/TOKEN PROPERTIES =====
        const NAME = 'Dapp University'
        const SYMBOL = 'DAPPU'
        const MAX_SUPPLY = '1000000'
        const PRICE = ethers.utils.parseUnits('0.025', 'ether')
        // Price per token in ETH (0.025 ETH)
        // Reminder: parseUnits converts human-readable numbers to blockchain format
      
        // ===== STEP 1: DEPLOY TOKEN CONTRACT =====
        console.log("Deploying Token contract...")
        const Token = await hre.ethers.getContractFactory("Token")  // Fetch the Token contract code to be deployed
        // Note ↑ hre.ethers
          // vs: const Token = await ethers.getContractFactory("Token") used in other projects
        const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY) //Deploy the Token with its constructor parameters
        await token.deployed() // Wait for the deployment transaction to be confirmed on the blockchain
      
        // The token contract is deployed to the local Ethereum network provided by Hardhat
        // Print address of the deployed contract to the console:
        console.log(`Token deployed to: ${token.address}\n`)
        /* ↑ back ticks are used to create a template string
            ${token.address} is a javascript expression that will be replaced with the value of token.address
            '\n' is a newline character that will be replaced with a new line */
      
        // ===== STEP 2: DEPLOY CROWDSALE CONTRACT =====
        console.log("Deploying Crowdsale contract...")
        const Crowdsale = await hre.ethers.getContractFactory("Crowdsale")  // Fetch the Crowdsale contract code to be deployed
        const crowdsale = await Crowdsale.deploy( // Deploy the Crowdsale with its constructor parameters
          token.address,   // Address of the token contract we just deployed
          PRICE,   // Price per token in ETH
          ethers.utils.parseUnits(MAX_SUPPLY, 'ether')  //MAX_SUPPLY converted to wei (the smallest ETH unit) - Total tokens available for sale
      
        )
        await crowdsale.deployed();// Wait for the deployment transaction to be confirmed
      
        console.log(`Crowdsale deployed to: ${crowdsale.address}\n`)
      
        // ===== STEP 3: TRANSFER TOKENS TO CROWDSALE CONTRACT =====
        console.log("Transferring tokens to Crowdsale contract...")
        // Send all tokens from the deployer's account to the crowdsale contract
        // The crowdsale contract will then sell these tokens to buyers
        const transaction = await token.transfer(
          crowdsale.address, 
          ethers.utils.parseUnits(MAX_SUPPLY, 'ether')
        )
        
        await transaction.wait()  // Wait for the transfer transaction to be confirmed
      
        console.log(`Tokens transferred to Crowdsale\n`)
        console.log("Deployment complete! Token sale is now live.") // :-)
      }
      
      // ===== ERROR HANDLING =====
      // This pattern allows us to use async/await and properly handle any errors
      main().catch((error) => {
        console.error("Deployment failed with error:");
        console.error(error);
        process.exitCode = 1;  // Exit with error code
      });
      
      /* Alternative way to handle the main function:
      main()
        .then(() => process.exit(0))
          ↑ = Exit process with success
              Is unnecessary in modern versions of Node.js application
              Removing it will not affect the functionality of the script
              The process will exit automatically when the script finishes execution but is a good practice to include it to ensure that the process exits cleanly
                and does not hang indefinitely if there are any pending asynchronous operations or open file descriptors that need to be closed before exiting
        .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      }); */
// ========== END OF DEPLOYMENT SCRIPT ==========
