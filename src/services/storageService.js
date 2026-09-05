const ROSTER_STORAGE_KEY = 'gostandoverthere_volleyball_roster_v1';
const TEAM_SETTINGS_KEY = 'gostandoverthere_team_settings_v1';
const MATCH_STATE_KEY = 'gostandoverthere_match_state_v1';
const MATCH_STATS_KEY = 'gostandoverthere_match_stats_v1';
const MATCH_HISTORY_KEY = 'gostandoverthere_match_history_v1';
const ACTIVE_TAB_KEY = 'gostandoverthere_active_tab_v1';
const TEAMS_LIST_KEY = 'gostandoverthere_teams_list_v1';
const ACTIVE_TEAM_ID_KEY = 'gostandoverthere_active_team_id_v1';
const CACHED_USER_KEY = 'gostandoverthere_cached_user_v1';
const DAY_SCHEDULE_KEY = 'gostandoverthere_day_schedule_v1';
const SAVED_LINEUPS_KEY = 'gostandoverthere_saved_lineups_v1';
const LEGACY_ROSTER_KEY = 'spikesync_volleyball_roster_v1';
const LEGACY_TEAM_KEY = 'spikesync_team_settings_v1';
export const DEFAULT_TEAM_ID = 'team-default';

export const DEFAULT_SAVED_LINEUPS = [
  {
    id: 'preset-default-62',
    name: 'Tournament Starting 6-2',
    description: 'Textbook 6-2 rotation: S1 serving first in Zone 1, S2 in Zone 4, and Libero replacing Middle 2.',
    lineup: {
      pos1: 'p-1', // Reese Stickrod (Setter 1)
      pos2: 'p-2', // Gracyn Brandt (OH 1)
      pos3: 'p-3', // Lexi Wright (Middle 1)
      pos4: 'p-6', // Baylee King (Setter 2 / Opposite)
      pos5: 'p-7', // Aliza Jackson (OH 2)
      pos6: 'p-4'  // Tierney Hicks (Middle 2 / DS)
    },
    liberoId: 'p-5', // Lucy Wetrich (Libero)
    createdAt: '2026-08-20T12:00:00.000Z'
  },
  {
    id: 'preset-defense-heavy',
    name: 'Defensive Boost (DS Back-Row)',
    description: 'Defensive configuration with DS Tierney Hicks covering back-row receive alongside Libero Lucy Wetrich.',
    lineup: {
      pos1: 'p-1',
      pos2: 'p-2',
      pos3: 'p-3',
      pos4: 'p-6',
      pos5: 'p-4',
      pos6: 'p-7'
    },
    liberoId: 'p-5',
    createdAt: '2026-08-20T12:00:00.000Z'
  }
];

export const DEFAULT_DAY_SCHEDULE = [
  { id: 'sched-1', matchStage: 'Match 1', opponentName: 'Thunderbolts VC', courtNumber: 'Court 1', time: '08:00 AM', format: 'Best of 3 (25, 25, 15)', status: 'completed' },
  { id: 'sched-2', matchStage: 'Match 2', opponentName: 'Apex Volleyball', courtNumber: 'Court 1', time: '10:00 AM', format: 'Best of 3 (25, 25, 15)', status: 'ready' },
  { id: 'sched-3', matchStage: 'Match 3', opponentName: 'Skyline Elite', courtNumber: 'Court 1', time: '12:00 PM', format: 'Best of 3 (25, 25, 15)', status: 'upcoming' },
  { id: 'sched-4', matchStage: 'Playoffs', opponentName: 'Gold Bracket', courtNumber: 'Court 2', time: '02:00 PM', format: 'Best of 3 (25, 25, 15)', status: 'upcoming' }
];

