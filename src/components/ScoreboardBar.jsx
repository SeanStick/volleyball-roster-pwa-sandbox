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
  Plus,
  Archive,
  Flag,
  MapPin,
  Swords,
  Layers,
  Settings,
  ArrowRight,
  Play
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
    tournamentName = 'Tournament',
    courtNumber = 'Court 1',
    opponentName = 'Opponent',
    matchStage = 'Pool Play - Match 1',
    matchFormat = 'Best of 3 (25, 25, 15)',
    targetPoints = 25,
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
    const confirmMsg = `Finish Set ${setNumber} (${ourScore} - ${opponentScore})?\n\nWinner: ${isOurLead ? 'Our Squad (US)' : opponentName || 'Opponent'}\n\nThis will record Set ${setNumber}, reset the score to 0 - 0, and advance to Set ${setNumber + 1}.`;
    if (window.confirm(confirmMsg)) {
      onStartNewSet();
    }
  };

  // Target points for current set (25 for sets 1-2, 15 for deciding 3rd/5th set)
  const currentSetTarget = (setNumber === 3 && matchFormat.includes('Best of 3')) || (setNumber === 5 && matchFormat.includes('Best of 5'))
    ? 15
    : (targetPoints || 25);

  return (
    <>
      {/* Tournament Location & Match Alignment Header Ribbon */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
          borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
          padding: '0.45rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.8rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Left: Tournament Name, Court #, Stage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Location Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#93c5fd',
              fontWeight: 700
            }}
          >
            <MapPin size={12} color="#60a5fa" />
            <span>{tournamentName}</span>
            <span style={{ opacity: 0.6 }}>•</span>
            <span style={{ color: '#fff' }}>{courtNumber}</span>
          </div>

          {/* Match Stage & Opponent Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#fca5a5',
              fontWeight: 700
            }}
          >
            <Swords size={12} color="#f87171" />
            <span>{matchStage}</span>
            <span style={{ opacity: 0.6 }}>vs</span>
            <span style={{ color: '#fff' }}>{opponentName}</span>
          </div>

          {/* Finished Sets Summary Badges */}
          {setHistory && setHistory.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {setHistory.map((s, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    background: s.winner === 'us' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    border: s.winner === 'us' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                    color: s.winner === 'us' ? '#6ee7b7' : '#fca5a5',
                    fontWeight: 700
                  }}
                  title={`Set ${s.setNumber || idx + 1}: ${s.ourScore} - ${s.opponentScore} (${s.winner === 'us' ? 'Won' : 'Lost'})`}
                >
                  S{s.setNumber || idx + 1}: {s.ourScore}-{s.opponentScore}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Match Format & Edit Tournament Settings Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            {matchFormat.split('(')[0]} • Target: <strong style={{ color: '#fbbf24' }}>{currentSetTarget} pts</strong>
          </span>

          {onOpenMatchSetup && (
            <button
              onClick={onOpenMatchSetup}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Edit tournament name, court #, opponent, or start a new tournament match"
            >
              <Settings size={12} />
              <span>Match Info</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Scoreboard Ribbon */}
      <div className="scoreboard-ribbon">
        {/* Left: Set & Match Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div className="scoreboard-set-badge">
            SET {setNumber}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Sets Won:</span>
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
            <span className="scoreboard-team-label">{opponentName.slice(0, 5)}</span>
          </div>
        </div>

        {/* Right: Quick Controls (Undo, Finish Set, Save Match, Stats View, Settings) */}
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
            <span>Finish Set {setNumber}</span>
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
              title="Save current match and score history to past tournament games archive"
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
              if (window.confirm('Reset current set score back to 0 - 0? (Point history will be preserved in summary).')) {
                onResetScore();
              }
            }}
            title="Reset current score back to 0 - 0"
            style={{ fontSize: '0.78rem' }}
          >
            <RefreshCw size={13} />
            <span>Reset</span>
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
            <span>{isTrackingEnabled ? 'Errors: ON' : 'Errors: OFF'}</span>
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
