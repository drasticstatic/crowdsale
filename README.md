# Crowdsale Smart Contract Project

This project implements an Ethereum-based token crowdsale system using Hardhat and React. It includes:

- A custom ERC-20 compatible token contract
- A crowdsale contract for token distribution
- React frontend for interacting with the contracts
- Comprehensive test suites and documentation

## 🔰 Beginner's Guide

**A crowdsale** is a fundraising campaign where people can send Ethereum (ETH) to buy custom tokens. Like selling concert tickets for money.

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

## Smart Contracts

- **Token.sol**: ERC-20 compatible token with standard functionality

- **Crowdsale.sol**: Contract for selling tokens, with features for:
  - Direct ETH-to-token purchases
  - Owner-controlled price setting
  - Sale finalization with fund collection

## Frontend Components

The React frontend includes several components:

- **App.js**: Main component that connects to the blockchain and manages state
- **Buy.js**: Form for purchasing tokens with ETH
- **Progress.js**: Visual progress bar showing token sale status
- **Info.js**: Displays user account and token balance
- **Navigation.js**: Header with app logo and name
- **Loading.js**: Loading spinner shown during blockchain operations

## Documentation

Each component has detailed documentation in its own README file:

- **README_App.js.md**: Main application component documentation
- **README_Buy.js.md**: Token purchase form documentation
- **README_Progress.js.md**: Progress bar documentation
- **README_Info.js.md**: Account info component documentation
- **README_Navigation.js.md**: Navigation bar documentation
- **README_Loading.js.md**: Loading spinner documentation

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

# Deploy using Hardhat
npx hardhat run scripts/deploy.js --network localhost

# Start the React frontend
npm run start

# Get help with Hardhat commands
npx hardhat help
```

*For beginners*: These commands help you develop and test your contracts locally before spending real ETH to deploy them on the main Ethereum network.

## Project Structure

- `/contracts`: Smart contract source code (the actual programs that run on the blockchain)
- `/test`: Test files for contracts (code that checks if your contracts work correctly)
- `/src`: React frontend source code
  - `/components`: React UI components
  - `/abis`: Contract ABIs (interfaces for interacting with contracts)
- `/scripts`: Deployment modules (helps put your contracts on the blockchain)
<em>'scripts' are sometimes referred to as 'ignitition modules'</em>

## Common Questions for Beginners

- **Do I need real ETH to test this?** No, Hardhat creates a simulated blockchain, but will need Seoplia ETH for testing
- **What is Hardhat?** A development environment to compile, deploy, test, and debug Ethereum software
- **What happens when someone buys tokens?** They send ETH to the contract and automatically receive your tokens in return
- **Can I modify the code?** Yes! This is a template you can customize for your own token sale