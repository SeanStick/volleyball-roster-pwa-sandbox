import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  BellRing,
  BellOff,
  Check,
  Smartphone,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Trophy,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import VolleyballIcon from './icons/VolleyballIcon';
import confetti from 'canvas-confetti';

export default function NotificationSettingsModal({ isOpen, onClose }) {
  const [permission, setPermission] = useState(() => notificationService.getPermissionStatus());
  const [prefs, setPrefs] = useState(() => notificationService.getPreferences());
  const [testCountdown, setTestCountdown] = useState(null);
  const [testSent, setTestSent] = useState(false);

  const isSupported = notificationService.isSupported();

  useEffect(() => {
    if (isOpen) {
      setPermission(notificationService.getPermissionStatus());
      setPrefs(notificationService.getPreferences());
      setTestSent(false);
      setTestCountdown(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTogglePref = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    notificationService.savePreferences(updated);
  };

  const handleRequestPermission = async () => {
    const res = await notificationService.requestPermission();
    setPermission(res.status);
    if (res.success) {
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.4 } });
      } catch {
        // ignore
      }
    }
  };

  const handleTriggerTest = () => {
    setTestCountdown(3);
    setTestSent(false);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setTestCountdown(count);
      } else {
        clearInterval(interval);
        setTestCountdown(null);
        setTestSent(true);
        notificationService.sendTestNotification();
      }
    }, 1000);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 24, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.18s ease-out'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          backgroundColor: '#0f172a',
          border: '1.5px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '18px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65), 0 0 30px rgba(168, 85, 247, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem 1.35rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.35) 0%, rgba(15, 23, 42, 0.6) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
              }}
            >
              <BellRing size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc' }}>
                Lock Screen & Background Alerts
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Receive real-time match scores and alerts when your phone is locked
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-icon"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.2rem 1.35rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Permission Status Banner */}
          {!isSupported ? (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem'
              }}
            >
              <AlertTriangle size={20} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fca5a5' }}>
                  Web Notifications Not Supported Here
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem', lineHeight: 1.4 }}>
                  If you are on an iPhone or iPad, tap the <strong>Share button</strong> at the bottom of Safari and select <strong>"Add to Home Screen"</strong>. Opening from your Home Screen unlocks full iOS lock screen notifications!
                </div>
              </div>
            </div>
          ) : permission === 'granted' ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0
                  }}
                >
                  <Check size={18} strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#f8fafc' }}>
                    Lock Screen Alerts Active
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>
                    Notifications are authorized to display on your device
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                Enabled
              </span>
            </div>
          ) : permission === 'denied' ? (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 800, fontSize: '0.88rem' }}>
                <BellOff size={18} />
                <span>Notifications Blocked</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                Notifications were blocked in your browser. To receive lock screen score updates, open your device's browser/site settings and set <strong>Notifications</strong> to <strong>Allow</strong>.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(126, 34, 206, 0.28) 100%)',
                border: '1.5px solid rgba(168, 85, 247, 0.6)',
                borderRadius: '12px',
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Smartphone size={22} color="#c084fc" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#f8fafc' }}>
                    Enable Lock Screen Alerts
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#e9d5ff' }}>
                    Allow alerts to see points & scores even with your screen turned off
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestPermission}
                className="btn btn-primary btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '8px',
                  boxShadow: '0 3px 12px rgba(168, 85, 247, 0.4)',
                  whiteSpace: 'nowrap'
                }}
              >
                Turn On
              </button>
            </div>
          )}

          {/* Alert Type Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Notification Triggers
            </span>

            {/* Master Toggle */}
            <div
              onClick={() => handleTogglePref('enabled')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Bell size={18} color="#a855f7" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    Background Alerts Active
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Master toggle for lock screen notifications
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enabled}
                onChange={() => {}}
                style={{ accentColor: '#a855f7', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {/* Score Updates */}
            <div
              onClick={() => handleTogglePref('notifyScoreUpdates')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                opacity: prefs.enabled ? 1 : 0.5
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <VolleyballIcon size={18} />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    Live Score Updates
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Alert on every point scored by our team or opponent
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enabled && prefs.notifyScoreUpdates}
                disabled={!prefs.enabled}
                onChange={() => {}}
                style={{ accentColor: '#3b82f6', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {/* Set Points & Match Points */}
            <div
              onClick={() => handleTogglePref('notifySetPoints')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                opacity: prefs.enabled ? 1 : 0.5
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Flame size={18} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    Set & Match Point Alerts
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    High-priority alert when serving for set or match
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enabled && prefs.notifySetPoints}
                disabled={!prefs.enabled}
                onChange={() => {}}
                style={{ accentColor: '#f59e0b', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {/* New Match Started */}
            <div
              onClick={() => handleTogglePref('notifyNewGame')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                opacity: prefs.enabled ? 1 : 0.5
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Trophy size={18} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    New Match Started
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Alert when a fresh game is kicked off on another device
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enabled && prefs.notifyNewGame}
                disabled={!prefs.enabled}
                onChange={() => {}}
                style={{ accentColor: '#10b981', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {/* Timeouts */}
            <div
              onClick={() => handleTogglePref('notifyTimeouts')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                opacity: prefs.enabled ? 1 : 0.5
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock size={18} color="#38bdf8" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    Timeouts Called
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Alert when either team calls a 60s timeout
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enabled && prefs.notifyTimeouts}
                disabled={!prefs.enabled}
                onChange={() => {}}
                style={{ accentColor: '#38bdf8', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {/* Sound & Vibration */}
            <div
              onClick={() => handleTogglePref('notifySound')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                opacity: prefs.enabled ? 1 : 0.5
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Volume2 size={18} color="#ec4899" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    Audio Chime & Vibration
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Play athletic point sound & vibrate phone
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enabled && prefs.notifySound}
                disabled={!prefs.enabled}
                onChange={() => {}}
                style={{ accentColor: '#ec4899', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Test Alert Button */}
          {permission === 'granted' && (
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px dashed rgba(168, 85, 247, 0.35)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#e9d5ff' }}>
                Test Your Lock Screen Notification
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                Tap the button below, then immediately turn off/lock your screen to see the live score card appear on your lock screen!
              </p>

              <button
                type="button"
                onClick={handleTriggerTest}
                disabled={testCountdown !== null}
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  padding: '0.45rem 1.1rem',
                  borderRadius: '8px',
                  boxShadow: '0 3px 12px rgba(168, 85, 247, 0.4)',
                  cursor: testCountdown !== null ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '0.3rem'
                }}
              >
                <Sparkles size={14} />
                <span>
                  {testCountdown !== null
                    ? `Sending in ${testCountdown}s (Lock phone now!)`
                    : testSent
                    ? '✓ Test Alert Sent! Test Again'
                    : 'Send Test Lock Screen Alert'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.85rem 1.35rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: 'rgba(15, 23, 42, 0.8)'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
