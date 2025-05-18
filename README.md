# Crowdsale Smart Contract Project

This project implements an Ethereum-based token crowdsale system using Hardhat. It includes:

- A custom ERC-20 compatible token contract
- A crowdsale contract for token distribution
- Comprehensive test suites

## Contracts

- **Token.sol**: ERC-20 compatible token with standard functionality
- **Crowdsale.sol**: Contract for selling tokens, with features for:
  - Direct ETH-to-token purchases
  - Owner-controlled price setting
  - Sale finalization with fund collection

## Testing

The project includes detailed test files:

```shell
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

## Development

```shell
# Start local Ethereum node
npx hardhat node

# Deploy using Hardhat Ignition
npx hardhat ignition deploy ./ignition/modules/Lock.js

# Get help with Hardhat commands
npx hardhat help
```

## Project Structure

- `/contracts`: Smart contract source code
- `/test`: Test files for contracts
- `/ignition`: Deployment modules