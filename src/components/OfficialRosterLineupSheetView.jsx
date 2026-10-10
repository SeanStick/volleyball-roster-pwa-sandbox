import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  Share2,
  LayoutGrid,
  UserCheck,
  Smartphone
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
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
 * Volleyball Court Zones & Starting Positions Diagram (SVG)
 * Shows official court zones (Front Row: 4, 3, 2; Back Row: 5, 6, 1),
 * Net, 10-ft Attack Line, Service Zone, clockwise rotation flow, and player starting assignments.
 */
function VolleyballCourtZonesDiagram({
  gameLineup = {},
  getPlayer,
  showPlayers = true
}) {
  const zones = [
    // Front Row (left to right: Z4, Z3, Z2)
    {
      num: 4,
      name: 'Left Front',
      abbr: 'LF',
      key: 'pos4',
      x: 15,
      y: 26,
      w: 101,
      h: 52,
      isFront: true
    },
    {
      num: 3,
      name: 'Middle Front',
      abbr: 'MF',
      key: 'pos3',
      x: 119,
      y: 26,
      w: 102,
      h: 52,
      isFront: true
    },
    {
      num: 2,
      name: 'Right Front',
      abbr: 'RF',
      key: 'pos2',
      x: 224,
      y: 26,
      w: 101,
      h: 52,
      isFront: true
    },
    // Back Row (left to right: Z5, Z6, Z1)
    {
      num: 5,
      name: 'Left Back',
      abbr: 'LB',
      key: 'pos5',
      x: 15,
      y: 81,
      w: 101,
      h: 84,
      isFront: false
    },
    {
      num: 6,
      name: 'Middle Back',
      abbr: 'MB',
      key: 'pos6',
      x: 119,
      y: 81,
      w: 102,
      h: 84,
      isFront: false
    },
    {
      num: 1,
      name: 'Right Back',
      abbr: 'RB (Server)',
      key: 'pos1',
      x: 224,
      y: 81,
      w: 101,
      h: 84,
      isFront: false,
      isServer: true
    }
  ];

  return (
    <svg viewBox="0 0 340 206" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Striped Antenna Pattern */}
        <pattern id="antennaStripes" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="2" height="4" fill="#ef4444" />
          <rect x="2" width="2" height="4" fill="#ffffff" />
        </pattern>
      </defs>

      {/* Net & Opponent indicator at top */}
      <text x="170" y="14" textAnchor="middle" fontSize="7.8" fontWeight="900" fill="#0f172a" letterSpacing="0.08em">
        ▲ NET (CENTER LINE) / OPPONENT SIDE ▲
      </text>

      {/* Net Bar */}
      <rect x="11" y="19" width="318" height="6" fill="#1e293b" stroke="#000000" strokeWidth="1" />
      {/* Antennas */}
      <rect x="13" y="5" width="3" height="20" fill="url(#antennaStripes)" stroke="#000000" strokeWidth="0.5" />
      <rect x="324" y="5" width="3" height="20" fill="url(#antennaStripes)" stroke="#000000" strokeWidth="0.5" />

      {/* Court Boundary Rectangle (Half Court) */}
      <rect x="15" y="25" width="310" height="140" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />

      {/* 10-ft (3M) Attack Line dividing Front Row & Back Row */}
      <line x1="15" y1="78" x2="325" y2="78" stroke="#000000" strokeWidth="1.8" strokeDasharray="5,2" />
      <rect x="106" y="72" width="128" height="12" rx="2" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
      <text x="170" y="81" textAnchor="middle" fontSize="6.4" fontWeight="900" fill="#000000" letterSpacing="0.04em">
        10-FT (3M) ATTACK LINE
      </text>

      {/* Vertical Zone Dividers */}
      <line x1="117" y1="25" x2="117" y2="165" stroke="#000000" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="222" y1="25" x2="222" y2="165" stroke="#000000" strokeWidth="1" strokeDasharray="3,2" />

      {/* Render 6 Zones */}
      {zones.map(z => {
        const playerId = gameLineup[z.key];
        const player = getPlayer ? getPlayer(playerId) : null;
        const { lastName } = parsePlayerName(player?.name || '');
        const isCap = player?.isCaptain;
        const isLib = player?.position === 'Libero' || player?.isLibero;
        let numStr = player?.number !== undefined && player?.number !== null ? String(player.number) : '';
        if (isCap) numStr += ' C';
        const playerLabel = player ? `#${numStr} ${lastName || player.name}${isLib ? ' (L)' : ''}` : null;

        const centerX = z.x + z.w / 2;

        return (
          <g key={z.num}>
            {/* Zone background area */}
            <rect
              x={z.x + 1}
              y={z.y + 1}
              width={z.w - 2}
              height={z.h - 2}
              fill={z.isFront ? 'rgba(248, 250, 252, 0.7)' : '#ffffff'}
            />

            {/* Zone Number Badge */}
            <text
              x={centerX}
              y={z.isFront ? z.y + 16 : z.y + 17}
              textAnchor="middle"
              fontSize="10"
              fontWeight="900"
              fill="#0f172a"
              letterSpacing="0.04em"
            >
              ZONE {z.num}
            </text>

            {/* Zone Position Subtitle */}
            <text
              x={centerX}
              y={z.isFront ? z.y + 26 : z.y + 28}
              textAnchor="middle"
              fontSize="7"
              fontWeight="700"
              fill="#475569"
            >
              {z.name} ({z.abbr})
            </text>

            {/* Server Badge for Zone 1 */}
            {z.isServer && (
              <g>
                <rect
                  x={centerX - 35}
                  y={z.y + 32}
                  width="70"
                  height="12"
                  rx="2"
                  fill="#fff7ed"
                  stroke="#ea580c"
                  strokeWidth="0.8"
                />
                <text
                  x={centerX}
                  y={z.y + 40.5}
                  textAnchor="middle"
                  fontSize="6.2"
                  fontWeight="900"
                  fill="#ea580c"
                  letterSpacing="0.03em"
                >
                  ★ SERVING POS
                </text>
              </g>
            )}

            {/* Player Info Badge (if selected) */}
            {showPlayers && playerLabel && (
              <g>
                <rect
                  x={centerX - 44}
                  y={z.isFront ? z.y + 31 : (z.isServer ? z.y + 49 : z.y + 37)}
                  width="88"
                  height="16"
                  rx="3"
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth="1.1"
                />
                <text
                  x={centerX}
                  y={z.isFront ? z.y + 42.5 : (z.isServer ? z.y + 60.5 : z.y + 48.5)}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="800"
                  fill="#000000"
                >
                  {playerLabel}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Serving Zone Outside Baseline */}
      <line x1="224" y1="165" x2="224" y2="173" stroke="#000000" strokeWidth="1.5" />
      <line x1="325" y1="165" x2="325" y2="173" stroke="#000000" strokeWidth="1.5" />
      <text x="274" y="179" textAnchor="middle" fontSize="7.2" fontWeight="900" fill="#000000">
        ▲ SERVE AREA (Behind Zone 1) ▲
      </text>

      {/* Rotation Flow Legend */}
      <text x="170" y="198" textAnchor="middle" fontSize="7.2" fontWeight="900" fill="#0f172a" letterSpacing="0.02em">
        ⟳ CLOCKWISE ROTATION: Z1 ➜ Z6 ➜ Z5 ➜ Z4 ➜ Z3 ➜ Z2 ➜ Z1
      </text>
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

  // Toggle to show number & last name in serve order
  const [showLastNameInServeOrder, setShowLastNameInServeOrder] = useState(false);
  // Toggle to show court zones diagram on sheet
  const [showCourtDiagram, setShowCourtDiagram] = useState(true);
  // Selected game for court diagram (1..5 or 'zones')
  const [courtDiagramGame, setCourtDiagramGame] = useState(1);

  // View Mode: 'cards' (responsive mobile coaching layout) vs 'paper' (authentic 8.5x11 scoresheet)
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 820) {
      return 'cards';
    }
    return 'paper';
  });
  // Active game in mobile cards view (1..5)
  const [activeMobileGame, setActiveMobileGame] = useState(1);

  // Auto-fit function for paper view
  const handleAutoFit = useCallback(() => {
    if (typeof window === 'undefined') return;
    const availableWidth = window.innerWidth - (window.innerWidth < 640 ? 16 : 48);
    const paperWidthPx = 816; // 8.5in * 96dpi
    const fitScale = Math.min(1.2, Math.max(0.35, availableWidth / paperWidthPx));
    setZoomLevel(Number(fitScale.toFixed(2)));
    showToast(`Fitted to screen (${Math.round(fitScale * 100)}%)`);
  }, []);

  // When switching to paper view on mobile/tablet, automatically fit to screen
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 820 && viewMode === 'paper') {
      const availableWidth = window.innerWidth - 16;
      const paperWidthPx = 816;
      const fitScale = Math.min(1.0, Math.max(0.35, availableWidth / paperWidthPx));
      setZoomLevel(Number(fitScale.toFixed(2)));
    }
  }, [viewMode]);

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

  // Generate rows for the official roster table
  const rosterRows = useMemo(() => {
    const rows = [];
    // If court diagram is enabled on sheet, keep roster table compact (minimum 12 or roster length)
    // If court diagram is off, show the full 22 standard ruled lines
    const totalRowsCount = showCourtDiagram ? Math.max(12, Math.min(22, roster.length)) : 22;

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
  }, [roster, showCourtDiagram]);

  return (
    <div className="roster-lineup-sheet-container">
      {/* -------------------------------------------------------------
          TOP STICKY CONTROLS TOOLBAR (Hidden in Print)
          ------------------------------------------------------------- */}
      <div className="sheet-controls-bar no-print">
        {/* Top Row: Brand + View Switcher + Print Button */}
        <div className="sheet-toolbar-top">
          <div className="sheet-toolbar-brand">
            <FileText size={20} color="#ff6b35" />
            <span>Official Lineup Sheet</span>
          </div>

          {/* View Mode Switcher: Mobile View vs Full Sheet */}
          <div className="sheet-view-mode-toggle" role="group" aria-label="View Mode">
            <button
              type="button"
              className={`sheet-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('cards');
                showToast('Switched to Mobile View');
              }}
              title="Switch to Mobile View"
              id="btn-view-mode-cards"
            >
              <Smartphone size={14} />
              <span>Mobile View</span>
            </button>
            <button
              type="button"
              className={`sheet-view-btn ${viewMode === 'paper' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('paper');
                showToast('Switched to Full Sheet View');
              }}
              title="Switch to Full 8.5x11 Scoresheet view"
              id="btn-view-mode-paper"
            >
              <FileText size={14} />
              <span>Full Sheet</span>
            </button>
          </div>

          {/* Primary Print Button */}
          <button
            type="button"
            className="sheet-btn sheet-btn-primary"
            onClick={handlePrint}
            title="Print standard 8.5x11 official sheet"
            id="btn-action-print"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>
        </div>

        {/* Bottom Row: Horizontal Swipeable Action Chips */}
        <div className="sheet-toolbar-bottom">
          {/* Toggle: Number and Last Name in Serve Order */}
          <button
            type="button"
            className={`sheet-btn ${showLastNameInServeOrder ? 'sheet-btn-primary' : 'sheet-btn-secondary'}`}
            onClick={() => {
              setShowLastNameInServeOrder(prev => {
                const next = !prev;
                showToast(next ? 'Showing Number & Last Name in Lineup' : 'Showing Number Only in Lineup');
                return next;
              });
            }}
            title="Toggle showing player uniform number and last name in serving order"
          >
            <UserCheck size={14} />
            <span>{showLastNameInServeOrder ? 'Names: ON' : 'Names: OFF'}</span>
          </button>

          {/* Toggle: Court Zones Diagram on Sheet */}
          <button
            type="button"
            className={`sheet-btn ${showCourtDiagram ? 'sheet-btn-accent' : 'sheet-btn-secondary'}`}
            onClick={() => {
              setShowCourtDiagram(prev => {
                const next = !prev;
                showToast(next ? 'Court Zones Diagram displayed on sheet' : 'Full 22 ruled lines displayed');
                return next;
              });
            }}
            title="Toggle Court Zones starting diagram on the sheet"
          >
            <LayoutGrid size={14} />
            <span>{showCourtDiagram ? 'Court: ON' : 'Court: OFF'}</span>
          </button>

          {/* Sync Active Lineup */}
          <button
            type="button"
            className="sheet-btn sheet-btn-accent"
            onClick={handleSyncFromActiveLineup}
            title="Refresh Game 1 from currently active starting lineup"
          >
            <RefreshCw size={14} />
            <span>Sync Lineup</span>
          </button>

          {/* Copy Game 1 to Games 2-5 */}
          <button
            type="button"
            className="sheet-btn sheet-btn-secondary"
            onClick={handleCopyGame1ToAll}
            title="Copy Game 1's starting 6 to Games 2 through 5"
          >
            <Layers size={14} />
            <span>Copy to 2-5</span>
          </button>

          {/* Copy Text Summary */}
          <button
            type="button"
            className="sheet-btn sheet-btn-secondary"
            onClick={handleCopyTextSummary}
            title="Copy official lineup text for text message or scorer"
          >
            <Copy size={14} />
            <span>Copy Text</span>
          </button>

          {/* Official Instructions / Rules Button */}
          <button
            type="button"
            className="sheet-btn sheet-btn-secondary"
            onClick={() => setIsInstructionsOpen(true)}
            title="View Official High School Lineup Submission Rules (Page 2)"
          >
            <BookOpen size={14} color="#38bdf8" />
            <span>Rules</span>
          </button>

          {/* Preset Selector */}
          {savedLineupPresets && savedLineupPresets.length > 0 && (
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
                padding: '0.38rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <option value="" disabled>Presets...</option>
              {savedLineupPresets.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
          )}

          {/* Zoom Controls (when in Paper View) */}
          {viewMode === 'paper' && (
            <div className="sheet-scale-pill">
              <button
                type="button"
                className="sheet-scale-btn"
                onClick={handleAutoFit}
                title="Fit sheet width to screen"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.55rem' }}
              >
                Fit
              </button>
              <button
                type="button"
                className="sheet-scale-btn"
                onClick={() => setZoomLevel(prev => Math.max(0.35, Number((prev - 0.1).toFixed(2))))}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="sheet-scale-text">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                className="sheet-scale-btn"
                onClick={() => setZoomLevel(prev => Math.min(1.4, Number((prev + 0.1).toFixed(2))))}
                title="Zoom In"
              >
                <ZoomIn size={13} />
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
          )}
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
          MOBILE COACH CARDS VIEW (Clean, Touch-Friendly on Phones)
          ------------------------------------------------------------- */}
      {viewMode === 'cards' && (
        <div className="mobile-sheet-layout no-print">
          {/* 1. Mobile Team Header Card */}
          <div className="mobile-card mobile-team-card">
            <div className="mobile-card-header">
              <div className="mobile-team-info">
                <span className="mobile-card-badge">TEAM DESIGNATION</span>
                <div className="mobile-team-name-input-wrap">
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#94a3b8' }}>TEAM:</span>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="mobile-team-input"
                    placeholder="Team Name"
                  />
                </div>
              </div>

              {/* Home / Visitor Toggle */}
              <div className="mobile-home-visitor-toggle">
                <button
                  type="button"
                  className={`mobile-hv-btn ${isHome ? 'active' : ''}`}
                  onClick={() => setIsHome(true)}
                >
                  HOME
                </button>
                <button
                  type="button"
                  className={`mobile-hv-btn ${!isHome ? 'active' : ''}`}
                  onClick={() => setIsHome(false)}
                >
                  VISITOR
                </button>
              </div>
            </div>

            <div className="mobile-meta-pills">
              <div className="mobile-meta-pill">
                <span className="mobile-meta-label">LIBERO (L1/L2):</span>
                <span className="mobile-meta-val">#{formattedLiberoNumber || 'None'}</span>
              </div>
              <div className="mobile-meta-pill">
                <span className="mobile-meta-label">FLOOR CAPTAIN:</span>
                <span className="mobile-meta-val">
                  #{captain?.number || '--'} {captain ? parsePlayerName(captain.name).lastName : 'None'} (C)
                </span>
              </div>
            </div>
          </div>

          {/* 2. Court Zones & Starting Positions Card */}
          {showCourtDiagram && (
            <div className="mobile-card mobile-court-card">
              <div className="mobile-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <VolleyballIcon size={16} />
                  <h3 className="mobile-card-title">Court Zones & Starting Positions</h3>
                </div>
                <div className="mobile-court-game-selector">
                  {[1, 2, 3, 4, 5].map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`court-game-pill ${courtDiagramGame === g ? 'active' : ''}`}
                      onClick={() => {
                        setCourtDiagramGame(g);
                        setActiveMobileGame(g);
                      }}
                    >
                      G{g}
                    </button>
                  ))}
                  <button
                    key="zones"
                    type="button"
                    className={`court-game-pill ${courtDiagramGame === 'zones' ? 'active' : ''}`}
                    onClick={() => setCourtDiagramGame('zones')}
                  >
                    Zones
                  </button>
                </div>
              </div>

              <div className="mobile-court-diagram-wrap">
                <VolleyballCourtZonesDiagram
                  gameLineup={gamesData[courtDiagramGame]?.lineup || gamesData[activeMobileGame]?.lineup || {}}
                  getPlayer={getPlayer}
                  showPlayers={courtDiagramGame !== 'zones'}
                />
              </div>

              <div className="court-guide-footer">
                <span className="court-legend-item"><strong>Front Row:</strong> Z4, Z3, Z2</span>
                <span className="court-legend-item"><strong>Back Row:</strong> Z5, Z6, Z1</span>
                <span className="court-legend-item"><strong>Server:</strong> Z1</span>
              </div>
            </div>
          )}

          {/* 3. Game Lineups Selector & Card */}
          <div className="mobile-card mobile-lineup-card">
            <div className="mobile-game-tabs">
              {[1, 2, 3, 4, 5].map(g => (
                <button
                  key={g}
                  type="button"
                  className={`mobile-game-tab ${activeMobileGame === g ? 'active' : ''}`}
                  onClick={() => {
                    setActiveMobileGame(g);
                    setCourtDiagramGame(g);
                  }}
                >
                  Game {g}
                </button>
              ))}
            </div>

            {/* Selected Game Details */}
            {(() => {
              const game = gamesData[activeMobileGame];
              const isServing = game.serveOrReceive === 'serve';
              const serveOrders = getGameServeOrder(activeMobileGame);

              return (
                <div className="mobile-game-body">
                  <div className="mobile-game-subhead">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span className="mobile-game-title">Game {activeMobileGame} Starting Lineup</span>
                      <span className="mobile-badge-libero">L: #{formattedLiberoNumber || '—'}</span>
                    </div>

                    {/* Serve vs Receive toggle */}
                    <div className="mobile-serve-toggle">
                      <button
                        type="button"
                        className={`mobile-serve-btn ${isServing ? 'active-serve' : ''}`}
                        onClick={() => handleToggleGameServe(activeMobileGame, 'serve')}
                      >
                        Serve
                      </button>
                      <button
                        type="button"
                        className={`mobile-serve-btn ${!isServing ? 'active-recv' : ''}`}
                        onClick={() => handleToggleGameServe(activeMobileGame, 'receive')}
                      >
                        Receive
                      </button>
                    </div>
                  </div>

                  {/* Serving Order Cards (I to VI) */}
                  <div className="mobile-serve-order-list">
                    {serveOrders.map(order => {
                      const { lastName } = parsePlayerName(order.player?.name || '');
                      return (
                        <div key={order.orderRoman} className="mobile-serve-order-item">
                          <div className="mobile-order-badge">
                            <span className="mobile-order-roman">{order.orderRoman}</span>
                            <span className="mobile-order-zone">Zone {order.zoneNum}</span>
                          </div>

                          <div className="mobile-order-player">
                            {order.player ? (
                              <>
                                <div className="mobile-jersey-circle">
                                  #{order.player.number}
                                  {order.isFloorCaptain && <span className="mobile-cap-star">C</span>}
                                </div>
                                <div className="mobile-player-details">
                                  <span className="mobile-player-name">
                                    {showLastNameInServeOrder ? lastName : order.player.name}
                                  </span>
                                  <span className="mobile-player-pos">
                                    {order.player.position || 'Player'}
                                    {order.isFloorCaptain && ' • Captain'}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="mobile-order-empty">Empty Slot</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 4. Team Roster Section (Mobile Table) */}
          <div className="mobile-card mobile-roster-card">
            <div className="mobile-card-header">
              <h3 className="mobile-card-title">Team Roster ({roster.length} Players)</h3>
              <span className="mobile-card-subtitle">Official Roster Pool</span>
            </div>

            <div className="mobile-roster-table-wrap">
              <table className="mobile-roster-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>No.</th>
                    <th style={{ width: '40%' }}>Last Name</th>
                    <th style={{ width: '38%' }}>First Name</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map(p => {
                    const { lastName, firstName } = parsePlayerName(p.name);
                    const isCap = p.isCaptain;
                    const isLib = p.position === 'Libero' || p.isLibero;
                    return (
                      <tr key={p.id || p.number}>
                        <td className="mobile-roster-num">
                          <strong>#{p.number}</strong>
                          {isCap && <span className="mobile-c-pill">C</span>}
                          {isLib && <span className="mobile-l-pill">L</span>}
                        </td>
                        <td className="mobile-roster-last">{lastName}</td>
                        <td className="mobile-roster-first">{firstName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          FULL PAPER SCORESHEET MOBILE BANNER
          ------------------------------------------------------------- */}
      {viewMode === 'paper' && (
        <div className="sheet-paper-mobile-banner no-print">
          <div className="sheet-paper-banner-content">
            <FileText size={16} color="#ff6b35" />
            <span>Full 8.5" × 11" Scoresheet</span>
          </div>
          <button
            type="button"
            className="sheet-back-to-cards-btn"
            onClick={() => {
              setViewMode('cards');
              showToast('Switched to Mobile View');
            }}
            title="Return to Mobile View"
            id="btn-banner-return-mobile-view"
          >
            <Smartphone size={14} />
            <span>Back to Mobile View</span>
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEWPORT & AUTHENTIC 8.5" x 11" PAPER DOCUMENT CANVAS
          (Hidden on screen when in Mobile Cards view, but ALWAYS prints)
          ------------------------------------------------------------- */}
      <div className={`sheet-viewport ${viewMode === 'cards' ? 'hide-on-screen-in-cards' : ''}`}>
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

                {/* Court Zones & Starting Positions Diagram (Image / Visual on Sheet) */}
                {showCourtDiagram && (
                  <div className="roster-court-guide">
                    <div className="court-guide-header">
                      <div className="court-guide-title">
                        <VolleyballIcon size={14} />
                        <span>COURT ZONES & STARTING POSITIONS</span>
                      </div>
                      <div className="court-guide-game-selector no-print">
                        {[1, 2, 3, 4, 5].map(g => (
                          <button
                            key={g}
                            type="button"
                            className={`court-game-pill ${courtDiagramGame === g ? 'active' : ''}`}
                            onClick={() => setCourtDiagramGame(g)}
                            title={`Show Game ${g} positions on court`}
                          >
                            G{g}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={`court-game-pill ${courtDiagramGame === 'zones' ? 'active' : ''}`}
                          onClick={() => setCourtDiagramGame('zones')}
                          title="Show Zone Numbers Only"
                        >
                          Zones
                        </button>
                      </div>
                    </div>

                    <div className="court-diagram-canvas-wrap">
                      <VolleyballCourtZonesDiagram
                        gameLineup={gamesData[courtDiagramGame]?.lineup || gamesData[1]?.lineup || {}}
                        getPlayer={getPlayer}
                        showPlayers={courtDiagramGame !== 'zones'}
                      />
                    </div>

                    <div className="court-guide-footer">
                      <span className="court-legend-item"><strong>Front Row:</strong> Z4, Z3, Z2 (Attack & Block)</span>
                      <span className="court-legend-item"><strong>Back Row:</strong> Z5, Z6, Z1 (Defense & Receive)</span>
                    </div>
                  </div>
                )}
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
                      <table className={`game-table ${showLastNameInServeOrder ? 'with-names' : ''}`}>
                        <thead>
                          <tr>
                            <th className="game-col-order">SERVE ORDER</th>
                            <th className="game-col-player">
                              {showLastNameInServeOrder ? 'PLAYER NO. & LAST NAME' : 'PLAYER NO.'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {serveOrders.map((order) => {
                            const { lastName } = parsePlayerName(order.player?.name || '');
                            return (
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
                                    <div className="serve-player-cell">
                                      <span className="serve-player-num">{order.displayNo}</span>
                                      {showLastNameInServeOrder && lastName && (
                                        <span className="serve-player-lastname">{lastName}</span>
                                      )}
                                    </div>
                                  ) : (
                                    <span style={{ color: '#94a3b8' }}>—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
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

      {/* Floating Thumb Button: Return to Mobile View (Visible on Mobile/Tablet when in Paper View) */}
      {viewMode === 'paper' && (
        <button
          type="button"
          className="mobile-back-to-cards-float no-print"
          onClick={() => {
            setViewMode('cards');
            showToast('Switched to Mobile View');
          }}
          title="Return to Mobile View"
          id="btn-return-mobile-view-float"
        >
          <Smartphone size={17} />
          <span>← Back to Mobile View</span>
        </button>
      )}
    </div>
  );
}
