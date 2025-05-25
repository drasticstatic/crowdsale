const hre = require("hardhat");

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

  // Step 2: Deploy Crowdsale Contract
  console.log("Deploying Crowdsale contract...")
  const Crowdsale = await hre.ethers.getContractFactory("Crowdsale")
  const crowdsale = await Crowdsale.deploy(
    token.address,
    PRICE,
    hre.ethers.utils.parseUnits(MAX_SUPPLY, 'ether')
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
}

main().catch((error) => {
  console.error("Deployment failed with error:");
  console.error(error);
  process.exitCode = 1;
});