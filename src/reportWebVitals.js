// ========== BEGINNING OF REPORTWEBVITALS.JS ==========

/* BEGINNER'S GUIDE TO WEB VITALS:
    This file helps measure important performance metrics of your web application

    Web Vitals are Google's metrics for measuring user experience on websites
    They track things like page load time and interaction responsiveness*/

// Define the main function that will report performance metrics
const reportWebVitals = onPerfEntry => {
  // Only run if we're given a valid function to handle the metrics
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Import the web-vitals library only when needed (lazy loading)
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Each of these functions measures a different metric:
      
      getCLS(onPerfEntry);  // Cumulative Layout Shift: measures visual stability
                           // (how much elements move around while loading)
      
      getFID(onPerfEntry);  // First Input Delay: measures interactivity
                           // (time from first click to response)
      
      getFCP(onPerfEntry);  // First Contentful Paint: measures loading performance
                           // (time until first text/image appears)
      
      getLCP(onPerfEntry);  // Largest Contentful Paint: measures loading performance
                           // (time until main content has loaded)
      
      getTTFB(onPerfEntry); // Time to First Byte: measures server response time
                           // (how fast the server sends back the first byte of data)
    });
  }
};

export default reportWebVitals; // Export the function so it can be used in other files

/* HOW THIS WORKS:
  1. Your app calls this function with a callback (onPerfEntry)
  2. The function loads the web-vitals library
  3. It then measures various performance metrics
  4. Results are passed to your callback function
  5. You can then log or analyze these metrics

WHEN TO USE:
  - During development to identify performance issues
  - In production to monitor real user experience
  - When optimizing your application's performance

COMMON METRICS EXPLAINED:
  CLS (Cumulative Layout Shift):
    - Measures how much page content moves around while loading
    - Lower is better (less than 0.1 is good)

  FID (First Input Delay):
    - Measures time between user's first interaction and app's response
    - Lower is better (less than 100ms is good)

  FCP (First Contentful Paint):
    - Measures when first content appears on screen
    - Faster is better (less than 1.8s is good)

  LCP (Largest Contentful Paint):
    - Measures when main content has finished loading
    - Faster is better (less than 2.5s is good)

  TTFB (Time to First Byte):
    - Measures how fast server starts sending data
    - Faster is better (less than 0.6s is good) */

// ========== END OF REPORTWEBVITALS.JS ==========
