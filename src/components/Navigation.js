import { Navbar, Container, Button } from 'react-bootstrap';
import logo from '../logo.png';

const Navigation = ({ account, isConnected, connectWallet, disconnectWallet }) => {
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
                        <small>{account.slice(0, 6) + '...' + account.slice(-4)}</small>
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;