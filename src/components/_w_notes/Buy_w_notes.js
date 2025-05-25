// ========== BUY.JS ==========

/* This file contains a React component that handles the token purchase functionality in the crowdsale application
    It handles connecting to the user's wallet and sending the transaction to the blockchain
        The `Buy` component creates a FORM where users can:
            1. Enter the amount of tokens they want to buy
            2. Click a button to purchase those tokens with ETH (Ethereum) 
        Browser wallet (like MetaMask) will open and ask to confirm sending ETH to buy tokens.*/

// Import React features and UI components:
import { useState } from 'react'; // useState lets us create variables that can change
import Form from 'react-bootstrap/Form'; // Form component for user input
import Button from 'react-bootstrap/Button'; // Button component for user actions
import Row from 'react-bootstrap/Row'; // Layout component for horizontal arrangement
import Col from 'react-bootstrap/Col'; // Layout component for columns
import Spinner from 'react-bootstrap/Spinner'; // Loading indicator
import { ethers } from 'ethers' // Library for interacting with Ethereum blockchain

// **useState**: Creates variables that can change (like `amount` and `isWaiting`)
// **props**: Information passed to the component (like `provider`, `price`, `crowdsale`)

/* The Buy component receives these values from its parent component:
    - provider: Connection to the Ethereum blockchain
    - price: Current price of one token in ETH
    - crowdsale: Reference to the crowdsale smart contract
    - setIsLoading: Function to update loading state in parent component*/
const Buy = ({ provider, price, crowdsale, setIsLoading }) => {
    // Create state variables that can change:
    const [amount, setAmount] = useState('0') // How many tokens the user wants to buy
    const [isWaiting, setIsWaiting] = useState(false) // Whether waiting for transaction confirmation

    // This function runs when the user submits the form to buy tokens
    const buyHandler = async (e) => { // 'e' is the event object triggered that contains information about the form submission
        e.preventDefault() // Prevent the default behavior of html forms to trigger host request which will refresh the page
        setIsWaiting(true) // Show the loading spinner while transaction is processing
        console.log('Buying tokens...', amount) // Log to console for debugging, showing the amount of tokens to buy

        try {
            // Get the user's wallet (signer) from the provider
            const signer = await provider.getSigner()
            /* ↑ 'signer' is an object that represents the user's wallet and needed to allow sign/authorize the transaction
                'signer' vs 'signers' - signer is a single wallet (first on the list), while signers is a list of wallets */

            // Calculate how much ETH is needed to buy the tokens:
                // multiply the token amount by the price/convert to the right format
            const value = ethers.utils.parseUnits((amount * price).toString(), 'ether')
                    /* ↑ 'value' is the amount of ETH needed to buy the tokens
                    'ether' means we're using 18 decimal places (standard for Ethereum) */
                // & Format the token amount for the blockchain (with 18 decimal places):
            const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')


            // Send the transaction to the crowdsale contract
            const transaction = await crowdsale.connect(signer).buyTokens(formattedAmount, { value: value })
                // ↑ "value" = how much ETH sending

            await transaction.wait() // Wait for the transaction to be confirmed on the blockchain
        } catch {
            //Error handling: (try and catch block)
            window.alert('User rejected or transaction reverted |or| not enough funds')
            // ↑ Show and alert upon error (ex: user rejecting the transaction or the transaction fails - ex: not enough ETH in wallet)
        }
        setIsLoading(true) // Tell the parent component to refresh data/page - updating UI to show the new state
    }

    // The UI for this component - a form with an input field and a button
    return (
        <Form onSubmit={buyHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
            {/* Form that triggers the buyHandler function when submitted */}
            <Form.Group as={Row}>
                <Col>
                    {/* Input field where user enters amount of tokens to buy */}
                    <Form.Control 
                        type="number" // Input type is number
                        min="1" // Minimum value is 1
                        placeholder="Enter amount"
                        onChange={(e) => setAmount(e.target.value)} // Update amount state when user types
                        // ↑ target = the form element that triggered the event
                        // ↑ value = the current value of the input field
                    />
                </Col>
                <Col className='text-center'>
                    {/* Show spinner when waiting, otherwise show the Buy button */}
                    {isWaiting ? (
                        <Spinner animation="border" />
                    ) : (
                        <Button variant="primary" type="submit" style={{ width: '100%' }}>
                            {/* Button to buy tokens */}
                            {amount < 1 ? (
                                <span disabled>Buy Tokens</span> // Button disabled if amount is less than 1
                            ) : (
                                <span>Buy Tokens</span>
                            )}
                            Buy Tokens
                        </Button>
                    )}
                </Col>
            </Form.Group>
        </Form>
    );
}

export default Buy; // Make this component available to other files

// ========== END OF BUY.JS ==========
