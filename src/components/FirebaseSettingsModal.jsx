import React, { useState, useEffect } from 'react';
import { X, Cloud, Check, RefreshCw, Terminal, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { firebaseService } from '../services/firebaseService';

export default function FirebaseSettingsModal({ isOpen, onClose, roster, teamSettings, onCloudSyncSuccess }) {
  const [configText, setConfigText] = useState('');
  const [projectId, setProjectId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = firebaseService.getStoredConfig();
      if (stored) {
        setProjectId(stored.projectId || '');
        setApiKey(stored.apiKey || '');
        setAuthDomain(stored.authDomain || '');
        setConfigText(JSON.stringify(stored, null, 2));
      }
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleParseJsonConfig = (text) => {
    setConfigText(text);
    try {
      // Clean up common JS object copy-pastes
      let cleaned = text.trim();
      if (cleaned.startsWith('const firebaseConfig =')) {
        cleaned = cleaned.replace(/^const\s+firebaseConfig\s*=\s*/, '').replace(/;$/, '');
      }
      // If it has unquoted keys, attempt to parse or extract
      const parsed = Function(`'use strict'; return (${cleaned})`)();
      if (parsed && typeof parsed === 'object') {
        if (parsed.projectId) setProjectId(parsed.projectId);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      }
    } catch (e) {
      // Not a fatal error while user is typing
    }
  };

  const handleSaveConfig = () => {
    if (!projectId || !apiKey) {
      setStatusMsg({ type: 'error', text: 'Project ID and API Key are required.' });
      return;
    }

    const config = {
      apiKey,
      projectId,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      storageBucket: `${projectId}.appspot.com`,
    };

    firebaseService.saveConfig(config);
    setStatusMsg({ type: 'success', text: 'Firebase configuration saved locally!' });
  };

  const handleCloudSync = async () => {
    if (!firebaseService.isConfigured()) {
      handleSaveConfig();
    }
    setIsSyncing(true);
    setStatusMsg(null);

    const res = await firebaseService.syncRosterToCloud(roster, teamSettings);
    setIsSyncing(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: 'Roster successfully synced to Google Cloud Firestore!' });
      if (onCloudSyncSuccess) onCloudSyncSuccess();
    } else {
      setStatusMsg({ type: 'error', text: `Sync failed: ${res.error}` });
    }
  };

  const handleFillDemoConfig = () => {
    const demo = {
      apiKey: "AIzaSyDemoKeyForVolleyballRosterPWA987",
      authDomain: "gostandoverthere-volleyball.firebaseapp.com",
      projectId: "gostandoverthere-volleyball",
      storageBucket: "gostandoverthere-volleyball.appspot.com"
    };
    setProjectId(demo.projectId);
    setApiKey(demo.apiKey);
    setAuthDomain(demo.authDomain);
    setConfigText(JSON.stringify(demo, null, 2));
    firebaseService.saveConfig(demo);
    setStatusMsg({ type: 'success', text: 'Demo project settings applied!' });
  };

  const isConfigured = firebaseService.isConfigured();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cloud size={20} color="#ffffff" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>Firebase & Cloud Hosting</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Google Cloud Firebase Hosting & Realtime Sync
              </p>
            </div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {statusMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: statusMsg.type === 'success' ? '#34d399' : '#f87171',
            border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {statusMsg.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Firebase Hosting Deployment Instructions */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.88rem' }}>
            <Terminal size={16} />
            Deploy to Firebase Hosting (CLI)
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
            This PWA is pre-configured with <code>firebase.json</code>. Run these commands from your terminal to deploy:
          </p>
          <pre style={{
            background: '#030712',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            color: '#a5f3fc',
            overflowX: 'auto',
            fontFamily: 'monospace'
          }}>
{`# 1. Login to Firebase
npx firebase-tools login

# 2. Build and deploy to Firebase Hosting
npm run deploy`}
          </pre>
        </div>

        {/* Firebase SDK Config Inputs */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Firebase Web Config (Paste from Firebase Console)</label>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
              onClick={handleFillDemoConfig}
            >
              Fill Demo Config
            </button>
          </div>
          <textarea
            rows="3"
            className="form-textarea"
            placeholder='const firebaseConfig = { apiKey: "...", projectId: "..." };'
            value={configText}
            onChange={(e) => handleParseJsonConfig(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. volleyball-d2085"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">API Key</label>
            <input
              type="text"
              className="form-input"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSaveConfig}
          >
            <Check size={16} /> Save Config
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCloudSync}
            disabled={isSyncing}
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Roster to Cloud'}
          </button>
        </div>
      </div>
    </div>
  );
}
