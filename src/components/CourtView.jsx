import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  RotateCcw,
  Users,
  Sparkles,
  RefreshCw,
  ArrowLeftRight,
  ShieldAlert,
  History,
  Shield,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Plus,
  Volleyball,
  Award,
  ArrowRight,
  GripVertical,
  Move,
  Check,
  Archive,
  Flag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  FRONT_ROW_ZONES,
  BACK_ROW_ZONES,
  ZONE_LABELS,
  checkLiberoRotationViolation,
  checkLineupFrontRowLiberoViolation,
  rotateLineupClockwise,
  rotateLineupCounterClockwise,
  checkSubstitutionLegality,
  checkLiberoServingEligibility,
  checkLiberoReentryOpportunity,
  validate62Formation,
  deriveLineupForRotation,
  detect62SubstitutionOpportunities
} from '../services/volleyballRules';
import { storageService } from '../services/storageService';
import LiberoPromptModal from './LiberoPromptModal';
import LiberoServingPromptModal from './LiberoServingPromptModal';
import LiberoReentryPromptModal from './LiberoReentryPromptModal';
import SubModal from './SubModal';
import SubstitutionLogModal from './SubstitutionLogModal';
import Formation62MismatchModal from './Formation62MismatchModal';
import AutoFillLineupModal from './AutoFillLineupModal';
import RallyOutcomeModal from './RallyOutcomeModal';

