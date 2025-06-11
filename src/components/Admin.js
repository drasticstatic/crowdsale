// ========== ADMIN.JS ==========

/* This component is part of a DApp that allows an admin to manage a whitelist for a crowdsale contract
    by adding or removing addresses, and toggling the whitelist status */

import { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const Admin = ({ provider, crowdsale, setIsLoading, whitelistStatus, setWhitelistStatus, darkMode }) => {
    const [address, setAddress] = useState('');
    const [isSaleOpen, setIsSaleOpen] = useState(false); // State to hold the sale open status
    const [isWhitelistEnabled, setIsWhitelistEnabled] = useState(whitelistStatus);
        // ↑ Pass in state from parent component to manage loading state (loadblockchaindata)
    const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);// State to hold the list of whitelisted addresses

    // Function to toggle the sale status
    const toggleSaleHandler = async () => {
        try {
        setIsLoading(true);
        const signer = await provider.getSigner();
        
        if (isSaleOpen) {
            // Close the sale
            const transaction = await crowdsale.connect(signer).closeSale();
            await transaction.wait();
            setIsSaleOpen(false);
        } else {
            // Open the sale
            const transaction = await crowdsale.connect(signer).openSale();
            await transaction.wait();
            setIsSaleOpen(true);
        }
        
        alert(`\n     Sale is now ${isSaleOpen ? 'CLOSED  🔒 🙅‍♂️' : 'OPEN!  🔓 😃'}`);
        window.location.reload();// Reload the page to reflect changes
        } catch (error) {
        console.error("Toggle sale error:", error);
        // More detailed error logging
        if (error.code) console.error(`Error code: ${error.code}`);
        if (error.message) console.error(`Error message: ${error.message}`);
        if (error.data) console.error(`Error data:`, error.data);
        
        alert(`Failed to toggle sale status: ${error.message}`);
        setIsLoading(false);
    }
    };

    const addToWhitelistHandler = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const signer = await provider.getSigner();
            const transaction = await crowdsale.connect(signer).addToWhitelist(address);
            await transaction.wait();

            // Instead of reloading the page, just fetch the updated list
            await fetchWhitelistedAddresses();
            
            // Clear the input field
            setAddress('');
            setIsLoading(false);

            // Show success message
            alert(`\n✓ Address ${address} \n\n     successfully \u00A0\u00A0\u00A0\u00A0✓\u00A0\u00A0ADDED\u00A0\u00A0✓\u00A0\u00A0\u00A0\u00A0 to whitelist`);
            window.location.reload(); 
        } catch (error) {
            console.error("Add to whitelist error:", error);
            alert(`\n Failed to add address to whitelist: ${error.message}`);
            setIsLoading(false);
        }
        };

    const removeFromWhitelistHandler = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const signer = await provider.getSigner();
            const transaction = await crowdsale.connect(signer).removeFromWhitelist(address);
            await transaction.wait();

            // Immediately fetch the updated list
            await fetchWhitelistedAddresses();

            // Clear the input field
            setAddress('');
            setIsLoading(false);

            // Show success message
            alert(`\n✓ Address ${address} \n\n     successfully \u00A0\u00A0\u00A0\u00A0✗\u00A0\u00A0REMOVED\u00A0\u00A0✗\u00A0\u00A0\u00A0\u00A0 from whitelist`);
            window.location.reload(); 
        } catch (error) {
            console.error(error);
            alert('\n Failed to remove address from whitelist');
            setIsLoading(false);
        }
    };

    const toggleWhitelistHandler = async () => {
        try {
            // Get the current state from the contract first
            const currentState = await crowdsale.whitelistEnabled();
            console.log(`Current whitelist state: ${currentState}`);
            
            // Toggle to the opposite state
            const newState = !currentState; // new state to be !-opposite
            console.log(`Toggling to: ${newState}`);
            
            const signer = await provider.getSigner();
            //const transaction = await crowdsale.connect(signer).toggleWhitelist(newState);
            
            // Add gas limit and price to avoid circuit breaker issues
            /*const gasEstimate = await crowdsale.estimateGas.toggleWhitelist(newState);
            const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer
            const transaction = await crowdsale.connect(signer).toggleWhitelist(newState, {
                gasLimit: gasLimit
            });*/
            // Skip gas estimation causing JSON-RPC-error:
            const transaction = await crowdsale.connect(signer).toggleWhitelist(newState, {
                gasLimit: 200000 // Set a fixed gas limit instead of estimating
            });
            
            console.log("Transaction sent:", transaction.hash);
            alert(`\n Transaction sent!\n   Please wait for confirmation...`);
            
            // Wait for transaction to be mined
            await transaction.wait();
            console.log("Transaction confirmed");

            // Read the new state directly from the contract
            const updatedState = await crowdsale.whitelistEnabled();
            console.log(`Updated contract whitelist state: ${updatedState}`);
            
            // Update both local and parent state based on the contract's state
            setIsWhitelistEnabled(updatedState);
            setWhitelistStatus(updatedState);

            // Refresh the whitelist addresses list
            await fetchWhitelistedAddresses();
            
            alert(`\n Whitelist is now ${updatedState ? 'ENABLED' : 'DISABLED'}`);
            // Reload data but don't leave in loading state
            /*setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);*/ // Set a timeout to ensure loading state is reset
            //window.location.reload();// Force page reload instead of using loading state
            //document.location.href = document.location.href;// DIRECT FIX: Force a hard reload of the page
            //window.location.href = window.location.pathname + window.location.search;
            
            //window.location.reload(true); // true forces a reload from the server, not from cache
            //↑ now removed b/c causing dark mode state to reload to light-mode
        } catch (error) {
            console.error("Toggle whitelist error:", error);
            
            // More detailed error logging
            if (error.code) console.error(`Error code: ${error.code}`);
            if (error.message) console.error(`Error message: ${error.message}`);
            if (error.data) console.error(`Error data:`, error.data);
            
            // Suggest solutions based on error
            if (error.message.includes('circuit breaker')) {
                alert('\n Network error:\n   Please try again in a few moments or restart your Hardhat node');
            } else {
                alert('\n Failed to toggle whitelist: ' + error.message);
                setIsLoading(false); // Make sure to reset loading state on error
            }
        }
    };

    // Function to fetch whitelisted addresses:
    const fetchWhitelistedAddresses = useCallback(async () => {
        try {
            const signer = await provider.getSigner();
            const addresses = await crowdsale.connect(signer).getWhitelistedAddresses();
            //setWhitelistedAddresses(addresses);
            //console.log("Fetched whitelisted addresses:", addresses);
                // Filter out duplicates:
                const uniqueAddresses = [...new Set(addresses)];
                console.log("Fetched whitelisted addresses:", uniqueAddresses);
                setWhitelistedAddresses(uniqueAddresses);
        } catch (error) {
            console.error("Error fetching whitelisted addresses:", error);
        }
    }, [provider, crowdsale]);

