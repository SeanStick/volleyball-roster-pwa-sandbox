import React, { useState } from 'react';
import {
  X,
  Trophy,
  AlertTriangle,
  Sparkles,
  Volleyball,
  Shield,
  RotateCw,
  ArrowRight,
  Zap,
  Check,
  Flame,
  User,
  Info
} from 'lucide-react';
import { VOLLEYBALL_ERRORS, ERROR_CATEGORIES, POINT_EARNED_TYPES } from '../services/matchStatsService';
import { ZONE_LABELS } from '../services/volleyballRules';

export default function RallyOutcomeModal({
  isOpen,
  onClose,
  phase = 'receive', // 'receive' | 'serve'
  rotation = 1,
  lineup = {},
  roster = [],
  currentScore = { ourScore: 0, opponentScore: 0, setNumber: 1, ourSetsWon: 0, opponentSetsWon: 0, opponentName: 'Opponent' },
  onRallyWonByUs,
  onRallyWonByOpponent,
  onDirectAdvanceOnly
}) {
  const [selectedActionType, setSelectedActionType] = useState(null); // 'kill' | 'ace' | 'error_receive' | etc.
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  if (!isOpen) return null;

  const isReceivePhase = phase === 'receive';

  // Helper to get player object
  const getPlayer = (playerId) => roster.find(p => p.id === playerId) || null;

  // Front-row hitters on court (Zones 4, 3, 2)
  const frontRowHitters = [
    { zoneKey: 'pos4', zoneNum: 4, label: 'Left Front (Z4)', player: getPlayer(lineup.pos4) },
    { zoneKey: 'pos3', zoneNum: 3, label: 'Middle Front (Z3)', player: getPlayer(lineup.pos3) },
    { zoneKey: 'pos2', zoneNum: 2, label: 'Right Front (Z2)', player: getPlayer(lineup.pos2) }
  ].filter(item => Boolean(item.player));

  // Back-row passers / defenders on court (Zones 5, 6, 1)
  const backRowPassers = [
    { zoneKey: 'pos5', zoneNum: 5, label: 'Left Back (Z5)', player: getPlayer(lineup.pos5) },
    { zoneKey: 'pos6', zoneNum: 6, label: 'Middle Back (Z6)', player: getPlayer(lineup.pos6) },
    { zoneKey: 'pos1', zoneNum: 1, label: 'Right Back (Z1)', player: getPlayer(lineup.pos1) }
  ].filter(item => Boolean(item.player));

  // Server currently in Zone 1
  const currentServer = getPlayer(lineup.pos1);

  // =========================================================================
  // 1. FAST US WIN ACTIONS
  // =========================================================================
  const handleFastUsWin = () => {
    onRallyWonByUs({
      pointWonBy: 'us',
      earnedType: isReceivePhase ? 'sideout_point' : 'serve_point',
      earnedTypeName: isReceivePhase ? 'Side-Out Point' : 'Service Point',
      rotation,
      phase,
      setNumber: currentScore.setNumber || 1
    });
    onClose();
  };

  const handleDetailedUsWin = (earnedType, playerId = null) => {
    let earnedPlayer = null;
    if (playerId) {
      earnedPlayer = getPlayer(playerId);
    } else if (earnedType === 'ace' && currentServer) {
      earnedPlayer = currentServer;
    }

    onRallyWonByUs({
      pointWonBy: 'us',
      earnedType,
      earnedTypeName: POINT_EARNED_TYPES.find(t => t.id === earnedType)?.label || earnedType,
      earnedPlayerId: earnedPlayer ? earnedPlayer.id : null,
      earnedPlayerName: earnedPlayer ? earnedPlayer.name : null,
      earnedPlayerNumber: earnedPlayer ? earnedPlayer.number : null,
      rotation,
      phase,
      setNumber: currentScore.setNumber || 1
    });
    onClose();
  };

  // =========================================================================
  // 2. FAST OPPONENT WIN ACTIONS
  // =========================================================================
  const handleFastOpponentWin = () => {
    onRallyWonByOpponent({
      pointWonBy: 'opponent',
      errorTypeId: isReceivePhase ? 'receive_breakdown' : 'lost_serve',
      errorTypeName: isReceivePhase ? 'Receive Point Conceded' : 'Side-Out to Opponent',
      rotation,
      phase,
      setNumber: currentScore.setNumber || 1
    });
    onClose();
  };

  const handleDetailedOpponentWin = (errorDef, playerId = null) => {
    let errorPlayer = null;
    if (playerId) {
      errorPlayer = getPlayer(playerId);
    } else if (errorDef.id?.includes('serve') && currentServer) {
      errorPlayer = currentServer;
    }

    onRallyWonByOpponent({
      pointWonBy: 'opponent',
      errorTypeId: errorDef.id,
      errorTypeName: errorDef.label,
      errorCategory: errorDef.category,
      errorPlayerId: errorPlayer ? errorPlayer.id : null,
      errorPlayerName: errorPlayer ? errorPlayer.name : null,
      errorPlayerNumber: errorPlayer ? errorPlayer.number : null,
      rotation,
      phase,
      setNumber: currentScore.setNumber || 1
    });
    onClose();
  };

  // =========================================================================
  // 3. FAST BYPASS (ROTATE / ADVANCE WITHOUT SCORING)
  // =========================================================================
  const handleBypass = () => {
    if (onDirectAdvanceOnly) {
      onDirectAdvanceOnly();
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rally-outcome-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="rally-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className={`rally-phase-avatar ${isReceivePhase ? 'receive' : 'serve'}`}>
              {isReceivePhase ? <Shield size={20} color="#34d399" /> : <Volleyball size={20} color="#60a5fa" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                  {isReceivePhase ? 'Serve Receive Rally' : 'Serving Rally'}
                </h3>
                <span className="rally-rotation-badge">Rotation {rotation}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {isReceivePhase
                  ? 'Opponent served to us. How did the rally end?'
                  : 'Our team served to opponent. How did the rally end?'}
              </p>
            </div>
          </div>

          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Live Score Strip */}
        <div className="rally-score-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Set {currentScore.setNumber || 1} Score:
            </span>
            <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>US {currentScore.ourScore || 0}</strong>
            <span style={{ color: 'var(--text-muted)' }}>:</span>
            <strong style={{ color: '#f87171', fontSize: '1.1rem' }}>{currentScore.opponentScore || 0} {currentScore.opponentName?.slice(0, 3) || 'OPP'}</strong>
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Select outcome to auto-update score & advance rotation
          </span>
        </div>

        {/* =========================================================================
            SECTION 1: OUR TEAM WON THE RALLY (+1 POINT TO US)
           ========================================================================= */}
        <div className="rally-outcome-card win-us">
          <div className="rally-card-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Trophy size={18} color="#34d399" />
              <strong style={{ fontSize: '0.95rem', color: '#34d399' }}>
                {isReceivePhase ? '🌟 Side-Out Won! (+1 Us & Rotate to Serve)' : '🌟 Point Won! (+1 Us & Keep Serving)'}
              </strong>
            </div>

            {/* Fast 1-Tap Auto Button */}
            <button
              className="btn btn-primary btn-sm rally-quick-btn us"
              onClick={handleFastUsWin}
              title="Instant +1 point to Us and execute official rotation"
            >
              <Zap size={14} />
              <span>{isReceivePhase ? 'Quick +1 & Rotate' : 'Quick +1 Us'}</span>
            </button>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Or log specific earned winner for stats:
          </div>

          {/* Specific Earned Types */}
          <div className="rally-buttons-row">
            {/* Attack Kill */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button
                  className="rally-chip-btn win"
                  onClick={() => handleDetailedUsWin('kill')}
                >
                  💥 Spike Kill (General)
                </button>
                {frontRowHitters.map(h => (
                  <button
                    key={h.player.id}
                    className="rally-chip-btn win player"
                    onClick={() => handleDetailedUsWin('kill', h.player.id)}
                    title={`Kill by #${h.player.number} ${h.player.name} in ${h.label}`}
                  >
                    💥 #{h.player.number} {h.player.name.split(' ')[0]} ({h.player.position === 'Outside Hitter' ? 'OH' : h.player.position === 'Middle Blocker' ? 'MB' : 'RS'})
                  </button>
                ))}
              </div>
            </div>

            {/* Other Earned Types */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', width: '100%' }}>
              {!isReceivePhase && (
                <button
                  className="rally-chip-btn win player"
                  onClick={() => handleDetailedUsWin('ace', currentServer?.id)}
                  title={currentServer ? `Service Ace by #${currentServer.number} ${currentServer.name}` : 'Service Ace'}
                >
                  🏐 Service Ace {currentServer ? `(#${currentServer.number} ${currentServer.name.split(' ')[0]})` : ''}
                </button>
              )}

              <button
                className="rally-chip-btn win"
                onClick={() => handleDetailedUsWin('block')}
              >
                🧱 Block Kill (Roof)
              </button>

              <button
                className="rally-chip-btn win"
                onClick={() => handleDetailedUsWin('opp_error')}
              >
                ❌ Opponent Error (Out / Net)
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: OPPONENT WON THE RALLY (+1 POINT TO OPPONENT)
           ========================================================================= */}
        <div className="rally-outcome-card loss-us">
          <div className="rally-card-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <AlertTriangle size={18} color="#f87171" />
              <strong style={{ fontSize: '0.95rem', color: '#f87171' }}>
                {isReceivePhase ? '❌ Point to Opponent (+1 Opponent / Stay in Receive)' : '❌ Side-Out to Opponent (+1 Opponent & Switch to Receive)'}
              </strong>
            </div>

            {/* Fast 1-Tap Auto Button */}
            <button
              className="btn btn-secondary btn-sm rally-quick-btn opp"
              onClick={handleFastOpponentWin}
              title="Instant +1 point to Opponent and switch phase"
            >
              <Zap size={14} />
              <span>{isReceivePhase ? 'Quick +1 Opp' : 'Quick +1 Opp & Switch'}</span>
            </button>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Or log specific error for coaching stats:
          </div>

          {/* Specific Error Types */}
          <div className="rally-buttons-row">
            {isReceivePhase ? (
              /* Receive Phase Errors (Pass / Attack / Handling) */
              <>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', width: '100%' }}>
                  <button
                    className="rally-chip-btn loss"
                    onClick={() => handleDetailedOpponentWin({ id: 'receive_ace_against', label: 'Serve Receive Shank / Ace', category: ERROR_CATEGORIES.PASS_RECEIVE })}
                  >
                    🎯 Pass Shank / Ace
                  </button>
                  {backRowPassers.map(p => (
                    <button
                      key={p.player.id}
                      className="rally-chip-btn loss player"
                      onClick={() => handleDetailedOpponentWin({ id: 'receive_ace_against', label: 'Serve Receive Shank / Ace', category: ERROR_CATEGORIES.PASS_RECEIVE }, p.player.id)}
                      title={`Receive error by #${p.player.number} ${p.player.name}`}
                    >
                      🎯 #{p.player.number} {p.player.name.split(' ')[0]} ({p.player.position === 'Libero' ? 'Libero' : p.player.position === 'Outside Hitter' ? 'OH' : 'Passer'})
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', width: '100%' }}>
                  <button
                    className="rally-chip-btn loss"
                    onClick={() => handleDetailedOpponentWin({ id: 'attack_net', label: 'Attack (Into Net)', category: ERROR_CATEGORIES.ATTACK })}
                  >
                    💥 Hit in Net
                  </button>
                  <button
                    className="rally-chip-btn loss"
                    onClick={() => handleDetailedOpponentWin({ id: 'attack_out', label: 'Attack (Out of Bounds)', category: ERROR_CATEGORIES.ATTACK })}
                  >
                    💥 Hit Out
                  </button>
                  <button
                    className="rally-chip-btn loss"
                    onClick={() => handleDetailedOpponentWin({ id: 'attack_blocked', label: 'Attack (Blocked / Roofed)', category: ERROR_CATEGORIES.ATTACK })}
                  >
                    🛑 Hit Blocked
                  </button>
                  <button
                    className="rally-chip-btn loss"
                    onClick={() => handleDetailedOpponentWin({ id: 'double_contact', label: 'Double Contact', category: ERROR_CATEGORIES.HANDLING })}
                  >
                    🖐️ Double Contact
                  </button>
                </div>
              </>
            ) : (
              /* Serving Phase Errors (Missed Serve / Transition) */
              <>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', width: '100%' }}>
                  <button
                    className="rally-chip-btn loss player"
                    onClick={() => handleDetailedOpponentWin({ id: 'missed_serve_net', label: 'Missed Serve (Into Net)', category: ERROR_CATEGORIES.SERVICE }, currentServer?.id)}
                    title={currentServer ? `Missed serve in net by #${currentServer.number} ${currentServer.name}` : 'Missed Serve in Net'}
                  >
                    🏐 Serve in Net {currentServer ? `(#${currentServer.number} ${currentServer.name.split(' ')[0]})` : ''}
                  </button>
                  <button
                    className="rally-chip-btn loss player"
                    onClick={() => handleDetailedOpponentWin({ id: 'missed_serve_out', label: 'Missed Serve (Out of Bounds)', category: ERROR_CATEGORIES.SERVICE }, currentServer?.id)}
                    title={currentServer ? `Missed serve out by #${currentServer.number} ${currentServer.name}` : 'Missed Serve Out'}
                  >
                    🏐 Serve Out {currentServer ? `(#${currentServer.number} ${currentServer.name.split(' ')[0]})` : ''}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', width: '100%' }}>
                  <button
                    className="rally-chip-btn loss"
                    onClick={() => handleDetailedOpponentWin({ id: 'opp_kill', label: 'Opponent Spike Kill', category: ERROR_CATEGORIES.OPPONENT_EARNED })}
                  >
                    ⚡ Opponent Kill
                  </button>
                  <button
                    className="rally-chip-btn loss"
                    onClick={() => handleDetailedOpponentWin({ id: 'attack_net', label: 'Transition Hit in Net', category: ERROR_CATEGORIES.ATTACK })}
                  >
                    💥 Transition Hit in Net
                  </button>
                  <button
                    className="rally-chip-btn loss"
                    onClick={() => handleDetailedOpponentWin({ id: 'net_touch', label: 'Net Touch Violation', category: ERROR_CATEGORIES.NET_COURT })}
                  >
                    🚫 Net Touch
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal Footer with Fast Diagramming Bypass */}
        <div className="rally-modal-footer">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleBypass}
            title="Rotate or toggle phase without logging a score point (useful for drill diagramming)"
            style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
          >
            <span>Bypass (Rotate/Switch Phase Without Scoring)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
