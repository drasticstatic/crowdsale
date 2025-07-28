// ========== BEGINNING OF INDEX.JS ==========

/* BEGINNER'S GUIDE TO INDEX.JS
    This is the main entry point of your React application
    It's responsible for starting up your app and rendering it to the webpage*/

// Import necessary dependencies:
import React from 'react';// React - The core React library
import ReactDOM from 'react-dom/client';// ReactDOM - Handles rendering React components in the browser
import './index.css';// CSS files for styling
import 'bootstrap/dist/css/bootstrap.css'// Bootstrap - A popular CSS framework for styling
import App from './components/App';// App - Your main application component
import reportWebVitals from './reportWebVitals';// Performance monitoring tool

// Create the root element where your React app will live:
const root = ReactDOM.createRoot(document.getElementById('root'));
// 'root' is an HTML element in your index.html file with id="root"

// Render your application:
root.render(
  <React.StrictMode>
    {/* StrictMode is a development tool that highlights potential problems */}
    {/* App is your main component that contains all other components */}
    <App />
  </React.StrictMode>
);

/* To start measuring performance metrics in app:
    Pass a function here to handle the metrics data/log results
    You can send this data to an analytics endpoint or log it to the console
      For example: reportWebVitals(console.log) would log metrics to the console
    Learn more: https://bit.ly/CRA-vitals*/
reportWebVitals();

/* HOW THIS WORKS:
  1. When your app starts, this file runs first
  2. It imports all necessary dependencies
  3. Finds the 'root' element in your HTML
  4. Creates a React root in that element
  5. Renders your App component inside that root
  6. Starts monitoring performance

IMPORTANT CONCEPTS:
  - This file connects your React code to the actual webpage
  - StrictMode helps find common bugs during development
  - The 'root' element is where your entire React app lives
  - Performance monitoring helps optimize your app

FILE RELATIONSHIPS:
  - index.html contains the 'root' element
  - App.js contains your main application code
  - index.css contains global styles
  - reportWebVitals.js handles performance monitoring */

// ========== END OF INDEX.JS ==========
