import React, { useState } from 'react';
import {
  Trophy,
  RotateCcw,
  RefreshCw,
  Sliders,
  Sparkles,
  BarChart3,
  Check,
  AlertCircle,
  Plus
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
  lineup = {},
  roster = [],
  rotation = 1,
  phase = 'serve',
  onNavigateTab
}) {
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [scoringTeam, setScoringTeam] = useState('us'); // 'us' | 'opponent'

  const {
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    opponentName = 'Opponent',
    isTrackingEnabled = true,
    pointHistory = []
  } = matchStats || {};

  // Fast +1 US Action
  const handlePlusUs = () => {
    if (isTrackingEnabled) {
      setScoringTeam('us');
      setIsPointModalOpen(true);
    } else {
      // Instant increment without opening modal
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
      // Instant increment without opening modal
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

  return (
    <>
      <div className="scoreboard-ribbon">
        {/* Left: Set & Match Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div className="scoreboard-set-badge">
            SET {setNumber}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Sets:</span>
            <strong style={{ color: '#10b981' }}>{ourSetsWon}</strong>
            <span>-</span>
            <strong style={{ color: '#f87171' }}>{opponentSetsWon}</strong>
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
            <span className="scoreboard-team-label">{opponentName.slice(0, 4)}</span>
          </div>
        </div>

        {/* Right: Quick Controls (Undo, Reset, Stats View, Settings) */}
        <div className="scoreboard-action-group">
          {/* Undo Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onUndoLastPoint}
            disabled={pointHistory.length === 0}
            title={pointHistory.length > 0 ? 'Undo last rally point and restore rotation' : 'No points recorded yet'}
            style={{ fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} />
            <span>Undo</span>
          </button>

          {/* Quick Score Reset Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              if (ourScore === 0 && opponentScore === 0) return;
              if (window.confirm('Reset the current set score back to 0 - 0? (Point history will be preserved in summary).')) {
                onResetScore();
              }
            }}
            title="Reset current score back to 0 - 0"
            style={{ fontSize: '0.78rem' }}
          >
            <RefreshCw size={13} />
            <span>Reset (0-0)</span>
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
            title={isTrackingEnabled ? 'Detailed Error Logging is ON (Tap to use fast score-only mode)' : 'Error Logging is OFF (Fast 1-tap mode active)'}
          >
            <Sliders size={13} />
            <span>{isTrackingEnabled ? 'Error Tracking: ON' : 'Error Tracking: OFF'}</span>
          </button>

          {/* View Stats Tab Link */}
          {onNavigateTab && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('stats')}
              style={{ fontSize: '0.78rem', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
              title="Jump to Match Stats & Error Summary tab"
            >
              <BarChart3 size={13} />
              <span>Stats & PDF</span>
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