export const INITIAL_MATCH_STATS = {
  tournamentName: 'Midwest Qualifier 2026',
  courtNumber: 'Court 1',
  opponentName: 'Opponent',
  matchStage: 'Pool Play - Match 1',
  matchFormat: 'Best of 3 (25, 25, 15)',
  targetPoints: 25,
  ourScore: 0,
  opponentScore: 0,
  setNumber: 1,
  ourSetsWon: 0,
  opponentSetsWon: 0,
  isTrackingEnabled: true,
  // Official Timeout tracking (2 per team per set)
  ourTimeoutsRemaining: 2,
  opponentTimeoutsRemaining: 2,
  timeoutHistory: [],
  // Substitution tracking
  maxSubs: 12,
  subHistory: [],
  pointHistory: [],
  setHistory: []
};

export const SAMPLE_MATCH_HISTORY = [
  {
    id: 'match-past-1',
    tournamentName: 'Midwest Qualifier 2026',
    courtNumber: 'Court 4',
    matchStage: 'Pool Play - Match 1',
    matchFormat: 'Best of 3 (25, 25, 15)',
    opponentName: 'Thunderbolts VC',
    date: '2026-08-22T18:30:00.000Z',
    result: 'WON',
    ourSetsWon: 2,
    opponentSetsWon: 1,
    finalScore: '25-21, 22-25, 15-11',
    setScores: [
      { setNumber: 1, ourScore: 25, opponentScore: 21 },
      { setNumber: 2, ourScore: 22, opponentScore: 25 },
      { setNumber: 3, ourScore: 15, opponentScore: 11 }
    ],
    pointHistory: [
      { id: 'pt-1', setNumber: 1, rotation: 1, phase: 'serve', pointWonBy: 'us', earnedType: 'ace', earnedPlayerId: 'p-1', timestamp: '2026-08-22T18:31:00.000Z' },
      { id: 'pt-2', setNumber: 1, rotation: 1, phase: 'serve', pointWonBy: 'opponent', errorTypeId: 'missed_serve_net', errorPlayerId: 'p-1', errorCategory: 'Service Errors', timestamp: '2026-08-22T18:32:00.000Z' },
      { id: 'pt-3', setNumber: 1, rotation: 2, phase: 'receive', pointWonBy: 'us', earnedType: 'kill', earnedPlayerId: 'p-2', timestamp: '2026-08-22T18:33:00.000Z' },
      { id: 'pt-4', setNumber: 1, rotation: 3, phase: 'serve', pointWonBy: 'opponent', errorTypeId: 'attack_net', errorPlayerId: 'p-2', errorCategory: 'Attack Errors', timestamp: '2026-08-22T18:34:00.000Z' },
      { id: 'pt-5', setNumber: 1, rotation: 4, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'receive_ace_against', errorPlayerId: 'p-7', errorCategory: 'Passing & Receive Errors', timestamp: '2026-08-22T18:35:00.000Z' },
      { id: 'pt-6', setNumber: 2, rotation: 3, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'attack_net', errorPlayerId: 'p-2', errorCategory: 'Attack Errors', timestamp: '2026-08-22T18:50:00.000Z' },
      { id: 'pt-7', setNumber: 2, rotation: 4, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'receive_ace_against', errorPlayerId: 'p-7', errorCategory: 'Passing & Receive Errors', timestamp: '2026-08-22T18:52:00.000Z' },
      { id: 'pt-8', setNumber: 2, rotation: 1, phase: 'serve', pointWonBy: 'opponent', errorTypeId: 'missed_serve_out', errorPlayerId: 'p-4', errorCategory: 'Service Errors', timestamp: '2026-08-22T18:55:00.000Z' },
      { id: 'pt-9', setNumber: 3, rotation: 1, phase: 'serve', pointWonBy: 'us', earnedType: 'ace', earnedPlayerId: 'p-1', timestamp: '2026-08-22T19:10:00.000Z' },
      { id: 'pt-10', setNumber: 3, rotation: 2, phase: 'receive', pointWonBy: 'us', earnedType: 'kill', earnedPlayerId: 'p-3', timestamp: '2026-08-22T19:12:00.000Z' }
    ]
  },
  {
    id: 'match-past-2',
    opponentName: 'Metro Stars 16U',
    date: '2026-08-15T14:00:00.000Z',
    result: 'LOST',
    ourSetsWon: 1,
    opponentSetsWon: 2,
    finalScore: '25-23, 19-25, 13-15',
    setScores: [
      { setNumber: 1, ourScore: 25, opponentScore: 23 },
      { setNumber: 2, ourScore: 19, opponentScore: 25 },
      { setNumber: 3, ourScore: 13, opponentScore: 15 }
    ],
    pointHistory: [
      { id: 'pt-20', setNumber: 1, rotation: 1, phase: 'serve', pointWonBy: 'us', earnedType: 'kill', earnedPlayerId: 'p-2', timestamp: '2026-08-15T14:02:00.000Z' },
      { id: 'pt-21', setNumber: 2, rotation: 4, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'attack_blocked', errorPlayerId: 'p-6', errorCategory: 'Attack Errors', timestamp: '2026-08-15T14:25:00.000Z' },
      { id: 'pt-22', setNumber: 2, rotation: 4, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'attack_net', errorPlayerId: 'p-2', errorCategory: 'Attack Errors', timestamp: '2026-08-15T14:26:00.000Z' },
      { id: 'pt-23', setNumber: 2, rotation: 1, phase: 'serve', pointWonBy: 'opponent', errorTypeId: 'missed_serve_net', errorPlayerId: 'p-1', errorCategory: 'Service Errors', timestamp: '2026-08-15T14:30:00.000Z' },
      { id: 'pt-24', setNumber: 3, rotation: 3, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'receive_ace_against', errorPlayerId: 'p-7', errorCategory: 'Passing & Receive Errors', timestamp: '2026-08-15T14:45:00.000Z' }
    ]
  }
];

