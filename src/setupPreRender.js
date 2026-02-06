/**
 * Setup for react-snap pre-rendering
 * This ensures proper timing for React 18 and Helmet meta tags
 */

if (typeof window !== 'undefined') {
  // Function called by react-snap before saving the HTML
  window.snapSaveState = () => {
    return new Promise((resolve) => {
      // Wait for:
      // 1. React 18 rendering to complete
      // 2. React Helmet Async to update meta tags
      // 3. Any lazy-loaded components
      // 4. Framer Motion animations to settle
      
      // Use requestIdleCallback if available, otherwise setTimeout
      const callback = () => {
        // Additional wait to ensure Helmet meta tags are in DOM
        setTimeout(() => {
          resolve();
        }, 1000); // Increased to 1000ms for better reliability
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 2000 });
      } else {
        setTimeout(callback, 100);
      }
    });
  };

  // Mark when rendering starts (for debugging)
  window.snapStartTime = Date.now();
  
  // Detect if running in react-snap
  if (navigator.userAgent === 'ReactSnap') {
    console.log('[REACT-SNAP] Pre-rendering in progress...');
  }
}

// Fix for ESLint warning: export as a named constant
const setupPreRender = {};
export default setupPreRender;