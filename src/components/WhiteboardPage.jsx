import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MousePointer,
  PenTool,
  ArrowRight,
  Circle,
  Eraser,
  Trash2,
  Undo2,
  Redo2,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Users,
  Dumbbell,
  ArrowLeft,
  Download,
  Bookmark,
  Sparkles,
  Layers,
  ChevronRight,
  Footprints,
  Shield,
  Target,
  Maximize2,
  Minimize2,
  RefreshCw,
  Volleyball
} from 'lucide-react';
import { ZONE_LABELS } from '../services/volleyballRules';
import '../styles/whiteboard.css';

// Default Court Zone Coordinates (Normalized 0-100%)
// Half-court view (Net is at TOP y=0%, Baseline at BOTTOM y=100%)
const BASE_ZONE_COORDS_HALF = {
  pos1: { x: 80, y: 80 }, // Back Right (Serving)
  pos6: { x: 50, y: 82 }, // Back Middle
  pos5: { x: 20, y: 80 }, // Back Left
  pos4: { x: 20, y: 28 }, // Front Left (Outside Hitter)
  pos3: { x: 50, y: 24 }, // Front Middle (Middle Blocker)
  pos2: { x: 80, y: 28 }  // Front Right (Opposite/Setter)
};

// Full-court view (Net at CENTER y=50%)
const BASE_ZONE_COORDS_FULL = {
  pos1: { x: 80, y: 88 },
  pos6: { x: 50, y: 90 },
  pos5: { x: 20, y: 88 },
  pos4: { x: 20, y: 62 },
  pos3: { x: 50, y: 58 },
  pos2: { x: 80, y: 62 }
};

