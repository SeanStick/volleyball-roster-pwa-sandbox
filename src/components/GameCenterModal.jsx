import React, { useState } from 'react';
import {
  X,
  Trophy,
  Calendar,
  MapPin,
  Swords,
  Plus,
  Play,
  RotateCcw,
  Archive,
  ArrowRight,
  Sparkles,
  Layers,
  Edit3,
  Trash2,
  Share2,
  FileText,
  Zap,
  Clock,
  Shield,
  CheckCircle2
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
import confetti from 'canvas-confetti';

const QUICK_COURTS = ['Ct 1', 'Ct 2', 'Ct 3', 'Ct 4', 'Ct 5', 'Ct 6', 'Ct 7', 'Ct 8', 'Main Gym'];

const MATCH_FORMATS = [
  { id: 'best_of_3_25', label: 'Best of 3 (25, 25, 15)', targetPoints: 25, deciderPoints: 15 },
  { id: 'best_of_3_21', label: 'Best of 3 (21, 21, 15)', targetPoints: 21, deciderPoints: 15 },
  { id: 'best_of_5', label: 'Best of 5 (25, 25, 25, 25, 15)', targetPoints: 25, deciderPoints: 15 },
  { id: 'two_sets_25', label: '2 Sets (25, 25 - Pool Play)', targetPoints: 25, deciderPoints: 25 },
  { id: 'two_sets_21', label: '2 Sets (21, 21 - Pool Play)', targetPoints: 21, deciderPoints: 21 },
  { id: 'one_set_25', label: '1 Set (to 25)', targetPoints: 25, deciderPoints: 25 }
];

const SUB_LIMITS = [
  { value: 12, label: '12 Subs (USAV / NFHS Default)' },
  { value: 15, label: '15 Subs' },
  { value: 18, label: '18 Subs (NCAA Standard)' },
  { value: 999, label: 'Unlimited Subs' }
];

export default function GameCenterModal({
  isOpen,
  onClose,
  initialTab = 'start', // 'start' | 'schedule' | 'archive'
  matchStats,
  matchHistory = [],
  daySchedule = [],
  onUpdateDaySchedule,
  onUpdateMatchDetails,
  onStartFreshMatch,
  onQuickStartScrimmage,
  onStartScheduledMatch,
  onArchiveMatch,
  onDeleteMatchHistory,
  onOpenPdfExport,
  onOpenMatchWizard,
  onOpenLineupStudio,
  roster = [],
  lineup = {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Match Configuration Form State
  const [opponent, setOpponent] = useState(matchStats?.opponentName === 'Opponent' ? '' : (matchStats?.opponentName || ''));
  const [tournamentName, setTournamentName] = useState(matchStats?.tournamentName || 'Tournament Day');
  const [court, setCourt] = useState(matchStats?.courtNumber || 'Court 1');
  const [matchStage, setMatchStage] = useState(matchStats?.matchStage || 'Match 1');
  const [formatId, setFormatId] = useState('best_of_3_25');
  const [maxSubs, setMaxSubs] = useState(matchStats?.maxSubs || 12);
  const [servingFirst, setServingFirst] = useState(true);
  const [startingRotation, setStartingRotation] = useState(1);

  // New Scheduled Match Form State
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [schedStage, setSchedStage] = useState(`Match ${daySchedule.length + 1}`);
  const [schedOpponent, setSchedOpponent] = useState('');
  const [schedCourt, setSchedCourt] = useState(court);
  const [schedTime, setSchedTime] = useState('');

  if (!isOpen) return null;

  const {
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    setHistory = []
  } = matchStats || {};

  const isMatchLive = ourScore > 0 || opponentScore > 0 || setHistory.length > 0;

  // Day Stats Calculation
  const totalMatches = matchHistory.length + (isMatchLive ? 1 : 0);
  const matchesWon = matchHistory.filter(m => m.result === 'WON' || m.ourSetsWon > m.opponentSetsWon).length;
  const matchesLost = matchHistory.filter(m => m.result === 'LOST' || m.opponentSetsWon > m.ourSetsWon).length;

  // Recent opponent suggestions from match history
  const recentOpponents = Array.from(
    new Set(
      (matchHistory || [])
        .map(m => m.opponentName)
        .filter(name => name && name !== 'Opponent' && name !== 'Next Opponent')
    )
  ).slice(0, 4);

  const handleLaunchStructuredMatch = () => {
    const chosenFormat = MATCH_FORMATS.find(f => f.id === formatId) || MATCH_FORMATS[0];
    onStartFreshMatch({
      opponentName: opponent.trim() || 'Opponent',
      tournamentName: tournamentName.trim() || 'Tournament Day',
      courtNumber: court.trim() || 'Court 1',
      matchStage: matchStage.trim() || 'Match 1',
      matchFormat: chosenFormat.label,
      targetPoints: chosenFormat.targetPoints,
      maxSubs: Number(maxSubs) || 12,
      phase: servingFirst ? 'serve' : 'receive',
      rotation: startingRotation,
      ourTimeoutsRemaining: 2,
      opponentTimeoutsRemaining: 2
    });
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.3 } });
    onClose();
  };

  const handleQuickScrimmageClick = () => {
    onQuickStartScrimmage();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.3 } });
    onClose();
  };

  const handleAddScheduleItem = () => {
    if (!schedOpponent.trim()) return;
    const newItem = {
      id: `sched-${Date.now()}`,
      matchStage: schedStage.trim() || `Match ${daySchedule.length + 1}`,
      opponentName: schedOpponent.trim(),
      courtNumber: schedCourt.trim() || court,
      time: schedTime.trim() || 'Next Up',
      format: 'Best of 3 (25, 25, 15)',
      status: 'upcoming'
    };
    const updated = [...daySchedule, newItem];
    onUpdateDaySchedule(updated);
    setSchedOpponent('');
    setIsAddingSchedule(false);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.4 } });
  };

  const handleStartFromSchedule = (schedItem) => {
    onStartScheduledMatch(schedItem);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.3 } });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1400,
        padding: '0.5rem',
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
          maxWidth: '560px',
          maxHeight: '94dvh',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1.5px solid rgba(59, 130, 246, 0.45)',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(59, 130, 246, 0.25)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '0.9rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.5), rgba(59, 130, 246, 0.25))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
              }}
            >
              <Trophy size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#ffffff' }}>
                Game Operations Center
              </div>
              <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 700 }}>
                {tournamentName} • {court}
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
              padding: '0.4rem',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '0.35rem 0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            gap: '0.4rem',
            flexShrink: 0
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('start')}
            style={{
              flex: 1,
              padding: '0.55rem 0.65rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'start' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
              color: activeTab === 'start' ? '#60a5fa' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Play size={14} />
            <span>Start & Setup</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            style={{
              flex: 1,
              padding: '0.55rem 0.65rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'schedule' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
              color: activeTab === 'schedule' ? '#60a5fa' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Calendar size={14} />
            <span>Today's Schedule</span>
            {daySchedule.length > 0 && (
              <span style={{ fontSize: '0.7rem', background: '#3b82f6', color: '#fff', borderRadius: '999px', padding: '0.1rem 0.4rem' }}>
                {daySchedule.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            style={{
              flex: 1,
              padding: '0.55rem 0.65rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'archive' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
              color: activeTab === 'archive' ? '#60a5fa' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Archive size={14} />
            <span>Match Archive</span>
            {matchHistory.length > 0 && (
              <span style={{ fontSize: '0.7rem', background: '#475569', color: '#fff', borderRadius: '999px', padding: '0.1rem 0.4rem' }}>
                {matchHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* =========================================================================
              TAB 1: START & ACTIVE MATCH SETUP
             ========================================================================= */}
          {activeTab === 'start' && (
            <>
              {/* Quick Scrimmage Option Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
                  border: '1.5px solid rgba(16, 185, 129, 0.45)',
                  borderRadius: '16px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Zap size={15} />
                    <span>⚡ 1-Tap Quick Play (Practice / Scrimmage)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                    Starts live score at 0-0 with current active court lineup immediately.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickScrimmageClick}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.5rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Play size={13} />
                  <span>Start Scrimmage</span>
                </button>
              </div>

              {/* Tournament Match Setup Card */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Trophy size={16} color="#60a5fa" />
                  <span>Structured Match Setup</span>
                </div>

                {/* Opponent Input & Suggestions */}
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                    Opponent Team Name
                  </label>
                  <input
                    type="text"
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    placeholder="e.g. Apex 16-1, Thunderbolts, Lincoln HS"
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '0.55rem 0.85rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  {recentOpponents.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', alignSelf: 'center' }}>Recent:</span>
                      {recentOpponents.map((name, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setOpponent(name)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '999px',
                            padding: '0.15rem 0.5rem',
                            color: '#cbd5e1',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tournament & Court Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Tournament / Event
                    </label>
                    <input
                      type="text"
                      value={tournamentName}
                      onChange={(e) => setTournamentName(e.target.value)}
                      placeholder="e.g. Midwest Qualifier"
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        padding: '0.55rem 0.85rem',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Court
                    </label>
                    <select
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        padding: '0.55rem 0.65rem',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    >
                      {QUICK_COURTS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Format & Sub Rules */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Match Format
                    </label>
                    <select
                      value={formatId}
                      onChange={(e) => setFormatId(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        padding: '0.55rem 0.65rem',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        outline: 'none'
                      }}
                    >
                      {MATCH_FORMATS.map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Substitution Limit
                    </label>
                    <select
                      value={maxSubs}
                      onChange={(e) => setMaxSubs(Number(e.target.value))}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        padding: '0.55rem 0.65rem',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        outline: 'none'
                      }}
                    >
                      {SUB_LIMITS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Coin Toss Decision */}
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                    Coin Toss / First Service
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setServingFirst(true)}
                      style={{
                        padding: '0.55rem',
                        borderRadius: '10px',
                        border: servingFirst ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: servingFirst ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: servingFirst ? '#6ee7b7' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer'
                      }}
                    >
                      <VolleyballIcon size={14} color="#10b981" />
                      <span>We Serve First</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServingFirst(false)}
                      style={{
                        padding: '0.55rem',
                        borderRadius: '10px',
                        border: !servingFirst ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: !servingFirst ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: !servingFirst ? '#93c5fd' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Shield size={14} color="#3b82f6" />
                      <span>We Receive First</span>
                    </button>
                  </div>
                </div>

                {/* Submit Launch Button */}
                <button
                  type="button"
                  onClick={handleLaunchStructuredMatch}
                  style={{
                    marginTop: '0.4rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Play size={16} />
                  <span>Launch Tournament Match</span>
                </button>
              </div>

              {/* 6-2 Lineup Studio Link */}
              {onOpenLineupStudio && (
                <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLineupStudio();
                    }}
                    style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      borderRadius: '10px',
                      padding: '0.5rem 0.85rem',
                      color: '#d8b4fe',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Sparkles size={14} color="#c084fc" />
                    <span>Open 6-2 Lineup Studio & Preset Builder ➔</span>
                  </button>
                </div>
              )}

              {/* Advanced Wizard Link */}
              {onOpenMatchWizard && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenMatchWizard();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#93c5fd',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Need to set positions manually? Open 3-Step Match Wizard ➔
                  </button>
                </div>
              )}
            </>
          )}

          {/* =========================================================================
              TAB 2: TODAY'S SCHEDULE & ON-DECK QUEUE
             ========================================================================= */}
          {activeTab === 'schedule' && (
            <>
              {/* Day Record Banner */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                    Tournament Record
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#ffffff' }}>
                    {matchesWon}W - {matchesLost}L
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                    Matches Total
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#60a5fa' }}>
                    {totalMatches} Played
                  </div>
                </div>
              </div>

              {/* Schedule Match Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                    Today's Match Queue
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingSchedule(!isAddingSchedule)}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '8px',
                      padding: '0.25rem 0.6rem',
                      color: '#93c5fd',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Match</span>
                  </button>
                </div>

                {/* Add Match to Schedule Inline Form */}
                {isAddingSchedule && (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '14px',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Stage (e.g. Match 3)"
                        value={schedStage}
                        onChange={(e) => setSchedStage(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.45rem', color: '#fff', fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Opponent Name"
                        value={schedOpponent}
                        onChange={(e) => setSchedOpponent(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.45rem', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Court (e.g. Court 1)"
                        value={schedCourt}
                        onChange={(e) => setSchedCourt(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.45rem', color: '#fff', fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Time (e.g. 11:30 AM)"
                        value={schedTime}
                        onChange={(e) => setSchedTime(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.45rem', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setIsAddingSchedule(false)}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddScheduleItem}
                        style={{ background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', color: '#fff', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Save to Schedule
                      </button>
                    </div>
                  </div>
                )}

                {/* List of Scheduled Matches */}
                {daySchedule.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.55)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '0.75rem 0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 800 }}>
                        {item.matchStage} • {item.courtNumber || court}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff' }}>
                        vs {item.opponentName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {item.time || 'Schedule'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartFromSchedule(item)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.45rem 0.75rem',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <Play size={13} />
                      <span>Start</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 3: MATCH ARCHIVE & BOX SCORES
             ========================================================================= */}
          {activeTab === 'archive' && (
            <>
              {matchHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                  <Archive size={36} color="#475569" style={{ margin: '0 auto 0.75rem' }} />
                  <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>No Saved Matches Yet</div>
                  <div style={{ fontSize: '0.78rem' }}>When a match is finished, save it here to review set box scores and stats.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {matchHistory.map((m) => {
                    const isWon = m.result === 'WON' || m.ourSetsWon > m.opponentSetsWon;
                    return (
                      <div
                        key={m.id}
                        style={{
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: isWon ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '14px',
                          padding: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 900,
                                padding: '0.15rem 0.45rem',
                                borderRadius: '6px',
                                background: isWon ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: isWon ? '#6ee7b7' : '#f87171',
                                marginRight: '0.45rem'
                              }}
                            >
                              {isWon ? 'WON' : 'LOST'} ({m.ourSetsWon || 0}-{m.opponentSetsWon || 0})
                            </span>
                            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                              {m.matchStage || 'Match'} • {m.courtNumber || 'Court 1'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onDeleteMatchHistory(m.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '0.2rem'
                            }}
                            title="Delete archived match"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>
                          vs {m.opponentName}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                          Set Scores: {m.finalScore || 'N/A'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
