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
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FRONT_ROW_ZONES, BACK_ROW_ZONES, ZONE_LABELS } from '../services/volleyballRules';

const QUICK_COURTS = ['Ct 1', 'Ct 2', 'Ct 3', 'Ct 4', 'Ct 5', 'Ct 6', 'Ct 7', 'Ct 8', 'Main Gym'];
const QUICK_MATCHES = ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Pool Play', 'Bracket', 'Finals'];
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
  roster = [],
  currentLineup = {},
  teamSettings = {},
  onStartFreshMatch
}) {
  const [step, setStep] = useState(1); // 1: Info, 2: Lineup, 3: Toss & Serve

  // Step 1 State: Match & Tournament
  const [tournamentName, setTournamentName] = useState('Tournament');
  const [court, setCourt] = useState('Court 1');
  const [opponent, setOpponent] = useState('');
  const [matchStage, setMatchStage] = useState('Match 1');
  const [matchFormat, setMatchFormat] = useState('best_of_3');
  const [maxSubs, setMaxSubs] = useState(12);

  // Step 2 State: Lineup
  const [wizardLineup, setWizardLineup] = useState({
    pos1: null,
    pos2: null,
    pos3: null,
    pos4: null,
    pos5: null,
    pos6: null
  });
  const [selectedLiberoId, setSelectedLiberoId] = useState(null);

  // Step 3 State: Toss & Starting Play
  const [servingFirst, setServingFirst] = useState(true); // true = We Serve, false = We Receive
  const [startingRotation, setStartingRotation] = useState(1);

  // Helper to auto-compute default starters from roster
  const computeDefaultStarters = (rosterPool) => {
    if (!Array.isArray(rosterPool) || rosterPool.length === 0) {
      return { pos1: null, pos2: null, pos3: null, pos4: null, pos5: null, pos6: null };
    }
    const setters = rosterPool.filter(p => p.position === 'Setter');
    const outsides = rosterPool.filter(p => p.position === 'Outside Hitter');
    const middles = rosterPool.filter(p => p.position === 'Middle Blocker');
    const opposites = rosterPool.filter(p => p.position === 'Opposite Hitter' || p.position === 'Right Side');
    const starters = rosterPool.filter(p => p.isStarter);

    const pos1 = setters[0]?.id || starters[0]?.id || rosterPool[0]?.id || null;
    const pos2 = outsides[0]?.id || starters[1]?.id || rosterPool[1]?.id || null;
    const pos3 = middles[0]?.id || starters[2]?.id || rosterPool[2]?.id || null;
    const pos4 = setters[1]?.id || opposites[0]?.id || starters[3]?.id || rosterPool[3]?.id || null;
    const pos5 = outsides[1]?.id || starters[4]?.id || rosterPool[4]?.id || null;
    const pos6 = middles[1]?.id || starters[5]?.id || rosterPool[5]?.id || null;

    return { pos1, pos2, pos3, pos4, pos5, pos6 };
  };

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTournamentName(matchStats?.tournamentName || 'Tournament');
      setCourt(matchStats?.courtNumber || 'Court 1');
      setOpponent('');
      setMatchStage(matchStats?.matchStage ? `Match ${Number(matchStats.matchStage.replace(/\D/g, '') || 1) + 1}` : 'Match 1');
      setMatchFormat('best_of_3');
      setMaxSubs(matchStats?.maxSubs || 12);
      setServingFirst(true);
      setStartingRotation(1);

      // Lineup init
      const defaultL = currentLineup && Object.values(currentLineup).some(Boolean)
        ? currentLineup
        : computeDefaultStarters(roster);
      setWizardLineup(defaultL);

      const teamLib = roster.find(p => p.position === 'Libero' || p.isLibero);
      setSelectedLiberoId(teamLib ? teamLib.id : null);
    }
  }, [isOpen, matchStats, roster]);

  if (!isOpen) return null;

  const handleApplyDefaultLineup = () => {
    const defaults = computeDefaultStarters(roster);
    setWizardLineup(defaults);
    const teamLib = roster.find(p => p.position === 'Libero' || p.isLibero);
    setSelectedLiberoId(teamLib ? teamLib.id : null);
  };

  const handleZonePlayerChange = (zoneKey, playerId) => {
    setWizardLineup(prev => ({
      ...prev,
      [zoneKey]: playerId === 'none' ? null : playerId
    }));
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

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
    onClose();
  };

  const getPlayer = (id) => roster.find(p => p.id === id);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1350,
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
          maxWidth: '520px',
          maxHeight: '92dvh',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1.5px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '20px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.2)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* =========================================================================
            WIZARD TOP HEADER
           ========================================================================= */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.6), rgba(15, 23, 42, 0.95))',
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
              <Volleyball size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Start New Match
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
                Step {step} of 3 — {step === 1 ? 'Match & Rules Setup' : step === 2 ? 'Starting 6 Lineup' : 'Coin Toss & Serve'}
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

        {/* =========================================================================
            PROGRESS BAR (3 STEPS)
           ========================================================================= */}
        <div style={{ display: 'flex', height: '4px', background: 'rgba(255, 255, 255, 0.1)', flexShrink: 0 }}>
          <div style={{ width: `${(step / 3) * 100}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)', transition: 'width 0.3s ease' }} />
        </div>

        {/* =========================================================================
            SCROLLABLE STEP CONTENT
           ========================================================================= */}
        <div
          style={{
            padding: '1.15rem',
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f87171', marginBottom: '0.35rem' }}>
                  Who is your opponent? *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Skyline 16-Black, West High, Thunderbolts..."
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  style={{ fontSize: '0.95rem', padding: '0.65rem 0.85rem' }}
                  autoFocus
                />
              </div>

              {/* Tournament & Court */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.3rem' }}>
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
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', marginBottom: '0.3rem' }}>
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
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.25rem' }}>
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
                          fontWeight: 700,
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
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.25rem' }}>
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
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Match Format & Substitution Rules */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.3rem' }}>
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
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.3rem' }}>
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
              STEP 2: STARTING 6 & LIBERO CONFIRMATION
             ------------------------------------------------------------- */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>
                  Starting 6 Lineup Confirmation
                </span>
                <button
                  type="button"
                  onClick={handleApplyDefaultLineup}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#93c5fd',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Reset to Roster Starters
                </button>
              </div>

              {/* Visual 6-Zone Court Grid */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1.5px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                {/* NET HEADER */}
                <div style={{ textAlign: 'center', fontSize: '0.68rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '2px', borderBottom: '2px dashed #f59e0b', paddingBottom: '3px' }}>
                  ━━━ NET ━━━
                </div>

                {/* FRONT ROW (Zone 4, Zone 3, Zone 2) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                  {['pos4', 'pos3', 'pos2'].map(zk => {
                    const p = getPlayer(wizardLineup[zk]);
                    const zone = ZONE_LABELS[zk];

                    return (
                      <div key={zk} style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.35rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#fca5a5', marginBottom: '3px' }}>
                          Z{zone.num} ({zone.name.split(' ')[0]})
                        </div>
                        <select
                          className="form-control"
                          value={wizardLineup[zk] || 'none'}
                          onChange={(e) => handleZonePlayerChange(zk, e.target.value)}
                          style={{ fontSize: '0.74rem', padding: '0.3rem 0.2rem' }}
                        >
                          <option value="none">-- Empty --</option>
                          {roster.map(player => (
                            <option key={player.id} value={player.id}>
                              #{player.number} {player.name.split(' ')[0]} ({player.position.slice(0, 3)})
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>

                {/* 10FT ATTACK LINE */}
                <div style={{ borderBottom: '1px dashed rgba(255, 255, 255, 0.15)' }} />

                {/* BACK ROW (Zone 5, Zone 6, Zone 1) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                  {['pos5', 'pos6', 'pos1'].map(zk => {
                    const p = getPlayer(wizardLineup[zk]);
                    const zone = ZONE_LABELS[zk];

                    return (
                      <div key={zk} style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.35rem', borderRadius: '8px', border: zk === 'pos1' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: zk === 'pos1' ? '#93c5fd' : '#cbd5e1', marginBottom: '3px' }}>
                          Z{zone.num} {zk === 'pos1' ? '(Server)' : ''}
                        </div>
                        <select
                          className="form-control"
                          value={wizardLineup[zk] || 'none'}
                          onChange={(e) => handleZonePlayerChange(zk, e.target.value)}
                          style={{ fontSize: '0.74rem', padding: '0.3rem 0.2rem' }}
                        >
                          <option value="none">-- Empty --</option>
                          {roster.map(player => (
                            <option key={player.id} value={player.id}>
                              #{player.number} {player.name.split(' ')[0]} ({player.position.slice(0, 3)})
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Libero Selection Box */}
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={16} color="#c084fc" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e9d5ff' }}>Designated Libero:</span>
                </div>

                <select
                  className="form-control"
                  value={selectedLiberoId || 'none'}
                  onChange={(e) => setSelectedLiberoId(e.target.value === 'none' ? null : e.target.value)}
                  style={{ width: 'auto', minWidth: '150px', fontSize: '0.78rem', padding: '0.3rem 0.5rem' }}
                >
                  <option value="none">No Libero</option>
                  {roster.map(player => (
                    <option key={player.id} value={player.id}>
                      #{player.number} {player.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              STEP 3: COIN TOSS & FIRST SERVE
             ------------------------------------------------------------- */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                Coin Toss & First Serve Selection
              </div>

              {/* Serve vs Receive 1-Tap Toggle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Who serves first in Set 1?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setServingFirst(true)}
                    style={{
                      padding: '0.85rem 0.6rem',
                      borderRadius: '12px',
                      border: servingFirst ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: servingFirst ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.4))' : 'rgba(255, 255, 255, 0.03)',
                      color: servingFirst ? '#a7f3d0' : '#cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Volleyball size={24} color={servingFirst ? '#34d399' : '#94a3b8'} />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>We Serve First</span>
                    <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>Start on Defense / Serving</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServingFirst(false)}
                    style={{
                      padding: '0.85rem 0.6rem',
                      borderRadius: '12px',
                      border: !servingFirst ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: !servingFirst ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(30, 58, 138, 0.4))' : 'rgba(255, 255, 255, 0.03)',
                      color: !servingFirst ? '#bfdbfe' : '#cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Shield size={24} color={!servingFirst ? '#60a5fa' : '#94a3b8'} />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>We Receive First</span>
                    <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Start in Serve Receive</span>
                  </button>
                </div>
              </div>

              {/* Starting Rotation Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>
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
                        border: startingRotation === rot ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: startingRotation === rot ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                        color: startingRotation === rot ? '#fbbf24' : '#cbd5e1',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Rot {rot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rule Compliance Notice */}
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.76rem', color: '#a7f3d0', lineHeight: 1.4 }}>
                ✓ <strong>Official Volleyball Rules Active:</strong> 2 Timeouts per set for both teams. {maxSubs} team substitutions per set (Libero replacements are free and unlimited). Timeouts and substitutions automatically reset every new set.
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            BOTTOM ACTION FOOTER (BACK / NEXT / START)
           ========================================================================= */}
        <div
          style={{
            padding: '0.85rem 1.15rem',
            background: 'rgba(0, 0, 0, 0.4)',
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
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800 }}
            >
              <span>Next: {step === 1 ? 'Lineup' : 'First Serve'}</span>
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
                gap: '0.4rem',
                fontWeight: 800,
                padding: '0.45rem 1.1rem',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Play size={15} fill="currentColor" />
              <span>Start Match (0-0)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
