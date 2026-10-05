import React, { useState, useEffect } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Plus,
  RotateCcw,
  Clock,
  Zap,
  Users,
  FileText,
  Sparkles,
  Shield,
  Volume2
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
import PlayingTimeModal from './PlayingTimeModal';
import '../styles/sidelineHud.css';

/**
 * GymSidelineHUDModal - Full-Screen High-Contrast Gym Sideline Display Mode
 * 
 * Specifically designed for coaches viewing a tablet/phone from 15-20 feet away:
 * - Massive 7rem+ score digits
 * - Giant 1-tap scoring buttons for sweaty or taped hands
 * - High-contrast rotation badge & active server tag
 * - Large timeout triggers with live visual dots
 * - Integrated Playing Time & R2 Lineup Card shortcuts
 */
export default function GymSidelineHUDModal({
  isOpen,
  onClose,
  matchStats = {},
  lineup = {},
  roster = [],
  rotation = 1,
  phase = 'serve',
  liberoServingRotation = null,
  liberoExchanges = {},
  onPlusUs,
  onPlusOpponent,
  onUndoLastPoint,
  onCallTimeout,
  activeTimeout = null,
  timeoutSeconds = 60,
  onEndTimeout,
  onOpenR2LineupCard = null,
  onOpenGeminiCoach = null,
  teamName = 'Our Team'
}) {
  if (!isOpen) return null;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingTimeOpen, setIsPlayingTimeOpen] = useState(false);

  const {
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    opponentName = 'Opponent',
    ourTimeoutsRemaining = 2,
    opponentTimeoutsRemaining = 2,
    pointHistory = []
  } = matchStats || {};

  const getPlayer = (id) => roster.find(p => p.id === id);

  // Toggle true browser fullscreen
  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Server player calculation
  const currentServer = (() => {
    const teamLibero = roster.find(p => p.position === 'Libero' || p.isLibero);
    if (teamLibero && liberoServingRotation === rotation) {
      return teamLibero;
    }
    return getPlayer(lineup.pos1);
  })();

  // Next Server on Sideout calculation
  const nextRotation = (rotation % 6) + 1;
  const nextServer = (() => {
    const teamLibero = roster.find(p => p.position === 'Libero' || p.isLibero);
    if (teamLibero && liberoServingRotation === nextRotation) {
      return teamLibero;
    }
    return getPlayer(lineup.pos2);
  })();

  const isReceiving = phase === 'receive';

  return (
    <div className="hud-overlay" role="dialog" aria-modal="true" aria-label="Gym Sideline HUD">
      {/* Top Header Bar */}
      <div className="hud-header">
        <div className="hud-badge-group">
          <div className="hud-pill active">
            <VolleyballIcon size={14} />
            <span>SET {setNumber}</span>
          </div>

          <div className="hud-pill">
            <span>Match Sets:</span>
            <strong style={{ color: '#10b981' }}>{ourSetsWon}</strong>
            <span>-</span>
            <strong style={{ color: '#f87171' }}>{opponentSetsWon}</strong>
          </div>

          <div className={`hud-pill ${isReceiving ? 'amber' : 'green'}`}>
            <span>{isReceiving ? 'RECEIVE' : 'SERVE'}</span>
          </div>

          <div className="hud-pill">
            <span>Rotation {rotation}</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="hud-header-actions">
          <button
            type="button"
            className="hud-btn"
            onClick={() => setIsPlayingTimeOpen(true)}
            title="Open Playing Time & Rotations Tracker"
          >
            <Clock size={14} color="#38bdf8" />
            <span>Playing Time</span>
          </button>

          {onOpenR2LineupCard && (
            <button
              type="button"
              className="hud-btn"
              onClick={onOpenR2LineupCard}
              title="Open Official R2 Lineup Card"
            >
              <FileText size={14} color="#38bdf8" />
              <span>R2 Card</span>
            </button>
          )}

          {onOpenGeminiCoach && (
            <button
              type="button"
              className="hud-btn"
              onClick={() => onOpenGeminiCoach()}
              title="Consult AI Head Coach"
            >
              <Sparkles size={14} color="#c084fc" />
              <span>AI Coach</span>
            </button>
          )}

          <button
            type="button"
            className="hud-btn"
            onClick={toggleBrowserFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button
            type="button"
            className="r2-btn-close"
            onClick={onClose}
            title="Exit Gym Sideline HUD"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="hud-body">
        {/* Active Timeout Giant Countdown Banner if timeout running */}
        {activeTimeout && (
          <div
            style={{
              background: 'linear-gradient(90deg, #b91c1c, #991b1b)',
              padding: '0.75rem 1.5rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(220, 38, 38, 0.5)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={28} className="animate-pulse" />
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900 }}>
                  TIMEOUT IN PROGRESS ({activeTimeout === 'us' ? teamName : opponentName})
                </div>
                <div style={{ fontSize: '0.75rem', color: '#fecaca' }}>
                  60-Second Official Rest Period
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '2.5rem', fontWeight: 900 }}>
                0:{timeoutSeconds < 10 ? `0${timeoutSeconds}` : timeoutSeconds}
              </div>
              {onEndTimeout && (
                <button
                  type="button"
                  className="hud-btn"
                  onClick={onEndTimeout}
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 900 }}
                >
                  Resume Play
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            GIANT STADIUM SCOREBOARD DISPLAY (15-20 FT VISIBILITY)
            ========================================================================= */}
        <div className="hud-stadium-board">
          {/* US Column */}
          <div className="hud-team-column">
            <span className="hud-team-name us">{teamName}</span>
            <div className="hud-score-number us">{ourScore}</div>
            <button
              type="button"
              className="hud-giant-btn us"
              onClick={onPlusUs}
              title="Add 1 Point to Us (+1 US)"
            >
              <Plus size={28} />
              <span>+1 US</span>
            </button>
          </div>

          {/* Center Column: VS, Undo, Timeouts */}
          <div className="hud-center-column">
            <div className="hud-vs-badge">:</div>

            {/* Undo Button */}
            <button
              type="button"
              className="hud-undo-btn"
              onClick={onUndoLastPoint}
              disabled={pointHistory.length === 0}
              title="Undo last recorded point"
            >
              <RotateCcw size={16} />
              <span>Undo Last</span>
            </button>

            {/* Timeout Buttons */}
            <div className="hud-timeout-group">
              {/* US Timeout */}
              <button
                type="button"
                className="hud-to-btn"
                onClick={() => onCallTimeout && onCallTimeout('us')}
                disabled={ourTimeoutsRemaining <= 0}
                title="Call Timeout for Us"
              >
                <span>US TO</span>
                <div className="hud-to-dots">
                  <span className={`hud-dot ${ourTimeoutsRemaining >= 1 ? 'active-us' : ''}`} />
                  <span className={`hud-dot ${ourTimeoutsRemaining >= 2 ? 'active-us' : ''}`} />
                </div>
              </button>

              {/* OPP Timeout */}
              <button
                type="button"
                className="hud-to-btn"
                onClick={() => onCallTimeout && onCallTimeout('opponent')}
                disabled={opponentTimeoutsRemaining <= 0}
                title="Record Opponent Timeout"
              >
                <span>OPP TO</span>
                <div className="hud-to-dots">
                  <span className={`hud-dot ${opponentTimeoutsRemaining >= 1 ? 'active-opp' : ''}`} />
                  <span className={`hud-dot ${opponentTimeoutsRemaining >= 2 ? 'active-opp' : ''}`} />
                </div>
              </button>
            </div>
          </div>

          {/* OPP Column */}
          <div className="hud-team-column">
            <span className="hud-team-name opp">{opponentName}</span>
            <div className="hud-score-number opp">{opponentScore}</div>
            <button
              type="button"
              className="hud-giant-btn opp"
              onClick={onPlusOpponent}
              title="Add 1 Point to Opponent (+1 OPP)"
            >
              <Plus size={28} />
              <span>+1 OPP</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM COURT HUD (ON-COURT STARTERS & TACTICAL ROTATION BAR)
            ========================================================================= */}
        <div className="hud-court-strip">
          <div className="hud-court-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#38bdf8' }}>
                Floor Lineup (Rot {rotation})
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {isReceiving ? (
                  <>On Sideout: <strong>#{nextServer?.number || '--'} {nextServer?.name || ''}</strong> serves (Rot {nextRotation})</>
                ) : (
                  <>Active Server: <strong>#{currentServer?.number || '--'} {currentServer?.name || ''}</strong></>
                )}
              </span>
            </div>

            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Tap any button above to score directly from sideline
            </span>
          </div>

          {/* 6 On-Court Players Grid */}
          <div className="hud-court-players-grid">
            {[
              { zoneKey: 'pos4', roman: 'IV', label: 'LF', isFront: true },
              { zoneKey: 'pos3', roman: 'III', label: 'MF', isFront: true },
              { zoneKey: 'pos2', roman: 'II', label: 'RF', isFront: true },
              { zoneKey: 'pos5', roman: 'V', label: 'LB', isFront: false },
              { zoneKey: 'pos6', roman: 'VI', label: 'MB', isFront: false },
              { zoneKey: 'pos1', roman: 'I', label: 'RB (Server)', isFront: false, isServer: true }
            ].map(zone => {
              const p = getPlayer(lineup[zone.zoneKey]);
              const isServer = zone.zoneKey === 'pos1' && !isReceiving;

              return (
                <div
                  key={zone.zoneKey}
                  className={`hud-player-cell ${isServer ? 'is-server' : ''} ${zone.isFront ? 'is-front' : ''}`}
                >
                  <span className="hud-player-zone-tag">{zone.roman} ({zone.label})</span>
                  <div className="hud-player-num">{p ? `#${p.number}` : '--'}</div>
                  <div className="hud-player-name">{p ? p.name.split(' ')[0] : 'Empty'}</div>
                  <div className="hud-player-pos">{p ? p.position : ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Playing Time Modal */}
      {isPlayingTimeOpen && (
        <PlayingTimeModal
          isOpen={isPlayingTimeOpen}
          onClose={() => setIsPlayingTimeOpen(false)}
          roster={roster}
          pointHistory={pointHistory}
          matchStats={matchStats}
          currentLineup={lineup}
          teamName={teamName}
        />
      )}
    </div>
  );
}
