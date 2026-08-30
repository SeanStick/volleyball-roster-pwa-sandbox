import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  LogOut,
  Settings,
  ChevronDown,
  Users,
  Shield,
  Layers,
  Sparkles,
  Share2,
  ExternalLink,
  Check
} from 'lucide-react';

export default function UserMenu({
  user,
  syncStatus, // 'synced' | 'syncing' | 'offline' | 'error'
  lastSyncTime,
  activeTeam,
  onOpenAuthModal,
  onOpenTeamManagerModal,
  onOpenShareModal,
  onOpenFirebaseSettingsModal,
  onManualSync,
  onLogout
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name, email) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return 'CO';
  };

  const getSyncStatusBadge = () => {
    switch (syncStatus) {
      case 'syncing':
        return (
          <span
            className="sync-badge syncing"
            title="Syncing changes to Google Cloud Firestore..."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.4)'
            }}
          >
            <RefreshCw size={11} className="animate-spin" />
            <span>Syncing</span>
          </span>
        );
      case 'error':
        return (
          <span
            className="sync-badge error"
            title="Cloud sync issue. Your changes are safely preserved in local storage."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}
          >
            <CloudOff size={11} />
            <span>Sync Alert</span>
          </span>
        );
      case 'offline':
        return (
          <span
            className="sync-badge offline"
            title="Offline mode. Changes saved locally and will sync when reconnected."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}
          >
            <CloudOff size={11} />
            <span>Local Only</span>
          </span>
        );
      case 'synced':
      default:
        return (
          <span
            className="sync-badge synced"
            title="All rosters, match stats & lineups synced to Google Cloud"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }}
            />
            <span>Cloud Synced</span>
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => onOpenAuthModal('login')}
          className="btn btn-secondary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            fontSize: '0.82rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Cloud size={15} color="var(--accent-orange)" />
          <span>Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => onOpenAuthModal('register')}
          className="btn btn-primary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            fontSize: '0.82rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <span>Register</span>
        </button>
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'Coach';

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--border-glass)',
          borderRadius: '999px',
          padding: '4px 10px 4px 4px',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        {/* User Avatar */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid rgba(255, 107, 53, 0.6)'
            }}
          />
        ) : (
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b35, #ea580c)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.02em'
            }}
          >
            {getInitials(user.displayName, user.email)}
          </div>
        )}

        {/* Name and Sync Pill (Desktop) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.1 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName}
          </span>
          <div style={{ transform: 'scale(0.85)', transformOrigin: 'left center', marginTop: '1px' }}>
            {getSyncStatusBadge()}
          </div>
        </div>

        <ChevronDown size={14} color="var(--text-secondary)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '280px',
            background: 'rgba(10, 15, 29, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            padding: '0.6rem',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {/* User Profile Card */}
          <div
            style={{
              padding: '0.6rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '0.5rem'
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {user.providerId === 'google.com' ? 'Google Account' : 'Coach Account'}
              </span>
              {getSyncStatusBadge()}
            </div>
          </div>

          {/* Active Team Badge */}
          {activeTeam && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 107, 53, 0.1)',
                border: '1px solid rgba(255, 107, 53, 0.25)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-orange)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Team {activeTeam.shareCode ? `• ${activeTeam.shareCode}` : ''}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeTeam.teamName || 'CVA Black - 9th'}
                </div>
              </div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTeam.primaryColor || '#ff6b35' }} />
            </div>
          )}

          {/* Menu Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {onOpenShareModal && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenShareModal(activeTeam);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(255, 107, 53, 0.12)',
                  border: '1px solid rgba(255, 107, 53, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '2px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 107, 53, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 107, 53, 0.12)')}
              >
                <Share2 size={15} color="var(--accent-orange)" />
                <span>Share Squad & Invite Code</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onOpenTeamManagerModal) onOpenTeamManagerModal();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.75rem',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#f1f5f9',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Layers size={15} color="var(--accent-orange)" />
              <span>Manage & Switch Squads</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onManualSync) onManualSync();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#f1f5f9',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <RefreshCw size={15} color="#3b82f6" className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                <span>Sync Now</span>
              </div>
              {lastSyncTime && (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  {lastSyncTime}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onOpenFirebaseSettingsModal) onOpenFirebaseSettingsModal();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.75rem',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#f1f5f9',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Settings size={15} color="#94a3b8" />
              <span>Firebase Cloud Settings</span>
            </button>

            <div style={{ height: '1px', background: 'var(--border-glass)', margin: '0.4rem 0' }} />

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onLogout) onLogout();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.75rem',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#f87171',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
