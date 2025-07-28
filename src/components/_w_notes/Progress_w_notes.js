// ========== PROGRESS.JS ==========

/* This component shows a progress bar that visualizes how many tokens have been sold
    To help users understand how much of the token sale is complete

HOW THIS WORKS:
    1. The parent component passes in the current values for maxTokens and tokensSold
    2. This component calculates what percentage of tokens have been sold
    3. It displays a visual progress bar filled to that percentage
    4. It also shows the exact numbers below the bar for precise information*/

import ProgressBar from 'react-bootstrap/ProgressBar'; // Import the ProgressBar component from React Bootstrap
// ↑ A ProgressBar is a visual element that shows completion percentage

/* Define the Progress component:
    // This component receives two props (values passed from the parent):
        - maxTokens: The total number of tokens available for sale
        - tokensSold: How many tokens have been sold so far*/
const Progress = ({ maxTokens, tokensSold }) => {
    // The component returns this JSX to be rendered on the screen
    return (
        // A div container with 'my-3' class for margin spacing on top and bottom
        <div className='my-3'>
            {/* The ProgressBar component with:
                - 'now' prop: Sets how full the bar is (calculated as a percentage)
                - 'label' prop: The text shown on the progress bar */}
            <ProgressBar
                now={((tokensSold / maxTokens) * 100)} // Calculate percentage of tokens sold
                label={`${(tokensSold / maxTokens) * 100}%`} // Show percentage as text on the bar
            />

            {/* A paragraph showing the exact numbers below the progress bar
                - 'text-center' centers the text horizontally
                - 'my-3' adds margin above and below the text */}
            <p className='text-center my-3'>{tokensSold} / {maxTokens} Tokens sold</p>
        </div>
    );
}

export default Progress; // Export the component so it can be imported and used in other files

// ========== END OF PROGRESS.JS ==========
