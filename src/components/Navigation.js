import { Navbar, Container, Button, Modal } from 'react-bootstrap';
import logo from '../logo.png';

import { useState } from 'react';

const Navigation = ({ account, isConnected, connectWallet, disconnectWallet, setAppIsLoading, checkOwnerStatus }) => {
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
                <div>{/*button to manually reload blackcahin data*/}
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
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Owner Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Am I the Owner?:</strong> {ownerStatus.isOwner ? 'Yes' : 'No'}</p>
                        <p><strong>My Address:</strong> {ownerStatus.account}</p>
                        <p><strong>Owner's Address:</strong> {ownerStatus.owner}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Connect/Disconnect button group - always on the far right */}
                <div>
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
                </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;