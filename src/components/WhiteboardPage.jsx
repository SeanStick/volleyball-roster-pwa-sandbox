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
  RotateCw,
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
  Zap,
  Eye,
  EyeOff,
  Volleyball
} from 'lucide-react';
import { ZONE_LABELS, rotateLineupClockwise } from '../services/volleyballRules';
import '../styles/whiteboard.css';

// Default Court Zone Coordinates (Normalized 0-100%)
const BASE_ZONE_COORDS_HALF = {
  pos1: { x: 80, y: 80 },
  pos6: { x: 50, y: 82 },
  pos5: { x: 20, y: 80 },
  pos4: { x: 20, y: 28 },
  pos3: { x: 50, y: 24 },
  pos2: { x: 80, y: 28 }
};

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

// Tactical Rotation Coordinates & Transition Switch Targets (6-2 / Standard Volleyball System)
const ROTATION_TACTICAL_SPOTS = {
  1: {
    serving: {
      base: {
        pos1: { x: 82, y: 92 },
        pos2: { x: 22, y: 18 },
        pos3: { x: 50, y: 18 },
        pos4: { x: 80, y: 18 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 74 }
      },
      transition: {
        pos1: { x: 80, y: 72 },
        pos2: { x: 20, y: 22 },
        pos3: { x: 50, y: 20 },
        pos4: { x: 80, y: 22 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 76 }
      }
    },
    receiving: {
      base: {
        pos1: { x: 78, y: 46 },
        pos2: { x: 74, y: 70 },
        pos3: { x: 48, y: 15 },
        pos4: { x: 18, y: 24 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 48, y: 76 }
      },
      transition: {
        pos1: { x: 68, y: 12 },
        pos2: { x: 18, y: 22 },
        pos3: { x: 48, y: 20 },
        pos4: { x: 82, y: 20 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 75 }
      }
    }
  },
  2: {
    serving: {
      base: {
        pos1: { x: 82, y: 92 },
        pos2: { x: 50, y: 18 },
        pos3: { x: 80, y: 18 },
        pos4: { x: 22, y: 18 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 74 }
      },
      transition: {
        pos1: { x: 80, y: 72 },
        pos2: { x: 50, y: 20 },
        pos3: { x: 80, y: 22 },
        pos4: { x: 20, y: 22 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 76 }
      }
    },
    receiving: {
      base: {
        pos1: { x: 78, y: 72 },
        pos2: { x: 70, y: 20 },
        pos3: { x: 48, y: 20 },
        pos4: { x: 22, y: 68 },
        pos5: { x: 48, y: 76 },
        pos6: { x: 72, y: 46 }
      },
      transition: {
        pos1: { x: 80, y: 72 },
        pos2: { x: 50, y: 20 },
        pos3: { x: 82, y: 20 },
        pos4: { x: 18, y: 22 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 68, y: 12 }
      }
    }
  },
  3: {
    serving: {
      base: {
        pos1: { x: 82, y: 92 },
        pos2: { x: 80, y: 18 },
        pos3: { x: 22, y: 18 },
        pos4: { x: 50, y: 18 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 74 }
      },
      transition: {
        pos1: { x: 50, y: 76 },
        pos2: { x: 80, y: 22 },
        pos3: { x: 20, y: 22 },
        pos4: { x: 50, y: 20 },
        pos5: { x: 80, y: 72 },
        pos6: { x: 22, y: 72 }
      }
    },
    receiving: {
      base: {
        pos1: { x: 76, y: 72 },
        pos2: { x: 78, y: 22 },
        pos3: { x: 50, y: 70 },
        pos4: { x: 48, y: 20 },
        pos5: { x: 22, y: 46 },
        pos6: { x: 22, y: 72 }
      },
      transition: {
        pos1: { x: 50, y: 75 },
        pos2: { x: 82, y: 20 },
        pos3: { x: 18, y: 22 },
        pos4: { x: 50, y: 20 },
        pos5: { x: 68, y: 12 },
        pos6: { x: 22, y: 72 }
      }
    }
  },
  4: {
    serving: {
      base: {
        pos1: { x: 82, y: 92 },
        pos2: { x: 22, y: 18 },
        pos3: { x: 50, y: 18 },
        pos4: { x: 80, y: 18 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 74 }
      },
      transition: {
        pos1: { x: 80, y: 72 },
        pos2: { x: 20, y: 22 },
        pos3: { x: 50, y: 20 },
        pos4: { x: 80, y: 22 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 76 }
      }
    },
    receiving: {
      base: {
        pos1: { x: 78, y: 46 },
        pos2: { x: 74, y: 70 },
        pos3: { x: 48, y: 15 },
        pos4: { x: 18, y: 24 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 48, y: 76 }
      },
      transition: {
        pos1: { x: 68, y: 12 },
        pos2: { x: 18, y: 22 },
        pos3: { x: 48, y: 20 },
        pos4: { x: 82, y: 20 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 75 }
      }
    }
  },
  5: {
    serving: {
      base: {
        pos1: { x: 82, y: 92 },
        pos2: { x: 50, y: 18 },
        pos3: { x: 80, y: 18 },
        pos4: { x: 22, y: 18 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 74 }
      },
      transition: {
        pos1: { x: 80, y: 72 },
        pos2: { x: 50, y: 20 },
        pos3: { x: 80, y: 22 },
        pos4: { x: 20, y: 22 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 76 }
      }
    },
    receiving: {
      base: {
        pos1: { x: 78, y: 72 },
        pos2: { x: 70, y: 20 },
        pos3: { x: 48, y: 20 },
        pos4: { x: 22, y: 68 },
        pos5: { x: 48, y: 76 },
        pos6: { x: 72, y: 46 }
      },
      transition: {
        pos1: { x: 80, y: 72 },
        pos2: { x: 50, y: 20 },
        pos3: { x: 82, y: 20 },
        pos4: { x: 18, y: 22 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 68, y: 12 }
      }
    }
  },
  6: {
    serving: {
      base: {
        pos1: { x: 82, y: 92 },
        pos2: { x: 80, y: 18 },
        pos3: { x: 22, y: 18 },
        pos4: { x: 50, y: 18 },
        pos5: { x: 22, y: 72 },
        pos6: { x: 50, y: 74 }
      },
      transition: {
        pos1: { x: 50, y: 76 },
        pos2: { x: 80, y: 22 },
        pos3: { x: 20, y: 22 },
        pos4: { x: 50, y: 20 },
        pos5: { x: 80, y: 72 },
        pos6: { x: 22, y: 72 }
      }
    },
    receiving: {
      base: {
        pos1: { x: 76, y: 72 },
        pos2: { x: 78, y: 22 },
        pos3: { x: 50, y: 70 },
        pos4: { x: 48, y: 20 },
        pos5: { x: 22, y: 46 },
        pos6: { x: 22, y: 72 }
      },
      transition: {
        pos1: { x: 50, y: 75 },
        pos2: { x: 82, y: 20 },
        pos3: { x: 18, y: 22 },
        pos4: { x: 50, y: 20 },
        pos5: { x: 68, y: 12 },
        pos6: { x: 22, y: 72 }
      }
    }
  }
};

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

  // Rotation & Tactical Formation State
  const [selectedRotation, setSelectedRotation] = useState(rotation || 1);
  const [tacticalPhase, setTacticalPhase] = useState('receiving'); // 'serving' | 'receiving'
  const [isTransitionActive, setIsTransitionActive] = useState(false); // Toggle between Base vs Post-Serve/Receive Transition spot
  const [showTransitionPaths, setShowTransitionPaths] = useState(true); // Toggle to show directional transition movement arrows

  // Tactical On-Court Players State
  const [courtPlayers, setCourtPlayers] = useState(() => {
    const rotSpots = ROTATION_TACTICAL_SPOTS[rotation || 1]?.[tacticalPhase]?.base || BASE_ZONE_COORDS_HALF;
    return Object.entries(rotSpots).map(([zoneKey, pos]) => {
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
  const [draggedToken, setDraggedToken] = useState(null);

  // Bench Substitution Drawer
  const [selectedSubPlayer, setSelectedSubPlayer] = useState(null);

  // Movement Tracking & Playback Recording
  const [isTrackingMovement, setIsTrackingMovement] = useState(false);
  const [movementRecordings, setMovementRecordings] = useState({});
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const courtContainerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Bench players (players in roster not on court)
  const onCourtPlayerIds = courtPlayers.map((cp) => cp.playerId);
  const benchPlayers = roster.filter((p) => !onCourtPlayerIds.includes(p.id));

  // Current rotation tactical spot mapping
  const currentRotSpots = ROTATION_TACTICAL_SPOTS[selectedRotation] || ROTATION_TACTICAL_SPOTS[1];
  const currentPhaseSpots = currentRotSpots[tacticalPhase] || currentRotSpots.receiving;

  // Apply Rotation & Phase Suggested Coordinates
  const applyRotationFormation = useCallback((rotNum, phaseKey, isTransition) => {
    const rotObj = ROTATION_TACTICAL_SPOTS[rotNum] || ROTATION_TACTICAL_SPOTS[1];
    const phaseObj = rotObj[phaseKey] || rotObj.receiving;
    const targetCoords = isTransition ? phaseObj.transition : phaseObj.base;

    // Rotate player lineup to this rotation
    let rotLineup = { ...lineup };
    for (let i = 1; i < rotNum; i++) {
      rotLineup = rotateLineupClockwise(rotLineup);
    }

    setCourtPlayers((prev) =>
      prev.map((p) => {
        const zoneKey = p.zoneKey;
        const targetPos = targetCoords[zoneKey] || BASE_ZONE_COORDS_HALF[zoneKey];
        const playerId = rotLineup[zoneKey];
        const playerObj = roster.find((r) => r.id === playerId) || {
          name: p.name,
          number: p.number,
          position: p.position
        };

        return {
          ...p,
          x: targetPos.x,
          y: targetPos.y,
          name: playerObj.name,
          number: playerObj.number,
          position: playerObj.position,
          isLibero: playerObj.position === 'Libero' || playerObj.isLibero,
          playerId: playerObj.id || p.playerId
        };
      })
    );

    setIsPlayingAnimation(false);
  }, [lineup, roster]);

  // Handle Rotation Selection
  const handleSelectRotation = (rotNum) => {
    setSelectedRotation(rotNum);
    applyRotationFormation(rotNum, tacticalPhase, isTransitionActive);
  };

  // Handle Phase Selection (Serving vs Receiving)
  const handleSelectPhase = (phaseKey) => {
    setTacticalPhase(phaseKey);
    applyRotationFormation(selectedRotation, phaseKey, isTransitionActive);
  };

  // Handle Transition Toggle (Base vs Post-Serve/Receive Spot)
  const handleToggleTransition = () => {
    const nextState = !isTransitionActive;
    setIsTransitionActive(nextState);
    applyRotationFormation(selectedRotation, tacticalPhase, nextState);
  };

  // Reset Players
  const handleResetLineup = useCallback(() => {
    applyRotationFormation(selectedRotation, tacticalPhase, isTransitionActive);
    setMovementRecordings({});
    setIsPlayingAnimation(false);
  }, [applyRotationFormation, selectedRotation, tacticalPhase, isTransitionActive]);

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

  // Pointer & Touch Event Handlers
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

  // Animated Playback
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
              Rotation positioning, serve/receive transition movement & bench substitutions
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
          2. ROTATION SELECTOR & TRANSITION MOVEMENT TOGGLE BAR
         ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '1.5px solid rgba(59, 130, 246, 0.35)',
          borderRadius: '16px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Rotation Selector Pills (1-6) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '0.2rem' }}>
            Rotation:
          </span>
          {[1, 2, 3, 4, 5, 6].map((rot) => {
            const isSel = selectedRotation === rot;
            return (
              <button
                key={rot}
                type="button"
                onClick={() => handleSelectRotation(rot)}
                style={{
                  background: isSel ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSel ? '1.5px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.35rem 0.75rem',
                  color: isSel ? '#ffffff' : '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: isSel ? '0 3px 12px rgba(59, 130, 246, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                Rot #{rot}
              </button>
            );
          })}
        </div>

        {/* Phase Selector (Serve vs Receive) + Post-Contact Transition Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Serve vs Receive Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '0.2rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              onClick={() => handleSelectPhase('serving')}
              style={{
                background: tacticalPhase === 'serving' ? '#10b981' : 'transparent',
                color: tacticalPhase === 'serving' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Volleyball size={13} />
              <span>Serving</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPhase('receiving')}
              style={{
                background: tacticalPhase === 'receiving' ? '#3b82f6' : 'transparent',
                color: tacticalPhase === 'receiving' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Shield size={13} />
              <span>Receiving</span>
            </button>
          </div>

          {/* ⚡ Post-Contact Transition Toggle (Where players move after serve/receive) */}
          <button
            type="button"
            onClick={handleToggleTransition}
            style={{
              background: isTransitionActive
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(217, 119, 6, 0.45))'
                : 'rgba(255, 255, 255, 0.05)',
              border: isTransitionActive ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '0.35rem 0.8rem',
              color: isTransitionActive ? '#fef3c7' : '#cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: isTransitionActive ? '0 3px 12px rgba(245, 158, 11, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
            title="Toggle between starting formation and post-contact transition spot"
          >
            <Zap size={14} color={isTransitionActive ? '#f59e0b' : '#94a3b8'} />
            <span>{isTransitionActive ? 'Showing: Transition Spots' : 'Showing: Base Stacking'}</span>
          </button>

          {/* Transition Paths Visibility Toggle */}
          <button
            type="button"
            onClick={() => setShowTransitionPaths(!showTransitionPaths)}
            className="tool-btn"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            title="Toggle transition movement arrows"
          >
            {showTransitionPaths ? <Eye size={14} color="#10b981" /> : <EyeOff size={14} color="#94a3b8" />}
            <span>{showTransitionPaths ? 'Paths ON' : 'Paths OFF'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN TWO-COLUMN WORKSPACE
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
              <defs>
                <linearGradient id="wbFloor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill={activeColor} />
                </marker>
                <marker id="transArrowHead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#f59e0b" />
                </marker>
              </defs>

              <rect x="0" y="0" width="100" height="100" fill="url(#wbFloor)" />

              {/* Court Boundary Lines */}
              <rect x="5" y="5" width="90" height="90" fill="none" stroke="#ffffff" strokeWidth="1.2" />

              {/* Center Net & Attack Lines */}
              {courtType === 'half' ? (
                <>
                  <line x1="2" y1="5" x2="98" y2="5" stroke="#f8fafc" strokeWidth="3" />
                  <line x1="2" y1="5" x2="98" y2="5" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="5" y1="35" x2="95" y2="35" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="2,2" />
                  <text x="8" y="33" fill="#93c5fd" fontSize="2.5" fontWeight="bold">10ft Attack Line</text>
                </>
              ) : (
                <>
                  <line x1="2" y1="50" x2="98" y2="50" stroke="#f8fafc" strokeWidth="3.5" />
                  <line x1="5" y1="30" x2="95" y2="30" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="2,2" />
                  <line x1="5" y1="70" x2="95" y2="70" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="2,2" />
                </>
              )}

              {/* Transition Movement Paths (Where players go after serve/receive) */}
              {showTransitionPaths &&
                Object.entries(currentPhaseSpots.base).map(([zoneKey, basePos]) => {
                  const transPos = currentPhaseSpots.transition[zoneKey];
                  if (!transPos) return null;
                  const dx = Math.abs(transPos.x - basePos.x);
                  const dy = Math.abs(transPos.y - basePos.y);
                  if (dx < 3 && dy < 3) return null; // Player already at spot

                  return (
                    <g key={zoneKey}>
                      <line
                        x1={basePos.x}
                        y1={basePos.y}
                        x2={transPos.x}
                        y2={transPos.y}
                        stroke="#f59e0b"
                        strokeWidth="1.8"
                        strokeDasharray="3,2"
                        markerEnd="url(#transArrowHead)"
                        opacity="0.85"
                      />
                      {/* Ghost Target Spot Circle */}
                      <circle
                        cx={transPos.x}
                        cy={transPos.y}
                        r="3.5"
                        fill="rgba(245, 158, 11, 0.2)"
                        stroke="#f59e0b"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    </g>
                  );
                })}

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
                    transition: isPlayingAnimation ? 'none' : 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
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
            RIGHT COLUMN: BENCH SUBS & EQUIPMENT STAGING
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
                title="Snap players back to suggested spots"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`tool-btn ${courtType === 'half' ? 'active' : ''}`}
                onClick={() => setCourtType('half')}
                style={{ justifyContent: 'center' }}
              >
                Half Court (Offense)
              </button>

              <button
                type="button"
                className={`tool-btn ${courtType === 'full' ? 'active' : ''}`}
                onClick={() => setCourtType('full')}
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
        </div>
      </div>
    </div>
  );
}
