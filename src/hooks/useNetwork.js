import { useState, useEffect } from 'react';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111

export function useNetwork() {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: SEPOLIA_CHAIN_ID }] });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: SEPOLIA_CHAIN_ID, chainName: 'Sepolia Test Network', rpcUrls: ['https://rpc.sepolia.org'], nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 }, blockExplorerUrls: ['https://sepolia.etherscan.io'] }] });
      }
    }
  };

  useEffect(() => {
    const check = async () => {
      if (!window.ethereum) return;
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
    };
    check();
    if (window.ethereum) window.ethereum.on('chainChanged', (id) => setIsCorrectNetwork(id === SEPOLIA_CHAIN_ID));
  }, []);

  return { isCorrectNetwork, switchNetwork };
}
