import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Users,
  Shield,
  QrCode,
  Link,
  Sparkles,
  Crown,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShareTeamModal({
  isOpen,
  onClose,
  activeTeam,
  user,
  onRegenerateCode
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !activeTeam) return null;

  const shareCode = activeTeam.shareCode || 'VB-CODE';
  const inviteLink = `${window.location.origin}/?join=${encodeURIComponent(shareCode)}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopiedCode(true);
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${activeTeam.teamName || 'Volleyball Team'} Roster & Stats`,
          text: `Join our volleyball squad "${activeTeam.teamName || 'Volleyball Team'}" to co-coach, set lineups, and track match stats live! Share Code: ${shareCode}`,
          url: inviteLink
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const membersList = activeTeam.members ? Object.values(activeTeam.members) : [];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '95%',
          background: 'linear-gradient(145deg, #131b2e 0%, #0d1322 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 107, 53, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 107, 53, 0.15)',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(90deg, rgba(255, 107, 53, 0.15), rgba(30, 58, 138, 0.2))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-orange), #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.35)',
                color: '#fff'
              }}
            >
              <Share2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Share Squad & Co-Coach
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {activeTeam.teamName || 'Volleyball Team'} • Season {activeTeam.season || '2026'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Share Code Card */}
          <div
            style={{
              background: 'rgba(255, 107, 53, 0.08)',
              border: '1px dashed rgba(255, 107, 53, 0.4)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Team Share Code
            </div>
            <div
              style={{
                fontSize: '2.25rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.15em',
                fontFamily: 'monospace',
                textShadow: '0 2px 10px rgba(255, 107, 53, 0.4)',
                margin: '0.25rem 0'
              }}
            >
              {shareCode}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 1rem' }}>
              Anyone with this code can join and co-coach this squad with full edit & stats access.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={handleCopyCode}
                style={{ minWidth: '140px' }}
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleCopyLink}
                style={{ minWidth: '140px' }}
              >
                {copiedLink ? <Check size={16} /> : <Link size={16} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>

              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  className="btn btn-secondary"
                  onClick={handleNativeShare}
                  title="Share via App"
                >
                  <Share2 size={16} />
                  <span>Share...</span>
                </button>
              )}
            </div>
          </div>

          {/* How Collaboration Works */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '0.9rem 1rem',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={16} color="var(--accent-orange)" />
              <span>Real-Time Co-Coaching Permissions</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li><strong>Rosters & Lineups</strong>: Edit players, jersey numbers, and 6-player starting court formations.</li>
              <li><strong>Live Score & Stats</strong>: Track points, aces, blocks, and sub counts together in real time.</li>
              <li><strong>Instant Cloud Sync</strong>: Updates mirror across all connected coaches' phones and tablets.</li>
            </ul>
          </div>

          {/* Active Coaches & Collaborators */}
          {membersList.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={15} />
                <span>Active Coaches ({membersList.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                {membersList.map((m) => (
                  <div
                    key={m.uid || m.email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: m.role === 'owner' ? 'var(--accent-orange)' : 'var(--navy-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {m.displayName ? m.displayName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {m.displayName || m.email?.split('@')[0] || 'Coach'}
                          {m.uid === user?.uid && (
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>(You)</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {m.email || 'Google Account'}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        background: m.role === 'owner' ? 'rgba(255, 107, 53, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: m.role === 'owner' ? 'var(--accent-orange)' : '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {m.role === 'owner' ? <Crown size={12} /> : <UserCheck size={12} />}
                      {m.role === 'owner' ? 'Head Coach' : 'Coach'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button className="btn btn-primary" onClick={onClose} style={{ minWidth: '100px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
