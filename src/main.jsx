import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// Register Service Worker for PWA Offline Support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    // Clean up stale v1 cache immediately
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name === 'gostandoverthere-v1') {
            caches.delete(name);
          }
        });
      });
    }

    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Go Stand Over There PWA ServiceWorker registered:', registration.scope);
        // Force check for updates immediately on load
        registration.update();
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
