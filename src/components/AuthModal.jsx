import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Cloud,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  LogIn,
  UserPlus,
  Zap
} from 'lucide-react';
import { firebaseService } from '../services/firebaseService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register' | 'forgot'
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSwitchTab = (newTab) => {
    handleResetForm();
    setTab(newTab);
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await firebaseService.loginWithEmail(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Successfully signed in!');
      if (onAuthSuccess) onAuthSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await firebaseService.registerWithEmail(email, password, displayName);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account created successfully! Your volleyball team data will now sync to Google Cloud.');
      if (onAuthSuccess) onAuthSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await firebaseService.loginWithGoogle();
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Welcome, ${res.user.displayName || 'Coach'}!`);
      if (onAuthSuccess) onAuthSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleForgotPassword = async (e) => {
    e?.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await firebaseService.resetPassword(email);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || 'Password reset instructions have been sent to your email.');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setErrorMsg(null);

    const res = await firebaseService.registerWithEmail(
      'coach.demo@volleyball.app',
      'password123',
      'Coach Alex'
    );
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Signed in as Coach Alex (Demo Account)!');
      if (onAuthSuccess) onAuthSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px', padding: '1.75rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="btn-icon btn-sm"
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
        >
          <X size={18} />
        </button>

        {/* Modal Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ea580c 50%, #1e3a8a 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)',
              marginBottom: '0.75rem'
            }}
          >
            <Cloud size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            {tab === 'login' && 'Sign In to Your Account'}
            {tab === 'register' && 'Create Coach Account'}
            {tab === 'forgot' && 'Reset Your Password'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem', marginBottom: 0 }}>
            {tab === 'login' && 'Sync your volleyball roster, match stats, and lineups across all devices.'}
            {tab === 'register' && 'Save rosters, 6-2 formations, and saved games to Google Cloud.'}
            {tab === 'forgot' && "Enter your email and we'll send password reset instructions."}
          </p>
        </div>

        {/* Navigation Tabs (Login vs Register) */}
        {tab !== 'forgot' && (
          <div
            style={{
              display: 'flex',
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              marginBottom: '1.25rem'
            }}
          >
            <button
              type="button"
              onClick={() => handleSwitchTab('login')}
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: tab === 'login' ? 'var(--accent-orange)' : 'transparent',
                color: tab === 'login' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <LogIn size={15} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab('register')}
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: tab === 'register' ? 'var(--accent-orange)' : 'transparent',
                color: tab === 'register' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <UserPlus size={15} /> Register
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.82rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Google Sign-In */}
        {tab !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.7rem 1rem',
                background: '#ffffff',
                color: '#1f2937',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.15s, opacity 0.15s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or with email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
            </div>
          </>
        )}

        {/* Sign In Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                />
                <input
                  type="email"
                  required
                  placeholder="coach@volleyball.com"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', margin: 0 }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('forgot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-orange)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              <LogIn size={16} />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                Coach or Team Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                />
                <input
                  type="text"
                  placeholder="Coach Stickrod"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                />
                <input
                  type="email"
                  required
                  placeholder="coach@volleyball.com"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                Password (min. 6 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              <UserPlus size={16} />
              {loading ? 'Creating Account...' : 'Create Account & Enable Cloud Sync'}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                Account Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                />
                <input
                  type="email"
                  required
                  placeholder="coach@volleyball.com"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              <KeyRound size={16} />
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => handleSwitchTab('login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Quick Demo Mode Pill */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Quick preview without typing:
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleQuickDemo}
            disabled={loading}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
          >
            <Zap size={13} color="#f59e0b" /> Demo Account
          </button>
        </div>
      </div>
    </div>
  );
}