export const INITIAL_SAMPLE_ROSTER = [
  {
    id: 'p-1',
    name: 'Aubrie Stickrod',
    number: 7,
    position: 'Setter',
    secondaryPosition: 'Right Side',
    isCaptain: true,
    isStarter: true,
    isFirstServer: true,
    height: '"',
    status: 'Active',
    notes: ''
  },
  {
    id: 'p-2',
    name: 'Gracyn Brandt',
    number: 14,
    position: 'Outside Hitter',
    secondaryPosition: 'Defensive Specialist',
    isCaptain: false,
    isStarter: true,
    isFirstServer: false,
    height: '',
    status: 'Active',
    notes: ''
  },
  {
    id: 'p-3',
    name: 'Lexi Wright',
    number: 11,
    position: 'Middle Blocker',
    secondaryPosition: '',
    isCaptain: false,
    isStarter: true,
    isFirstServer: false,
    height: '',
    status: 'Active',
    notes: ''
  },
  {
    id: 'p-4',
    name: 'Tierney Hicks',
    number: 4,
    position: 'Defensive Specialist',
    secondaryPosition: 'Outside Hitter',
    isCaptain: false,
    isStarter: true,
    isFirstServer: false,
    height: '5\'7"',
    status: 'Active',
    notes: ''
  },
  {
    id: 'p-5',
    name: 'Lucy Wetrich',
    number: 9,
    position: 'Libero',
    secondaryPosition: '',
    isCaptain: false,
    isStarter: true,
    isFirstServer: false,
    height: '',
    status: 'Active',
    notes: ''
  },
  {
    id: 'p-6',
    name: 'Baylee King',
    number: 18,
    position: 'Setter',
    secondaryPosition: 'Right Side',
    isCaptain: false,
    isStarter: true,
    isFirstServer: false,
    height: '',
    status: 'Active',
    notes: ''
  },
  {
    id: 'p-7',
    name: 'Aliza Jackson',
    number: 2,
    position: 'Outside Hitter',
    secondaryPosition: 'Right Side',
    isCaptain: false,
    isStarter: false,
    isFirstServer: false,
    height: '',
    status: 'Active',
    notes: ''
  }
];

export const INITIAL_TEAM_SETTINGS = {
  teamName: 'CVA Black - 9th',
  season: '2026 - 2027',
  primaryColor: '#ff6b35',
  secondaryColor: '#1e3a8a',
  liberoColor: '#8b5cf6',
  userRole: 'head_coach' // 'head_coach' | 'assistant_coach' | 'player' | 'parent'
};

