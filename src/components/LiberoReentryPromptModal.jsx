import React from 'react';
import { ArrowLeftRight, UserCheck, X, Shield, Sparkles } from 'lucide-react';
import { ZONE_LABELS } from '../services/volleyballRules';

export default function LiberoReentryPromptModal({
  isOpen,
  onClose,
  libero,
  candidatePlayer,
  targetZoneKey,
  onConfirmReentry,
  onSkipReentry
}) {
  if (!isOpen || !libero || !candidatePlayer) return null;

  const zoneInfo = ZONE_LABELS[targetZoneKey];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content libero-reentry-modal"
        style={{
          maxWidth: '560px',
          border: '1px solid #a855f7',
          boxShadow: '0 20px 50px rgba(168, 85, 247, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: 'rgba(168, 85, 247, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
            }}>
              <Shield size={22} color="#ffffff" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.15rem', color: '#c084fc' }}>
                Libero Re-Entry Opportunity
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                FIVB / USAV Rule 19.3.2 • Back-Row Defensive Exchange
              </p>
            </div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Description Banner */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.84rem',
          color: '#f3e8ff',
          lineHeight: 1.45
        }}>
          Libero <strong>#{libero.number} {libero.name}</strong> is on the bench.
          <strong> #{candidatePlayer.number} {candidatePlayer.name} ({candidatePlayer.position})</strong> is rotating to the back row in <strong>Zone {zoneInfo?.num} ({zoneInfo?.name})</strong>.
          <div style={{ marginTop: '0.35rem', color: '#c4b5fd', fontSize: '0.78rem' }}>
            In standard volleyball, the Libero regularly subs in for back-row players for enhanced passing and defense (free exchange).
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {/* Action 1: Re-enter Libero */}
          <div
            className="reentry-choice-card"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(76, 29, 149, 0.35))',
              border: '2px solid #8b5cf6',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onClick={onConfirmReentry}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #a855f7, #6d28d9)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(168, 85, 247, 0.4)'
              }}>
                #{libero.number}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.98rem' }}>
                  Yes, Sub Libero In for {candidatePlayer?.name ? candidatePlayer.name.split(' ')[0] : 'Player'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#c4b5fd', marginTop: '0.15rem' }}>
                  Places Libero in Zone {zoneInfo?.num} (Free exchange • 0 subs used)
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-sm" style={{ background: '#7c3aed', borderColor: '#6d28d9' }}>
              <Sparkles size={14} /> Sub Libero In
            </button>
          </div>

          {/* Action 2: Keep regular player on court */}
          <div
            className="reentry-choice-card"
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onClick={onSkipReentry}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-orange), #ea580c)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                #{candidatePlayer.number}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.98rem' }}>
                  No, Keep {candidatePlayer.name} on Court
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Let {candidatePlayer.name} play back row in Zone {zoneInfo?.num}
                </div>
              </div>
            </div>

            <button className="btn btn-secondary btn-sm">
              <UserCheck size={14} /> Keep Player
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel Rotation
          </button>
        </div>
      </div>
    </div>
  );
}
