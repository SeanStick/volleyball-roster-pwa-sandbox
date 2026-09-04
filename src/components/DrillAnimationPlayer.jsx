import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  ChevronRight,
  ChevronLeft,
  Repeat,
  Sparkles,
  Info,
  Sliders,
  Maximize2
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
  const transitionDuration = (currentPhase?.duration || 2200) / (speedMultiplier * 1000);
  const ballHeight = currentPhase?.ball?.height || 1.5;

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #0d1527 0%, #060a14 100%)',
        border: '1.5px solid rgba(59, 130, 246, 0.4)',
        borderRadius: '20px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.75), 0 0 25px rgba(59, 130, 246, 0.15)',
        overflow: 'hidden'
      }}
    >
      {/* =========================================================================
          TOP PHASE SELECTOR STRIP
         ========================================================================= */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.2px' }}>
            2D Life-Like Drill Movement
          </span>
        </div>

        {/* Phase Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
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
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px',
                  border: isCur ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isCur ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(37, 99, 235, 0.5))' : 'rgba(255, 255, 255, 0.04)',
                  color: isCur ? '#ffffff' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isCur ? '0 0 12px rgba(59, 130, 246, 0.5)' : 'none'
                }}
              >
                Step {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2D ANIMATED VOLLEYBALL COURT (SMOOTH VECTORS, 3D SHADOWS & ACTION BADGES)
         ========================================================================= */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: isFullCourt ? '1.4 / 1' : '1.7 / 1',
          background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.85)'
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
          {/* Defs for gradients & arrow markers */}
          <defs>
            <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#60a5fa" />
            </marker>
            <marker id="arrow-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#fb923c" />
            </marker>
            <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#34d399" />
            </marker>
            <radialGradient id="ball-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Court Wood Flooring Fill with subtle court shine */}
          <rect x="5" y="5" width="90" height="90" fill="#1e293b" rx="4" />

          {/* Court Grid Texture Lines */}
          <line x1="30" y1="10" x2="30" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="70" y1="10" x2="70" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

          {/* Court Boundary Lines (Sidelines & Endlines) */}
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            fill="rgba(59, 130, 246, 0.05)"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />

          {isFullCourt ? (
            <>
              {/* Full Court: Net at Center Line (y = 50) */}
              <line x1="6" y1="50" x2="94" y2="50" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="2,1" />
              <line x1="6" y1="50" x2="94" y2="50" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="10" cy="50" r="1.6" fill="#ef4444" />
              <circle cx="90" cy="50" r="1.6" fill="#ef4444" />

              {/* Side A Attack Line (10ft line at y = 65) */}
              <line x1="10" y1="65" x2="90" y2="65" stroke="#ffffff" strokeWidth="0.9" strokeDasharray="3,2" strokeOpacity="0.6" />
              {/* Side B Attack Line (10ft line at y = 35) */}
              <line x1="10" y1="35" x2="90" y2="35" stroke="#ffffff" strokeWidth="0.9" strokeDasharray="3,2" strokeOpacity="0.6" />

              {/* Side Labels */}
              <text x="50" y="8" fill="#93c5fd" fontSize="2.8" fontWeight="900" textAnchor="middle" opacity="0.6">SIDE B (OPPONENT / SERVE)</text>
              <text x="50" y="96" fill="#6ee7b7" fontSize="2.8" fontWeight="900" textAnchor="middle" opacity="0.6">SIDE A (OUR TEAM)</text>
            </>
          ) : (
            <>
              {/* Half Court: Net at Top (y = 15) */}
              <line x1="6" y1="15" x2="94" y2="15" stroke="#f59e0b" strokeWidth="3" strokeDasharray="2,1" />
              <line x1="6" y1="15" x2="94" y2="15" stroke="#ffffff" strokeWidth="1" />
              <circle cx="10" cy="15" r="1.8" fill="#ef4444" />
              <circle cx="90" cy="15" r="1.8" fill="#ef4444" />

              {/* 10ft Attack Line at y = 45 */}
              <line x1="10" y1="45" x2="90" y2="45" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.75" />
              <text x="50" y="11" fill="#f59e0b" fontSize="3.2" fontWeight="900" textAnchor="middle">━━━━ NET (ATTACK ZONE) ━━━━</text>
              <text x="88" y="44" fill="#cbd5e1" fontSize="2.4" fontWeight="800" textAnchor="end" opacity="0.6">10FT ATTACK LINE</text>
            </>
          )}

          {/* Dynamic Player Movement Paths (Dashed vectors showing where players run) */}
          {currentPhase?.players?.map((player) => {
            if (!player.path || player.path.length < 2) return null;
            const start = player.path[0];
            const end = player.path[1];
            return (
              <g key={`path-${player.id}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={player.color || '#60a5fa'}
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                  strokeOpacity="0.7"
                  markerEnd="url(#arrow-blue)"
                />
              </g>
            );
          })}

          {/* Animated Ball Trajectory Line (Parabolic Flight Path) */}
          {currentPhase?.ball?.arc && currentPhase.ball.from && (
            <path
              d={`M ${currentPhase.ball.from.x} ${currentPhase.ball.from.y} Q ${(currentPhase.ball.from.x + currentPhase.ball.x) / 2} ${Math.min(currentPhase.ball.from.y, currentPhase.ball.y) - 14} ${currentPhase.ball.x} ${currentPhase.ball.y}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.4"
              strokeDasharray="2.5,2.5"
              strokeOpacity="0.9"
            />
          )}

          {/* Target Mats / Zones / Cones */}
          {currentPhase?.annotations?.map((ann, aIdx) => (
            <g key={aIdx} transform={`translate(${ann.x}, ${ann.y})`}>
              <rect
                x="-12"
                y="-4"
                width="24"
                height="8"
                rx="4"
                fill="rgba(15, 23, 42, 0.9)"
                stroke="#f59e0b"
                strokeWidth="0.6"
                style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.6))' }}
              />
              <text x="0" y="1.2" fill="#fef3c7" fontSize="2.2" fontWeight="800" textAnchor="middle">
                {ann.text}
              </text>
            </g>
          ))}

          {/* =========================================================================
              ANIMATED PLAYERS WITH LIFE-LIKE EASING & ACTION BADGES
             ========================================================================= */}
          {currentPhase?.players?.map((player) => (
            <g
              key={player.id}
              style={{
                transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1)`
              }}
              transform={`translate(${player.x}, ${player.y})`}
            >
              {/* Player Ground Shadow */}
              <ellipse cx="0" cy="4" rx="4.2" ry="1.8" fill="rgba(0,0,0,0.5)" />

              {/* Player Outer Glow Circle */}
              <circle
                cx="0"
                cy="0"
                r="4.8"
                fill={player.color || '#3b82f6'}
                stroke="#ffffff"
                strokeWidth="0.9"
                style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.7))' }}
              />

              {/* Player Jersey Number / Position */}
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

              {/* Floating Action Status Badge above Player */}
              {player.action && (
                <g transform="translate(0, -6.8)">
                  <rect
                    x="-9"
                    y="-2.5"
                    width="18"
                    height="5"
                    rx="2.5"
                    fill="rgba(15, 23, 42, 0.92)"
                    stroke={player.color || '#3b82f6'}
                    strokeWidth="0.5"
                  />
                  <text
                    x="0"
                    y="1"
                    fill="#ffffff"
                    fontSize="1.9"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {player.action}
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* =========================================================================
              3D ANIMATED VOLLEYBALL WITH REALISTIC FLOOR SHADOW
             ========================================================================= */}
          {currentPhase?.ball && currentPhase.ball.visible && (
            <g
              style={{
                transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1)`
              }}
              transform={`translate(${currentPhase.ball.x}, ${currentPhase.ball.y})`}
            >
              {/* Ball 3D Floor Shadow (scales with height) */}
              <ellipse
                cx="0"
                cy={ballHeight * 3.5}
                rx={Math.max(1.5, 4.5 - ballHeight)}
                ry={Math.max(0.8, 2.2 - ballHeight * 0.4)}
                fill="url(#ball-shadow)"
                opacity={Math.max(0.3, 0.8 - ballHeight * 0.15)}
              />

              {/* Volleyball Sphere */}
              <circle
                cx="0"
                cy={-ballHeight * 2}
                r="3.2"
                fill="#ffffff"
                stroke="#f59e0b"
                strokeWidth="0.8"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }}
              />
              <circle cx="0" cy={-ballHeight * 2} r="1.4" fill="#3b82f6" />
              <path
                d={`M -2.2 ${-ballHeight * 2} A 2.2 2.2 0 0 1 2.2 ${-ballHeight * 2}`}
                stroke="#f59e0b"
                strokeWidth="0.5"
                fill="none"
              />
            </g>
          )}
        </svg>

        {/* Live Step Watermark in Corner */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            padding: '0.15rem 0.55rem',
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
          border: '1px solid rgba(59, 130, 246, 0.35)',
          borderRadius: '12px',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.25)',
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
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>
            {currentPhase?.name}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '0.1rem' }}>
            {currentPhase?.description}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PLAYBACK & TIMELINE CONTROLS (PLAY / PAUSE / STEP / SPEED / LOOP)
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
