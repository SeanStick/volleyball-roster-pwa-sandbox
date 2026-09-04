import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// Register Service Worker for PWA Offline Support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    // Purge any stale legacy caches immediately
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name !== 'gostandoverthere-v3') {
            caches.delete(name);
          }
        });
      });
    }

    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Go Stand Over There PWA ServiceWorker registered:', registration.scope);
        registration.update();
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// Global App Error Boundary to prevent blank white screens
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error caught by boundary:', error, errorInfo);
  }

  handleHardRefresh = async () => {
    try {
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(name => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
    window.location.reload(true);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0a0f1d',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏐</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ff6b35' }}>
            Go Stand Over There
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            An update was loaded. Tap below to refresh your app and get the latest version.
          </p>
          <button
            onClick={this.handleHardRefresh}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            🔄 Refresh & Update App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
