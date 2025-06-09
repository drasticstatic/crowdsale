import { useState } from 'react';
import { Navbar, Container, Button, Modal } from 'react-bootstrap';
import logo from '../logo.png';

import Buy from './Buy'; //moved to nav bar
//import Progress from './Progress'; //moved to nav bar

const Navigation = ({
    account, 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    setAppIsLoading, 
    checkOwnerStatus,
    price,
    provider,
    crowdsale,
    setIsLoading,
    maxTokens,
    tokensSold,
    isLoading,
    darkMode,
    setDarkMode, 
    isOpen,
    minContribution,
    maxContribution
}) => {
    //const [isLoading, setIsLoading] = useState(false);
    // 'setAppIsLoading' used for manual reload button

    // Add state for modal
    const [showModal, setShowModal] = useState(false);
    const [ownerStatus, setOwnerStatus] = useState({ isOwner: false, account: '', owner: '' });

    // Function to check owner status and show modal
    const handleCheckOwner = async () => {
        try {
            if (typeof checkOwnerStatus === 'function') {
                const result = await checkOwnerStatus();
                setOwnerStatus(result);
                setShowModal(true);
            } else {
                console.log("checkOwnerStatus is not a function");
                alert("Owner check function not available");
            }
        } catch (error) {
            console.error("Error checking owner status:", error);
        }
    };

    return (
        <Navbar 
            className='my-0 pb-3' // Add padding-bottom (pb-3)
            fixed="top" 
            bg={darkMode ? "dark" : "light"}  // Change bg based on dark mode
            variant={darkMode ? "dark" : "light"}  // Add variant for text color
            expand="lg"
            style={{
                paddingBottom: '40px', // Add extra padding & wrap to ensure enough space
                flexWrap: 'wrap',
                transition: 'background-color 0.3s'  // Add smooth transition
                }} 
        >
            {/*freeze header during scroll w/ fixed="top" bg="light"*/}
            <img
                alt="logo"
                src={logo}
                width="40"
                height="40"
                className="d-inline-block align-top mx-3"
            />
            <Container>
                <Navbar.Brand href="#">
                <strong>
                <span style={{ 
                    color: darkMode ? '#66b3ff' : '#0066cc', // Lighter blue in dark mode
                    fontWeight: 'bold', 
                    fontSize: '1.2em',
                    letterSpacing: '1px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}>DAPPU</span>
                <span style={{ 
                    fontVariant: 'small-caps',
                    fontSize: '0.9em',
                    letterSpacing: '1px',
                    color: darkMode ? '#f8f9fa' : 'inherit' // Light color in dark mode
                }}> ICO Crowdsale</span>
                </strong><br />
                    <small >An <strong>ERC20</strong> Token</small>
                    <br/><em><small style={{ color: darkMode ? '#66b3ff' : '#00008B' }}>that's revolutionizing Blockchain Learning</small></em>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="ms-4">

                <span style={{ 
                color: '#0066cc', 
                fontWeight: 'bold', 
                fontSize: '1.5em',
                letterSpacing: '1px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}> <span style={{ 
                display: 'inline-block',
                marginBottom: '10px'
                }}>
                <svg width="250" height="155" viewBox="0 0 250 145" xmlns="http://www.w3.org/2000/svg">
                    {/* Outer shadow for 3D effect */}
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="2" dy="4" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.6" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                    </filter>
                    
                    {/* Gradient for 3D effect */}
                    <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0088ff" />
                    <stop offset="100%" stopColor="#004488" />
                    </linearGradient>
                    
                    {/* Circle background with 3D effect */}
                    <circle cx="125" cy="70" r="60" fill="url(#circleGradient)" filter="url(#shadow)" />
                    
                    {/* Highlight for 3D effect */}
                    <circle 
                        cx="115" 
                        cy="44" 
                        r="75" 
                        fill="none" 
                        stroke={darkMode ? "rgba(33,37,41,0.3)" : "rgba(255,255,255,0.3)"} 
                        strokeWidth="5" 
                    />
                    
                    {/* DAPPU text */}
                    <text x="125" y="88" fontFamily="Arial" fontSize="25" fontWeight="bold" fill="white" textAnchor="middle">DAPPU</text>
                </svg>
                </span> </span>

                <div>{/*button to manually reload blackchain data*/}
                    <Button 
                        variant="outline-warning" 
                        size="sm"
                        style={{ 
                            whiteSpace: 'normal', 
                            maxWidth: '120px',
                            fontSize: '0.75rem',
                            padding: '4px 8px'
                        }}
                        onClick={() => {
                            if (typeof setAppIsLoading === 'function') {
                                console.log("Manually reloading blockchain data...");
                                setAppIsLoading(false); // First reset loading state
                                setTimeout(() => {
                                    setAppIsLoading(true); // Then set it to true to trigger loading
                                }, 100);
                            } else {
                                console.log("setAppIsLoading is not a function:", setAppIsLoading);
                                alert("Reload function not available");
                            }
                        }}
                    >
                        Manually Reload Blockchain Data
                    </Button>
                </div>

                {/* Add a button for checking owner status */}
                <div className="ms-2"> {/* ms-2 adds margin-left */}
                    <Button 
                        variant="outline-info" 
                        size="sm"
                        style={{ 
                            whiteSpace: 'normal', 
                            maxWidth: '120px',
                            fontSize: '0.8rem',
                            padding: '4px 8px'
                        }}
                        onClick={handleCheckOwner}
                    >
                        Check Owner Status
                    </Button>
                </div>
                {/* Modal for displaying owner status */}
                <Modal 
                    show={showModal} 
                    onHide={() => setShowModal(false)}
                    contentClassName={darkMode ? "bg-dark text-light" : ""}
                >
                <Modal.Header closeButton className={darkMode ? "bg-dark text-light border-secondary" : ""}>
                    <Modal.Title>Owner Status</Modal.Title>
                </Modal.Header>
                <Modal.Body className={darkMode ? "bg-dark text-light" : ""}>
                    <p><strong>Am I the Owner?:</strong> {ownerStatus.isOwner ? 
                    <span className="text-success"><strong>✓ Yes</strong></span> : 
                    <span className="text-danger"><strong>✗ No</strong></span>}
                    </p>
                    <p><strong>Your Address:</strong> {ownerStatus.account}</p>
                    <p><strong>Owner Address:</strong> {ownerStatus.owner}</p>
                </Modal.Body>
                <Modal.Footer className={darkMode ? "bg-dark border-secondary" : ""}>
                    <Button variant={darkMode ? "outline-light" : "secondary"} onClick={() => setShowModal(false)}>
                    Close
                    </Button>
                </Modal.Footer>
                </Modal>

                {/* Connect/Disconnect button group - always on the far right */}
                <div className="d-flex align-items-center">
                {!isConnected ? (
                    <Button 
                    variant="primary" 
                    onClick={connectWallet}
                    className="ms-2"
                    >
                    Connect Wallet
                    </Button>
                ) : (
                    <div className="d-flex flex-column ms-2">
                    <Button 
                        variant="success" 
                        disabled
                        className="mb-1"
                        size="sm"
                    >
                        <span className="me-1">✓ Connected</span>
                        <small>{account ? (account.slice(0, 2) + '...' + account.slice(-4)) : 'Loading...'}</small>
                        {/*Added 'account ? ' prefix and 'Loading...' */}
                        {/*To help prevent wallet connect button from NOT showing "connected" status when connected=true*/}
                    </Button>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={disconnectWallet}
                    >
                        Disconnect
                    </Button>
                </div>
            )} 
                    {/* Dark mode toggle button */}
                    <Button
                    variant={darkMode ? "light" : "dark"}
                    size="sm"
                    className="ms-5"
                    onClick={() => setDarkMode(!darkMode)}
                    style={{ display: 'flex', alignItems: 'center' }}
                    >
                    {darkMode ? (
                        <>
                        <span role="img" aria-label="sun" className="me-1">☀️</span>
                        <span className="d-none d-md-inline">Light</span>
                        </>
                    ) : (
                        <>
                        <span role="img" aria-label="moon" className="me-1">🌙</span>
                        <span className="d-none d-md-inline">Dark</span>
                        </>
                    )}
                    </Button>
                </div>
                </Navbar.Collapse>

                {/* Force a new line with flex-column */}
                <div className="d-flex flex-column align-items-center w-100 mt-1">
                {/* Buy Tokens button - centered below everything */}
                {isConnected && !isLoading && provider && crowdsale && (
                    <div className="d-flex justify-content-center" style={{ width: '577px', marginBottom: '20px' }}>
                    <div className="d-flex align-items-center w-100"> {/* Added w-100 to take full width */}
                        <small className={`text-${darkMode ? 'light' : 'muted'} me-2`}>Price:<strong> {price} ETH</strong></small>
                        <div style={{ flexGrow: 1 }}> {/* Added wrapper div with flexGrow to take available space */}
                            <Buy 
                            provider={provider} 
                            price={price} 
                            crowdsale={crowdsale} 
                            setIsLoading={setIsLoading}
                            navbarVersion={true}
                            darkMode={darkMode}
                            isOpen={isOpen}
                            minContribution={minContribution}
                            maxContribution={maxContribution}
                            />
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </Container> {/* Close the main container */}

                {/* Progress bar at the bottom of navbar, full width */}
                {isConnected && !isLoading && maxTokens && tokensSold && (
                <div 
                    className="position-absolute" 
                    style={{ 
                    bottom: '-10px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: '80%', 
                    maxWidth: '1000px'
                    }}
                >
                    {/* Progress bar */}
                    <div className="progress" style={{ 
                        height: '20px', 
                        borderRadius: '10px', 
                        position: 'relative', 
                        overflow: 'hidden',
                        backgroundColor: darkMode ? '#3a4149' : '' // Add dark grey background in dark mode
                    }}>                        
                        <div 
                            className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                            role="progressbar" 
                            style={{ 
                            width: `${(tokensSold / maxTokens) * 100}%`, 
                            borderRadius: (tokensSold / maxTokens) * 100 < 100 ? '10px 0 0 10px' : '10px'
                            }}
                            aria-valuenow={(tokensSold / maxTokens) * 100}
                            aria-valuemin="0" 
                            aria-valuemax="100"
                        ></div>
                        
                        {/* White text (visible over the blue part) */}
                        <div style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            clipPath: `inset(0 ${100 - (tokensSold / maxTokens) * 100}% 0 0)`
                        }}>
                            <span style={{ 
                                fontWeight: 'bold',
                                fontSize: '12px',
                                color: 'white',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                            }}>
                                Tokens Sold: {tokensSold} / {maxTokens}
                            </span>
                            <span style={{
                                position: 'absolute',
                                right: '10px',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                color: 'white',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                            }}>
                                {Math.round((tokensSold / maxTokens) * 100)}%
                            </span>
                        </div>

                        {/* Black text (visible over the empty part) - change to light gray in dark mode */}
                        <div style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        clipPath: `inset(0 0 0 ${(tokensSold / maxTokens) * 100}%)`
                        }}>
                        <span style={{ 
                            fontWeight: 'bold',
                            fontSize: '12px',
                            color: darkMode ? '#e0e0e0' : 'black', // Light gray in dark mode, black in light mode
                            textShadow: darkMode ? '1px 1px 4px rgba(0,0,0,0.9)' : '1px 1px 4px rgba(255,255,255,0.9)' // Dark shadow in dark mode, light shadow in light mode
                        }}>
                            Tokens Sold: {tokensSold} / {maxTokens}
                        </span>
                        <span style={{
                            position: 'absolute',
                            right: '10px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            color: darkMode ? '#e0e0e0' : 'black', // Light gray in dark mode, black in light mode
                            textShadow: darkMode ? '1px 1px 4px rgba(0,0,0,0.9)' : '1px 1px 4px rgba(255,255,255,0.9)' // Dark shadow in dark mode, light shadow in light mode
                        }}>
                            {Math.round((tokensSold / maxTokens) * 100)}%
                        </span>
                        </div>
                        </div>
                    </div>
                )}
        </Navbar>
    );
}

export default Navigation;

// ========== END OF NAVIGATION.JS ==========
