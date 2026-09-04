import React, { useRef, useState, useCallback } from 'react';
import { ArrowUpRight, Shield } from 'lucide-react';

export default function FormationCanvas({
  positions = {},
  arrows = [],
  roster = [],
  lineup = {},
  liberoExchanges = {},
  phase = 'receiving', // 'receiving' | 'serving'
  rotation = 1,
  onPositionsChange,
  onTokenClick,
  showTacticalArrows = true,
  // Animation props
  isAnimationActive = false,
  animationStage = null,
  playbackSpeed = 1,
  ball = null
}) {
  const courtRef = useRef(null);
  const [activeDragRole, setActiveDragRole] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Map tokens directly to active court lineup and roster
  const getPlayerForToken = (token, role) => {
    // 1. Direct lineup lookup by Zone (pos1..pos6)
    if (token && token.zone && lineup) {
      const zoneKey = `pos${token.zone}`;
      const occupantId = lineup[zoneKey];
      if (occupantId) {
        const p = roster.find(player => player.id === occupantId);
        if (p) return p;
      }
      const hasAnyAssigned = Object.values(lineup).some(Boolean);
      if (hasAnyAssigned) return null;
    }

    // 2. Fallback heuristic if entire lineup is unassigned
    const setters = roster.filter(p => p.position === 'Setter');
    const outsides = roster.filter(p => p.position === 'Outside Hitter');
    const middles = roster.filter(p => p.position === 'Middle Blocker');
    const opposites = roster.filter(p => p.position === 'Opposite Hitter' || p.position === 'Right Side');
    const liberos = roster.filter(p => p.position === 'Libero');

    if (role === 'S') return setters[0] || roster[0] || null;
    if (role === 'OH1') return outsides[0] || roster[1] || null;
    if (role === 'OH2') return outsides[1] || outsides[0] || roster[4] || null;
    if (role === 'MB1') return middles[0] || roster[2] || null;
    if (role === 'MB2') return middles[1] || middles[0] || roster[5] || null;
    if (role === 'OPP') return opposites[0] || roster[3] || null;
    if (role === 'L') return liberos[0] || middles[1] || roster[5] || null;
    return null;
  };

  const getLastName = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  const getRoleAbbrev = (player, defaultRole) => {
    if (!player) return defaultRole;
    if (player.position === 'Setter') return 'S';
    if (player.position === 'Libero' || player.isLibero) return 'L';
    if (player.position === 'Middle Blocker') return 'MB';
    if (player.position === 'Outside Hitter') return 'OH';
    if (player.position === 'Opposite Hitter' || player.position === 'Right Side') return 'OPP';
    if (player.position === 'Defensive Specialist') return 'DS';
    return defaultRole;
  };

  /**
   * Pointer Down (Mouse Click or Finger Touch)
   */
  const handlePointerDown = (e, role) => {
    if (isAnimationActive) return; // Prevent drag during animation playback

    e.preventDefault();
    e.stopPropagation();

    const court = courtRef.current;
    if (!court) return;

    const rect = court.getBoundingClientRect();
    const token = positions[role];
    if (!token) return;

    // Current token position in pixels
    const tokenPixelX = (token.x / 100) * rect.width;
    const tokenPixelY = (token.y / 100) * rect.height;

    // Mouse/touch position relative to court top-left
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    setActiveDragRole(role);
    setDragOffset({
      x: clientX - tokenPixelX,
      y: clientY - tokenPixelY
    });

    if (e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  /**
   * Pointer Move (Mouse Drag or Finger Slide)
   */
  const handlePointerMove = useCallback((e) => {
    if (!activeDragRole || !courtRef.current || isAnimationActive) return;

    const rect = courtRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left - dragOffset.x;
    const clientY = e.clientY - rect.top - dragOffset.y;

    // Constrain to court boundaries (with margin)
    const margin = 5; // 5% margin
    const newX = Math.max(margin, Math.min(100 - margin, (clientX / rect.width) * 100));
    const newY = Math.max(margin, Math.min(100 - margin, (clientY / rect.height) * 100));

    if (onPositionsChange) {
      onPositionsChange({
        ...positions,
        [activeDragRole]: {
          ...positions[activeDragRole],
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10
        }
      });
    }
  }, [activeDragRole, dragOffset, positions, onPositionsChange, isAnimationActive]);

  /**
   * Pointer Up (Release)
   */
  const handlePointerUp = useCallback((e) => {
    if (activeDragRole) {
      setActiveDragRole(null);
      if (e.target.releasePointerCapture) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (err) {
          // Ignore
        }
      }
    }
  }, [activeDragRole]);

  // Transition speed calculation
  const transitionDuration = `${0.55 / playbackSpeed}s`;

  return (
    <div className="formation-canvas-wrapper">
      {/* Court Floor Container */}
      <div
        ref={courtRef}
        className="hardwood-volleyball-floor"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Floor Sheen & Texture Overlay */}
        <div className="hardwood-sheen"></div>

        {/* Volleyball Net (Top boundary) with active flash ripple when ball is near */}
        <div className={`hardwood-net-line ${ball && ball.visible && ball.y < 10 && ball.y > -20 ? 'net-flash' : ''}`}>
          <div className="hardwood-net-mesh"></div>
          <div className="net-antenna antenna-left"></div>
          <div className="net-antenna antenna-right"></div>
          <span className="hardwood-net-label">
            {phase === 'serving' ? 'NET / OPPONENT RECEIVES' : 'NET / OPPONENT SERVES'}
          </span>
        </div>

        {/* 3-Meter / 10-Foot Attack Line */}
        <div className="hardwood-attack-line">
          <span className="hardwood-attack-label">3M / 10FT ATTACK LINE</span>
        </div>

        {/* Subdued Zone Markings on Hardwood */}
        <div className="hardwood-zone-guide zone-4">Z4</div>
        <div className="hardwood-zone-guide zone-3">Z3</div>
        <div className="hardwood-zone-guide zone-2">Z2</div>
        <div className="hardwood-zone-guide zone-5">Z5</div>
        <div className="hardwood-zone-guide zone-6">Z6</div>
        <div className="hardwood-zone-guide zone-1">Z1</div>

        {/* Tactical Vectors / Arrows (SVG Overlay) */}
        {showTacticalArrows && !isAnimationActive && arrows && arrows.length > 0 && (
          <svg className="tactical-arrows-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <marker
                id="arrowhead-blue"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
              </marker>
              <marker
                id="arrowhead-orange"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
              </marker>
            </defs>

            {arrows.map((arr, idx) => {
              const markerId = arr.color === '#f59e0b' ? 'url(#arrowhead-orange)' : 'url(#arrowhead-blue)';
              // Calculate curved path
              const midX = (arr.from.x + arr.to.x) / 2;
              const midY = (arr.from.y + arr.to.y) / 2 - 4;
              const pathData = `M ${arr.from.x} ${arr.from.y} Q ${midX} ${midY} ${arr.to.x} ${arr.to.y}`;

              return (
                <g key={idx}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={arr.color || '#38bdf8'}
                    strokeWidth="1.6"
                    strokeDasharray="3 2"
                    markerEnd={markerId}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}
                  />
                  {arr.label && (
                    <text
                      x={midX}
                      y={midY - 2}
                      fill={arr.color || '#38bdf8'}
                      fontSize="2.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                    >
                      {arr.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Animated 3D Volleyball with Shadow & Trajectory Arc */}
        {isAnimationActive && ball && ball.visible && (
          <div
            className="tactical-anim-ball-container"
            style={{
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              transition: `left ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1), top ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1)`
            }}
          >
            {/* Dynamic Drop Shadow on Hardwood Floor */}
            <div
              className="ball-floor-shadow"
              style={{
                opacity: ball.shadowOpacity !== undefined ? ball.shadowOpacity : 0.8,
                transform: `scale(${ball.scale ? ball.scale * 0.9 : 1})`
              }}
            />

            {/* Glowing 3D Volleyball Orb */}
            <div
              className="ball-orb-3d"
              style={{
                transform: `scale(${ball.scale || 1})`
              }}
            >
              <div className="ball-seam-horizontal" />
              <div className="ball-seam-vertical" />
              <div className="ball-glow-core" />
              <span className="ball-icon-emoji">🏐</span>
            </div>
          </div>
        )}

        {/* Circular Player Tokens */}
        {Object.entries(positions).map(([role, token]) => {
          const player = getPlayerForToken(token, role);
          const isDragging = activeDragRole === role;
          const isLibero = (player && (player.position === 'Libero' || player.isLibero)) || role === 'L';
          const isSetter = (player && player.position === 'Setter') || role === 'S';
          const displayRole = getRoleAbbrev(player, role);
          const actionText = token.action;

          return (
            <div
              key={role}
              className={`tactical-player-token ${isDragging ? 'is-dragging' : ''} ${isLibero ? 'is-libero' : ''} ${isSetter ? 'is-setter' : ''} ${isAnimationActive ? 'is-animating' : ''}`}
              style={{
                left: `${token.x}%`,
                top: `${token.y}%`,
                touchAction: 'none',
                transition: isAnimationActive
                  ? `left ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1), top ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1)`
                  : 'none'
              }}
              onPointerDown={(e) => handlePointerDown(e, role)}
              title={`${player?.name || token.name || role} (Zone ${token.zone || ''})`}
            >
              {/* Dynamic Action Tag in Animation Mode */}
              {isAnimationActive && actionText && (
                <div className="token-action-pill">
                  {actionText}
                </div>
              )}

              {/* Token Main Circle */}
              <div className="token-circle">
                <span className="token-role">{displayRole}</span>
                <span className="token-number">{player ? `#${player.number}` : `Z${token.zone}`}</span>
              </div>

              {/* Player Name Pill */}
              <div className="token-name-pill">
                {player ? getLastName(player.name) : (token.name || role)}
              </div>

              {/* Zone / Role Micro Badge */}
              <div className="token-sub-badge">
                Z{token.zone}
              </div>
            </div>
          );
        })}
      </div>

      {/* Canvas Footnote Instructions */}
      <div className="canvas-footnote">
        {isAnimationActive ? (
          <span style={{ color: '#38bdf8' }}>
            🎬 <strong>Rally Animation Active:</strong> Showing real-time player motion paths and ball flight. Use the controls above to step or scrub.
          </span>
        ) : (
          <span>
            <span style={{ color: 'var(--accent-orange)' }}>💡 Live Lineup Sync:</span> Player circles show the exact names & numbers from your active court lineup. Drag circles to adjust player positioning.
          </span>
        )}
      </div>
    </div>
  );
}
