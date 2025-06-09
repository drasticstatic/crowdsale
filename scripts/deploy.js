const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Configuration/Token Properties
  const NAME = 'Dapp University'
  const SYMBOL = 'DAPPU'
  const MAX_SUPPLY = '1000000'
  const PRICE = hre.ethers.utils.parseUnits('0.025', 'ether')

  // Step 1: Deploy Token Contract
    console.log("");
  console.log("Deploying Token contract...")
  const Token = await hre.ethers.getContractFactory("Token")
  const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
  await token.deployed()
  console.log(`\u00A0✓ Token deployed to: ${token.address}\n`)

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
  console.log(`\u00A0✓ Crowdsale deployed to: ${crowdsale.address}\n`)

  // Step 3: Transfer Tokens to Crowdsale Contract
  console.log("Transferring tokens to Crowdsale contract...")
  const transaction = await token.transfer(
    crowdsale.address, 
    hre.ethers.utils.parseUnits(MAX_SUPPLY, 'ether')
  )
  await transaction.wait()
  console.log(`\u00A0✓ Tokens transferred to Crowdsale\n`)
  
  // Step 4: Add Deployer to Whitelist:
  console.log("Adding deployer to whitelist...");
  const [deployer] = await ethers.getSigners();// Get the deployer's address
  const whitelistTx = await crowdsale.addToWhitelist(deployer.address);// Add the deployer to the whitelist
  await whitelistTx.wait();
  console.log(`\u00A0✓ Address ${deployer.address} added to whitelist\n`);
  
  
  // After adding the deployer to the whitelist, open the sale:
  console.log("Open the token sale upon deployment...");
  const openSaleTx = await crowdsale.openSale();
  await openSaleTx.wait();
  console.log("\u00A0✓ Token sale = open!");
  // After opening the sale upon deployument, immediately close it :
  console.log("\u00A0\u00A0\u00A0& Immediately close sale");
  console.log("\u00A0\u00A0\u00A0to deploy the token sale closed by default");
  console.log("\u00A0\u00A0\u00A0for use of toggle in admin panel...");
  const closeSaleTx = await crowdsale.closeSale();
  await closeSaleTx.wait();
  console.log("");
  console.log(`Crowdsale sale open status now = ${await crowdsale.isOpen()}`);
  console.log("\u00A0✓ Token sale = CLOSED ✓");
    console.log("");
  console.log("✓✓✓ Deployment complete! ✓✓✓")
    console.log("");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error("Deployment failed with error:");
    console.error(error);
    process.exitCode = 1;
  });

// ========= END OF DEPLOY.JS ==========
