import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Trophy,
  Swords,
  Layers,
  Sparkles,
  Check,
  Calendar,
  AlertCircle,
  Play,
  RotateCcw,
  ArrowRight,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TOURNAMENT_PRESETS = [
  'Midwest Qualifier',
  'President\'s Day Classic',
  'State Championship',
  'Winter Power League',
  'High School Quad',
  'Club Dual Match',
  'Friendly Scrimmage'
];

const COURT_PRESETS = [
  'Court 1',
  'Court 2',
  'Court 3',
  'Court 4',
  'Court 5',
  'Court 6',
  'Court 7',
  'Court 8',
  'Center Court',
  'Main Gym',
  'Aux Gym'
];

const MATCH_STAGES = [
  'Pool Play - Match 1',
  'Pool Play - Match 2',
  'Pool Play - Match 3',
  'Pool Play - Match 4',
  'Cross-Pool Match',
  'Gold Bracket - Round of 16',
  'Gold Bracket - Quarterfinals',
  'Gold Bracket - Semifinals',
  'Gold Championship Final',
  'Silver Bracket - Semifinals',
  'Silver Championship',
  'Bronze Bracket',
  'Consolation Match',
  'Non-Conference Dual',
  'Conference Match',
  'Scrimmage'
];

const MATCH_FORMATS = [
  { id: 'Best of 3 (25, 25, 15)', label: 'Best of 3 Sets', desc: 'Sets 1-2 to 25 pts, Deciding Set 3 to 15 pts (Win by 2)' },
  { id: 'Best of 5 (25, 25, 25, 25, 15)', label: 'Best of 5 Sets', desc: 'Sets 1-4 to 25 pts, Deciding Set 5 to 15 pts (Win by 2)' },
  { id: '2 Sets to 25', label: '2 Sets Fixed (Pool Play)', desc: 'Play exactly 2 sets to 25 pts (No 3rd set)' },
  { id: '1 Set to 25', label: 'Single Set to 25', desc: 'Play 1 set to 25 points' },
  { id: '1 Set to 15', label: 'Single Tiebreaker Set to 15', desc: 'Play 1 deciding set to 15 points' }
];

