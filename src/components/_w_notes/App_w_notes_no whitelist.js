// ========== APP.JS ==========

/* The main React component for our DApp to handle:
    Connecting to the Ethereum blockchain
    Loading smart contract data
    Displaying the user interface
    Managing the token purchase process */

import { useEffect, useState } from 'react'; // React hooks for state and lifecycle management
import { Container } from 'react-bootstrap'; // UI component from Bootstrap library
import { ethers } from 'ethers' // Library for interacting with Ethereum

// COMPONENTS: - the UI building blocks of our application
import Navigation from './Navigation'; // Navigation bar component
import Buy from './Buy'; // Component for buying tokens
import Progress from './Progress'; // Progress bar showing token sale status
import Info from './Info'; // Component showing account information
import Loading from './Loading'; // Loading spinner component
import Admin from './Admin'; // *** Add 'Admin' component for managing the crowdsale whitelist

// Artifacts - These are the compiled smart contract files
  // They contain the ABI (Application Binary Interface) which tells our app how to interact with the contracts
import CROWDSALE_ABI from '../abis/Crowdsale.json' // Crowdsale contract interface
import TOKEN_ABI from '../abis/Token.json' // Token contract interface

// Config - Contains network-specific addresses for our contracts
import config from '../config.json';

function App() {
  // ===== STATE VARIABLES: =====
    // These variables store data that can change and cause the UI to update
  
  // Blockchain connection states
  const [provider, setProvider] = useState(null)          // Connection to Ethereum network
  const [crowdsale, setCrowdsale] = useState(null)        // Crowdsale contract instance
  
  // User account states
  const [account, setAccount] = useState("")              // User's Ethereum address
    // Changed to empty string vs 'null' for better handling in the UI
      // account is used to display the user's address and balance
      // setAccount is used to update the account state when the user connects their wallet
  const [accountBalance, setAccountBalance] = useState(0) // User's token balance
  
  // Token sale states
  const [price, setPrice] = useState(0)                 // Price per token in ETH
  const [maxTokens, setMaxTokens] = useState(0)         // Total tokens available for sale
  const [tokensSold, setTokensSold] = useState(0)       // Number of tokens already sold
  
  // UI state
  const [isLoading, setIsLoading] = useState(true)      // Controls showing loading spinner

  // *** Add state for checking if user is owner
  const [isOwner, setIsOwner] = useState(false);

  // ===== BLOCKCHAIN CONNECTION FUNCTION =====
    // This function connects to the blockchain and loads all necessary data
  const loadBlockchainData = async () => {
    // ↓ Instantiate Provider - Connect to Ethereum via MetaMask or other web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum) // Creates a new provider instance
      // ↑ window.ethereum is injected by MetaMask allowing us to interact with the user's wallet and Ethereum network
    setProvider(provider)
    // ↑ Set the provider in the state so we can use it later
      console.log(provider) // Log the provider to the console for debugging
      // ↑ Check if the user has MetaMask installed and connected
        //console.log (`provider: ${provider}`)
      console.log(window.ethereum) // Log the injected web3 provider to the console for debugging
        //console.log (`window.ethereum: ${window.ethereum}`)

      // Check if MetaMask is installed:
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this DApp')
        return
      }

      // Request account access:
      await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
        
        // Check if MetaMask is connected:
        await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          alert('Please connect to MetaMask')
          return
        }

        // Check if MetaMask is connected to the correct network:
        await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== config[chainId].chainId) {
          alert('Please connect to the correct network')
          return
        }

    // Fetch the current network/chain ID to use the correct contract addresses
    const { chainId } = await provider.getNetwork()
    console.log (`chainId: ${chainId}`) // Log the chain ID to the console for debugging

    // Inititate contracts - Create JavaScript objects that represent our smart contracts
    const token = new ethers.Contract(
      config[chainId].token.address,     // Address of token contract on this network
      TOKEN_ABI,                         // ABI (interface) of the token contract
      provider                           // Connection to Ethereum
    )
    
    const crowdsale = new ethers.Contract(
      config[chainId].crowdsale.address, // Address of crowdsale contract
      CROWDSALE_ABI,                     // ABI (interface) of the crowdsale contract
      provider                           // Connection to Ethereum
    )
    setCrowdsale(crowdsale)

    // Request/fetch access to user's MetaMask account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0])  // Get the first account and format it
    setAccount(account)
    console.log (`account: ${account}`) // Log the user's account address to the console for debugging

    // *** Add check if the user is the owner of the crowdsale contract
      // This is used to determine if the user has admin privileges for whitelisting
    const owner = await crowdsale.owner();
    setIsOwner(account.toLowerCase() === owner.toLowerCase());
      //  ↑ Compare the user's account with the owner address from the crowdsale contract
    console.log(`isOwner: ${isOwner}`) // Log if the user is the owner
      // ↑ Log the owner status to the console for debugging
      // If the user is the owner, show the Admin component
    if (isOwner) {
      console.log('User is the owner of the crowdsale contract');
    } else {
      console.log('User is NOT the owner of the crowdsale contract');
    }
    
    // Get the user's token balance
    const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
    setAccountBalance(accountBalance)

    // Get token price from the crowdsale contract
    const price = ethers.utils.formatUnits(await crowdsale.price(), 18)
    setPrice(price)

    // Get maximum tokens available for sale
    const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18)
    setMaxTokens(maxTokens)

    // Get number of tokens already sold
    const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(), 18)
    setTokensSold(tokensSold)

    // Data loading complete, hide the loading spinner
    setIsLoading(false)
  }

  // ===== EFFECT HOOK =====
    // This runs when the component mounts or when 'isLoading' changes
      // It's like an automatic trigger for the 'loadBlockchainData' function
  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])  // The dependency array - effect runs when these values change

  // ===== USER INTERFACE =====
    // (What gets displayed on the webpage)
  return (
    <Container>
      {/* 'Navigation' component - bar always shows at the top */}
      <Navigation />

      <h1 className='my-4 text-center'>Introducing DApp Token!</h1>
      {/* ↑ h1 header with margin for spacing - centered title */}

      {/* 'Loading' component - conditional rendering - show loading spinner or main content */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Token price display */}
          <p className='text-center'><strong>Current Price:</strong> {price} ETH</p>
          
          {/* 'Buy component' - allows users to purchase tokens */}
          <Buy 
            provider={provider} 
            price={price} 
            crowdsale={crowdsale} 
            setIsLoading={setIsLoading} 
          />
          
          {/* 'Progress' component - bar showing token sale status */}
          <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
        </>
      )}

      <hr /> {/* Separator line for visual clarity */}

      {/* 'Info' component - only show account info (address & balance) if connected to an account - && checks truthiness and if present, then render */}
      {account && (
        <Info account={account} accountBalance={accountBalance} />
      )}

      {/* *** Add 'Admin' component - only show if user is the owner of the crowdsale contract */}
      {isOwner && (
        <Admin 
          provider={provider} 
          crowdsale={crowdsale} 
          setIsLoading={setIsLoading} 
        />
      )}
    {/* ↑ Admin component allows the owner to manage the whitelist */}

    </Container>
  );
}

export default App;  // Makes this component available for import in other files

// ========== END OF APP.JS ==========