export const storageService = {
  getRoster() {
    try {
      let data = localStorage.getItem(ROSTER_STORAGE_KEY);
      if (!data) {
        // Fallback check for legacy storage key to preserve existing user data
        const legacyData = localStorage.getItem(LEGACY_ROSTER_KEY);
        if (legacyData) {
          localStorage.setItem(ROSTER_STORAGE_KEY, legacyData);
          data = legacyData;
        }
      }
      if (!data) {
        this.saveRoster(INITIAL_SAMPLE_ROSTER);
        return INITIAL_SAMPLE_ROSTER;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading roster from localStorage:', e);
      return INITIAL_SAMPLE_ROSTER;
    }
  },

  saveRoster(players) {
    try {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(players));
    } catch (e) {
      console.error('Error saving roster to localStorage:', e);
    }
  },

  getTeamSettings() {
    try {
      let data = localStorage.getItem(TEAM_SETTINGS_KEY);
      if (!data) {
        const legacyData = localStorage.getItem(LEGACY_TEAM_KEY);
        if (legacyData) {
          localStorage.setItem(TEAM_SETTINGS_KEY, legacyData);
          data = legacyData;
        }
      }
      if (!data) {
        this.saveTeamSettings(INITIAL_TEAM_SETTINGS);
        return INITIAL_TEAM_SETTINGS;
      }
      const parsed = JSON.parse(data);
      if (!parsed.userRole) {
        parsed.userRole = 'head_coach';
      }
      return parsed;
    } catch (e) {
      console.error('Error reading team settings:', e);
      return INITIAL_TEAM_SETTINGS;
    }
  },

  saveTeamSettings(settings) {
    try {
      localStorage.setItem(TEAM_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving team settings:', e);
    }
  },

  getUserRole() {
    const settings = this.getTeamSettings();
    return settings?.userRole || 'head_coach';
  },

  setUserRole(role) {
    const settings = this.getTeamSettings();
    const updated = { ...settings, userRole: role };
    this.saveTeamSettings(updated);
    return updated;
  },

  getMatchState() {
    try {
      const data = localStorage.getItem(MATCH_STATE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading match state from localStorage:', e);
      return null;
    }
  },

  saveMatchState(matchState) {
    try {
      localStorage.setItem(MATCH_STATE_KEY, JSON.stringify(matchState));
    } catch (e) {
      console.error('Error saving match state to localStorage:', e);
    }
  },

  getActiveTab() {
    try {
      const tab = localStorage.getItem(ACTIVE_TAB_KEY);
      const validTabs = ['roster', 'court', 'formations', 'stats'];
      if (tab && validTabs.includes(tab)) {
        return tab;
      }
      return 'roster';
    } catch (e) {
      console.error('Error reading active tab from localStorage:', e);
      return 'roster';
    }
  },

  saveActiveTab(tab) {
    try {
      const validTabs = ['roster', 'court', 'formations', 'stats'];
      if (tab && validTabs.includes(tab)) {
        localStorage.setItem(ACTIVE_TAB_KEY, tab);
      }
    } catch (e) {
      console.error('Error saving active tab to localStorage:', e);
    }
  },

  getMatchStats() {
    try {
      const data = localStorage.getItem(MATCH_STATS_KEY);
      if (!data) return { ...INITIAL_MATCH_STATS };
      return { ...INITIAL_MATCH_STATS, ...JSON.parse(data) };
    } catch (e) {
      console.error('Error reading match stats from localStorage:', e);
      return { ...INITIAL_MATCH_STATS };
    }
  },

  saveMatchStats(stats) {
    try {
      localStorage.setItem(MATCH_STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving match stats to localStorage:', e);
    }
  },

  resetMatchScore() {
    try {
      const current = this.getMatchStats();
      const updated = {
        ...current,
        ourScore: 0,
        opponentScore: 0
      };
      this.saveMatchStats(updated);
      return updated;
    } catch (e) {
      console.error('Error resetting score:', e);
      return { ...INITIAL_MATCH_STATS };
    }
  },

  resetFullMatch() {
    try {
      this.saveMatchStats(INITIAL_MATCH_STATS);
      return { ...INITIAL_MATCH_STATS };
    } catch (e) {
      console.error('Error resetting full match stats:', e);
      return { ...INITIAL_MATCH_STATS };
    }
  },

  getMatchHistory() {
    try {
      const data = localStorage.getItem(MATCH_HISTORY_KEY);
      if (!data) {
        this.saveMatchHistory(SAMPLE_MATCH_HISTORY);
        return SAMPLE_MATCH_HISTORY;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return SAMPLE_MATCH_HISTORY;
    } catch (e) {
      console.error('Error reading match history:', e);
      return SAMPLE_MATCH_HISTORY;
    }
  },

  saveMatchHistory(historyList) {
    try {
      localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(historyList));
    } catch (e) {
      console.error('Error saving match history:', e);
    }
  },

  archiveCurrentMatch(currentMatchStats, opponentNameParam = null, tournamentOverrides = {}) {
    try {
      if (!currentMatchStats || (currentMatchStats.ourScore === 0 && currentMatchStats.opponentScore === 0 && (!currentMatchStats.pointHistory || currentMatchStats.pointHistory.length === 0) && (!currentMatchStats.setHistory || currentMatchStats.setHistory.length === 0))) {
        return null;
      }

      const oppName = opponentNameParam || currentMatchStats.opponentName || 'Opponent';
      const setsWon = currentMatchStats.ourSetsWon || (currentMatchStats.ourScore > currentMatchStats.opponentScore ? 1 : 0);
      const oppSetsWon = currentMatchStats.opponentSetsWon || (currentMatchStats.opponentScore > currentMatchStats.ourScore ? 1 : 0);
      const isWon = setsWon > oppSetsWon || (setsWon === oppSetsWon && currentMatchStats.ourScore >= currentMatchStats.opponentScore);

      const archivedMatch = {
        id: `match-${Date.now()}`,
        tournamentName: tournamentOverrides.tournamentName || currentMatchStats.tournamentName || 'Tournament',
        courtNumber: tournamentOverrides.courtNumber || currentMatchStats.courtNumber || 'Court 1',
        matchStage: tournamentOverrides.matchStage || currentMatchStats.matchStage || 'Match',
        matchFormat: tournamentOverrides.matchFormat || currentMatchStats.matchFormat || 'Best of 3',
        opponentName: oppName,
        date: new Date().toISOString(),
        result: isWon ? 'WON' : 'LOST',
        ourSetsWon: setsWon,
        opponentSetsWon: oppSetsWon,
        finalScore: currentMatchStats.setHistory?.length > 0
          ? currentMatchStats.setHistory.map(s => `${s.ourScore}-${s.opponentScore}`).join(', ')
          : `${currentMatchStats.ourScore}-${currentMatchStats.opponentScore}`,
        setScores: currentMatchStats.setHistory?.length > 0 ? currentMatchStats.setHistory : [
          { setNumber: currentMatchStats.setNumber || 1, ourScore: currentMatchStats.ourScore, opponentScore: currentMatchStats.opponentScore, winner: currentMatchStats.ourScore > currentMatchStats.opponentScore ? 'us' : 'opponent' }
        ],
        pointHistory: [...(currentMatchStats.pointHistory || [])],
        timeoutHistory: [...(currentMatchStats.timeoutHistory || [])],
        subHistory: [...(currentMatchStats.subHistory || [])]
      };

      const existingHistory = this.getMatchHistory();
      const updatedHistory = [archivedMatch, ...existingHistory];
      this.saveMatchHistory(updatedHistory);
      return archivedMatch;
    } catch (e) {
      console.error('Error archiving match:', e);
      return null;
    }
  },

  deleteMatchFromHistory(matchId) {
    try {
      const existing = this.getMatchHistory();
      const filtered = existing.filter(m => m.id !== matchId);
      this.saveMatchHistory(filtered);
      return filtered;
    } catch (e) {
      console.error('Error deleting match from history:', e);
      return [];
    }
  },

  exportJSON() {
    const data = {
      roster: this.getRoster(),
      teamSettings: this.getTeamSettings(),
      exportedAt: new Date().toISOString(),
      app: 'Go Stand Over There PWA'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volleyball-roster-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportCSV() {
    const roster = this.getRoster();
    const headers = ['Number', 'Name', 'Position', 'Secondary Position', 'Captain', 'Starter', 'Height', 'Status', 'Notes'];
    const rows = roster.map(p => [
      p.number,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.position || ''}"`,
      `"${p.secondaryPosition || ''}"`,
      p.isCaptain ? 'Yes' : 'No',
      p.isStarter ? 'Yes' : 'No',
      `"${p.height || ''}"`,
      `"${p.status || ''}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volleyball-roster-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        this.saveRoster(parsed);
        return { success: true, roster: parsed };
      } else if (parsed && Array.isArray(parsed.roster)) {
        this.saveRoster(parsed.roster);
        if (parsed.teamSettings) this.saveTeamSettings(parsed.teamSettings);
        return { success: true, roster: parsed.roster, settings: parsed.teamSettings };
      }
      throw new Error('Invalid JSON format for roster');
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  importCSV(csvText) {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV is empty or missing data rows');

      const newPlayers = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Simple CSV parser handling quotes
        const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cols = match.map(c => c.replace(/^"|"$/g, '').trim());

        if (cols.length >= 2) {
          newPlayers.push({
            id: `p-${Date.now()}-${i}`,
            number: parseInt(cols[0], 10) || 0,
            name: cols[1] || 'Unknown Player',
            position: cols[2] || 'Outside Hitter',
            secondaryPosition: cols[3] || '',
            isCaptain: (cols[4] || '').toLowerCase().startsWith('y'),
            isStarter: (cols[5] || '').toLowerCase().startsWith('y'),
            height: cols[6] || '',
            status: cols[7] || 'Active',
            notes: cols[8] || ''
          });
        }
      }

      if (newPlayers.length > 0) {
        this.saveRoster(newPlayers);
        return { success: true, roster: newPlayers };
      }
      throw new Error('No valid players could be parsed from CSV');
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // -------------------------------------------------------------
  // User Session Cache
  // -------------------------------------------------------------
  getCachedUser() {
    try {
      const data = localStorage.getItem(CACHED_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading cached user:', e);
      return null;
    }
  },

  setCachedUser(user) {
    try {
      if (!user) {
        localStorage.removeItem(CACHED_USER_KEY);
      } else {
        localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Error saving cached user:', e);
    }
  },

  clearCachedUser() {
    localStorage.removeItem(CACHED_USER_KEY);
  },

  // -------------------------------------------------------------
  // Multi-Team Management
  // -------------------------------------------------------------
  getActiveTeamId() {
    try {
      const activeId = localStorage.getItem(ACTIVE_TEAM_ID_KEY);
      return activeId || DEFAULT_TEAM_ID;
    } catch (e) {
      return DEFAULT_TEAM_ID;
    }
  },

  setActiveTeamId(teamId) {
    try {
      localStorage.setItem(ACTIVE_TEAM_ID_KEY, teamId);
    } catch (e) {
      console.error('Error saving active team ID:', e);
    }
  },

  getTeamsList() {
    try {
      const data = localStorage.getItem(TEAMS_LIST_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Initialize with default team if list is empty
      const defaultSettings = this.getTeamSettings();
      const initialTeams = [
        {
          id: DEFAULT_TEAM_ID,
          teamName: defaultSettings.teamName || 'CVA Black - 9th',
          season: defaultSettings.season || '2026 - 2027',
          primaryColor: defaultSettings.primaryColor || '#ff6b35',
          secondaryColor: defaultSettings.secondaryColor || '#1e3a8a',
          liberoColor: defaultSettings.liberoColor || '#8b5cf6',
          updatedAt: new Date().toISOString()
        }
      ];
      this.saveTeamsList(initialTeams);
      return initialTeams;
    } catch (e) {
      console.error('Error reading teams list:', e);
      return [{ id: DEFAULT_TEAM_ID, teamName: 'My Volleyball Team', season: '2026' }];
    }
  },

  saveTeamsList(teams) {
    try {
      localStorage.setItem(TEAMS_LIST_KEY, JSON.stringify(teams));
    } catch (e) {
      console.error('Error saving teams list:', e);
    }
  },

  getDaySchedule() {
    try {
      const data = localStorage.getItem(DAY_SCHEDULE_KEY);
      if (!data) {
        this.saveDaySchedule(DEFAULT_DAY_SCHEDULE);
        return DEFAULT_DAY_SCHEDULE;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_DAY_SCHEDULE;
    } catch (e) {
      console.error('Error reading day schedule:', e);
      return DEFAULT_DAY_SCHEDULE;
    }
  },

  saveDaySchedule(scheduleList) {
    try {
      localStorage.setItem(DAY_SCHEDULE_KEY, JSON.stringify(scheduleList));
    } catch (e) {
      console.error('Error saving day schedule:', e);
    }
  },

  getSavedLineups() {
    try {
      const data = localStorage.getItem(SAVED_LINEUPS_KEY);
      if (!data) {
        this.saveSavedLineups(DEFAULT_SAVED_LINEUPS);
        return DEFAULT_SAVED_LINEUPS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_SAVED_LINEUPS;
    } catch (e) {
      console.error('Error reading saved lineups:', e);
      return DEFAULT_SAVED_LINEUPS;
    }
  },

  saveSavedLineups(lineupsList) {
    try {
      localStorage.setItem(SAVED_LINEUPS_KEY, JSON.stringify(lineupsList));
    } catch (e) {
      console.error('Error saving saved lineups:', e);
    }
  },

  saveLineupPreset(name, lineupObj, liberoId = null, description = '') {
    try {
      const existing = this.getSavedLineups();
      const newPreset = {
        id: `preset-${Date.now()}`,
        name: name.trim() || `Lineup Preset ${existing.length + 1}`,
        description: description.trim() || 'Custom 6-2 configuration',
        lineup: { ...lineupObj },
        liberoId: liberoId || null,
        createdAt: new Date().toISOString()
      };
      const updated = [newPreset, ...existing];
      this.saveSavedLineups(updated);
      return newPreset;
    } catch (e) {
      console.error('Error creating lineup preset:', e);
      return null;
    }
  },

  deleteLineupPreset(presetId) {
    try {
      const existing = this.getSavedLineups();
      const filtered = existing.filter(p => p.id !== presetId);
      this.saveSavedLineups(filtered);
      return filtered;
    } catch (e) {
      console.error('Error deleting lineup preset:', e);
      return [];
    }
  },

  getFullTeamBundle(teamId = null) {
    const targetId = teamId || this.getActiveTeamId();
    return {
      teamId: targetId,
      teamSettings: this.getTeamSettings(),
      roster: this.getRoster(),
      matchState: this.getMatchState(),
      matchStats: this.getMatchStats(),
      matchHistory: this.getMatchHistory(),
      daySchedule: this.getDaySchedule(),
      savedLineups: this.getSavedLineups(),
      updatedAt: new Date().toISOString()
    };
  },

  loadFullTeamBundle(bundle) {
    if (!bundle) return;
    if (bundle.teamSettings) this.saveTeamSettings(bundle.teamSettings);
    if (Array.isArray(bundle.roster)) this.saveRoster(bundle.roster);
    if (bundle.matchState) this.saveMatchState(bundle.matchState);
    if (bundle.matchStats) this.saveMatchStats(bundle.matchStats);
    if (Array.isArray(bundle.matchHistory)) this.saveMatchHistory(bundle.matchHistory);
    if (Array.isArray(bundle.daySchedule)) this.saveDaySchedule(bundle.daySchedule);
    if (Array.isArray(bundle.savedLineups)) this.saveSavedLineups(bundle.savedLineups);
    if (bundle.teamId) this.setActiveTeamId(bundle.teamId);
  }
};
