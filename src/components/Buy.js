import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';
import './DarkMode.css';

const Buy = ({ provider, price, crowdsale, setIsLoading, navbarVersion, darkMode }) => {
    const [amount, setAmount] = useState('0')
    const [isWaiting, setIsWaiting] = useState(false)

    const buyHandler = async (e) => {
        e.preventDefault()
        setIsWaiting(true)
        console.log('Buying tokens...', amount)

        try {
            // Get signer first, so it's available for both whitelist check and transaction
            const signer = await provider.getSigner()
            
            // Check if whitelist is enabled and if user is whitelisted:
            const whitelistEnabled = await crowdsale.whitelistEnabled();
            console.log("Whitelist enabled:", whitelistEnabled);

            if (whitelistEnabled) {
                // Only check whitelist if it's enabled
                const address = await signer.getAddress();
                const isWhitelisted = await crowdsale.whitelist(address);
                
                if (!isWhitelisted) {
                    alert("\n You are NOT whitelisted\n   &  therefore cannot purchase tokens.");
                    setIsWaiting(false);
                    return;
                  }
                } else {
                    console.log("Whitelist is disabled - anyone can buy!");
                }

                // Continue with purchase
                const value = ethers.utils.parseUnits((amount * price).toString(), 'ether')
                const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

                const transaction = await crowdsale.connect(signer).buyTokens(formattedAmount, { value: value })
                await transaction.wait()

                // Show success message and reload page
                alert("\n Purchase successful!\n   Refreshing balance...");
                window.location.reload();
        } catch (error) {
            console.error("Purchase error:", error);
            window.alert('\n Failed to purchase tokens:\n   User rejected, transaction reverted, or not enough funds')
            setIsWaiting(false); // Only reset waiting state on error
        }
        // No finally block needed since we're either reloading the page or setting isWaiting to false on error

        /*} catch {
            window.alert('\n Failed to purchase tokens:\n   User rejected, transaction reverted, or not enough funds')
        } finally {*/
            setIsWaiting(false); // Reset waiting state regardless of outcome
            //setIsLoading(true) // Refresh data
                //calling setIsLoading(true) after a purchase, which triggers a reload of blockchain data might be affecting the whitelist state
            // Don't set loading state

            //To reload the page after a successful purchase without affecting the whitelist state, modify your buyHandler:
                // window.location.reload() instead of using setIsLoading(true)
                // Only resets the waiting state on error, since on success we're reloading the page anyway
        }

    return (
        <Form onSubmit={buyHandler} style={navbarVersion ? { margin: '0' } : { maxWidth: '800px', margin: '50px auto' }}>
            <Form.Group as={Row} className="mb-2">
                <Col className='text-center ms-2'>
                <Form.Control 
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(e.target.value)}
                    size={navbarVersion ? "sm" : "md"}
                    className={darkMode ? "bg-dark text-light border-secondary dark-placeholder" : ""}
                />
                </Col>
                <Col className='text-center ms-3'>
                {isWaiting ? (
                    <Spinner animation="border" size={navbarVersion ? "sm" : "md"} />
                ) : (
                    <Button 
                    variant="danger" // Change from primary to danger (red)
                    type="submit" 
                    style={{ 
                        width: '100%',
                        fontWeight: 'bold',
                        boxShadow: darkMode ? '0 4px 8px rgba(255,255,255,0.2)' : '0 4px 8px rgba(0,0,0,0.2)',
                        background: 'linear-gradient(45deg, #ff5e62, #ff9966)', // Gradient background
                        border: 'none',
                        transform: 'scale(1.2)' // Make it slightly larger
                    }}
                    size={navbarVersion ? "sm" : "md"}
                    >
                    <big>🔥 BUY TOKENS 🔥</big>
                    </Button>
                )}
                </Col>
            </Form.Group>
            </Form>
    );
}

export default Buy;