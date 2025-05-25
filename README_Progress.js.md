# Progress.js Documentation
&nbsp;&nbsp;&nbsp;&nbsp;visit '../components/_w_notes/"".js' for code w/ embedded notes

## Overview
This component shows a progress bar that visualizes how many tokens have been sold in the crowdsale. It helps users understand how much of the token sale is complete by providing both a visual representation and exact numbers.

## Props
The Progress component receives two props (values passed from the parent):
- `maxTokens`: The total number of tokens available for sale
- `tokensSold`: How many tokens have been sold so far

## Component Structure
The component consists of:
1. A Bootstrap ProgressBar showing the percentage of tokens sold
2. A text display showing the exact numbers of tokens sold and total tokens

## How It Works
1. The parent component (App.js) passes in the current values for maxTokens and tokensSold
2. This component calculates what percentage of tokens have been sold: `(tokensSold / maxTokens) * 100`
3. It displays a visual progress bar filled to that percentage
4. It also shows the exact numbers below the bar for precise information

## Implementation Details
- Uses React Bootstrap's `ProgressBar` component
- Calculates the percentage dynamically based on the provided props
- Shows the percentage as a label on the progress bar
- Displays the raw numbers below the bar for precise information

## Styling
The component uses Bootstrap's utility classes:
- `my-3`: Adds margin on the top and bottom (spacing)
- `text-center`: Centers the text horizontally

## Usage in App.js
The Progress component is included in the main content area of the App component:

```jsx
<Progress maxTokens={maxTokens} tokensSold={tokensSold} />
```

## Visual Example
For example, if 250,000 out of 1,000,000 tokens have been sold:
- The progress bar would be filled to 25%
- The label on the bar would show "25%"
- The text below would show "250000 / 1000000 Tokens sold"

## Benefits
- Provides visual feedback on the crowdsale progress
- Helps users make informed decisions about participation
- Shows both percentage and exact numbers for different user preferences
- Updates dynamically as more tokens are sold