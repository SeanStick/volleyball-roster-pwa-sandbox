import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Swords,
  Layers,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

const QUICK_COURTS = ['Ct 1', 'Ct 2', 'Ct 3', 'Ct 4', 'Ct 5', 'Ct 6', 'Ct 7', 'Ct 8', 'Main Gym'];
const QUICK_MATCHES = ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Bracket', 'Finals'];

export default function MatchSetupModal({
  isOpen,
  onClose,
  matchStats,
  maxSubs = 12,
  onUpdateMatchDetails,
  onStartFreshMatch
}) {
  const [court, setCourt] = useState('Court 1');
  const [matchNumber, setMatchNumber] = useState('Match 1');
  const [opponent, setOpponent] = useState('');
  const [matchFormat, setMatchFormat] = useState('Best of 3 (21, 21, 15)');
  const [subs, setSubs] = useState(12);
  const [activeSet, setActiveSet] = useState(1);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [autoSaveMsg, setAutoSaveMsg] = useState('');

  useEffect(() => {
    if (isOpen && matchStats) {
      setCourt(matchStats.courtNumber || 'Court 1');
      setMatchNumber(matchStats.matchStage || 'Match 1');
      setOpponent(matchStats.opponentName === 'Opponent' ? '' : (matchStats.opponentName || ''));
      setMatchFormat(matchStats.matchFormat || 'Best of 3 (21, 21, 15)');
      setSubs(matchStats.maxSubs !== undefined ? matchStats.maxSubs : (maxSubs || 12));
      setActiveSet(matchStats.setNumber || 1);
      setShowResetConfirm(false);
      setAutoSaveMsg('');
    }
  }, [isOpen, matchStats, maxSubs]);

  if (!isOpen) return null;

  const triggerAutoSaveFeedback = (msg) => {
    setAutoSaveMsg(msg);
    setTimeout(() => {
      setAutoSaveMsg((prev) => (prev === msg ? '' : prev));
    }, 2800);
  };

  const handleFormatChange = (newFormat) => {
    setMatchFormat(newFormat);
    const targetPoints = newFormat.includes('21') ? 21 : 25;
    if (onUpdateMatchDetails) {
      onUpdateMatchDetails({
        matchFormat: newFormat,
        targetPoints: targetPoints
      });
    }
    triggerAutoSaveFeedback('Format updated & set as default for all games ✓');
  };

  const handleSubsChange = (newSubs) => {
    const parsedSubs = Number(newSubs);
    setSubs(parsedSubs);
    if (onUpdateMatchDetails) {
      onUpdateMatchDetails({
        maxSubs: parsedSubs
      });
    }
    triggerAutoSaveFeedback('Sub limit updated & set as default for all games ✓');
  };

  const handleSave = () => {
    const targetPoints = matchFormat.includes('21') ? 21 : 25;
    onUpdateMatchDetails({
      courtNumber: court.trim() || 'Court 1',
      matchStage: matchNumber.trim() || 'Match 1',
      opponentName: opponent.trim() || 'Opponent',
      matchFormat: matchFormat,
      targetPoints: targetPoints,
      maxSubs: Number(subs) || 12,
      setNumber: Number(activeSet) || 1
    });
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.5 } });
    onClose();
  };

  const handleNewMatch = () => {
    if (!showResetConfirm && (matchStats?.ourScore > 0 || matchStats?.opponentScore > 0 || (matchStats?.setHistory && matchStats.setHistory.length > 0))) {
      setShowResetConfirm(true);
      return;
    }

    const targetPoints = matchFormat.includes('21') ? 21 : 25;
    onStartFreshMatch({
      courtNumber: court.trim() || 'Court 1',
      matchStage: matchNumber.trim() || 'Match 1',
      opponentName: opponent.trim() || 'Opponent',
      matchFormat: matchFormat,
      targetPoints: targetPoints,
      maxSubs: Number(subs) || 12,
      setNumber: 1
    });
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.4 } });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1200,
        padding: '12px',
        alignItems: 'flex-start',
        paddingTop: 'max(env(safe-area-inset-top, 20px), 25px)'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#0f172a',
          borderRadius: '18px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.15rem',
            background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.5), rgba(15, 23, 42, 0.9))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🏐</span>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Match & Set Info
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
                Quick mobile setup — syncs with all coaches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
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

        {/* Form Body */}
        <div
          style={{
            padding: '1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* 1. Opponent Team */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#f87171', marginBottom: '0.35rem' }}>
              Opponent Team Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Thunderbolts, West High..."
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              style={{ fontSize: '1rem', padding: '0.65rem 0.85rem' }}
              autoFocus
            />
          </div>

          {/* 2. Current Set Selector (1-tap Big Buttons) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '0.35rem' }}>
              Current Set Playing
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
              {[1, 2, 3, 4, 5].map((sNum) => (
                <button
                  key={sNum}
                  type="button"
                  onClick={() => setActiveSet(sNum)}
                  style={{
                    padding: '0.6rem 0',
                    borderRadius: '10px',
                    border: activeSet === sNum ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: activeSet === sNum ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    color: activeSet === sNum ? '#6ee7b7' : '#cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Set {sNum}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Match / Stage Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.35rem' }}>
              Match # / Stage
            </label>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {QUICK_MATCHES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMatchNumber(m)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    border: matchNumber === m ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: matchNumber === m ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                    color: matchNumber === m ? '#93c5fd' : '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Court / Gym Location */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.35rem' }}>
              Court Location
            </label>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              {QUICK_COURTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCourt(c.startsWith('Ct') ? `Court ${c.replace('Ct ', '')}` : c)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    border: (court === c || court === `Court ${c.replace('Ct ', '')}`) ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: (court === c || court === `Court ${c.replace('Ct ', '')}`) ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                    color: (court === c || court === `Court ${c.replace('Ct ', '')}`) ? '#f3e8ff' : '#94a3b8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Or type court name (e.g. Aux Gym Court B)..."
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* 5. Match Format & Sub Limit (Auto-saves as default) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.35rem' }}>
                <span>Match Format</span>
              </label>
              <select
                className="form-control"
                value={matchFormat}
                onChange={(e) => handleFormatChange(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '0.55rem 0.65rem' }}
              >
                <option value="Best of 3 (21, 21, 15)">Best of 3 (21, 21, 15)</option>
                <option value="Best of 3 (25, 25, 15)">Best of 3 (25, 25, 15)</option>
                <option value="Best of 5 (25, 25, 25, 25, 15)">Best of 5 (25, 25, 25, 25, 15)</option>
                <option value="2 Sets (21, 21 - Pool Play)">2 Sets (21, 21 - Pool Play)</option>
                <option value="2 Sets (25, 25 - Pool Play)">2 Sets (25, 25 - Pool Play)</option>
                <option value="1 Set Game (to 21)">1 Set Game (to 21)</option>
                <option value="1 Set Game (to 25)">1 Set Game (to 25)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.35rem' }}>
                <span>Max Subs / Set</span>
              </label>
              <select
                className="form-control"
                value={subs}
                onChange={(e) => handleSubsChange(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '0.55rem 0.65rem' }}
              >
                <option value={12}>12 Subs (Standard)</option>
                <option value={15}>15 Subs</option>
                <option value={18}>18 Subs (NCAA)</option>
                <option value={999}>Unlimited Subs</option>
              </select>
            </div>
          </div>

          {/* Auto-save & default feedback badge */}
          {autoSaveMsg ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.76rem',
                color: '#6ee7b7',
                fontWeight: 700,
                animation: 'fadeIn 0.2s ease-in-out'
              }}
            >
              <span>⚡</span>
              <span>{autoSaveMsg}</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '-0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>⚡ Changes to format & subs auto-save and apply as default for all games</span>
            </div>
          )}

          {/* Warning when tapping New Match */}
          {showResetConfirm && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '10px',
                padding: '0.75rem',
                fontSize: '0.8rem',
                color: '#fef3c7'
              }}
            >
              <strong>Start New Match?</strong> Current match will be saved to history and score reset to 0-0 (Set 1).
            </div>
          )}
        </div>

        {/* Mobile Action Buttons */}
        <div
          style={{
            padding: '1rem 1.15rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '0.65rem'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleNewMatch}
            style={{
              flex: '1',
              padding: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: showResetConfirm ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: showResetConfirm ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
              color: showResetConfirm ? '#fbbf24' : '#cbd5e1'
            }}
          >
            {showResetConfirm ? 'Confirm New Match' : 'New Match (0-0)'}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            style={{
              flex: '1.4',
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderColor: '#10b981',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Check size={16} />
            <span>Save & Sync</span>
          </button>
        </div>
      </div>
    </div>
  );
}
