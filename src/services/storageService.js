const ROSTER_STORAGE_KEY = 'gostandoverthere_volleyball_roster_v1';
const TEAM_SETTINGS_KEY = 'gostandoverthere_team_settings_v1';
const MATCH_STATE_KEY = 'gostandoverthere_match_state_v1';
const LEGACY_ROSTER_KEY = 'spikesync_volleyball_roster_v1';
const LEGACY_TEAM_KEY = 'spikesync_team_settings_v1';

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
  liberoColor: '#8b5cf6'
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
      return JSON.parse(data);
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
  }
};
