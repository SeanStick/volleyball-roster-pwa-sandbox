import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volleyball,
  User,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  Sparkles,
  Layers,
  Clock,
  Flame,
  ArrowRight
} from 'lucide-react';

/**
 * Gentle Web Audio chime for real-time score alert
 */
function playScoreChime(pointWonBy = 'us') {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (pointWonBy === 'us') {
      // Cheerful ascending chime (C5 -> E5 -> G5)
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    } else if (pointWonBy === 'undo') {
      // Revert blip (E5 -> C5)
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(523.25, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    } else {
      // Soft notice tone
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(392, now + 0.12);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {
    // Non-critical audio
  }
}

export default function RemoteScoreUpdateOverlay({
  scoreEvent,
  onDismiss,
  autoDismissSeconds = 15
}) {
  const [timeLeft, setTimeLeft] = useState(autoDismissSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const audioPlayedRef = useRef(null);

  // Play audio chime once when a new event arrives
  useEffect(() => {
    if (scoreEvent?.id && audioPlayedRef.current !== scoreEvent.id) {
      audioPlayedRef.current = scoreEvent.id;
      playScoreChime(scoreEvent.pointWonBy);
      setTimeLeft(autoDismissSeconds);
    }
  }, [scoreEvent, autoDismissSeconds]);

  // Countdown timer with pause on hover/touch
  useEffect(() => {
    if (!scoreEvent || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [scoreEvent, isPaused, onDismiss]);

  if (!scoreEvent) return null;

  const {
    pointWonBy = 'us',
    isUndo = false,
    newScore = {},
    scorer = {},
    details = {},
    timestamp
  } = scoreEvent;

  const isUsPoint = pointWonBy === 'us';
  const isOppPoint = pointWonBy === 'opponent';

  // Determine theme colors based on rally outcome
  const accentColor = isUndo
    ? '#f59e0b'
    : isUsPoint
    ? '#10b981'
    : '#ef4444';

  const borderColor = isUndo
    ? 'rgba(245, 158, 11, 0.7)'
    : isUsPoint
    ? 'rgba(16, 185, 129, 0.7)'
    : 'rgba(239, 68, 68, 0.7)';

  const glowShadow = isUndo
    ? '0 0 60px rgba(245, 158, 11, 0.35)'
    : isUsPoint
    ? '0 0 60px rgba(16, 185, 129, 0.4)'
    : '0 0 60px rgba(239, 68, 68, 0.4)';

  // Build user-friendly action description
  const getActionSummary = () => {
    if (isUndo) {
      return {
        badge: 'POINT UNDONE',
        title: 'Score Reverted / Undone',
        desc: details.description || 'Previous rally point was removed by co-coach.',
        icon: <RotateCcw size={26} color="#f59e0b" />
      };
    }

    if (isUsPoint) {
      if (details.earnedTypeName) {
        let playerStr = '';
        if (details.earnedPlayerName) {
          playerStr = `by ${details.earnedPlayerNumber ? `#${details.earnedPlayerNumber} ` : ''}${details.earnedPlayerName}`;
        }
        return {
          badge: '+1 POINT FOR US',
          title: details.earnedTypeName,
          desc: playerStr ? `${details.earnedTypeName} ${playerStr}` : 'Point awarded to our team',
          icon: <Volleyball size={26} color="#10b981" />
        };
      }
      return {
        badge: '+1 POINT FOR US',
        title: 'Point for Our Team (US)',
        desc: 'Direct point recorded by co-coach.',
        icon: <Volleyball size={26} color="#10b981" />
      };
    }

    if (isOppPoint) {
      if (details.errorTypeName) {
        let playerStr = '';
        if (details.errorPlayerName) {
          playerStr = `(${details.errorPlayerNumber ? `#${details.errorPlayerNumber} ` : ''}${details.errorPlayerName})`;
        }
        return {
          badge: `+1 POINT FOR ${details.opponentName || 'OPP'}`,
          title: details.errorTypeName,
          desc: `${details.errorTypeName} ${playerStr}`,
          icon: <Shield size={26} color="#ef4444" />
        };
      }
      return {
        badge: `+1 POINT FOR ${details.opponentName || 'OPPONENT'}`,
        title: `Point for ${details.opponentName || 'Opponent'}`,
        desc: 'Point awarded to opponent.',
        icon: <Shield size={26} color="#ef4444" />
      };
    }

    return {
      badge: 'SCORE ADJUSTMENT',
      title: 'Score Updated',
      desc: 'Score adjusted by co-coach.',
      icon: <CheckCircle size={26} color="#60a5fa" />
    };
  };

  const action = getActionSummary();
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / autoDismissSeconds) * 100));

  return (
    <div
      className="remote-score-fullscreen-backdrop"
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(7, 11, 22, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(max(env(safe-area-inset-top, 0px), 24px) + 0.5rem) 1rem calc(max(env(safe-area-inset-bottom, 0px), 24px) + 0.5rem) 1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {/* Centered Large Alert Card */}
      <div
        className="remote-score-fullscreen-card"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(3, 7, 18, 0.99) 100%)',
          border: `2px solid ${borderColor}`,
          borderRadius: '24px',
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.85), ${glowShadow}`,
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
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)'
              }}
            >
              <User size={18} />
            </div>

            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.2px' }}>
                Score Entered by <strong style={{ color: '#60a5fa' }}>{scorer.name || 'Co-Coach'}</strong>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Synced live across all co-coaches
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94a3b8',
              borderRadius: '10px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            title="Dismiss popup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.5rem 1.4rem' }}>
          {/* HUGE STADIUM SCOREBOARD DISPLAY */}
          <div
            style={{
              background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginBottom: '1.25rem',
              position: 'relative'
            }}
          >
            {/* US Score Box */}
            <div style={{ textAlign: 'center', minWidth: '120px' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: '#94a3b8',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem'
                }}
              >
                US (TEAM)
              </div>
              <div
                style={{
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  color: isUsPoint ? '#34d399' : '#f8fafc',
                  lineHeight: 1,
                  fontFamily: 'var(--font-display)',
                  textShadow: isUsPoint ? '0 0 25px rgba(52, 211, 153, 0.6)' : 'none'
                }}
              >
                {newScore.ourScore ?? 0}
              </div>
              {isUsPoint && (
                <div
                  style={{
                    display: 'inline-block',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.6)',
                    marginTop: '0.4rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  +1 POINT
                </div>
              )}
            </div>

            {/* Divider / Set Label */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  color: '#60a5fa',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '8px',
                  letterSpacing: '0.5px'
                }}
              >
                SET {newScore.setNumber || 1}
              </div>
              <div
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: '#475569',
                  marginTop: '0.35rem'
                }}
              >
                VS
              </div>
            </div>

            {/* OPP Score Box */}
            <div style={{ textAlign: 'center', minWidth: '120px' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: '#94a3b8',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '120px'
                }}
              >
                {details.opponentName || 'OPPONENT'}
              </div>
              <div
                style={{
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  color: isOppPoint ? '#f87171' : '#f8fafc',
                  lineHeight: 1,
                  fontFamily: 'var(--font-display)',
                  textShadow: isOppPoint ? '0 0 25px rgba(248, 113, 113, 0.6)' : 'none'
                }}
              >
                {newScore.opponentScore ?? 0}
              </div>
              {isOppPoint && (
                <div
                  style={{
                    display: 'inline-block',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.6)',
                    marginTop: '0.4rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  +1 POINT
                </div>
              )}
            </div>
          </div>

          {/* LARGE PLAY BREAKDOWN CARD */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${borderColor}`,
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: isUsPoint
                  ? 'rgba(16, 185, 129, 0.2)'
                  : isOppPoint
                  ? 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(245, 158, 11, 0.2)',
                border: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {action.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  color: accentColor,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                {action.badge}
              </div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginTop: '1px'
                }}
              >
                {action.title}
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#cbd5e1',
                  marginTop: '2px'
                }}
              >
                {action.desc}
              </div>
            </div>

            {details.rotation && (
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  flexShrink: 0
                }}
              >
                <div style={{ fontSize: '0.64rem', color: '#93c5fd', fontWeight: 800 }}>ROTATION</div>
                <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 900 }}>#{details.rotation}</div>
              </div>
            )}
          </div>

          {/* CRITICAL ANTI-DUPLICATE WARNING BANNER */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.22) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={18} color="#f59e0b" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#fef3c7' }}>
                DO NOT ENTER THIS POINT TWICE!
              </div>
              <div style={{ fontSize: '0.74rem', color: '#fde68a', marginTop: '1px', lineHeight: 1.3 }}>
                The scoreboard has already been updated in real-time by your co-coach.
              </div>
            </div>
          </div>

          {/* BIG "GOT IT" CONFIRMATION BUTTON */}
          <button
            type="button"
            onClick={onDismiss}
            style={{
              width: '100%',
              background: isUsPoint
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : isOppPoint
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              padding: '0.9rem',
              fontSize: '1rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: `0 6px 20px ${isUsPoint ? 'rgba(16, 185, 129, 0.4)' : isOppPoint ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              transition: 'transform 0.15s, opacity 0.15s'
            }}
          >
            <Check size={18} strokeWidth={3} />
            <span>GOT IT — RESUME GAME ({Math.ceil(timeLeft)}s)</span>
          </button>
        </div>

        {/* Animated Countdown Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: accentColor,
              transition: 'width 0.1s linear'
            }}
          />
        </div>
      </div>
    </div>
  );
}
