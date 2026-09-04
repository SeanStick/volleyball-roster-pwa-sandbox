import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Shield,
  Volleyball,
  CheckCircle2,
  AlertTriangle,
  Users,
  RotateCcw,
  Save,
  Trash2,
  Check,
  Plus,
  ArrowRight,
  ArrowLeftRight,
  Flame,
  Activity,
  HeartCrack,
  Info,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  FRONT_ROW_ZONES,
  BACK_ROW_ZONES,
  ZONE_LABELS,
  validate62Formation
} from '../services/volleyballRules';
import {
  aggregatePlayerStats,
  computePositionFitScore,
  generateOptimal62Lineup,
  findBestSubReplacement
} from '../services/lineupAnalyticsService';

// Color accents for 6-2 pairs across the court
const PAIR_COLORS = {
  pair1: { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.18)', badge: '#c084fc', name: 'Setters (1 ⇄ 4)' },
  pair2: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.18)', badge: '#93c5fd', name: 'Outsides (2 ⇄ 5)' },
  pair3: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.18)', badge: '#fcd34d', name: 'Middles (3 ⇄ 6)' }
};

export default function LineupStudioModal({
  isOpen,
  onClose,
  roster = [],
  currentLineup = {},
  currentStartingLineup = {},
  matchStats = null,
  matchHistory = [],
  savedPresets = [],
  onSavePreset,
  onDeletePreset,
  onApplyLineup,
  onUpdateRosterPlayer
}) {
  // Active editing lineup
  const [lineup, setLineup] = useState({
    pos1: null,
    pos2: null,
    pos3: null,
    pos4: null,
    pos5: null,
    pos6: null
  });

  const [selectedLiberoId, setSelectedLiberoId] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null); // 'pos1'..'pos6' or 'libero'
  const [activePresetId, setActivePresetId] = useState(null);

  // Preset modal
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');

  // Availability Manager Drawer
  const [showAvailabilityDrawer, setShowAvailabilityDrawer] = useState(false);

  // Initialize from current lineup when opened
  useEffect(() => {
    if (isOpen) {
      const initial = currentStartingLineup?.pos1 ? currentStartingLineup : (currentLineup?.pos1 ? currentLineup : {});
      setLineup({
        pos1: initial.pos1 || null,
        pos2: initial.pos2 || null,
        pos3: initial.pos3 || null,
        pos4: initial.pos4 || null,
        pos5: initial.pos5 || null,
        pos6: initial.pos6 || null
      });

      // Find initial libero
      const initialLibero = roster.find(p => p.position === 'Libero' || p.isLibero);
      setSelectedLiberoId(initialLibero?.id || null);
      setSelectedZone('pos1');
      setIsSavingPreset(false);
      setShowAvailabilityDrawer(false);
    }
  }, [isOpen, currentLineup, currentStartingLineup, roster]);

  // Aggregate stats from history & current match
  const statsMap = useMemo(() => {
    return aggregatePlayerStats(roster, matchHistory, matchStats);
  }, [roster, matchHistory, matchStats]);

  // Real-time 6-2 and Volleyball Rules Validation
  const validation = useMemo(() => {
    return validate62Formation(lineup, roster);
  }, [lineup, roster]);

  if (!isOpen) return null;

  const getPlayer = (id) => roster.find(p => p.id === id);

  // Identify pair color for each zone in 6-2
  const getZonePairInfo = (zoneKey) => {
    if (zoneKey === 'pos1' || zoneKey === 'pos4') return PAIR_COLORS.pair1;
    if (zoneKey === 'pos2' || zoneKey === 'pos5') return PAIR_COLORS.pair2;
    if (zoneKey === 'pos3' || zoneKey === 'pos6') return PAIR_COLORS.pair3;
    return { border: 'rgba(255,255,255,0.1)', bg: 'rgba(255,255,255,0.03)', badge: '#fff' };
  };

  const getTargetRoleForZone = (zoneKey) => {
    if (zoneKey === 'pos1' || zoneKey === 'pos4') return 'setter';
    if (zoneKey === 'pos2' || zoneKey === 'pos5') return 'outside';
    if (zoneKey === 'pos3' || zoneKey === 'pos6') return 'middle';
    return 'libero';
  };

  // Assign player to active zone
  const handleSelectPlayerForZone = (playerId) => {
    if (!selectedZone) return;

    if (selectedZone === 'libero') {
      setSelectedLiberoId(playerId);
      setSelectedZone(null);
      return;
    }

    // Check if player is already in another zone; if so, swap them!
    const existingZone = Object.keys(lineup).find(k => lineup[k] === playerId && k !== selectedZone);
    if (existingZone) {
      setLineup(prev => ({
        ...prev,
        [existingZone]: prev[selectedZone],
        [selectedZone]: playerId
      }));
    } else {
      setLineup(prev => ({
        ...prev,
        [selectedZone]: playerId
      }));
    }

    // Move to next unfilled zone or keep open
    const allZones = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6'];
    const nextUnfilled = allZones.find(z => z !== selectedZone && !lineup[z]);
    if (nextUnfilled) {
      setSelectedZone(nextUnfilled);
    }
  };

  // 1-Tap Auto-Correct to 6-2
  const handleApplyAutoFix = () => {
    if (validation.autoCorrectLineup) {
      setLineup(validation.autoCorrectLineup);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.3 } });
    }
  };

  // 1-Tap Smart Statistical Recommendation
  const handleSmartStatSuggest = () => {
    const optimal = generateOptimal62Lineup(roster, matchHistory, matchStats);
    setLineup(optimal.lineup);
    if (optimal.liberoId) setSelectedLiberoId(optimal.liberoId);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.35 } });
  };

  // 1-Tap Auto-Substitute for an injured/absent player in a zone
  const handleAutoSubstitute = (zoneKey) => {
    const bestReplacement = findBestSubReplacement(zoneKey, lineup, roster, matchHistory, matchStats);
    if (bestReplacement) {
      setLineup(prev => ({
        ...prev,
        [zoneKey]: bestReplacement.player.id
      }));
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.4 } });
    }
  };

  // Save Preset Action
  const handleConfirmSavePreset = () => {
    if (!newPresetName.trim()) return;
    onSavePreset(newPresetName.trim(), lineup, selectedLiberoId, newPresetDesc.trim());
    setNewPresetName('');
    setNewPresetDesc('');
    setIsSavingPreset(false);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.3 } });
  };

  // Load Preset
  const handleLoadPreset = (preset) => {
    if (!preset || !preset.lineup) return;
    setLineup({ ...preset.lineup });
    if (preset.liberoId) setSelectedLiberoId(preset.liberoId);
    setActivePresetId(preset.id);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.3 } });
  };

  // Apply Lineup to Match
  const handleApplyToMatch = () => {
    onApplyLineup(lineup, selectedLiberoId);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
    onClose();
  };

  // Filter candidates for selected zone
  const targetRole = selectedZone ? getTargetRoleForZone(selectedZone) : null;
  const candidateList = useMemo(() => {
    if (!selectedZone) return [];

    const isLiberoSlot = selectedZone === 'libero';
    const isFrontRow = selectedZone === 'pos2' || selectedZone === 'pos3' || selectedZone === 'pos4';

    return roster.map(player => {
      const pStats = statsMap[player.id] || {};
      const fitScore = computePositionFitScore(player, targetRole, statsMap);
      const isCurrentlyInZone = isLiberoSlot ? selectedLiberoId === player.id : lineup[selectedZone] === player.id;
      const isAlreadyOnCourt = Object.values(lineup).includes(player.id) && !isCurrentlyInZone;
      const isLiberoRuleBlocked = isFrontRow && (player.position === 'Libero' || player.isLibero);

      return {
        player,
        stats: pStats,
        fitScore,
        isCurrentlyInZone,
        isAlreadyOnCourt,
        isLiberoRuleBlocked,
        isUnavailable: player.status === 'Injured' || player.status === 'Absent' || player.status === 'Out'
      };
    }).sort((a, b) => {
      if (a.isCurrentlyInZone) return -1;
      if (b.isCurrentlyInZone) return 1;
      if (a.isLiberoRuleBlocked && !b.isLiberoRuleBlocked) return 1;
      if (!a.isLiberoRuleBlocked && b.isLiberoRuleBlocked) return -1;
      return b.fitScore - a.fitScore;
    });
  }, [selectedZone, roster, lineup, selectedLiberoId, targetRole, statsMap]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1450,
        padding: '0.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 10, 20, 0.9)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '96dvh',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1.5px solid rgba(168, 85, 247, 0.5)',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(168, 85, 247, 0.25)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* =========================================================================
            STUDIO HEADER
           ========================================================================= */}
        <div
          style={{
            padding: '0.85rem 1.15rem',
            background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(30, 58, 138, 0.4))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)'
              }}
            >
              <Volleyball size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#ffffff' }}>
                6-2 Lineup Studio
              </div>
              <div style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 700 }}>
                Intelligent Rotational Pairing & Stat Optimizer
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setShowAvailabilityDrawer(!showAvailabilityDrawer)}
              style={{
                background: showAvailabilityDrawer ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                border: showAvailabilityDrawer ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '999px',
                padding: '0.25rem 0.6rem',
                color: showAvailabilityDrawer ? '#fca5a5' : '#cbd5e1',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Toggle player injury & absence statuses"
            >
              <HeartCrack size={12} />
              <span>Availability</span>
            </button>

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
        </div>

        {/* =========================================================================
            PRESETS HORIZONTAL CHIP BAR
           ========================================================================= */}
        <div
          style={{
            padding: '0.45rem 0.85rem',
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            overflowX: 'auto',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, whiteSpace: 'nowrap' }}>
            Presets:
          </span>

          {savedPresets.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: isActive ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(124, 58, 237, 0.25))' : 'rgba(255, 255, 255, 0.05)',
                  border: isActive ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  padding: '0.2rem 0.6rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  gap: '0.35rem'
                }}
              >
                <span
                  onClick={() => handleLoadPreset(preset)}
                  style={{ fontSize: '0.74rem', fontWeight: 800, color: isActive ? '#e9d5ff' : '#cbd5e1' }}
                >
                  {preset.name}
                </span>

                {onDeletePreset && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePreset(preset.id);
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0 0.1rem' }}
                    title="Delete preset"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setIsSavingPreset(!isSavingPreset)}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '999px',
              padding: '0.2rem 0.55rem',
              color: '#93c5fd',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Plus size={12} />
            <span>Save New</span>
          </button>
        </div>

        {/* Save Preset Inline Form */}
        {isSavingPreset && (
          <div
            style={{
              padding: '0.65rem 1rem',
              background: 'rgba(30, 58, 138, 0.3)',
              borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            <input
              type="text"
              placeholder="Preset Name (e.g. Tournament 6-2 A)"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              style={{
                flex: 1,
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                color: '#fff',
                fontSize: '0.8rem'
              }}
            />
            <button
              type="button"
              onClick={handleConfirmSavePreset}
              style={{
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsSavingPreset(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* =========================================================================
            AVAILABILITY & INJURY TOGGLE DRAWER
           ========================================================================= */}
        {showAvailabilityDrawer && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.4)',
              maxHeight: '180px',
              overflowY: 'auto',
              flexShrink: 0
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fca5a5', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <HeartCrack size={14} />
              <span>Player Availability / Injury Check (Tap to toggle status)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '0.4rem' }}>
              {roster.map(player => {
                const isInjured = player.status === 'Injured' || player.status === 'Absent' || player.status === 'Out';
                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => {
                      const nextStatus = isInjured ? 'Active' : 'Injured';
                      onUpdateRosterPlayer(player.id, { status: nextStatus });
                    }}
                    style={{
                      padding: '0.35rem 0.55rem',
                      borderRadius: '8px',
                      border: isInjured ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isInjured ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: isInjured ? '#fca5a5' : '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      #{player.number} {player.name}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 900, color: isInjured ? '#ef4444' : '#10b981', marginLeft: '0.25rem' }}>
                      {isInjured ? 'OUT' : 'OK'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            RULES & 6-2 VALIDATION GUIDANCE BANNER
           ========================================================================= */}
        <div
          style={{
            padding: '0.65rem 1rem',
            background: validation.isValid62
              ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.08))'
              : 'linear-gradient(90deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.12))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            {validation.isValid62 ? (
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
            ) : (
              <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
            )}

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: validation.isValid62 ? '#6ee7b7' : '#fcd34d' }}>
                {validation.isValid62 ? 'Textbook 6-2 Formation Aligned ✓' : 'Formation / Rules Guidance'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {validation.isValid62
                  ? 'Setters 1⇄4, Outsides 2⇄5, Middles 3⇄6. Fully compliant with USAV / NFHS rules.'
                  : (validation.issues[0]?.message || 'Adjust player zones to complete 6-2 alignment.')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            {!validation.isValid62 && (
              <button
                type="button"
                onClick={handleApplyAutoFix}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.35rem 0.65rem',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Sparkles size={12} />
                <span>Auto-Fix 6-2</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSmartStatSuggest}
              style={{
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                color: '#ffffff',
                fontSize: '0.74rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)'
              }}
              title="Suggest starting 6-2 lineup based on past match stats"
            >
              <Flame size={12} />
              <span>Smart Suggest</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN CONTENT: COURT CANVAS & PLAYER DRAWER
           ========================================================================= */}
        <div style={{ padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* VISUAL 6-ZONE COURT */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '0.75rem',
              position: 'relative'
            }}
          >
            {/* Net Header Line */}
            <div
              style={{
                textAlign: 'center',
                padding: '0.2rem',
                borderBottom: '2.5px dashed rgba(255, 255, 255, 0.35)',
                marginBottom: '0.65rem',
                fontSize: '0.68rem',
                fontWeight: 900,
                color: '#94a3b8',
                letterSpacing: '0.1em'
              }}
            >
              🏐 NET / OPPONENT SIDE 🏐
            </div>

            {/* FRONT ROW: Zones 4 (LF), 3 (MF), 2 (RF) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {['pos4', 'pos3', 'pos2'].map(zoneKey => {
                const player = getPlayer(lineup[zoneKey]);
                const isSelected = selectedZone === zoneKey;
                const pair = getZonePairInfo(zoneKey);
                const pStats = player ? statsMap[player.id] : null;
                const isInjured = player && (player.status === 'Injured' || player.status === 'Absent' || player.status === 'Out');

                return (
                  <div
                    key={zoneKey}
                    onClick={() => setSelectedZone(zoneKey)}
                    style={{
                      background: isSelected ? pair.bg : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? `2px solid ${pair.border}` : isInjured ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '14px',
                      padding: '0.6rem 0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      minHeight: '88px',
                      position: 'relative',
                      boxShadow: isSelected ? `0 0 15px ${pair.border}40` : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: 900, color: pair.badge, marginBottom: '0.2rem' }}>
                      Zone {ZONE_LABELS[zoneKey]?.num} ({ZONE_LABELS[zoneKey]?.name.split(' ')[0]})
                    </div>

                    {player ? (
                      <>
                        <div style={{ fontSize: '0.85rem', fontWeight: 950, color: '#ffffff', lineHeight: 1.15 }}>
                          #{player.number} {player.name.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                          {player.position}
                        </div>
                        {pStats && (pStats.kills > 0 || pStats.aces > 0) && (
                          <div style={{ fontSize: '0.64rem', color: '#6ee7b7', fontWeight: 800, marginTop: '0.2rem' }}>
                            {pStats.kills > 0 ? `${pStats.kills} Kills` : `${pStats.aces} Aces`}
                          </div>
                        )}
                        {isInjured && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAutoSubstitute(zoneKey);
                            }}
                            style={{
                              marginTop: '0.25rem',
                              background: '#ef4444',
                              color: '#fff',
                              borderRadius: '4px',
                              padding: '0.1rem 0.35rem',
                              fontSize: '0.62rem',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem'
                            }}
                          >
                            <span>Sub Out</span>
                            <ArrowRight size={10} />
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.6rem' }}>
                        + Assign
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 3M Attack Line Divider */}
            <div
              style={{
                height: '1px',
                background: 'rgba(255, 255, 255, 0.15)',
                margin: '0.4rem 0',
                position: 'relative',
                textAlign: 'center'
              }}
            >
              <span style={{ position: 'absolute', top: '-7px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', padding: '0 0.4rem', fontSize: '0.6rem', color: '#64748b' }}>
                10-FT / 3M ATTACK LINE
              </span>
            </div>

            {/* BACK ROW: Zones 5 (LB), 6 (MB), 1 (RB - Server) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
              {['pos5', 'pos6', 'pos1'].map(zoneKey => {
                const player = getPlayer(lineup[zoneKey]);
                const isSelected = selectedZone === zoneKey;
                const pair = getZonePairInfo(zoneKey);
                const pStats = player ? statsMap[player.id] : null;
                const isInjured = player && (player.status === 'Injured' || player.status === 'Absent' || player.status === 'Out');

                return (
                  <div
                    key={zoneKey}
                    onClick={() => setSelectedZone(zoneKey)}
                    style={{
                      background: isSelected ? pair.bg : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? `2px solid ${pair.border}` : isInjured ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '14px',
                      padding: '0.6rem 0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      minHeight: '88px',
                      position: 'relative',
                      boxShadow: isSelected ? `0 0 15px ${pair.border}40` : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: 900, color: pair.badge, marginBottom: '0.2rem' }}>
                      Zone {ZONE_LABELS[zoneKey]?.num} {zoneKey === 'pos1' ? '★ Server' : `(${ZONE_LABELS[zoneKey]?.name.split(' ')[0]})`}
                    </div>

                    {player ? (
                      <>
                        <div style={{ fontSize: '0.85rem', fontWeight: 950, color: '#ffffff', lineHeight: 1.15 }}>
                          #{player.number} {player.name.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                          {player.position}
                        </div>
                        {pStats && (pStats.kills > 0 || pStats.aces > 0) && (
                          <div style={{ fontSize: '0.64rem', color: '#6ee7b7', fontWeight: 800, marginTop: '0.2rem' }}>
                            {pStats.kills > 0 ? `${pStats.kills} Kills` : `${pStats.aces} Aces`}
                          </div>
                        )}
                        {isInjured && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAutoSubstitute(zoneKey);
                            }}
                            style={{
                              marginTop: '0.25rem',
                              background: '#ef4444',
                              color: '#fff',
                              borderRadius: '4px',
                              padding: '0.1rem 0.35rem',
                              fontSize: '0.62rem',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem'
                            }}
                          >
                            <span>Sub Out</span>
                            <ArrowRight size={10} />
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.6rem' }}>
                        + Assign
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* LIBERO OFF-COURT SLOT */}
            <div
              onClick={() => setSelectedZone('libero')}
              style={{
                marginTop: '0.75rem',
                background: selectedZone === 'libero' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.65)',
                border: selectedZone === 'libero' ? '2px solid #3b82f6' : '1px dashed rgba(59, 130, 246, 0.4)',
                borderRadius: '12px',
                padding: '0.55rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Shield size={16} color="#3b82f6" />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#93c5fd' }}>
                    Libero Exchange Specialist (Back Row)
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    Replaces Middle 2 (Zone 6) when rotating to back row
                  </div>
                </div>
              </div>

              <div>
                {selectedLiberoId ? (
                  <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff', background: 'rgba(59, 130, 246, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>
                    #{getPlayer(selectedLiberoId)?.number} {getPlayer(selectedLiberoId)?.name}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>+ Pick Libero</span>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              CANDIDATE PLAYER SELECTOR SHEET (FOR SELECTED ZONE)
             ========================================================================= */}
          {selectedZone && (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                padding: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff' }}>
                    Select Player for {selectedZone === 'libero' ? 'Libero Slot' : `Zone ${ZONE_LABELS[selectedZone]?.num} (${ZONE_LABELS[selectedZone]?.name})`}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    Target Role: <strong style={{ color: '#c084fc' }}>{targetRole?.toUpperCase()}</strong> • Ranked by past game stats & position fit
                  </div>
                </div>

                <span style={{ fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 800 }}>
                  ★ Stat Match
                </span>
              </div>

              {/* Player Candidates Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {candidateList.map(({ player, stats, fitScore, isCurrentlyInZone, isAlreadyOnCourt, isLiberoRuleBlocked, isUnavailable }) => {
                  return (
                    <div
                      key={player.id}
                      onClick={() => {
                        if (!isLiberoRuleBlocked) {
                          handleSelectPlayerForZone(player.id);
                        }
                      }}
                      style={{
                        padding: '0.55rem',
                        borderRadius: '12px',
                        border: isCurrentlyInZone ? '2px solid #10b981' : isLiberoRuleBlocked ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isCurrentlyInZone
                          ? 'rgba(16, 185, 129, 0.2)'
                          : isLiberoRuleBlocked
                          ? 'rgba(239, 68, 68, 0.08)'
                          : 'rgba(255, 255, 255, 0.03)',
                        cursor: isLiberoRuleBlocked ? 'not-allowed' : 'pointer',
                        opacity: isLiberoRuleBlocked ? 0.6 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff' }}>
                          #{player.number} {player.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            padding: '0.1rem 0.35rem',
                            borderRadius: '6px',
                            background: fitScore >= 70 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                            color: fitScore >= 70 ? '#6ee7b7' : '#94a3b8'
                          }}
                        >
                          {fitScore}% Fit
                        </span>
                      </div>

                      <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>
                        {player.position} {player.secondaryPosition ? `• ${player.secondaryPosition}` : ''}
                      </div>

                      {/* Stat Metrics Badge */}
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'flex', gap: '0.4rem', marginTop: '0.1rem' }}>
                        {stats.kills > 0 && <span style={{ color: '#60a5fa' }}>{stats.kills} Kills</span>}
                        {stats.aces > 0 && <span style={{ color: '#f59e0b' }}>{stats.aces} Aces</span>}
                        {stats.plusMinus !== 0 && (
                          <span style={{ color: stats.plusMinus > 0 ? '#10b981' : '#f87171' }}>
                            {stats.plusMinus > 0 ? `+${stats.plusMinus}` : stats.plusMinus}
                          </span>
                        )}
                      </div>

                      {/* Warning tags */}
                      {isLiberoRuleBlocked && (
                        <div style={{ fontSize: '0.62rem', color: '#f87171', fontWeight: 700 }}>
                          Rule 19.3: Libero blocked from front row
                        </div>
                      )}
                      {isAlreadyOnCourt && !isCurrentlyInZone && (
                        <div style={{ fontSize: '0.62rem', color: '#fcd34d', fontWeight: 700 }}>
                          Already on court (will swap)
                        </div>
                      )}
                      {isUnavailable && (
                        <div style={{ fontSize: '0.62rem', color: '#f87171', fontWeight: 700 }}>
                          Marked {player.status}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* =========================================================================
            BOTTOM ACTION FOOTER
           ========================================================================= */}
        <div
          style={{
            padding: '0.85rem 1.15rem',
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          <button
            type="button"
            onClick={() => setIsSavingPreset(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '0.65rem 0.9rem',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Save size={15} />
            <span>Save Preset</span>
          </button>

          <button
            type="button"
            onClick={handleApplyToMatch}
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
            <Check size={18} />
            <span>Apply to Live Match & Starting 6</span>
          </button>
        </div>
      </div>
    </div>
  );
}
