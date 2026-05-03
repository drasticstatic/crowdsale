import React, { useState, useEffect } from 'react';

// Chain IDs — update to match your deployment network
const REQUIRED_CHAIN_ID = '0xaa36a7'; // Sepolia Testnet (11155111)
// Hardhat local: '0x7a69' (31337) | Mainnet: '0x1'

function DAppGuard({ children }) {
  const [hasWallet, setHasWallet] = useState(null); // null = still checking
  const [correctNetwork, setCorrectNetwork] = useState(true);

  useEffect(() => {
    if (!window.ethereum) { setHasWallet(false); return; }
    setHasWallet(true);
    const checkNetwork = async () => {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setCorrectNetwork(chainId === REQUIRED_CHAIN_ID);
    };
    checkNetwork();
    window.ethereum.on('chainChanged', (id) => setCorrectNetwork(id === REQUIRED_CHAIN_ID));
  }, []);

  if (hasWallet === null) return null;

  return (
    <>
      {!hasWallet && (
        <div className="alert alert-warning text-center mb-0" role="alert" style={{ borderRadius: 0 }}>
          <strong>No wallet detected.</strong>{' '}
          Install <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> to
          interact.{' '}<em>Read-only mode — live data still loads via public RPC.</em>
        </div>
      )}
      {hasWallet && !correctNetwork && (
        <div className="alert alert-danger text-center mb-0" role="alert" style={{ borderRadius: 0 }}>
          <strong>Wrong network.</strong> Switch to <strong>Sepolia Testnet</strong> to interact.{' '}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={() =>
            window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: REQUIRED_CHAIN_ID }] })
            .catch(async (err) => {
              if (err.code === 4902) await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: REQUIRED_CHAIN_ID, chainName: 'Sepolia Test Network', rpcUrls: ['https://rpc.sepolia.org'], nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 }, blockExplorerUrls: ['https://sepolia.etherscan.io'] }] });
            })
          }>Switch to Sepolia</button>
        </div>
      )}
      {children}
    </>
  );
}

export default DAppGuard;
