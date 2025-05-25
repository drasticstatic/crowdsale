import { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Buy from './Buy';
import Progress from './Progress';
import Info from './Info';
import Loading from './Loading';

// Artifacts
import CROWDSALE_ABI from '../abis/Crowdsale.json'
import TOKEN_ABI from '../abis/Token.json'

// Config
import config from '../config.json';

function App() {
  const configRef = useRef(config)
  const tokenAbiRef = useRef(TOKEN_ABI)
  const crowdsaleAbiRef = useRef(CROWDSALE_ABI)
  const ethersRef = useRef(ethers)
  const ethereumRef = useRef();
  
  useEffect(() => {
    ethereumRef.current = window.ethereum;
  }, []);

  const [provider, setProvider] = useState(null)
  const [crowdsale, setCrowdsale] = useState(null)
  const [account, setAccount] = useState("")
  const [accountBalance, setAccountBalance] = useState(0)
  const [price, setPrice] = useState(0)
  const [maxTokens, setMaxTokens] = useState(0)
  const [tokensSold, setTokensSold] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    try{
      if (typeof ethereumRef.current === 'undefined') {
        alert('Please install MetaMask to use this DApp')
        setIsLoading(false)
        return
      }
      
      await ethereumRef.current.request({ 
        method: 'eth_requestAccounts' 
      })

      const provider = new ethersRef.current.providers.Web3Provider(ethereumRef.current)
      setProvider(provider)

      async function checkMetaMaskConnection() {
        const accounts = await ethereumRef.current.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          alert('Please connect to MetaMask');
          return;
        }
      }
      await checkMetaMaskConnection();

      const network = await provider.getNetwork()
      const chainId = network.chainId
      console.log(`chainId: ${chainId}`)

      let configKey = chainId.toString();
      if (chainId === 31337 && configRef.current.localDevelopmentNetwork) {
        configKey = "localDevelopmentNetwork";
      }

      if (!configRef.current[configKey]) {
        console.error(`Network configuration not found for chain ID ${chainId}`);
        alert(`Unsupported network. Please connect to a supported network.`);
        setIsLoading(false);
        return;
      }

      const ethereumChainId = await ethereumRef.current.request({ method: 'eth_chainId' });
      const decimalChainId = parseInt(ethereumChainId, 16).toString();
      
      if (!configRef.current[decimalChainId]) {
        console.log(`Network ${decimalChainId} not found in config. Using 'localDevelopmentNetwork'.`);
      }
      
      if (chainId !== parseInt(decimalChainId)) {
        alert('Please connect to the correct network');
        return;
      }
      
      console.log("Available networks in config:", Object.keys(configRef.current));
      await checkMetaMaskConnection();

      let tokenAddress = configRef.current[configKey].token.address;
      let crowdsaleAddress = configRef.current[configKey].crowdsale.address;
      
      if (tokenAddress === "$TOKEN_ADDRESS" || tokenAddress.includes("$")) {
        console.log("Using hardcoded token address for local development");
        tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      }
      if (crowdsaleAddress === "$CROWDSALE_ADDRESS" || crowdsaleAddress.includes("$")) {
        console.log("Using hardcoded crowdsale address for local development");
        crowdsaleAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      }

      const token = new ethersRef.current.Contract(tokenAddress, tokenAbiRef.current, provider)
      const crowdsale = new ethersRef.current.Contract(crowdsaleAddress, crowdsaleAbiRef.current, provider)
      setCrowdsale(crowdsale)

      const accounts = await ethereumRef.current.request({ method: 'eth_requestAccounts' });
      const account = ethersRef.current.utils.getAddress(accounts[0])
      setAccount(account)

      const accountBalance = ethersRef.current.utils.formatUnits(await token.balanceOf(account), 18)
      setAccountBalance(accountBalance)

      const price = ethersRef.current.utils.formatUnits(await crowdsale.price(), 18)
      setPrice(price)

      const maxTokens = ethersRef.current.utils.formatUnits(await crowdsale.maxTokens(), 18)
      setMaxTokens(maxTokens)

      const tokensSold = ethersRef.current.utils.formatUnits(await crowdsale.tokensSold(), 18)
      setTokensSold(tokensSold)

      setIsLoading(false)

    } catch (error) {
      console.error("An error occurred while loading blockchain data:", error);
      alert("Failed to load blockchain data. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading])

  return (
    <Container>
      <Navigation />

      <h1 className='my-4 text-center'>Introducing DApp Token!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'><strong>Current Price:</strong> {price} ETH</p>
          <Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} />
          <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
        </>
      )}

      <hr />

      {account && (
        <Info account={account} accountBalance={accountBalance} />
      )}
    </Container>
  );
}

export default App;