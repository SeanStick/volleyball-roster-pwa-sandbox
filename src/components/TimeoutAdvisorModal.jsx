import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Volume2,
  VolumeX,
  Shuffle,
  X,
  Flame,
  Shield,
  Target,
  Sparkles,
  PenTool,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Play
} from 'lucide-react';
import {
  generateTimeoutBrief,
  speakTimeoutAdvice,
  stopSpeakingAdvice
} from '../services/timeoutAdvisorService';

export default function TimeoutAdvisorModal({
  isOpen,
  onClose,
  activeTimeout = 'us', // 'us' | 'opponent'
  timeoutSeconds = 60,
  onEndTimeout,
  matchStats = {},
  rotation = 1,
  phase = 'receive',
  roster = [],
  courtLineup = {},
  opponentName = 'Opponent',
  onOpenWhiteboard
}) {
  const [brief, setBrief] = useState(null);
  const [tacticalIndex, setTacticalIndex] = useState(0);
  const [motivationalIndex, setMotivationalIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef(null);
  const hasBeeped15Ref = useRef(false);

  // Initialize and update brief when opening or when match state changes
  useEffect(() => {
    if (isOpen) {
      const generated = generateTimeoutBrief({
        matchStats,
        rotation,
        phase,
        timeoutTeam: activeTimeout,
        roster,
        courtLineup
      });
      setBrief(generated);
      setTacticalIndex(0);
      setMotivationalIndex(Math.floor(Math.random() * (generated.motivationalPool.length || 1)));
      hasBeeped15Ref.current = false;
    } else {
      stopSpeakingAdvice();
      setIsSpeaking(false);
    }
  }, [isOpen, activeTimeout, rotation, matchStats]);

  // Audio warning horn/beep at 15s using Web Audio API
  useEffect(() => {
    if (timeoutSeconds === 15 && !hasBeeped15Ref.current) {
      hasBeeped15Ref.current = true;
      playWarningBeep();
    }
  }, [timeoutSeconds]);

  const playWarningBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('AudioContext beep failed:', e);
    }
  };

  if (!isOpen || !brief) return null;

  // Active items based on shuffle index
  const activePrimaryTactical = brief.tacticalPool[tacticalIndex % brief.tacticalPool.length] || brief.primaryTactical;
  const activeSecondaryTactical = brief.tacticalPool[(tacticalIndex + 1) % brief.tacticalPool.length] || brief.secondaryTactical;
  const activeMotivation = brief.motivationalPool[motivationalIndex % brief.motivationalPool.length] || brief.primaryMotivation;

  const handleShuffleTactical = () => {
    setTacticalIndex(prev => prev + 1);
  };

  const handleShuffleMotivation = () => {
    setMotivationalIndex(prev => prev + 1);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeakingAdvice();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const speechText = `Timeout focus. Number 1: ${activePrimaryTactical.title}. ${activePrimaryTactical.instruction}. Team reminder: ${activeMotivation.text}`;
      speakTimeoutAdvice(speechText, () => setIsSpeaking(false));
    }
  };

  // Determine timer ring color & urgency
  const isUrgent = timeoutSeconds <= 15;
  const timerColor = isUrgent ? '#ef4444' : timeoutSeconds <= 30 ? '#f59e0b' : '#10b981';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 24, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '94vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          border: `1.5px solid ${isUrgent ? 'rgba(239, 68, 68, 0.6)' : 'rgba(168, 85, 247, 0.4)'}`,
          borderRadius: '20px',
          boxShadow: isUrgent ? '0 0 35px rgba(239, 68, 68, 0.35)' : '0 12px 40px rgba(0, 0, 0, 0.65)',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff'
        }}
      >
        {/* =====================================================================
            HEADER: TIMEOUT TIMER & SCORE SNAPSHOT
           ===================================================================== */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Pulsing Timer Circle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.5)',
                border: `3px solid ${timerColor}`,
                boxShadow: `0 0 15px ${timerColor}66`,
                animation: isUrgent ? 'pulse 1s infinite' : 'none'
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: timerColor
                }}
              >
                {timeoutSeconds}s
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: activeTimeout === 'us' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: activeTimeout === 'us' ? '#34d399' : '#f87171',
                    border: `1px solid ${activeTimeout === 'us' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                  }}
                >
                  {activeTimeout === 'us' ? 'OUR TIMEOUT' : 'OPPONENT TIMEOUT'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                  Rotation R{rotation}
                </span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc', marginTop: '0.15rem' }}>
                US {matchStats.ourScore || 0} - {matchStats.opponentScore || 0} {opponentName || 'OPP'}
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem', fontWeight: 600 }}>
                  (Set {matchStats.setNumber || 1})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Close */}
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            style={{ color: '#94a3b8', padding: '0.4rem' }}
            title="Minimize Advisor"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================================
            GAME SITUATION BADGE BANNER
           ===================================================================== */}
        <div
          style={{
            padding: '0.5rem 1.25rem',
            background: isUrgent
              ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.2), rgba(15, 23, 42, 0.4))'
              : 'linear-gradient(90deg, rgba(168, 85, 247, 0.15), rgba(15, 23, 42, 0.4))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            fontWeight: 700
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#e2e8f0' }}>
            <Zap size={14} color="#c084fc" />
            <span>{brief.situationBadge}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Read Aloud Button */}
            <button
              type="button"
              onClick={handleToggleSpeak}
              style={{
                background: isSpeaking ? '#a855f7' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer'
              }}
              title="Speak key tactical instructions aloud to the huddle"
            >
              {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
              <span>{isSpeaking ? 'Mute' : 'Speak to Huddle'}</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            BODY: 3 FOCUS CARDS (PRIMARY + SECONDARY + MOTIVATION)
           ===================================================================== */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

          {/* CARD 1: PRIMARY TACTICAL ADJUSTMENT */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.45)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Target size={16} color="#fbbf24" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  1. Primary Tactical Adjustment • {activePrimaryTactical.category}
                </span>
              </div>

              <button
                type="button"
                onClick={handleShuffleTactical}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 600
                }}
                title="Shuffle to another tactical tip"
              >
                <Shuffle size={11} />
                <span>Next</span>
              </button>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fef3c7', marginBottom: '0.25rem' }}>
              {activePrimaryTactical.title}
            </div>

            <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.45 }}>
              {activePrimaryTactical.instruction}
            </div>
          </div>

          {/* CARD 2: SECONDARY TACTICAL FOCUS / COURT POSITIONING */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1.5px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '12px',
              padding: '0.85rem 1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <Shield size={16} color="#60a5fa" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                2. Court Spacing & Position • {activeSecondaryTactical.category}
              </span>
            </div>

            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#dbeafe', marginBottom: '0.25rem' }}>
              {activeSecondaryTactical.title}
            </div>

            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              {activeSecondaryTactical.instruction}
            </div>
          </div>

          {/* CARD 3: POSITIVE TEAM AFFIRMATION & RALLY CRY */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.16) 0%, rgba(236, 72, 153, 0.12) 100%)',
              border: '1.5px solid rgba(168, 85, 247, 0.45)',
              borderRadius: '12px',
              padding: '0.85rem 1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={16} color="#e879f9" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#e879f9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  3. Team Rally Cry & Affirmation
                </span>
              </div>

              <button
                type="button"
                onClick={handleShuffleMotivation}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 600
                }}
                title="Shuffle to another inspirational quote"
              >
                <Shuffle size={11} />
                <span>Next</span>
              </button>
            </div>

            <div
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#fdf4ff',
                lineHeight: 1.5,
                fontStyle: 'italic'
              }}
            >
              "{activeMotivation.text}"
            </div>
          </div>
        </div>

        {/* =====================================================================
            FOOTER: TACTICAL WHITEBOARD & RESUME BUTTONS
           ===================================================================== */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            gap: '0.65rem'
          }}
        >
          {/* Tactical Whiteboard Quick Diagram Link */}
          {onOpenWhiteboard ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenWhiteboard();
              }}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                color: '#93c5fd'
              }}
              title="Open whiteboard to diagram a 15-second play"
            >
              <PenTool size={14} color="#60a5fa" />
              <span>Diagram Play</span>
            </button>
          ) : <div />}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Minimize
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeakingAdvice();
                if (onEndTimeout) onEndTimeout();
                onClose();
              }}
              className="btn btn-primary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none'
              }}
            >
              <Play size={13} fill="#ffffff" />
              <span>Resume Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
