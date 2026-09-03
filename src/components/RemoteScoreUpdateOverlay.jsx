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
  Clock
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
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    } else if (pointWonBy === 'undo') {
      // Revert blip (E5 -> C5)
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(523.25, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    } else {
      // Soft notice tone
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(392, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  } catch (e) {
    // Non-critical audio
  }
}

export default function RemoteScoreUpdateOverlay({
  scoreEvent,
  onDismiss,
  autoDismissSeconds = 6
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
    ? 'rgba(245, 158, 11, 0.6)'
    : isUsPoint
    ? 'rgba(16, 185, 129, 0.6)'
    : 'rgba(239, 68, 68, 0.6)';

  const glowShadow = isUndo
    ? '0 0 25px rgba(245, 158, 11, 0.25)'
    : isUsPoint
    ? '0 0 25px rgba(16, 185, 129, 0.3)'
    : '0 0 25px rgba(239, 68, 68, 0.3)';

  // Build user-friendly action description
  const getActionSummary = () => {
    if (isUndo) {
      return {
        title: 'Point Undone / Reverted',
        desc: details.description || 'Co-coach undid the previous point.',
        icon: <RotateCcw size={16} color="#f59e0b" />
      };
    }

    if (isUsPoint) {
      if (details.earnedTypeName) {
        let playerStr = '';
        if (details.earnedPlayerName) {
          playerStr = `by ${details.earnedPlayerNumber ? `#${details.earnedPlayerNumber} ` : ''}${details.earnedPlayerName}`;
        }
        return {
          title: `+1 Point (US) • ${details.earnedTypeName}`,
          desc: playerStr ? `${details.earnedTypeName} ${playerStr}` : `Point awarded to our team`,
          icon: <Volleyball size={16} color="#10b981" />
        };
      }
      return {
        title: '+1 Point for Our Team (US)',
        desc: 'Direct point recorded by co-coach.',
        icon: <Volleyball size={16} color="#10b981" />
      };
    }

    if (isOppPoint) {
      if (details.errorTypeName) {
        let playerStr = '';
        if (details.errorPlayerName) {
          playerStr = `(${details.errorPlayerNumber ? `#${details.errorPlayerNumber} ` : ''}${details.errorPlayerName})`;
        }
        return {
          title: `+1 Point (${details.opponentName || 'OPP'})`,
          desc: `${details.errorTypeName} ${playerStr}`,
          icon: <Shield size={16} color="#ef4444" />
        };
      }
      return {
        title: `+1 Point (${details.opponentName || 'Opponent'})`,
        desc: 'Point awarded to opponent.',
        icon: <Shield size={16} color="#ef4444" />
      };
    }

    return {
      title: 'Score Updated',
      desc: 'Score adjusted by co-coach.',
      icon: <CheckCircle size={16} color="#60a5fa" />
    };
  };

  const action = getActionSummary();
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / autoDismissSeconds) * 100));

  return (
    <div
      className="remote-score-overlay"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '460px',
        zIndex: 1500,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(2, 6, 23, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: '16px',
        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.7), ${glowShadow}`,
        overflow: 'hidden',
        animation: 'slideDownBounce 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ padding: '0.85rem 1rem' }}>
        {/* Top Header: Coach Name & Dismiss button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 900,
                boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)'
              }}
            >
              <User size={13} />
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>
              Score entered by <strong style={{ color: '#60a5fa' }}>{scorer.name || 'Co-Coach'}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
              {Math.ceil(timeLeft)}s
            </span>
            <button
              type="button"
              onClick={onDismiss}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: '6px',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Live Score Display Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}
        >
          {/* US Score Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                US (Team)
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: isUsPoint ? '#34d399' : '#f8fafc', lineHeight: 1.1 }}>
                {newScore.ourScore ?? 0}
              </div>
            </div>
            {isUsPoint && (
              <span
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '0.15rem 0.4rem',
                  borderRadius: '999px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)'
                }}
              >
                +1 POINT
              </span>
            )}
          </div>

          {/* Center VS & Set Number */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b' }}>
              SET {newScore.setNumber || 1}
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#475569' }}>:</div>
          </div>

          {/* OPP Score Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: 'row-reverse' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                {details.opponentName || 'Opponent'}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: isOppPoint ? '#f87171' : '#f8fafc', lineHeight: 1.1 }}>
                {newScore.opponentScore ?? 0}
              </div>
            </div>
            {isOppPoint && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '0.15rem 0.4rem',
                  borderRadius: '999px',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)'
                }}
              >
                +1 POINT
              </span>
            )}
          </div>
        </div>

        {/* Action Detail & Play Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              background: isUsPoint ? 'rgba(16, 185, 129, 0.2)' : isOppPoint ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {action.icon}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: accentColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {action.title}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {action.desc}
            </div>
          </div>

          {details.rotation && (
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#93c5fd',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                flexShrink: 0
              }}
            >
              Rot #{details.rotation}
            </span>
          )}
        </div>

        {/* Anti-Duplicate Notice Banner */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            padding: '0.35rem 0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
            <AlertTriangle size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fef3c7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Synced in real-time. Do not enter this point twice!
            </span>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              padding: '0.2rem 0.55rem',
              fontSize: '0.7rem',
              fontWeight: 900,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            Got It
          </button>
        </div>
      </div>

      {/* Auto-Dismiss Animated Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '3px',
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
  );
}
