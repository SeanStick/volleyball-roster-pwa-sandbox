import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volleyball,
  Shield,
  RotateCw,
  CheckCircle,
  X,
  UserCheck,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generate62LineupForServeState, ZONE_LABELS } from '../services/volleyballRules';

export default function AutoFillLineupModal({
  isOpen,
  onClose,
  roster = [],
  onApplyLineup,
  currentPhase = 'serve'
}) {
  const [serveState, setServeState] = useState(currentPhase === 'receive' ? 'receive' : 'serve');
  const defaultFirstServer = roster.find(p => p.isFirstServer)?.id || roster.find(p => p.position === 'Setter')?.id || roster[0]?.id || '';
  const [selectedServerId, setSelectedServerId] = useState(defaultFirstServer);

  useEffect(() => {
    if (isOpen) {
      const server = roster.find(p => p.isFirstServer)?.id || roster.find(p => p.position === 'Setter')?.id || roster[0]?.id || '';
      setSelectedServerId(server);
    }
  }, [isOpen, roster]);

  if (!isOpen) return null;

  const generatedLineup = generate62LineupForServeState(roster, serveState, selectedServerId);

  const getPlayer = (id) => roster.find(p => p.id === id);

  const handleApply = () => {
    if (onApplyLineup) {
      onApplyLineup(generatedLineup, serveState);
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
    }
    onClose();
  };

  const firstServerPlayer = getPlayer(selectedServerId);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid #f59e0b',
              padding: '0.45rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                Auto-Fill Starting 6 Lineup
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Official 6-2 (6 Hitters, 2 Setters) Rules Engine
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1rem 0' }}>
          {/* Step 1: Serving First vs Receiving First */}
          <div>
            <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', display: 'block' }}>
              1. Did your team win the toss to Serve 1st or Receive 1st?
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* Option A: Serves 1st */}
              <button
                type="button"
                onClick={() => setServeState('serve')}
                style={{
                  background: serveState === 'serve' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  border: serveState === 'serve' ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#93c5fd', fontSize: '0.95rem' }}>
                    <Volleyball size={18} color="#3b82f6" />
                    Team Serves 1st
                  </span>
                  {serveState === 'serve' && <CheckCircle size={16} color="#3b82f6" />}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  First Server starts in <strong>Zone 1 (Right Back)</strong> and serves the opening ball.
                </div>
              </button>

              {/* Option B: Receives 1st */}
              <button
                type="button"
                onClick={() => setServeState('receive')}
                style={{
                  background: serveState === 'receive' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  border: serveState === 'receive' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#6ee7b7', fontSize: '0.95rem' }}>
                    <Shield size={18} color="#10b981" />
                    Team Receives 1st
                  </span>
                  {serveState === 'receive' && <CheckCircle size={16} color="#10b981" />}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  First Server starts in <strong>Zone 2 (Right Front)</strong> & rotates to Zone 1 on 1st side-out.
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Designated First Server Selection */}
          <div>
            <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UserCheck size={16} color="var(--accent-orange)" />
              <span>2. Designated First Server:</span>
            </label>
            <select
              className="form-select"
              value={selectedServerId}
              onChange={(e) => setSelectedServerId(e.target.value)}
              style={{ background: '#1e293b', color: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '6px' }}
            >
              {roster.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.name} ({p.position}) {p.isFirstServer ? '★ (1st Server)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Volleyball Rule Clarification Box */}
          {firstServerPlayer && (firstServerPlayer.position === 'Libero' || firstServerPlayer.isLibero) && serveState === 'receive' ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(30, 41, 59, 0.9))',
              border: '1px solid #c084fc',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <Shield size={20} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: '#f3e8ff', lineHeight: 1.45 }}>
                <strong>Volleyball Rule 19.3.1.1 (Libero Back-Row Requirement):</strong> The Libero cannot start in the front row (Zone 2). On receive, Middle Blocker <strong>{getPlayer(generatedLineup.pos2)?.name}</strong> starts in Zone 2. Upon winning the 1st side-out, they rotate to Zone 1, and <strong>{firstServerPlayer?.name}</strong> exchanges in to take the serve (USAV Rule 19.3.1.3)!
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <Info size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                {serveState === 'serve' ? (
                  <span>
                    <strong>Serving First (Rule 7.3.5.1):</strong> <strong>{firstServerPlayer?.name}</strong> will start in <strong>Zone 1</strong> as the match server.
                  </span>
                ) : (
                  <span>
                    <strong>Receiving First (Rule 7.3.5.2):</strong> The team defends the opening serve. When you win the first side-out, your team rotates clockwise, moving <strong>{firstServerPlayer?.name}</strong> from <strong>Zone 2 into Zone 1</strong> to take your team's first serve!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Live Lineup Preview Grid */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Generated Starting 6 (Rotation 1):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {/* Row 1: Front Row (Zones 4, 3, 2) */}
              {['pos4', 'pos3', 'pos2'].map(zk => {
                const p = getPlayer(generatedLineup[zk]);
                const isLiberoServer = firstServerPlayer && (firstServerPlayer.position === 'Libero' || firstServerPlayer.isLibero);
                const isServerSlot = (serveState === 'serve' && zk === 'pos1') || (serveState === 'receive' && zk === 'pos2' && !isLiberoServer);
                const isLiberoSideoutSlot = (serveState === 'receive' && zk === 'pos2' && isLiberoServer);

                return (
                  <div key={zk} style={{
                    background: isServerSlot ? 'rgba(245, 158, 11, 0.2)' : isLiberoSideoutSlot ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                    border: isServerSlot ? '1px solid #f59e0b' : isLiberoSideoutSlot ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800 }}>
                      ZONE {ZONE_LABELS[zk]?.num} (FRONT)
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.15rem' }}>
                      #{p?.number} {p ? p.name.split(' ')[0] : 'Empty'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isServerSlot ? '#f59e0b' : isLiberoSideoutSlot ? '#c084fc' : '#38bdf8', fontWeight: isServerSlot || isLiberoSideoutSlot ? 800 : 500 }}>
                      {isServerSlot ? '★ 1st Server' : isLiberoSideoutSlot ? '⇄ Libero Serves on Side-Out' : (p?.position || '—')}
                    </div>
                  </div>
                );
              })}

              {/* Row 2: Back Row (Zones 5, 6, 1) */}
              {['pos5', 'pos6', 'pos1'].map(zk => {
                const p = getPlayer(generatedLineup[zk]);
                const isLiberoServer = firstServerPlayer && (firstServerPlayer.position === 'Libero' || firstServerPlayer.isLibero);
                const isServerSlot = (serveState === 'serve' && zk === 'pos1');
                const isLiberoSlot = (isLiberoServer && p?.id === firstServerPlayer?.id);

                return (
                  <div key={zk} style={{
                    background: isServerSlot ? 'rgba(245, 158, 11, 0.2)' : isLiberoSlot ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                    border: isServerSlot ? '1px solid #f59e0b' : isLiberoSlot ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800 }}>
                      ZONE {ZONE_LABELS[zk]?.num} (BACK)
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.15rem' }}>
                      #{p?.number} {p ? p.name.split(' ')[0] : 'Empty'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isServerSlot ? '#f59e0b' : isLiberoSlot ? '#c084fc' : '#38bdf8', fontWeight: isServerSlot || isLiberoSlot ? 800 : 500 }}>
                      {isServerSlot ? '★ 1st Server' : isLiberoSlot ? '★ Libero (1st Server)' : (p?.position || '—')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions" style={{ justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleApply}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderColor: '#f59e0b',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Sparkles size={16} />
            <span>Apply Starting 6 Lineup</span>
          </button>

          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
