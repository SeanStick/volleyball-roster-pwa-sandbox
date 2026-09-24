import React, { useState } from 'react';
import { X, Trophy, AlertTriangle, Sparkles, User, Users, Shield, ArrowRight, Zap, Check, ShieldAlert, Footprints } from 'lucide-react';
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
  const [showMoreViolations, setShowMoreViolations] = useState(false);

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
    const isDropped = errorDef.id === 'dropped_ball';
    const isTeam = targetPlayerId === 'team' || (!targetPlayerId && isDropped);

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
      errorPlayerId: errorPlayer ? errorPlayer.id : (isTeam ? 'team' : null),
      errorPlayerName: errorPlayer ? errorPlayer.name : (isTeam ? (isDropped ? 'Team Miscommunication' : 'Team Unforced') : null),
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
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Opp Attack/Net Error</span>
                  <span style={{ fontSize: '0.72rem', color: '#fde68a' }}>Spike Out / Net Touch</span>
                </button>

                {/* 5. Opponent Dropped Ball */}
                <button
                  className="btn-player-pick"
                  style={{
                    background: 'rgba(245, 158, 11, 0.18)',
                    borderColor: 'rgba(245, 158, 11, 0.6)',
                    color: '#fef08a',
                    padding: '0.85rem 0.65rem',
                    flexDirection: 'column',
                    textAlign: 'center',
                    gap: '0.25rem'
                  }}
                  onClick={() => handleEarnedPoint('opp_dropped_ball')}
                  title="Opponent miscommunication / let ball drop inbounds untouched"
                >
                  <span style={{ fontSize: '1.6rem' }}>📍</span>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Opp Dropped Ball</span>
                  <span style={{ fontSize: '0.72rem', color: '#fde68a' }}>Untouched Inbounds</span>
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
                    <button
                      className="btn-player-pick"
                      style={{ padding: '0.55rem 0.65rem', gridColumn: '1 / -1', justifyContent: 'center' }}
                      onClick={() => handleEarnedPoint(selectedEarnedType, null)}
                    >
                      <span style={{ fontWeight: 800 }}>⚡ General {selectedEarnedType === 'kill' ? 'Kill' : 'Block'} (Skip Player Tag)</span>
                    </button>

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
               ⚠️ POINT FOR OPPONENT FLOW (STREAMLINED FAST ERRORS)
               ========================================================================= */
            <div>
              {/* Optional Player Assignment Bar */}
              <div style={{ marginBottom: '0.85rem', background: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fca5a5', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Attribute to Player (Optional):</span>
                  {selectedPlayerId && (
                    <button
                      type="button"
                      onClick={() => setSelectedPlayerId(null)}
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '3px' }}>
                  <button
                    type="button"
                    className={`btn-player-pick ${selectedPlayerId === 'team' || !selectedPlayerId ? 'selected' : ''}`}
                    onClick={() => setSelectedPlayerId(selectedPlayerId === 'team' ? null : 'team')}
                    style={{
                      padding: '0.3rem 0.55rem',
                      fontSize: '0.74rem',
                      whiteSpace: 'nowrap',
                      background: selectedPlayerId === 'team' || !selectedPlayerId ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: selectedPlayerId === 'team' || !selectedPlayerId ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span>👥 Team / Unforced</span>
                  </button>

                  {activeCourtPlayers.map(({ player, zoneNum }) => {
                    const isSelected = selectedPlayerId === player.id;
                    return (
                      <button
                        key={player.id}
                        type="button"
                        className={`btn-player-pick ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedPlayerId(isSelected ? null : player.id)}
                        style={{
                          padding: '0.3rem 0.55rem',
                          fontSize: '0.74rem',
                          whiteSpace: 'nowrap',
                          background: isSelected ? 'rgba(239, 68, 68, 0.35)' : 'rgba(30, 41, 59, 0.7)',
                          borderColor: isSelected ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                          color: isSelected ? '#fca5a5' : '#f8fafc'
                        }}
                      >
                        <span style={{ fontWeight: 800 }}>#{player.number}</span>
                        <span>{player.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1-Tap Most Common Core Errors */}
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.45rem' }}>
                Select Error (1-Tap Auto Records):
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {/* 🌟 DROPPED BALL (INBOUNDS / NOBODY WENT) */}
                <button
                  type="button"
                  className="btn-error-pick"
                  style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderColor: 'rgba(245, 158, 11, 0.65)',
                    color: '#fef08a',
                    padding: '0.75rem 0.85rem'
                  }}
                  onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'dropped_ball') || {
                    id: 'dropped_ball',
                    label: 'Dropped Ball (Untouched Inbounds / Miscommunication)',
                    category: ERROR_CATEGORIES.PASS_RECEIVE
                  })}
                >
                  <span style={{ fontSize: '1.4rem' }}>📍</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Dropped Ball (Inbounds)</div>
                    <div style={{ fontSize: '0.68rem', color: '#fde68a' }}>No player went after it / hesitation</div>
                  </div>
                </button>

                {/* Service Errors (if serving) */}
                {isServingPhase && (
                  <>
                    <button
                      type="button"
                      className="btn-error-pick"
                      onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'missed_serve_net'))}
                    >
                      <span style={{ fontSize: '1.3rem' }}>🏐</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Serve in Net</div>
                        <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>#{currentServer?.number || '1'} Server</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="btn-error-pick"
                      onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'missed_serve_out'))}
                    >
                      <span style={{ fontSize: '1.3rem' }}>🏐</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Serve Out</div>
                        <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>#{currentServer?.number || '1'} Server</div>
                      </div>
                    </button>
                  </>
                )}

                {/* Pass Shank / Ace */}
                <button
                  type="button"
                  className="btn-error-pick"
                  onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'receive_ace_against') || {
                    id: 'receive_ace_against',
                    label: 'Serve Receive Shank / Ace',
                    category: ERROR_CATEGORIES.PASS_RECEIVE
                  })}
                >
                  <span style={{ fontSize: '1.3rem' }}>🎯</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Pass Shank / Ace</div>
                    <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>Bad pass / receiver error</div>
                  </div>
                </button>

                {/* Attack Out / Net */}
                <button
                  type="button"
                  className="btn-error-pick"
                  onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'attack_out') || {
                    id: 'attack_out',
                    label: 'Attack (Out / Net)',
                    category: ERROR_CATEGORIES.ATTACK
                  })}
                >
                  <span style={{ fontSize: '1.3rem' }}>💥</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Hit Out / In Net</div>
                    <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>Spike error</div>
                  </div>
                </button>

                {/* Hit Blocked (Roofed) */}
                <button
                  type="button"
                  className="btn-error-pick"
                  onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'attack_blocked') || {
                    id: 'attack_blocked',
                    label: 'Attack (Blocked / Roofed)',
                    category: ERROR_CATEGORIES.ATTACK
                  })}
                >
                  <span style={{ fontSize: '1.3rem' }}>🛑</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Hit Blocked</div>
                    <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>Opponent roof block</div>
                  </div>
                </button>

                {/* Opponent Kill */}
                <button
                  type="button"
                  className="btn-error-pick"
                  onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'opp_kill') || {
                    id: 'opp_kill',
                    label: 'Opponent Spike Kill',
                    category: ERROR_CATEGORIES.OPPONENT_EARNED
                  })}
                >
                  <span style={{ fontSize: '1.3rem' }}>⚡</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Opponent Kill</div>
                    <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>Hard-driven winner</div>
                  </div>
                </button>

                {/* Net Touch / Line Violation */}
                <button
                  type="button"
                  className="btn-error-pick"
                  onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === 'net_touch') || {
                    id: 'net_touch',
                    label: 'Net Touch Violation',
                    category: ERROR_CATEGORIES.NET_COURT
                  })}
                >
                  <span style={{ fontSize: '1.3rem' }}>🚫</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Net / Line Fault</div>
                    <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>Net touch or centerline</div>
                  </div>
                </button>
              </div>

              {/* Collapsible Rare Violations */}
              <div style={{ marginTop: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setShowMoreViolations(prev => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.25rem 0'
                  }}
                >
                  <span>{showMoreViolations ? '▲ Hide Technical Violations' : '▼ More Rule Violations (Double, Lift, Overlap...)'}</span>
                </button>

                {showMoreViolations && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem', marginTop: '0.4rem' }}>
                    {[
                      { id: 'double_contact', label: 'Double Contact', icon: '🖐️', cat: ERROR_CATEGORIES.HANDLING },
                      { id: 'lift_carry', label: 'Lift / Carry', icon: '🤲', cat: ERROR_CATEGORIES.HANDLING },
                      { id: 'four_hits', label: 'Four Hits', icon: '4️⃣', cat: ERROR_CATEGORIES.HANDLING },
                      { id: 'rotation_overlap', label: 'Rotation Overlap', icon: '🔄', cat: ERROR_CATEGORIES.ROTATION },
                      { id: 'centerline_fault', label: 'Centerline Fault', icon: '👟', cat: ERROR_CATEGORIES.NET_COURT }
                    ].map(v => (
                      <button
                        key={v.id}
                        type="button"
                        className="btn-error-pick"
                        style={{ padding: '0.45rem 0.55rem', fontSize: '0.74rem' }}
                        onClick={() => handleErrorPoint(VOLLEYBALL_ERRORS.find(e => e.id === v.id) || { id: v.id, label: v.label, category: v.cat })}
                      >
                        <span>{v.icon}</span>
                        <span>{v.label}</span>
                      </button>
                    ))}
                  </div>
                )}
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
