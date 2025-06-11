import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';
import './DarkMode.css';

const Buy = ({ provider, 
    price, 
    crowdsale, 
    setIsLoading, 
    navbarVersion, 
    darkMode, 
    isOpen, 
    minContribution, 
    maxContribution
}) => {
    const [amount, setAmount] = useState('0')
    const [isWaiting, setIsWaiting] = useState(false)

    const buyHandler = async (e) => {
        e.preventDefault()
        setIsWaiting(true)
        console.log("Buy component received isOpen:", isOpen);
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

                /*Moved the min/max checks before formatting the amount
                    Used parseFloat() to compare the actual numeric values instead of comparing BigNumber objects
                    This ensures we catch invalid amounts before even attempting to format them or calculate values*/

                if (!amount || parseFloat(amount) === 0) {
                    alert(`\n    Minimum contribution is set to: ${minContribution} tokens`);
                    setIsWaiting(false);
                    return;
                }

                if (parseFloat(amount) < parseFloat(minContribution)) {
                    alert(`\n    Minimum contribution is set to: ${minContribution} tokens`);
                    setIsWaiting(false);
                    return;
                }
                
                if (parseFloat(amount) > parseFloat(maxContribution)) {
                    alert(`\n    Maximum contribution is set to: ${parseInt(maxContribution).toLocaleString()} tokens`);
                    setIsWaiting(false);
                    return;
                }

                // Round the amount to an integer if the contract doesn't support decimals
                //const roundedAmount = Math.floor(parseFloat(amount))
                //console.log(`Original amount: ${amount}, Rounded amount: ${roundedAmount}`)
                
                // Continue with purchase:
                //const value = ethers.utils.parseUnits((amount * price).toString(), 'ether')
                const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')
                // Now calculate ETH value based on token amount and price
                //const priceInWei = ethers.utils.parseUnits(price.toString(), 'ether')
                //const value = formattedAmount.mul(priceInWei).div(ethers.utils.parseEther('1'))
                    // Calculate ETH value
                    const ethCost = parseFloat(amount) * parseFloat(price)
                    const value = ethers.utils.parseEther(ethCost.toString())

                console.log(`Minimum contribution: ${minContribution} tokens`)
                console.log(`Formatted amount: ${ethers.utils.formatUnits(formattedAmount, 'ether')} tokens`)
                console.log(`Is amount > min? ${parseFloat(amount) > parseFloat(minContribution)}`)
                
                // Check if amount is within limits
                const minContribWei = ethers.utils.parseUnits(minContribution.toString(), 'ether');
                const maxContribWei = ethers.utils.parseUnits(maxContribution.toString(), 'ether');
                if (formattedAmount.lt(minContribWei)) {
                    alert(`\n    Minimum contribution is ${minContribution} tokens`);
                    setIsWaiting(false);
                    return;
                }
                if (formattedAmount.gt(maxContribWei)) {
                    alert(`\n    Maximum contribution is set to: ${parseInt(maxContribution).toLocaleString()} tokens`);
                    setIsWaiting(false);
                    return;
                }
                console.log(`Buying ${amount} tokens at ${price} ETH each = ${amount * price} ETH total`)
                console.log(`Token amount in wei: ${formattedAmount.toString()}`)
                console.log(`ETH value in wei: ${value.toString()}`)

                /* Add a small buffer to the value to account for rounding errors (0.5%)
                    Ex: Purchase error: Error: fractional component exceeds decimals (0.11, 0.112, etc)
                        - The issue with values like "0.11" and "0.112" is likely due to floating-point precision errors when calculating the ETH value
                        - The key changes are:
                            - Using BigNumber arithmetic throughout to avoid floating-point precision issues
                            - Adding a small buffer (0.5%) to the calculated value to account for rounding errors
                            - Using the buffered value when sending the transaction
                        This approach should handle edge cases like "0.11" and "0.112" by ensuring that slightly more ETH is sent than the exact calculated amount, which should satisfy the contract's requirements.*/
                const buffer = value.mul(5).div(1000)
                const valueWithBuffer = value.add(buffer)
                console.log(`Value with buffer: ${valueWithBuffer.toString()}`)
                /*Ex: Buying 0.111 tokens at 0.025 ETH each = 0.002775 ETH total
                        Token amount in wei: 111000000000000000
                        BETH value in wei: 2775000000000000
                        Value with buffer: 2788875000000000*/
                
                // Execute transaction (with the buffered value):
                const transaction = await crowdsale.connect(signer).buyTokens(formattedAmount, { value: valueWithBuffer })
                await transaction.wait()

                // Show success message and reload page
                alert("\n Purchase successful!\n   Refreshing balance...");
                window.location.reload();
        } catch (error) {
            console.error("Purchase error:", error);
            //window.alert('\n Failed to purchase tokens:\n   Transaction reverted: User rejected or not enough funds')
            
            // More detailed error handling:
            if (error.code === 4001 || 
                (error.message && error.message.includes("user rejected")) || 
                (error.message && error.message.includes("User denied"))) {
                alert("\n    Transaction reverted:\n              ↓\n         Request rejected by user");
            } else if (error.message && error.message.includes("insufficient funds")) {
                alert("\n    Transaction reverted:\n              ↓\n         Insufficient funds");
            } else if (error.message && error.message.includes("Amount is less than minimum contribution")) {
                alert(`\n    Minimum contribution is set to: ${minContribution} tokens`);
            } else if (error.message) {
                // Log the full error message to see what's happening
                console.log("Full error message:", error.message);
                
                // Check for various error message formats
                if (error.message.includes("Amount exceeds maximum contribution") || 
                    error.message.includes("Maximum contribution is")) {
                    alert(`\n    Maximum contribution per purchase is set to: ${parseInt(maxContribution).toLocaleString()} tokens`);
                } else if (error.message.includes("execution reverted")) {
                    // This catches generic revert messages
                    if (parseFloat(amount) > parseFloat(maxContribution)) {
                        alert(`\n    Maximum contribution per purchase is set to: ${parseInt(maxContribution).toLocaleString()} tokens`);
                    } else {
                        alert("\n    Transaction failed: " + error.message);
                    }
                } else {
                    // For any other error message
                    alert("\n    Transaction failed. Please check console for details.");
                }
            }
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
        <>
            {/* If isOpen is true, show the form*/}
            {isOpen ? (
                <Form onSubmit={buyHandler} style={navbarVersion ? { margin: '0' } : { maxWidth: '800px', margin: '50px auto' }}>
                    <Form.Group as={Row} className="align-items-center mb-2">
                        <Col className='text-center ms-2' style={{ flex: '1.33' }}> {/*Added flex to make it wider */}
                        <Form.Control 
                            type="number"
                            min="0.01" // Changed from "1" to "0.01" to allow fractional tokens
                            step="0.001" // Added step attribute to control increment size
                            placeholder="Enter amount               >= 0.01"
                            onChange={(e) => setAmount(e.target.value)}
                            size={navbarVersion ? "sm" : "md"}
                            className={darkMode ? "bg-dark text-light border-secondary dark-placeholder" : ""}
                            />
                        </Col>
                        <Col className='text-center ms-3' style={{ flex: '1.1' }}>
                        {isWaiting ? (
                            <Spinner animation="border" size={navbarVersion ? "sm" : "md"} />
                        ) : (
                            <Button 
                            variant="danger" // Change from primary to danger (red)
                            type="submit"
                            className="pulse-buy-button buy-tokens-button"
                            style={{ 
                                width: '111%',
                                fontWeight: 'bold',
                                boxShadow: darkMode ? '0 4px 8px rgba(255,255,255,0.2)' : '0 4px 8px rgba(0,0,0,0.2)',
                                background: 'linear-gradient(45deg, #ff5e62, #ff9966)', // Gradient background
                                border: 'none',
                                transform: 'scale(1.22)' // Make it slightly larger
                            }}
                            size={navbarVersion ? "sm" : "md"}
                            >
                            <span className="pulse-buy-text">
                            <span style={{ fontSize: '1.7em' }}>🔥</span>&nbsp;
                            <big> BUY TOKENS </big>&nbsp;
                            <span style={{ fontSize: '1.7em' }}>🔥</span></span>
                            </Button>
                        )}
                        </Col>
                    </Form.Group>
                    {maxContribution && (
                        <small className={`${darkMode ? "text-light" : "text-muted"} d-block mb-2`}>
                        &nbsp;&nbsp;&nbsp;
                        <em style={{ fontSize: '0.55em' }}>{parseInt(maxContribution).toLocaleString()} MAX tokens/transaction | Min step= 0.001 tokens</em>
                    </small>
                    )}
                </Form>
            ) : (
                <div className="text-center">
                    <span className={`alert ${darkMode ? "alert-warning" : "alert-warning"} d-inline-block py-2 px-3`}>
                        <strong><big>🔒</big>&nbsp;&nbsp;&nbsp;
                        Sale is curently CLOSED&nbsp;&nbsp;&nbsp;
                        <big>🔒</big>&nbsp;&nbsp;&nbsp;
                        |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <big>👀</big>&nbsp;&nbsp;&nbsp;
                        STAY TUNED!&nbsp;&nbsp;&nbsp;
                        <big>🤩</big></strong>
                    </span>
                </div>
            )}
        </>
    );
}

export default Buy;

//========= END OF BUY.JS ==========
