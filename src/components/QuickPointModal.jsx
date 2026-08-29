import React, { useState } from 'react';
import { X, Trophy, AlertTriangle, Sparkles, User, Users, Volleyball, Shield, ArrowRight, Zap } from 'lucide-react';
import { VOLLEYBALL_ERRORS, ERROR_CATEGORIES, POINT_EARNED_TYPES } from '../services/matchStatsService';
import { ZONE_LABELS } from '../services/volleyballRules';

export default function QuickPointModal({
  isOpen,
  onClose,
  scoringTeam, // 'us' | 'opponent'
  onConfirmPoint,
  lineup = {},
  roster = [],
  rotation = 1,
  phase = 'serve',
  currentScore = { ourScore: 0, opponentScore: 0, setNumber: 1 }
}) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!isOpen) return null;

  const isPointToUs = scoringTeam === 'us';

  // Get active 6 players currently on the court
  const activeCourtPlayers = Object.entries(lineup)
    .map(([zoneKey, playerId]) => {
      const p = roster.find(player => player.id === playerId);
      return {
        zoneKey,
        zoneNum: ZONE_LABELS[zoneKey]?.num || zoneKey,
        player: p
      };
    })
    .filter(item => Boolean(item.player));

  // Current server on court (pos1)
  const currentServerId = lineup.pos1;
  const currentServer = roster.find(p => p.id === currentServerId);

  // Handle Point for Our Team
  const handleEarnedPoint = (earnedType, playerId = null) => {
    let earnedPlayer = null;
    if (playerId) {
      earnedPlayer = roster.find(p => p.id === playerId);
    } else if (earnedType === 'ace' && currentServer) {
      earnedPlayer = currentServer;
    }

    onConfirmPoint({
      pointWonBy: 'us',
      earnedType,
      earnedTypeName: POINT_EARNED_TYPES.find(t => t.id === earnedType)?.label || earnedType,
      earnedPlayerId: earnedPlayer ? earnedPlayer.id : null,
      earnedPlayerName: earnedPlayer ? earnedPlayer.name : null,
      earnedPlayerNumber: earnedPlayer ? earnedPlayer.number : null,
      rotation,
      phase,
      setNumber: currentScore.setNumber
    });
    onClose();
  };

  // Handle Error for Opponent Point
  const handleErrorPoint = (errorDef) => {
    let errorPlayer = null;
    if (selectedPlayerId && selectedPlayerId !== 'team') {
      errorPlayer = roster.find(p => p.id === selectedPlayerId);
    }

    onConfirmPoint({
      pointWonBy: 'opponent',
      errorTypeId: errorDef.id,
      errorTypeName: errorDef.label,
      errorCategory: errorDef.category,
      errorPlayerId: errorPlayer ? errorPlayer.id : null,
      errorPlayerName: errorPlayer ? errorPlayer.name : (selectedPlayerId === 'team' ? 'Team Unforced' : null),
      errorPlayerNumber: errorPlayer ? errorPlayer.number : null,
      rotation,
      phase,
      setNumber: currentScore.setNumber
    });
    onClose();
  };

  // Quick 1-tap skip (records point without detailed attributes)
  const handleQuickSkip = () => {
    onConfirmPoint({
      pointWonBy: scoringTeam,
      earnedType: isPointToUs ? 'quick_point' : null,
      errorTypeId: !isPointToUs ? 'unspecified_error' : null,
      errorCategory: !isPointToUs ? 'General Error' : null,
      rotation,
      phase,
      setNumber: currentScore.setNumber
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="point-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: isPointToUs ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isPointToUs ? <Trophy size={20} color="#10b981" /> : <AlertTriangle size={20} color="#ef4444" />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: isPointToUs ? '#a7f3d0' : '#fca5a5', fontWeight: 800 }}>
                {isPointToUs ? 'Point to Our Team (+1)' : 'Point to Opponent (+1)'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Set {currentScore.setNumber} • Rotation #{rotation} • {phase === 'serve' ? 'Serving' : 'Receiving'}
              </div>
            </div>
          </div>

          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* =========================================================================
            POINT FOR OUR TEAM FLOW
           ========================================================================= */}
        {isPointToUs ? (
          <div>
            <div className="point-flow-step-title">
              <span>Select How Point Was Earned:</span>
            </div>

            {/* Quick 1-Tap Winner Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <button
                className="btn-player-pick"
                style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#a7f3d0', padding: '0.85rem 0.75rem', flexDirection: 'column', textAlign: 'center' }}
                onClick={() => handleEarnedPoint('ace')}
              >
                <span style={{ fontSize: '1.5rem' }}>🏐</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Ace</span>
                <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>
                  {currentServer ? `#${currentServer.number} ${currentServer.name.split(' ')[0]}` : 'Server'}
                </span>
              </button>

              <button
                className="btn-player-pick"
                style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)', color: '#bfdbfe', padding: '0.85rem 0.75rem', flexDirection: 'column', textAlign: 'center' }}
                onClick={() => setSelectedCategory('kill')}
              >
                <span style={{ fontSize: '1.5rem' }}>💥</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Attack Kill</span>
                <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Pick Hitter Below</span>
              </button>

              <button
                className="btn-player-pick"
                style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#e9d5ff', padding: '0.85rem 0.75rem', flexDirection: 'column', textAlign: 'center' }}
                onClick={() => setSelectedCategory('block')}
              >
                <span style={{ fontSize: '1.5rem' }}>🧱</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Block Kill</span>
                <span style={{ fontSize: '0.7rem', color: '#d8b4fe' }}>Pick Blocker Below</span>
              </button>

              <button
                className="btn-player-pick"
                style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fef3c7', padding: '0.85rem 0.75rem', flexDirection: 'column', textAlign: 'center' }}
                onClick={() => handleEarnedPoint('opp_error')}
              >
                <span style={{ fontSize: '1.5rem' }}>❌</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Opponent Error</span>
                <span style={{ fontSize: '0.7rem', color: '#fde68a' }}>Out / Net / Fault</span>
              </button>
            </div>

            {/* Hitter / Blocker Player Selection (When Kill or Block selected) */}
            {(selectedCategory === 'kill' || selectedCategory === 'block') && (
              <div>
                <div className="point-flow-step-title">
                  <span>Who executed the {selectedCategory === 'kill' ? 'Attack Kill' : 'Block Kill'}?</span>
                </div>
                <div className="player-pick-grid">
                  {activeCourtPlayers.map(({ player, zoneNum }) => (
                    <button
                      key={player.id}
                      className="btn-player-pick"
                      onClick={() => handleEarnedPoint(selectedCategory, player.id)}
                    >
                      <div className="jersey-badge-sm">#{player.number}</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{player.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Z{zoneNum} • {player.position}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
             POINT FOR OPPONENT / TEAM ERROR FLOW
             ========================================================================= */
          <div>
            {/* Step 1: Who made the error? */}
            <div className="point-flow-step-title">
              <span>1. Who committed the error? (Active On-Court Players)</span>
            </div>

            <div className="player-pick-grid">
              {activeCourtPlayers.map(({ player, zoneNum }) => (
                <button
                  key={player.id}
                  className={`btn-player-pick ${selectedPlayerId === player.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlayerId(player.id)}
                >
                  <div className={`jersey-badge-sm ${player.position === 'Libero' ? 'libero-num' : ''}`}>
                    #{player.number}
                  </div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 700 }}>{player.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Z{zoneNum} • {player.position}</div>
                  </div>
                </button>
              ))}

              {/* Team / Unforced Button */}
              <button
                className={`btn-player-pick ${selectedPlayerId === 'team' ? 'selected' : ''}`}
                onClick={() => setSelectedPlayerId('team')}
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              >
                <Users size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ fontWeight: 700 }}>Team / Out of System</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Unforced Error</div>
                </div>
              </button>
            </div>

            {/* Step 2: What was the error? */}
            <div className="point-flow-step-title">
              <span>2. Tap Error (Auto-completes and records point):</span>
            </div>

            <div className="error-pick-grid">
              {VOLLEYBALL_ERRORS.filter(e => e.category !== ERROR_CATEGORIES.OPPONENT_EARNED).map((err) => (
                <button
                  key={err.id}
                  className="btn-error-pick"
                  onClick={() => handleErrorPoint(err)}
                >
                  <span style={{ fontSize: '1.2rem' }}>{err.icon}</span>
                  <div>
                    <div>{err.label}</div>
                    <div style={{ fontSize: '0.68rem', color: '#fca5a5', fontWeight: 'normal' }}>
                      {err.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Footer with Skip Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleQuickSkip}
            title="Fast 1-tap score increment without logging error details"
          >
            <Zap size={14} color="#f59e0b" />
            <span>Quick Point (+1 Only)</span>
          </button>

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
