import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  X,
  BellOff,
  Sparkles,
  Info
} from 'lucide-react';
import { ZONE_LABELS } from '../services/volleyballRules';
import { notificationService } from '../services/notificationService';
import confetti from 'canvas-confetti';

export default function AutoSubConfirmModal({
  isOpen,
  onClose,
  incomingPlayer,
  outgoingPlayer,
  targetZone = 'pos4',
  zoneNum = 4,
  zoneName = 'Left Front',
  reason = 'Libero Front-Row Rule 19.3.1 Exchange',
  ruleNote = 'Liberos cannot play in the front row and must exchange for the original player upon rotating to Zone 4.',
  benchPlayers = [],
  onConfirmSub,
  onDecline
}) {
  const [turnOffNotifications, setTurnOffNotifications] = useState(false);
  const [selectedReplacement, setSelectedReplacement] = useState(incomingPlayer);

  // Sync selected replacement when incomingPlayer changes
  React.useEffect(() => {
    setSelectedReplacement(incomingPlayer);
  }, [incomingPlayer]);

  if (!isOpen || !outgoingPlayer) return null;

  const currentZoneInfo = ZONE_LABELS[targetZone] || { num: zoneNum || 4, name: zoneName || 'Front Row' };

  // Eligible alternative bench substitutes (excluding outgoing player and Libero if front-row)
  const isFrontRow = ['pos4', 'pos3', 'pos2'].includes(targetZone);
  const eligibleAlternatives = (benchPlayers || []).filter(p => {
    if (p.id === outgoingPlayer.id) return false;
    if (incomingPlayer && p.id === incomingPlayer.id) return false;
    if (isFrontRow && (p.position === 'Libero' || p.isLibero)) return false;
    return true;
  });

  const handleConfirm = () => {
    const playerToSubIn = selectedReplacement || incomingPlayer;
    if (turnOffNotifications) {
      notificationService.setAutoSubConfirmation(false);
    }
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.45 } });
    } catch {
      // ignore
    }
    if (onConfirmSub) {
      onConfirmSub(playerToSubIn, turnOffNotifications);
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    } else if (onClose) {
      onClose();
    }
  };

  const activeIncoming = selectedReplacement || incomingPlayer;

  return (
    <div
      className="modal-overlay"
      onClick={handleDecline}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 24, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1300,
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
          maxWidth: '540px',
          background: '#0f172a',
          border: '1.5px solid #a855f7',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 60px -15px rgba(168, 85, 247, 0.35)',
          overflow: 'hidden',
          color: '#f8fafc',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(168, 85, 247, 0.25)',
            background: 'linear-gradient(90deg, #1e1b4b 0%, #0f172a 100%)'
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
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
              }}
            >
              <ArrowLeftRight size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#e9d5ff' }}>
                Auto-Substitution Alert
              </div>
              <div style={{ fontSize: '0.74rem', color: '#c4b5fd' }}>
                Confirm player entering court • Zone {currentZoneInfo.num} ({currentZoneInfo.name})
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDecline}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Reason Badge & Explanation */}
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 0.95rem',
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'center'
            }}
          >
            <Info size={18} color="#c084fc" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.8rem', color: '#e9d5ff', lineHeight: 1.4 }}>
              <strong>{reason}</strong>: {ruleNote}
            </div>
          </div>

          {/* Player Exchange Visual Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 0.85rem'
            }}
          >
            {/* Outgoing Player */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0.6rem 0.4rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)'
              }}
            >
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: '#f87171',
                  background: 'rgba(239, 68, 68, 0.2)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  marginBottom: '0.4rem'
                }}
              >
                Subbing Out
              </span>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.35rem',
                  boxShadow: '0 4px 10px rgba(239, 68, 68, 0.35)'
                }}
              >
                #{outgoingPlayer.number}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                {outgoingPlayer.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#fca5a5' }}>
                {outgoingPlayer.position || 'Libero'}
              </div>
            </div>

            {/* Exchange Arrow */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid #a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ArrowRight size={16} color="#c084fc" />
              </div>
              <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700 }}>
                Zone {currentZoneInfo.num}
              </span>
            </div>

            {/* Incoming Player */}
            {activeIncoming ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0.6rem 0.4rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1.5px solid #10b981',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)'
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.2)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    marginBottom: '0.4rem'
                  }}
                >
                  Subbing In
                </span>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.35rem',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  #{activeIncoming.number}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                  {activeIncoming.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>
                  {activeIncoming.position || 'Player'}
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '0.8rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1.5px dashed rgba(255, 255, 255, 0.2)'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Select player below
                </div>
              </div>
            )}
          </div>

          {/* Alternative Bench Substitutes (if coach wants someone else) */}
          {eligibleAlternatives.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#94a3b8',
                  fontWeight: 800,
                  marginBottom: '0.45rem'
                }}
              >
                Or Sub In Another Eligible Player:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxHeight: '110px', overflowY: 'auto' }}>
                {eligibleAlternatives.map(player => {
                  const isSelected = activeIncoming?.id === player.id;
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => setSelectedReplacement(player)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: isSelected ? '#34d399' : '#e2e8f0',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontWeight: 900 }}>#{player.number}</span>
                      <span>{player.name}</span>
                      <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>({player.position})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Turn Off Notifications Toggle Option */}
          <div
            onClick={() => setTurnOffNotifications(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.7rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              background: turnOffNotifications ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${turnOffNotifications ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
              cursor: 'pointer',
              marginTop: '0.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BellOff size={16} color={turnOffNotifications ? '#fbbf24' : '#94a3b8'} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: turnOffNotifications ? '#fef3c7' : '#e2e8f0' }}>
                  Don't show this notification again
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  Auto-confirm future substitutions silently (re-enable anytime in Match Tools)
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={turnOffNotifications}
              onChange={() => {}}
              style={{ accentColor: '#f59e0b', width: '16px', height: '16px', cursor: 'pointer' }}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.65rem',
              marginTop: '0.5rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDecline}
              style={{ padding: '0.55rem 1rem', borderRadius: '8px' }}
            >
              Decline / Skip
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleConfirm}
              disabled={!activeIncoming}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                background: activeIncoming ? 'linear-gradient(135deg, #10b981, #059669)' : '#475569',
                borderColor: activeIncoming ? '#10b981' : '#475569',
                fontWeight: 800,
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                opacity: activeIncoming ? 1 : 0.6,
                cursor: activeIncoming ? 'pointer' : 'not-allowed',
                boxShadow: activeIncoming ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
              }}
            >
              <UserCheck size={16} /> Confirm {activeIncoming ? `#${activeIncoming.number} ${activeIncoming.name}` : 'Sub'} In
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
