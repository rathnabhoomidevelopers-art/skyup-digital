import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

// Import pre-render setup file (we'll create this in the next step)
import './setupPreRender';

const rootElement = document.getElementById('root');

// Check if HTML was pre-rendered by react-snap
if (rootElement.hasChildNodes()) {
  // Hydrate the pre-rendered HTML - this is the React 18 way
  ReactDOM.hydrateRoot(
    rootElement,
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
} else {
  // Normal render for development when there's no pre-rendered HTML
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}