export default function CourtView({
  roster,
  lineup,
  setLineup,
  startingLineup,
  setStartingLineup,
  rotation,
  setRotation,
  phase,
  setPhase,
  liberoExchanges,
  setLiberoExchanges,
  liberoServingRotation,
  setLiberoServingRotation,
  subHistory,
  setSubHistory,
  maxSubs,
  setMaxSubs,
  enforcePositionLock,
  setEnforcePositionLock,
  onUpdatePlayerPosition,
  matchStats,
  onRallyWonByUs,
  onRallyWonByOpponent,
  onStartNewSet,
  onArchiveMatch,
  onResetScore,
  onResetFullMatch,
  onNavigateTab
}) {
  // 6-2 System Validation
  const validation62 = validate62Formation(lineup, roster);
  const [is62ModalOpen, setIs62ModalOpen] = useState(false);

  // Archive success toast
  const [isArchiveSuccess, setIsArchiveSuccess] = useState(false);

  // Auto-Fill Starting 6 Modal
  const [isAutoFillModalOpen, setIsAutoFillModalOpen] = useState(false);

  // Drag & Drop Rotation Customization Mode
  const [isDragDropMode, setIsDragDropMode] = useState(false);
  const [draggedZoneKey, setDraggedZoneKey] = useState(null);
  const [dropTargetZoneKey, setDropTargetZoneKey] = useState(null);

  // 💡 Smart 6-2 Substitution Opportunities State
  const [dismissedSubIds, setDismissedSubIds] = useState([]);

  // Rally Outcome & Side-Out Modal
  const [isRallyModalOpen, setIsRallyModalOpen] = useState(false);

  useEffect(() => {
    setDismissedSubIds([]);
  }, [rotation, phase]);

  // Modal States
  const [isLiberoPromptOpen, setIsLiberoPromptOpen] = useState(false);
  const [liberoViolationData, setLiberoViolationData] = useState(null);

  const [isServingPromptOpen, setIsServingPromptOpen] = useState(false);
  const [servingPromptData, setServingPromptData] = useState(null);

  const [isReentryPromptOpen, setIsReentryPromptOpen] = useState(false);
  const [reentryPromptData, setReentryPromptData] = useState(null);

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subTargetZone, setSubTargetZone] = useState(null);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Persist state to localStorage whenever court state updates
  useEffect(() => {
    storageService.saveMatchState({
      lineup,
      startingLineup,
      rotation,
      phase,
      liberoExchanges,
      liberoServingRotation,
      subHistory,
      maxSubs,
      enforcePositionLock
    });
  }, [lineup, startingLineup, rotation, phase, liberoExchanges, liberoServingRotation, subHistory, maxSubs, enforcePositionLock]);

  const getPlayer = (id) => roster.find(p => p.id === id);

  const assignedPlayerIds = Object.values(lineup).filter(Boolean);
  const benchPlayers = roster.filter(p => !assignedPlayerIds.includes(p.id));

  // Regular subs count (excluding Libero free exchanges)
  const regularSubsUsed = subHistory.filter(s => !s.isLiberoExchange).length;

  // Find team libero
  const teamLibero = roster.find(p => p.position === 'Libero' || p.isLibero);
  const isLiberoOnCourt = teamLibero ? Object.values(lineup).includes(teamLibero.id) : false;

  // Match and Set Handlers
  const handleFinishSetClick = () => {
    const currentSetNum = matchStats?.setNumber || 1;
    const ourPts = matchStats?.ourScore || 0;
    const oppPts = matchStats?.opponentScore || 0;
    if (window.confirm(`Finish Set ${currentSetNum} (Score: US ${ourPts} - ${oppPts} OPP) and start Set ${currentSetNum + 1}?`)) {
      if (onStartNewSet) onStartNewSet();
    }
  };

  const handleArchiveMatchClick = () => {
    if (onArchiveMatch) {
      const res = onArchiveMatch();
      if (res) {
        setIsArchiveSuccess(true);
        setTimeout(() => setIsArchiveSuccess(false), 3500);
      }
    }
  };

  const handleResetScoreClick = () => {
    if ((matchStats?.ourScore || 0) === 0 && (matchStats?.opponentScore || 0) === 0) return;
    if (window.confirm('Reset current set score back to 0 - 0? (Point history will be preserved).')) {
      if (onResetScore) onResetScore();
    }
  };

  /**
   * Official Volleyball Rally & Side-Out Rotation Flow:
   * 1. When Serving -> Losing point switches team to Receive (same rotation, no rotation yet).
   * 2. When Receiving -> Winning point (Side-Out) awards serve to your team, triggers Clockwise Rotation, and switches to Serve!
   */
  const handleAdvanceRally = () => {
    // If scoring handlers are available, prompt for rally outcome to make score tracking effortless
    if (onRallyWonByUs && onRallyWonByOpponent) {
      setIsRallyModalOpen(true);
    } else {
      handleDirectAdvanceOnly();
    }
  };

  const handleDirectAdvanceOnly = () => {
    if (phase === 'serve') {
      // Team lost serve -> switch to Receive (same rotation)
      setPhase('receive');
    } else {
      // Team won serve back on Side-out -> Rotate clockwise & switch to Serve
      handleNextRotation(true);
    }
  };

  /**
   * Clockwise Rotation Handler with Multi-step Volleyball Rules Validation:
   * 1. Libero Front-Row Exit check (Zone 5 -> Zone 4).
   * 2. Libero Serving Rotation Decision check (Zone 2 -> Zone 1).
   * @param {boolean} switchToServe - Whether to set phase to 'serve' after rotation
   */
  const handleNextRotation = (switchToServe = false) => {
    // Step 1: Check if Libero in Zone 5 will rotate into Zone 4 (Left Front)
    const exitCheck = checkLiberoRotationViolation(lineup, roster, liberoExchanges);

    if (exitCheck.willViolate) {
      // Pause rotation & open Libero Front-Row Exit Modal
      setLiberoViolationData(exitCheck);
      setIsLiberoPromptOpen(true);
      return;
    }

    // Step 2: Check Libero Serving Opportunity in Zone 1 (Server Position)
    const nextRotationNum = rotation === 6 ? 1 : rotation + 1;
    const incomingServerId = lineup.pos2;
    const incomingServer = getPlayer(incomingServerId);

    if (teamLibero && incomingServer && incomingServer.id !== teamLibero.id) {
      const servingEligibility = checkLiberoServingEligibility(teamLibero, nextRotationNum, liberoServingRotation);
      
      // If Libero is eligible to serve and incoming player is a Middle Blocker or already designated
      if (servingEligibility.canServe && (incomingServer.position === 'Middle Blocker' || liberoServingRotation === nextRotationNum)) {
        setServingPromptData({
          libero: teamLibero,
          regularPlayer: incomingServer,
          rotationNumber: nextRotationNum,
          servingEligibility
        });
        setIsServingPromptOpen(true);
        if (switchToServe) setPhase('serve');
        return;
      }
    }

    // Step 3: Perform direct rotation if no prompts required
    executeDirectRotation(null, switchToServe);
  };

  /**
   * Executes clockwise rotation directly and checks for post-rotation re-entry opportunities
   */
  const executeDirectRotation = (customLineup = null, switchToServe = false) => {
    const nextLineup = customLineup || rotateLineupClockwise(lineup);
    const nextRot = rotation === 6 ? 1 : rotation + 1;

    setLineup(nextLineup);
    setRotation(nextRot);
    if (switchToServe) setPhase('serve');

    // Check if Libero is on bench and there is a back-row player eligible for replacement
    const isLiberoOnCourtNow = teamLibero ? Object.values(nextLineup).includes(teamLibero.id) : false;
    if (teamLibero && !isLiberoOnCourtNow) {
      const reentryCheck = checkLiberoReentryOpportunity(nextLineup, roster, liberoExchanges);
      if (reentryCheck.canReenter && reentryCheck.candidatePlayer) {
        setReentryPromptData(reentryCheck);
      }
    }
  };

  /**
   * Handle Counter-Clockwise Rotation
   */
  const handlePrevRotation = () => {
    let prev = rotateLineupCounterClockwise(lineup);
    const violation = checkLineupFrontRowLiberoViolation(prev, roster, liberoExchanges);
    if (violation.hasViolation && violation.replacedPlayer) {
      prev[violation.zoneKey] = violation.replacedPlayer.id;
    }
    setLineup(prev);
    setRotation(r => (r === 1 ? 6 : r - 1));
  };

  /**
   * Direct Jump to a specific Rotation (R1 through R6)
   */
  const handleSelectRotation = (targetRot) => {
    if (targetRot === rotation) return;

    // Calculate clockwise steps from current rotation
    const steps = (targetRot - rotation + 6) % 6;
    let current = { ...lineup };
    for (let i = 0; i < steps; i++) {
      current = rotateLineupClockwise(current);
      const violation = checkLineupFrontRowLiberoViolation(current, roster, liberoExchanges);
      if (violation.hasViolation && violation.replacedPlayer) {
        current[violation.zoneKey] = violation.replacedPlayer.id;
      }
    }

    const finalViolation = checkLineupFrontRowLiberoViolation(current, roster, liberoExchanges);
    if (finalViolation.hasViolation) {
      setLiberoViolationData({
        willViolate: true,
        libero: finalViolation.libero,
        replacedPlayer: finalViolation.replacedPlayer,
        fromZone: 'pos5',
        toZone: finalViolation.zoneKey
      });
      setIsLiberoPromptOpen(true);
      return;
    }

    setLineup(current);
    setRotation(targetRot);
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
  };

  /**
   * Confirms Libero Front-Row Exit from Prompt and continues rotation flow
   */
  const handleConfirmLiberoSubAndRotate = (replacementPlayer) => {
    if (!liberoViolationData || !replacementPlayer) return;

    const libero = liberoViolationData.libero;

    // Rotate lineup clockwise
    const nextLineup = rotateLineupClockwise(lineup);

    // Replace Zone 4 with chosen replacement
    nextLineup.pos4 = replacementPlayer.id;

    // Record the Libero exit exchange
    const newHistoryEntry = {
      id: `sub-${Date.now()}`,
      timestamp: new Date().toISOString(),
      zoneKey: 'pos4',
      outgoingPlayerId: libero.id,
      outgoingPlayerName: libero.name,
      outgoingPlayerNumber: libero.number,
      incomingPlayerId: replacementPlayer.id,
      incomingPlayerName: replacementPlayer.name,
      incomingPlayerNumber: replacementPlayer.number,
      isLiberoExchange: true,
      subNumber: null
    };
    setSubHistory(prev => [newHistoryEntry, ...prev]);

    // Clear Libero replacement mapping
    setLiberoExchanges(prev => {
      const next = { ...prev };
      delete next[libero.id];
      return next;
    });

    setIsLiberoPromptOpen(false);
    setLiberoViolationData(null);

    const nextRotationNum = rotation === 6 ? 1 : rotation + 1;

    // Check if incoming server in Zone 1 can trigger serving prompt
    const incomingServerId = nextLineup.pos1;
    const incomingServer = getPlayer(incomingServerId);
    if (teamLibero && incomingServer && incomingServer.id !== teamLibero.id) {
      const servingEligibility = checkLiberoServingEligibility(teamLibero, nextRotationNum, liberoServingRotation);
      if (servingEligibility.canServe && (incomingServer.position === 'Middle Blocker' || liberoServingRotation === nextRotationNum)) {
        setServingPromptData({
          libero: teamLibero,
          regularPlayer: incomingServer,
          rotationNumber: nextRotationNum,
          servingEligibility
        });
        setIsServingPromptOpen(true);
        setLineup(nextLineup);
        setRotation(nextRotationNum);
        return;
      }
    }

    executeDirectRotation(nextLineup);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
  };

  /**
   * Serving Decision Choice Handler
   * @param {'libero'|'regular'} serverChoice
   */
  const handleChooseServer = (serverChoice) => {
    if (!servingPromptData) return;

    const { libero, regularPlayer, rotationNumber } = servingPromptData;
    const nextLineup = rotateLineupClockwise(lineup);

    if (serverChoice === 'libero') {
      // Put Libero in Zone 1 (Server)
      nextLineup.pos1 = libero.id;
      // Lock serving rotation position (Rule 19.3.1.3)
      setLiberoServingRotation(rotationNumber);

      // Record Libero Serving exchange
      const servingSubEntry = {
        id: `sub-serve-${Date.now()}`,
        timestamp: new Date().toISOString(),
        zoneKey: 'pos1',
        outgoingPlayerId: regularPlayer.id,
        outgoingPlayerName: regularPlayer.name,
        outgoingPlayerNumber: regularPlayer.number,
        incomingPlayerId: libero.id,
        incomingPlayerName: libero.name,
        incomingPlayerNumber: libero.number,
        isLiberoExchange: true,
        subNumber: null,
        note: `Libero Designated Server for Rotation #${rotationNumber}`
      };
      setSubHistory(prev => [servingSubEntry, ...prev]);

      setLiberoExchanges(prev => ({
        ...prev,
        [libero.id]: regularPlayer.id
      }));

      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }

    setLineup(nextLineup);
    setRotation(rotationNumber);
    setIsServingPromptOpen(false);
    setServingPromptData(null);
  };

  /**
   * Re-enter Libero for candidate back-row player (e.g. Zone 6 / Middle Back)
   */
  const handleConfirmLiberoReentry = () => {
    if (!reentryPromptData) return;

    const { libero, candidatePlayer, targetZone } = reentryPromptData;

    setLineup(prev => ({
      ...prev,
      [targetZone]: libero.id
    }));

    setLiberoExchanges(prev => ({
      ...prev,
      [libero.id]: candidatePlayer.id
    }));

    const reentrySubEntry = {
      id: `sub-reentry-${Date.now()}`,
      timestamp: new Date().toISOString(),
      zoneKey: targetZone,
      outgoingPlayerId: candidatePlayer.id,
      outgoingPlayerName: candidatePlayer.name,
      outgoingPlayerNumber: candidatePlayer.number,
      incomingPlayerId: libero.id,
      incomingPlayerName: libero.name,
      incomingPlayerNumber: libero.number,
      isLiberoExchange: true,
      subNumber: null,
      note: 'Libero Back-Row Defensive Re-entry'
    };
    setSubHistory(prev => [reentrySubEntry, ...prev]);

    setIsReentryPromptOpen(false);
    setReentryPromptData(null);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  };

  const handleSkipLiberoReentry = () => {
    setIsReentryPromptOpen(false);
    setReentryPromptData(null);
  };

  /**
   * Open Sub Modal for a specific Zone
   */
  const handleOpenSubModal = (zoneKey) => {
    setSubTargetZone(zoneKey);
    setIsSubModalOpen(true);
  };

  /**
   * Execute Substitution from Sub Modal
   */
  const handleExecuteSub = (zoneKey, incomingPlayer, outgoingPlayer, isLiberoExchange) => {
    setLineup(prev => {
      const next = { ...prev };
      if (incomingPlayer) {
        Object.keys(next).forEach(k => {
          if (next[k] === incomingPlayer.id) next[k] = null;
        });
      }
      next[zoneKey] = incomingPlayer ? incomingPlayer.id : null;
      return next;
    });

    if (incomingPlayer && (incomingPlayer.position === 'Libero' || incomingPlayer.isLibero)) {
      if (outgoingPlayer) {
        setLiberoExchanges(prev => ({
          ...prev,
          [incomingPlayer.id]: outgoingPlayer.id
        }));
      }
      if (zoneKey === 'pos1' && liberoServingRotation === null) {
        setLiberoServingRotation(rotation);
      }
    } else if (outgoingPlayer && (outgoingPlayer.position === 'Libero' || outgoingPlayer.isLibero)) {
      setLiberoExchanges(prev => {
        const next = { ...prev };
        delete next[outgoingPlayer.id];
        return next;
      });
    }

    const nextSubNum = isLiberoExchange ? null : regularSubsUsed + 1;
    const historyEntry = {
      id: `sub-${Date.now()}`,
      timestamp: new Date().toISOString(),
      zoneKey,
      outgoingPlayerId: outgoingPlayer?.id || null,
      outgoingPlayerName: outgoingPlayer?.name || null,
      outgoingPlayerNumber: outgoingPlayer?.number || null,
      incomingPlayerId: incomingPlayer?.id || null,
      incomingPlayerName: incomingPlayer?.name || null,
      incomingPlayerNumber: incomingPlayer?.number || null,
      isLiberoExchange,
      subNumber: nextSubNum
    };
    setSubHistory(prev => [historyEntry, ...prev]);

    setIsSubModalOpen(false);
    setSubTargetZone(null);
  };

  /**
   * Auto-Fill Starters with intelligent volleyball positioning
   */
  const handleAutoFillStarters = () => {
    setIsAutoFillModalOpen(true);
  };

  const handleApplyAutoFill = (newLineup, serveState) => {
    setLineup(newLineup);
    setStartingLineup(newLineup);

    const liberoInLineup = Object.values(newLineup).find(id => {
      const p = roster.find(player => player.id === id);
      return p && (p.position === 'Libero' || p.isLibero);
    });
    if (liberoInLineup) {
      const mbOnBench = roster.find(p => p.position === 'Middle Blocker' && !Object.values(newLineup).includes(p.id));
      if (mbOnBench) {
        setLiberoExchanges({ [liberoInLineup]: mbOnBench.id });
      } else {
        setLiberoExchanges({});
      }
    } else {
      setLiberoExchanges({});
    }

    setRotation(1);
    setPhase(serveState);
    setLiberoServingRotation(null);
    setSubHistory([]);
    setReentryPromptData(null);
  };

  const handleToggleDragDropMode = () => {
    if (!isDragDropMode) {
      if (rotation !== 1) {
        handleSelectRotation(1);
      }
      setIsDragDropMode(true);
    } else {
      setIsDragDropMode(false);
    }
  };

  const handleDragStart = (e, zoneKey) => {
    if (!isDragDropMode) return;
    setDraggedZoneKey(zoneKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', zoneKey);
  };

  const handleDragOver = (e, zoneKey) => {
    if (!isDragDropMode || !draggedZoneKey) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetZoneKey !== zoneKey) {
      setDropTargetZoneKey(zoneKey);
    }
  };

  const handleDragLeave = (e, zoneKey) => {
    if (dropTargetZoneKey === zoneKey) {
      setDropTargetZoneKey(null);
    }
  };

  const handleDrop = (e, targetZoneKey) => {
    if (!isDragDropMode || !draggedZoneKey) return;
    e.preventDefault();
    const sourceZoneKey = draggedZoneKey;
    setDraggedZoneKey(null);
    setDropTargetZoneKey(null);

    if (sourceZoneKey === targetZoneKey) return;

    handleSwapStartingLineupZones(sourceZoneKey, targetZoneKey);
  };

  const handleSwapStartingLineupZones = (sourceZoneKey, targetZoneKey) => {
    const currentR1 = rotation === 1 ? { ...lineup } : { ...startingLineup };
    const sourcePlayerId = currentR1[sourceZoneKey];
    const targetPlayerId = currentR1[targetZoneKey];

    const newStartingLineup = {
      ...currentR1,
      [sourceZoneKey]: targetPlayerId,
      [targetZoneKey]: sourcePlayerId
    };

    // Rule 19.3.1: Libero cannot be in front row (Zones 4, 3, 2)
    const sourcePlayer = getPlayer(sourcePlayerId);
    const targetPlayer = getPlayer(targetPlayerId);
    const isTargetFrontRow = FRONT_ROW_ZONES.includes(targetZoneKey);
    const isSourceFrontRow = FRONT_ROW_ZONES.includes(sourceZoneKey);

    if ((sourcePlayer?.position === 'Libero' || sourcePlayer?.isLibero) && isTargetFrontRow) {
      alert(`Volleyball Rule 19.3.1: Libero (${sourcePlayer.name}) cannot be placed in the front row (Zones 4, 3, 2).`);
      return;
    }
    if ((targetPlayer?.position === 'Libero' || targetPlayer?.isLibero) && isSourceFrontRow) {
      alert(`Volleyball Rule 19.3.1: Libero (${targetPlayer.name}) cannot be placed in the front row (Zones 4, 3, 2).`);
      return;
    }

    setStartingLineup(newStartingLineup);

    // Propagate changes to current rotation view and all following rotations
    const updatedLineup = deriveLineupForRotation(newStartingLineup, rotation, roster, liberoExchanges);
    setLineup(updatedLineup);

    confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
  };

  const handleClearCourt = () => {
    setLineup({ pos1: null, pos2: null, pos3: null, pos4: null, pos5: null, pos6: null });
    setStartingLineup({ pos1: null, pos2: null, pos3: null, pos4: null, pos5: null, pos6: null });
    setLiberoExchanges({});
    setLiberoServingRotation(null);
    setReentryPromptData(null);
  };

  const handleResetHistory = () => {
    setSubHistory([]);
    setLiberoServingRotation(null);
  };

  /**
   * Render individual court zone slot
   */
  const renderZoneSlot = (zoneKey, zoneNum, zoneName, isServer = false) => {
    const playerId = lineup[zoneKey];
    const player = getPlayer(playerId);
    const isFrontRow = FRONT_ROW_ZONES.includes(zoneKey);
    const isLibero = player && (player.position === 'Libero' || player.isLibero);

    const replacedPlayerId = isLibero ? liberoExchanges[player.id] : null;
    const replacedPlayer = replacedPlayerId ? getPlayer(replacedPlayerId) : null;

    const isDragged = draggedZoneKey === zoneKey;
    const isDropTarget = dropTargetZoneKey === zoneKey;

    return (
      <div
        className={`court-zone-slot ${player ? 'filled' : ''} ${isServer && phase === 'serve' ? 'is-server' : ''} ${isFrontRow ? 'zone-front-row' : 'zone-back-row'} ${isDragDropMode ? 'is-draggable-mode' : ''} ${isDragged ? 'is-dragging-source' : ''} ${isDropTarget ? 'is-drop-target' : ''}`}
        draggable={isDragDropMode && Boolean(player)}
        onDragStart={(e) => handleDragStart(e, zoneKey)}
        onDragOver={(e) => handleDragOver(e, zoneKey)}
        onDragLeave={(e) => handleDragLeave(e, zoneKey)}
        onDrop={(e) => handleDrop(e, zoneKey)}
        onClick={() => {
          if (!isDragDropMode) {
            handleOpenSubModal(zoneKey);
          }
        }}
        title={isDragDropMode ? `Drag ${player?.name || 'this zone'} to swap with another zone` : `Click to sub in ${zoneName}`}
        style={isDropTarget ? { borderColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', transform: 'scale(1.02)' } : (isDragged ? { opacity: 0.5 } : {})}
      >
        {/* Zone Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.25rem' }}>
          <span className="zone-number-badge">Z{zoneNum}</span>
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            {isDragDropMode && player && (
              <span style={{
                background: 'rgba(245, 158, 11, 0.25)',
                border: '1px solid #f59e0b',
                borderRadius: '4px',
                padding: '1px 4px',
                fontSize: '0.62rem',
                color: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                <GripVertical size={10} />
                DRAG
              </span>
            )}
            {isFrontRow && <span className="badge-row-front">FRONT</span>}
            {!isFrontRow && (!isServer || phase !== 'serve') && <span className="badge-row-back">BACK</span>}
            {isServer && phase === 'serve' && (
              <span className="server-badge" style={isLibero ? { background: '#a855f7', color: '#ffffff' } : {}}>
                {isLibero ? 'LIBERO SERVE' : 'SERVER'}
              </span>
            )}
            {isServer && phase === 'receive' && (
              <span className="badge-row-back" style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: '#93c5fd' }}>
                RIGHT BACK
              </span>
            )}
          </div>
        </div>

        {/* Player Content */}
        {player ? (
          <div className="slot-player-info">
            <div className={`slot-jersey-num ${isLibero ? 'libero' : ''}`}>
              #{player.number}
            </div>
            <div className="slot-player-name">{player.name}</div>
            <div className="slot-player-pos">{player.position}</div>

            {/* Libero Replacement Indicator */}
            {isLibero && (
              <div className="libero-covering-tag">
                {replacedPlayer ? `Covering: #${replacedPlayer.number || ''} ${replacedPlayer.name ? replacedPlayer.name.split(' ')[0] : ''}` : 'Libero (Back Row)'}
              </div>
            )}

            {/* Quick Sub Action Pill */}
            <div className="slot-sub-btn">
              <ArrowLeftRight size={11} />
              <span>Sub</span>
            </div>
          </div>
        ) : (
          <div className="slot-player-info">
            <span className="slot-empty-label">+ Assign</span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{zoneName}</span>
          </div>
        )}
      </div>
    );
  };

  // 💡 6-2 Smart Substitution Recommendations Engine
  const smartSubOpportunities = detect62SubstitutionOpportunities(
    lineup,
    rotation,
    phase,
    roster,
    subHistory,
    { maxSubs, enforcePositionLock }
  ).filter(rec => !dismissedSubIds.includes(rec.id));

  const activeSubRec = smartSubOpportunities[0] || null;

  const handleExecuteSmartSub = (rec) => {
    if (!rec) return;
    const { incomingPlayer, outgoingPlayer, targetZone, isLiberoExchange } = rec;

    setLineup(prev => ({
      ...prev,
      [targetZone]: incomingPlayer.id
    }));

    if (isLiberoExchange) {
      setLiberoExchanges(prev => ({
        ...prev,
        [incomingPlayer.id]: outgoingPlayer.id
      }));
    }

    const newHistoryEntry = {
      id: `sub-${Date.now()}`,
      timestamp: new Date().toISOString(),
      zoneKey: targetZone,
      outgoingPlayerId: outgoingPlayer.id,
      outgoingPlayerName: outgoingPlayer.name,
      outgoingPlayerNumber: outgoingPlayer.number,
      incomingPlayerId: incomingPlayer.id,
      incomingPlayerName: incomingPlayer.name,
      incomingPlayerNumber: incomingPlayer.number,
      isLiberoExchange: Boolean(isLiberoExchange),
      subNumber: isLiberoExchange ? null : regularSubsUsed + 1
    };

    setSubHistory(prev => [newHistoryEntry, ...prev]);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setDismissedSubIds(prev => [...prev, rec.id]);
  };

  return (
    <div className="court-container">
      {/* Court Top Controls Header */}
      <div className="court-header">
        {/* Rotation Selectors & Steppers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div className="rotation-controls">
            <button className="btn btn-secondary btn-sm" onClick={handlePrevRotation} title="Previous Rotation">
              <RotateCcw size={16} />
            </button>
            <div className="rotation-indicator">
              ROTATION #{rotation}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => handleNextRotation(false)} title="Next Rotation (Clockwise)">
              <RotateCw size={16} />
            </button>
          </div>

          {/* Selectable Rotation Pills (R1 - R6) */}
          <div className="rotation-pill-group">
            {[1, 2, 3, 4, 5, 6].map(rNum => (
              <button
                key={rNum}
                className={`rot-select-pill ${rotation === rNum ? 'active' : ''}`}
                onClick={() => handleSelectRotation(rNum)}
                title={`Jump to Rotation #${rNum}`}
              >
                R{rNum}
              </button>
            ))}
          </div>
        </div>

        {/* Rally Flow & Phase Toggle (Serving vs Receiving) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Phase Toggle */}
          <div className="phase-toggle-group">
            <button
              className={`phase-btn ${phase === 'serve' ? 'active-serve' : ''}`}
              onClick={() => setPhase('serve')}
            >
              <Volleyball size={15} />
              <span>Serving</span>
            </button>

            <button
              className={`phase-btn ${phase === 'receive' ? 'active-receive' : ''}`}
              onClick={() => setPhase('receive')}
            >
              <Shield size={15} />
              <span>Receiving</span>
            </button>
          </div>

          {/* Side-Out / Next Rally Action Button */}
          <button
            className="btn btn-primary btn-sm rally-advance-btn"
            onClick={handleAdvanceRally}
            style={{
              background: phase === 'receive'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderColor: phase === 'receive' ? '#10b981' : '#3b82f6',
              boxShadow: phase === 'receive'
                ? '0 4px 14px rgba(16, 185, 129, 0.4)'
                : '0 4px 14px rgba(59, 130, 246, 0.4)'
            }}
            title={phase === 'receive' ? 'Side-Out: Rotate clockwise to next rotation and take serve' : 'Lost Serve: Switch to receive in current rotation'}
          >
            {phase === 'receive' ? (
              <>
                <span>Side-Out (Rotate & Serve)</span>
                <RotateCw size={15} />
              </>
            ) : (
              <>
                <span>Side-Out (Switch to Receive)</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {/* Status Pills: Substitution Counter & Libero Serve Status */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* 6-2 System Positional Status Banner */}
          <div
            className="subs-status-pill"
            onClick={() => setIs62ModalOpen(true)}
            style={{
              background: validation62.isValid62
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(245, 158, 11, 0.18)',
              borderColor: validation62.isValid62
                ? 'rgba(16, 185, 129, 0.4)'
                : '#f59e0b',
              color: validation62.isValid62 ? '#a7f3d0' : '#fde68a',
              cursor: 'pointer'
            }}
            title="Click to view 6-2 volleyball positional alignment and player roles"
          >
            {validation62.isValid62 ? (
              <>
                <CheckCircle size={15} color="#10b981" />
                <span><strong>6-2 Verified</strong></span>
              </>
            ) : (
              <>
                <AlertTriangle size={15} color="#f59e0b" />
                <span><strong>6-2 Mismatch (Tap to Fix)</strong></span>
              </>
            )}
          </div>

          <div
            className="subs-status-pill"
            onClick={() => setIsLogModalOpen(true)}
            title="Click to view full substitutions log"
          >
            <History size={15} color="var(--accent-orange)" />
            <span>
              <strong>{regularSubsUsed}</strong> / {maxSubs} Subs
            </span>
            <span style={{ fontSize: '0.7rem', color: '#60a5fa', textDecoration: 'underline', marginLeft: '0.2rem' }}>
              Log
            </span>
          </div>

          {/* Libero Serving Status Indicator */}
          {liberoServingRotation !== null && (
            <div
              className="subs-status-pill"
              style={{ borderColor: '#8b5cf6', background: 'rgba(124, 58, 237, 0.15)' }}
              title={`Libero is locked to serve in Rotation #${liberoServingRotation} (USAV Rule 19.3.1.3)`}
            >
              <Award size={14} color="#c084fc" />
              <span style={{ color: '#e9d5ff', fontSize: '0.78rem' }}>
                Libero Serves in Rot #{liberoServingRotation}
              </span>
            </div>
          )}

          {/* Drag & Drop Rotation Customization Toggle Button */}
          <button
            className={`btn btn-sm ${isDragDropMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleToggleDragDropMode}
            style={isDragDropMode ? {
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderColor: '#f59e0b',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.5)',
              color: '#ffffff',
              fontWeight: 800
            } : {}}
            title="Enable drag and drop to rearrange players in Rotation 1 and propagate across all rotations"
          >
            <Move size={14} />
            <span>{isDragDropMode ? '✋ Drag & Drop: ON' : '✋ Drag & Drop Rotations'}</span>
          </button>

          {/* Finish Set & Save Match Actions */}
          <button
            className="btn btn-sm"
            onClick={handleFinishSetClick}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.35))',
              borderColor: 'rgba(16, 185, 129, 0.5)',
              color: '#a7f3d0',
              fontWeight: 700
            }}
            title="Finish the active set, record score to set history, and advance to next set"
          >
            <Check size={14} color="#34d399" />
            <span>Finish Set & Next</span>
          </button>

          <button
            className="btn btn-sm"
            onClick={handleArchiveMatchClick}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgba(59, 130, 246, 0.45)',
              color: '#bfdbfe',
              fontWeight: 700
            }}
            title="Save current match stats and scores into history archive"
          >
            <Archive size={14} color="#60a5fa" />
            <span>Save to History</span>
          </button>

          {/* Auto-fill & Clear Actions */}
          <button className="btn btn-secondary btn-sm" onClick={handleAutoFillStarters} title="Auto-fill starting lineup with smart volleyball roles">
            <Sparkles size={14} color="#f59e0b" /> Auto-Fill Starting 6
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleClearCourt} title="Clear all positions on court">
            <RefreshCw size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {isArchiveSuccess && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(15, 23, 42, 0.95))',
          border: '1px solid #10b981',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          color: '#a7f3d0',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle size={18} color="#34d399" />
          <span>Match successfully saved to history archive!</span>
        </div>
      )}

      {/* Drag & Drop Active Coaching Instructions Banner */}
      {isDragDropMode && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(30, 41, 59, 0.95))',
          border: '1px solid #f59e0b',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>✋</span>
            <div>
              <div style={{ fontSize: '0.86rem', color: '#fef3c7', fontWeight: 800 }}>
                Drag & Drop Rotation 1 Mode Active
              </div>
              <div style={{ fontSize: '0.78rem', color: '#fde68a', lineHeight: 1.4 }}>
                Drag player cards between court zones to re-order the starting lineup. All following rotations (R2–R6) and the 6-2 Tactics board will automatically update!
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', borderColor: '#f59e0b', color: '#fef3c7', flexShrink: 0 }}
            onClick={() => setIsDragDropMode(false)}
          >
            Done Editing
          </button>
        </div>
      )}

      {/* 💡 6-2 Smart Substitution Tactical Prompt Banner */}
      {activeSubRec && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(15, 23, 42, 0.95))',
          border: '1px solid #f59e0b',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 18px rgba(245, 158, 11, 0.25)',
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ArrowLeftRight size={20} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', color: '#fef3c7', fontWeight: 800 }}>
                {activeSubRec.title}
              </div>
              <div style={{ fontSize: '0.80rem', color: '#fde68a', marginTop: '0.15rem' }}>
                {activeSubRec.description}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(254, 243, 199, 0.7)', marginTop: '0.1rem' }}>
                ⚖️ {activeSubRec.ruleNote}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderColor: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}
              onClick={() => handleExecuteSmartSub(activeSubRec)}
            >
              <Sparkles size={14} /> Sub In Now
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
              onClick={() => setDismissedSubIds(prev => [...prev, activeSubRec.id])}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Libero Re-Entry Notification Banner (When Libero is on Bench and back row has a candidate) */}
      {reentryPromptData && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(30, 41, 59, 0.8))',
          border: '1px solid #8b5cf6',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Shield size={20} color="#c084fc" />
            <div style={{ fontSize: '0.84rem', color: '#f3e8ff' }}>
              <strong>Libero Re-Entry Ready:</strong> Libero #{teamLibero?.number} is on the bench. Sub in for <strong>#{reentryPromptData.candidatePlayer.number} {reentryPromptData.candidatePlayer.name}</strong> in Zone {ZONE_LABELS[reentryPromptData.targetZone]?.num}?
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-primary btn-sm"
              style={{ background: '#7c3aed', borderColor: '#6d28d9', fontSize: '0.78rem' }}
              onClick={handleConfirmLiberoReentry}
            >
              <Sparkles size={13} /> Sub Libero In
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
              onClick={handleSkipLiberoReentry}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Court Diagram Visualizer */}
      <div className="court-stage-wrapper">
        <div className="volleyball-court">
          {/* Net on Top */}
          <div className="court-net-line"></div>
          <div className="court-net-label">
            {phase === 'serve' ? 'NET / OPPONENT RECEIVES' : 'NET / OPPONENT SERVES'}
          </div>

          {/* Front Row (Attack Zone) Header */}
          <div className="court-row-label front-row-label">
            <span>ATTACK ZONE • FRONT ROW (ZONES 4, 3, 2)</span>
          </div>

          {/* 3-Meter Attack Line */}
          <div className="court-attack-line">
            <span className="attack-line-label">3M / 10FT ATTACK LINE</span>
          </div>

          {/* Back Row (Defense Zone) Header */}
          <div className="court-row-label back-row-label">
            <span>DEFENSE ZONE • BACK ROW (ZONES 5, 6, 1)</span>
          </div>

          {/* 6 Court Zones Grid */}
          <div className="court-zones-grid">
            {/* Front Row: Left Front (Zone 4), Middle Front (Zone 3), Right Front (Zone 2) */}
            {renderZoneSlot('pos4', 4, 'Left Front')}
            {renderZoneSlot('pos3', 3, 'Middle Front')}
            {renderZoneSlot('pos2', 2, 'Right Front')}

            {/* Back Row: Left Back (Zone 5), Middle Back (Zone 6), Right Back (Zone 1 / Server) */}
            {renderZoneSlot('pos5', 5, 'Left Back')}
            {renderZoneSlot('pos6', 6, 'Middle Back')}
            {renderZoneSlot('pos1', 1, 'Right Back (Server)', true)}
          </div>
        </div>
      </div>

      {/* Bench Substitutes Section */}
      <div className="court-bench-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div className="court-bench-title" style={{ margin: 0 }}>
            <Users size={18} color="var(--accent-orange)" />
            Available Substitutes on Bench ({benchPlayers.length})
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Tap any court zone to make a legal substitution
          </span>
        </div>

        {benchPlayers.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            All roster players are currently assigned to the court. Add more players in the Roster tab.
          </p>
        ) : (
          <div className="bench-player-chips">
            {benchPlayers.map(player => {
              const isLibero = player.position === 'Libero' || player.isLibero;
              return (
                <div
                  key={player.id}
                  className="bench-chip"
                  onClick={() => {
                    const emptySlotKey = Object.keys(lineup).find(k => !lineup[k]);
                    handleOpenSubModal(emptySlotKey || 'pos1');
                  }}
                >
                  <span className={`bench-chip-num ${isLibero ? 'libero-num' : ''}`}>#{player.number}</span>
                  <span className="bench-chip-name">{player.name}</span>
                  <span className="bench-chip-pos">{player.position}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 1. Libero Front-Row Violation Prompt Modal */}
      <LiberoPromptModal
        isOpen={isLiberoPromptOpen}
        onClose={() => {
          setIsLiberoPromptOpen(false);
          setLiberoViolationData(null);
        }}
        libero={liberoViolationData?.libero}
        replacedPlayer={liberoViolationData?.replacedPlayer}
        benchPlayers={benchPlayers}
        onConfirmSubAndRotate={handleConfirmLiberoSubAndRotate}
      />

      {/* 2. Libero Serving Rotation Decision Modal */}
      <LiberoServingPromptModal
        isOpen={isServingPromptOpen}
        onClose={() => {
          setIsServingPromptOpen(false);
          setServingPromptData(null);
        }}
        libero={servingPromptData?.libero}
        regularPlayer={servingPromptData?.regularPlayer}
        rotationNumber={servingPromptData?.rotationNumber}
        servingEligibility={servingPromptData?.servingEligibility}
        onChooseServer={handleChooseServer}
      />

      {/* 3. Libero Back-Row Re-Entry Modal */}
      <LiberoReentryPromptModal
        isOpen={isReentryPromptOpen}
        onClose={() => {
          setIsReentryPromptOpen(false);
          setReentryPromptData(null);
        }}
        libero={reentryPromptData?.libero}
        candidatePlayer={reentryPromptData?.candidatePlayer}
        targetZoneKey={reentryPromptData?.targetZone}
        onConfirmReentry={handleConfirmLiberoReentry}
        onSkipReentry={handleSkipLiberoReentry}
      />

      {/* 4. Standard / Libero Substitution Modal */}
      <SubModal
        isOpen={isSubModalOpen}
        onClose={() => {
          setIsSubModalOpen(false);
          setSubTargetZone(null);
        }}
        targetZoneKey={subTargetZone}
        currentLineup={lineup}
        roster={roster}
        subHistory={subHistory}
        onExecuteSub={handleExecuteSub}
        maxSubs={maxSubs}
        enforcePositionLock={enforcePositionLock}
      />

      {/* 5. Substitution History Log Modal */}
      <SubstitutionLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        subHistory={subHistory}
        onResetHistory={handleResetHistory}
        maxSubs={maxSubs}
      />

      {/* 6. 6-2 Formation Positional Alignment Modal */}
      <Formation62MismatchModal
        isOpen={is62ModalOpen}
        onClose={() => setIs62ModalOpen(false)}
        validation={validation62}
        lineup={lineup}
        roster={roster}
        onApplyAutoCorrection={(new62Lineup) => setLineup(new62Lineup)}
        onUpdatePlayerPosition={onUpdatePlayerPosition}
        onOpenSubModal={handleOpenSubModal}
      />

      {/* 7. Smart Auto-Fill Starting 6 Lineup Modal */}
      <AutoFillLineupModal
        isOpen={isAutoFillModalOpen}
        onClose={() => setIsAutoFillModalOpen(false)}
        roster={roster}
        currentPhase={phase}
        onApplyLineup={handleApplyAutoFill}
      />

      {/* 8. Rally Outcome & Side-Out Score Prompt Modal */}
      <RallyOutcomeModal
        isOpen={isRallyModalOpen}
        onClose={() => setIsRallyModalOpen(false)}
        phase={phase}
        rotation={rotation}
        lineup={lineup}
        roster={roster}
        currentScore={matchStats || { ourScore: 0, opponentScore: 0, setNumber: 1 }}
        onRallyWonByUs={onRallyWonByUs}
        onRallyWonByOpponent={onRallyWonByOpponent}
        onDirectAdvanceOnly={handleDirectAdvanceOnly}
      />
    </div>
  );
}
