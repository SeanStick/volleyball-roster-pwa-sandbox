import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Shield,
  LayoutGrid,
  ShieldCheck,
  Trophy,
  Sparkles,
  Compass,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import PlayerCard from './components/PlayerCard';
import PlayerModal from './components/PlayerModal';
import CourtView from './components/CourtView';
import FormationsView from './components/FormationsView';
import ScoreboardBar from './components/ScoreboardBar';
import MatchStatsView from './components/MatchStatsView';
import ImportExportModal from './components/ImportExportModal';
import InstallPrompt from './components/InstallPrompt';
import { storageService } from './services/storageService';
import { rotateLineupClockwise, checkLineupFrontRowLiberoViolation } from './services/volleyballRules';
import './styles/court.css';
import './styles/formations.css';
import './styles/stats.css';

export default function App() {
  const [roster, setRoster] = useState(() => storageService.getRoster());
  const [teamSettings, setTeamSettings] = useState(() => storageService.getTeamSettings());
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'court' | 'formations'
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('number-asc');

  // Lifted Match State (shared between Court Lineup and 6-2 Formations Board)
  const getDefaultLineup = (rosterPool) => {
    if (!Array.isArray(rosterPool) || rosterPool.length === 0) {
      return { pos1: null, pos2: null, pos3: null, pos4: null, pos5: null, pos6: null };
    }
    const setters = rosterPool.filter(p => p.position === 'Setter');
    const outsides = rosterPool.filter(p => p.position === 'Outside Hitter');
    const middles = rosterPool.filter(p => p.position === 'Middle Blocker');
    const opposites = rosterPool.filter(p => p.position === 'Opposite Hitter' || p.position === 'Right Side');
    const liberos = rosterPool.filter(p => p.position === 'Libero' || p.isLibero);
    const starters = rosterPool.filter(p => p.isStarter);

    const pos1 = setters[0]?.id || starters[0]?.id || rosterPool[0]?.id || null;
    const pos2 = outsides[0]?.id || starters[1]?.id || rosterPool[1]?.id || null;
    const pos3 = middles[0]?.id || starters[2]?.id || rosterPool[2]?.id || null;
    const pos4 = setters[1]?.id || opposites[0]?.id || starters[3]?.id || rosterPool[3]?.id || null;
    const pos5 = outsides[1]?.id || starters[4]?.id || rosterPool[4]?.id || null;
    const pos6 = liberos[0]?.id || middles[1]?.id || starters[5]?.id || rosterPool[5]?.id || null;

    return { pos1, pos2, pos3, pos4, pos5, pos6 };
  };

  const savedMatchState = storageService.getMatchState();

  const [lineup, setLineup] = useState(() => savedMatchState?.lineup || getDefaultLineup(roster));
  const [startingLineup, setStartingLineup] = useState(() => savedMatchState?.startingLineup || savedMatchState?.lineup || getDefaultLineup(roster));
  const [rotation, setRotation] = useState(() => savedMatchState?.rotation || 1);
  const [phase, setPhase] = useState(() => savedMatchState?.phase || 'serve'); // 'serve' | 'receive'
  const [liberoExchanges, setLiberoExchanges] = useState(() => {
    if (savedMatchState?.liberoExchanges) return savedMatchState.liberoExchanges;
    const initialExchanges = {};
    const initialLineup = savedMatchState?.lineup || getDefaultLineup(roster);
    if (initialLineup && Array.isArray(roster)) {
      const liberoInLineup = Object.values(initialLineup).find(id => {
        const p = roster.find(player => player.id === id);
        return p && (p.position === 'Libero' || p.isLibero);
      });
      if (liberoInLineup) {
        const mbOnBench = roster.find(p => p.position === 'Middle Blocker' && !Object.values(initialLineup).includes(p.id));
        if (mbOnBench) initialExchanges[liberoInLineup] = mbOnBench.id;
      }
    }
    return initialExchanges;
  });
  const [liberoServingRotation, setLiberoServingRotation] = useState(() => savedMatchState?.liberoServingRotation ?? null);
  const [subHistory, setSubHistory] = useState(() => savedMatchState?.subHistory || []);
  const [maxSubs, setMaxSubs] = useState(() => savedMatchState?.maxSubs || 12);
  const [enforcePositionLock, setEnforcePositionLock] = useState(() => savedMatchState?.enforcePositionLock || false);

  // Sync matchState to localStorage
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

  // Match Stats & Error Tracking State
  const [matchStats, setMatchStats] = useState(() => storageService.getMatchStats());

  // Sync matchStats to localStorage
  useEffect(() => {
    storageService.saveMatchStats(matchStats);
  }, [matchStats]);

  const handleUpdateRotation = (newRotation) => {
    if (newRotation === rotation) return;
    const steps = (newRotation - rotation + 6) % 6;
    let current = { ...lineup };
    for (let i = 0; i < steps; i++) {
      current = rotateLineupClockwise(current);
      const violation = checkLineupFrontRowLiberoViolation(current, roster, liberoExchanges);
      if (violation.hasViolation && violation.replacedPlayer) {
        current[violation.zoneKey] = violation.replacedPlayer.id;
      }
    }
    setLineup(current);
    setRotation(newRotation);
  };

  // Official Volleyball Scoring & Side-Out Rotation Handlers
  const handleRallyWonByUs = (pointDetails = {}) => {
    const newPoint = {
      id: `pt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      pointWonBy: 'us',
      rotation,
      phase,
      setNumber: matchStats?.setNumber || 1,
      ...pointDetails
    };

    setMatchStats(prev => ({
      ...prev,
      ourScore: (prev?.ourScore || 0) + 1,
      pointHistory: [...(prev?.pointHistory || []), newPoint]
    }));

    // Official Rule: If receiving and win rally -> Side-Out! Rotate clockwise and take serve!
    if (phase === 'receive') {
      const nextRot = rotation === 6 ? 1 : rotation + 1;
      let nextLineup = rotateLineupClockwise(lineup);
      const violation = checkLineupFrontRowLiberoViolation(nextLineup, roster, liberoExchanges);
      if (violation.hasViolation && violation.replacedPlayer) {
        nextLineup[violation.zoneKey] = violation.replacedPlayer.id;
      }
      setLineup(nextLineup);
      setRotation(nextRot);
      setPhase('serve');
    }
  };

  const handleRallyWonByOpponent = (pointDetails = {}) => {
    const newPoint = {
      id: `pt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      pointWonBy: 'opponent',
      rotation,
      phase,
      setNumber: matchStats?.setNumber || 1,
      ...pointDetails
    };

    setMatchStats(prev => ({
      ...prev,
      opponentScore: (prev?.opponentScore || 0) + 1,
      pointHistory: [...(prev?.pointHistory || []), newPoint]
    }));

    // Official Rule: If serving and lose rally -> Side-Out! Switch to receive (same rotation).
    if (phase === 'serve') {
      setPhase('receive');
    }
  };

  const handleUndoLastPoint = () => {
    if (!matchStats?.pointHistory || matchStats.pointHistory.length === 0) return;
    const lastPoint = matchStats.pointHistory[matchStats.pointHistory.length - 1];

    setMatchStats(prev => {
      const updatedHistory = prev.pointHistory.slice(0, -1);
      return {
        ...prev,
        ourScore: lastPoint.pointWonBy === 'us' ? Math.max(0, prev.ourScore - 1) : prev.ourScore,
        opponentScore: lastPoint.pointWonBy === 'opponent' ? Math.max(0, prev.opponentScore - 1) : prev.opponentScore,
        pointHistory: updatedHistory
      };
    });

    if (lastPoint.rotation && lastPoint.rotation !== rotation) {
      handleUpdateRotation(lastPoint.rotation);
    }
    if (lastPoint.phase && lastPoint.phase !== phase) {
      setPhase(lastPoint.phase);
    }
  };

  const handleResetScore = () => {
    setMatchStats(prev => ({
      ...prev,
      ourScore: 0,
      opponentScore: 0
    }));
  };

  const handleStartNewSet = () => {
    const isOurSet = (matchStats?.ourScore || 0) > (matchStats?.opponentScore || 0);
    const completedSet = {
      setNumber: matchStats?.setNumber || 1,
      ourScore: matchStats?.ourScore || 0,
      opponentScore: matchStats?.opponentScore || 0,
      winner: isOurSet ? 'us' : 'opponent'
    };

    setMatchStats(prev => ({
      ...prev,
      ourScore: 0,
      opponentScore: 0,
      setNumber: (prev?.setNumber || 1) + 1,
      ourSetsWon: isOurSet ? (prev?.ourSetsWon || 0) + 1 : (prev?.ourSetsWon || 0),
      opponentSetsWon: !isOurSet ? (prev?.opponentSetsWon || 0) + 1 : (prev?.opponentSetsWon || 0),
      setHistory: [...(prev?.setHistory || []), completedSet]
    }));

    if (startingLineup) {
      setLineup(startingLineup);
    }
    setRotation(1);
    setPhase('serve');
  };

  const handleResetFullMatch = () => {
    const fresh = storageService.resetFullMatch();
    setMatchStats(fresh);
    if (startingLineup) {
      setLineup(startingLineup);
    }
    setRotation(1);
    setPhase('serve');
  };

  const handleAdvanceRally = () => {
    if (phase === 'serve') {
      setPhase('receive');
    } else {
      const nextRot = rotation === 6 ? 1 : rotation + 1;
      let nextLineup = rotateLineupClockwise(lineup);
      const violation = checkLineupFrontRowLiberoViolation(nextLineup, roster, liberoExchanges);
      if (violation.hasViolation && violation.replacedPlayer) {
        nextLineup[violation.zoneKey] = violation.replacedPlayer.id;
      }
      setLineup(nextLineup);
      setRotation(nextRot);
      setPhase('serve');
    }
  };

  // Modals
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState(null);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  // Sync to localStorage whenever roster changes
  useEffect(() => {
    storageService.saveRoster(roster);
  }, [roster]);

  // Handle URL params (for PWA shortcuts: ?action=add or ?tab=court)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add') {
      setIsPlayerModalOpen(true);
    }
    if (params.get('tab') === 'court') {
      setActiveTab('court');
    }
    if (params.get('tab') === 'formations') {
      setActiveTab('formations');
    }
  }, []);

  const handleSavePlayer = (playerData) => {
    setRoster(prev => {
      let updatedList = playerToEdit
        ? prev.map(p => p.id === playerData.id ? playerData : p)
        : [playerData, ...prev];

      if (playerData.isFirstServer) {
        updatedList = updatedList.map(p => p.id === playerData.id ? p : { ...p, isFirstServer: false });
      }
      return updatedList;
    });
    if (!playerToEdit) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    }
    setIsPlayerModalOpen(false);
    setPlayerToEdit(null);
  };

  const handleDeletePlayer = (id) => {
    if (window.confirm('Are you sure you want to remove this player from the roster?')) {
      setRoster(prev => prev.filter(p => p.id !== id));
      setLineup(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k] === id) next[k] = null;
        });
        return next;
      });
      setStartingLineup(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k] === id) next[k] = null;
        });
        return next;
      });
      setLiberoExchanges(prev => {
        const next = { ...prev };
        delete next[id];
        Object.keys(next).forEach(k => {
          if (next[k] === id) delete next[k];
        });
        return next;
      });
    }
  };

  const handleUpdatePlayerPosition = (playerId, targetPosition) => {
    setRoster(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          position: targetPosition,
          isLibero: targetPosition === 'Libero'
        };
      }
      return p;
    }));
  };

  const handleDuplicatePlayer = (player) => {
    const nextNumber = Math.min(99, player.number + 1);
    const newPlayer = {
      ...player,
      id: `p-${Date.now()}`,
      name: `${player.name} (Copy)`,
      number: nextNumber,
      isCaptain: false
    };
    setRoster(prev => [newPlayer, ...prev]);
  };

  const handleOpenAdd = () => {
    setPlayerToEdit(null);
    setIsPlayerModalOpen(true);
  };

  const handleOpenEdit = (player) => {
    setPlayerToEdit(player);
    setIsPlayerModalOpen(true);
  };

  // Filter & Search Logic
  const filteredRoster = roster
    .filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.number).includes(searchTerm) ||
        (p.position && p.position.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      if (sortBy === 'number-asc') return a.number - b.number;
      if (sortBy === 'number-desc') return b.number - a.number;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'position') return a.position.localeCompare(b.position);
      return 0;
    });

  // Team Stats Calculations
  const totalPlayers = roster.length;
  const startersCount = roster.filter(p => p.isStarter).length;
  const captain = roster.find(p => p.isCaptain);
  const setters = roster.filter(p => p.position === 'Setter').length;
  const liberos = roster.filter(p => p.position === 'Libero').length;

  return (
    <div className="app-container">
      <Navbar
        onOpenAddModal={handleOpenAdd}
        onOpenImportExportModal={() => setIsImportExportModalOpen(true)}
      />

      <InstallPrompt />

      {/* Navigation Tabs: Roster vs Lineup vs 6-2 vs Match Stats */}
      <div className="tabs-bar" role="tablist" aria-label="Main Navigation">
        <button
          id="tab-roster"
          role="tab"
          aria-selected={activeTab === 'roster'}
          className={`tab-button ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
          title="Team Roster"
        >
          <Users size={18} className="tab-icon" />
          <span className="tab-label-desktop">Team Roster ({totalPlayers})</span>
          <span className="tab-label-mobile">Roster</span>
        </button>

        <button
          id="tab-court"
          role="tab"
          aria-selected={activeTab === 'court'}
          className={`tab-button ${activeTab === 'court' ? 'active' : ''}`}
          onClick={() => setActiveTab('court')}
          title="6-Position Lineup"
        >
          <LayoutGrid size={18} className="tab-icon" />
          <span className="tab-label-desktop">6-Position Lineup</span>
          <span className="tab-label-mobile">Lineup</span>
        </button>

        <button
          id="tab-formations"
          role="tab"
          aria-selected={activeTab === 'formations'}
          className={`tab-button ${activeTab === 'formations' ? 'active' : ''}`}
          onClick={() => setActiveTab('formations')}
          title="6-2 Formations & Tactics"
        >
          <Compass size={18} className="tab-icon" />
          <span className="tab-label-desktop">6-2 Formations & Tactics</span>
          <span className="tab-label-mobile">6-2 Tactics</span>
        </button>

        <button
          id="tab-stats"
          role="tab"
          aria-selected={activeTab === 'stats'}
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
          title="Match Stats & PDF"
        >
          <BarChart3 size={18} className="tab-icon" />
          <span className="tab-label-desktop">Match Stats & PDF</span>
          <span className="tab-label-mobile">Stats & PDF</span>
        </button>
      </div>

      {/* Floating In-Game Scoreboard Ribbon (Visible on all tabs for quick score & error tracking) */}
      <ScoreboardBar
        matchStats={matchStats}
        setMatchStats={setMatchStats}
        onRallyWonByUs={handleRallyWonByUs}
        onRallyWonByOpponent={handleRallyWonByOpponent}
        onUndoLastPoint={handleUndoLastPoint}
        onResetScore={handleResetScore}
        onStartNewSet={handleStartNewSet}
        lineup={lineup}
        roster={roster}
        rotation={rotation}
        phase={phase}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Stats Ribbon */}
      <div className="stats-ribbon">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 107, 53, 0.15)', color: 'var(--accent-orange)' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val">{totalPlayers}</div>
            <div className="stat-label">Roster Size</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Trophy size={22} />
          </div>
          <div>
            <div className="stat-val">{startersCount}/6</div>
            <div className="stat-label">Starting 6 Set</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div className="stat-val">{setters}</div>
            <div className="stat-label">Setters</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Shield size={22} />
          </div>
          <div>
            <div className="stat-val">{captain ? `#${captain.number}` : 'None'}</div>
            <div className="stat-label">Captain: {captain?.name ? captain.name.split(' ')[0] : '—'}</div>
          </div>
        </div>
      </div>

      {activeTab === 'roster' && (
        <>
          {/* Roster Controls & Filters Bar */}
          <div className="controls-bar">
            <div className="search-filter-group">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search name, jersey #, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                aria-label="Filter by Position"
              >
                <option value="ALL">All Positions</option>
                <option value="Setter">Setters</option>
                <option value="Outside Hitter">Outside Hitters</option>
                <option value="Middle Blocker">Middle Blockers</option>
                <option value="Libero">Liberos</option>
                <option value="Opposite Hitter">Opposites</option>
                <option value="Defensive Specialist">Defensive Specialists</option>
              </select>

              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort Roster"
              >
                <option value="number-asc">Sort: Number (Low to High)</option>
                <option value="number-desc">Sort: Number (High to Low)</option>
                <option value="name">Sort: Player Name (A-Z)</option>
                <option value="position">Sort: Position</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>New Player</span>
            </button>
          </div>

          {/* Roster Cards Grid */}
          {filteredRoster.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={36} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700 }}>
                {searchTerm || positionFilter !== 'ALL' ? 'No matching players found' : 'No players in roster yet'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                {searchTerm || positionFilter !== 'ALL'
                  ? 'Try adjusting your search query or position filter.'
                  : 'Start building your volleyball roster by adding player names and jersey numbers.'}
              </p>
              <button className="btn btn-primary" onClick={handleOpenAdd}>
                <Plus size={16} /> Add First Player
              </button>
            </div>
          ) : (
            <div className="roster-grid">
              {filteredRoster.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeletePlayer}
                  onDuplicate={handleDuplicatePlayer}
                  roster={roster}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'court' && (
        /* 6-Position Real Court Lineup & Substitutions */
        <CourtView
          roster={roster}
          lineup={lineup}
          setLineup={setLineup}
          startingLineup={startingLineup}
          setStartingLineup={setStartingLineup}
          rotation={rotation}
          setRotation={setRotation}
          phase={phase}
          setPhase={setPhase}
          liberoExchanges={liberoExchanges}
          setLiberoExchanges={setLiberoExchanges}
          liberoServingRotation={liberoServingRotation}
          setLiberoServingRotation={setLiberoServingRotation}
          subHistory={subHistory}
          setSubHistory={setSubHistory}
          maxSubs={maxSubs}
          setMaxSubs={setMaxSubs}
          enforcePositionLock={enforcePositionLock}
          setEnforcePositionLock={setEnforcePositionLock}
          onUpdatePlayerPosition={handleUpdatePlayerPosition}
        />
      )}

      {activeTab === 'formations' && (
        /* 6-1 Formations & Tactics Interactive Board */
        <FormationsView
          roster={roster}
          lineup={lineup}
          setLineup={setLineup}
          startingLineup={startingLineup}
          setStartingLineup={setStartingLineup}
          rotation={rotation}
          setRotation={setRotation}
          phase={phase}
          setPhase={setPhase}
          liberoExchanges={liberoExchanges}
          setLiberoExchanges={setLiberoExchanges}
          liberoServingRotation={liberoServingRotation}
          setLiberoServingRotation={setLiberoServingRotation}
          subHistory={subHistory}
          setSubHistory={setSubHistory}
          maxSubs={maxSubs}
          enforcePositionLock={enforcePositionLock}
          onSelectRotation={handleUpdateRotation}
          onUpdatePlayerPosition={handleUpdatePlayerPosition}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'stats' && (
        /* Match Stats, Error Ranking Leaderboard & PDF Report Export */
        <MatchStatsView
          matchStats={matchStats}
          setMatchStats={setMatchStats}
          roster={roster}
          teamSettings={teamSettings}
          onResetScore={handleResetScore}
          onStartNewSet={handleStartNewSet}
          onResetFullMatch={handleResetFullMatch}
        />
      )}

      {/* Modals */}
      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => {
          setIsPlayerModalOpen(false);
          setPlayerToEdit(null);
        }}
        onSave={handleSavePlayer}
        playerToEdit={playerToEdit}
        teamSettings={teamSettings}
        roster={roster}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        onRosterUpdated={(newRoster) => setRoster(newRoster)}
      />
    </div>
  );
}
