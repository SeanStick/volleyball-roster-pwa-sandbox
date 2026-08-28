import React, { useRef, useState, useCallback } from 'react';
import { Volleyball, ArrowUpRight, Shield } from 'lucide-react';

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
  showTacticalArrows = true
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
    if (!activeDragRole || !courtRef.current) return;

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
  }, [activeDragRole, dragOffset, positions, onPositionsChange]);

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

        {/* Volleyball Net (Top boundary) */}
        <div className="hardwood-net-line">
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
        {showTacticalArrows && arrows && arrows.length > 0 && (
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

        {/* Draggable Circular Player Tokens */}
        {Object.entries(positions).map(([role, token]) => {
          const player = getPlayerForToken(token, role);
          const isDragging = activeDragRole === role;
          const isLibero = (player && (player.position === 'Libero' || player.isLibero)) || role === 'L';
          const isSetter = (player && player.position === 'Setter') || role === 'S';
          const displayRole = getRoleAbbrev(player, role);

          return (
            <div
              key={role}
              className={`tactical-player-token ${isDragging ? 'is-dragging' : ''} ${isLibero ? 'is-libero' : ''} ${isSetter ? 'is-setter' : ''}`}
              style={{
                left: `${token.x}%`,
                top: `${token.y}%`,
                touchAction: 'none'
              }}
              onPointerDown={(e) => handlePointerDown(e, role)}
              title={`Drag to reposition ${player?.name || token.name || role} (Zone ${token.zone || ''})`}
            >
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
        <span style={{ color: 'var(--accent-orange)' }}>💡 Live Lineup Sync:</span> Player circles show the exact names & numbers from your active court lineup. Drag circles to adjust player positioning.
      </div>
    </div>
  );
}
