# Crowdsale Smart Contract Project

This project implements an Ethereum-based token crowdsale system using Hardhat. It includes:

- A custom ERC-20 compatible token contract
- A crowdsale contract for token distribution
- Comprehensive test suites

## 🔰 Beginner's Guide

**A crowdsale** or fundraising campaign where people can send Ethereum (ETH) to buy custom tokens. Like selling concert tickets for money.

**Key concepts:**
- **Token**: A digital asset on the blockchain (like a digital coin or ticket)
- **Smart Contract**: Code that automatically executes when certain conditions are met
- **ETH**: The cryptocurrency used on Ethereum blockchain
- **Gas**: Small fee paid to process transactions on Ethereum

**How this project works:**
1. Deploy the Token contract to create your custom token
2. Deploy the Crowdsale contract that will sell these tokens
3. Users send ETH to the Crowdsale contract and receive tokens in return
4. The owner can change the price or end the sale when ready

## Contracts

- **Token.sol**: ERC-20 compatible token with standard functionality

- **Crowdsale.sol**: Contract for selling tokens, with features for:
  - Direct ETH-to-token purchases
  - Owner-controlled price setting
  - Sale finalization with fund collection
  - *For beginners*: This is the "store" that sells your tokens and collects the ETH

## Testing

The project includes detailed test files:

```shell
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

*For beginners*: Tests make sure your contracts work correctly before deploying them to the real blockchain. Running tests is like checking if your program has any bugs.

## Development

```shell
# Start local Ethereum node (creates a test blockchain on your computer)
npx hardhat node

# Deploy using Hardhat Ignition
npx hardhat ignition deploy ./ignition/modules/Lock.js

# Get help with Hardhat commands
npx hardhat help
```

*For beginners*: These commands help you develop and test your contracts locally before spending real ETH to deploy them on the main Ethereum network.

## Project Structure

- `/contracts`: Smart contract source code (the actual programs that run on the blockchain)
- `/test`: Test files for contracts (code that checks if your contracts work correctly)
- `/ignition`: Deployment modules (helps put your contracts on the blockchain)