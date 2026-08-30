import React, { useState } from 'react';
import {
  RotateCcw,
  RefreshCw,
  Sliders,
  BarChart3,
  Check,
  Plus,
  Archive,
  MapPin,
  Swords,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QuickPointModal from './QuickPointModal';

export default function ScoreboardBar({
  matchStats,
  setMatchStats,
  onRallyWonByUs,
  onRallyWonByOpponent,
  onUndoLastPoint,
  onResetScore,
  onStartNewSet,
  onArchiveMatch,
  onResetFullMatch,
  onOpenMatchSetup,
  lineup = {},
  roster = [],
  rotation = 1,
  phase = 'serve',
  onNavigateTab
}) {
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [scoringTeam, setScoringTeam] = useState('us'); // 'us' | 'opponent'

  const {
    courtNumber = 'Court 1',
    opponentName = 'Opponent',
    matchStage = 'Match 1',
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    isTrackingEnabled = true,
    pointHistory = [],
    setHistory = []
  } = matchStats || {};

  // Fast +1 US Action
  const handlePlusUs = () => {
    if (isTrackingEnabled) {
      setScoringTeam('us');
      setIsPointModalOpen(true);
    } else {
      onRallyWonByUs({
        pointWonBy: 'us',
        earnedType: 'quick_point',
        rotation,
        phase,
        setNumber
      });
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.2 } });
    }
  };

  // Fast +1 OPP Action
  const handlePlusOpponent = () => {
    if (isTrackingEnabled) {
      setScoringTeam('opponent');
      setIsPointModalOpen(true);
    } else {
      onRallyWonByOpponent({
        pointWonBy: 'opponent',
        errorTypeId: 'unspecified_error',
        rotation,
        phase,
        setNumber
      });
    }
  };

  // Toggle Detailed Stats Tracking
  const handleToggleTracking = () => {
    setMatchStats(prev => ({
      ...prev,
      isTrackingEnabled: !prev.isTrackingEnabled
    }));
  };

  const handlePointRecorded = (pointData) => {
    if (pointData.pointWonBy === 'us') {
      onRallyWonByUs(pointData);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
    } else {
      onRallyWonByOpponent(pointData);
    }
  };

  const handleFinishSetClick = () => {
    const isOurLead = ourScore > opponentScore;
    const confirmMsg = `Finish Set ${setNumber} (${ourScore} - ${opponentScore})?\n\nWinner: ${isOurLead ? 'US' : opponentName || 'Opponent'}\n\nAdvance to Set ${setNumber + 1} (0-0)?`;
    if (window.confirm(confirmMsg)) {
      onStartNewSet();
    }
  };

  return (
    <>
      {/* 📱 Super Simple Mobile Match & Set Bar (Tap anywhere to edit / clarify) */}
      <div
        onClick={onOpenMatchSetup}
        style={{
          background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '0.45rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        title="Tap to change Court, Match, Opponent, or Set"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', minWidth: 0 }}>
          {/* Location Chip */}
          <span
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <MapPin size={11} />
            {courtNumber}
          </span>

          {/* Match & Opponent */}
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: '#60a5fa' }}>{matchStage}</span> vs <span style={{ color: '#fca5a5' }}>{opponentName || 'Opponent'}</span>
          </span>

          {/* Set Badge */}
          <span
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#6ee7b7',
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}
          >
            Set {setNumber}
          </span>

          {/* Past Set Scores in Current Match */}
          {setHistory && setHistory.length > 0 && (
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              ({setHistory.map(s => `${s.ourScore}-${s.opponentScore}`).join(', ')})
            </span>
          )}
        </div>

        {/* Tap to Edit Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.72rem', flexShrink: 0 }}>
          <Edit3 size={12} />
          <span>Edit</span>
        </div>
      </div>

      {/* Main Scoreboard Ribbon */}
      <div className="scoreboard-ribbon">
        {/* Left: Set & Match Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="scoreboard-set-badge">
            SET {setNumber}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Sets:</span>
            <strong style={{ color: '#10b981', fontSize: '0.9rem' }}>{ourSetsWon}</strong>
            <span>-</span>
            <strong style={{ color: '#f87171', fontSize: '0.9rem' }}>{opponentSetsWon}</strong>
          </div>
        </div>

        {/* Center: Live Digits & Quick Add Buttons */}
        <div className="scoreboard-score-group">
          {/* US Score & +1 Button */}
          <div className="scoreboard-team-box">
            <span className="scoreboard-team-label">US</span>
            <div className="scoreboard-digit us">{ourScore}</div>
            <button
              className="btn-score-add us"
              onClick={handlePlusUs}
              title="Award point to Our Team (+1 Us)"
            >
              <Plus size={16} /> <span>US</span>
            </button>
          </div>

          <div className="scoreboard-vs-divider">:</div>

          {/* OPP Score & +1 Button */}
          <div className="scoreboard-team-box">
            <button
              className="btn-score-add opp"
              onClick={handlePlusOpponent}
              title="Award point to Opponent (+1 Opponent / Team Error)"
            >
              <Plus size={16} /> <span>OPP</span>
            </button>
            <div className="scoreboard-digit opp">{opponentScore}</div>
            <span className="scoreboard-team-label">{(opponentName || 'OPP').slice(0, 5)}</span>
          </div>
        </div>

        {/* Right: Quick Controls */}
        <div className="scoreboard-action-group">
          {/* Undo Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onUndoLastPoint}
            disabled={pointHistory.length === 0}
            title={pointHistory.length > 0 ? 'Undo last rally point' : 'No points recorded yet'}
            style={{ fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} />
            <span>Undo</span>
          </button>

          {/* Finish Set Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleFinishSetClick}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
              borderColor: 'rgba(16, 185, 129, 0.5)',
              color: '#a7f3d0',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
            title={`Finish Set ${setNumber} (${ourScore}-${opponentScore}) and advance to Set ${setNumber + 1}`}
          >
            <Check size={13} color="#34d399" />
            <span>Next Set</span>
          </button>

          {/* Save Match Button */}
          {onArchiveMatch && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onArchiveMatch()}
              style={{
                background: 'rgba(59, 130, 246, 0.18)',
                borderColor: 'rgba(59, 130, 246, 0.45)',
                color: '#bfdbfe',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
              title="Save current match to history"
            >
              <Archive size={13} color="#60a5fa" />
              <span>Save Match</span>
            </button>
          )}

          {/* Quick Score Reset Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              if (ourScore === 0 && opponentScore === 0) return;
              if (window.confirm('Reset current set score back to 0 - 0?')) {
                onResetScore();
              }
            }}
            title="Reset current score back to 0 - 0"
            style={{ fontSize: '0.78rem' }}
          >
            <RefreshCw size={13} />
            <span>0-0</span>
          </button>

          {/* Stats Mode Toggle (ON / OFF) */}
          <button
            className={`btn btn-sm ${isTrackingEnabled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleToggleTracking}
            style={isTrackingEnabled ? {
              background: 'rgba(59, 130, 246, 0.2)',
              borderColor: '#3b82f6',
              color: '#93c5fd',
              fontSize: '0.76rem'
            } : { fontSize: '0.76rem', color: 'var(--text-muted)' }}
            title={isTrackingEnabled ? 'Error logging is ON' : 'Fast 1-tap score only'}
          >
            <Sliders size={13} />
            <span>{isTrackingEnabled ? 'Errors: ON' : 'Errors: OFF'}</span>
          </button>

          {/* View Stats Tab Link */}
          {onNavigateTab && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('stats')}
              style={{ fontSize: '0.78rem', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
              title="Jump to Match Stats"
            >
              <BarChart3 size={13} />
              <span>Stats</span>
            </button>
          )}
        </div>
      </div>

      {/* Lightning Point & Error Logging Modal */}
      <QuickPointModal
        isOpen={isPointModalOpen}
        onClose={() => setIsPointModalOpen(false)}
        scoringTeam={scoringTeam}
        onConfirmPoint={handlePointRecorded}
        lineup={lineup}
        roster={roster}
        rotation={rotation}
        phase={phase}
        currentScore={matchStats}
      />
    </>
  );
}