export default function MatchSetupModal({
  isOpen,
  onClose,
  matchStats,
  onUpdateMatchDetails,
  onStartFreshMatch
}) {
  const [tournamentName, setTournamentName] = useState('');
  const [courtNumber, setCourtNumber] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [matchStage, setMatchStage] = useState('Pool Play - Match 1');
  const [matchFormat, setMatchFormat] = useState('Best of 3 (25, 25, 15)');
  const [targetPoints, setTargetPoints] = useState(25);
  const [showStartWarning, setShowStartWarning] = useState(false);

  useEffect(() => {
    if (isOpen && matchStats) {
      setTournamentName(matchStats.tournamentName || 'Midwest Qualifier 2026');
      setCourtNumber(matchStats.courtNumber || 'Court 1');
      setOpponentName(matchStats.opponentName || 'Opponent');
      setMatchStage(matchStats.matchStage || 'Pool Play - Match 1');
      setMatchFormat(matchStats.matchFormat || 'Best of 3 (25, 25, 15)');
      setTargetPoints(matchStats.targetPoints || 25);
      setShowStartWarning(false);
    }
  }, [isOpen, matchStats]);

  if (!isOpen) return null;

  const handleSaveDetailsOnly = () => {
    onUpdateMatchDetails({
      tournamentName: tournamentName.trim() || 'Tournament',
      courtNumber: courtNumber.trim() || 'Court 1',
      opponentName: opponentName.trim() || 'Opponent',
      matchStage,
      matchFormat,
      targetPoints: Number(targetPoints) || 25
    });
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.4 } });
    onClose();
  };

  const handleStartFreshMatchClick = () => {
    const hasActiveData = matchStats?.ourScore > 0 || matchStats?.opponentScore > 0 || (matchStats?.pointHistory && matchStats.pointHistory.length > 0) || (matchStats?.setHistory && matchStats.setHistory.length > 0);

    if (hasActiveData && !showStartWarning) {
      setShowStartWarning(true);
      return;
    }

    onStartFreshMatch({
      tournamentName: tournamentName.trim() || 'Tournament',
      courtNumber: courtNumber.trim() || 'Court 1',
      opponentName: opponentName.trim() || 'Opponent',
      matchStage,
      matchFormat,
      targetPoints: Number(targetPoints) || 25
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1150 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '95%',
          background: 'linear-gradient(145deg, #131b2e 0%, #0d1322 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.15)',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.15))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                color: '#fff'
              }}
            >
              <Trophy size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Tournament & Match Setup
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Align tournament location, court, match stage & format across all coaches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            maxHeight: '75vh',
            overflowY: 'auto'
          }}
        >
          {/* Tournament / Event Name */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#93c5fd', fontWeight: 700, fontSize: '0.85rem' }}>
              <Trophy size={15} />
              <span>Tournament / Event / League Name</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Midwest Qualifier, State Championship..."
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            />
            {/* Presets */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              {TOURNAMENT_PRESETS.slice(0, 4).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTournamentName(preset)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    background: tournamentName === preset ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: tournamentName === preset ? '#93c5fd' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Court / Venue Location */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#93c5fd', fontWeight: 700, fontSize: '0.85rem' }}>
              <MapPin size={15} />
              <span>Court Number / Venue Gym</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Court 4, Center Court, Main Gym..."
              value={courtNumber}
              onChange={(e) => setCourtNumber(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            />
            {/* Court Presets */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              {COURT_PRESETS.slice(0, 6).map((court) => (
                <button
                  key={court}
                  type="button"
                  onClick={() => setCourtNumber(court)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    background: courtNumber === court ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: courtNumber === court ? '#93c5fd' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {court}
                </button>
              ))}
            </div>
          </div>

          {/* Opponent & Match Stage Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {/* Opponent Name */}
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>
                <Swords size={15} />
                <span>Opponent Team Name</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Thunderbolts 16-1"
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                style={{ fontSize: '0.95rem' }}
              />
            </div>

            {/* Match Stage */}
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>
                <Calendar size={15} />
                <span>Match Stage</span>
              </label>
              <select
                className="form-control"
                value={matchStage}
                onChange={(e) => setMatchStage(e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                {MATCH_STAGES.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Match Format & Sets Rules */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontWeight: 700, fontSize: '0.85rem' }}>
              <Layers size={15} />
              <span>Match Format & Set Rules</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
              {MATCH_FORMATS.map((fmt) => (
                <div
                  key={fmt.id}
                  onClick={() => setMatchFormat(fmt.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: matchFormat === fmt.id ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.07)',
                    background: matchFormat === fmt.id ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: matchFormat === fmt.id ? '#f3e8ff' : '#cbd5e1' }}>
                      {fmt.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {fmt.desc}
                    </div>
                  </div>
                  {matchFormat === fmt.id && (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Check size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Warning Confirmation when starting fresh match */}
          {showStartWarning && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                padding: '0.9rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}
            >
              <AlertCircle size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fef3c7' }}>
                  Start New Tournament Match?
                </div>
                <div style={{ fontSize: '0.78rem', color: '#fde68a', marginTop: '0.2rem' }}>
                  Starting a new match will save the current match to history, reset scores to 0-0, reset set count to Set 1, and alert all connected co-coaches.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1.15rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.35)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={handleSaveDetailsOnly}
            title="Update Tournament & Opponent details without resetting the active set score"
            style={{ fontSize: '0.85rem' }}
          >
            <Check size={16} />
            <span>Update Details Only</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={handleStartFreshMatchClick}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderColor: '#10b981',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
              fontSize: '0.88rem',
              fontWeight: 800
            }}
            title="Save current game to history and start a fresh tournament match"
          >
            <Play size={16} fill="currentColor" />
            <span>{showStartWarning ? 'Confirm & Start Match 1' : 'Start New Match (Set 1)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
