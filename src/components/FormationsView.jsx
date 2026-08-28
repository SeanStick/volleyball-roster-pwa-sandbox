import React, { useState } from 'react';
import {
  RotateCw,
  RotateCcw,
  Sparkles,
  Shield,
  Volleyball,
  ArrowRight,
  Compass,
  Check,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowLeftRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FORMATIONS_61_DATA } from '../services/formations61Data';
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
  validate61Formation
} from '../services/volleyballRules';
import FormationCanvas from './FormationCanvas';
import FormationTacticsGuide from './FormationTacticsGuide';
import LiberoPromptModal from './LiberoPromptModal';
import LiberoServingPromptModal from './LiberoServingPromptModal';
import LiberoReentryPromptModal from './LiberoReentryPromptModal';
import SubModal from './SubModal';
import Formation61MismatchModal from './Formation61MismatchModal';
import AutoFillLineupModal from './AutoFillLineupModal';

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
  onNavigateTab
}) {
  const [showArrows, setShowArrows] = useState(true);
  const [customPositions, setCustomPositions] = useState({});
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [subTargetZone, setSubTargetZone] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isAutoFillModalOpen, setIsAutoFillModalOpen] = useState(false);

  // 6-1 System Positional Validation
  const validation61 = validate61Formation(lineup, roster);
  const [is61ModalOpen, setIs61ModalOpen] = useState(false);

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

  const rotationData = FORMATIONS_61_DATA[rotation] || FORMATIONS_61_DATA[1];
  const defaultPositions = isReceivePhase
    ? rotationData?.receiving?.positions
    : rotationData?.serving?.positions;

  const currentKey = `${rotation}-${currentPhaseKey}`;
  const activePositions = customPositions[currentKey] || defaultPositions || {};

  const getPlayer = (id) => roster.find(p => p.id === id);

  const assignedPlayerIds = Object.values(lineup).filter(Boolean);
  const benchPlayers = roster.filter(p => !assignedPlayerIds.includes(p.id));

  // Regular subs count (excluding Libero free exchanges)
  const regularSubsUsed = subHistory.filter(s => !s.isLiberoExchange).length;

  // Find team libero
  const teamLibero = roster.find(p => p.position === 'Libero' || p.isLibero);

  /**
   * Official Volleyball Rally & Side-Out Rotation Flow on 6-1 Tab:
   * 1. When Serving -> Losing point switches team to Receive (same rotation).
   * 2. When Receiving -> Winning point (Side-Out) triggers Clockwise Rotation with full Libero rules validation and switches to Serve!
   */
  const handleAdvanceRally = () => {
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
      {/* Top Controls Header */}
      <div className="formations-header">
        {/* Rotation Selector (1 to 6) */}
        <div className="formations-rotation-bar">
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Rotation:
          </span>
          <div className="rotation-pill-group">
            {[1, 2, 3, 4, 5, 6].map((rotNum) => (
              <button
                key={rotNum}
                className={`rot-select-pill ${rotation === rotNum ? 'active' : ''}`}
                onClick={() => handleRotChange(rotNum)}
                title={`Jump to Rotation #${rotNum}`}
              >
                R{rotNum}
              </button>
            ))}
          </div>
        </div>

        {/* Phase Controls: Serving first, then Receiving, plus Side-Out Advance Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Phase Toggle: Serving first, then Receiving */}
          <div className="phase-toggle-group">
            <button
              className={`phase-btn ${!isReceivePhase ? 'active-serve' : ''}`}
              onClick={() => setPhase && setPhase('serve')}
            >
              <Volleyball size={16} />
              <span>Serving (Base Defense)</span>
            </button>

            <button
              className={`phase-btn ${isReceivePhase ? 'active-receive' : ''}`}
              onClick={() => setPhase && setPhase('receive')}
            >
              <Shield size={16} />
              <span>Serve Receive (Stack)</span>
            </button>
          </div>

          {/* Side-Out / Next Rally Advance Button */}
          <button
            className="btn btn-primary btn-sm rally-advance-btn"
            onClick={handleAdvanceRally}
            style={{
              background: isReceivePhase
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderColor: isReceivePhase ? '#10b981' : '#3b82f6',
              boxShadow: isReceivePhase
                ? '0 4px 14px rgba(16, 185, 129, 0.4)'
                : '0 4px 14px rgba(59, 130, 246, 0.4)'
            }}
            title={isReceivePhase ? 'Side-Out: Rotate clockwise to next rotation and take serve' : 'Lost Serve: Switch to receive in current rotation'}
          >
            {isReceivePhase ? (
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

        {/* Action Tools */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* 6-1 System Positional Status Banner */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIs61ModalOpen(true)}
            style={{
              background: validation61.isValid61
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(245, 158, 11, 0.18)',
              borderColor: validation61.isValid61
                ? 'rgba(16, 185, 129, 0.4)'
                : '#f59e0b',
              color: validation61.isValid61 ? '#a7f3d0' : '#fde68a',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            title="Click to view 6-1 volleyball positional alignment and player roles"
          >
            {validation61.isValid61 ? (
              <>
                <CheckCircle size={15} color="#10b981" />
                <span>6-1 Verified</span>
              </>
            ) : (
              <>
                <AlertTriangle size={15} color="#f59e0b" />
                <span>6-1 Mismatch (Tap to Fix)</span>
              </>
            )}
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab && onNavigateTab('court')}
            title="Jump to Court Lineup tab to customize starting rotation via Drag & Drop"
          >
            <span>✋ Drag & Drop Rotations</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsAutoFillModalOpen(true)}
            title="Auto-fill official 6-1 starting lineup with Serve 1st / Receive 1st options"
          >
            <Sparkles size={14} color="var(--accent-orange)" />
            <span>Auto-Fill 6-1</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowArrows(prev => !prev)}
            title={showArrows ? 'Hide movement arrows' : 'Show movement arrows'}
          >
            {showArrows ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showArrows ? 'Hide Arrows' : 'Show Arrows'}</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleResetToStandard}
            title="Reset player circles to textbook 6-1 positions"
          >
            <RefreshCw size={14} />
            <span>Reset to Standard</span>
          </button>
        </div>
      </div>

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
      <div className="formations-grid-layout">
        {/* Left Column: Interactive Hardwood Floor Canvas */}
        <div className="canvas-column">
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
          />
        </div>

        {/* Right Column: Tactics & Overlap Rules Guide */}
        <div className="tactics-column">
          <FormationTacticsGuide
            rotationData={rotationData}
            phase={currentPhaseKey}
            rotation={rotation}
            lineup={lineup}
            roster={roster}
          />
        </div>
      </div>

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

      {/* 5. 6-1 Formation Positional Alignment Modal */}
      <Formation61MismatchModal
        isOpen={is61ModalOpen}
        onClose={() => setIs61ModalOpen(false)}
        validation={validation61}
        lineup={lineup}
        roster={roster}
        onApplyAutoCorrection={(new61Lineup) => setLineup && setLineup(new61Lineup)}
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
    </div>
  );
}