// Call these functions when the component mounts or when needed via useEffects
useEffect(() => {
    const fetchSaleStatus = async () => {
      try {
        const isOpen = await crowdsale.isOpen();
        setIsSaleOpen(isOpen);
      } catch (error) {
        console.error("Error fetching sale status:", error);
      }
    };
    
    fetchSaleStatus();
  }, [crowdsale]);

// Fetch whitelisted addresses when the component mounts
useEffect(() => {
    if (provider && crowdsale) {
      fetchWhitelistedAddresses();
    }
  }, [provider, crowdsale, fetchWhitelistedAddresses]);

// Added a dependency on whitelistStatus
    // State wasn't being properly synchronized when switching accounts
    // Update this line to sync with parent state when it changes
useEffect(() => {
    setIsWhitelistEnabled(whitelistStatus);
  }, [whitelistStatus]);

useEffect(() => {
const updateWhitelistStatus = async () => {
    if (provider && crowdsale) {
    try {
        // Get the current whitelist status directly from the contract
        const contractWhitelistStatus = await crowdsale.whitelistEnabled();
        console.log("Contract whitelist status:", contractWhitelistStatus);
        
        // Update both local and parent state
        setIsWhitelistEnabled(contractWhitelistStatus);
        if (setWhitelistStatus) {
        setWhitelistStatus(contractWhitelistStatus);
        }
    } catch (error) {
        console.error("Error fetching whitelist status:", error);
    }
    }
};

updateWhitelistStatus();
}, [provider, crowdsale, setWhitelistStatus]);

    return (
        //<Card className="my-4" bg={darkMode ? "dark" : "light"} text={darkMode ? "white" : "dark"}>
        <Card className={`my-4 admin-card ${darkMode ? "bg-dark text-light" : ""}`}>
            <Card.Header className={`admin-header ${darkMode ? "border-secondary" : ""}`}>Admin Panel - Toggle Sale Status & Whitelist Management</Card.Header>
            <div className="mt-3">
                <div className="d-flex justify-content-center align-items-center">
                <span className={darkMode ? "text-light me-3" : "me-4"}>
                    Sale is currently:&nbsp;&nbsp;&nbsp;
                    <strong className={isSaleOpen ? "text-success" : "text-danger"}>
                        {isSaleOpen ? 'OPEN 😃' : 'CLOSED 🙅‍♂️'}
                    </strong>
                </span>
                    <Button 
                        variant={isSaleOpen ? "danger" : "success"} 
                        onClick={toggleSaleHandler}
                        className={`toggle-buy-button ${!isSaleOpen ? "pulse-green-button" : ""}`}
                    >
                    {isSaleOpen ? <span>Close Sale <span className="lock-shake">🔒</span></span> : <span>Open Sale <span className="key-shake">🔑</span></span>}
                    </Button>
                </div>
            </div>
            <hr className={darkMode ? "border-secondary" : ""} />
            <Card.Body>
                <Form onSubmit={addToWhitelistHandler}>
                    <Form.Group className="mb-2">
                        <Form.Label className={darkMode ? "text-light" : ""}>Investor's Ethereum Address:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder=" 0x..." 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`${darkMode ? "bg-dark text-light border-secondary dark-placeholder" : ""}`}
                        />
                    </Form.Group>

                    <div className="text-center whitelist-item p-2">
                        <Button variant="success" type="submit" className="pulse-green-button me-3">
                            <strong>ADD</strong> <small>to Whitelist</small>
                        </Button>
                        <Button variant="danger" onClick={removeFromWhitelistHandler}>
                        <strong>REMOVE</strong> <small>from Whitelist</small>
                        </Button>
                        
                        <hr className={darkMode ? "border-secondary" : ""} />

                        {isWhitelistEnabled && (
                            <p className="text-info mb-2">
                                <small><i className="bi bi-info-circle"></i> <br /><strong>Whitelist</strong> is currently  
                                <strong><span style={{ 
                                    color: '#008000', 
                                    textShadow: '0.5px 0.5px 0.5px rgba(0,0,0,0.5)',
                                    fontWeight: 'bold'
                                }}>
                                    <big> ACTIVE</big><br />
                                    </span></strong><strong style={{ fontSize: '1.1em' }}>↑</strong><br />
                                <u><strong style={{ fontSize: '1.1em' }}>ONLY</strong></u>
                                <span style={{ fontSize: '1.1em' }}> </span>
                                <u><strong style={{ fontSize: '0.9em' }}>whitelisted addresses</strong></u>
                                <span style={{ fontSize: '0.9em' }}> can buy tokens</span></small>
                            </p>
                        )}
                        {!isWhitelistEnabled && (
                            <p className="text-danger mt-2">
                                <small><i className="bi bi-exclamation-triangle"></i> <br /><em><u><strong>WARNING</strong></u>
                                <strong>: </strong></em> 
                                <strong>Whitelist</strong> is currently <strong><span style={{ 
                                    color: '#f00', 
                                    textShadow: '0.5px 0.5px 0.5px rgba(0,0,0,0.5)',
                                    fontWeight: 'bold'
                                }}>
                                    <big> DISABLED</big><br />
                                </span></strong><strong style={{ fontSize: '1.1em' }}>↑</strong><br />
                                <u><strong style={{ fontSize: '0.9em' }}>ANYONE</strong></u>
                                <span style={{ fontSize: '0.9em' }}> can buy tokens</span></small>
                            </p>
                        )}
                        <Button 
                            variant={isWhitelistEnabled ? "warning" : "primary"}
                            className="mt-3"
                            // ternary operator: warning=yellow, primary=blue
                            onClick={toggleWhitelistHandler}
                        >
                            {isWhitelistEnabled ? (
                                <>Toggle <strong style={{ letterSpacing: '2px' }}><small>WHITELIST</small></strong>
                                Feature<br /><strong style={{ letterSpacing: '5px' }}><big>- OFF -</big></strong>
                                <br /><em style={{ 
                                    color: '#f00', 
                                    textShadow: '0.5px 0.5px 0.5px rgba(0,0,0,0.5)',
                                }}>
                                    <small>warning: <u>anyone</u> will be able to purchase tokens</small>
                                </em></>
                            ) : (
                                <>Toggle <strong style={{ letterSpacing: '2px' }}><small>WHITELIST</small></strong>
                                Feature<br /><strong style={{ letterSpacing: '5px' }}><big>- ON -</big></strong>
                                <br /><em style={{
                                    color: '#00ff00', 
                                    textShadow: '0.5px 0.5px 0.5px rgba(0,0,0,0.5)',
                                }}>
                                    <small>resume | re-enable whitelist</small></em></>
                            )}
                        </Button>
                        <br /><br />
                        <div className={`text-center small ${darkMode ? 'text-light' : 'text-muted'}`}>
                            <p style={{ fontSize: '0.6em' }}><i className="bi bi-info-circle"></i> <em>whitelist=enabled - default state upon deployment</em></p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={fetchWhitelistedAddresses}
                            className="mt-2 mb-2"
                        >
                            <big>Force Refresh the Array  </big><small>+ log console</small>
                        </Button>
                        
                        <Button 
                            variant="outline-info" 
                            size="sm"
                            className="mt-2 mb-2"
                            onClick={async () => {
                            try {
                                const signer = await provider.getSigner();
                                const signerAddress = await signer.getAddress();
                                const owner = await crowdsale.owner();
                                const isOwner = signerAddress.toLowerCase() === owner.toLowerCase();
                                
                                alert(`Owner check: ${isOwner ? 'Yes' : 'No'}\nYour address: ${signerAddress}\nOwner address: ${owner}`);
                                console.log(`Owner check: ${isOwner ? 'Yes' : 'No'}\nYour address: ${signerAddress}\nOwner address: ${owner}`);
                            } catch (error) {
                                console.error("Error checking owner status:", error);
                                alert("Error checking owner status");
                            }
                            }}
                        >
                            <big>Log Owner Status  </big><small>4 Debugging</small>
                        </Button>
                        </div>
                    <div className="mt-4">
                        <h5><u>Whitelisted Addresses:</u></h5>
                        {whitelistedAddresses.length > 0 ? (
                            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
                                {whitelistedAddresses.map((addr, index) => (
                                    <div key={index} className="mb-1 text-start">
                                    <small>{addr}</small>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted"><small>No addresses whitelisted yet</small></p>
                    )}
                </div>               
                </Form>
            </Card.Body>
        </Card>
    );
};

export default Admin;

// ========== END OF ADMIN.JS ==========
