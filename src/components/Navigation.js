// ========== NAVIGATION.JS ==========

/* This file creates the navigation bar component that appears at the top of our DApp.
    It's a simple component that displays the logo and the name of our application.

 * WHAT THIS COMPONENT DOES:
    - Displays the app logo
    - Shows the app name "DApp ICO Crowdsale"
    - Creates a consistent header across all pages
 */

    import Navbar from 'react-bootstrap/Navbar'; // Import the Navbar component from React Bootstrap library
    // ↑ React Bootstrap provides pre-styled components that follow Bootstrap design principles

import logo from '../logo.png'; // Import the logo image file
    // ↑ In React, we import images directly into our JavaScript files
    // ↑ This allows webpack (the build tool) to include them in the final bundle

// Define the Navigation component as an arrow function:
// ↑ (This is a functional component, which is the modern way to create React components)
const Navigation = () => {
    return ( // The return statement defines what HTML this component will render
        <Navbar className='my-3'> {/* Navbar component from React Bootstrap: */}
            {/* ↑ 'my-3' is a Bootstrap class that adds margin on the y-axis (top and bottom) */}
            {/* ↓ Image element for our logo */}
            <img
                alt="logo"                       // Alt text for accessibility
                src={logo}                       // Source of the image (our imported logo)
                width="40"                       // Width in pixels
                height="40"                      // Height in pixels
                className="d-inline-block align-top mx-3"  // Bootstrap classes for styling:
                                                // ↑ d-inline-block: display as inline-block
                                                // ↑ align-top: align to the top
                                                // ↑ mx-3: margin on x-axis (left and right)
            />
            {/* Navbar.Brand creates the main title in the navbar */}
            {/* href="#" makes it look like a link, but it doesn't navigate anywhere */}
            <Navbar.Brand href="#">DApp ICO Crowdsale</Navbar.Brand>
        </Navbar>
    );
}

export default Navigation;
// ↑ Export the Navigation component so it can be imported and used in other files
    // This is how we make the component available to other parts of our application

// ========== END OF NAVIGATION.JS ==========
