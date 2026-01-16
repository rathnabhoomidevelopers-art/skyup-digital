/**
 * Setup for react-snap pre-rendering
 * This ensures proper timing for React 18 and Helmet meta tags
 */

if (typeof window !== 'undefined') {
  // Function called by react-snap before saving the HTML
  // This gives React time to finish rendering and Helmet time to update meta tags
  window.snapSaveState = () => {
    return new Promise((resolve) => {
      // Wait for any async operations like Helmet updates
      setTimeout(() => {
        resolve();
      }, 200);
    });
  };
}

const emptyObject = {};  // Assigning an empty object to a variable

export default emptyObject;  // Exporting the variable
