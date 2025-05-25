# Info.js Documentation
&nbsp;&nbsp;&nbsp;&nbsp;visit '../components/_w_notes/"".js' for code w/ embedded notes
## Overview
This is a simple component that displays the user's Ethereum account address and token balance. It's a small but important part of the UI that shows users their blockchain information.

## Props
The Info component receives two props (values passed from the parent):
- `account`: The user's Ethereum wallet address
- `accountBalance`: How many tokens the user owns

## Component Structure
The component renders a div containing two paragraphs:
1. The user's Ethereum account address
2. The number of tokens owned by the user

## How It Works
1. The parent component (App.js) gets the user's account address and token balance from the blockchain using ethers.js
2. The parent passes these values to this Info component as props
3. This component simply displays those values in a readable format
4. When the values change (e.g., user buys more tokens), the parent will pass the new values and this component will re-render with updated information

## Why This Component Exists
- Users need to know which Ethereum account they're connected with
- Users want to see their token balance at a glance
- Separating this into its own component makes the code more organized and maintainable

## Blockchain Concepts
- **Account**: A unique address on the Ethereum blockchain (starts with 0x...) that represents a user's wallet
- **Token Balance**: How many of the custom ERC-20 tokens the user owns

## Styling
The component uses Bootstrap's utility classes:
- `my-3`: Adds margin on the top and bottom (spacing)
- `<strong>`: Makes the label text bold

## Usage Example
```jsx
<Info 
  account="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" 
  accountBalance={42} 
/>
```

This would display:
```
Account: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
Tokens Owned: 42
```