import { Navbar, Container, Button } from 'react-bootstrap';
import logo from '../logo.png';

//import { useState } from 'react';

const Navigation = ({ account, isConnected, connectWallet, disconnectWallet, setAppIsLoading }) => {
    //const [isLoading, setIsLoading] = useState(false);
    // 'setAppIsLoading' used for manual reload button
    return (
        <Navbar className='my-3'>
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
                    color: '#0066cc', 
                    fontWeight: 'bold', 
                    fontSize: '1.2em',
                    letterSpacing: '1px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                    }}>DAPPU</span><span style={{ 
                        fontVariant: 'small-caps',
                        fontSize: '0.9em',
                        letterSpacing: '1px'
                    }}> ICO Crowdsale</span>
                </strong><br />
                    <small >An <strong>ERC20</strong> Token</small>
                    <br/><em><small style={{ color: '#00008B' }}>that's revolutionizing Blockchain Learning</small></em>
                </Navbar.Brand>

                <Navbar.Collapse className="justify-content-end">
                {!isConnected ? (
                    <Button 
                    variant="primary" 
                    onClick={connectWallet}
                    >
                    Connect Wallet
                    </Button>
                ) : (
                    <div className="d-flex align-items-center">
                    <Button 
                        variant="success" 
                        disabled
                        className="me-2"
                    >
                        <span className="me-2">✓ Connected</span>
                        <small>{account ? (account.slice(0, 6) + '...' + account.slice(-4)) : 'Loading...'}</small>
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
                {/*button to manually reload blackcahin data*/}
                <div className="ms-2"> {/* ms-2 adds margin-left */}
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;