// ========== PROGRESS.JS ==========

/*This is a simple Info component that displays the user's account address and token balance
    It's a small but important part of the UI that shows users their blockchain information

Define the Info component:
    This component receives two props (values passed from the parent):
        account: The user's Ethereum wallet address
        accountBalance: How many tokens the user owns*/
const Info = ({ account, accountBalance }) => {
    // The component returns this JSX to be rendered on the screen
    return (
        // A div container with 'my-3' class for margin spacing on top and bottom
        <div className="my-3">
            {/* Display the user's Ethereum wallet address
                The <strong> tag makes "Account:" appear in bold */}
            <p><strong>Account:</strong> {account}</p>

            {/* Display how many tokens the user owns
                The {accountBalance} displays the actual number passed in from the parent */}
            <p><strong>Tokens Owned:</strong> {accountBalance}</p>
        </div>
    );
}

export default Info; // Export the component so it can be imported and used in other files

/* HOW IT WORKS:
    1. The parent component (likely App.js) gets the user's account address and token balance from the blockchain using a library like ethers.js
    2. The parent passes these values to this Info component as props
    3. This component simply displays those values in a readable format
    4. When the values change (e.g., user buys more tokens), the parent will pass the new values and this component will re-render with updated information

    WHY THIS COMPONENT EXISTS:
    - Users need to know which Ethereum account they're connected with
    - Users want to see their token balance at a glance
    - Separating this into its own component makes the code more organized and maintainable

    BLOCKCHAIN CONCEPTS:
    - Account: A unique address on the Ethereum blockchain (starts with 0x...) that represents a user's wallet
    - Token Balance: How many of the custom ERC-20 tokens the user owns

// ========== END OF INFO.JS ==========
