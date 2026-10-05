import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  X,
  Star,
  Shield,
  Award,
  ChevronRight,
  UserCheck,
  Users,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
import '../styles/lineupCard.css';

/**
 * Official R2 Lineup Card Modal
 * 
 * Provides NFHS, USAV, and NCAA standard 6-box lineup card formatting.
 * Allows high school & club coaches to present verified lineups to the 2nd referee (R2),
 * print official 6-box scoresheets, or toggle High-Visibility Sideline presentation mode.
 */
export default function OfficialLineupCardModal({
  isOpen,
  onClose,
  roster = [],
  lineup = {},
  startingLineup = {},
  rotation = 1,
  phase = 'serve',
  liberoServingRotation = null,
  matchStats = {},
  teamName = 'Our Team',
  onApplyLineup = null
}) {
  if (!isOpen) return null;

  // Active Lineup Mode: 'starting' (Official Pre-Match Submission) vs 'current' (Floor Check)
  const [cardMode, setCardMode] = useState('starting');

  // Referee High-Visibility Presentation Mode (for holding up to R2 clipboard)
  const [isHiVisRefMode, setIsHiVisRefMode] = useState(false);

  // First Serve Designation: 'serve' | 'receive'
  const [servingFirst, setServingFirst] = useState(() => {
    return phase === 'serve' ? 'serve' : 'receive';
  });

  // Set Selector
  const [selectedSet, setSelectedSet] = useState(() => {
    return matchStats?.setNumber || 1;
  });

  // Quick In-Place Player Swap Drawer
  const [editingZone, setEditingZone] = useState(null); // 'pos1'..'pos6'

  // Local editable copy of lineup for this card
  const [activeLineup, setActiveLineup] = useState(() => {
    const base = startingLineup?.pos1 ? startingLineup : (lineup?.pos1 ? lineup : {});
    return {
      pos1: base.pos1 || null,
      pos2: base.pos2 || null,
      pos3: base.pos3 || null,
      pos4: base.pos4 || null,
      pos5: base.pos5 || null,
      pos6: base.pos6 || null
    };
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');

  // Update active lineup if mode switches
  useEffect(() => {
    if (cardMode === 'starting') {
      const base = startingLineup?.pos1 ? startingLineup : (lineup?.pos1 ? lineup : {});
      setActiveLineup({
        pos1: base.pos1 || null,
        pos2: base.pos2 || null,
        pos3: base.pos3 || null,
        pos4: base.pos4 || null,
        pos5: base.pos5 || null,
        pos6: base.pos6 || null
      });
    } else {
      setActiveLineup({
        pos1: lineup?.pos1 || null,
        pos2: lineup?.pos2 || null,
        pos3: lineup?.pos3 || null,
        pos4: lineup?.pos4 || null,
        pos5: lineup?.pos5 || null,
        pos6: lineup?.pos6 || null
      });
    }
  }, [cardMode, startingLineup, lineup]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (editingZone) {
          setEditingZone(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingZone, onClose]);

  // Helper to get player by ID
  const getPlayer = (id) => (Array.isArray(roster) ? roster.find(p => p.id === id) : null);

  // Identify Liberos and Captain
  const primaryLibero = useMemo(() => {
    return Array.isArray(roster) ? roster.find(p => p.position === 'Libero' || p.isLibero) : null;
  }, [roster]);

  const secondaryLibero = useMemo(() => {
    if (!Array.isArray(roster)) return null;
    const liberos = roster.filter(p => p.position === 'Libero' || p.isLibero);
    return liberos.length > 1 ? liberos[1] : null;
  }, [roster]);

  const captain = useMemo(() => {
    return Array.isArray(roster) ? roster.find(p => p.isCaptain) : null;
  }, [roster]);

  // Official Volleyball 6-Box Zones in Standard Scoresheet Order:
  // Top Row (Net side): Zone IV (Left Front), Zone III (Middle Front), Zone II (Right Front)
  // Bottom Row: Zone V (Left Back), Zone VI (Middle Back), Zone I (Right Back / Server 1)
  const officialBoxes = [
    { zoneKey: 'pos4', roman: 'IV', zoneCode: 'LF', name: 'Left Front', isFront: true },
    { zoneKey: 'pos3', roman: 'III', zoneCode: 'MF', name: 'Middle Front', isFront: true },
    { zoneKey: 'pos2', roman: 'II', zoneCode: 'RF', name: 'Right Front', isFront: true },
    { zoneKey: 'pos5', roman: 'V', zoneCode: 'LB', name: 'Left Back', isFront: false },
    { zoneKey: 'pos6', roman: 'VI', zoneCode: 'MB', name: 'Middle Back', isFront: false },
    { zoneKey: 'pos1', roman: 'I', zoneCode: 'RB', name: 'Right Back', isFront: false, isServer: true }
  ];

  // Quick player swap handler
  const handleSwapPlayer = (targetZoneKey, newPlayerId) => {
    const nextLineup = { ...activeLineup };
    // Check if newPlayer is already elsewhere on court, swap them
    Object.keys(nextLineup).forEach(k => {
      if (nextLineup[k] === newPlayerId) {
        nextLineup[k] = nextLineup[targetZoneKey];
      }
    });
    nextLineup[targetZoneKey] = newPlayerId;
    setActiveLineup(nextLineup);
    setEditingZone(null);

    if (onApplyLineup) {
      onApplyLineup(nextLineup, cardMode === 'starting');
    }

    showToast('Starter updated on lineup card');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  // Copy Lineup text formatted for officials/assistants
  const handleCopyLineupText = () => {
    const pIV = getPlayer(activeLineup.pos4);
    const pIII = getPlayer(activeLineup.pos3);
    const pII = getPlayer(activeLineup.pos2);
    const pV = getPlayer(activeLineup.pos5);
    const pVI = getPlayer(activeLineup.pos6);
    const pI = getPlayer(activeLineup.pos1);

    const text = [
      `🏐 OFFICIAL LINEUP SHEET — SET ${selectedSet}`,
      `Team: ${teamName} vs ${matchStats?.opponentName || 'Opponent'}`,
      `First Serve: ${servingFirst === 'serve' ? 'YES (Serving)' : 'NO (Receiving)'}`,
      `---------------------------------------`,
      `NET (FRONT ROW):`,
      `  IV (LF): #${pIV?.number || '--'} ${pIV?.name || 'Vacant'} (${pIV?.position || '--'}${pIV?.isCaptain ? ' - CAPTAIN' : ''})`,
      `  III (MF): #${pIII?.number || '--'} ${pIII?.name || 'Vacant'} (${pIII?.position || '--'}${pIII?.isCaptain ? ' - CAPTAIN' : ''})`,
      `  II (RF): #${pII?.number || '--'} ${pII?.name || 'Vacant'} (${pII?.position || '--'}${pII?.isCaptain ? ' - CAPTAIN' : ''})`,
      `BACK ROW:`,
      `  V (LB): #${pV?.number || '--'} ${pV?.name || 'Vacant'} (${pV?.position || '--'}${pV?.isCaptain ? ' - CAPTAIN' : ''})`,
      `  VI (MB): #${pVI?.number || '--'} ${pVI?.name || 'Vacant'} (${pVI?.position || '--'}${pVI?.isCaptain ? ' - CAPTAIN' : ''})`,
      `  I (RB - Serves): #${pI?.number || '--'} ${pI?.name || 'Vacant'} (${pI?.position || '--'}${pI?.isCaptain ? ' - CAPTAIN' : ''})`,
      `---------------------------------------`,
      `Libero: #${primaryLibero?.number || 'None'} ${primaryLibero?.name || ''}${secondaryLibero ? ` | L2: #${secondaryLibero.number || ''} ${secondaryLibero.name || ''}` : ''}`,
      `Team Captain: #${captain?.number || 'None'} ${captain?.name || ''}`,
      `Generated by GoStandOverThere Sideline PWA`
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      showToast('Lineup copied to clipboard!');
    }).catch(() => {
      showToast('Copied to clipboard');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="r2-modal-overlay" onClick={onClose}>
      <div
        className={`r2-modal-card ${isHiVisRefMode ? 'hivis-mode' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Official R2 Lineup Card"
      >
        {/* Header Bar */}
        <div className="r2-card-header no-print">
          <div className="r2-header-title-wrap">
            <div className="r2-icon-badge">
              <FileText size={22} />
            </div>
            <div>
              <div className="r2-title">
                <span>Official R2 Lineup Card</span>
                <span style={{ fontSize: '0.75rem', background: '#38bdf8', color: '#0f172a', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                  NFHS / USAV
                </span>
              </div>
              <div className="r2-subtitle">
                Official 6-box scoresheet layout • Ready for down referee verification
              </div>
            </div>
          </div>

          <div className="r2-header-actions">
            <button
              type="button"
              className={`r2-btn-icon ${isHiVisRefMode ? 'active' : ''}`}
              onClick={() => setIsHiVisRefMode(prev => !prev)}
              title={isHiVisRefMode ? 'Exit Referee Hi-Vis Mode' : 'Full-Screen Referee Presentation Mode'}
            >
              {isHiVisRefMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span>{isHiVisRefMode ? 'Standard' : 'Referee Hi-Vis'}</span>
            </button>

            <button
              type="button"
              className="r2-btn-close"
              onClick={onClose}
              title="Close Lineup Card"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="r2-card-body">
          {/* Coach Quick Controls Ribbon */}
          <div className="r2-controls-ribbon no-print">
            <div className="r2-mode-pills">
              <button
                type="button"
                className={`r2-mode-pill ${cardMode === 'starting' ? 'active' : ''}`}
                onClick={() => setCardMode('starting')}
              >
                📋 Starting Lineup (R2 Submission)
              </button>
              <button
                type="button"
                className={`r2-mode-pill ${cardMode === 'current' ? 'active' : ''}`}
                onClick={() => setCardMode('current')}
              >
                🔍 Live Floor Check (Rot {rotation})
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Set Selector */}
              <div className="r2-set-selector">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`r2-set-btn ${selectedSet === num ? 'active' : ''}`}
                    onClick={() => setSelectedSet(num)}
                  >
                    Set {num}
                  </button>
                ))}
              </div>

              {/* Serve vs Receive */}
              <div className="r2-serve-toggle">
                <button
                  type="button"
                  className={`r2-serve-choice ${servingFirst === 'serve' ? 'selected' : ''}`}
                  onClick={() => setServingFirst('serve')}
                >
                  Serve
                </button>
                <button
                  type="button"
                  className={`r2-serve-choice ${servingFirst === 'receive' ? 'selected' : ''}`}
                  onClick={() => setServingFirst('receive')}
                >
                  Receive
                </button>
              </div>
            </div>
          </div>

          {/* Quick Swap Drawer if a zone is tapped */}
          {editingZone && (
            <div className="r2-swap-drawer no-print">
              <div className="r2-swap-header">
                <span>Select Starter for Zone {editingZone.replace('pos', '')}:</span>
                <button
                  type="button"
                  onClick={() => setEditingZone(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
              <div className="r2-swap-grid">
                {roster.map(p => {
                  const isCurrent = activeLineup[editingZone] === p.id;
                  const isLiberoRule = (editingZone === 'pos2' || editingZone === 'pos3' || editingZone === 'pos4') && (p.position === 'Libero' || p.isLibero);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={isLiberoRule}
                      className="r2-swap-player-btn"
                      onClick={() => handleSwapPlayer(editingZone, p.id)}
                      style={{
                        borderColor: isCurrent ? '#38bdf8' : undefined,
                        opacity: isLiberoRule ? 0.4 : 1
                      }}
                    >
                      <strong style={{ color: '#38bdf8' }}>#{p.number}</strong>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                      <small style={{ color: '#64748b', marginLeft: 'auto' }}>{p.position}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              THE OFFICIAL 6-BOX LINEUP SHEET CONTAINER (Target for Display & Print)
              ========================================================================= */}
          <div className="r2-sheet-paper official-r2-card-print-target">
            {/* Metadata Bar */}
            <div className="r2-sheet-meta">
              <div className="r2-meta-item">
                <span className="r2-meta-label">Team Name</span>
                <span className="r2-meta-value">{teamName}</span>
              </div>
              <div className="r2-meta-item">
                <span className="r2-meta-label">Opponent</span>
                <span className="r2-meta-value">{matchStats?.opponentName || 'Opponent'}</span>
              </div>
              <div className="r2-meta-item">
                <span className="r2-meta-label">Set / Match</span>
                <span className="r2-meta-value">Set {selectedSet} • {matchStats?.matchStage || 'Match'}</span>
              </div>
              <div className="r2-meta-item">
                <span className="r2-meta-label">Location</span>
                <span className="r2-meta-value">{matchStats?.courtNumber || 'Court 1'}</span>
              </div>
              <div className="r2-meta-item">
                <span className="r2-meta-label">First Serve</span>
                <span className="r2-meta-value" style={{ color: servingFirst === 'serve' ? '#10b981' : '#f59e0b' }}>
                  {servingFirst === 'serve' ? '☑ SERVING' : '☑ RECEIVING'}
                </span>
              </div>
            </div>

            {/* NET Line */}
            <div className="r2-court-net-line">
              <div className="r2-net-badge">
                <VolleyballIcon size={14} />
                <span>NET / FRONT ROW</span>
                <VolleyballIcon size={14} />
              </div>
            </div>

            {/* 6-Box Grid (IV, III, II on top; V, VI, I on bottom) */}
            <div className="r2-six-box-grid">
              {officialBoxes.map((box) => {
                const playerId = activeLineup[box.zoneKey];
                const player = getPlayer(playerId);
                const isServerZone = box.zoneKey === 'pos1' && servingFirst === 'serve';

                return (
                  <div
                    key={box.zoneKey}
                    className={`r2-box ${isServerZone ? 'is-server-box' : ''}`}
                    onClick={() => setEditingZone(box.zoneKey)}
                    title={`Zone ${box.roman} (${box.name}) — Tap to swap starter`}
                  >
                    <span className="r2-box-roman">{box.roman}</span>
                    <span className="r2-box-zone-label">{box.zoneCode}</span>

                    <div className="r2-box-number">
                      {player ? `#${player.number}` : '--'}
                    </div>

                    <div className="r2-box-name">
                      {player ? player.name : 'Empty Slot'}
                    </div>

                    <div className="r2-box-pos-badge">
                      {player ? player.position : 'No Player'}
                    </div>

                    {player?.isCaptain && (
                      <span className="r2-captain-badge">
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        <span>(C) CAPTAIN</span>
                      </span>
                    )}

                    {isServerZone && (
                      <span className="r2-server-badge">
                        <Check size={11} />
                        <span>FIRST SERVER</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Official Ref Footer: Liberos & Captain */}
            <div className="r2-sheet-footer">
              {/* Primary Libero */}
              <div className="r2-libero-card">
                <div className="r2-libero-num">
                  {primaryLibero ? `#${primaryLibero.number}` : 'NONE'}
                </div>
                <div className="r2-libero-details">
                  <span className="r2-libero-label">Primary Libero</span>
                  <span className="r2-libero-name">
                    {primaryLibero ? primaryLibero.name : 'No Libero Assigned'}
                  </span>
                </div>
              </div>

              {/* Secondary Libero (if 2 libero rule) */}
              {secondaryLibero && (
                <div className="r2-libero-card">
                  <div className="r2-libero-num">
                    #{secondaryLibero.number}
                  </div>
                  <div className="r2-libero-details">
                    <span className="r2-libero-label">Secondary Libero (L2)</span>
                    <span className="r2-libero-name">
                      {secondaryLibero.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Team Captain */}
              <div className="r2-captain-card">
                <div className="r2-captain-num">
                  {captain ? `#${captain.number}` : 'NONE'}
                </div>
                <div className="r2-libero-details">
                  <span className="r2-libero-label" style={{ color: '#d97706' }}>Team Captain (C)</span>
                  <span className="r2-libero-name">
                    {captain ? captain.name : 'No Captain Designated'}
                  </span>
                </div>
              </div>

              {/* Libero Serving Zone Note */}
              {liberoServingRotation !== null && (
                <div className="r2-libero-card" style={{ borderColor: '#8b5cf6', background: 'rgba(139, 92, 246, 0.08)' }}>
                  <div className="r2-libero-num" style={{ color: '#a855f7' }}>
                    R{liberoServingRotation}
                  </div>
                  <div className="r2-libero-details">
                    <span className="r2-libero-label">Libero Serves In</span>
                    <span className="r2-libero-name">Rotation {liberoServingRotation}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Print-only Coach Signature & Date verification line */}
            <div style={{ display: 'none', borderTop: '1px solid #000', paddingTop: '1rem', marginTop: '1.5rem', justifyContent: 'space-between', fontSize: '0.85rem' }} className="print-signature-block">
              <div>
                <strong>Coach Signature:</strong> _____________________________
              </div>
              <div>
                <strong>Date & Time:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="r2-card-actions-bar no-print">
            <div className="r2-action-btns-left">
              <button
                type="button"
                className="r2-action-btn secondary"
                onClick={handleCopyLineupText}
                title="Copy formatted lineup summary to clipboard"
              >
                <Copy size={15} />
                <span>Copy Summary</span>
              </button>

              <button
                type="button"
                className="r2-action-btn secondary"
                onClick={handlePrint}
                title="Print official NFHS/USAV 6-box lineup card"
              >
                <Printer size={15} />
                <span>Print Card</span>
              </button>
            </div>

            <div className="r2-action-btns-right">
              <button
                type="button"
                className="r2-action-btn primary"
                onClick={() => setIsHiVisRefMode(prev => !prev)}
              >
                {isHiVisRefMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                <span>{isHiVisRefMode ? 'Back to Card' : 'Show Down Ref (Hi-Vis)'}</span>
              </button>

              <button
                type="button"
                className="r2-action-btn secondary"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Toast */}
        {toastMessage && (
          <div className="r2-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
