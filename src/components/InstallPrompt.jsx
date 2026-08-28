import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed recently
      const dismissed = sessionStorage.getItem('pwa_install_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="install-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent-orange), #ea580c)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(255, 107, 53, 0.4)'
        }}>
          <Smartphone size={20} color="#ffffff" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.15rem' }}>
            Install Go Stand Over There PWA
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Add to home screen for instant offline court access & full-screen mode.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button className="btn btn-primary btn-sm" onClick={handleInstallClick}>
          <Download size={14} /> Install
        </button>
        <button className="btn-icon btn-sm" onClick={handleDismiss} title="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
