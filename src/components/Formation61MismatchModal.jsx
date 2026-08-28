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

export default function Formation61MismatchModal({
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
              background: validation.isValid61 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: validation.isValid61 ? '1px solid #10b981' : '1px solid #f59e0b',
              padding: '0.45rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {validation.isValid61 ? (
                <CheckCircle size={22} color="#10b981" />
              ) : (
                <AlertTriangle size={22} color="#f59e0b" />
              )}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {validation.isValid61 ? '6-1 System Verified' : '6-1 Formation Mismatch'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Volleyball 6-1 Positional Diagnostic & Alignment
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
              ✅ All 6 court players form legal, textbook 6-1 diagonal pairs (Setter ⇄ OPP, OH1 ⇄ OH2, MB ⇄ Libero).
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
                      style={{ fontSize: '0.76rem', padding: '0.25rem 0.6rem' }}
                      onClick={() => handleUpdateRole(sug.playerId, sug.targetRole)}
                    >
                      Update Position
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagonal Pairs Breakdown */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              6-1 Court Diagonal Pairs (3-Zones Apart):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {/* Pair 1: Z1 <-> Z4 */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>PAIR 1 (Z1 ⇄ Z4)</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {getPlayerLastName(lineup?.pos1)} (Z1)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{getPlayer(lineup?.pos1)?.position || 'Unassigned'}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0' }}>⇄</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  {getPlayerLastName(lineup?.pos4)} (Z4)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{getPlayer(lineup?.pos4)?.position || 'Unassigned'}</div>
              </div>

              {/* Pair 2: Z2 <-> Z5 */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>PAIR 2 (Z2 ⇄ Z5)</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {getPlayerLastName(lineup?.pos2)} (Z2)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{getPlayer(lineup?.pos2)?.position || 'Unassigned'}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0' }}>⇄</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  {getPlayerLastName(lineup?.pos5)} (Z5)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{getPlayer(lineup?.pos5)?.position || 'Unassigned'}</div>
              </div>

              {/* Pair 3: Z3 <-> Z6 */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>PAIR 3 (Z3 ⇄ Z6)</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {getPlayerLastName(lineup?.pos3)} (Z3)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{getPlayer(lineup?.pos3)?.position || 'Unassigned'}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0' }}>⇄</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  {getPlayerLastName(lineup?.pos6)} (Z6)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{getPlayer(lineup?.pos6)?.position || 'Unassigned'}</div>
              </div>
            </div>
          </div>

          {/* 6-1 Player Tactical Clarity Guide */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle size={15} />
              <span>What Each Player Does in a 6-1:</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li><strong>Setter (S):</strong> Runs all 6 rotations. Penetrates to right-front target on receive. Blocks when front-row.</li>
              <li><strong>Opposite (OPP):</strong> Plays opposite the Setter. Hits on the right pin, defends/blocks opposing outside hitter.</li>
              <li><strong>Outside Hitters (OH1 & OH2):</strong> Positioned opposite each other. Anchors the 3-passer serve receive cup and attacks left pin.</li>
              <li><strong>Middle Blockers (MB1 & MB2):</strong> Quick middle attacks (1-ball) & roof blocks. Exits for Libero in back row.</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions" style={{ justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
          {validation.autoCorrectLineup && !validation.isValid61 && (
            <button
              className="btn btn-primary"
              onClick={handleApplyFix}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderColor: '#f59e0b',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Sparkles size={16} />
              <span>1-Tap Auto-Correct Lineup to 6-1</span>
            </button>
          )}

          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
