require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
};

/* When configuring/setting up METAMASK, use the following settings:
  - Network Name: Localhost
  - Default RPC URL: http://""
    - After `npx hardhat node` "Started HTTP and WebSocket JSON-RPC server at http://..."
      -Ex: http://127.0.0.1:8545/
  - Chain ID: 31337
    - ↑ This is the default chain ID for Hardhat
      - Chain ID 1 = Ethereum Mainnet
  - Currency Symbol: ETH
  - Block Explorer URL: http://
  
  - Add a custom token:
    - Token Contract Address: 0x...
    - Token Symbol: DAPPU
    - Token Decimals: 18 */
