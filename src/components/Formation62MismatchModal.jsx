import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Users,
  ArrowRight,
  Shield,
  HelpCircle,
  X,
  ArrowLeftRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ZONE_LABELS } from '../services/volleyballRules';

export default function Formation62MismatchModal({
  isOpen,
  onClose,
  validation,
  lineup,
  roster,
  onApplyAutoCorrection,
  onUpdatePlayerPosition,
  onOpenSubModal
}) {
  if (!isOpen || !validation) return null;

  const getPlayer = (id) => roster?.find(p => p.id === id);
  const getPlayerLastName = (id) => {
    const p = getPlayer(id);
    if (!p || !p.name) return 'Empty';
    const parts = p.name.trim().split(/\s+/);
    return parts.length > 0 ? parts[parts.length - 1] : p.name;
  };

  const handleApplyFix = () => {
    if (validation.autoCorrectLineup && onApplyAutoCorrection) {
      onApplyAutoCorrection(validation.autoCorrectLineup);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      onClose();
    }
  };

  const handleUpdateRole = (playerId, targetRole) => {
    if (onUpdatePlayerPosition) {
      onUpdatePlayerPosition(playerId, targetRole);
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
    }
  };

  const isValid = validation.isValid62 ?? validation.isValid61 ?? true;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: isValid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: isValid ? '1px solid #10b981' : '1px solid #f59e0b',
              padding: '0.45rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isValid ? (
                <CheckCircle size={22} color="#10b981" />
              ) : (
                <AlertTriangle size={22} color="#f59e0b" />
              )}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {isValid ? '6-2 System Verified' : '6-2 Formation Mismatch'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Volleyball 6-2 (6 Hitters, 2 Setters) Positional Diagnostic & Alignment
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1rem 0' }}>
          {/* Mismatch Issues Callouts */}
          {validation.issues && validation.issues.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {validation.issues.map((issue, idx) => (
                <div
                  key={idx}
                  style={{
                    background: issue.severity === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    border: issue.severity === 'error' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    color: issue.severity === 'error' ? '#fca5a5' : '#fde68a',
                    lineHeight: 1.45,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem'
                  }}
                >
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>{issue.severity === 'error' ? 'Rule Violation:' : 'Position Mismatch:'}</strong> {issue.message}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#a7f3d0',
              fontSize: '0.86rem'
            }}>
              ✅ All 6 court players form legal, textbook 6-2 diagonal pairs (S1 ⇄ S2/RS, OH1 ⇄ OH2, MB ⇄ Libero).
            </div>
          )}

          {/* Quick 1-Tap Role Updates */}
          {validation.suggestedRoleUpdates && validation.suggestedRoleUpdates.length > 0 && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                💡 Suggested Role Alignment:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {validation.suggestedRoleUpdates.map((sug, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.84rem', color: '#f8fafc' }}>
                      Set <strong>{sug.playerName}</strong> as <strong>{sug.targetRole}</strong>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.76rem', padding: '0.3rem 0.65rem' }}
                      onClick={() => handleUpdateRole(sug.playerId, sug.targetRole)}
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6-2 Pairings Visual Grid */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={16} color="#38bdf8" />
              <span>Current Court Diagonal Pairs (Opposite Each Other)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
              {/* Pair 1 */}
              <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>PAIR 1: Zone 1 ⇄ Zone 4</div>
                <div style={{ fontSize: '0.84rem', color: '#f8fafc', marginTop: '0.2rem', fontWeight: 700 }}>
                  {getPlayerLastName(lineup.pos1)} ⇄ {getPlayerLastName(lineup.pos4)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '0.1rem' }}>
                  Setter 1 ⇄ Setter 2 / Right Side
                </div>
              </div>

              {/* Pair 2 */}
              <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>PAIR 2: Zone 2 ⇄ Zone 5</div>
                <div style={{ fontSize: '0.84rem', color: '#f8fafc', marginTop: '0.2rem', fontWeight: 700 }}>
                  {getPlayerLastName(lineup.pos2)} ⇄ {getPlayerLastName(lineup.pos5)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a78bfa', marginTop: '0.1rem' }}>
                  Outside 1 ⇄ Outside 2
                </div>
              </div>

              {/* Pair 3 */}
              <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>PAIR 3: Zone 3 ⇄ Zone 6</div>
                <div style={{ fontSize: '0.84rem', color: '#f8fafc', marginTop: '0.2rem', fontWeight: 700 }}>
                  {getPlayerLastName(lineup.pos3)} ⇄ {getPlayerLastName(lineup.pos6)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '0.1rem' }}>
                  Middle 1 ⇄ Middle 2 / Libero
                </div>
              </div>
            </div>
          </div>

          {/* 6-2 Explanation Box */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            fontSize: '0.82rem',
            color: '#e0f2fe',
            lineHeight: 1.5
          }}>
            <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle size={15} />
              <span>How the 6-2 Volleyball System Works:</span>
            </div>
            In a 6-2 system (6 Hitters, 2 Setters), the active setter <strong>always sets from the back row</strong> (Zones 1, 6, or 5). When a setter rotates to the front row, they become an active attacker (Right Side Hitter) or are subbed for an attacking specialist, guaranteeing <strong>3 front-row hitters in every single rotation</strong>.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Dismiss
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {validation.autoCorrectLineup && (
              <button
                className="btn btn-primary"
                onClick={handleApplyFix}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderColor: '#f59e0b' }}
              >
                <Sparkles size={16} />
                <span>Auto-Align 6-2 Lineup</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
