# Navigation.js Documentation

## Overview
This file creates the navigation bar component that appears at the top of the DApp. It's a simple component that displays the logo and the name of the application, creating a consistent header across all pages.

## Component Structure
The Navigation component consists of:
1. A React Bootstrap Navbar container
2. An image element displaying the application logo
3. A Navbar.Brand element showing the application name "DApp ICO Crowdsale"

## Implementation Details

### Imports
- `Navbar` from React Bootstrap: Provides a pre-styled navigation bar component
- `logo` from '../logo.png': Imports the logo image file directly into the JavaScript

### Component Definition
The Navigation component is defined as a functional component using arrow function syntax, which is the modern approach to creating React components.

### Rendered Elements
- `<Navbar>`: The main container with margin on top and bottom
- `<img>`: The logo image with specific dimensions and styling
- `<Navbar.Brand>`: The application name displayed as a brand element

## Styling
The component uses Bootstrap's utility classes:
- `my-3`: Adds margin on the y-axis (top and bottom)
- `d-inline-block`: Sets the display property to inline-block
- `align-top`: Aligns the image to the top
- `mx-3`: Adds margin on the x-axis (left and right)

## Image Properties
- `alt="logo"`: Alternative text for accessibility
- `src={logo}`: Source of the image (imported from logo.png)
- `width="40"` and `height="40"`: Dimensions in pixels

## Usage in App.js
The Navigation component is included at the top of the main App component:

```jsx
<Container>
  <Navigation />
  {/* Rest of the application */}
</Container>
```

## Benefits
- Creates a consistent brand identity across the application
- Provides visual context for users
- Follows standard web design patterns for application headers
- Uses React Bootstrap for responsive design that works on different screen sizes