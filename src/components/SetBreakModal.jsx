import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  RotateCcw,
  ArrowRight,
  Play,
  Pause,
  Clock,
  Shield,
  CheckCircle2,
  Users,
  Sparkles,
  Shuffle
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
import confetti from 'canvas-confetti';

export default function SetBreakModal({
  isOpen,
  onClose,
  completedSet,
  matchStats,
  roster = [],
  lineup = {},
  startingLineup = {},
  currentPhase = 'serve',
  onConfirmStartNextSet,
  onOpenMatchRecap
}) {
  // 3-Minute Interval Timer state (standard volleyball intermission)
  const [secondsRemaining, setSecondsRemaining] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Lineup choice for next set: 'same' or 'custom'
  const [lineupChoice, setLineupChoice] = useState('same');

  // Serve/Receive for next set: volleyball rules alternate unless deciding set
  const defaultNextPhase = currentPhase === 'serve' ? 'receive' : 'serve';
  const [nextSetPhase, setNextSetPhase] = useState(defaultNextPhase);

  // Check if this set ended the match (e.g. best of 3 won 2 sets)
  const ourSetsWon = matchStats?.ourSetsWon || 0;
  const oppSetsWon = matchStats?.opponentSetsWon || 0;
  const targetPoints = matchStats?.targetPoints || 25;
  const isDecidingSet = (matchStats?.setNumber || 1) >= 2 && ourSetsWon === oppSetsWon && ourSetsWon > 0;

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(180);
      setIsTimerRunning(false);
      setNextSetPhase(currentPhase === 'serve' ? 'receive' : 'serve');
      setLineupChoice('same');
    }
  }, [isOpen, currentPhase]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  if (!isOpen) return null;

  const currentSetNum = completedSet?.setNumber || matchStats?.setNumber || 1;
  const nextSetNum = currentSetNum + 1;
  const weWonSet = (completedSet?.ourScore || matchStats?.ourScore || 0) > (completedSet?.opponentScore || matchStats?.opponentScore || 0);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartNextSet = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.35 } });
    onConfirmStartNextSet({
      nextSetNumber: nextSetNum,
      nextPhase: nextSetPhase,
      useSameLineup: lineupChoice === 'same'
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1400,
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
          maxWidth: '520px',
          maxHeight: '92dvh',
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
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            background: weWonSet
              ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.3), rgba(30, 58, 138, 0.4))'
              : 'linear-gradient(90deg, rgba(239, 68, 68, 0.25), rgba(30, 58, 138, 0.4))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: weWonSet
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <Trophy size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                Set {currentSetNum} Intermission
              </div>
              <div style={{ fontSize: '0.78rem', color: weWonSet ? '#6ee7b7' : '#fcd34d', fontWeight: 700 }}>
                {weWonSet ? `🎉 Set ${currentSetNum} Won!` : `Set ${currentSetNum} Concluded`}
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

        {/* Scrollable Content */}
        <div style={{ padding: '1.15rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Set Score Banner */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Final Set {currentSetNum} Score
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 800 }}>US</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#ffffff', lineHeight: 1 }}>
                  {completedSet?.ourScore ?? matchStats?.ourScore ?? 0}
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#475569' }}>-</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 800 }}>
                  {matchStats?.opponentName || 'OPPONENT'}
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#ffffff', lineHeight: 1 }}>
                  {completedSet?.opponentScore ?? matchStats?.opponentScore ?? 0}
                </div>
              </div>
            </div>
          </div>

          {/* Side Switch & Rules Checklist */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25), rgba(59, 130, 246, 0.15))',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              borderRadius: '16px',
              padding: '0.85rem 1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#93c5fd', fontWeight: 800, fontSize: '0.85rem' }}>
              <Shuffle size={16} />
              <span>Court Side Switch & Rules Check</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div>• 🔄 <strong>Switch Sides:</strong> Teams switch court benches & sides for Set {nextSetNum}.</div>
              <div>• ⏱️ <strong>Timeouts:</strong> Reset to 2 per team for the new set.</div>
              <div>• 🔀 <strong>Substitutions:</strong> Counter resets to 0 / {matchStats?.maxSubs || 12}.</div>
            </div>
          </div>

          {/* Set 2 Serve / Receive Decision */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '0.85rem 1rem'
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Set {nextSetNum} First Service</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Standard rule: Alternates</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setNextSetPhase('serve')}
                style={{
                  padding: '0.65rem',
                  borderRadius: '12px',
                  border: nextSetPhase === 'serve' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: nextSetPhase === 'serve' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: nextSetPhase === 'serve' ? '#6ee7b7' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <VolleyballIcon size={15} color="#10b981" />
                <span>We Serve First</span>
              </button>

              <button
                type="button"
                onClick={() => setNextSetPhase('receive')}
                style={{
                  padding: '0.65rem',
                  borderRadius: '12px',
                  border: nextSetPhase === 'receive' ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: nextSetPhase === 'receive' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: nextSetPhase === 'receive' ? '#93c5fd' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <Shield size={15} color="#3b82f6" />
                <span>We Receive First</span>
              </button>
            </div>
          </div>

          {/* 3-Minute Interval Timer */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#60a5fa" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>Intermission Countdown</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>3:00 official interval</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: secondsRemaining <= 30 ? '#ef4444' : '#60a5fa' }}>
                {formatTimer(secondsRemaining)}
              </span>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                style={{
                  background: isTimerRunning ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                  border: isTimerRunning ? '1px solid #ef4444' : '1px solid #3b82f6',
                  borderRadius: '999px',
                  padding: '0.35rem 0.65rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div
          style={{
            padding: '0.9rem 1.25rem',
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          {onOpenMatchRecap && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMatchRecap();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.65rem 0.9rem',
                color: '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Match Final / Recap
            </button>
          )}

          <button
            type="button"
            onClick={handleStartNextSet}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)'
            }}
          >
            <span>Start Set {nextSetNum}</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
