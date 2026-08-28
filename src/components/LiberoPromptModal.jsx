import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, UserCheck, X } from 'lucide-react';
import { FRONT_ROW_ZONES, ZONE_LABELS } from '../services/volleyballRules';

export default function LiberoPromptModal({
  isOpen,
  onClose,
  libero,
  replacedPlayer,
  benchPlayers = [],
  onConfirmSubAndRotate
}) {
  if (!isOpen || !libero) return null;

  // Front row eligible bench players (non-liberos)
  const eligibleBench = benchPlayers.filter(p => p.position !== 'Libero' && !p.isLibero);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content libero-prompt-modal"
        style={{
          maxWidth: '560px',
          border: '1px solid #f59e0b',
          boxShadow: '0 20px 50px rgba(245, 158, 11, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
            }}>
              <ShieldAlert size={22} color="#ffffff" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.15rem', color: '#fbbf24' }}>
                Libero Front-Row Rule Alert
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                FIVB / USAV Rule 19.3.1 • Mandatory Back-Row Exchange
              </p>
            </div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Warning Banner */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.84rem', color: '#fef3c7', lineHeight: 1.45 }}>
            <strong>#{libero.number} {libero.name} (Libero)</strong> is rotating from <strong>Zone 5</strong> to <strong>Zone 4 (Left Front)</strong>.
            <div style={{ marginTop: '0.3rem', color: 'rgba(254, 243, 199, 0.8)', fontSize: '0.8rem' }}>
              Liberos are restricted to the back row and cannot enter the front row. Please exchange the Libero out to complete rotation.
            </div>
          </div>
        </div>

        {/* Recommended Action: Return original replaced player */}
        {replacedPlayer && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Recommended Official Replacement (1-Tap):
            </div>
            <div
              className="libero-return-card"
              onClick={() => onConfirmSubAndRotate(replacedPlayer)}
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(6, 78, 59, 0.3))',
                border: '1px solid #10b981',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  #{replacedPlayer.number}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>
                    Return {replacedPlayer.name} to Zone 4
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>
                    Original player covered by Libero ({replacedPlayer.position || 'Middle'})
                  </div>
                </div>
              </div>

              <button className="btn btn-primary btn-sm" style={{ background: '#10b981', borderColor: '#059669' }}>
                <UserCheck size={14} /> Return & Rotate
              </button>
            </div>
          </div>
        )}

        {/* Alternative bench substitutes */}
        <div>
          <div style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--text-secondary)',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            Or Choose Another Eligible Front-Row Player:
          </div>

          {eligibleBench.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              No other eligible bench players available.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
              {eligibleBench.map(player => (
                <div
                  key={player.id}
                  className="bench-chip"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onConfirmSubAndRotate(player)}
                >
                  <span className="bench-chip-num">#{player.number}</span>
                  <span className="bench-chip-name">{player.name}</span>
                  <span className="bench-chip-pos">{player.position}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem'
        }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel Rotation
          </button>
        </div>
      </div>
    </div>
  );
}
