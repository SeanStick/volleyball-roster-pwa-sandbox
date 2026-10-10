import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Printer,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  BookOpen,
  X,
  FileText,
  Shield,
  Layers,
  ChevronDown,
  Info,
  CheckSquare,
  Square,
  Share2
} from 'lucide-react';
import '../styles/rosterLineupSheet.css';

/**
 * Parses full name into { lastName, firstName }
 */
function parsePlayerName(fullName = '') {
  if (!fullName || typeof fullName !== 'string') return { lastName: '', firstName: '' };
  const trimmed = fullName.trim();
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map(p => p.trim());
    return { lastName: parts[0] || '', firstName: parts.slice(1).join(' ') || '' };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { lastName: parts[0], firstName: '' };
  }
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, parts.length - 1).join(' ');
  return { lastName, firstName };
}

/**
 * State High School Athletic Union Official Seal SVG
 */
function HighSchoolAthleticUnionSeal({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Rim */}
      <circle cx="50" cy="50" r="46" stroke="#000000" strokeWidth="3" />
      <circle cx="50" cy="50" r="42" stroke="#000000" strokeWidth="1" strokeDasharray="2,2" />
      
      {/* Circular Text Path */}
      <path id="sealCircleTop" d="M 18,50 A 32,32 0 1,1 82,50" fill="none" />
      <path id="sealCircleBottom" d="M 82,50 A 32,32 0 0,1 18,50" fill="none" />
      
      <text fill="#000000" fontSize="7.2" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">
        <textPath href="#sealCircleTop" startOffset="50%">
          HIGH SCHOOL ATHLETIC UNION
        </textPath>
      </text>

      <text fill="#000000" fontSize="6.5" fontWeight="900" letterSpacing="0.12em" textAnchor="middle">
        <textPath href="#sealCircleBottom" startOffset="50%">
          FOUNDED 1925
        </textPath>
      </text>

      {/* Inner Decorative Circle */}
      <circle cx="50" cy="50" r="23" stroke="#000000" strokeWidth="1.5" />

      {/* Volleyball Player Silhouette & Ball */}
      <g transform="translate(34, 30) scale(0.32)">
        {/* Volleyball */}
        <circle cx="76" cy="18" r="10" stroke="#000000" strokeWidth="2.5" fill="#ffffff" />
        <path d="M 69 13 Q 76 18 73 26" stroke="#000000" strokeWidth="1.8" fill="none" />
        <path d="M 76 9 Q 81 16 85 18" stroke="#000000" strokeWidth="1.8" fill="none" />
        
        {/* Player silhouette */}
        <path
          d="M 32 30 C 35 24 45 23 48 30 C 50 34 46 42 42 44 L 46 62 L 32 64 L 35 44 C 29 42 28 35 32 30 Z"
          fill="#000000"
        />
        <path
          d="M 44 32 L 68 18 L 65 25 L 45 38 Z"
          fill="#000000"
        />
        <path
          d="M 34 38 L 18 50 L 22 55 L 36 43 Z"
          fill="#000000"
        />
        <path
          d="M 35 62 L 20 90 L 28 92 L 42 66 Z"
          fill="#000000"
        />
        <path
          d="M 45 62 L 58 88 L 66 85 L 50 63 Z"
          fill="#000000"
        />
      </g>
    </svg>
  );
}

/**
 * OfficialRosterLineupSheetView
 * 
 * Exact 1:1 recreation of the official NFHS / IGHSAU State High School Athletic Union
 * "VOLLEYBALL TEAM ROSTER AND LINEUP" official scoresheet.
 */
