import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  LogOut,
  ChevronDown,
  Users,
  Shield,
  Layers,
  Sparkles,
  Share2,
  ExternalLink,
  Check,
  PenTool,
  Dumbbell,
  BellRing,
  ShieldCheck,
  Crown,
  BarChart3,
  FileText
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';

export default function UserMenu({
  user,
  syncStatus, // 'synced' | 'syncing' | 'offline' | 'error'
  lastSyncTime,
  activeTeam,
  lastScoreEvent,
  userRole = 'head_coach',
  onUpdateUserRole,
  onOpenAuthModal,
  onOpenTeamManagerModal,
  onOpenShareModal,
  onOpenFirebaseSettingsModal,
  onOpenMatchWizard,
  onOpenLineupStudio,
  onOpenWhiteboard,
  onOpenDrills,
  onOpenNotificationSettings,
  onOpenMatchStats,
  onOpenOfficialSheet,
  onOpenR2LineupCard,
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
    if (name && typeof name === 'string' && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.trim().substring(0, 2).toUpperCase();
    }
    if (email && typeof email === 'string') return email.substring(0, 2).toUpperCase();
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

  const displayName = user ? (user.displayName || user.email?.split('@')[0] || 'Coach') : 'Coach';

  // Helper for dot indicator on avatar
  const getSyncDotColor = () => {
    if (!user) return '#64748b';
    switch (syncStatus) {
      case 'syncing':
        return '#3b82f6';
      case 'error':
        return '#ef4444';
      case 'synced':
      default:
        return '#10b981';
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: isOpen ? 1005 : 'auto' }} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className="user-menu-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Open Coach Profile, Stats & Team Tools"
        id="btn-top-profile-menu"
      >
        {/* User Avatar with Sync Dot */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(255, 107, 53, 0.6)'
              }}
            />
          ) : (
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b35, #ea580c)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.74rem',
                letterSpacing: '0.02em',
                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
              }}
            >
              {user ? getInitials(user.displayName, user.email) : <User size={15} />}
            </div>
          )}

          {/* Micro Status Dot */}
          <span
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: getSyncDotColor(),
              border: '1.5px solid #0f172a',
              boxShadow: `0 0 6px ${getSyncDotColor()}`
            }}
          />
        </div>

        {/* Name and Sync Pill (Desktop Only) */}
        <div className="user-menu-desktop-info">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user ? displayName : 'Coach Profile'}
          </span>
          <div style={{ transform: 'scale(0.85)', transformOrigin: 'left center', marginTop: '1px' }}>
            {user ? getSyncStatusBadge() : (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.08)'
                }}
              >
                Tools & Stats
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          size={14}
          color="var(--text-secondary)"
          className="user-menu-desktop-chevron"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 'min(330px, 92vw)',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: 'rgba(10, 15, 29, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65)',
            zIndex: 1005,
            padding: '0.65rem',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {/* User Profile Card (Authenticated or Guest) */}
          {user ? (
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
          ) : (
            <div
              style={{
                padding: '0.6rem 0.75rem',
                background: 'rgba(255, 107, 53, 0.1)',
                border: '1px solid rgba(255, 107, 53, 0.25)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ffffff' }}>Coach Profile (Guest)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Local device storage</div>
              </div>
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAuthModal('login');
                  }}
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.74rem',
                    borderRadius: '999px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          )}

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
                  {activeTeam.teamName || 'Apex Elite - 16U'}
                </div>
              </div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTeam.primaryColor || '#ff6b35' }} />
            </div>
          )}

          {/* 👑 USER ROLE & STAFF ACCESS SETTING */}
          <div
            style={{
              padding: '0.65rem 0.75rem',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.14) 0%, rgba(30, 41, 59, 0.6) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '0.55rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={14} color="#c084fc" />
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#e9d5ff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Role & Staff Mode
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '999px',
                  background: (userRole === 'head_coach' || userRole === 'assistant_coach') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                  color: (userRole === 'head_coach' || userRole === 'assistant_coach') ? '#34d399' : '#94a3b8',
                  border: `1px solid ${(userRole === 'head_coach' || userRole === 'assistant_coach') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(148, 163, 184, 0.3)'}`
                }}
              >
                {(userRole === 'head_coach' || userRole === 'assistant_coach') ? '👑 Coach Privileges' : 'Spectator / Player'}
              </span>
            </div>

            {/* 4 Role Selector Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
              {[
                { id: 'head_coach', label: 'Head Coach', icon: '👑', desc: 'Full tactical control' },
                { id: 'assistant_coach', label: 'Asst Coach', icon: '📋', desc: 'Huddle & whiteboard' },
                { id: 'player', label: 'Player', icon: '🏐', desc: 'Court & lineup view' },
                { id: 'parent', label: 'Parent / Fan', icon: '👥', desc: 'Live scoreboard' }
              ].map(role => {
                const isSelected = userRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => onUpdateUserRole && onUpdateUserRole(role.id)}
                    style={{
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(168, 85, 247, 0.35)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1.5px solid ${isSelected ? '#c084fc' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: isSelected ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{role.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 800, whiteSpace: 'nowrap' }}>{role.label}</div>
                      <div style={{ fontSize: '0.62rem', color: isSelected ? '#e9d5ff' : '#64748b' }}>{role.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              👥 LIVE CO-COACHES & SCOREKEEPERS SECTION
             ========================================================= */}
          <div
            style={{
              padding: '0.65rem 0.75rem',
              background: 'rgba(30, 41, 59, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '0.6rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={13} color="#60a5fa" />
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Scorers & Co-Coaches
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '999px',
                  padding: '1px 6px'
                }}
              >
                {(() => {
                  const mList = Array.isArray(activeTeam?.members) ? activeTeam.members : Object.values(activeTeam?.members || {});
                  const othersOnline = mList.filter(m => m.uid !== user?.uid && m.lastActiveAt && (Date.now() - new Date(m.lastActiveAt).getTime()) < 1500000).length;
                  return `${1 + othersOnline} Active`;
                })()}
              </span>
            </div>

            {/* List of Coaches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {/* Current User Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.55rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff6b35, #ea580c)',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getInitials(displayName, user.email)}
                    </div>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-1px',
                        right: '-1px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#10b981',
                        boxShadow: '0 0 5px #10b981'
                      }}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {displayName} <strong style={{ color: '#60a5fa' }}>(You)</strong>
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#34d399' }}>
                      🟢 Logged in & Keeping Score
                    </div>
                  </div>
                </div>

                {lastScoreEvent?.scorer?.uid === user.uid && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      padding: '1px 5px',
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    title="You recorded the most recent score"
                  >
                    ⚡ Last Scorer
                  </span>
                )}
              </div>

              {/* Other Co-Coaches */}
              {(() => {
                const membersMap = activeTeam?.members || {};
                const rawList = Array.isArray(membersMap) ? membersMap : Object.values(membersMap);
                const otherMembers = rawList.filter(m => m.uid && m.uid !== user?.uid);

                // If updatedByName exists and not in members, add as simulated active co-coach
                if (activeTeam?.updatedByName && activeTeam?.updatedBy !== user?.uid && !otherMembers.some(m => m.displayName === activeTeam.updatedByName)) {
                  otherMembers.push({
                    uid: activeTeam.updatedBy || 'co-coach',
                    displayName: activeTeam.updatedByName,
                    role: 'coach',
                    lastActiveAt: activeTeam.updatedAt || new Date().toISOString()
                  });
                }

                if (otherMembers.length === 0) {
                  return (
                    <div style={{ padding: '0.35rem 0.2rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        No other co-coaches connected yet.
                      </div>
                      {activeTeam?.shareCode && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            if (onOpenShareModal) onOpenShareModal(activeTeam);
                          }}
                          style={{
                            width: '100%',
                            marginTop: '0.35rem',
                            padding: '0.35rem 0.5rem',
                            background: 'rgba(255, 107, 53, 0.12)',
                            border: '1px dashed rgba(255, 107, 53, 0.4)',
                            borderRadius: '6px',
                            color: 'var(--accent-orange)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <Share2 size={11} />
                          <span>Share Code: {activeTeam.shareCode}</span>
                        </button>
                      )}
                    </div>
                  );
                }

                return otherMembers.map((m) => {
                  const diffMin = m.lastActiveAt ? Math.round((Date.now() - new Date(m.lastActiveAt).getTime()) / 60000) : 999;
                  const isOnline = diffMin <= 25;
                  const isLastScorer = lastScoreEvent && (
                    lastScoreEvent.scorer?.uid === m.uid ||
                    lastScoreEvent.scorer?.name === m.displayName
                  );

                  return (
                    <div
                      key={m.uid || m.displayName}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.55rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              color: '#ffffff',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {getInitials(m.displayName, m.email)}
                          </div>
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '-1px',
                              right: '-1px',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: isOnline ? '#10b981' : '#64748b',
                              boxShadow: isOnline ? '0 0 5px #10b981' : 'none'
                            }}
                          />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.displayName || 'Co-Coach'}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: isOnline ? '#34d399' : 'var(--text-secondary)' }}>
                            {isOnline ? '🟢 Keeping Score' : (diffMin < 999 ? `Active ${diffMin}m ago` : 'Offline')}
                          </div>
                        </div>
                      </div>

                      {isLastScorer && (
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            padding: '1px 5px',
                            borderRadius: '6px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}
                          title="Recorded the most recent score"
                        >
                          ⚡ Last Scorer
                        </span>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* ⚡ Start Match / Game Wizard */}
            {onOpenMatchWizard && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenMatchWizard();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 0.75rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                  marginBottom: '4px'
                }}
              >
                <VolleyballIcon size={16} />
                <span>Start Match & Lineup Wizard</span>
              </button>
            )}

            {/* 📋 6-2 Make a Lineup & Rotation Studio */}
            {onOpenLineupStudio && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenLineupStudio();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.3))',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#c4b5fd',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
                  marginBottom: '3px'
                }}
                id="user-menu-item-lineup-studio"
              >
                <Layers size={16} color="#a78bfa" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>6-2 Lineup Studio</span>
                  <span style={{ fontSize: '0.66rem', color: '#ddd6fe', fontWeight: 500 }}>
                    AI stats, presets & injury sub
                  </span>
                </div>
              </button>
            )}

            {/* 📊 Match Stats & PDF Report */}
            {onOpenMatchStats && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenMatchStats();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3))',
                  border: '1px solid rgba(59, 130, 246, 0.45)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#93c5fd',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                  marginBottom: '3px'
                }}
                id="user-menu-item-stats"
              >
                <BarChart3 size={16} color="#60a5fa" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Match Stats & PDF</span>
                  <span style={{ fontSize: '0.66rem', color: '#bfdbfe', fontWeight: 500 }}>
                    Live error breakdown, box score & PDF export
                  </span>
                </div>
              </button>
            )}

            {/* 📄 Official Roster & Lineup Sheet (NFHS 8.5x11) */}
            {onOpenOfficialSheet && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenOfficialSheet();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(234, 88, 12, 0.3))',
                  border: '1px solid rgba(255, 107, 53, 0.45)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffedd5',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 2px 8px rgba(255, 107, 53, 0.2)',
                  marginBottom: '3px'
                }}
                id="user-menu-item-official-sheet"
              >
                <FileText size={16} color="#ff6b35" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Official Roster & Lineup Sheet</span>
                  <span style={{ fontSize: '0.66rem', color: '#fed7aa', fontWeight: 500 }}>
                    NFHS 8.5" × 11" scoresheet & mobile cards
                  </span>
                </div>
              </button>
            )}

            {/* 🗂️ Official R2 Lineup Card Modal */}
            {onOpenR2LineupCard && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenR2LineupCard();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#e2e8f0',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '3px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
                id="user-menu-item-r2-card"
              >
                <Shield size={15} color="#94a3b8" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Official R2 Lineup Card</span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>
                    Referee tracking card & rotational checklist
                  </span>
                </div>
              </button>
            )}

            {/* 📋 Tactical Whiteboard */}
            {onOpenWhiteboard && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenWhiteboard();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#93c5fd',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)')}
              >
                <PenTool size={15} color="#60a5fa" />
                <span>Tactical Whiteboard</span>
              </button>
            )}

            {/* 🎯 Volleyball Drill Lab */}
            {onOpenDrills && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenDrills();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#e9d5ff',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '2px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(168, 85, 247, 0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)')}
              >
                <Dumbbell size={15} color="#c084fc" />
                <span>Volleyball Drill Lab</span>
              </button>
            )}

            {onOpenNotificationSettings && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenNotificationSettings();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '2px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(168, 85, 247, 0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)')}
              >
                <BellRing size={15} color="#c084fc" />
                <span>Lock Screen Alerts & Scores</span>
              </button>
            )}

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
