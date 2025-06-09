const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Configuration/Token Properties
  const NAME = 'Dapp University'
  const SYMBOL = 'DAPPU'
  const MAX_SUPPLY = '1000000'
  const PRICE = hre.ethers.utils.parseUnits('0.025', 'ether')

  // Step 1: Deploy Token Contract
  console.log("Deploying Token contract...")
  const Token = await hre.ethers.getContractFactory("Token")
  const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
  await token.deployed()
  console.log(`Token deployed to: ${token.address}\n`)

  // Set the opening time to now (or slightly in the past)
  const openingTime = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
  
  // Set min and max contribution
  const minContribution = hre.ethers.utils.parseUnits('0.01', 'ether'); // 0.01 token minimum
  const maxContribution = hre.ethers.utils.parseUnits('10000', 'ether'); // 10000 tokens maximum

  // Step 2: Deploy Crowdsale Contract
  console.log("Deploying Crowdsale contract...")
  const Crowdsale = await hre.ethers.getContractFactory("Crowdsale")
  const crowdsale = await Crowdsale.deploy(
    token.address,
    PRICE,
    hre.ethers.utils.parseUnits(MAX_SUPPLY, 'ether'),
    openingTime,
    minContribution,
    maxContribution
  )
  await crowdsale.deployed();
  console.log(`Crowdsale deployed to: ${crowdsale.address}\n`)

  // Step 3: Transfer Tokens to Crowdsale Contract
  console.log("Transferring tokens to Crowdsale contract...")
  const transaction = await token.transfer(
    crowdsale.address, 
    hre.ethers.utils.parseUnits(MAX_SUPPLY, 'ether')
  )
  await transaction.wait()
  console.log(`Tokens transferred to Crowdsale\n`)
  console.log("Deployment complete! Token sale is now live.")

  // Step 4: Add Deployer to Whitelist:
  console.log("Adding deployer to whitelist...");
  const [deployer] = await ethers.getSigners();// Get the deployer's address
  const whitelistTx = await crowdsale.addToWhitelist(deployer.address);// Add the deployer to the whitelist
  await whitelistTx.wait();
  console.log(`Address ${deployer.address} added to whitelist\n`);

  // After adding the deployer to the whitelist, open the sale:
  console.log("Opening the token sale...");
  const openSaleTx = await crowdsale.openSale();
  await openSaleTx.wait();
  console.log("Token sale is now open!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed with error:");
    console.error(error);
    process.exitCode = 1;
  });

// ========= END OF DEPLOY.JS ==========
