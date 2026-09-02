import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  ChevronRight,
  ChevronLeft,
  Volleyball,
  Repeat,
  Sparkles,
  Info
} from 'lucide-react';

export default function DrillAnimationPlayer({ drill }) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  const animationData = drill?.animationData || {
    courtType: 'half',
    phases: []
  };

  const phases = animationData.phases || [];
  const currentPhase = phases[currentPhaseIndex] || phases[0];
  const timerRef = useRef(null);

  // Auto-advance phases when playing
  useEffect(() => {
    if (!isPlaying || phases.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const duration = (currentPhase?.duration || 2500) / speedMultiplier;

    timerRef.current = setTimeout(() => {
      setCurrentPhaseIndex((prev) => {
        if (prev < phases.length - 1) {
          return prev + 1;
        } else if (isLooping) {
          return 0;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentPhaseIndex, speedMultiplier, isLooping, phases.length]);

  // Reset phase when drill changes
  useEffect(() => {
    setCurrentPhaseIndex(0);
    setIsPlaying(true);
  }, [drill?.id]);

  if (!drill || phases.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        No animation data available for this drill.
      </div>
    );
  }

  const isFullCourt = animationData.courtType === 'full';

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #0b1329 0%, #060b18 100%)',
        border: '1.5px solid rgba(59, 130, 246, 0.35)',
        borderRadius: '20px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}
    >
      {/* =========================================================================
          TOP PHASE SELECTOR STRIP
         ========================================================================= */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={16} color="#fbbf24" />
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#f8fafc' }}>
            2D Interactive Drill Demonstration
          </span>
        </div>

        {/* Phase Pills */}
        <div style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {phases.map((ph, idx) => {
            const isCur = idx === currentPhaseIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentPhaseIndex(idx);
                  setIsPlaying(false);
                }}
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: isCur ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isCur ? 'rgba(59, 130, 246, 0.35)' : 'rgba(255, 255, 255, 0.03)',
                  color: isCur ? '#93c5fd' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Step {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2D ANIMATED VOLLEYBALL COURT (SVG & CANVAS ENGINE)
         ========================================================================= */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: isFullCourt ? '1.4 / 1' : '1.7 / 1',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '14px',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {/* Court Wood Flooring Fill */}
          <rect x="5" y="5" width="90" height="90" fill="#1e293b" rx="4" />

          {/* Court Boundary Lines (Sidelines & Endlines) */}
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            fill="rgba(59, 130, 246, 0.04)"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.8"
          />

          {isFullCourt ? (
            <>
              {/* Full Court: Net at Center Line (y = 50) */}
              <line x1="8" y1="50" x2="92" y2="50" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,1" />
              {/* Net Top Band Glow */}
              <line x1="8" y1="50" x2="92" y2="50" stroke="#ffffff" strokeWidth="0.8" />
              {/* Net Antenna Markers */}
              <circle cx="10" cy="50" r="1.5" fill="#ef4444" />
              <circle cx="90" cy="50" r="1.5" fill="#ef4444" />

              {/* Side A Attack Line (10ft line at y = 65) */}
              <line x1="10" y1="65" x2="90" y2="65" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3,2" strokeOpacity="0.6" />
              {/* Side B Attack Line (10ft line at y = 35) */}
              <line x1="10" y1="35" x2="90" y2="35" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3,2" strokeOpacity="0.6" />

              {/* Side Labels */}
              <text x="50" y="8" fill="#93c5fd" fontSize="3" fontWeight="900" textAnchor="middle" opacity="0.6">SIDE B (OPPONENT / SERVE)</text>
              <text x="50" y="96" fill="#6ee7b7" fontSize="3" fontWeight="900" textAnchor="middle" opacity="0.6">SIDE A (OUR TEAM)</text>
            </>
          ) : (
            <>
              {/* Half Court: Net at Top (y = 15) */}
              <line x1="8" y1="15" x2="92" y2="15" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="2,1" />
              <line x1="8" y1="15" x2="92" y2="15" stroke="#ffffff" strokeWidth="1" />
              <circle cx="10" cy="15" r="1.8" fill="#ef4444" />
              <circle cx="90" cy="15" r="1.8" fill="#ef4444" />

              {/* 10ft Attack Line at y = 45 */}
              <line x1="10" y1="45" x2="90" y2="45" stroke="#ffffff" strokeWidth="0.9" strokeDasharray="3,2" strokeOpacity="0.7" />
              <text x="50" y="11" fill="#f59e0b" fontSize="3.2" fontWeight="900" textAnchor="middle">━━━━ NET (ATTACK ZONE) ━━━━</text>
              <text x="85" y="44" fill="#cbd5e1" fontSize="2.5" fontWeight="700" textAnchor="end" opacity="0.5">10FT ATTACK LINE</text>
            </>
          )}

          {/* Animated Ball Trajectory Line (If arc from previous spot) */}
          {currentPhase?.ball?.arc && currentPhase.ball.from && (
            <path
              d={`M ${currentPhase.ball.from.x} ${currentPhase.ball.from.y} Q ${(currentPhase.ball.from.x + currentPhase.ball.x) / 2} ${Math.min(currentPhase.ball.from.y, currentPhase.ball.y) - 12} ${currentPhase.ball.x} ${currentPhase.ball.y}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.2"
              strokeDasharray="2,2"
              strokeOpacity="0.8"
            />
          )}

          {/* Target Mats / Zones */}
          {currentPhase?.annotations?.map((ann, aIdx) => (
            <g key={aIdx} transform={`translate(${ann.x}, ${ann.y})`}>
              <rect x="-10" y="-3.5" width="20" height="7" rx="3" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" strokeWidth="0.5" />
              <text x="0" y="1.2" fill="#fef3c7" fontSize="2.2" fontWeight="800" textAnchor="middle">
                {ann.text}
              </text>
            </g>
          ))}

          {/* Animated Players */}
          {currentPhase?.players?.map((player) => (
            <g
              key={player.id}
              style={{
                transition: `all ${(currentPhase.duration || 2000) / (speedMultiplier * 1000)}s cubic-bezier(0.25, 1, 0.5, 1)`
              }}
              transform={`translate(${player.x}, ${player.y})`}
            >
              {/* Player Glow Circle */}
              <circle
                cx="0"
                cy="0"
                r="4.8"
                fill={player.color || '#3b82f6'}
                stroke="#ffffff"
                strokeWidth="0.8"
                style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.6))' }}
              />
              {/* Player Label */}
              <text
                x="0"
                y="1.2"
                fill="#ffffff"
                fontSize="2.6"
                fontWeight="900"
                textAnchor="middle"
              >
                {player.label}
              </text>
              {/* Role Subtitle below avatar */}
              <text
                x="0"
                y="7"
                fill="#cbd5e1"
                fontSize="1.9"
                fontWeight="700"
                textAnchor="middle"
                opacity="0.85"
              >
                {player.role}
              </text>
            </g>
          ))}

          {/* Animated Volleyball */}
          {currentPhase?.ball && currentPhase.ball.visible && (
            <g
              style={{
                transition: `all ${(currentPhase.duration || 2000) / (speedMultiplier * 1000)}s cubic-bezier(0.25, 1, 0.5, 1)`
              }}
              transform={`translate(${currentPhase.ball.x}, ${currentPhase.ball.y})`}
            >
              <circle cx="0" cy="0" r="3.2" fill="#ffffff" stroke="#f59e0b" strokeWidth="0.8" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.8))' }} />
              <circle cx="0" cy="0" r="1.5" fill="#3b82f6" />
            </g>
          )}
        </svg>

        {/* Live Step Watermark in Corner */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '0.15rem 0.5rem',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#a7f3d0'
          }}
        >
          Phase {currentPhaseIndex + 1} of {phases.length}
        </div>
      </div>

      {/* =========================================================================
          PHASE COACHING EXPLANATION BANNER
         ========================================================================= */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '10px',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa',
            flexShrink: 0
          }}
        >
          <Info size={15} />
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
            {currentPhase?.name}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '0.1rem' }}>
            {currentPhase?.description}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PLAYBACK CONTROLS (PLAY / PAUSE / STEP / SPEED / LOOP)
         ========================================================================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Left: Play/Pause & Step Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCurrentPhaseIndex((prev) => Math.max(0, prev - 1));
              setIsPlaying(false);
            }}
            disabled={currentPhaseIndex === 0}
            style={{ padding: '0.35rem 0.6rem' }}
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? '#ef4444' : 'linear-gradient(135deg, #10b981, #059669)',
              borderColor: isPlaying ? '#ef4444' : '#10b981',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.85rem'
            }}
          >
            {isPlaying ? (
              <>
                <Pause size={14} fill="currentColor" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCurrentPhaseIndex((prev) => Math.min(phases.length - 1, prev + 1));
              setIsPlaying(false);
            }}
            disabled={currentPhaseIndex === phases.length - 1}
            style={{ padding: '0.35rem 0.6rem' }}
            title="Next Step"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Speed & Loop Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Speed Selector */}
          {[0.5, 1, 1.5].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setSpeedMultiplier(spd)}
              style={{
                padding: '0.2rem 0.45rem',
                borderRadius: '6px',
                border: speedMultiplier === spd ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                background: speedMultiplier === spd ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                color: speedMultiplier === spd ? '#93c5fd' : '#94a3b8',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {spd}x
            </button>
          ))}

          {/* Loop Button */}
          <button
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              border: isLooping ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
              background: isLooping ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              color: isLooping ? '#6ee7b7' : '#64748b',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer'
            }}
            title={isLooping ? 'Auto-Loop is ON' : 'Loop is OFF'}
          >
            <Repeat size={12} />
            <span>Loop</span>
          </button>
        </div>
      </div>
    </div>
  );
}
