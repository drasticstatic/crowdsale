# Understanding React Props

## What is a Prop?

In React, a "prop" (short for "property") is a way to send/pass data/values from a parent component to a child component.

- Think of props like arguments to a function
- Props are read-only data that can't be modified by the receiving component
- Props can be any JavaScript data type (strings, numbers, objects, functions)

## How Props Work:

```jsx
// Parent component passes values to child
<Progress maxTokens={1000000} tokensSold={250000} />

// Child component receives these values
const Progress = ({ maxTokens, tokensSold }) => {
    // ...component code
}

// The child can then use these values
<p>{tokensSold} / {maxTokens} Tokens sold</p>
```
<br>

## Real-World Examples:
### *===* <u>__'PROGRESS' Component__</u> *===*

&nbsp;&nbsp;&nbsp;&nbsp;
The `Progress` component is a great example of how props can be used to make components reusable and focused

&nbsp;&nbsp;&nbsp;&nbsp;
In the Progress.js component:
- `maxTokens` and `tokensSold` are props that allow the component to calculate and display the progress percentage without needing to know where that data came from
- By passing `maxTokens` and `tokensSold` as props, the parent component can handle/control the data and where it comes from, while the `Progress` component can focus solely on its specific job (rendering the progress bar/(showing progress)

```jsx
// How the Progress component is used
<Progress maxTokens={1000000} tokensSold={250000} />
```
&nbsp;&nbsp;&nbsp;&nbsp;
<u>Visual Example</u>:
- The Progress component above would render a progress bar showing 25% completion, with the text "250000 / 1000000 Tokens sold" displayed below it -- like this:
<div style="width:100%; background:#eee; border-radius:5px;">
  <div style="width:25%; background:#007bff; height:20px; border-radius:5px;">
    <span style="padding:0 10px; color:white;">25%</span>
  </div>
</div>
<p style="text-align:center;">250000 / 1000000 Tokens sold</p>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<em>This visual example shows correctly in VScode's .md preview but not on GitHub<p>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Added Emoji-based representation to .md for reference:</em>

        🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬜⬜⬜⬜⬜⬜⬜ 25%

<br>

### *===* <u>INFO Component</u> *===*

&nbsp;&nbsp;&nbsp;&nbsp;
In the Info.js component:
- `account` and `accountBalance` are props that display the user's Ethereum address and token balance
- The component simply presents this data without needing to know how to connect to the blockchain


```jsx
// How the Info component is defined
const Info = ({ account, accountBalance }) => {
    return (
        <div className="my-3">
            <p><strong>Account:</strong> {account}</p>
            <p><strong>Tokens Owned:</strong> {accountBalance}</p>
        </div>
    );
}

// How the Info component is used
<Info account="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" accountBalance={42} />
```
<br>

## This pattern of passing data through props allows React components to be:
1. <u>__Reusable__</u> - the same component can display different data
    - <u>Note</u>: how the `Progress` component <u>can be used in different contexts with varying data</u>

2. <u>__Focused__</u> - each component handles one specific job
    - <u>Note</u>: how the `Progress` component <u>only handles the display logic for the progress bar</u>

3. <u>__Maintainable__</u> - changes to data handling don't require changes to display components
    - <u>Note</u>: how <u>changes to the data source</u> <u>don't require modifications</u> to the `Progress` component