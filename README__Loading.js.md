# Loading.js Documentation

## Overview
This is a simple Loading component that shows a spinner and text to indicate that data is being loaded from the blockchain.

## Component Structure
The component consists of:
1. A Bootstrap Spinner with a "grow" animation
2. A text message "Loading Data..."

## When It's Used
The Loading component is displayed:
- When the app first connects to the blockchain
- When waiting for transaction data to be fetched
- After a user completes a transaction and the UI needs to refresh

## Implementation Details
- Uses React Bootstrap's `Spinner` component
- The spinner has a "grow" animation style, creating a pulsing circle
- The component is wrapped in a div with text-center alignment
- Proper spacing is applied using Bootstrap's utility classes

## Styling
The component uses Bootstrap's utility classes:
- `text-center`: Centers the content horizontally
- `my-5`: Adds significant margin on the top and bottom (spacing)
- `my-2`: Adds a smaller margin above and below the text

## Usage in App.js
The Loading component is conditionally rendered in App.js when the `isLoading` state is true:

```jsx
{isLoading ? (
  <Loading />
) : (
  // Main content components
)}
```

## Benefits
- Provides visual feedback to users during asynchronous operations
- Improves user experience by indicating that the application is working
- Simple, reusable component that can be used throughout the application
- Consistent loading indicator across the application