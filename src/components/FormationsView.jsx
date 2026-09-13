import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCw,
  RotateCcw,
  Sparkles,
  Shield,
  ArrowRight,
  Compass,
  Check,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowLeftRight,
  Play,
  Film,
  Archive,
  ChevronDown,
  BookOpen,
  Layout
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
import confetti from 'canvas-confetti';
import { FORMATIONS_62_DATA } from '../services/formations62Data';
import { FORMATION_ANIMATIONS } from '../services/formationAnimationsData';
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
  detect62SubstitutionOpportunities
} from '../services/volleyballRules';
import FormationCanvas from './FormationCanvas';
import FormationAnimationPlayer from './FormationAnimationPlayer';
import FormationTacticsGuide from './FormationTacticsGuide';
import LiberoPromptModal from './LiberoPromptModal';
import LiberoServingPromptModal from './LiberoServingPromptModal';
import LiberoReentryPromptModal from './LiberoReentryPromptModal';
import SubModal from './SubModal';
import Formation62MismatchModal from './Formation62MismatchModal';
import AutoFillLineupModal from './AutoFillLineupModal';
import RallyOutcomeModal from './RallyOutcomeModal';

export default function FormationsView({
  roster = [],
  lineup = {},
  setLineup,
  startingLineup = {},
  setStartingLineup,
  rotation = 1,
  setRotation,
  phase = 'serve',
  setPhase,
  liberoExchanges = {},
  setLiberoExchanges,
  liberoServingRotation = null,
  setLiberoServingRotation,
  subHistory = [],
  setSubHistory,
  maxSubs = 12,
  enforcePositionLock = true,
  onSelectRotation,
  onUpdatePlayerPosition,
  onNavigateTab,
  matchStats,
  onRallyWonByUs,
  onRallyWonByOpponent,
  onStartNewSet,
  onArchiveMatch,
  onResetScore,
  onResetFullMatch
}) {
  const [showArrows, setShowArrows] = useState(true);
  const [customPositions, setCustomPositions] = useState({});
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [subTargetZone, setSubTargetZone] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isAutoFillModalOpen, setIsAutoFillModalOpen] = useState(false);
  const [isRallyModalOpen, setIsRallyModalOpen] = useState(false);
  const [isArchiveSuccess, setIsArchiveSuccess] = useState(false);

  // 6-2 System Positional Validation
  const validation62 = validate62Formation(lineup, roster);
  const [is62ModalOpen, setIs62ModalOpen] = useState(false);

  // Modal States for Rule Enforcement
  const [isLiberoPromptOpen, setIsLiberoPromptOpen] = useState(false);
  const [liberoViolationData, setLiberoViolationData] = useState(null);

  const [isServingPromptOpen, setIsServingPromptOpen] = useState(false);
  const [servingPromptData, setServingPromptData] = useState(null);

  const [isReentryPromptOpen, setIsReentryPromptOpen] = useState(false);
  const [reentryPromptData, setReentryPromptData] = useState(null);

  // Normalize phase name: 'receive' / 'receiving' vs 'serve' / 'serving'
  const isReceivePhase = phase === 'receive' || phase === 'receiving';
  const currentPhaseKey = isReceivePhase ? 'receiving' : 'serving';

  // 🎬 Tactical Rally Simulator Animation State (Defaulted to OFF)
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [formationsViewMode, setFormationsViewMode] = useState('board'); // 'board' | 'simulator' | 'guide'
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    };
    if (isToolsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isToolsOpen]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  const currentAnimRotationData = FORMATION_ANIMATIONS[rotation] || FORMATION_ANIMATIONS[1];
  const currentAnimPhaseData = currentAnimRotationData[currentPhaseKey] || currentAnimRotationData.receiving;
  const animStages = currentAnimPhaseData.stages || [];
  const currentStage = animStages[currentStageIndex] || animStages[0];

  // Auto-play interval timer
  useEffect(() => {
    let interval = null;
    if (isPlaying && isAnimationActive) {
      const stepDuration = Math.round(2400 / playbackSpeed);
      interval = setInterval(() => {
        setCurrentStageIndex(prev => {
          if (prev >= animStages.length - 1) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, stepDuration);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isAnimationActive, playbackSpeed, isLooping, animStages.length]);

  // Reset stage when rotation or phase changes
  useEffect(() => {
    setCurrentStageIndex(0);
  }, [rotation, currentPhaseKey]);

  // 💡 Smart 6-2 Substitution Opportunities State
  const [dismissedSubIds, setDismissedSubIds] = useState([]);

  useEffect(() => {
    setDismissedSubIds([]);
  }, [rotation, currentPhaseKey]);

  const smartSubOpportunities = detect62SubstitutionOpportunities(
    lineup,
    rotation,
    currentPhaseKey,
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

  const rotationData = FORMATIONS_62_DATA[rotation] || FORMATIONS_62_DATA[1];
  const defaultPositions = isReceivePhase
    ? rotationData?.receiving?.positions
    : rotationData?.serving?.positions;

  const currentKey = `${rotation}-${currentPhaseKey}`;
  const activePositions = isAnimationActive && currentStage
    ? currentStage.positions
    : (customPositions[currentKey] || defaultPositions || {});

  const getPlayer = (id) => roster.find(p => p.id === id);

  const assignedPlayerIds = Object.values(lineup).filter(Boolean);
  const benchPlayers = roster.filter(p => !assignedPlayerIds.includes(p.id));

  // Regular subs count (excluding Libero free exchanges)
  const regularSubsUsed = subHistory.filter(s => !s.isLiberoExchange).length;

  // Find team libero
  const teamLibero = roster.find(p => p.position === 'Libero' || p.isLibero);

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

  /**
   * Official Volleyball Rally & Side-Out Rotation Flow:
   * 1. When Serving -> Losing point switches team to Receive (same rotation).
   * 2. When Receiving -> Winning point (Side-Out) triggers Clockwise Rotation with full Libero rules validation and switches to Serve!
   */
  const handleAdvanceRally = () => {
    if (onRallyWonByUs && onRallyWonByOpponent) {
      setIsRallyModalOpen(true);
    } else {
      handleDirectAdvanceOnly();
    }
  };

  const handleDirectAdvanceOnly = () => {
    if (!isReceivePhase) {
      // Team was serving and lost serve -> switch to Receive (same rotation)
      setPhase && setPhase('receive');
    } else {
      // Team was receiving and won serve back -> execute rotation with rules validation
      handleNextRotation(true);
    }
  };

  /**
   * Clockwise Rotation Handler with Full Multi-Step Volleyball Rule Enforcement
   * @param {boolean} switchToServe - Whether to set phase to 'serve' after rotation
   */
  const handleNextRotation = (switchToServe = false) => {
    // Step 1: Check Libero Front-Row Rule 19.3.1 (Libero in Zone 5 rotating into Zone 4)
    const exitCheck = checkLiberoRotationViolation(lineup, roster, liberoExchanges);

    if (exitCheck.willViolate) {
      // Pause rotation & open Libero Front-Row Alert Modal
      setLiberoViolationData(exitCheck);
      setIsLiberoPromptOpen(true);
      return;
    }

    // Step 2: Check Libero Serving Rule 19.3.1.3 (Zone 1 Server Position)
    const nextRotationNum = rotation === 6 ? 1 : rotation + 1;
    const incomingServerId = lineup.pos2;
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
        if (switchToServe && setPhase) setPhase('serve');
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

    setLineup && setLineup(nextLineup);
    setRotation && setRotation(nextRot);
    if (switchToServe && setPhase) setPhase('serve');

    // Check Libero Back-Row Re-entry Opportunity (Rule 19.3.2)
    const isLiberoOnCourtNow = teamLibero ? Object.values(nextLineup).includes(teamLibero.id) : false;
    if (teamLibero && !isLiberoOnCourtNow) {
      const reentryCheck = checkLiberoReentryOpportunity(nextLineup, roster, liberoExchanges);
      if (reentryCheck.canReenter && reentryCheck.candidatePlayer) {
        setReentryPromptData(reentryCheck);
      }
    }
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
    setSubHistory && setSubHistory(prev => [newHistoryEntry, ...prev]);

    // Clear Libero replacement mapping
    setLiberoExchanges && setLiberoExchanges(prev => {
      const next = { ...prev };
      delete next[libero.id];
      return next;
    });

    setIsLiberoPromptOpen(false);
    setLiberoViolationData(null);

    const nextRotationNum = rotation === 6 ? 1 : rotation + 1;

    // Check if incoming server in Zone 1 triggers serving prompt
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
        setLineup && setLineup(nextLineup);
        setRotation && setRotation(nextRotationNum);
        return;
      }
    }

    executeDirectRotation(nextLineup, true);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
  };

  const handleApplyAutoFill = (newLineup, serveState) => {
    if (setLineup) setLineup(newLineup);
    if (setStartingLineup) setStartingLineup(newLineup);

    const liberoInLineup = Object.values(newLineup).find(id => {
      const p = roster.find(player => player.id === id);
      return p && (p.position === 'Libero' || p.isLibero);
    });
    if (liberoInLineup) {
      const mbOnBench = roster.find(p => p.position === 'Middle Blocker' && !Object.values(newLineup).includes(p.id));
      if (mbOnBench && setLiberoExchanges) {
        setLiberoExchanges({ [liberoInLineup]: mbOnBench.id });
      } else if (setLiberoExchanges) {
        setLiberoExchanges({});
      }
    } else if (setLiberoExchanges) {
      setLiberoExchanges({});
    }

    if (setRotation) setRotation(1);
    if (setPhase) setPhase(serveState);
    if (setLiberoServingRotation) setLiberoServingRotation(null);
    if (setSubHistory) setSubHistory([]);
    setReentryPromptData(null);
  };

  /**
   * Serving Decision Choice Handler
   */
  const handleChooseServer = (serverChoice) => {
    if (!servingPromptData) return;

    const { libero, regularPlayer, rotationNumber } = servingPromptData;
    const nextLineup = rotateLineupClockwise(lineup);

    if (serverChoice === 'libero') {
      // Put Libero in Zone 1 (Server)
      nextLineup.pos1 = libero.id;
      // Lock serving rotation position (Rule 19.3.1.3)
      setLiberoServingRotation && setLiberoServingRotation(rotationNumber);

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
      setSubHistory && setSubHistory(prev => [servingSubEntry, ...prev]);

      setLiberoExchanges && setLiberoExchanges(prev => ({
        ...prev,
        [libero.id]: regularPlayer.id
      }));

      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }

    setLineup && setLineup(nextLineup);
    setRotation && setRotation(rotationNumber);
    if (setPhase) setPhase('serve');
    setIsServingPromptOpen(false);
    setServingPromptData(null);
  };

  /**
   * Re-enter Libero for candidate back-row player
   */
  const handleConfirmLiberoReentry = () => {
    if (!reentryPromptData) return;

    const { libero, candidatePlayer, targetZone } = reentryPromptData;

    setLineup && setLineup(prev => ({
      ...prev,
      [targetZone]: libero.id
    }));

    setLiberoExchanges && setLiberoExchanges(prev => ({
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
    setSubHistory && setSubHistory(prev => [reentrySubEntry, ...prev]);

    setIsReentryPromptOpen(false);
    setReentryPromptData(null);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  };

  const handleSkipLiberoReentry = () => {
    setIsReentryPromptOpen(false);
    setReentryPromptData(null);
  };

  /**
   * Open Sub Modal from 6-1 Tab
   */
  const handleOpenSubModal = (zoneKey) => {
    setSubTargetZone(zoneKey);
    setIsSubModalOpen(true);
  };

  const handleExecuteSub = (zoneKey, incomingPlayer, outgoingPlayer, isLiberoExchange) => {
    setLineup && setLineup(prev => {
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
        setLiberoExchanges && setLiberoExchanges(prev => ({
          ...prev,
          [incomingPlayer.id]: outgoingPlayer.id
        }));
      }
      if (zoneKey === 'pos1' && liberoServingRotation === null) {
        setLiberoServingRotation && setLiberoServingRotation(rotation);
      }
    } else if (outgoingPlayer && (outgoingPlayer.position === 'Libero' || outgoingPlayer.isLibero)) {
      setLiberoExchanges && setLiberoExchanges(prev => {
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
    setSubHistory && setSubHistory(prev => [historyEntry, ...prev]);

    setIsSubModalOpen(false);
    setSubTargetZone(null);
  };

  const handlePositionsChange = (newPositions) => {
    setCustomPositions(prev => ({
      ...prev,
      [currentKey]: newPositions
    }));
  };

  const handleResetToStandard = () => {
    setCustomPositions(prev => {
      const next = { ...prev };
      delete next[currentKey];
      return next;
    });
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
  };

  const handleRotChange = (rNum) => {
    if (onSelectRotation) {
      onSelectRotation(rNum);
    } else if (setRotation) {
      setRotation(rNum);
    }
  };

  return (
    <div className="formations-view-container">
      {/* 🏐 Streamlined 6-2 Formations Live Command Strip */}
      <div className="live-command-strip">
        {/* Left: Rotation Navigation */}
        <div className="live-command-group">
          <div className="rotation-controls" style={{ gap: '0.35rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handlePrevRotation}
              title="Previous Rotation"
              style={{ padding: '0.35rem 0.55rem', borderRadius: '8px' }}
            >
              <RotateCcw size={14} />
            </button>
            <div className="rotation-indicator" style={{ fontSize: '1.05rem', padding: '0.25rem 0.65rem' }}>
              R{rotation}
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleNextRotation(false)}
              title="Next Rotation (Clockwise)"
              style={{ padding: '0.35rem 0.55rem', borderRadius: '8px' }}
            >
              <RotateCw size={14} />
            </button>
          </div>

          <div className="rotation-pill-group" style={{ padding: '2px', gap: '2px' }}>
            {[1, 2, 3, 4, 5, 6].map((rotNum) => (
              <button
                key={rotNum}
                className={`rot-select-pill ${rotation === rotNum ? 'active' : ''}`}
                onClick={() => handleRotChange(rotNum)}
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem' }}
                title={`Jump to Rotation #${rotNum}`}
              >
                R{rotNum}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Phase Toggle & Side-Out */}
        <div className="live-command-group">
          <div className="phase-toggle-group" style={{ padding: '2px', gap: '2px' }}>
            <button
              className={`phase-btn ${!isReceivePhase ? 'active-serve' : ''}`}
              onClick={() => setPhase && setPhase('serve')}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
            >
              <VolleyballIcon size={13} />
              <span>Serve</span>
            </button>
            <button
              className={`phase-btn ${isReceivePhase ? 'active-receive' : ''}`}
              onClick={() => setPhase && setPhase('receive')}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
            >
              <Shield size={13} />
              <span>Receive</span>
            </button>
          </div>

          <button
            className="btn btn-primary btn-sm rally-advance-btn"
            onClick={handleAdvanceRally}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              background: isReceivePhase
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderColor: isReceivePhase ? '#10b981' : '#3b82f6',
              boxShadow: isReceivePhase
                ? '0 3px 10px rgba(16, 185, 129, 0.35)'
                : '0 3px 10px rgba(59, 130, 246, 0.35)'
            }}
            title={isReceivePhase ? 'Side-Out: Rotate to next rotation and take serve' : 'Side-Out: Switch to receive in current rotation'}
          >
            {isReceivePhase ? (
              <>
                <span>Side-Out (Rotate)</span>
                <RotateCw size={13} />
              </>
            ) : (
              <>
                <span>Side-Out (Recv)</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>

        {/* Right: Mode Switcher & ⚙️ Tools Drawer */}
        <div className="live-command-group">
          {/* Segmented View Switcher */}
          <div className="segmented-view-control">
            <button
              type="button"
              className={`segmented-view-btn ${formationsViewMode === 'board' ? 'active' : ''}`}
              onClick={() => {
                setFormationsViewMode('board');
                setIsAnimationActive(false);
                setIsPlaying(false);
              }}
              title="Interactive Court Board"
            >
              <Layout size={13} />
              <span>Board</span>
            </button>

            <button
              type="button"
              className={`segmented-view-btn ${formationsViewMode === 'simulator' ? 'active' : ''}`}
              onClick={() => {
                setFormationsViewMode('simulator');
                setIsAnimationActive(true);
              }}
              title="Animated Rally Simulator"
            >
              <VolleyballIcon size={13} className={isPlaying ? 'anim-spin' : ''} />
              <span>Simulator</span>
            </button>

            <button
              type="button"
              className={`segmented-view-btn ${formationsViewMode === 'guide' ? 'active' : ''}`}
              onClick={() => {
                setFormationsViewMode('guide');
                setIsAnimationActive(false);
                setIsPlaying(false);
              }}
              title="Coaching Tactics & Overlap Rules Guide"
            >
              <BookOpen size={13} />
              <span>Tactics</span>
            </button>
          </div>

          {/* 6-2 Status Badge */}
          <button
            type="button"
            className="btn-icon btn-sm"
            onClick={() => setIs62ModalOpen(true)}
            style={{
              background: validation62.isValid62 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${validation62.isValid62 ? '#10b981' : '#f59e0b'}`,
              color: validation62.isValid62 ? '#34d399' : '#f59e0b',
              padding: '0.35rem',
              borderRadius: '8px'
            }}
            title={validation62.isValid62 ? '6-2 Formation Verified (Click for details)' : '6-2 Mismatch Detected (Click to fix)'}
          >
            {validation62.isValid62 ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          </button>

          {/* Tools Menu */}
          <div className="live-action-menu-wrapper" ref={toolsMenuRef}>
            <button
              type="button"
              className="live-action-menu-btn"
              onClick={() => setIsToolsOpen(prev => !prev)}
              title="Tactical Options & Tools"
            >
              <Sparkles size={13} />
              <span>Tools</span>
              <ChevronDown size={13} style={{ transform: isToolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isToolsOpen && (
              <div className="live-action-dropdown">
                <div className="live-action-group-title">Board Display</div>
                <button
                  type="button"
                  className="live-action-item"
                  onClick={() => {
                    setIsToolsOpen(false);
                    setShowArrows(prev => !prev);
                  }}
                >
                  {showArrows ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#38bdf8" />}
                  <span>{showArrows ? 'Hide Movement Arrows' : 'Show Movement Arrows'}</span>
                </button>

                <button
                  type="button"
                  className="live-action-item"
                  onClick={() => {
                    setIsToolsOpen(false);
                    handleResetToStandard();
                  }}
                >
                  <RefreshCw size={14} color="#60a5fa" />
                  <span>Reset to Textbook 6-2</span>
                </button>

                <div className="live-action-group-title" style={{ marginTop: '0.25rem' }}>Lineup & Roles</div>
                <button
                  type="button"
                  className="live-action-item"
                  onClick={() => {
                    setIsToolsOpen(false);
                    setIsAutoFillModalOpen(true);
                  }}
                >
                  <Sparkles size={14} color="#f59e0b" />
                  <span>Auto-Fill 6-2 System</span>
                </button>

                <button
                  type="button"
                  className="live-action-item"
                  onClick={() => {
                    setIsToolsOpen(false);
                    if (onNavigateTab) onNavigateTab('court');
                  }}
                >
                  <Move size={14} color="#c084fc" />
                  <span>Drag & Drop Rotations</span>
                </button>

                <div className="live-action-group-title" style={{ marginTop: '0.25rem' }}>Match Actions</div>
                <button
                  type="button"
                  className="live-action-item"
                  onClick={() => {
                    setIsToolsOpen(false);
                    handleFinishSetClick();
                  }}
                >
                  <Check size={14} color="#34d399" />
                  <span>Finish Set & Next</span>
                </button>

                <button
                  type="button"
                  className="live-action-item"
                  onClick={() => {
                    setIsToolsOpen(false);
                    handleArchiveMatchClick();
                  }}
                >
                  <Archive size={14} color="#60a5fa" />
                  <span>Save to History Archive</span>
                </button>
              </div>
            )}
          </div>
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

      {/* 💡 6-1 Smart Substitution Tactical Prompt Banner */}
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
          boxShadow: '0 4px 18px rgba(245, 158, 11, 0.25)'
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

      {/* Main 2-Column Tactical Layout */}
      {/* Main Tactical Display Area */}
      {formationsViewMode === 'guide' ? (
        <div className="tactics-column" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <FormationTacticsGuide
            rotationData={rotationData}
            phase={currentPhaseKey}
            rotation={rotation}
            lineup={lineup}
            roster={roster}
          />
        </div>
      ) : (
        <div className="formations-grid-layout" style={{ gridTemplateColumns: '1fr' }}>
          <div className="canvas-column" style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
            {/* Rally Simulator Multi-Stage Transport Bar */}
            {formationsViewMode === 'simulator' && (
              <div style={{ marginBottom: '0.65rem' }}>
                <FormationAnimationPlayer
                  rotation={rotation}
                  phase={currentPhaseKey}
                  currentStageIndex={currentStageIndex}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  isLooping={isLooping}
                  onStageChange={(idx) => setCurrentStageIndex(idx)}
                  onPlayPauseToggle={() => setIsPlaying(prev => !prev)}
                  onReset={() => {
                    setIsPlaying(false);
                    setCurrentStageIndex(0);
                  }}
                  onSpeedChange={(spd) => setPlaybackSpeed(spd)}
                  onLoopToggle={() => setIsLooping(prev => !prev)}
                />
              </div>
            )}

            <FormationCanvas
              positions={activePositions}
              arrows={isReceivePhase ? rotationData?.receiving?.arrows : rotationData?.serving?.arrows}
              roster={roster}
              lineup={lineup}
              liberoExchanges={liberoExchanges}
              phase={currentPhaseKey}
              rotation={rotation}
              onPositionsChange={handlePositionsChange}
              onTokenClick={(zoneKey) => handleOpenSubModal(zoneKey)}
              showTacticalArrows={showArrows}
              isAnimationActive={formationsViewMode === 'simulator'}
              animationStage={currentStage}
              playbackSpeed={playbackSpeed}
              ball={currentStage ? currentStage.ball : null}
            />
          </div>
        </div>
      )}

      {/* Rule Modals */}
      {/* 1. Libero Front-Row Exit Prompt Modal */}
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

      {/* 4. Substitution Modal */}
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

      {/* 5. 6-2 Formation Positional Alignment Modal */}
      <Formation62MismatchModal
        isOpen={is62ModalOpen}
        onClose={() => setIs62ModalOpen(false)}
        validation={validation62}
        lineup={lineup}
        roster={roster}
        onApplyAutoCorrection={(new62Lineup) => setLineup && setLineup(new62Lineup)}
        onUpdatePlayerPosition={onUpdatePlayerPosition}
        onOpenSubModal={handleOpenSubModal}
      />

      {/* 6. Smart Auto-Fill Starting 6 Lineup Modal */}
      <AutoFillLineupModal
        isOpen={isAutoFillModalOpen}
        onClose={() => setIsAutoFillModalOpen(false)}
        roster={roster}
        currentPhase={phase}
        onApplyLineup={handleApplyAutoFill}
      />

      {/* 7. Rally Outcome & Side-Out Score Prompt Modal */}
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
