import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  User,
  Users,
  Shield,
  Volume2,
  PenTool,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
import { soundEffectsService } from '../services/soundEffectsService';

export default function RemoteTimeoutOverlay({
  timeoutEvent,
  onDismiss,
  onOpenWhiteboard,
  onOpenGeminiCoach,
  defaultDurationSeconds = 60
}) {
  const [totalSeconds, setTotalSeconds] = useState(defaultDurationSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState(defaultDurationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const audioPlayedRef = useRef(null);

  // Trigger referee whistle sound and device vibration upon arrival
  useEffect(() => {
    if (timeoutEvent?.id && audioPlayedRef.current !== timeoutEvent.id) {
      audioPlayedRef.current = timeoutEvent.id;
      soundEffectsService.playTimeoutAlertSound(timeoutEvent.teamCalling || 'us');
      setSecondsRemaining(totalSeconds);
      setIsTimerRunning(true);
    }
  }, [timeoutEvent, totalSeconds]);

  // Handle countdown interval
  useEffect(() => {
    if (!timeoutEvent || !isTimerRunning) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          // Play subtle second whistle warning at 0
          soundEffectsService.playTimeoutAlertSound(timeoutEvent.teamCalling || 'us');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeoutEvent, isTimerRunning]);

  if (!timeoutEvent) return null;

  const {
    teamCalling = 'us',
    callerName = 'Co-Coach',
    setNumber = 1,
    ourScore = 0,
    opponentScore = 0,
    opponentName = 'Opponent',
    ourTimeoutsRemaining = 1,
    opponentTimeoutsRemaining = 2,
    timestamp
  } = timeoutEvent;

  const isUs = teamCalling === 'us';
  const callingTeamName = isUs ? 'Our Squad' : opponentName;
  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / totalSeconds) * 100));
  const isWarningZone = secondsRemaining <= 15 && secondsRemaining > 0;
  const isTimeExpired = secondsRemaining === 0;

  // Format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Re-sound referee whistle to get team's attention
  const handleReplayWhistle = (e) => {
    e.stopPropagation();
    soundEffectsService.playTimeoutAlertSound(teamCalling);
  };

  const handleToggleTimerDuration = (duration) => {
    setTotalSeconds(duration);
    setSecondsRemaining(duration);
    setIsTimerRunning(true);
  };

  return (
    <div
      className="remote-timeout-fullscreen-backdrop"
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 10, 24, 0.90)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(max(env(safe-area-inset-top, 0px), 20px) + 0.5rem) 1rem calc(max(env(safe-area-inset-bottom, 0px), 20px) + 0.5rem) 1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="timeout-overlay-title"
    >
      {/* Centered Modal Card */}
      <div
        className="remote-timeout-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(8, 14, 28, 0.99) 100%)',
          border: `2px solid ${isUs ? 'rgba(245, 158, 11, 0.7)' : 'rgba(239, 68, 68, 0.7)'}`,
          borderRadius: '24px',
          boxShadow: isUs
            ? '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 60px rgba(245, 158, 11, 0.35)'
            : '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 60px rgba(239, 68, 68, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Header Strip */}
        <div
          style={{
            padding: '1rem 1.4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isUs
              ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, transparent 100%)'
              : 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isUs ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                border: `1.5px solid ${isUs ? '#fbbf24' : '#f87171'}`,
                color: isUs ? '#fbbf24' : '#f87171'
              }}
            >
              <Clock size={18} />
            </span>

            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isUs ? '#fbbf24' : '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>⏱️ Live Device Sync Alert</span>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isUs ? '#f59e0b' : '#ef4444',
                    boxShadow: `0 0 8px ${isUs ? '#f59e0b' : '#ef4444'}`,
                    display: 'inline-block'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                Official Timeout Called
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Whistle sound button */}
            <button
              type="button"
              onClick={handleReplayWhistle}
              title="Sound Referee Whistle"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '999px',
                padding: '0.35rem 0.65rem',
                color: '#cbd5e1',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Volume2 size={13} color="#fbbf24" />
              <span>Whistle</span>
            </button>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss Alert"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.2rem 1.4rem' }}>
          {/* Main Title & Caller Attribution */}
          <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <h2
              id="timeout-overlay-title"
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{isUs ? '⏱️ Timeout Called by Our Team' : `⏱️ Timeout Called for ${opponentName}`}</span>
            </h2>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                fontSize: '0.78rem',
                color: '#93c5fd',
                fontWeight: 700
              }}
            >
              <User size={13} />
              <span>Triggered on sideline by: <strong>{callerName}</strong></span>
            </div>
          </div>

          {/* Match Scoreboard at Time of Timeout */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '0.9rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.2rem'
            }}
          >
            {/* Our Squad Score */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase' }}>
                Our Squad
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
                {ourScore}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                {ourTimeoutsRemaining} TOs left
              </div>
            </div>

            {/* Set Divider */}
            <div style={{ textAlign: 'center', padding: '0 0.8rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Set {setNumber}
              </span>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                vs
              </div>
            </div>

            {/* Opponent Score */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>
                {opponentName}
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
                {opponentScore}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                {opponentTimeoutsRemaining} TOs left
              </div>
            </div>
          </div>

          {/* Interactive Huddle Countdown Clock */}
          <div
            style={{
              background: isWarningZone
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(245, 158, 11, 0.08)',
              border: `1.5px solid ${isWarningZone ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.3)'}`,
              borderRadius: '18px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1.2rem',
              position: 'relative',
              transition: 'all 0.3s'
            }}
          >
            {/* Duration Selector Tabs: 60s vs 30s */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '0.8rem' }}>
              <button
                type="button"
                onClick={() => handleToggleTimerDuration(60)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  border: 'none',
                  background: totalSeconds === 60 ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)',
                  color: totalSeconds === 60 ? '#1e293b' : '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                60s Full Match Timeout
              </button>
              <button
                type="button"
                onClick={() => handleToggleTimerDuration(30)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  border: 'none',
                  background: totalSeconds === 30 ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)',
                  color: totalSeconds === 30 ? '#1e293b' : '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                30s Quick Huddle
              </button>
            </div>

            {/* Countdown Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Circular SVG Ring */}
              <div style={{ position: 'relative', width: '74px', height: '74px' }}>
                <svg width="74" height="74" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="37"
                    cy="37"
                    r="32"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="5"
                    fill="none"
                  />
                  <circle
                    cx="37"
                    cy="37"
                    r="32"
                    stroke={isWarningZone ? '#ef4444' : (isUs ? '#f59e0b' : '#f87171')}
                    strokeWidth="5"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="none"
                    style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    color: '#ffffff'
                  }}
                >
                  {secondsRemaining}s
                </div>
              </div>

              {/* Big Digits & Status */}
              <div>
                <div
                  style={{
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    fontVariantNumeric: 'tabular-nums',
                    color: isWarningZone ? '#fca5a5' : '#ffffff',
                    lineHeight: 1
                  }}
                >
                  {formatTime(secondsRemaining)}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isTimeExpired
                      ? '#ef4444'
                      : isWarningZone
                      ? '#f87171'
                      : '#fbbf24',
                    marginTop: '4px'
                  }}
                >
                  {isTimeExpired
                    ? '⌛ Timeout Expired — Resume Play!'
                    : isWarningZone
                    ? '⚠️ 15-Sec Warning: Break Huddle!'
                    : '⏱️ Team In Huddle'}
                </div>
              </div>

              {/* Pause / Play / Reset Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '6px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSecondsRemaining(totalSeconds);
                    setIsTimerRunning(true);
                  }}
                  title="Reset Timer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '6px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tactical Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            {onOpenWhiteboard && (
              <button
                type="button"
                onClick={() => {
                  onDismiss();
                  onOpenWhiteboard();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.75rem 0.9rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.35) 100%)',
                  border: '1.5px solid rgba(59, 130, 246, 0.5)',
                  borderRadius: '12px',
                  color: '#93c5fd',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <PenTool size={16} />
                <span>Tactical Whiteboard</span>
              </button>
            )}

            {onOpenGeminiCoach && (
              <button
                type="button"
                onClick={() => {
                  onDismiss();
                  onOpenGeminiCoach(`We just called a timeout in Set ${setNumber}. The score is US ${ourScore} - ${opponentScore} ${opponentName}. What tactical speech, lineup matchup advice, and adjustments should I give the team during this 60-second huddle?`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.75rem 0.9rem',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(147, 51, 234, 0.35) 100%)',
                  border: '1.5px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '12px',
                  color: '#e9d5ff',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <Sparkles size={16} />
                <span>AI Huddle Advice</span>
              </button>
            )}
          </div>

          {/* Full-width Acknowledge / Dismiss Button */}
          <button
            type="button"
            onClick={onDismiss}
            style={{
              width: '100%',
              marginTop: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#0f172a',
              fontSize: '0.88rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
            }}
          >
            <span>Acknowledge & Return to Match</span>
          </button>
        </div>
      </div>
    </div>
  );
}
