import React, { useState } from 'react';
import { X, Trophy, AlertTriangle, Sparkles, User, Users, Volleyball, Shield, ArrowRight, Zap, Check, ShieldAlert, Footprints } from 'lucide-react';
import {
  VOLLEYBALL_ERRORS,
  ERROR_CATEGORIES,
  POINT_EARNED_TYPES,
  getValidErrorsForPhase,
  getValidEarnedTypesForPhase
} from '../services/matchStatsService';
import { ZONE_LABELS } from '../services/volleyballRules';

export default function QuickPointModal({
  isOpen,
  onClose,
  scoringTeam, // 'us' | 'opponent'
  onConfirmPoint,
  lineup = {},
  roster = [],
  rotation = 1,
  phase = 'serve', // 'serve' | 'receive'
  currentScore = { ourScore: 0, opponentScore: 0, setNumber: 1 }
}) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedEarnedType, setSelectedEarnedType] = useState(null);
  const [selectedErrorCategory, setSelectedErrorCategory] = useState('ALL');

  if (!isOpen) return null;

  const isPointToUs = scoringTeam === 'us';
  const isServingPhase = phase === 'serve';

  // Get active 6 players currently on the court
  const activeCourtPlayers = Object.entries(lineup)
    .map(([zoneKey, playerId]) => {
      const p = roster.find(player => player.id === playerId);
      const isFrontRow = zoneKey === 'pos4' || zoneKey === 'pos3' || zoneKey === 'pos2';
      return {
        zoneKey,
        zoneNum: ZONE_LABELS[zoneKey]?.num || zoneKey,
        isFrontRow,
        isBackRow: !isFrontRow,
        player: p
      };
    })
    .filter(item => Boolean(item.player));

  // Current server on court (pos1)
  const currentServerId = lineup.pos1;
  const currentServer = roster.find(p => p.id === currentServerId);

  // Front-row blockers (pos4, pos3, pos2)
  const frontRowBlockers = activeCourtPlayers.filter(p => p.isFrontRow);

  // Primary passers (pos5, pos6, pos1 + libero)
  const backRowPassers = activeCourtPlayers.filter(p => p.isBackRow || p.player.position === 'Libero' || p.player.isLibero);

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
  const handleErrorPoint = (errorDef, customPlayerId = null) => {
    let errorPlayer = null;
    const targetPlayerId = customPlayerId || selectedPlayerId;

    if (errorDef.validPhases?.length === 1 && errorDef.validPhases[0] === 'serve' && currentServer) {
      // Auto-assign service errors (missed serve net/out/foot fault) to the current server
      errorPlayer = currentServer;
    } else if (targetPlayerId && targetPlayerId !== 'team') {
      errorPlayer = roster.find(p => p.id === targetPlayerId);
    }

    onConfirmPoint({
      pointWonBy: 'opponent',
      errorTypeId: errorDef.id,
      errorTypeName: errorDef.label,
      errorCategory: errorDef.category,
      errorPlayerId: errorPlayer ? errorPlayer.id : null,
      errorPlayerName: errorPlayer ? errorPlayer.name : (targetPlayerId === 'team' ? 'Team Unforced' : null),
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
      earnedType: isPointToUs ? (isServingPhase ? 'quick_serve_point' : 'quick_sideout_point') : null,
      errorTypeId: !isPointToUs ? 'unspecified_error' : null,
      errorCategory: !isPointToUs ? 'General Error' : null,
      rotation,
      phase,
      setNumber: currentScore.setNumber
    });
    onClose();
  };

  // Filtered legally-valid error list for current phase
  const validErrorsForCurrentPhase = getValidErrorsForPhase(phase).filter(
    e => e.category !== ERROR_CATEGORIES.OPPONENT_EARNED
  );

  // Dynamic filter categories (e.g. only show Service category if we are serving, etc.)
  const availableCategories = [
    { id: 'ALL', label: 'All Valid Errors' },
    ...(isServingPhase
      ? [{ id: ERROR_CATEGORIES.SERVICE, label: '🏐 Serve Errors' }]
      : [{ id: ERROR_CATEGORIES.PASS_RECEIVE, label: '🎯 Pass / Receive' }]),
    { id: ERROR_CATEGORIES.ATTACK, label: '💥 Attack Errors' },
    { id: ERROR_CATEGORIES.HANDLING, label: '⚙️ Setting / Hands' },
    { id: ERROR_CATEGORIES.NET_COURT, label: '⚠️ Net / Line' }
  ];

  const filteredErrors = validErrorsForCurrentPhase.filter(
    e => selectedErrorCategory === 'ALL' || e.category === selectedErrorCategory
  );

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1300,
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="point-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '92dvh',
          height: 'auto',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '0',
          animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* =========================================================================
            HEADER WITH LIVE SERVE/RECEIVE CONTEXT
           ========================================================================= */}
        <div
          style={{
            padding: '0.85rem 1.15rem',
            background: isPointToUs
              ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.15))'
              : 'linear-gradient(90deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.15))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: isPointToUs ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: isPointToUs ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(239, 68, 68, 0.4)'
              }}
            >
              {isPointToUs ? <Trophy size={18} /> : <AlertTriangle size={18} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: isPointToUs ? '#a7f3d0' : '#fca5a5', fontWeight: 800 }}>
                {isPointToUs
                  ? (isServingPhase ? 'Point to Us (Serving)' : 'Point to Us (Side-Out!)')
                  : (isServingPhase ? 'Side-Out to Opponent' : 'Opponent Point (Serve-Receive)')}
              </h3>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Set {currentScore.setNumber}</span>
                <span>•</span>
                <span>Rot #{rotation}</span>
                <span>•</span>
                <span style={{ color: isServingPhase ? '#60a5fa' : '#fbbf24', fontWeight: 800 }}>
                  {isServingPhase ? `🏐 Serving (#${currentServer?.number || '1'} ${currentServer?.name?.split(' ')[0] || 'Server'})` : '🛡️ Receiving Serve'}
                </span>
              </div>
            </div>
          </div>

          <button
            className="btn-icon btn-sm"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '50%', width: '30px', height: '30px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* =========================================================================
            SCROLLABLE CONTENT BODY
           ========================================================================= */}
        <div
          style={{
            padding: '1rem 1.15rem',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* =========================================================================
              🏆 POINT FOR OUR TEAM FLOW
             ========================================================================= */}
          {isPointToUs ? (
            <div>
              <div className="point-flow-step-title" style={{ fontSize: '0.85rem', color: '#93c5fd', fontWeight: 800, marginBottom: '0.6rem' }}>
                {isServingPhase ? 'How did we win the point?' : 'How did we win the Side-Out?'}
              </div>

              {/* Contextual 1-Tap Winner Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                {/* 1. If Serving: Service Ace (1-Tap Server Auto-Assigned) */}
                {isServingPhase ? (
                  <button
                    className={`btn-player-pick ${selectedEarnedType === 'ace' ? 'selected' : ''}`}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      borderColor: 'rgba(16, 185, 129, 0.45)',
                      color: '#a7f3d0',
                      padding: '0.85rem 0.65rem',
                      flexDirection: 'column',
                      textAlign: 'center',
                      gap: '0.25rem'
                    }}
                    onClick={() => handleEarnedPoint('ace')}
                  >
                    <span style={{ fontSize: '1.6rem' }}>🏐</span>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Service Ace</span>
                    <span style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>
                      {currentServer ? `#${currentServer.number} ${currentServer.name.split(' ')[0]}` : 'Server'}
                    </span>
                  </button>
                ) : (
                  /* If Receiving: Opponent Missed Serve (1-Tap Side-Out Winner!) */
                  <button
                    className="btn-player-pick"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      borderColor: 'rgba(16, 185, 129, 0.45)',
                      color: '#a7f3d0',
                      padding: '0.85rem 0.65rem',
                      flexDirection: 'column',
                      textAlign: 'center',
                      gap: '0.25rem'
                    }}
                    onClick={() => handleEarnedPoint('opp_missed_serve')}
                  >
                    <span style={{ fontSize: '1.6rem' }}>🏐</span>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Opp Missed Serve</span>
                    <span style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>1-Tap Side-Out (Net/Out)</span>
                  </button>
                )}

                {/* 2. Attack Kill (Side-out kill or transition kill) */}
                <button
                  className={`btn-player-pick ${selectedEarnedType === 'kill' ? 'selected' : ''}`}
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    borderColor: 'rgba(59, 130, 246, 0.45)',
                    color: '#bfdbfe',
                    padding: '0.85rem 0.65rem',
                    flexDirection: 'column',
                    textAlign: 'center',
                    gap: '0.25rem'
                  }}
                  onClick={() => setSelectedEarnedType(selectedEarnedType === 'kill' ? null : 'kill')}
                >
                  <span style={{ fontSize: '1.6rem' }}>💥</span>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                    {isServingPhase ? 'Transition Kill' : 'Side-Out Kill'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#93c5fd' }}>
                    {selectedEarnedType === 'kill' ? 'Select Hitter Below ▼' : 'Tap to Pick Hitter'}
                  </span>
                </button>

                {/* 3. Block Kill (Front-Row Rule 14.1.3 Enforced) */}
                <button
                  className={`btn-player-pick ${selectedEarnedType === 'block' ? 'selected' : ''}`}
                  style={{
                    background: 'rgba(168, 85, 247, 0.15)',
                    borderColor: 'rgba(168, 85, 247, 0.45)',
                    color: '#e9d5ff',
                    padding: '0.85rem 0.65rem',
                    flexDirection: 'column',
                    textAlign: 'center',
                    gap: '0.25rem'
                  }}
                  onClick={() => setSelectedEarnedType(selectedEarnedType === 'block' ? null : 'block')}
                >
                  <span style={{ fontSize: '1.6rem' }}>🧱</span>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Block Kill</span>
                  <span style={{ fontSize: '0.72rem', color: '#d8b4fe' }}>
                    {selectedEarnedType === 'block' ? 'Select Blocker Below ▼' : 'Front-Row Blocker (Z4/3/2)'}
                  </span>
                </button>

                {/* 4. Opponent Error */}
                <button
                  className="btn-player-pick"
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    borderColor: 'rgba(245, 158, 11, 0.45)',
                    color: '#fef3c7',
                    padding: '0.85rem 0.65rem',
                    flexDirection: 'column',
                    textAlign: 'center',
                    gap: '0.25rem'
                  }}
                  onClick={() => handleEarnedPoint('opp_error')}
                >
                  <span style={{ fontSize: '1.6rem' }}>❌</span>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Opponent Error</span>
                  <span style={{ fontSize: '0.72rem', color: '#fde68a' }}>Spike Out / Net Touch</span>
                </button>
              </div>

              {/* Hitter / Blocker Player Selection with Rule Validation */}
              {(selectedEarnedType === 'kill' || selectedEarnedType === 'block') && (
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.85rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} color="#f59e0b" />
                    <span>
                      {selectedEarnedType === 'kill'
                        ? 'Who scored the Attack Kill?'
                        : 'Who scored the Block Kill? (Rule 14.1.3: Front-Row Only)'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                    {(selectedEarnedType === 'block' ? frontRowBlockers : activeCourtPlayers).map(({ player, zoneNum, isFrontRow }) => (
                      <button
                        key={player.id}
                        className="btn-player-pick"
                        style={{ padding: '0.55rem 0.65rem' }}
                        onClick={() => handleEarnedPoint(selectedEarnedType, player.id)}
                      >
                        <div className="jersey-badge-sm">#{player.number}</div>
                        <div style={{ textAlign: 'left', minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {player.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: isFrontRow ? '#93c5fd' : 'var(--text-muted)' }}>
                            Z{zoneNum} • {player.position} {isFrontRow ? '(Front)' : ''}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
               ⚠️ POINT FOR OPPONENT FLOW (CONTEXTUAL ERROR RULES)
               ========================================================================= */
            <div>
              {/* Quick 1-Tap Most Probable Error Shortcuts */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fca5a5', marginBottom: '0.45rem' }}>
                  {isServingPhase ? '1-Tap Service Errors (Auto-Assigned to Server):' : '1. Player Responsible (Optional):'}
                </div>

                {isServingPhase ? (
                  /* 1-Tap Service Errors for Current Server */
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn-error-pick"
                      style={{ padding: '0.5rem 0.4rem', flexDirection: 'column', textAlign: 'center', gap: '0.2rem' }}
                      onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'missed_serve_net'))}
                    >
                      <span style={{ fontSize: '1.3rem' }}>🏐</span>
                      <span style={{ fontWeight: 800, fontSize: '0.76rem' }}>Serve in Net</span>
                      <span style={{ fontSize: '0.65rem', color: '#fca5a5' }}>#{currentServer?.number || '1'} Server</span>
                    </button>

                    <button
                      type="button"
                      className="btn-error-pick"
                      style={{ padding: '0.5rem 0.4rem', flexDirection: 'column', textAlign: 'center', gap: '0.2rem' }}
                      onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'missed_serve_out'))}
                    >
                      <span style={{ fontSize: '1.3rem' }}>🏐</span>
                      <span style={{ fontWeight: 800, fontSize: '0.76rem' }}>Serve Out</span>
                      <span style={{ fontSize: '0.65rem', color: '#fca5a5' }}>#{currentServer?.number || '1'} Server</span>
                    </button>

                    <button
                      type="button"
                      className="btn-error-pick"
                      style={{ padding: '0.5rem 0.4rem', flexDirection: 'column', textAlign: 'center', gap: '0.2rem' }}
                      onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'service_foot_fault'))}
                    >
                      <span style={{ fontSize: '1.3rem' }}>🦶</span>
                      <span style={{ fontWeight: 800, fontSize: '0.76rem' }}>Foot Fault</span>
                      <span style={{ fontSize: '0.65rem', color: '#fca5a5' }}>#{currentServer?.number || '1'} Server</span>
                    </button>
                  </div>
                ) : (
                  /* Player Grid when Receiving */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '0.4rem' }}>
                    {activeCourtPlayers.map(({ player, zoneNum, isBackRow }) => {
                      const isSelected = selectedPlayerId === player.id;

                      return (
                        <button
                          key={player.id}
                          className={`btn-player-pick ${isSelected ? 'selected' : ''}`}
                          style={{
                            padding: '0.45rem 0.55rem',
                            background: isSelected ? 'rgba(239, 68, 68, 0.3)' : 'rgba(30, 41, 59, 0.8)',
                            borderColor: isSelected ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                            color: isSelected ? '#fca5a5' : '#f8fafc'
                          }}
                          onClick={() => setSelectedPlayerId(isSelected ? null : player.id)}
                        >
                          <div className={`jersey-badge-sm ${player.position === 'Libero' ? 'libero-num' : ''}`} style={{ width: '22px', height: '22px', fontSize: '0.72rem' }}>
                            #{player.number}
                          </div>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>{player.name.split(' ')[0]}</div>
                            <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Z{zoneNum} {isBackRow ? '• Pass' : ''}</div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Team / Unforced Button */}
                    <button
                      className={`btn-player-pick ${selectedPlayerId === 'team' ? 'selected' : ''}`}
                      onClick={() => setSelectedPlayerId(selectedPlayerId === 'team' ? null : 'team')}
                      style={{
                        padding: '0.45rem 0.55rem',
                        background: selectedPlayerId === 'team' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        borderColor: selectedPlayerId === 'team' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Users size={16} color="var(--text-secondary)" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.76rem' }}>Team Error</div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Unforced</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Category Filter Chips */}
              <div style={{ marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
                  {isServingPhase ? 'Other Rally Errors:' : '2. Tap Error (Auto-records point):'}
                </div>

                <div style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', paddingBottom: '4px' }}>
                  {availableCategories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedErrorCategory(cat.id)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '999px',
                        border: selectedErrorCategory === cat.id ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: selectedErrorCategory === cat.id ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                        color: selectedErrorCategory === cat.id ? '#fca5a5' : '#94a3b8',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Buttons Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {filteredErrors.map((err) => (
                  <button
                    key={err.id}
                    className="btn-error-pick"
                    style={{ padding: '0.6rem 0.75rem', minHeight: '52px' }}
                    onClick={() => handleErrorPoint(err)}
                  >
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{err.icon}</span>
                    <div style={{ minWidth: 0, textAlign: 'left' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1.2 }}>{err.shortLabel || err.label}</div>
                      <div style={{ fontSize: '0.65rem', color: '#fca5a5', opacity: 0.8, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {err.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            FOOTER
           ========================================================================= */}
        <div
          style={{
            padding: '0.75rem 1.15rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            gap: '0.5rem'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleQuickSkip}
            title="Fast 1-tap score increment without logging error details"
            style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
          >
            <Zap size={14} color="#f59e0b" />
            <span>Quick Point (+1 Only)</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ fontSize: '0.8rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
