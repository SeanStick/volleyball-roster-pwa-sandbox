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
  Edit3,
  Trophy,
  Sparkles,
  ChevronRight,
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
  onOpenTournamentDayHub,
  onSelectSetNumber,
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
    tournamentName = 'Tournament Day',
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    isTrackingEnabled = true,
    pointHistory = [],
    setHistory = []
  } = matchStats || {};

  // Check if match is concluded (e.g. best of 3: 2 sets won)
  const isMatchWon = ourSetsWon >= 2;
  const isMatchLost = opponentSetsWon >= 2;
  const isMatchComplete = isMatchWon || isMatchLost;

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
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.25 } });
    }
  };

  // Build list of sets to display (at least 1, 2, 3, or more if reached)
  const maxSet = Math.max(3, setNumber, setHistory.length);
  const setNumbersList = Array.from({ length: maxSet }, (_, i) => i + 1);

  return (
    <>
      {/* =========================================================================
          🏆 1. TOP TOURNAMENT & MATCH CAPSULE (1-Tap Day Hub & Quick Edit)
         ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '0.4rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          userSelect: 'none'
        }}
      >
        {/* Left: 1-Tap Tournament Day Hub Button */}
        <button
          type="button"
          onClick={onOpenTournamentDayHub}
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(30, 58, 138, 0.35))',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '999px',
            padding: '0.2rem 0.6rem',
            color: '#93c5fd',
            fontSize: '0.74rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title="Open Tournament Day Hub"
        >
          <Trophy size={13} color="#60a5fa" />
          <span>Day Hub</span>
        </button>

        {/* Center: Location & Opponent (Click to Quick Edit) */}
        <div
          onClick={onOpenMatchSetup}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            minWidth: 0,
            cursor: 'pointer',
            flex: 1,
            justifyContent: 'center'
          }}
          title="Tap to change Court, Match, or Opponent"
        >
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              padding: '0.12rem 0.4rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            {courtNumber}
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: '#60a5fa' }}>{matchStage}</span> vs <span style={{ color: '#fca5a5' }}>{opponentName || 'Opponent'}</span>
          </span>
          <Edit3 size={11} color="#94a3b8" style={{ flexShrink: 0 }} />
        </div>

        {/* Right: Sets Summary */}
        <div
          onClick={onOpenTournamentDayHub}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <span style={{ color: '#94a3b8' }}>Sets:</span>
          <span style={{ color: '#10b981' }}>{ourSetsWon}</span>
          <span style={{ color: '#94a3b8' }}>-</span>
          <span style={{ color: '#f87171' }}>{opponentSetsWon}</span>
        </div>
      </div>

      {/* =========================================================================
          🏐 2. INTERACTIVE SET STRIP (1-Tap Switch between Set 1, Set 2, Set 3)
         ========================================================================= */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.35rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.4rem',
          overflowX: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
          {setNumbersList.map((sNum) => {
            const isCurrent = setNumber === sNum;
            const pastSet = setHistory?.find(s => s.setNumber === sNum);

            return (
              <button
                key={sNum}
                type="button"
                onClick={() => onSelectSetNumber && onSelectSetNumber(sNum)}
                style={{
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  border: isCurrent ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isCurrent ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.35), rgba(30, 58, 138, 0.5))' : 'rgba(255, 255, 255, 0.03)',
                  color: isCurrent ? '#93c5fd' : '#94a3b8',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
                title={`Switch to Set ${sNum}`}
              >
                {isCurrent && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8' }} />}
                <span>Set {sNum}</span>
                {pastSet ? (
                  <span style={{ fontSize: '0.68rem', color: pastSet.ourScore > pastSet.opponentScore ? '#34d399' : '#f87171', fontWeight: 700 }}>
                    ({pastSet.ourScore}-{pastSet.opponentScore})
                  </span>
                ) : isCurrent ? (
                  <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700 }}>
                    ({ourScore}-{opponentScore})
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Quick Advance / Save Trigger on Set Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleFinishSetClick}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.35))',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              color: '#6ee7b7',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer'
            }}
            title={`Finish Set ${setNumber} & Advance to Set ${setNumber + 1}`}
          >
            <Check size={12} color="#34d399" />
            <span>Finish S{setNumber}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          🎉 3. MATCH WINNER / COMPLETE CELEBRATION BANNER (If 2 Sets Won)
         ========================================================================= */}
      {isMatchComplete && (
        <div
          style={{
            background: isMatchWon
              ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.35), rgba(5, 150, 105, 0.45))'
              : 'linear-gradient(90deg, rgba(239, 68, 68, 0.35), rgba(185, 28, 28, 0.45))',
            borderBottom: `1px solid ${isMatchWon ? '#10b981' : '#ef4444'}`,
            padding: '0.5rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.6rem',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sparkles size={16} color={isMatchWon ? '#fbbf24' : '#f87171'} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
              {isMatchWon ? `Match Won! (${ourSetsWon} - ${opponentSetsWon})` : `Match Ended (${ourSetsWon} - ${opponentSetsWon})`}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenTournamentDayHub}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              padding: '0.3rem 0.7rem',
              fontSize: '0.76rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span>Save & Prep Next Match</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* =========================================================================
          🔢 4. MAIN LIVE SCOREBOARD RIBBON
         ========================================================================= */}
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
