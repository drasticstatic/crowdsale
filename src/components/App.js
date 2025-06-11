// ========== APP.JS ==========

/* The main React component for our DApp to handle:
    Connecting to the Ethereum blockchain
    Loading smart contract data
    Displaying the user interface
    Managing the token purchase process */

        /* *** = Addeded Whitelist functionality:
        - Required that investors get whitelisted to buy tokens
        - Stores whitelisted users in smart contract
        - Created function to allow only owner via Admin.js to manage whitelist
          - Add/Remove investors to the whitelist from a user interface
          - Added a script to deploy with addresses to the whitelist
          - Added a toggle button to enable/disable the whitelist feature
            The toggle button is supposed to control whether the whitelist feature is active or not
              When the whitelist is enabled:
              -Only addresses that have been added to the whitelist can buy tokens
              -Non-whitelisted addresses will be rejected when they try to purchase tokens
              When the whitelist is disabled/paused:
              -Anyone can buy tokens, regardless of whether they're on the whitelist or not
              -The whitelist still exists, but it's not being checked during purchases*/

    // Note: When making changes to contracts, make sure to update the ABIs in frontend (copy from /artifacts... after deployment)

import { useEffect, useState, useCallback, useRef } from 'react'; // React hooks for state and lifecycle management
import { Container, Modal, Button } from 'react-bootstrap'; // UI component from Bootstrap library
import { ethers } from 'ethers' // Library for interacting with Ethereum

// COMPONENTS: - the UI building blocks of our application
import Navigation from './Navigation'; // Navigation bar component
//import Buy from './Buy'; // Component for buying tokens
//import Progress from './Progress'; // Progress bar showing token sale status
import Info from './Info'; // Component showing account information
//import Loading from './Loading'; // Loading spinner component
import Admin from './Admin'; // *** Add 'Admin' component for managing the crowdsale whitelist
import TransactionLedger from './TransactionLedger';

// Artifacts - These are the compiled smart contract files
  // They contain the ABI (Application Binary Interface) which tells our app how to interact with the contracts
import CROWDSALE_ABI from '../abis/Crowdsale.json' // Crowdsale contract interface
import TOKEN_ABI from '../abis/Token.json' // Token contract interface

// Config - Contains network-specific addresses for our contracts
import config from '../config.json';

