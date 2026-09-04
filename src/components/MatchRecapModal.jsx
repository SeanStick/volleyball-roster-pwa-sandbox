import React, { useState } from 'react';
import {
  X,
  Trophy,
  Archive,
  Share2,
  FileText,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  MapPin,
  Swords,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MatchRecapModal({
  isOpen,
  onClose,
  matchStats,
  roster = [],
  onConfirmArchive,
  onOpenPdfExport,
  onStartNextMatchFromQueue,
  nextScheduledMatch = null
}) {
  const [opponentName, setOpponentName] = useState(matchStats?.opponentName || 'Opponent');
  const [tournamentName, setTournamentName] = useState(matchStats?.tournamentName || 'Tournament Day');
  const [courtNumber, setCourtNumber] = useState(matchStats?.courtNumber || 'Court 1');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [hasArchived, setHasArchived] = useState(false);

  if (!isOpen) return null;

  const {
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    setHistory = [],
    pointHistory = []
  } = matchStats || {};

  // Build complete set list
  const allSets = [...(setHistory || [])];
  if (allSets.length === 0 || allSets[allSets.length - 1].setNumber !== setNumber) {
    if (ourScore > 0 || opponentScore > 0) {
      allSets.push({
        setNumber,
        ourScore,
        opponentScore,
        winner: ourScore > opponentScore ? 'us' : 'opponent'
      });
    }
  }

  const computedSetsWon = allSets.filter(s => (s.ourScore || 0) > (s.opponentScore || 0)).length;
  const computedOppSetsWon = allSets.filter(s => (s.opponentScore || 0) > (s.ourScore || 0)).length;
  const isMatchWon = computedSetsWon > computedOppSetsWon || (computedSetsWon === computedOppSetsWon && ourScore >= opponentScore);

  // Compute Stat Leaders from pointHistory
  const computeStatLeaders = () => {
    const aceCounts = {};
    const killCounts = {};

    (pointHistory || []).forEach(pt => {
      if (pt.earnedType === 'ace' && pt.earnedPlayerId) {
        aceCounts[pt.earnedPlayerId] = (aceCounts[pt.earnedPlayerId] || 0) + 1;
      }
      if (pt.earnedType === 'kill' && pt.earnedPlayerId) {
        killCounts[pt.earnedPlayerId] = (killCounts[pt.earnedPlayerId] || 0) + 1;
      }
    });

    const getTopPlayer = (countsObj) => {
      const entries = Object.entries(countsObj);
      if (entries.length === 0) return null;
      entries.sort((a, b) => b[1] - a[1]);
      const player = roster.find(p => p.id === entries[0][0]);
      return {
        name: player ? `#${player.number} ${player.name}` : 'Team Player',
        count: entries[0][1]
      };
    };

    return {
      aceLeader: getTopPlayer(aceCounts),
      killLeader: getTopPlayer(killCounts),
      totalAces: Object.values(aceCounts).reduce((a, b) => a + b, 0),
      totalKills: Object.values(killCounts).reduce((a, b) => a + b, 0)
    };
  };

  const statLeaders = computeStatLeaders();

  const handleArchive = () => {
    const archived = onConfirmArchive({
      opponentName: opponentName.trim() || 'Opponent',
      tournamentName: tournamentName.trim() || 'Tournament',
      courtNumber: courtNumber.trim() || 'Court 1'
    });
    if (archived) {
      setHasArchived(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.3 } });
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1450,
        padding: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 10, 20, 0.88)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '94dvh',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: isMatchWon ? '1.5px solid rgba(16, 185, 129, 0.5)' : '1.5px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isMatchWon
            ? '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(16, 185, 129, 0.25)'
            : '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(239, 68, 68, 0.2)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            padding: '1.15rem 1.25rem',
            background: isMatchWon
              ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.35), rgba(30, 58, 138, 0.45))'
              : 'linear-gradient(90deg, rgba(239, 68, 68, 0.3), rgba(30, 58, 138, 0.45))',
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
                borderRadius: '14px',
                background: isMatchWon
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              <Trophy size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 950, color: '#ffffff' }}>
                {isMatchWon ? '🏆 MATCH VICTORY!' : '🏐 MATCH FINAL'}
              </div>
              <div style={{ fontSize: '0.78rem', color: isMatchWon ? '#6ee7b7' : '#fcd34d', fontWeight: 700 }}>
                {tournamentName} • {courtNumber}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '999px',
              padding: '0.45rem',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.15rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Main Box Score Summary */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '1.1rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 900 }}>OUR SQUAD</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#ffffff', lineHeight: 1 }}>
                  {computedSetsWon}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>Sets Won</div>
              </div>

              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#475569' }}>VS</div>

              <div>
                <div style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 900, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {opponentName}
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#ffffff', lineHeight: 1 }}>
                  {computedOppSetsWon}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>Sets Won</div>
              </div>
            </div>

            {/* Set by Set breakdown pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {allSets.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '10px',
                    background: (s.ourScore || 0) > (s.opponentScore || 0)
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                    border: (s.ourScore || 0) > (s.opponentScore || 0)
                      ? '1px solid rgba(16, 185, 129, 0.4)'
                      : '1px solid rgba(239, 68, 68, 0.4)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: '#ffffff'
                  }}
                >
                  Set {s.setNumber}: {s.ourScore} - {s.opponentScore}
                </div>
              ))}
            </div>
          </div>

          {/* Stat Leaders & Team Highlights */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '0.9rem 1rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <Flame size={15} />
              <span>Match Highlights</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Total Service Aces</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>{statLeaders.totalAces}</div>
                {statLeaders.aceLeader && (
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Top: {statLeaders.aceLeader.name} ({statLeaders.aceLeader.count})</div>
                )}
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Total Attack Kills</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#3b82f6' }}>{statLeaders.totalKills}</div>
                {statLeaders.killLeader && (
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Top: {statLeaders.killLeader.name} ({statLeaders.killLeader.count})</div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Opponent Details Toggle */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '14px',
              padding: '0.75rem 0.9rem'
            }}
          >
            <div
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>
                {isEditingInfo ? 'Hide Details Form' : '✏️ Edit Opponent or Tournament Label before Archiving'}
              </span>
              <Edit3 size={14} color="#94a3b8" />
            </div>

            {isEditingInfo && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Opponent Name</label>
                  <input
                    type="text"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.75rem',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Tournament</label>
                    <input
                      type="text"
                      value={tournamentName}
                      onChange={(e) => setTournamentName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        color: '#ffffff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Court</label>
                    <input
                      type="text"
                      value={courtNumber}
                      onChange={(e) => setCourtNumber(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        color: '#ffffff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* On Deck Match Prompt (If Next Match Exists) */}
          {nextScheduledMatch && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(30, 58, 138, 0.35))',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '16px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 800, textTransform: 'uppercase' }}>
                  Next On Deck
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff' }}>
                  {nextScheduledMatch.matchStage} vs {nextScheduledMatch.opponentName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {nextScheduledMatch.courtNumber} • {nextScheduledMatch.time || 'Next Up'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!hasArchived) handleArchive();
                  onStartNextMatchFromQueue(nextScheduledMatch);
                  onClose();
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.55rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                }}
              >
                <span>Start Match</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '0.9rem 1.25rem',
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.65rem',
            flexWrap: 'wrap'
          }}
        >
          {onOpenPdfExport && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPdfExport();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.65rem 0.9rem',
                color: '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <FileText size={15} />
              <span>PDF Scoresheet</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              handleArchive();
              onClose();
            }}
            disabled={hasArchived}
            style={{
              flex: 1,
              background: hasArchived
                ? 'rgba(16, 185, 129, 0.3)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: hasArchived ? '1px solid #10b981' : 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: hasArchived ? 'default' : 'pointer',
              boxShadow: hasArchived ? 'none' : '0 4px 18px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Archive size={17} />
            <span>{hasArchived ? 'Archived to Day History ✓' : 'Save to Day Archive'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
