import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  MapPin,
  Swords,
  Layers,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  Shield,
  Volleyball,
  ChevronRight,
  Zap,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FRONT_ROW_ZONES, BACK_ROW_ZONES, ZONE_LABELS } from '../services/volleyballRules';

const QUICK_COURTS = ['Ct 1', 'Ct 2', 'Ct 3', 'Ct 4', 'Ct 5', 'Ct 6', 'Ct 7', 'Ct 8', 'Main Gym'];
const QUICK_MATCHES = ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Pool Play', 'Playoffs', 'Bracket', 'Finals'];
const MATCH_FORMATS = [
  { id: 'best_of_3', label: 'Best of 3 (25, 25, 15)', targetPoints: 25, deciderPoints: 15 },
  { id: 'best_of_5', label: 'Best of 5 (25, 25, 25, 25, 15)', targetPoints: 25, deciderPoints: 15 },
  { id: 'one_set', label: '1 Set Game (to 25)', targetPoints: 25, deciderPoints: 25 }
];
const SUB_LIMITS = [
  { value: 12, label: '12 Subs (USAV / NFHS Default)' },
  { value: 15, label: '15 Subs' },
  { value: 18, label: '18 Subs (NCAA Standard)' },
  { value: 999, label: 'Unlimited Subs' }
];

