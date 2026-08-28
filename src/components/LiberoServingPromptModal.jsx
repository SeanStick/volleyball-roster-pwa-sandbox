import React from 'react';
import { Volleyball, Sparkles, UserCheck, ShieldAlert, X, ArrowRight, Award } from 'lucide-react';

export default function LiberoServingPromptModal({
  isOpen,
  onClose,
  libero,
  regularPlayer,
  rotationNumber,
  servingEligibility,
  onChooseServer
}) {
  if (!isOpen || !libero || !regularPlayer) return null;

  const { canServe, isDesignated, reason } = servingEligibility || {};

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content libero-serving-modal"
        style={{
          maxWidth: '580px',
          border: '1px solid #38bdf8',
          boxShadow: '0 20px 50px rgba(56, 189, 248, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: 'rgba(56, 189, 248, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
            }}>
              <Volleyball size={22} color="#ffffff" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.15rem', color: '#38bdf8' }}>
                Zone 1 Serving Decision — Rotation #{rotationNumber}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                USAV / NFHS / NCAA Rule 19.3.1.3 • Libero Serving Choice
              </p>
            </div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Rule Explanation Banner */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.82rem',
          color: '#e0f2fe',
          lineHeight: 1.45
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.2rem' }}>
            <Award size={15} />
            Official Volleyball Serving Rule:
          </div>
          Under USAV/High School rules, a Libero may serve in <strong>only ONE designated rotational position</strong> per set.
          {isDesignated && (
            <div style={{ marginTop: '0.35rem', color: '#34d399', fontWeight: 700 }}>
              ✓ Libero #{libero.number} is already designated to serve in Rotation #{rotationNumber}.
            </div>
          )}
        </div>

        {/* Server Selection Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {/* Option 1: Libero Serves */}
          <div
            className={`server-choice-card ${canServe ? 'is-available' : 'is-disabled'}`}
            style={{
              background: canServe ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(76, 29, 149, 0.35))' : 'rgba(30, 20, 30, 0.4)',
              border: `2px solid ${canServe ? '#8b5cf6' : 'rgba(124, 58, 237, 0.2)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              cursor: canServe ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: canServe ? 1 : 0.6
            }}
            onClick={() => {
              if (canServe) onChooseServer('libero');
            }}
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
                <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{libero.name}</span>
                  <span className="badge-position pos-libero" style={{ fontSize: '0.68rem' }}>Libero</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#c4b5fd', marginTop: '0.15rem' }}>
                  {canServe ? (isDesignated ? 'Designated server for this rotation position' : 'Lock Libero to serve in Rotation #' + rotationNumber) : reason}
                </div>
              </div>
            </div>

            {canServe && (
              <button className="btn btn-sm" style={{ background: '#7c3aed', borderColor: '#6d28d9', color: '#ffffff', fontWeight: 800 }}>
                <Sparkles size={14} /> Libero Serves
              </button>
            )}
          </div>

          {/* Option 2: Regular Player Serves */}
          <div
            className="server-choice-card is-available"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25), rgba(15, 23, 42, 0.6))',
              border: '2px solid rgba(59, 130, 246, 0.5)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onClick={() => onChooseServer('regular')}
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
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(255, 107, 53, 0.4)'
              }}>
                #{regularPlayer.number}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{regularPlayer.name}</span>
                  <span className="badge-position" style={{ fontSize: '0.68rem' }}>{regularPlayer.position}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Have standard rotational player take the serve
                </div>
              </div>
            </div>

            <button className="btn btn-secondary btn-sm">
              <UserCheck size={14} /> Regular Player Serves
            </button>
          </div>
        </div>

        {/* Modal Footer */}
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
