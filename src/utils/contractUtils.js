import { JsonRpcProvider, BrowserProvider, Contract } from 'ethers';

// Add REACT_APP_INFURA_KEY to GitHub Secrets → Settings → Secrets → Actions
// Then restrict the key to https://drasticstatic.github.io in Infura dashboard.
const RPC_URL = process.env.REACT_APP_INFURA_KEY
  ? `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
  : 'https://rpc.sepolia.org'; // free public fallback (rate-limited)

/**
 * Best-available provider: BrowserProvider (wallet) → read+write
 *                          JsonRpcProvider (public RPC) → read-only
 * Usage: const contract = await getContract(config[chainId].dao.address, DAO_ABI);
 */
export const getContract = async (address, abi) => {
  const provider = window.ethereum ? new BrowserProvider(window.ethereum) : new JsonRpcProvider(RPC_URL);
  return new Contract(address, abi, provider);
};

export const getReadOnlyProvider = () => new JsonRpcProvider(RPC_URL);

/** Truncates 0x… addresses for display: 0x1234...abcd */
export const truncateAddress = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