export default function MatchWizardModal({
  isOpen,
  onClose,
  matchStats,
  matchHistory = [],
  roster = [],
  currentLineup = {},
  teamSettings = {},
  onStartFreshMatch
}) {
  const [step, setStep] = useState(1); // 1: Info, 2: Lineup, 3: Toss & Serve

  // Step 1: Match & Rules State
  const [tournamentName, setTournamentName] = useState('Tournament');
  const [court, setCourt] = useState('Court 1');
  const [opponent, setOpponent] = useState('');
  const [matchStage, setMatchStage] = useState('Match 1');
  const [matchFormat, setMatchFormat] = useState('best_of_3');
  const [maxSubs, setMaxSubs] = useState(12);

  // Step 2: Lineup State
  const [wizardLineup, setWizardLineup] = useState({
    pos1: null,
    pos2: null,
    pos3: null,
    pos4: null,
    pos5: null,
    pos6: null
  });
  const [selectedLiberoId, setSelectedLiberoId] = useState(null);
  const [activeZoneToPick, setActiveZoneToPick] = useState(null); // 'pos1'..'pos6' or 'libero'

  // Step 3: Coin Toss & Serve State
  const [servingFirst, setServingFirst] = useState(true); // true = We Serve, false = We Receive
  const [startingRotation, setStartingRotation] = useState(1);

  // Helper to intelligently compute textbook 6-2 starters from roster
  const compute62Starters = (rosterPool) => {
    if (!Array.isArray(rosterPool) || rosterPool.length === 0) {
      return { pos1: null, pos2: null, pos3: null, pos4: null, pos5: null, pos6: null };
    }
    const setters = rosterPool.filter(p => p.position === 'Setter');
    const outsides = rosterPool.filter(p => p.position === 'Outside Hitter');
    const middles = rosterPool.filter(p => p.position === 'Middle Blocker');
    const opposites = rosterPool.filter(p => p.position === 'Opposite Hitter' || p.position === 'Right Side');
    const nonLiberos = rosterPool.filter(p => p.position !== 'Libero' && !p.isLibero);

    // 6-2 Rotational Opposites:
    // Zone 1 (RB) = Setter 1  <--> Zone 4 (LF) = Setter 2 (or Opposite 1)
    // Zone 2 (RF) = Outside 1 <--> Zone 5 (LB) = Outside 2
    // Zone 3 (MF) = Middle 1  <--> Zone 6 (MB) = Middle 2
    const pos1 = setters[0]?.id || nonLiberos[0]?.id || null;
    const pos2 = outsides[0]?.id || nonLiberos[1]?.id || null;
    const pos3 = middles[0]?.id || nonLiberos[2]?.id || null;
    const pos4 = setters[1]?.id || opposites[0]?.id || nonLiberos[3]?.id || null;
    const pos5 = outsides[1]?.id || nonLiberos[4]?.id || null;
    const pos6 = middles[1]?.id || nonLiberos[5]?.id || null;

    return { pos1, pos2, pos3, pos4, pos5, pos6 };
  };

  // Helper to compute saved starters from roster
  const computeSavedStarters = (rosterPool) => {
    if (!Array.isArray(rosterPool) || rosterPool.length === 0) {
      return { pos1: null, pos2: null, pos3: null, pos4: null, pos5: null, pos6: null };
    }
    const starters = rosterPool.filter(p => p.isStarter);
    if (starters.length >= 6) {
      return {
        pos1: starters[0]?.id || null,
        pos2: starters[1]?.id || null,
        pos3: starters[2]?.id || null,
        pos4: starters[3]?.id || null,
        pos5: starters[4]?.id || null,
        pos6: starters[5]?.id || null
      };
    }
    return compute62Starters(rosterPool);
  };

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTournamentName(matchStats?.tournamentName || 'Tournament Day');
      setCourt(matchStats?.courtNumber || 'Court 1');
      setOpponent('');
      setMatchStage(matchStats?.matchStage ? `Match ${Number(matchStats.matchStage.replace(/\D/g, '') || 1) + 1}` : 'Match 1');
      setMatchFormat('best_of_3');
      setMaxSubs(matchStats?.maxSubs || 12);
      setServingFirst(true);
      setStartingRotation(1);
      setActiveZoneToPick(null);

      // Lineup init
      const defaultL = currentLineup && Object.values(currentLineup).filter(Boolean).length === 6
        ? currentLineup
        : compute62Starters(roster);
      setWizardLineup(defaultL);

      const teamLib = roster.find(p => p.position === 'Libero' || p.isLibero);
      setSelectedLiberoId(teamLib ? teamLib.id : null);
    }
  }, [isOpen, matchStats, roster]);

  if (!isOpen) return null;

  // Validation logic
  const assignedPlayerIds = Object.values(wizardLineup).filter(Boolean);
  const uniqueAssignedCount = new Set(assignedPlayerIds).size;
  const isLineupFull = assignedPlayerIds.length === 6 && uniqueAssignedCount === 6;

  const emptyZones = ['pos4', 'pos3', 'pos2', 'pos5', 'pos6', 'pos1'].filter(zk => !wizardLineup[zk]);
  const hasDuplicate = uniqueAssignedCount < assignedPlayerIds.length;

  const getPlayer = (id) => roster.find(p => p.id === id);

  const handlePickPlayerForZone = (playerId) => {
    if (!activeZoneToPick) return;

    if (activeZoneToPick === 'libero') {
      setSelectedLiberoId(playerId === 'none' ? null : playerId);
      setActiveZoneToPick(null);
      return;
    }

    if (playerId === 'none') {
      setWizardLineup(prev => ({ ...prev, [activeZoneToPick]: null }));
    } else {
      // If player is already in another zone, swap them cleanly!
      const existingZone = Object.keys(wizardLineup).find(k => wizardLineup[k] === playerId);
      if (existingZone && existingZone !== activeZoneToPick) {
        setWizardLineup(prev => ({
          ...prev,
          [existingZone]: prev[activeZoneToPick] || null,
          [activeZoneToPick]: playerId
        }));
      } else {
        setWizardLineup(prev => ({
          ...prev,
          [activeZoneToPick]: playerId
        }));
      }
    }
    setActiveZoneToPick(null);
  };

  const handleLaunchMatch = () => {
    const chosenFormat = MATCH_FORMATS.find(f => f.id === matchFormat) || MATCH_FORMATS[0];

    onStartFreshMatch({
      tournamentName: tournamentName.trim() || 'Tournament Day',
      courtNumber: court.trim() || 'Court 1',
      opponentName: opponent.trim() || 'Opponent',
      matchStage: matchStage.trim() || 'Match 1',
      matchFormat: chosenFormat.label,
      targetPoints: chosenFormat.targetPoints,
      maxSubs: Number(maxSubs) || 12,
      lineup: wizardLineup,
      liberoId: selectedLiberoId,
      phase: servingFirst ? 'serve' : 'receive',
      rotation: startingRotation,
      ourTimeoutsRemaining: 2,
      opponentTimeoutsRemaining: 2
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.35 } });
    onClose();
  };

  // Recent opponent suggestions from match history
  const recentOpponents = Array.from(
    new Set(
      (matchHistory || [])
        .map(m => m.opponentName)
        .filter(name => name && name !== 'Opponent' && name !== 'Next Opponent')
    )
  ).slice(0, 4);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1400,
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
          border: '1.5px solid rgba(16, 185, 129, 0.45)',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(16, 185, 129, 0.2)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* =========================================================================
            WIZARD TOP HEADER
           ========================================================================= */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.25), rgba(30, 58, 138, 0.4))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Volleyball size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                Start Game Wizard
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#a7f3d0', margin: 0, fontWeight: 700 }}>
                Step {step} of 3: {step === 1 ? 'Match & Rules' : step === 2 ? 'Starting 6 Lineup' : 'Coin Toss & Serve'}
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
            <X size={16} />
          </button>
        </div>

        {/* Step Progress Chips */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '0.35rem 0.75rem',
            gap: '0.35rem',
            flexShrink: 0
          }}
        >
          {[
            { num: 1, label: '1. Match Info' },
            { num: 2, label: '2. Starting 6' },
            { num: 3, label: '3. First Serve' }
          ].map((s) => {
            const isCur = step === s.num;
            const isDone = step > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num === 1 || isDone) setStep(s.num);
                  else if (s.num === 2) setStep(2);
                }}
                style={{
                  flex: 1,
                  padding: '0.3rem 0.2rem',
                  borderRadius: '8px',
                  border: isCur ? '1.5px solid #10b981' : isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                  background: isCur ? 'rgba(16, 185, 129, 0.25)' : isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  color: isCur ? '#a7f3d0' : isDone ? '#34d399' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                {isDone ? <Check size={11} /> : null}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            SCROLLABLE BODY
           ========================================================================= */}
        <div
          style={{
            padding: '1rem 1.15rem',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* -------------------------------------------------------------
              STEP 1: MATCH & RULES SETUP
             ------------------------------------------------------------- */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Opponent Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 900, color: '#f87171', marginBottom: '0.35rem' }}>
                  Opponent Team Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Skyline 16-Black, West High, Thunderbolts..."
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  style={{ fontSize: '1rem', padding: '0.65rem 0.85rem', fontWeight: 700 }}
                  autoFocus
                />

                {/* Suggestions from Match History */}
                {recentOpponents.length > 0 && !opponent && (
                  <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Recent:</span>
                    {recentOpponents.map(opp => (
                      <button
                        key={opp}
                        type="button"
                        onClick={() => setOpponent(opp)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#fca5a5',
                          borderRadius: '6px',
                          padding: '0.15rem 0.45rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {opp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tournament & Court */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.3rem' }}>
                    Tournament / Event
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#93c5fd', marginBottom: '0.3rem' }}>
                    Court / Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Quick Court Chips */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, marginBottom: '0.25rem' }}>
                  1-Tap Court Pick:
                </label>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {QUICK_COURTS.map(c => {
                    const isSel = court === c || court === `Court ${c.replace('Ct ', '')}`;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCourt(c.startsWith('Ct') ? `Court ${c.replace('Ct ', '')}` : c)}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: isSel ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                          background: isSel ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                          color: isSel ? '#93c5fd' : '#94a3b8',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Match Stage Chips */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Match Stage:
                </label>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {QUICK_MATCHES.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMatchStage(m)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        border: matchStage === m ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: matchStage === m ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                        color: matchStage === m ? '#6ee7b7' : '#94a3b8',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format & Sub Limit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.3rem' }}>
                    Match Format
                  </label>
                  <select
                    className="form-control"
                    value={matchFormat}
                    onChange={(e) => setMatchFormat(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    {MATCH_FORMATS.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.3rem' }}>
                    Subs Per Set
                  </label>
                  <select
                    className="form-control"
                    value={maxSubs}
                    onChange={(e) => setMaxSubs(Number(e.target.value))}
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    {SUB_LIMITS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              STEP 2: STARTING 6 LINEUP & LIBERO BUILDER
             ------------------------------------------------------------- */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Top Lineup 1-Tap Presets */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const l62 = compute62Starters(roster);
                    setWizardLineup(l62);
                    const teamLib = roster.find(p => p.position === 'Libero' || p.isLibero);
                    setSelectedLiberoId(teamLib ? teamLib.id : null);
                    confetti({ particleCount: 25, spread: 45, origin: { y: 0.4 } });
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.35))',
                    border: '1.5px solid #f59e0b',
                    color: '#fef3c7',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.45rem 0.5rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                  title="Auto-place 2 Setters, 2 Outsides, and 2 Middles into legal 6-2 rotation"
                >
                  <Sparkles size={14} color="#fbbf24" />
                  <span>Auto-Fill 6-2 Lineup</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const saved = computeSavedStarters(roster);
                    setWizardLineup(saved);
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#93c5fd',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                  title="Use starters designated on Roster tab"
                >
                  <Users size={14} />
                  <span>Roster Starters</span>
                </button>
              </div>

              {/* Live Lineup Rule Validation Checklist */}
              <div
                style={{
                  background: isLineupFull
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${isLineupFull ? '#10b981' : '#ef4444'}`,
                  borderRadius: '10px',
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.76rem',
                  fontWeight: 800
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isLineupFull ? '#a7f3d0' : '#fca5a5' }}>
                  {isLineupFull ? <CheckCircle2 size={16} color="#34d399" /> : <AlertTriangle size={16} color="#f87171" />}
                  <span>
                    {isLineupFull
                      ? '6 Starters Confirmed (Ready to Play)'
                      : hasDuplicate
                      ? 'Duplicate player selected on court'
                      : `Missing ${emptyZones.length} player(s) in lineup`}
                  </span>
                </div>
                <span style={{ color: '#ffffff', opacity: 0.8 }}>
                  {assignedPlayerIds.length}/6 Court
                </span>
              </div>

              {/* Visual 6-Zone Court Diagram */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1.5px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                {/* NET HEADER */}
                <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '2px', borderBottom: '2px dashed #f59e0b', paddingBottom: '3px' }}>
                  ━━━━ NET (ATTACK ZONE) ━━━━
                </div>

                {/* FRONT ROW (Zone 4, Zone 3, Zone 2) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.45rem' }}>
                  {['pos4', 'pos3', 'pos2'].map(zk => {
                    const p = getPlayer(wizardLineup[zk]);
                    const zone = ZONE_LABELS[zk];

                    return (
                      <button
                        key={zk}
                        type="button"
                        onClick={() => setActiveZoneToPick(zk)}
                        style={{
                          background: p ? 'rgba(30, 41, 59, 0.9)' : 'rgba(239, 68, 68, 0.08)',
                          border: p ? '1.5px solid rgba(245, 158, 11, 0.5)' : '1.5px dashed rgba(239, 68, 68, 0.5)',
                          borderRadius: '10px',
                          padding: '0.5rem 0.35rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.2rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#fca5a5' }}>
                            Z{zone.num} ({zone.name.split(' ')[0]})
                          </span>
                          <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Front</span>
                        </div>

                        {p ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                            <span style={{ background: '#f59e0b', color: '#0f172a', fontWeight: 900, fontSize: '0.72rem', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                              #{p.number}
                            </span>
                            <div style={{ minWidth: 0, overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {p.name.split(' ')[0]}
                              </div>
                              <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>
                                {p.position.slice(0, 3)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700, padding: '0.2rem 0' }}>
                            + Tap to Pick
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 10FT ATTACK LINE */}
                <div style={{ borderBottom: '1.5px dashed rgba(255, 255, 255, 0.15)' }} />

                {/* BACK ROW (Zone 5, Zone 6, Zone 1 / Server) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.45rem' }}>
                  {['pos5', 'pos6', 'pos1'].map(zk => {
                    const p = getPlayer(wizardLineup[zk]);
                    const zone = ZONE_LABELS[zk];
                    const isServer = zk === 'pos1';

                    return (
                      <button
                        key={zk}
                        type="button"
                        onClick={() => setActiveZoneToPick(zk)}
                        style={{
                          background: p ? 'rgba(30, 41, 59, 0.9)' : 'rgba(239, 68, 68, 0.08)',
                          border: isServer
                            ? '1.5px solid rgba(59, 130, 246, 0.8)'
                            : p
                            ? '1.5px solid rgba(255, 255, 255, 0.15)'
                            : '1.5px dashed rgba(239, 68, 68, 0.5)',
                          borderRadius: '10px',
                          padding: '0.5rem 0.35rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.2rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: isServer ? '#93c5fd' : '#cbd5e1' }}>
                            Z{zone.num} {isServer ? '🏐 Server' : ''}
                          </span>
                          <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Back</span>
                        </div>

                        {p ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                            <span style={{ background: isServer ? '#3b82f6' : '#64748b', color: '#ffffff', fontWeight: 900, fontSize: '0.72rem', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                              #{p.number}
                            </span>
                            <div style={{ minWidth: 0, overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {p.name.split(' ')[0]}
                              </div>
                              <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>
                                {p.position.slice(0, 3)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700, padding: '0.2rem 0' }}>
                            + Tap to Pick
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Designated Libero Box */}
              <div
                onClick={() => setActiveZoneToPick('libero')}
                style={{
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1.5px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '12px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Shield size={18} color="#c084fc" />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e9d5ff' }}>
                      Designated Libero (Rule 19)
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#d8b4fe' }}>
                      Free back-row exchanges • Does not count against sub limit
                    </div>
                  </div>
                </div>

                {selectedLiberoId ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ background: '#8b5cf6', color: '#ffffff', fontWeight: 900, fontSize: '0.74rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      #{getPlayer(selectedLiberoId)?.number}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                      {getPlayer(selectedLiberoId)?.name.split(' ')[0]}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 700 }}>
                    + Pick Libero
                  </span>
                )}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              STEP 3: COIN TOSS & FIRST SERVE
             ------------------------------------------------------------- */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#f8fafc' }}>
                Coin Toss & First Serve Selection
              </div>

              {/* Serve vs Receive Big Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setServingFirst(true)}
                  style={{
                    padding: '1rem 0.65rem',
                    borderRadius: '14px',
                    border: servingFirst ? '2.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: servingFirst ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.45))' : 'rgba(255, 255, 255, 0.03)',
                    color: servingFirst ? '#a7f3d0' : '#cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    boxShadow: servingFirst ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Volleyball size={28} color={servingFirst ? '#34d399' : '#94a3b8'} />
                  <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>We Serve First</span>
                  <span style={{ fontSize: '0.72rem', color: '#6ee7b7', textAlign: 'center' }}>
                    #{getPlayer(wizardLineup.pos1)?.number || '1'} {getPlayer(wizardLineup.pos1)?.name.split(' ')[0] || 'Player'} Serves in Zone 1
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setServingFirst(false)}
                  style={{
                    padding: '1rem 0.65rem',
                    borderRadius: '14px',
                    border: !servingFirst ? '2.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: !servingFirst ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(30, 58, 138, 0.45))' : 'rgba(255, 255, 255, 0.03)',
                    color: !servingFirst ? '#bfdbfe' : '#cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    boxShadow: !servingFirst ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Shield size={28} color={!servingFirst ? '#60a5fa' : '#94a3b8'} />
                  <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>We Receive First</span>
                  <span style={{ fontSize: '0.72rem', color: '#93c5fd', textAlign: 'center' }}>
                    Opponent serves first • Side-out triggers first rotation
                  </span>
                </button>
              </div>

              {/* Starting Rotation Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800, marginBottom: '0.4rem' }}>
                  Starting Rotation:
                </label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1, 2, 3, 4, 5, 6].map(rot => (
                    <button
                      key={rot}
                      type="button"
                      onClick={() => setStartingRotation(rot)}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.2rem',
                        borderRadius: '8px',
                        border: startingRotation === rot ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: startingRotation === rot ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                        color: startingRotation === rot ? '#fbbf24' : '#cbd5e1',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Rot {rot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Match Summary Box */}
              <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '0.75rem', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Opponent:</span>
                  <strong style={{ color: '#f87171' }}>{opponent.trim() || 'Opponent'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Court & Stage:</span>
                  <strong>{court} • {matchStage}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Volleyball Rules:</span>
                  <strong style={{ color: '#34d399' }}>2 Timeouts / Set • {maxSubs} Subs / Set</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            BOTTOM ACTION FOOTER (BACK / NEXT / LAUNCH)
           ========================================================================= */}
        <div
          style={{
            padding: '0.85rem 1.15rem',
            background: 'rgba(0, 0, 0, 0.45)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            gap: '0.5rem'
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setStep(step - 1)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (step === 1 && !opponent.trim()) {
                  setOpponent('Opponent');
                }
                setStep(step + 1);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, padding: '0.5rem 1rem' }}
            >
              <span>Next: {step === 1 ? 'Lineup Setup' : 'Coin Toss'}</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleLaunchMatch}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 900,
                fontSize: '0.9rem',
                padding: '0.55rem 1.25rem',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.5)'
              }}
            >
              <Play size={16} fill="currentColor" />
              <span>START GAME NOW (0-0)</span>
            </button>
          )}
        </div>

        {/* =========================================================================
            BOTTOM PLAYER PICKER DRAWER (When Tapping a Zone in Step 2)
           ========================================================================= */}
        {activeZoneToPick && (
          <div
            className="modal-overlay"
            onClick={() => setActiveZoneToPick(null)}
            style={{
              zIndex: 1500,
              padding: '0',
              alignItems: 'flex-end',
              background: 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '520px',
                maxHeight: '75vh',
                background: '#0f172a',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
                border: '1.5px solid rgba(59, 130, 246, 0.5)',
                borderBottom: 'none',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.9)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#f8fafc' }}>
                  {activeZoneToPick === 'libero'
                    ? 'Select Designated Libero'
                    : `Assign Player to Zone ${ZONE_LABELS[activeZoneToPick]?.num} (${ZONE_LABELS[activeZoneToPick]?.name})`}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveZoneToPick(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Clear Selection Option */}
              <button
                type="button"
                onClick={() => handlePickPlayerForZone('none')}
                style={{
                  padding: '0.55rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Clear / Leave Empty
              </button>

              {/* List of Roster Players */}
              <div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '50vh' }}>
                {roster.map(player => {
                  const isCurrentZoneOccupant = wizardLineup[activeZoneToPick] === player.id;
                  const existingZone = Object.keys(wizardLineup).find(k => wizardLineup[k] === player.id);
                  const isLibero = player.position === 'Libero' || player.isLibero;

                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => handlePickPlayerForZone(player.id)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        background: isCurrentZoneOccupant
                          ? 'rgba(16, 185, 129, 0.2)'
                          : existingZone
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isCurrentZoneOccupant
                          ? '1.5px solid #10b981'
                          : existingZone
                          ? '1px solid rgba(59, 130, 246, 0.4)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span
                          style={{
                            background: isLibero ? '#8b5cf6' : '#f59e0b',
                            color: '#0f172a',
                            fontWeight: 900,
                            fontSize: '0.82rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px'
                          }}
                        >
                          #{player.number}
                        </span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                            {player.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {player.position} {player.isCaptain ? '• Captain' : ''}
                          </div>
                        </div>
                      </div>

                      {isCurrentZoneOccupant ? (
                        <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800 }}>✓ Assigned</span>
                      ) : existingZone ? (
                        <span style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 700 }}>
                          In Zone {ZONE_LABELS[existingZone]?.num} (Tap to swap)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Available</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
