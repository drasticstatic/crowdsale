# deploy.js Documentation

## Overview
This script deploys two smart contracts to the blockchain:
1. A Token contract (ERC20 token)
2. A Crowdsale contract (for selling the tokens)

## What This Script Does
- Creates a new cryptocurrency token
- Sets up a crowdsale where people can buy this token
- Transfers all tokens to the crowdsale contract

## Configuration
The script uses these configurable parameters:
```javascript
const NAME = 'Dapp University'
const SYMBOL = 'DAPPU'
const MAX_SUPPLY = '1000000'
const PRICE = ethers.utils.parseUnits('0.025', 'ether')
```

## Deployment Steps

### Step 1: Deploy Token Contract
```javascript
const Token = await hre.ethers.getContractFactory("Token")
const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
await token.deployed()
```
This creates an ERC20 token with the specified name, symbol, and maximum supply.

### Step 2: Deploy Crowdsale Contract
```javascript
const Crowdsale = await hre.ethers.getContractFactory("Crowdsale")
const crowdsale = await Crowdsale.deploy(
  token.address,
  PRICE,
  ethers.utils.parseUnits(MAX_SUPPLY, 'ether')
)
await crowdsale.deployed()
```
This creates a Crowdsale contract that will sell the tokens at the specified price.

### Step 3: Transfer Tokens to Crowdsale Contract
```javascript
const transaction = await token.transfer(
  crowdsale.address, 
  ethers.utils.parseUnits(MAX_SUPPLY, 'ether')
)
await transaction.wait()
```
This transfers all tokens to the Crowdsale contract so they can be sold to buyers.

## How to Run This Script

### Local Development
```bash
npx hardhat run scripts/deploy.js --network localhost
```
This deploys the contracts to a local Ethereum network provided by Hardhat.

### Production Deployment
```bash
npx hardhat run scripts/deploy.js --network <network_name>
```
Replace `<network_name>` with the name of the network you want to deploy to (e.g., `rinkeby`, `mainnet`).

## Example Deployment Results
```
Token deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Crowdsale deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Tokens transferred to Crowdsale
Deployment complete! Token sale is now live.
```

## Error Handling
The script includes error handling to catch and display any issues during deployment:
```javascript
main().catch((error) => {
  console.error("Deployment failed with error:");
  console.error(error);
  process.exitCode = 1;
});
```

## Notes for Beginners
- This script needs to be run after your contracts are compiled
- The addresses generated will be different each time you deploy
- Save the addresses after deployment - you'll need them to interact with your contracts
- The token price is set in ETH (0.025 ETH per token in this example)
- All tokens are transferred to the crowdsale contract for selling