// ========== LOADING.JS ==========

/* This is a simple Loading component that shows a spinner and text to indicate that data is being loaded.
    Loading component is displayed:
    - When the app first connects to the blockchain
    - When waiting for transaction data to be fetched
    - After a user completes a transaction and the UI needs to refresh*/

    import Spinner from 'react-bootstrap/Spinner';// Import the Spinner component from React Bootstrap

    // Define the Loading component:
        // A "functional component" - a function that returns JSX (React's HTML-like syntax)
    const Loading = () => {
        // The component returns this JSX to be rendered on the screen
        return (
            // A div container with CSS classes for styling:
                // - 'text-center' centers the content horizontally
                // - 'my-5' adds margin on the top and bottom (spacing)
            <div className='text-center my-5'>
                {/* The Spinner component with "grow" animation style */}
                {/* This creates a pulsing circle animation */}
                <Spinner animation="grow" />
                
                {/* A paragraph with the loading message */}
                {/* 'my-2' adds a small margin above and below the text */}
                <p className='my-2'>Loading Data...</p>
            </div>
        );
    }
    
    export default Loading // Export the component so it can be imported and used in other files
    
    // ========== END OF LOADING.JS ==========
    