const COLOR_PALETTE = [
  { name: 'Cyan', hex: '#00f5ff' },
  { name: 'Yellow', hex: '#fde047' },
  { name: 'Coral', hex: '#ff6b35' },
  { name: 'Lime', hex: '#10b981' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Magenta', hex: '#f43f5e' }
];

const PLAYBOOK_PRESETS = [
  {
    id: 'rot1-receive-stack',
    title: 'Rot 1: Serve Receive Stack (Setter in Z1)',
    description: 'Setter hides in Z1 corner, OH1 and Opposite stack at net while Libero & OH2 pass.',
    courtType: 'half',
    players: {
      pos1: { x: 88, y: 78, label: 'S1' },
      pos6: { x: 50, y: 75, label: 'L' },
      pos5: { x: 22, y: 72, label: 'OH2' },
      pos4: { x: 20, y: 35, label: 'OH1' },
      pos3: { x: 45, y: 22, label: 'MB1' },
      pos2: { x: 75, y: 30, label: 'OPP' }
    }
  },
  {
    id: 'middle-slide-combo',
    title: 'Middle Slide & Pin Cross Combination',
    description: 'MB fakes 1-tempo quick in middle while Right-Side runs behind setter for a slide attack.',
    courtType: 'half',
    players: {
      pos1: { x: 70, y: 80, label: 'Def' },
      pos6: { x: 50, y: 82, label: 'L' },
      pos5: { x: 25, y: 80, label: 'OH' },
      pos4: { x: 18, y: 22, label: 'OH' },
      pos3: { x: 48, y: 18, label: 'MB (Slide)' },
      pos2: { x: 68, y: 20, label: 'S' }
    }
  },
  {
    id: 'perimeter-defense',
    title: 'Perimeter Defense Transition',
    description: 'Base-to-Read transition defense against an opponent outside hitter attack.',
    courtType: 'half',
    players: {
      pos1: { x: 82, y: 72, label: 'Z1 Line' },
      pos6: { x: 50, y: 86, label: 'Z6 Deep' },
      pos5: { x: 22, y: 68, label: 'Z5 Cross' },
      pos4: { x: 30, y: 30, label: 'Off-Block' },
      pos3: { x: 68, y: 15, label: 'MB Block' },
      pos2: { x: 85, y: 15, label: 'Right Block' }
    }
  }
];

export default function WhiteboardPage({
  lineup = {},
  roster = [],
  rotation = 1,
  teamSettings = {},
  onBack,
  onNavigateToDrills
}) {
  const [courtType, setCourtType] = useState('half'); // 'half' | 'full'
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'pen' | 'arrow' | 'dashed' | 'zone' | 'eraser'
  const [activeColor, setActiveColor] = useState('#00f5ff');
  const [strokeWidth, setStrokeWidth] = useState(3.5);

  // Tactical On-Court Players State
  const [courtPlayers, setCourtPlayers] = useState(() => {
    const coords = BASE_ZONE_COORDS_HALF;
    return Object.entries(coords).map(([zoneKey, pos]) => {
      const playerId = lineup[zoneKey];
      const p = roster.find((player) => player.id === playerId) || {
        id: `mock-${zoneKey}`,
        name: ZONE_LABELS[zoneKey]?.label || zoneKey,
        number: ZONE_LABELS[zoneKey]?.num || zoneKey.replace('pos', ''),
        position: 'Player'
      };
      return {
        id: zoneKey,
        zoneKey,
        zoneNum: ZONE_LABELS[zoneKey]?.num || zoneKey,
        x: pos.x,
        y: pos.y,
        name: p.name,
        number: p.number,
        position: p.position,
        isLibero: p.position === 'Libero' || p.isLibero,
        playerId: p.id
      };
    });
  });

  // Tactical Objects on Court (Volleyballs, Cones, Blockers, Opponents)
  const [tacticalItems, setTacticalItems] = useState([
    { id: 'ball-1', type: 'volleyball', x: 50, y: 50, label: 'Ball' }
  ]);

  // Freehand Drawing Lines & Paths
  const [drawings, setDrawings] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(null);

  // Selected Token for Dragging
  const [draggedToken, setDraggedToken] = useState(null); // { type: 'player'|'item', id, offsetX, offsetY }

  // Bench Substitution Drawer
  const [isBenchOpen, setIsBenchOpen] = useState(false);
  const [selectedSubPlayer, setSelectedSubPlayer] = useState(null);

  // Movement Tracking & Playback Recording
  const [isTrackingMovement, setIsTrackingMovement] = useState(false);
  const [movementRecordings, setMovementRecordings] = useState({}); // { [tokenId]: [ {x, y, t} ] }
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0); // 0 to 1
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const canvasRef = useRef(null);
  const courtContainerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Bench players (players in roster not on court)
  const onCourtPlayerIds = courtPlayers.map((cp) => cp.playerId);
  const benchPlayers = roster.filter((p) => !onCourtPlayerIds.includes(p.id));

  // Reset Players to Base Rotation Coordinates
  const handleResetLineup = useCallback(() => {
    const coords = courtType === 'half' ? BASE_ZONE_COORDS_HALF : BASE_ZONE_COORDS_FULL;
    setCourtPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        x: coords[p.zoneKey]?.x || p.x,
        y: coords[p.zoneKey]?.y || p.y
      }))
    );
    setMovementRecordings({});
    setIsPlayingAnimation(false);
  }, [courtType]);

  // Load a Playbook Preset
  const handleLoadPreset = (preset) => {
    setCourtType(preset.courtType || 'half');
    setCourtPlayers((prev) =>
      prev.map((p) => {
        const target = preset.players[p.zoneKey];
        return {
          ...p,
          x: target?.x ?? p.x,
          y: target?.y ?? p.y
        };
      })
    );
    setDrawings([]);
    setMovementRecordings({});
    setIsPlayingAnimation(false);
  };

  // Substitute Player on Court
  const handlePerformSub = (zoneKey, newPlayer) => {
    setCourtPlayers((prev) =>
      prev.map((cp) => {
        if (cp.zoneKey === zoneKey) {
          return {
            ...cp,
            name: newPlayer.name,
            number: newPlayer.number,
            position: newPlayer.position,
            isLibero: newPlayer.position === 'Libero' || newPlayer.isLibero,
            playerId: newPlayer.id
          };
        }
        return cp;
      })
    );
    setSelectedSubPlayer(null);
  };

  // Add Tactical Item to Court
  const handleAddTacticalItem = (type) => {
    const id = `${type}-${Date.now()}`;
    let label = 'Item';
    if (type === 'volleyball') label = 'Ball';
    if (type === 'cone') label = 'Target';
    if (type === 'blocker') label = 'Block';
    if (type === 'opponent') label = 'Opp';

    setTacticalItems((prev) => [
      ...prev,
      { id, type, x: 50 + (Math.random() * 20 - 10), y: 45 + (Math.random() * 20 - 10), label }
    ]);
  };

  // Remove Item
  const handleRemoveItem = (id, e) => {
    if (e) e.stopPropagation();
    setTacticalItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Canvas Coordinate Normalization (0% - 100%)
  const getNormalizedCoords = (e) => {
    if (!courtContainerRef.current) return { x: 50, y: 50 };
    const rect = courtContainerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  // -------------------------------------------------------------
  // Pointer & Touch Event Handlers (Canvas & Dragging)
  // -------------------------------------------------------------
  const handlePointerDown = (e) => {
    if (activeTool === 'select') return;

    e.preventDefault();
    const { x, y } = getNormalizedCoords(e);
    setIsDrawing(true);
    setCurrentStroke({
      tool: activeTool,
      color: activeColor,
      width: strokeWidth,
      points: [{ x, y }]
    });
  };

  const handlePointerMove = (e) => {
    // 1. Handle Dragging Player or Tactical Item
    if (draggedToken) {
      e.preventDefault();
      const { x, y } = getNormalizedCoords(e);

      if (draggedToken.type === 'player') {
        setCourtPlayers((prev) =>
          prev.map((p) => (p.id === draggedToken.id ? { ...p, x, y } : p))
        );
      } else if (draggedToken.type === 'item') {
        setTacticalItems((prev) =>
          prev.map((item) => (item.id === draggedToken.id ? { ...item, x, y } : item))
        );
      }

      // Record Movement if Tracking is active
      if (isTrackingMovement) {
        setMovementRecordings((prev) => {
          const trail = prev[draggedToken.id] || [];
          return {
            ...prev,
            [draggedToken.id]: [...trail, { x, y, t: Date.now() }]
          };
        });
      }
      return;
    }

    // 2. Handle Freehand Drawing
    if (isDrawing && currentStroke) {
      e.preventDefault();
      const { x, y } = getNormalizedCoords(e);
      setCurrentStroke((prev) => ({
        ...prev,
        points: [...prev.points, { x, y }]
      }));
    }
  };

  const handlePointerUp = () => {
    if (draggedToken) {
      setDraggedToken(null);
    }
    if (isDrawing && currentStroke) {
      setDrawings((prev) => [...prev, currentStroke]);
      setRedoStack([]);
      setCurrentStroke(null);
      setIsDrawing(false);
    }
  };

  // Undo / Redo / Clear
  const handleUndo = () => {
    if (drawings.length === 0) return;
    const last = drawings[drawings.length - 1];
    setDrawings((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setDrawings((prev) => [...prev, last]);
  };

  const handleClearDrawings = () => {
    setDrawings([]);
    setRedoStack([]);
  };

  // -------------------------------------------------------------
  // Animated Playback Engine
  // -------------------------------------------------------------
  const handleTogglePlayback = () => {
    if (isPlayingAnimation) {
      setIsPlayingAnimation(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    } else {
      setIsPlayingAnimation(true);
      const startTime = performance.now();
      const duration = 3000 / playbackSpeed;

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / duration);
        setAnimationProgress(progress);

        // Interpolate recorded paths
        Object.entries(movementRecordings).forEach(([tokenId, trail]) => {
          if (trail.length > 1) {
            const index = Math.min(trail.length - 1, Math.floor(progress * (trail.length - 1)));
            const targetPos = trail[index];
            if (targetPos) {
              setCourtPlayers((prev) =>
                prev.map((p) => (p.id === tokenId ? { ...p, x: targetPos.x, y: targetPos.y } : p))
              );
              setTacticalItems((prev) =>
                prev.map((item) => (item.id === tokenId ? { ...item, x: targetPos.x, y: targetPos.y } : item))
              );
            }
          }
        });

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setIsPlayingAnimation(false);
          setAnimationProgress(1);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  return (
    <div className="whiteboard-container">
      {/* =========================================================================
          1. COACHING SUITE HEADER & NAVIGATION SWITCHER
         ========================================================================= */}
      <div className="coaching-suite-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 18px rgba(59, 130, 246, 0.45)',
              flexShrink: 0
            }}
          >
            <PenTool size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
              Tactical Volleyball Whiteboard
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#93c5fd', margin: '0.1rem 0 0 0', fontWeight: 700 }}>
              Live lineup positioning, movement recording, bench substitutions & tactical chalkboard
            </p>
          </div>
        </div>

        {/* Coaching Suite Navigation Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="coaching-nav-pills">
            <button
              type="button"
              className="coaching-nav-pill active"
              title="Tactical Chalkboard"
            >
              <PenTool size={15} />
              <span>Whiteboard</span>
            </button>

            {onNavigateToDrills && (
              <button
                type="button"
                className="coaching-nav-pill"
                onClick={onNavigateToDrills}
                title="Volleyball Drills Lab"
              >
                <Dumbbell size={15} />
                <span>Drills Lab</span>
              </button>
            )}
          </div>

          {onBack && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onBack}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <ArrowLeft size={15} />
              <span>Back to Team</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. MAIN TWO-COLUMN WORKSPACE
         ========================================================================= */}
      <div className="whiteboard-main-layout">
        {/* -----------------------------------------------------------------
            LEFT COLUMN: INTERACTIVE TACTICAL COURT & DRAWING CANVAS
           ----------------------------------------------------------------- */}
        <div className="whiteboard-stage-card">
          {/* Top Primary Drawing Toolbar */}
          <div className="whiteboard-toolbar">
            {/* Tool Selection Group */}
            <div className="tool-btn-group">
              <button
                type="button"
                className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`}
                onClick={() => setActiveTool('select')}
                title="Select and Move Players / Items"
              >
                <MousePointer size={15} />
                <span>Move</span>
              </button>

              <button
                type="button"
                className={`tool-btn ${activeTool === 'pen' ? 'active' : ''}`}
                onClick={() => setActiveTool('pen')}
                title="Freehand Draw"
              >
                <PenTool size={15} />
                <span>Pen</span>
              </button>

              <button
                type="button"
                className={`tool-btn ${activeTool === 'arrow' ? 'active' : ''}`}
                onClick={() => setActiveTool('arrow')}
                title="Attack / Running Arrow"
              >
                <ArrowRight size={15} />
                <span>Arrow</span>
              </button>

              <button
                type="button"
                className={`tool-btn ${activeTool === 'zone' ? 'active' : ''}`}
                onClick={() => setActiveTool('zone')}
                title="Zone / Area Circle"
              >
                <Circle size={15} />
                <span>Zone</span>
              </button>

              <button
                type="button"
                className={`tool-btn ${activeTool === 'eraser' ? 'active' : ''}`}
                onClick={() => setActiveTool('eraser')}
                title="Eraser Tool"
              >
                <Eraser size={15} />
                <span>Eraser</span>
              </button>
            </div>

            {/* Color Swatches */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  className={`color-swatch ${activeColor === c.hex ? 'active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => setActiveColor(c.hex)}
                  title={c.name}
                />
              ))}
            </div>

            {/* History & Clear Tools */}
            <div className="tool-btn-group">
              <button
                type="button"
                className="tool-btn"
                onClick={handleUndo}
                disabled={drawings.length === 0}
                title="Undo Draw"
              >
                <Undo2 size={15} />
              </button>

              <button
                type="button"
                className="tool-btn"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                title="Redo Draw"
              >
                <Redo2 size={15} />
              </button>

              <button
                type="button"
                className="tool-btn danger"
                onClick={handleClearDrawings}
                title="Clear All Drawings"
              >
                <Trash2 size={15} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* SVG Court & Tactical Interaction Stage */}
          <div
            ref={courtContainerRef}
            className={`whiteboard-court-wrapper ${courtType === 'full' ? 'full-court' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* SVG Base Court Vector Graphics */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {/* Floor Fill Gradient */}
              <defs>
                <linearGradient id="wbFloor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill={activeColor} />
                </marker>
              </defs>

              <rect x="0" y="0" width="100" height="100" fill="url(#wbFloor)" />

              {/* Court Boundary Lines */}
              <rect x="5" y="5" width="90" height="90" fill="none" stroke="#ffffff" strokeWidth="1.2" />

              {/* Center Net & Attack Lines */}
              {courtType === 'half' ? (
                <>
                  {/* Top Net Tape (y=5) */}
                  <line x1="2" y1="5" x2="98" y2="5" stroke="#f8fafc" strokeWidth="3" />
                  <line x1="2" y1="5" x2="98" y2="5" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                  {/* 10ft Attack Line (3m = 35% from net) */}
                  <line x1="5" y1="35" x2="95" y2="35" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="2,2" />
                  <text x="8" y="33" fill="#93c5fd" fontSize="2.5" fontWeight="bold">10ft Attack Line</text>
                </>
              ) : (
                <>
                  {/* Full Court Center Net (y=50) */}
                  <line x1="2" y1="50" x2="98" y2="50" stroke="#f8fafc" strokeWidth="3.5" />
                  <line x1="5" y1="30" x2="95" y2="30" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="2,2" />
                  <line x1="5" y1="70" x2="95" y2="70" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="2,2" />
                </>
              )}

              {/* Movement Recording Trajectory Lines */}
              {Object.entries(movementRecordings).map(([tokenId, trail]) => {
                if (!trail || trail.length < 2) return null;
                const pathD = trail.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
                return (
                  <path
                    key={tokenId}
                    d={pathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3,2"
                    markerEnd="url(#arrowHead)"
                    opacity="0.8"
                  />
                );
              })}

              {/* Freehand Drawn Strokes Layer */}
              {drawings.map((stroke, idx) => {
                if (!stroke.points || stroke.points.length < 2) return null;
                if (stroke.tool === 'zone') {
                  const p1 = stroke.points[0];
                  const pLast = stroke.points[stroke.points.length - 1];
                  const rx = Math.abs(pLast.x - p1.x);
                  const ry = Math.abs(pLast.y - p1.y);
                  return (
                    <ellipse
                      key={idx}
                      cx={p1.x}
                      cy={p1.y}
                      rx={rx || 8}
                      ry={ry || 8}
                      fill={`${stroke.color}25`}
                      stroke={stroke.color}
                      strokeWidth="1.5"
                    />
                  );
                }

                const pathD = stroke.points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
                return (
                  <path
                    key={idx}
                    d={pathD}
                    fill="none"
                    stroke={stroke.color}
                    strokeWidth={stroke.width || 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={stroke.tool === 'dashed' ? '4,3' : 'none'}
                    markerEnd={stroke.tool === 'arrow' ? 'url(#arrowHead)' : 'none'}
                  />
                );
              })}

              {/* Current in-progress stroke */}
              {currentStroke && currentStroke.points && currentStroke.points.length > 1 && (
                <path
                  d={currentStroke.points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')}
                  fill="none"
                  stroke={currentStroke.color}
                  strokeWidth={currentStroke.width || 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={currentStroke.tool === 'dashed' ? '4,3' : 'none'}
                />
              )}
            </svg>

            {/* Draggable On-Court Players Layer */}
            {courtPlayers.map((player) => {
              const isSelected = selectedSubPlayer && selectedSubPlayer.zoneKey === player.zoneKey;

              return (
                <div
                  key={player.id}
                  onPointerDown={(e) => {
                    if (activeTool !== 'select') return;
                    e.stopPropagation();
                    setDraggedToken({ type: 'player', id: player.id });
                  }}
                  onClick={() => {
                    if (selectedSubPlayer) {
                      handlePerformSub(player.zoneKey, selectedSubPlayer);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${player.x}%`,
                    top: `${player.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: player.isLibero
                      ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: isSelected ? '3px solid #10b981' : '2px solid #ffffff',
                    color: player.isLibero ? '#1e293b' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6)',
                    cursor: activeTool === 'select' ? 'grab' : 'crosshair',
                    zIndex: 20,
                    userSelect: 'none',
                    touchAction: 'none',
                    transition: isPlayingAnimation ? 'none' : 'transform 0.05s ease'
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, lineHeight: 1 }}>
                    #{player.number}
                  </div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, whiteSpace: 'nowrap', maxWidth: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {player.name.split(' ')[0]}
                  </div>

                  {/* Floating Zone Tag */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#0f172a',
                      color: '#93c5fd',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '999px',
                      padding: '0.05rem 0.3rem',
                      fontSize: '0.62rem',
                      fontWeight: 800
                    }}
                  >
                    Z{player.zoneNum}
                  </div>
                </div>
              );
            })}

            {/* Draggable Tactical Elements (Balls, Cones, Blockers, Opponents) */}
            {tacticalItems.map((item) => (
              <div
                key={item.id}
                onPointerDown={(e) => {
                  if (activeTool !== 'select') return;
                  e.stopPropagation();
                  setDraggedToken({ type: 'item', id: item.id });
                }}
                style={{
                  position: 'absolute',
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: activeTool === 'select' ? 'grab' : 'crosshair',
                  zIndex: 25,
                  userSelect: 'none',
                  touchAction: 'none'
                }}
              >
                {item.type === 'volleyball' && (
                  <div style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
                    🏐
                  </div>
                )}
                {item.type === 'cone' && (
                  <div style={{ fontSize: '1.7rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
                    🎯
                  </div>
                )}
                {item.type === 'blocker' && (
                  <div style={{ background: '#dc2626', color: '#ffffff', borderRadius: '6px', padding: '0.15rem 0.45rem', fontWeight: 900, fontSize: '0.72rem', border: '1.5px solid #ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    🧱 BLOCK
                  </div>
                )}
                {item.type === 'opponent' && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ef4444', border: '2px solid #ffffff', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', boxShadow: '0 4px 10px rgba(0,0,0,0.6)' }}>
                    OPP
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Movement Tracking & Animated Playback Bar */}
          <div className="tracking-playback-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsTrackingMovement(!isTrackingMovement)}
                style={{
                  background: isTrackingMovement ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
                  border: isTrackingMovement ? '1.5px solid #f87171' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '999px',
                  padding: '0.35rem 0.85rem',
                  color: isTrackingMovement ? '#ffffff' : '#cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: isTrackingMovement ? '#ffffff' : '#f87171' }} />
                <span>{isTrackingMovement ? 'Recording Movement...' : 'Track Movement'}</span>
              </button>

              <button
                type="button"
                className="tool-btn"
                onClick={handleTogglePlayback}
                style={{ background: isPlayingAnimation ? '#10b981' : 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981', color: isPlayingAnimation ? '#090e1a' : '#34d399' }}
              >
                {isPlayingAnimation ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlayingAnimation ? 'Pause' : 'Play Movement'}</span>
              </button>
            </div>

            {/* Playback Speed Multiplier */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Speed:</span>
              {[0.5, 1, 1.5].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  style={{
                    background: playbackSpeed === spd ? '#3b82f6' : 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.2rem 0.45rem',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            RIGHT COLUMN: BENCH SUBS, EQUIPMENT STAGING & PLAYBOOK PRESETS
           ----------------------------------------------------------------- */}
        <div className="whiteboard-sidebar">
          {/* Court View Mode & Rotation Controls */}
          <div className="whiteboard-card-panel">
            <div className="whiteboard-panel-title">
              <span>Court View & Rotation</span>
              <button
                type="button"
                className="tool-btn"
                onClick={handleResetLineup}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                title="Snap players back to base positions"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`tool-btn ${courtType === 'half' ? 'active' : ''}`}
                onClick={() => {
                  setCourtType('half');
                  handleResetLineup();
                }}
                style={{ justifyContent: 'center' }}
              >
                Half Court (Offense)
              </button>

              <button
                type="button"
                className={`tool-btn ${courtType === 'full' ? 'active' : ''}`}
                onClick={() => {
                  setCourtType('full');
                  handleResetLineup();
                }}
                style={{ justifyContent: 'center' }}
              >
                Full Court (6v6)
              </button>
            </div>
          </div>

          {/* Draggable Tactical Equipment Staging */}
          <div className="whiteboard-card-panel">
            <div className="whiteboard-panel-title">
              <span>Add Tactical Elements</span>
            </div>

            <div className="staging-elements-grid">
              <div className="staging-element-item" onClick={() => handleAddTacticalItem('volleyball')}>
                <span style={{ fontSize: '1.4rem' }}>🏐</span>
                <span>Volleyball</span>
              </div>

              <div className="staging-element-item" onClick={() => handleAddTacticalItem('cone')}>
                <span style={{ fontSize: '1.4rem' }}>🎯</span>
                <span>Target</span>
              </div>

              <div className="staging-element-item" onClick={() => handleAddTacticalItem('blocker')}>
                <span style={{ fontSize: '1.4rem' }}>🧱</span>
                <span>Blocker</span>
              </div>

              <div className="staging-element-item" onClick={() => handleAddTacticalItem('opponent')}>
                <span style={{ fontSize: '1.4rem' }}>🤾</span>
                <span>Opponent</span>
              </div>
            </div>
          </div>

          {/* Bench Substitution Drawer */}
          <div className="whiteboard-card-panel">
            <div className="whiteboard-panel-title">
              <span>Bench Substitutions</span>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>
                {benchPlayers.length} Available
              </span>
            </div>

            {selectedSubPlayer && (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '8px', padding: '0.45rem', fontSize: '0.74rem', color: '#a7f3d0', textAlign: 'center' }}>
                Tap an on-court player to sub in <strong>#{selectedSubPlayer.number} {selectedSubPlayer.name}</strong>
              </div>
            )}

            <div className="bench-players-list">
              {benchPlayers.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', padding: '0.75rem' }}>
                  All roster players are currently on the court.
                </div>
              ) : (
                benchPlayers.map((p) => {
                  const isPicked = selectedSubPlayer?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      className="bench-player-row"
                      style={{ borderColor: isPicked ? '#10b981' : 'rgba(255, 255, 255, 0.08)' }}
                      onClick={() => setSelectedSubPlayer(isPicked ? null : p)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <div className="jersey-badge-sm" style={{ width: '22px', height: '22px', fontSize: '0.72rem' }}>
                          #{p.number}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#f8fafc' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                            {p.position}
                          </div>
                        </div>
                      </div>

                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isPicked ? '#10b981' : '#60a5fa' }}>
                        {isPicked ? 'Selected' : 'Sub In'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Tactical Playbook Presets */}
          <div className="whiteboard-card-panel">
            <div className="whiteboard-panel-title">
              <span>Playbook Presets</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {PLAYBOOK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="bench-player-row"
                  onClick={() => handleLoadPreset(preset)}
                  style={{ textAlign: 'left', width: '100%' }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>
                      {preset.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>
                      {preset.description}
                    </div>
                  </div>
                  <ChevronRight size={14} color="#60a5fa" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