import './DarkMode.css';
import './Animations&Style.css'

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
  const [whitelistEnabled, setWhitelistEnabled] = useState(null) // Whether the whitelist is enabled or not

  const [isOpen, setIsOpen] = useState(false); // Whether the crowdsale is open or not
  const [openingTime, setOpeningTime] = useState(0); // Opening time of the crowdsale
  const [minContribution, setMinContribution] = useState(0); // Minimum contribution per transaction
  const [maxContribution, setMaxContribution] = useState(0); // Maximum contribution per transaction
  const isInitialMount = useRef(true); // Ref to track initial mount to prevent unnecessary reloads ESlint dependency array [account, checkOwnerStatus, isConnected] in finally block
  
  // UI state
  const [darkMode, setDarkMode] = useState(() => {
    // Load from localStorage or default to false
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });
  // Create a function to update darkMode that also saves to localStorage
  const toggleDarkMode = (value) => {
    setDarkMode(value);
    localStorage.setItem('darkMode', value);
  };

  const [isLoading, setIsLoading] = useState(true)      // Controls showing loading spinner

  // Add state for modals
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false) // Whether the user is connected to MetaMask
  const [showWhitelistCheckModal, setShowWhitelistCheckModal] = useState(false);
  const [whitelistCheckResult, setWhitelistCheckResult] = useState(null);

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed FIRST
      if (typeof window.ethereum === 'undefined') {
        // === strict equality check (type and value)
        alert('\n Please install MetaMask to use this DApp');// If not, alert the user to install it
        return;
      }

      // Add a small delay to ensure MetaMask is ready
      //await new Promise(resolve => setTimeout(resolve, 100));
  
      // Request/fetch access to user's MetaMask account AFTER creating the provider
        // This will prompt the user to connect their wallet if not already connected
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
      // Check if MetaMask is connected:
      if (accounts.length === 0) {
        alert('\n No accounts found.\n   Please connect to MetaMask.');
        setIsConnected(false); // Set connection state to false if no accounts found
        setIsLoading(false) // Stop loading state if no accounts found
        return
      }
      if (accounts.length > 0) {
        setIsConnected(true);  // Make sure this is called to remove 'Connect Wallet' button
        //setIsLoading(true);
        loadBlockchainData(); // Directly call loadBlockchainData instead
      }
      
      setIsConnected(true);
      setIsLoading(true); // This will trigger loadBlockchainData
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("\n Please connect to MetaMask to use this application");
      setIsLoading(false) // Stop loading state if no accounts found
      return
    }
  };

  const disconnectWallet = async () => {
    try {
      // MetaMask doesn't have a disconnect method, so we'll handle it in our app state
      setIsConnected(false);
      setAccount("");
      setAccountBalance(0);
      setIsOwner(false);
      setCrowdsale(null);
      setProvider(null);
      
      // Clear any cached connection data
      localStorage.removeItem('isWalletConnected');
      
      console.log("Wallet disconnected from application");
      
      // Optional: Show a message to the user about how to fully disconnect in MetaMask
      //alert("\n Disconnected from app.\n Note:  To fully disconnect from MetaMask, \n    use the MetaMask extension itself.");
      // Show modal instead of alert
      setShowDisconnectModal(true);
      
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };
  /* ↑ MetaMask doesn't have a direct "disconnect" API. Instead,
  This approach:
    Resets all the state variables related to the wallet connection
    Removes any stored connection data from localStorage
    Informs the user that they've been disconnected from the app
    Explains that to fully disconnect from MetaMask, they need to use the MetaMask extension
  Since MetaMask doesn't provide a programmatic way to fully disconnect*/
  
  // *** Add state for checking if user is owner
  const [isOwner, setIsOwner] = useState(false);

  const checkOwnerStatus = useCallback(async () => {
    try {
      if (crowdsale && account) {
        console.log("Checking owner status for account:", account);
        const owner = await crowdsale.owner();
        console.log("Contract owner:", owner);
        const isCurrentUserOwner = account.toLowerCase() === owner.toLowerCase();
        console.log("Is current user owner?", isCurrentUserOwner);
        setIsOwner(isCurrentUserOwner);
        return {
          isOwner: isCurrentUserOwner,
          account: account,
          owner: owner
        };
      } else {
        return {
          isOwner: false,
          account: account || 'Not connected',
          owner: crowdsale ? await crowdsale.owner() : 'Contract not loaded'
        };
      }
    } catch (error) {
      console.error("Error checking owner status:", error);
      return {
        isOwner: false,
        account: account || 'Not connected',
        owner: 'Error fetching owner'
      };
    }
  }, [account, crowdsale]);

  // ===== BLOCKCHAIN CONNECTION FUNCTION =====
    // This function connxects to the blockchain and loads all necessary data
  const loadBlockchainData = useCallback(async () => {
    console.log("Loading blockchain data...");
    try {        
      // ↓ Instantiate Provider AFTER reuesting accounts to connect to Ethereum via MetaMask or other web3 provider
      const provider = new ethers.providers.Web3Provider(window.ethereum) // Creates a new provider instance
      // ↑ window.ethereum is injected by MetaMask allowing us to interact with the user's wallet and Ethereum network
      setProvider(provider)
      // ↑ Set the provider in the state so we can use it later
      console.log(provider) // Log the provider to the console for debugging
      // ↑ Check if the user has MetaMask installed and connected
        //console.log (`provider: ${provider}`)
      console.log(window.ethereum) // Log the injected web3 provider to the console for debugging
        //console.log (`window.ethereum: ${window.ethereum}`)

      // Get accounts - should already be connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const account = ethers.utils.getAddress(accounts[0])  // Get the first account and format it
      setAccount(account)
      console.log (`account: ${account}`) // Log the user's account address to the console for debugging
      
      // Fetch the current network/chain ID to use the correct contract addresses
        const { chainId } = await provider.getNetwork()
        console.log (`chainId: ${chainId}`) // Log the chain ID to the console for debugging

        console.log("Config:", JSON.stringify(config));
        console.log("ChainId:", chainId);
        console.log("Config for chainId:", config[chainId]);
        if (config[chainId]) {
          console.log("Token config:", config[chainId].token);
          console.log("Token address:", config[chainId].token?.address);
          console.log("Crowdsale config:", config[chainId].crowdsale);
          console.log("Crowdsale address:", config[chainId].crowdsale?.address);
}
        let configKey = chainId.toString();        
        // Use 'localDevelopmentNetwork' for chainId 31337
        /*let configKey = "localDevelopmentNetwork";
        if (chainId !== 31337) {
          configKey = chainId.toString();
        }*/
        // !== strict inequality check (type and value)
        
        // Reverted to using chainId as string
        // Placeholders like ${TOKEN_ADDRESS} & ${CROWDSALE_ADDRESS} in config.json became problematic
        // when using the config in a React app, because they are not replaced with actual values
        // This is because React does not process template literals in JSON files- they're just treated as regular strings
        // Instead, we use the chainId directly as a string to access the config object 
        // This also allows us to use the same config for both local and test networks
        console.log(`Using config key: ${configKey}`);

        // Check if this network exists in config
        if (!config[configKey]) {
          console.error(`\n Network configuration not found for chain ID ${chainId}`);
          alert(`\n Unsupported network (${chainId}).\n   Please connect to a supported network.`);
          setIsLoading(false);
          return;
        }
        // Check if token address exists
        if (!config[configKey].token || !config[configKey].token.address) {
          console.error(`\n Token address not found for chain ID ${chainId}`);
          alert(`\n Token configuration missing for this network.\n   Please check your config.`);
          setIsLoading(false);
          return;
        }
        // Check if crowdsale address exists
        if (!config[configKey].crowdsale || !config[configKey].crowdsale.address) {
          console.error(`\n Crowdsale address not found for chain ID ${chainId}`);
          alert(`\n Crowdsale configuration missing for this network.\n   Please check your config.`);
          setIsLoading(false);
          return;
        }
      
      // Check if MetaMask is connected to the correct network:
      /*await window.ethereum.request({ method: 'eth_chainId' });
      if (configKey !== config[configKey].configKey) {
        alert('\n Please connect to the correct network')
        return
      }*/

      // Check if MetaMask is connected to the correct network:
      const ethereumChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const decimalChainId = parseInt(ethereumChainId, 16);
      if (chainId !== decimalChainId) {
        alert(`\n Please connect to the correct network.\n   Expected: ${chainId}, Got: ${decimalChainId}`);
        return;
      }

      // Inititate contracts - Create JavaScript objects that represent our smart contracts
      //try {
        if (!config[configKey] || !config[configKey].token || !config[configKey].token.address) {
          throw new Error(`Missing token configuration for chainId ${chainId}`);
        }
      
          const token = new ethers.Contract(
            config[configKey].token.address,     // Address of token contract on this network
            TOKEN_ABI,                         // ABI (interface) of the token contract
            provider                           // Connection to Ethereum
          )
          console.log("Token loaded:", token.address);

        if (!config[configKey].crowdsale || !config[configKey].crowdsale.address) {
          throw new Error(`Missing crowdsale configuration for chainId ${chainId}`);
        }
        
          const crowdsale = new ethers.Contract(
            config[configKey].crowdsale.address, // Address of crowdsale contract
            CROWDSALE_ABI,                     // ABI (interface) of the crowdsale contract
            provider                           // Connection to Ethereum
          )

      /*} catch (error) {
        console.error("Contract initialization error:", error);
        setIsLoading(false);
        return;
      }*/

      setCrowdsale(crowdsale)
      console.log(`crowdsale: ${crowdsale}`) // Log the crowdsale contract instance to the console for debugging
      await checkOwnerStatus();// Check owner status

      // *** Add check if the user is the owner of the crowdsale contract
        // This is used to determine if the user has admin privileges for whitelisting
      try {
        const owner = await crowdsale.owner();
        console.log("Contract owner:", owner);
        console.log("Current account:", account);
        setIsOwner(account.toLowerCase() === owner.toLowerCase());
          //  ↑ Compare the user's account with the owner address from the crowdsale contract in lowercase format
        const isCurrentUserOwner = account.toLowerCase() === owner.toLowerCase();
        setIsOwner(isCurrentUserOwner);// Added after wallet connect useEffect caused Admin panel not to display
        console.log(`isOwner: ${isCurrentUserOwner}`);// Log if the user is the owner
        // ↑ Log the owner status to the console for debugging
        // If the user is the owner, show the Admin component
        if (isCurrentUserOwner) {
          console.log('User IS the owner of the crowdsale contract');
        } else {
          console.log('User is NOT the owner of the crowdsale contract');
        }
      } catch (error) {
        console.error("Error checking owner status:", error);
        setIsOwner(false);
      }
      
      // Add null checks before accessing contract properties
      if (crowdsale) {
        // Fetch state of whitelist from the crowdsale contract
        try {
          const whitelistStatus = await crowdsale.whitelistEnabled();
          setWhitelistEnabled(whitelistStatus);
          console.log(`Whitelist enabled: ${whitelistStatus}`);
        } catch (error) {
          console.error("Error fetching whitelist status:", error);
        }

        // Get the user's token balance
        try {
          const price = ethers.utils.formatUnits(await crowdsale.price(), 18);
          setPrice(price);
        } catch (error) {
          console.error("Error fetching price:", error);
        }

        // Get token price from the crowdsale contract
        try {
          const price = ethers.utils.formatUnits(await crowdsale.price(), 18);
          setPrice(price);
        } catch (error) {
          console.error("Error fetching price:", error);
        }

        // Get maximum tokens available for sale
        try {
          const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18);
          setMaxTokens(maxTokens);
        } catch (error) {
          console.error("Error fetching maxTokens:", error);
        }

        // Get number of tokens already sold
        try {
          const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(), 18);
          setTokensSold(tokensSold);
        } catch (error) {
          console.error("Error fetching tokensSold:", error);
        }

        try {
          const isOpen = await crowdsale.isOpen();
          console.log(`isOpen: ${isOpen}`);
          setIsOpen(isOpen);
        } catch (error) {
          console.error("Error fetching isOpen:", error);
          setIsOpen(false); // Default to closed if error
        }
    
        try {
          const openingTime = await crowdsale.openingTime();
          setOpeningTime(openingTime.toString());
        } catch (error) {
          console.error("Error fetching openingTime:", error);
          setOpeningTime("0"); // Default to 0 if error
        }
    
        try {
          const minContribution = await crowdsale.minContribution();
          setMinContribution(ethers.utils.formatUnits(minContribution, 18));
        } catch (error) {
          console.error("Error fetching minContribution:", error);
          setMinContribution("0"); // Default to 0 if error
        }
    
        try {
          const maxContribution = await crowdsale.maxContribution();
          setMaxContribution(ethers.utils.formatUnits(maxContribution, 18));
        } catch (error) {
          console.error("Error fetching maxContribution:", error);
          setMaxContribution("0"); // Default to 0 if error
        }
      }
      
  } catch (error) {
    // This catches any error during the connection process
    console.error("Error:", error);
    // Check if the user is connected to MetaMask
    if (!isConnected || !account) {
      console.log("User not connected to MetaMask");
      setIsConnected(false);
      setIsLoading(false);
      // Don't show an error alert, just let the UI show the connect button
    } else {
      // For other errors, show a more specific message
      if (error.message.includes("invalid address")) {
        alert("\n Please connect your wallet to continue");
      } else if (error.message.includes("network")) {
        alert("\n Please check your network connection & Try again");
      } else {
        alert("\n Something went wrong.\n   Please try reconnecting your wallet");
      }
      console.log("Blockchain data loading complete");
      setIsLoading(false);
    }
    return;
  } finally {
    // This code always runs, regardless of whether there was an error
    console.log("Blockchain data loading complete - finally block");
    setIsLoading(false); // Always set loading to false when done
  }
  }
    //console.error("Blockchain data loading failed:", error);
    //setIsLoading(false); // Data loading complete, hide the loading spinner
  , [account, checkOwnerStatus, isConnected]); // useCallback to memoize the function so it doesn't change on every render
  // ↑ useCallback is used to prevent unnecessary re-renders of the component
    // The empty dependency array means this function will only run once when the component mounts
    // Since this function does not depend on any state or props and only runs once, we can safely use it in the useEffect hook without causing an infinite loop

  // ===== EFFECT HOOK =====
    // This runs when the component mounts or when 'isLoading' changes
      // It's like an automatic trigger for the 'loadBlockchainData' function
  useEffect(() => {
    if (isLoading && window.ethereum) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        console.log("Initial loading of blockchain data...");
        loadBlockchainData().catch(error => {
          console.error('Error loading blockchain data:', error)
          setIsLoading(false)
        });
      } else if (account) { // Only reload if account is available
        console.log("Reloading blockchain data due to dependency change...");
        loadBlockchainData().catch(error => {
          console.error('Error loading blockchain data:', error) // Stop loading if there's an error
        });
      }
    }
  }, [isLoading, loadBlockchainData, account]);  // The dependency array - effect runs when these values change

  // Event listeners for MetaMask account changes:
  useEffect(() => {
    if (window.ethereum) {
      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setIsLoading(true);
        } else {
          setIsConnected(false);
          setAccount("");
          setIsOwner(false);
        }
      });
      // Handle chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    return () => {
      // Clean up listeners when component unmounts
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Effect to automatically reset the loading state
  useEffect(() => {
    if (isLoading) {
      console.log("Loading state activated");
      const timer = setTimeout(() => {
        console.log("Auto-resetting loading state after timeout");
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // To prevent wallet connect button from NOT showing "connected" status when connected=true
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            console.log("Already connected to account:", accounts[0]);
            const connectedAccount = ethers.utils.getAddress(accounts[0]);
            setAccount(connectedAccount);
            setIsConnected(true);
            /*if (!isLoading) {
              setIsLoading(true); // Only trigger loadBlockchainData if not already loading
            }*///had to remove this to avoid loading loop
          } else {
            console.log("No connected accounts found");
            setIsConnected(false);
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };
    checkConnection();
  }, [isLoading]);

  // Dark Mode L/R margins useEffect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);


  // ===== USER INTERFACE =====
    // (What gets displayed on the webpage)
  return (
    <Container style={{ 
      paddingTop: '355px',
      backgroundColor: darkMode ? '#121212' : 'white',
      color: darkMode ? 'white' : 'black',
      minHeight: '100vh',
      transition: 'background-color 0.5s, color 1.0s'
    }}
  >
      {/* 'Navigation' component - bar always shows at the top */}
      {/* padding to the top of content so it's not hidden behind the frozen navbar */}      
      <Navigation 
        account={account} 
        isConnected={isConnected} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet}
        setAppIsLoading={setIsLoading} // Pass the App's setIsLoading function
        checkOwnerStatus={checkOwnerStatus}
        price={price}
        provider={provider}
        crowdsale={crowdsale}
        setIsLoading={setIsLoading}
        maxTokens={maxTokens}
        tokensSold={tokensSold}
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        isOpen={isOpen}
        openingTime={openingTime}
        minContribution={minContribution}
        maxContribution={maxContribution}
      />
      <h3 className="text-center mb-3">
      <br/>
      <br/>
      <h4 className="text-center mb-3">Introducing:</h4>
      <span className="bounce-horizontal" style={{ 
          display: 'inline-block',
          background: 'linear-gradient(45deg,rgb(83, 200, 255),rgb(254, 107, 225))',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '17px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          marginBottom: '10px'
        }}>
          <big>🚀</big> A Learning-by-Doing Crypto Asset! <big>🚀</big>
        </span>
        <br/>        
      </h3>
      {/* ↑ h3 header with margin for spacing - centered title */}

          {/* 'Cancel Loading' button - only show if loading is in progress */}
          <div className="text-center mb-3">
            {isLoading && (
              <button 
                className="btn btn-warning" 
                onClick={() => setIsLoading(false)}
              >
                Cancel Loading
              </button>
            )}
          </div>

      {/* Introduction text */}
      <div className={`my-4 p-3 border rounded ${darkMode ? 'bg-dark' : 'bg-light'}`}>
        <p className={darkMode ? 'text-light' : ''}>DAPPU is a <strong>test token</strong> designed <em>purely for educational purposes.</em></p>
        <p className="typing-animation typing-delay-1 mb-4" style={{ textIndent: '33px' }}>No monetary value, no speculation — just real-world blockchain learning in a safe, controlled environment.</p>
        <p>Join our <strong>DAPPU crowdsale</strong> to gain hands-on experience in:</p>
        <ul style={{ listStyleType: 'none' }}>
          <li className="typing-animation typing-delay-2">✅ Participating in a token launch</li>
          <li className="typing-animation typing-delay-3">✅ Understanding smart contracts and wallet interactions</li>
          <li className="typing-animation typing-delay-4">✅ Exploring DAO governance, staking mechanics, and tokenomics</li>
          <li className="typing-animation typing-delay-5">✅ Testing decentralized tools before going live on mainnet</li>
        </ul>
        
        <p>Whether you're a developer, student, or curious builder, DAPPU gives you the keys to <em>practice before you launch</em>.</p>

        <p className="text-center typing-animation typing-delay-6"><strong>
          <span style={{ fontSize: '1.7em' }}>🙅</span>&nbsp;&nbsp;No risk&nbsp;&nbsp;
          <span style={{ fontSize: '1.7em' }}>📚</span>&nbsp;&nbsp;All learning&nbsp;&nbsp;
          <span style={{ fontSize: '1.7em' }}>🛜</span>&nbsp;&nbsp;Full decentralization&nbsp;&nbsp;
          <span style={{ fontSize: '1.7em' }}>🔗</span></strong></p>
        
        <h5 className="text-center typing-animation typing-delay-7">
          <span style={{ fontSize: '1.8em' }}>📌</span>&nbsp;&nbsp;Claim your test tokens&nbsp;&nbsp;
          <span style={{ fontSize: '1.8em' }}>🤝</span>&nbsp;&nbsp;Join the experiment&nbsp;&nbsp;
          <span style={{ fontSize: '1.8em' }}>₿</span>&nbsp;&nbsp;Learn with DAPPU!&nbsp;&nbsp;
          <span style={{ fontSize: '1.8em' }}>🧑‍💻</span></h5>
      </div>

      <hr /> {/* Separator line for visual clarity */}

      {/* 'Info' component - only show account info (address & balance) if connected to an account - && checks truthiness and if present, then render */}
      {account && (
        <Info account={account} accountBalance={accountBalance} />
      )}

        {/* Show whitelist status to ALL*/}
        {/* OR: connect prompt based on connection status */}

        {isConnected && crowdsale ? (
            <div className="d-flex justify-content-center align-items-center mb-3">
              {/* Show whitelist status and check button on the same line as status indicator */}
            <span 
              className={`py-2 px-4 rounded ${whitelistEnabled ? 'bg-warning text-black' : 'bg-success text-white'}`}
            >
              <strong>Current Status:</strong> {whitelistEnabled ? 
                'Whitelist ENABLED - Must be a whitelisted address to buy tokens' : 
                'Whitelist DISABLED - Anyone can buy tokens! - Live for public sale!'}
            </span>
        {/* Adds modal check after the whitelist status display */}
            <Button 
              variant="outline-primary" 
              size="sm"
              className="pulse-check-whitelist-button ms-3"
              onClick={async () => {
                try {
                  const signer = await provider.getSigner();
                  const address = await signer.getAddress();
                  const isWhitelisted = await crowdsale.whitelist(address);
                  setShowWhitelistCheckModal(true);
                  setWhitelistCheckResult({
                    address: address,
                    isWhitelisted: isWhitelisted,
                    whitelistEnabled: whitelistEnabled
                  });
                } catch (error) {
                  console.error("Error checking whitelist status:", error);
                  alert("Error checking whitelist status");
                }
              }}
              >
              Check If You're Whitelisted
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <span 
              className="d-inline-block py-2 px-4 rounded bg-info text-white"
              style={{ margin: '10px auto' }}
              >
              <strong>Whitelist Status:</strong> Connect your wallet to view current whitelist status
            </span>
          </div>
        )}

        {/* This modal at the bottom of your component, next to the disconnect modal */}
        <Modal 
          show={showWhitelistCheckModal} 
          onHide={() => setShowWhitelistCheckModal(false)}
          contentClassName={darkMode ? "bg-dark text-light" : ""}
        >
          <Modal.Header closeButton className={darkMode ? "bg-dark text-light border-secondary" : ""}>
            <Modal.Title>Whitelist Status Check</Modal.Title>
          </Modal.Header>
          <Modal.Body className={darkMode ? "bg-dark text-light" : ""}>
            {whitelistCheckResult && (
              <>
                <p><strong>Your Address:</strong> {whitelistCheckResult.address}</p>
                <p><strong>Whitelist Status:</strong> {whitelistCheckResult.isWhitelisted ? 
                  <span className="text-success"><strong>✓</strong> The connected wallet <strong>IS</strong> whitelisted</span> : 
                  <span className="text-danger"><strong>✗</strong> The connected wallet is <strong>NOT</strong> whitelisted</span>}
                </p>
                <p><strong>Whitelist Feature:</strong> {whitelistCheckResult.whitelistEnabled ? 
                  <span className="text-success"><strong>✓ ENABLED</strong> - Only whitelisted addresses can buy tokens</span> : 
                  <span className="text-warning"><strong>✗ DISABLED</strong> - Anyone can buy tokens</span>}
                </p>
                <div className={`alert ${darkMode ? "alert-dark border-info" : "alert-info"}`}>
                  {whitelistCheckResult.whitelistEnabled && !whitelistCheckResult.isWhitelisted ? 
                    <>The wallet currently connected is <strong>NOT</strong> able to purchase tokens until added to the whitelist
                      &nbsp;<span style={{ fontSize: '1.5em' }}>😩</span> or unless the whitelist becomes disabled.
                      &nbsp;<span style={{ fontSize: '1.5em' }}>👀&nbsp;🤪</span></>:
                    <><strong>Congrats!
                      &nbsp;<span style={{ fontSize: '1.5em' }}> 🥳</span>
                      &nbsp;</strong> You <strong>ARE</strong> allowed to purchase tokens!</>
                  }
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className={darkMode ? "bg-dark border-secondary" : ""}>
            <Button variant={darkMode ? "outline-light" : "secondary"} onClick={() => setShowWhitelistCheckModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      {/* *** Add 'Admin' component - only show if user is the owner of the crowdsale contract */}
      {isOwner && account && crowdsale && (
        <Admin 
          provider={provider} 
          crowdsale={crowdsale} 
          setIsLoading={setIsLoading}
          whitelistStatus={whitelistEnabled}
          setWhitelistStatus={setWhitelistEnabled}
          darkMode={darkMode}
        />
      )}
    {/* ↑ Admin component allows the owner to manage the whitelist */}
    
    <hr />

      {/* Add Transaction Ledger */}
      {isConnected && crowdsale && (
        <TransactionLedger 
          provider={provider}
          crowdsale={crowdsale}
          account={account}
          darkMode={darkMode}
        />
      )}

    <Modal 
      show={showDisconnectModal} 
      onHide={() => setShowDisconnectModal(false)}
      contentClassName={darkMode ? "bg-dark text-light" : ""}
    >
      <Modal.Header closeButton className={darkMode ? "bg-dark text-light border-secondary" : ""}>
        <Modal.Title>Wallet Disconnected from DApp</Modal.Title>
      </Modal.Header>
      <Modal.Body className={darkMode ? "bg-dark text-light" : ""}>
        <p style={{ paddingLeft: '55px' }}><strong>Note:</strong></p>
        <p className="text-center">To fully disconnect from MetaMask,<br/>use the MetaMask extension itself.</p>
      </Modal.Body>
      <Modal.Footer className={darkMode ? "bg-dark border-secondary" : ""}>
        <Button variant={darkMode ? "outline-light" : "secondary"} onClick={() => setShowDisconnectModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

    </Container>
  );
}

export default App;  // Makes this component available for import in other files

// ========== END OF APP.JS ==========
