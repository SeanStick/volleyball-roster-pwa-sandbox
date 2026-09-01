import React, { useState } from 'react';
import {
  X,
  Trophy,
  Calendar,
  MapPin,
  Swords,
  Plus,
  CheckCircle,
  Play,
  RotateCcw,
  Archive,
  ArrowRight,
  Sparkles,
  Layers,
  Edit3,
  Trash2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const QUICK_COURTS = ['Ct 1', 'Ct 2', 'Ct 3', 'Ct 4', 'Ct 5', 'Ct 6', 'Ct 7', 'Ct 8', 'Main Gym'];

export default function TournamentDayHubModal({
  isOpen,
  onClose,
  matchStats,
  matchHistory = [],
  onUpdateMatchDetails,
  onStartFreshMatch,
  onStartNewSet,
  onArchiveMatch,
  onDeleteMatchHistory,
  onSelectSetNumber,
  onOpenShareModal,
  activeTeam
}) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tournamentName, setTournamentName] = useState(matchStats?.tournamentName || 'Tournament Day');
  const [court, setCourt] = useState(matchStats?.courtNumber || 'Court 1');
  const [opponent, setOpponent] = useState(matchStats?.opponentName || 'Opponent');
  const [matchStage, setMatchStage] = useState(matchStats?.matchStage || 'Match 1');

  // Next match quick state
  const [isCreatingNextMatch, setIsCreatingNextMatch] = useState(false);
  const [nextOpponent, setNextOpponent] = useState('');
  const [nextCourt, setNextCourt] = useState(matchStats?.courtNumber || 'Court 1');

  if (!isOpen) return null;

  const {
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    setHistory = []
  } = matchStats || {};

  // Calculate day stats
  const totalMatches = matchHistory.length + (ourScore > 0 || opponentScore > 0 || setHistory.length > 0 ? 1 : 0);
  const matchesWon = matchHistory.filter(m => m.result === 'WON' || m.ourSetsWon > m.opponentSetsWon).length;
  const matchesLost = matchHistory.filter(m => m.result === 'LOST' || m.opponentSetsWon > m.ourSetsWon).length;

  const handleSaveInfo = () => {
    onUpdateMatchDetails({
      tournamentName: tournamentName.trim() || 'Tournament Day',
      courtNumber: court.trim() || 'Court 1',
      opponentName: opponent.trim() || 'Opponent',
      matchStage: matchStage.trim() || 'Match 1'
    });
    setIsEditingInfo(false);
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.4 } });
  };

  const handleCreateNextMatchSubmit = () => {
    const nextMatchNumber = `Match ${matchHistory.length + 2}`;
    onStartFreshMatch({
      tournamentName: tournamentName.trim() || matchStats?.tournamentName || 'Tournament Day',
      courtNumber: nextCourt.trim() || 'Court 1',
      opponentName: nextOpponent.trim() || 'Next Opponent',
      matchStage: nextMatchNumber,
      setNumber: 1
    });
    setIsCreatingNextMatch(false);
    setNextOpponent('');
    confetti({ particleCount: 45, spread: 55, origin: { y: 0.3 } });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1250,
        padding: '0',
        alignItems: 'flex-end'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '88vh',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          borderBottom: 'none',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.15)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Pull Indicator Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 2px 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.25)' }} />
        </div>

        {/* Modal Header */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.15))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}
            >
              <Trophy size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Tournament Day Hub</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    background: 'rgba(16, 185, 129, 0.25)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {matchesWon}W - {matchesLost}L
                </span>
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
                {matchStats?.tournamentName || 'Tournament'} • {totalMatches} Matches Today
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          style={{
            padding: '1.1rem 1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* =========================================================================
              🔥 1. CURRENT ACTIVE MATCH CARD
             ========================================================================= */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '16px',
              padding: '1rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Active Match Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px'
                  }}
                >
                  LIVE NOW
                </span>
                <span style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 700 }}>
                  {matchStats?.matchStage || 'Match 1'}
                </span>
              </div>

              <button
                onClick={() => setIsEditingInfo(!isEditingInfo)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={13} />
                <span>{isEditingInfo ? 'Close Edit' : 'Edit Info'}</span>
              </button>
            </div>

            {/* Editing Form (Toggled) */}
            {isEditingInfo ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '0.75rem', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Tournament / Event</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Opponent Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={opponent}
                      onChange={(e) => setOpponent(e.target.value)}
                      style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Court / Gym</label>
                    <input
                      type="text"
                      className="form-control"
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                      style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveInfo}
                  style={{ alignSelf: 'flex-end', fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              /* Normal Match Display */
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>vs {matchStats?.opponentName || 'Opponent'}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>• {matchStats?.courtNumber || 'Court 1'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.35rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Match Sets: <strong style={{ color: '#10b981', fontSize: '1rem' }}>{ourSetsWon}</strong> - <strong style={{ color: '#f87171', fontSize: '1rem' }}>{opponentSetsWon}</strong>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>
                    Active: Set {setNumber} ({ourScore} - {opponentScore})
                  </div>
                </div>
              </div>
            )}

            {/* Set Pills Selector (1-Tap Switch) */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.35rem' }}>
                JUMP TO SET:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[1, 2, 3].map((sNum) => {
                  const pastSet = setHistory?.find(s => s.setNumber === sNum);
                  const isCurrent = setNumber === sNum;

                  return (
                    <button
                      key={sNum}
                      type="button"
                      onClick={() => {
                        if (onSelectSetNumber) onSelectSetNumber(sNum);
                        onClose();
                      }}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        border: isCurrent ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: isCurrent ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                        color: isCurrent ? '#93c5fd' : '#cbd5e1',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <span>Set {sNum}</span>
                      {pastSet ? (
                        <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>({pastSet.ourScore}-{pastSet.opponentScore})</span>
                      ) : isCurrent ? (
                        <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>({ourScore}-{opponentScore})</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Match Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  if (window.confirm(`Finish Set ${setNumber} (${ourScore} - ${opponentScore}) and advance to Set ${setNumber + 1}?`)) {
                    onStartNewSet();
                    onClose();
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                  color: '#a7f3d0',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '0.55rem'
                }}
              >
                <CheckCircle size={14} color="#34d399" />
                <span>Next Set (S{setNumber + 1})</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onArchiveMatch();
                  onClose();
                }}
                style={{
                  background: 'rgba(59, 130, 246, 0.18)',
                  borderColor: 'rgba(59, 130, 246, 0.45)',
                  color: '#bfdbfe',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '0.55rem'
                }}
              >
                <Archive size={14} color="#60a5fa" />
                <span>Save Match</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              🚀 2. "START NEXT TOURNAMENT MATCH" WIZARD (1-TAP)
             ========================================================================= */}
          {isCreatingNextMatch ? (
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(30, 58, 138, 0.35), rgba(15, 23, 42, 0.95))',
                border: '1.5px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#93c5fd' }}>
                  Set Up Match {matchHistory.length + 2}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingNextMatch(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700 }}>Next Opponent Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. West High, Club Elite 16-1..."
                  value={nextOpponent}
                  onChange={(e) => setNextOpponent(e.target.value)}
                  style={{ fontSize: '0.95rem' }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>Next Court #</label>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  {QUICK_COURTS.slice(0, 6).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNextCourt(c.startsWith('Ct') ? `Court ${c.replace('Ct ', '')}` : c)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        border: (nextCourt === c || nextCourt === `Court ${c.replace('Ct ', '')}`) ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: (nextCourt === c || nextCourt === `Court ${c.replace('Ct ', '')}`) ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                        color: (nextCourt === c || nextCourt === `Court ${c.replace('Ct ', '')}`) ? '#f3e8ff' : '#94a3b8',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreatingNextMatch(false)}
                  style={{ flex: 1, fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateNextMatchSubmit}
                  style={{
                    flex: 1.5,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderColor: '#10b981',
                    fontSize: '0.85rem',
                    fontWeight: 800
                  }}
                >
                  <Play size={14} fill="currentColor" />
                  <span>Start Match (Set 1)</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreatingNextMatch(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(30, 58, 138, 0.35))',
                border: '1.5px dashed rgba(59, 130, 246, 0.5)',
                borderRadius: '14px',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: '#93c5fd',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={18} />
              <span>Ready for Next Match? Start Match {matchHistory.length + 2}</span>
            </button>
          )}

          {/* =========================================================================
              📋 3. TODAY'S MATCH RESULTS & LOGS
             ========================================================================= */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
                Completed Matches ({matchHistory.length})
              </span>
              {activeTeam && onOpenShareModal && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenShareModal(activeTeam);
                    onClose();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-orange)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={12} />
                  <span>Share Day Hub</span>
                </button>
              )}
            </div>

            {matchHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                No completed matches saved yet today. When a match ends, tap <strong>"Save Match"</strong>.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {matchHistory.map((pastMatch) => {
                  const isWin = pastMatch.result === 'WON' || pastMatch.ourSetsWon > pastMatch.opponentSetsWon;

                  return (
                    <div
                      key={pastMatch.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.9rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isWin ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                        borderRadius: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            padding: '0.2rem 0.45rem',
                            borderRadius: '6px',
                            background: isWin ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                            color: isWin ? '#34d399' : '#f87171',
                            border: `1px solid ${isWin ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                          }}
                        >
                          {isWin ? 'WON' : 'LOST'} ({pastMatch.ourSetsWon || 0}-{pastMatch.opponentSetsWon || 0})
                        </span>

                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                            vs {pastMatch.opponentName || 'Opponent'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {pastMatch.matchStage || 'Match'} • {pastMatch.courtNumber || 'Court 1'} • {pastMatch.finalScore || 'Complete'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteMatchHistory && onDeleteMatchHistory(pastMatch.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          padding: '0.3rem',
                          cursor: 'pointer'
                        }}
                        title="Delete from today's history"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Close Footer */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700 }}
          >
            Done / Return to Court
          </button>
        </div>
      </div>
    </div>
  );
}
