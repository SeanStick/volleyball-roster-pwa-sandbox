import React, { useState, useEffect } from 'react';
import { X, Cloud, Check, RefreshCw, Terminal, ExternalLink, ShieldCheck, AlertCircle, Key, Database, Lock } from 'lucide-react';
import { firebaseService } from '../services/firebaseService';

export default function FirebaseSettingsModal({ isOpen, onClose, onConfigSaved, onTriggerSync }) {
  const [configText, setConfigText] = useState('');
  const [projectId, setProjectId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = firebaseService.getStoredConfig();
      if (stored) {
        setProjectId(stored.projectId || '');
        setApiKey(stored.apiKey || '');
        setAuthDomain(stored.authDomain || '');
        setStorageBucket(stored.storageBucket || '');
        setConfigText(JSON.stringify(stored, null, 2));
      }
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleParseJsonConfig = (text) => {
    setConfigText(text);
    try {
      let cleaned = text.trim();
      if (cleaned.startsWith('const firebaseConfig =')) {
        cleaned = cleaned.replace(/^const\s+firebaseConfig\s*=\s*/, '').replace(/;$/, '');
      }
      const parsed = Function(`'use strict'; return (${cleaned})`)();
      if (parsed && typeof parsed === 'object') {
        if (parsed.projectId) setProjectId(parsed.projectId);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.authDomain) setAuthDomain(parsed.authDomain);
        if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);
      }
    } catch (e) {
      // Keep typing
    }
  };

  const handleSaveConfig = () => {
    if (!projectId || !apiKey) {
      setStatusMsg({ type: 'error', text: 'Project ID and API Key are required.' });
      return;
    }

    const config = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
    };

    firebaseService.saveConfig(config);
    setStatusMsg({ type: 'success', text: 'Firebase configuration saved! Authentication & Firestore are now active.' });
    if (onConfigSaved) onConfigSaved(config);
  };

  const handleFillProductionConfig = () => {
    const prod = {
      apiKey: "AIzaSyB31G_LiveConfigExampleForVolleyball",
      authDomain: "volleyball-d2085.firebaseapp.com",
      projectId: "volleyball-d2085",
      storageBucket: "volleyball-d2085.firebasestorage.app"
    };
    setProjectId(prod.projectId);
    setApiKey(prod.apiKey);
    setAuthDomain(prod.authDomain);
    setStorageBucket(prod.storageBucket);
    setConfigText(JSON.stringify(prod, null, 2));
  };

  const isConfigured = firebaseService.isConfigured();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
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
              <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>Google Cloud Firebase Settings</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Firebase Authentication, Firestore Database & Hosting Sync
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

        {/* Feature Overview Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
              <Lock size={15} /> Firebase Authentication
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Supports Email/Password and 1-Click Google Sign-in to tie rosters and matches to coach logins.
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
              <Database size={15} /> Cloud Firestore
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Real-time synchronization for multiple squads, active 6-position court lineups, and match history.
            </p>
          </div>
        </div>

        {/* Firebase SDK Config Inputs */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Paste Config from Firebase Console</label>
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
            >
              Firebase Console <ExternalLink size={12} />
            </a>
          </div>
          <textarea
            rows="3"
            className="form-textarea"
            placeholder='const firebaseConfig = { apiKey: "...", projectId: "volleyball-d2085" };'
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSaveConfig}
          >
            <Check size={16} /> Save Configuration
          </button>

          {onTriggerSync && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onTriggerSync}
            >
              <RefreshCw size={16} />
              Sync Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
