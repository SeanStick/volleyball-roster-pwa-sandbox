import React, { useState, useEffect, useRef } from 'react';
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
  Play,
  Clock,
  ArrowLeftRight,
  Shield,
  Volume2,
  AlertCircle,
  Mic,
  MicOff,
  Zap,
  ArrowRightLeft,
  Settings,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import VolleyballIcon from './icons/VolleyballIcon';
import QuickPointModal from './QuickPointModal';
import RallyEditModal from './RallyEditModal';
import TimeoutAdvisorModal from './TimeoutAdvisorModal';
import { voiceScoreService } from '../services/voiceScoreService';

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
  onOpenMatchWizard,
  onOpenTournamentDayHub,
  onOpenGameCenter,
  onOpenSetBreak,
  onOpenMatchRecap,
  onOpenLineupStudio,
  onSelectSetNumber,
  onCallTimeout,
  onOpenSubModal,
  onUpdatePoint,
  onDeletePoint,
  subHistory = [],
  maxSubs = 12,
  lineup = {},
  roster = [],
  rotation = 1,
  phase = 'serve',
  userRole = 'head_coach',
  isCoachOrAssistant = true,
  onOpenWhiteboard,
  onNavigateTab
}) {
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [scoringTeam, setScoringTeam] = useState('us'); // 'us' | 'opponent'
  const [isMatchToolsOpen, setIsMatchToolsOpen] = useState(false);

  // Timeout Countdown Timer State
  const [activeTimeout, setActiveTimeout] = useState(null); // { team: 'us'|'opponent', secondsLeft: 60 }
  const [timeoutSeconds, setTimeoutSeconds] = useState(60);
  const [isTimeoutAdvisorOpen, setIsTimeoutAdvisorOpen] = useState(false);

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
    ourTimeoutsRemaining = 2,
    opponentTimeoutsRemaining = 2,
    timeoutHistory = [],
    pointHistory = [],
    setHistory = []
  } = matchStats || {};

  // Check regular substitutions used in current set
  const currentSetSubs = (matchStats?.subHistory || subHistory || [])
    .filter(s => (s.setNumber === undefined || s.setNumber === setNumber) && !s.isLiberoExchange).length;

  // Check if match is concluded (e.g. best of 3: 2 sets won)
  const isMatchWon = ourSetsWon >= 2;
  const isMatchLost = opponentSetsWon >= 2;
  const isMatchComplete = isMatchWon || isMatchLost;

  // Active Timeout Countdown Timer
  useEffect(() => {
    let timer = null;
    if (activeTimeout && timeoutSeconds > 0) {
      timer = setInterval(() => {
        setTimeoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeTimeout, timeoutSeconds]);

  const handleStartTimeoutTimer = (team) => {
    if (onCallTimeout) {
      onCallTimeout(team);
    }
    setActiveTimeout(team);
    setTimeoutSeconds(60);
    if (isCoachOrAssistant) {
      setIsTimeoutAdvisorOpen(true);
    }
  };

  const handleEndTimeoutTimer = () => {
    setActiveTimeout(null);
    setTimeoutSeconds(60);
    setIsTimeoutAdvisorOpen(false);
  };

  // ⚡ 1-Tap Quick Score vs Detailed Stat Mode
  const [isDirectScoreMode, setIsDirectScoreMode] = useState(() => {
    try {
      const saved = localStorage.getItem('gostandoverthere_direct_score');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleDirectScoreMode = () => {
    setIsDirectScoreMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('gostandoverthere_direct_score', String(next));
      } catch {}
      return next;
    });
  };

  // ✏️ Rally Edit / Overturn Modal State
  const [isEditRallyModalOpen, setIsEditRallyModalOpen] = useState(false);
  const [pointToEdit, setPointToEdit] = useState(null);

  // 🎙️ Voice Scorekeeper State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(null);
  const voiceTimeoutRef = useRef(null);
  const longPressTimerRef = useRef(null);

  // Most recent point in pointHistory
  const lastPoint = pointHistory && pointHistory.length > 0 ? pointHistory[pointHistory.length - 1] : null;

  const handleOpenEditPoint = (pt = null) => {
    const target = pt || lastPoint;
    if (target) {
      setPointToEdit(target);
      setIsEditRallyModalOpen(true);
    }
  };

  // Voice Command Listener
  const handleToggleVoiceScorekeeper = () => {
    if (isVoiceActive) {
      voiceScoreService.stopListening();
      setIsVoiceActive(false);
      setVoiceFeedback(null);
    } else {
      if (!voiceScoreService.isSupported()) {
        alert('Voice speech recognition is not supported in this browser. Please use Chrome or Safari.');
        return;
      }
      const success = voiceScoreService.startListening({
        onStateChange: (listening) => setIsVoiceActive(listening),
        onTranscript: (text) => {
          setVoiceFeedback({ text: `Heard: "${text}"`, type: 'transcript' });
        },
        onError: (err) => {
          setVoiceFeedback({ text: err, type: 'error' });
          if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
          voiceTimeoutRef.current = setTimeout(() => setVoiceFeedback(null), 4000);
        },
        onCommand: (cmd) => {
          handleVoiceCommand(cmd);
        }
      });
      if (success) {
        setIsVoiceActive(true);
        setVoiceFeedback({ text: 'Listening: Say "Kill 14", "Ace 3", or "Point Us"...', type: 'info' });
      }
    }
  };

  const handleVoiceCommand = (cmd) => {
    if (!cmd) return;
    setVoiceFeedback({ text: `✓ Executed: ${cmd.description}`, type: 'action' });
    if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
    voiceTimeoutRef.current = setTimeout(() => {
      setVoiceFeedback(prev => (prev?.type === 'action' ? null : prev));
    }, 3500);

    let matchedPlayer = null;
    if (cmd.jerseyNumber !== null && Array.isArray(roster)) {
      matchedPlayer = roster.find(p => Number(p.number) === Number(cmd.jerseyNumber));
    }

    if (cmd.action === 'kill') {
      onRallyWonByUs({
        pointWonBy: 'us',
        earnedType: 'kill',
        earnedTypeName: 'Attack Kill',
        earnedPlayerId: matchedPlayer?.id || null,
        earnedPlayerName: matchedPlayer?.name || (cmd.jerseyNumber ? `#${cmd.jerseyNumber}` : null),
        earnedPlayerNumber: matchedPlayer?.number || cmd.jerseyNumber || null,
        rotation,
        phase,
        setNumber
      });
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.25 } });
    } else if (cmd.action === 'ace') {
      const serverId = lineup?.pos1;
      const serverPlayer = roster.find(p => p.id === serverId);
      const player = matchedPlayer || serverPlayer;

      onRallyWonByUs({
        pointWonBy: 'us',
        earnedType: 'ace',
        earnedTypeName: 'Service Ace',
        earnedPlayerId: player?.id || null,
        earnedPlayerName: player?.name || null,
        earnedPlayerNumber: player?.number || null,
        rotation,
        phase,
        setNumber
      });
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.25 } });
    } else if (cmd.action === 'block') {
      onRallyWonByUs({
        pointWonBy: 'us',
        earnedType: 'block',
        earnedTypeName: 'Block Kill',
        earnedPlayerId: matchedPlayer?.id || null,
        earnedPlayerName: matchedPlayer?.name || null,
        earnedPlayerNumber: matchedPlayer?.number || null,
        rotation,
        phase,
        setNumber
      });
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.25 } });
    } else if (cmd.action === 'point_us') {
      onRallyWonByUs({
        pointWonBy: 'us',
        earnedType: 'quick_point',
        rotation,
        phase,
        setNumber
      });
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.2 } });
    } else if (cmd.action === 'point_opponent') {
      onRallyWonByOpponent({
        pointWonBy: 'opponent',
        errorTypeId: cmd.errorType || 'unspecified_error',
        rotation,
        phase,
        setNumber
      });
    } else if (cmd.action === 'timeout') {
      handleStartTimeoutTimer(cmd.team || 'us');
    } else if (cmd.action === 'undo') {
      onUndoLastPoint();
    }
  };

  // Cleanup voice on unmount
  useEffect(() => {
    return () => {
      voiceScoreService.stopListening();
    };
  }, []);

  // Fast +1 US Action (Instant 0ms in Direct Score Mode, or opens detailed modal)
  const handlePlusUs = (forceDetailed = false) => {
    if (isDirectScoreMode && !forceDetailed) {
      onRallyWonByUs({
        pointWonBy: 'us',
        earnedType: 'quick_point',
        earnedTypeName: 'Quick Point (+1)',
        rotation,
        phase,
        setNumber
      });
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.2 } });
    } else if (isTrackingEnabled || forceDetailed) {
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
  const handlePlusOpponent = (forceDetailed = false) => {
    if (isDirectScoreMode && !forceDetailed) {
      onRallyWonByOpponent({
        pointWonBy: 'opponent',
        errorTypeId: 'unspecified_error',
        errorTypeName: 'Opponent Point (+1)',
        rotation,
        phase,
        setNumber
      });
    } else if (isTrackingEnabled || forceDetailed) {
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

  // Long-press handling for opening detailed modal in direct score mode
  const handleUsMouseDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      handlePlusUs(true);
    }, 500);
  };
  const handleUsMouseUp = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
  };
  const handleOppMouseDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      handlePlusOpponent(true);
    }, 500);
  };
  const handleOppMouseUp = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
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
    if (onOpenSetBreak) {
      onOpenSetBreak();
      return;
    }
    const isOurLead = ourScore > opponentScore;
    const confirmMsg = `Finish Set ${setNumber} (${ourScore} - ${opponentScore})?\n\nWinner: ${isOurLead ? 'US' : opponentName || 'Opponent'}\n\nAdvance to Set ${setNumber + 1} (0-0)?`;
    if (window.confirm(confirmMsg)) {
      onStartNewSet();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.25 } });
    }
  };

  const handleFinishGameClick = () => {
    if (onOpenMatchRecap) {
      onOpenMatchRecap();
      return;
    }
    if (!onArchiveMatch) return;
    const opp = opponentName || matchStats?.opponentName || 'Opponent';
    const confirmMsg = `Finish and finalize this match against ${opp} (${ourScore} - ${opponentScore})?\n\nThis will save the full match to the Archive & Match History.`;
    if (window.confirm(confirmMsg)) {
      const saved = onArchiveMatch(opp);
      if (saved && onResetFullMatch) {
        if (window.confirm('Match successfully archived! 🏆\n\nWould you like to reset the scoreboard and lineup for a fresh match?')) {
          onResetFullMatch();
        }
      }
    }
  };

  // Build list of sets to display (at least 1, 2, 3, or more if reached)
  const maxSet = Math.max(3, setNumber, setHistory.length);
  const setNumbersList = Array.from({ length: maxSet }, (_, i) => i + 1);

  return (
    <>
      {/* =========================================================================
          ⏱️ ACTIVE TIMEOUT COUNTDOWN OVERLAY / BANNER
         ========================================================================= */}
      {activeTimeout && (
        <div
          style={{
            background: activeTimeout === 'us'
              ? 'linear-gradient(90deg, #10b981 0%, #047857 100%)'
              : 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)',
            color: '#ffffff',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeIn 0.2s ease-out',
            zIndex: 100
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={20} className="animate-spin" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.02em' }}>
                {activeTimeout === 'us' ? 'OUR TIMEOUT (US)' : `OPPONENT TIMEOUT (${(opponentName || 'OPP').toUpperCase()})`}
              </div>
              <div style={{ fontSize: '0.74rem', opacity: 0.9 }}>
                Official 60-second break • Score: US {ourScore} - {opponentScore} OPP
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {isCoachOrAssistant && (
              <button
                type="button"
                onClick={() => setIsTimeoutAdvisorOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(126, 34, 206, 0.95))',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  borderRadius: '8px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(168, 85, 247, 0.4)'
                }}
                title="Open In-Game Tactical & Motivational Huddle Advisor"
              >
                <Sparkles size={13} color="#fdf4ff" />
                <span>🧠 Huddle Advisor</span>
              </button>
            )}

            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.45rem',
                fontWeight: 900,
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.2rem 0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              0:{timeoutSeconds < 10 ? `0${timeoutSeconds}` : timeoutSeconds}
            </div>

            <button
              type="button"
              onClick={handleEndTimeoutTimer}
              style={{
                background: '#ffffff',
                color: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              Resume Play
            </button>
          </div>
        </div>
      )}

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
        {/* Left: Location & Opponent (Click to Quick Edit) */}
        <div
          onClick={onOpenGameCenter || onOpenMatchSetup}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            minWidth: 0,
            cursor: 'pointer'
          }}
          title="Tap to change Court, Match, or Opponent"
        >
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            {courtNumber}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: '#60a5fa' }}>{matchStage}</span> vs <span style={{ color: '#fca5a5' }}>{opponentName || 'Opponent'}</span>
          </span>
          <Edit3 size={11} color="#94a3b8" style={{ flexShrink: 0 }} />
        </div>

        {/* Right: Sets Summary & Match Tools Trigger */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexShrink: 0
          }}
        >
          <div
            onClick={onOpenGameCenter || onOpenTournamentDayHub}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="Sets summary (click for game center)"
          >
            <span style={{ color: '#94a3b8' }}>Sets:</span>
            <span style={{ color: '#10b981' }}>{ourSetsWon}</span>
            <span style={{ color: '#94a3b8' }}>-</span>
            <span style={{ color: '#f87171' }}>{opponentSetsWon}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMatchToolsOpen(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(30, 58, 138, 0.45))',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '999px',
              padding: '0.22rem 0.65rem',
              color: '#93c5fd',
              fontSize: '0.74rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
            title="Open Coach & Match Tools (Studio, Stats, Preferences, Wizard)"
          >
            <Settings size={12} color="#60a5fa" />
            <span>Match Tools</span>
            {(isVoiceActive || isDirectScoreMode) && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
            )}
          </button>
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
          🎙️ VOICE SCOREKEEPER FEEDBACK BANNER (When Active)
         ========================================================================= */}
      {(isVoiceActive || voiceFeedback) && (
        <div
          style={{
            background: voiceFeedback?.type === 'error'
              ? 'rgba(239, 68, 68, 0.95)'
              : voiceFeedback?.type === 'action'
              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(90deg, #7c3aed 0%, #4c1d95 100%)',
            color: '#ffffff',
            padding: '0.4rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.45)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeIn 0.2s ease-out',
            zIndex: 90
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mic size={15} className={isVoiceActive ? 'animate-pulse' : ''} />
            <span>{voiceFeedback?.text || 'Listening: Speak calls like "Kill 14", "Ace 3", "Point Us", "Timeout"...'}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              voiceScoreService.stopListening();
              setIsVoiceActive(false);
              setVoiceFeedback(null);
            }}
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '0.2rem 0.5rem',
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontWeight: 800
            }}
          >
            Turn Off Voice
          </button>
        </div>
      )}

      {/* =========================================================================
          🔢 4. MAIN LIVE SCOREBOARD RIBBON WITH TIMEOUTS & SUBS
         ========================================================================= */}
      <div className="scoreboard-ribbon">
        {/* Left: Set & Subs Counter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

          {/* 🔄 Subs Counter (Clickable to view/trigger subs) */}
          <div
            onClick={onOpenSubModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              background: currentSetSubs >= (maxSubs - 2) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.15)',
              border: `1px solid ${currentSetSubs >= (maxSubs - 2) ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.35)'}`,
              color: currentSetSubs >= (maxSubs - 2) ? '#fca5a5' : '#93c5fd',
              cursor: 'pointer'
            }}
            title="Team Substitutions used in this set (Rule limit)"
          >
            <ArrowLeftRight size={11} />
            <span>Subs: {currentSetSubs} / {maxSubs}</span>
          </div>
        </div>

        {/* Center: Live Digits & Quick Add Buttons + Recent Point Chip */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="scoreboard-score-group">
            {/* US Score & +1 Button */}
            <div className="scoreboard-team-box">
              <span className="scoreboard-team-label">US</span>
              <div className="scoreboard-digit us">{ourScore}</div>
              <button
                className="btn-score-add us"
                onClick={() => handlePlusUs()}
                onMouseDown={handleUsMouseDown}
                onMouseUp={handleUsMouseUp}
                onTouchStart={handleUsMouseDown}
                onTouchEnd={handleUsMouseUp}
                title={isDirectScoreMode ? "1-Tap Direct Score (+1 Us). Hold to open detailed stats" : "Award point to Our Team (+1 Us)"}
              >
                <Plus size={16} /> <span>US</span>
              </button>
            </div>

            <div className="scoreboard-vs-divider">:</div>

            {/* OPP Score & +1 Button */}
            <div className="scoreboard-team-box">
              <button
                className="btn-score-add opp"
                onClick={() => handlePlusOpponent()}
                onMouseDown={handleOppMouseDown}
                onMouseUp={handleOppMouseUp}
                onTouchStart={handleOppMouseDown}
                onTouchEnd={handleOppMouseUp}
                title={isDirectScoreMode ? "1-Tap Direct Score (+1 Opp). Hold to open detailed stats" : "Award point to Opponent"}
              >
                <Plus size={16} /> <span>OPP</span>
              </button>
              <div className="scoreboard-digit opp">{opponentScore}</div>
              <span className="scoreboard-team-label">{(opponentName || 'OPP').slice(0, 5)}</span>
            </div>
          </div>

          {/* ✏️ Recent Point Chip (Tap to edit player, error, or referee overturn) */}
          {lastPoint && (
            <div
              onClick={() => handleOpenEditPoint(lastPoint)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.15rem 0.55rem',
                borderRadius: '999px',
                background: lastPoint.pointWonBy === 'us' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${lastPoint.pointWonBy === 'us' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                color: lastPoint.pointWonBy === 'us' ? '#a7f3d0' : '#fca5a5',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '0.2rem',
                transition: 'all 0.15s ease'
              }}
              title="Click to edit credited player, change error, or referee overturn"
            >
              <span>
                Last: <strong>{lastPoint.pointWonBy === 'us' ? 'US' : 'OPP'}</strong> • {lastPoint.earnedTypeName || lastPoint.errorTypeName || 'Point'}
                {lastPoint.earnedPlayerName ? ` (#${lastPoint.earnedPlayerNumber || ''} ${lastPoint.earnedPlayerName.split(' ')[0]})` : ''}
                {lastPoint.earnedType === 'quick_point' ? ' [+ Tag Hitter]' : ''}
              </span>
              <Edit3 size={11} />
            </div>
          )}
        </div>

        {/* Right: Quick Controls + ⏱️ TIMEOUT BUTTONS */}
        <div className="scoreboard-action-group">
          {/* ⏱️ US Timeout Button & Dots */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleStartTimeoutTimer('us')}
            disabled={ourTimeoutsRemaining <= 0}
            style={{
              padding: '0.4rem 0.65rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              background: ourTimeoutsRemaining > 0 ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: ourTimeoutsRemaining > 0 ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.08)',
              color: ourTimeoutsRemaining > 0 ? '#6ee7b7' : '#64748b'
            }}
            title={ourTimeoutsRemaining > 0 ? `Call Timeout for Us (${ourTimeoutsRemaining} left)` : 'No timeouts remaining for Us in this set'}
          >
            <Clock size={13} color={ourTimeoutsRemaining > 0 ? '#34d399' : '#64748b'} />
            <span>US TO</span>
            {/* Timeout Dots: [ ● ● ] */}
            <div style={{ display: 'flex', gap: '3px', marginLeft: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ourTimeoutsRemaining >= 1 ? '#10b981' : '#475569' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ourTimeoutsRemaining >= 2 ? '#10b981' : '#475569' }} />
            </div>
          </button>

          {/* ⏱️ OPP Timeout Button & Dots */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleStartTimeoutTimer('opponent')}
            disabled={opponentTimeoutsRemaining <= 0}
            style={{
              padding: '0.4rem 0.65rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              background: opponentTimeoutsRemaining > 0 ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: opponentTimeoutsRemaining > 0 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.08)',
              color: opponentTimeoutsRemaining > 0 ? '#fca5a5' : '#64748b'
            }}
            title={opponentTimeoutsRemaining > 0 ? `Record Opponent Timeout (${opponentTimeoutsRemaining} left)` : 'No timeouts remaining for Opponent in this set'}
          >
            <Clock size={13} color={opponentTimeoutsRemaining > 0 ? '#f87171' : '#64748b'} />
            <span>OPP TO</span>
            {/* Timeout Dots: [ ● ● ] */}
            <div style={{ display: 'flex', gap: '3px', marginLeft: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: opponentTimeoutsRemaining >= 1 ? '#ef4444' : '#475569' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: opponentTimeoutsRemaining >= 2 ? '#ef4444' : '#475569' }} />
            </div>
          </button>

          {/* Undo Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onUndoLastPoint}
            disabled={pointHistory.length === 0}
            title={pointHistory.length > 0 ? 'Undo last rally point' : 'No points recorded yet'}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
          >
            <RotateCcw size={13} />
            <span>Undo</span>
          </button>

          {/* ⚙️ Consolidated Match Tools Trigger */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsMatchToolsOpen(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(30, 58, 138, 0.45))',
              borderColor: 'rgba(59, 130, 246, 0.55)',
              color: '#93c5fd',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '0.4rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Open Coach & Match Tools (Lineup Studio, Stats, Whiteboard, Preferences, Wizard)"
          >
            <Settings size={13} color="#60a5fa" />
            <span>Tools</span>
            {(isVoiceActive || isDirectScoreMode) && (
              <span style={{
                fontSize: '0.62rem',
                background: isVoiceActive ? '#a855f7' : '#f59e0b',
                color: '#fff',
                padding: '0.1rem 0.35rem',
                borderRadius: '999px',
                fontWeight: 900
              }}>
                {isVoiceActive ? '🎙️' : '⚡'}
              </span>
            )}
          </button>
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

      {/* Rally Log Quick-Editor Modal */}
      {isEditRallyModalOpen && pointToEdit && (
        <RallyEditModal
          isOpen={isEditRallyModalOpen}
          onClose={() => {
            setIsEditRallyModalOpen(false);
            setPointToEdit(null);
          }}
          point={pointToEdit}
          roster={roster}
          courtLineup={lineup}
          onSavePoint={(pointId, updatedData, isOverturned) => {
            if (onUpdatePoint) {
              onUpdatePoint(pointId, updatedData, isOverturned);
            }
            setIsEditRallyModalOpen(false);
            setPointToEdit(null);
          }}
          onDeletePoint={(pointId) => {
            if (onDeletePoint) {
              onDeletePoint(pointId);
            }
            setIsEditRallyModalOpen(false);
            setPointToEdit(null);
          }}
        />
      )}

      {/* In-Game Tactical & Motivational Timeout Advisor Modal */}
      {isTimeoutAdvisorOpen && (
        <TimeoutAdvisorModal
          isOpen={isTimeoutAdvisorOpen}
          onClose={() => setIsTimeoutAdvisorOpen(false)}
          activeTimeout={activeTimeout || 'us'}
          timeoutSeconds={timeoutSeconds}
          onEndTimeout={handleEndTimeoutTimer}
          matchStats={matchStats}
          rotation={rotation}
          phase={phase}
          roster={roster}
          courtLineup={lineup}
          opponentName={opponentName}
          onOpenWhiteboard={onOpenWhiteboard}
        />
      )}

      {/* ⚙️ Consolidated Match Tools & Coach Modal */}
      {isMatchToolsOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsMatchToolsOpen(false)}
          style={{
            zIndex: 1200,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '540px',
              width: '100%',
              background: '#0f172a',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
              color: '#f8fafc',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Settings size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#f8fafc' }}>
                    Coach & Match Tools
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                    Consolidated match operations, lineup tools & scoring settings
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMatchToolsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.4rem',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '78vh', overflowY: 'auto' }}>
              {/* Section 1: In-Game Scoring Preferences */}
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#60a5fa', marginBottom: '0.6rem' }}>
                  Live Scoring Preferences
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {/* 1-Tap Direct Score */}
                  <div
                    onClick={handleToggleDirectScoreMode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      background: isDirectScoreMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isDirectScoreMode ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Zap size={18} color={isDirectScoreMode ? '#f59e0b' : '#94a3b8'} />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: isDirectScoreMode ? '#fbbf24' : '#f8fafc' }}>
                          1-Tap Fast Scoring Mode: {isDirectScoreMode ? 'ON' : 'OFF'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {isDirectScoreMode ? 'Tap +1 to score in 0ms (press & hold for stat modal)' : 'Opens detailed stat attribution modal on every point'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: isDirectScoreMode ? '#fbbf24' : '#64748b' }}>
                      {isDirectScoreMode ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>

                  {/* Voice Scorekeeper */}
                  <div
                    onClick={handleToggleVoiceScorekeeper}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      background: isVoiceActive ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isVoiceActive ? '#a855f7' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {isVoiceActive ? <Mic size={18} color="#c084fc" className="animate-pulse" /> : <MicOff size={18} color="#94a3b8" />}
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: isVoiceActive ? '#e9d5ff' : '#f8fafc' }}>
                          Hands-Free Voice Scorekeeper: {isVoiceActive ? 'LISTENING' : 'OFF'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {isVoiceActive ? 'Listening: speak "Kill 14", "Ace 3", "Point Us", "Timeout"' : 'Call scores and kills hands-free with your voice while coaching'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: isVoiceActive ? '#c084fc' : '#64748b' }}>
                      {isVoiceActive ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>

                  {/* Error Tracking Toggle */}
                  <div
                    onClick={handleToggleTracking}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      background: isTrackingEnabled ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isTrackingEnabled ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Sliders size={18} color={isTrackingEnabled ? '#60a5fa' : '#94a3b8'} />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: isTrackingEnabled ? '#93c5fd' : '#f8fafc' }}>
                          Error Attribution Tracking: {isTrackingEnabled ? 'ON' : 'OFF'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          Prompt for error types: hit out, net touch, dropped ball, shank
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: isTrackingEnabled ? '#60a5fa' : '#64748b' }}>
                      {isTrackingEnabled ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Lineup & Coaching Tools */}
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c084fc', marginBottom: '0.6rem' }}>
                  Lineup & Coaching Tools
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                  {onOpenLineupStudio && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMatchToolsOpen(false);
                        onOpenLineupStudio();
                      }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(126, 34, 206, 0.35))',
                        border: '1.5px solid rgba(168, 85, 247, 0.5)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        color: '#fff',
                        textAlign: 'left'
                      }}
                    >
                      <Sparkles size={18} color="#c084fc" />
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Lineup Studio</div>
                      <div style={{ fontSize: '0.7rem', color: '#e9d5ff' }}>6-2 Optimizer & Fit</div>
                    </button>
                  )}

                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMatchToolsOpen(false);
                        onNavigateTab('stats');
                      }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(30, 58, 138, 0.35))',
                        border: '1.5px solid rgba(59, 130, 246, 0.5)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        color: '#fff',
                        textAlign: 'left'
                      }}
                    >
                      <BarChart3 size={18} color="#60a5fa" />
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Match Stats</div>
                      <div style={{ fontSize: '0.7rem', color: '#bfdbfe' }}>Box scores & charts</div>
                    </button>
                  )}

                  {onOpenWhiteboard && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMatchToolsOpen(false);
                        onOpenWhiteboard();
                      }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.35))',
                        border: '1.5px solid rgba(16, 185, 129, 0.5)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        color: '#fff',
                        textAlign: 'left'
                      }}
                    >
                      <Edit3 size={18} color="#34d399" />
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Whiteboard</div>
                      <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Tactical drawings</div>
                    </button>
                  )}
                </div>
              </div>

              {/* Section 3: Match & Tournament Operations */}
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#10b981', marginBottom: '0.6rem' }}>
                  Match & Tournament Operations
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                  {onOpenMatchWizard && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMatchToolsOpen(false);
                        if (onOpenGameCenter) onOpenGameCenter();
                        else onOpenMatchWizard();
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        color: '#fff',
                        textAlign: 'left'
                      }}
                    >
                      <VolleyballIcon size={18} />
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Match Wizard</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Setup & coin toss</div>
                    </button>
                  )}

                  {(onOpenGameCenter || onOpenTournamentDayHub) && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMatchToolsOpen(false);
                        if (onOpenGameCenter) onOpenGameCenter();
                        else if (onOpenTournamentDayHub) onOpenTournamentDayHub();
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        color: '#fff',
                        textAlign: 'left'
                      }}
                    >
                      <Trophy size={18} color="#fbbf24" />
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Game Center</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Schedule & pool play</div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMatchToolsOpen(false);
                      handleFinishSetClick();
                    }}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      color: '#6ee7b7',
                      textAlign: 'left'
                    }}
                  >
                    <Check size={18} color="#34d399" />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Finish Set {setNumber}</div>
                    <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Advance to Set {setNumber + 1}</div>
                  </button>

                  {onArchiveMatch && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMatchToolsOpen(false);
                        handleFinishGameClick();
                      }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        color: '#fca5a5',
                        textAlign: 'left'
                      }}
                    >
                      <Archive size={18} color="#f87171" />
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Finish Game</div>
                      <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>Save to match archive</div>
                    </button>
                  )}

                  {/* Reset 0-0 */}
                  <button
                    type="button"
                    onClick={() => {
                      if (ourScore === 0 && opponentScore === 0) return;
                      if (window.confirm('Reset current set score back to 0 - 0?')) {
                        setIsMatchToolsOpen(false);
                        onResetScore();
                      }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      textAlign: 'left'
                    }}
                  >
                    <RefreshCw size={18} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Reset Set (0-0)</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Clear current score</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