export default function OfficialRosterLineupSheetView({
  roster = [],
  startingLineup = {},
  lineup = {},
  teamSettings = {},
  matchStats = {},
  phase = 'serve',
  rotation = 1,
  savedLineupPresets = [],
  onNavigateTab
}) {
  // Document State
  const [teamName, setTeamName] = useState(() => teamSettings?.teamName || 'Our Team');
  const [isHome, setIsHome] = useState(true); // true = Home, false = Visitor
  const [toastMessage, setToastMessage] = useState('');
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%

  // Serving Order Order Mode: 'nfhs_smart' (Zone 1 for serve, Zone 2 for receive sideout) vs 'zone_order' (always Z1=I)
  const [serveOrderMode, setServeOrderMode] = useState('nfhs_smart');

  // Games 1 to 5 Lineup Configurations
  // Each game: { serveOrReceive: 'serve'|'receive', lineup: { pos1..pos6 }, liberoCustom: string|null }
  const [gamesData, setGamesData] = useState(() => {
    const baseLineup = startingLineup?.pos1 ? startingLineup : (lineup?.pos1 ? lineup : {});
    const initialServe = phase === 'serve' ? 'serve' : 'receive';

    return {
      1: { serveOrReceive: initialServe, lineup: { ...baseLineup } },
      2: { serveOrReceive: initialServe === 'serve' ? 'receive' : 'serve', lineup: { ...baseLineup } },
      3: { serveOrReceive: initialServe, lineup: { ...baseLineup } },
      4: { serveOrReceive: initialServe === 'serve' ? 'receive' : 'serve', lineup: { ...baseLineup } },
      5: { serveOrReceive: 'serve', lineup: { ...baseLineup } }
    };
  });

  // Keep team name in sync if updated elsewhere
  useEffect(() => {
    if (teamSettings?.teamName) {
      setTeamName(teamSettings.teamName);
    }
  }, [teamSettings?.teamName]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  // Identify Liberos and Captain from roster
  const liberos = useMemo(() => {
    if (!Array.isArray(roster)) return [];
    return roster.filter(p => p.position === 'Libero' || p.isLibero);
  }, [roster]);

  const primaryLibero = liberos.length > 0 ? liberos[0] : null;
  const secondaryLibero = liberos.length > 1 ? liberos[1] : null;

  const captain = useMemo(() => {
    if (!Array.isArray(roster)) return null;
    return roster.find(p => p.isCaptain);
  }, [roster]);

  // Formatted Libero String for L1 / L2 Box: e.g. "5" or "14/L15" or "5 / 12"
  const formattedLiberoNumber = useMemo(() => {
    if (!primaryLibero) return '';
    if (secondaryLibero) {
      return `${primaryLibero.number || ''} / ${secondaryLibero.number || ''}`;
    }
    return String(primaryLibero.number || '');
  }, [primaryLibero, secondaryLibero]);

  // Player Lookup helper
  const getPlayer = (id) => {
    if (!Array.isArray(roster) || !id) return null;
    return roster.find(p => p.id === id);
  };

  // Convert a Game's 6-position lineup into SERVE ORDER I to VI
  const getGameServeOrder = (gameNumber) => {
    const game = gamesData[gameNumber] || gamesData[1];
    const gLineup = game.lineup || {};
    const isServing = game.serveOrReceive === 'serve';

    // Zone ordering mapping based on NFHS Serving Order rule
    let zoneKeys;
    if (serveOrderMode === 'nfhs_smart') {
      if (isServing) {
        // Team serves first: Zone 1 serves first
        zoneKeys = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6'];
      } else {
        // Team receives first: Sideout occurs, Zone 2 rotates into Zone 1 to serve first!
        zoneKeys = ['pos2', 'pos3', 'pos4', 'pos5', 'pos6', 'pos1'];
      }
    } else {
      // Direct Zone 1 to 6
      zoneKeys = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6'];
    }

    return [
      { orderRoman: 'I', zoneKey: zoneKeys[0] },
      { orderRoman: 'II', zoneKey: zoneKeys[1] },
      { orderRoman: 'III', zoneKey: zoneKeys[2] },
      { orderRoman: 'IV', zoneKey: zoneKeys[3] },
      { orderRoman: 'V', zoneKey: zoneKeys[4] },
      { orderRoman: 'VI', zoneKey: zoneKeys[5] }
    ].map(slot => {
      const pId = gLineup[slot.zoneKey];
      const player = getPlayer(pId);
      const isFloorCaptain = player?.isCaptain || false;
      const zoneNum = slot.zoneKey.replace('pos', '');

      // Official scoresheet notation: Number + " C" if captain (e.g. "7 C")
      let displayNo = '';
      if (player?.number !== undefined && player?.number !== null) {
        displayNo = isFloorCaptain ? `${player.number} C` : String(player.number);
      }

      return {
        ...slot,
        zoneNum,
        player,
        displayNo,
        isFloorCaptain
      };
    });
  };

  // Toggle Serve vs Receive for a game
  const handleToggleGameServe = (gameNum, choice) => {
    setGamesData(prev => ({
      ...prev,
      [gameNum]: {
        ...prev[gameNum],
        serveOrReceive: choice
      }
    }));
  };

  // Copy Game 1's lineup to Games 2 through 5
  const handleCopyGame1ToAll = () => {
    const g1 = gamesData[1];
    setGamesData(prev => ({
      ...prev,
      2: { ...prev[2], lineup: { ...g1.lineup } },
      3: { ...prev[3], lineup: { ...g1.lineup } },
      4: { ...prev[4], lineup: { ...g1.lineup } },
      5: { ...prev[5], lineup: { ...g1.lineup } }
    }));
    showToast('Game 1 lineup copied to Games 2, 3, 4, 5!');
  };

  // Load a saved lineup preset into Game 1
  const handleLoadPresetIntoGame = (gameNum, preset) => {
    if (!preset?.lineup) return;
    setGamesData(prev => ({
      ...prev,
      [gameNum]: {
        ...prev[gameNum],
        lineup: { ...preset.lineup }
      }
    }));
    showToast(`Loaded "${preset.name}" into Game ${gameNum}`);
  };

  // Sync from active starting lineup
  const handleSyncFromActiveLineup = () => {
    const active = startingLineup?.pos1 ? startingLineup : (lineup?.pos1 ? lineup : {});
    setGamesData(prev => ({
      ...prev,
      1: {
        ...prev[1],
        lineup: { ...active },
        serveOrReceive: phase === 'serve' ? 'serve' : 'receive'
      }
    }));
    showToast('Synced active lineup into Game 1');
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // Copy text summary to clipboard
  const handleCopyTextSummary = () => {
    const lines = [
      `🏐 VOLLEYBALL TEAM ROSTER & LINEUP SHEET`,
      `Team: ${teamName} (${isHome ? 'HOME' : 'VISITOR'})`,
      `Opponent: ${matchStats?.opponentName || 'Opponent'}`,
      `Libero: #${formattedLiberoNumber || 'None'}`,
      `Floor Captain: #${captain?.number || 'None'} ${captain?.name || ''}`,
      `----------------------------------------------`,
      `TEAM ROSTER (${roster.length} Players):`
    ];

    roster.forEach(p => {
      const { lastName, firstName } = parsePlayerName(p.name);
      lines.push(`#${p.number || '--'} ${lastName}, ${firstName} (${p.position || '--'})`);
    });

    lines.push(`----------------------------------------------`);
    lines.push(`GAME 1 STARTING LINEUP (Serving Order):`);
    const g1Orders = getGameServeOrder(1);
    g1Orders.forEach(o => {
      lines.push(`  Order ${o.orderRoman}: #${o.displayNo || 'Vacant'} [Zone ${o.zoneNum}] (${o.player?.name || 'Empty'})`);
    });

    lines.push(`----------------------------------------------`);
    lines.push(`Official NFHS / State High School Athletic Union Form`);

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      showToast('Lineup sheet copied to clipboard!');
    }).catch(() => {
      showToast('Copied to clipboard');
    });
  };

  // Generate 22 rows for the official roster table
  const rosterRows = useMemo(() => {
    const rows = [];
    const totalRowsCount = 22; // NFHS standard sheet height

    for (let i = 0; i < totalRowsCount; i++) {
      if (i < roster.length) {
        const p = roster[i];
        const { lastName, firstName } = parsePlayerName(p.name);
        // Libero number formatting (e.g. 14/L15 per NFHS instruction 3)
        let numStr = String(p.number ?? '');
        if (p.position === 'Libero' || p.isLibero) {
          numStr = p.liberoJerseyNumber ? `${p.number}/L${p.liberoJerseyNumber}` : `${p.number}`;
        }
        rows.push({
          index: i + 1,
          number: numStr,
          lastName,
          firstName,
          isCaptain: p.isCaptain,
          isLibero: p.position === 'Libero' || p.isLibero,
          player: p
        });
      } else {
        // Blank ruled line
        rows.push({
          index: i + 1,
          number: '',
          lastName: '',
          firstName: '',
          isCaptain: false,
          isLibero: false,
          player: null
        });
      }
    }
    return rows;
  }, [roster]);

  return (
    <div className="roster-lineup-sheet-container">
      {/* -------------------------------------------------------------
          TOP STICKY CONTROLS TOOLBAR (Hidden in Print)
          ------------------------------------------------------------- */}
      <div className="sheet-controls-bar no-print">
        <div className="sheet-toolbar-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#ff6b35" />
            <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#f8fafc' }}>
              NFHS Official Lineup Sheet
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              className="sheet-btn sheet-btn-primary"
              onClick={handlePrint}
              title="Print standard 8.5x11 official sheet"
            >
              <Printer size={15} />
              <span>Print Official Sheet</span>
            </button>

            <button
              type="button"
              className="sheet-btn sheet-btn-secondary"
              onClick={handleCopyTextSummary}
              title="Copy official lineup text for text message or scorer"
            >
              <Copy size={15} />
              <span>Copy Text</span>
            </button>

            <button
              type="button"
              className="sheet-btn sheet-btn-accent"
              onClick={handleSyncFromActiveLineup}
              title="Refresh Game 1 from currently active starting lineup"
            >
              <RefreshCw size={14} />
              <span>Sync Active Lineup</span>
            </button>
          </div>
        </div>

        <div className="sheet-toolbar-right">
          {/* Preset Selector */}
          {savedLineupPresets && savedLineupPresets.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <select
                onChange={(e) => {
                  const sel = savedLineupPresets.find(p => p.id === e.target.value);
                  if (sel) handleLoadPresetIntoGame(1, sel);
                  e.target.value = '';
                }}
                defaultValue=""
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>Load Saved Preset...</option>
                {savedLineupPresets.map(preset => (
                  <option key={preset.id} value={preset.id}>{preset.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Copy Game 1 to Games 2-5 */}
          <button
            type="button"
            className="sheet-btn sheet-btn-secondary"
            onClick={handleCopyGame1ToAll}
            title="Copy Game 1's starting 6 to Games 2 through 5"
          >
            <Layers size={14} />
            <span>Copy to Games 2-5</span>
          </button>

          {/* Official Instructions / Rules Button */}
          <button
            type="button"
            className="sheet-btn sheet-btn-secondary"
            onClick={() => setIsInstructionsOpen(true)}
            title="View Official High School Lineup Submission Rules (Page 2)"
          >
            <BookOpen size={14} color="#38bdf8" />
            <span>Official Rules</span>
          </button>

          {/* Zoom Controls */}
          <div className="sheet-scale-pill">
            <button
              type="button"
              className="sheet-scale-btn"
              onClick={() => setZoomLevel(prev => Math.max(0.65, Number((prev - 0.1).toFixed(1))))}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="sheet-scale-text">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              className="sheet-scale-btn"
              onClick={() => setZoomLevel(prev => Math.min(1.4, Number((prev + 0.1).toFixed(1))))}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              type="button"
              className="sheet-scale-btn"
              onClick={() => setZoomLevel(1)}
              title="Reset to 100%"
              style={{ fontSize: '0.72rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}
            >
              100%
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            background: '#10b981',
            color: '#ffffff',
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEWPORT & AUTHENTIC 8.5" x 11" PAPER DOCUMENT CANVAS
          ------------------------------------------------------------- */}
      <div className="sheet-viewport">
        <div
          className="sheet-scale-wrapper"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="official-sheet-paper" id="official-lineup-sheet-print-root">
            {/* Top Document Header */}
            <div className="official-header">
              <div className="official-seal-wrap">
                <HighSchoolAthleticUnionSeal size={62} />
              </div>

              <div className="official-title-wrap">
                <h1 className="official-main-title">VOLLEYBALL TEAM</h1>
                <h2 className="official-sub-title">ROSTER AND LINEUP</h2>
              </div>
            </div>

            {/* Main 2-Column Grid */}
            <div className="official-grid">
              {/* =========================================================
                  LEFT COLUMN: TEAM ROSTER
                  ========================================================= */}
              <div className="roster-column">
                <div className="roster-meta-row">
                  {/* Team Name Underline */}
                  <div className="roster-team-input-row">
                    <span>TEAM:</span>
                    <div
                      className="roster-team-name-underline"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setTeamName(e.currentTarget.textContent || teamName)}
                      title="Click to edit team name"
                    >
                      {teamName}
                    </div>
                  </div>

                  {/* Home vs Visitor Checkboxes */}
                  <div className="roster-check-row">
                    <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>Check one:</span>
                    <div
                      className="check-label-box"
                      onClick={() => setIsHome(true)}
                      title="Set as Home Team"
                    >
                      <span>Home</span>
                      <div className={`check-square ${isHome ? 'checked' : ''}`}>
                        {isHome ? 'X' : ''}
                      </div>
                    </div>

                    <div
                      className="check-label-box"
                      onClick={() => setIsHome(false)}
                      title="Set as Visitor Team"
                    >
                      <span>Visitor</span>
                      <div className={`check-square ${!isHome ? 'checked' : ''}`}>
                        {!isHome ? 'X' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 22-Row Official Roster Table */}
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th rowSpan="2" className="roster-col-number">
                        Player<br />Number
                      </th>
                      <th colSpan="2">
                        Player Name
                      </th>
                    </tr>
                    <tr>
                      <th className="roster-col-last" style={{ fontSize: '0.74rem' }}>Last</th>
                      <th className="roster-col-first" style={{ fontSize: '0.74rem' }}>First</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rosterRows.map((row) => (
                      <tr key={row.index}>
                        <td className="roster-col-number">
                          {row.number}
                        </td>
                        <td className="roster-col-last">
                          {row.lastName}
                        </td>
                        <td className="roster-col-first">
                          {row.firstName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* =========================================================
                  RIGHT COLUMN: 5 GAME LINEUP SHEETS (GAMES 1 TO 5)
                  ========================================================= */}
              <div className="lineups-column">
                {[1, 2, 3, 4, 5].map((gameNum) => {
                  const game = gamesData[gameNum];
                  const isServing = game.serveOrReceive === 'serve';
                  const serveOrders = getGameServeOrder(gameNum);

                  return (
                    <div key={gameNum} className="game-sheet-block">
                      {/* Top Row: Team Name & Game Number */}
                      <div className="game-sheet-top-row">
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                          <span>Team:</span>
                          <span className="game-team-underline">{teamName}</span>
                        </div>
                        <span className="game-title-text">Game {gameNum}</span>
                      </div>

                      {/* Sub Row: Libero & Serve/Receive Checkboxes */}
                      <div className="game-sheet-sub-row">
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>L1 / L2:</span>
                          <span className="game-libero-underline">
                            {formattedLiberoNumber || '—'}
                          </span>
                        </div>

                        <div className="game-checks">
                          <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Check one:</span>
                          <div
                            className="check-label-box"
                            onClick={() => handleToggleGameServe(gameNum, 'serve')}
                            title={`Game ${gameNum}: We Serve First`}
                          >
                            <div className={`check-square ${isServing ? 'checked' : ''}`} style={{ width: '16px', height: '16px', fontSize: '0.85rem' }}>
                              {isServing ? 'X' : ''}
                            </div>
                            <span style={{ fontSize: '0.78rem' }}>Serve</span>
                          </div>

                          <div
                            className="check-label-box"
                            onClick={() => handleToggleGameServe(gameNum, 'receive')}
                            title={`Game ${gameNum}: We Receive First`}
                          >
                            <div className={`check-square ${!isServing ? 'checked' : ''}`} style={{ width: '16px', height: '16px', fontSize: '0.85rem' }}>
                              {!isServing ? 'X' : ''}
                            </div>
                            <span style={{ fontSize: '0.78rem' }}>Receive</span>
                          </div>
                        </div>
                      </div>

                      {/* Serve Order Table (I to VI) */}
                      <table className="game-table">
                        <thead>
                          <tr>
                            <th className="game-col-order">SERVE ORDER</th>
                            <th className="game-col-player">PLAYER NO.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {serveOrders.map((order) => (
                            <tr key={order.orderRoman}>
                              <td className="game-col-order">
                                <span>{order.orderRoman}</span>
                                {/* Subtle zone indicator pill (hidden in print) */}
                                <span className="zone-hint-chip no-print" title={`Starts in Zone ${order.zoneNum}`}>
                                  Z{order.zoneNum}
                                </span>
                              </td>
                              <td className="game-col-player">
                                {order.displayNo ? (
                                  <span>
                                    <strong>{order.displayNo}</strong>
                                  </span>
                                ) : (
                                  <span style={{ color: '#94a3b8' }}>—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          OFFICIAL INSTRUCTIONS MODAL (RECREATING PAGE 2 OF PDF)
          ------------------------------------------------------------- */}
      {isInstructionsOpen && (
        <div className="official-instructions-overlay" onClick={() => setIsInstructionsOpen(false)}>
          <div className="official-instructions-card" onClick={(e) => e.stopPropagation()}>
            <div className="instructions-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={22} color="#ff6b35" />
                <h3 className="instructions-title">Official Lineup & Roster Submission Rules</h3>
              </div>
              <button
                type="button"
                className="instructions-close-btn"
                onClick={() => setIsInstructionsOpen(false)}
                title="Close Instructions"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Left Column: Team Roster Instructions */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  TEAM ROSTER
                </h4>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#334155' }}>
                  <p style={{ fontWeight: 800, marginBottom: '0.4rem' }}>Roster Rules:</p>
                  <ol style={{ paddingLeft: '1.2rem', margin: '0 0 1rem 0' }}>
                    <li style={{ marginBottom: '0.35rem' }}>Write in your team's name and check "home" or "visitor".</li>
                    <li style={{ marginBottom: '0.35rem' }}>Write each player's number and name (last name, then first name) in the space provided on the roster.</li>
                    <li>The libero with two numbers shall be listed with non-libero number followed by libero number (e.g., <strong>14/L15</strong>).</li>
                  </ol>

                  <div style={{ background: '#fee2e2', borderLeft: '4px solid #ef4444', padding: '0.65rem 0.85rem', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 800, color: '#991b1b' }}>
                    NOTE: THE TEAM ROSTER IS TO BE TURNED IN TO THE SCORER 10 MINUTES PRIOR TO THE END OF TIMED, PRE-MATCH WARM-UP.
                  </div>
                </div>
              </div>

              {/* Right Column: Team Lineup Sheet Instructions */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  TEAM LINEUP SHEET
                </h4>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#334155' }}>
                  <p style={{ fontWeight: 800, marginBottom: '0.4rem' }}>Lineup Rules:</p>
                  <ol style={{ paddingLeft: '1.2rem', margin: '0 0 1rem 0' }}>
                    <li style={{ marginBottom: '0.35rem' }}>Check if your team will serve or receive.</li>
                    <li style={{ marginBottom: '0.35rem' }}>List numbers of the starting lineup — in proper serving order to start the game — on the appropriate game lineup sheet.</li>
                    <li style={{ marginBottom: '0.35rem' }}>Mark the floor captain with a: <strong>"c"</strong> (e.g. <strong>7 C</strong>).</li>
                    <li>Designate the uniform number (from the team roster) of the libero player for each game in the space provided.</li>
                  </ol>

                  <div style={{ background: '#fee2e2', borderLeft: '4px solid #ef4444', padding: '0.65rem 0.85rem', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 800, color: '#991b1b' }}>
                    NOTE: THE LINEUP MUST BE SUBMITTED TO THE SCORER TWO MINUTES PRIOR TO THE END OF TIMED, PRE-MATCH WARM-UP.
                  </div>
                </div>
              </div>
            </div>

            {/* Official Example Table from Page 2 */}
            <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '0.5rem', color: '#1e293b' }}>
                Official NFHS Sample Lineup (From Page 2 Reference):
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
                <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <strong>Team: Rosemount (Serving)</strong><br />
                  Libero: 5 | Check: Serve [X]<br />
                  I: 4 &bull; II: 6 &bull; III: 7 C &bull; IV: 11 &bull; V: 12 &bull; VI: 9
                </div>
                <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <strong>Team: Apple Valley (Receiving)</strong><br />
                  Libero: 15 | Check: Receive [X]<br />
                  I: 3 &bull; II: 4 &bull; III: 9 &bull; IV: 5 &bull; V: 11 &bull; VI: 8
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
