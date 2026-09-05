import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  BarChart3,
  Cloud,
  Share2,
  ArrowRight,
  Dumbbell
} from 'lucide-react';
import VolleyballIcon from './components/icons/VolleyballIcon';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import PlayerCard from './components/PlayerCard';
import PlayerModal from './components/PlayerModal';
import CourtView from './components/CourtView';
import FormationsView from './components/FormationsView';
import ScoreboardBar from './components/ScoreboardBar';
import MatchStatsView from './components/MatchStatsView';
import DrillHubPage from './components/DrillHubPage';
import WhiteboardPage from './components/WhiteboardPage';
import ImportExportModal from './components/ImportExportModal';
import InstallPrompt from './components/InstallPrompt';
import AuthModal from './components/AuthModal';
import TeamManagerModal from './components/TeamManagerModal';
import ShareTeamModal from './components/ShareTeamModal';
import MatchSetupModal from './components/MatchSetupModal';
import MatchWizardModal from './components/MatchWizardModal';
import TournamentDayHubModal from './components/TournamentDayHubModal';
import TournamentSyncToast from './components/TournamentSyncToast';
import RemoteScoreUpdateOverlay from './components/RemoteScoreUpdateOverlay';
import FirebaseSettingsModal from './components/FirebaseSettingsModal';
import DrillCenterModal from './components/DrillCenterModal';
import GameCenterModal from './components/GameCenterModal';
import SetBreakModal from './components/SetBreakModal';
import MatchRecapModal from './components/MatchRecapModal';
import LineupStudioModal from './components/LineupStudioModal';
import NotificationSettingsModal from './components/NotificationSettingsModal';
import { storageService, DEFAULT_TEAM_ID } from './services/storageService';
import { notificationService } from './services/notificationService';
import { firebaseService } from './services/firebaseService';
import { rotateLineupClockwise, checkLineupFrontRowLiberoViolation } from './services/volleyballRules';
import './styles/court.css';
import './styles/formations.css';
import './styles/stats.css';
import './styles/whiteboard.css';

export default function App() {
  // -------------------------------------------------------------
  // User Authentication & Cloud Sync State
  // -------------------------------------------------------------
  const [user, setUser] = useState(() => storageService.getCachedUser());
  const [teams, setTeams] = useState(() => storageService.getTeamsList());
  const [activeTeamId, setActiveTeamId] = useState(() => storageService.getActiveTeamId());
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'offline' | 'error'
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [syncToast, setSyncToast] = useState(null);

  // Unique session device ID to differentiate multiple tabs/devices under the same or shared account
  const deviceIdRef = useRef(`dev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const currentDeviceId = deviceIdRef.current;

  // Guards against race conditions & overwrite loops
  const isHydratingCloudRef = useRef(false);
  const isApplyingRemoteUpdateRef = useRef(false);
  const syncTimeoutRef = useRef(null);

  // Modal visibility states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isTeamManagerModalOpen, setIsTeamManagerModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [teamToShare, setTeamToShare] = useState(null);
  const [isMatchSetupModalOpen, setIsMatchSetupModalOpen] = useState(false);
  const [isMatchWizardOpen, setIsMatchWizardOpen] = useState(false);
  const [isTournamentDayHubOpen, setIsTournamentDayHubOpen] = useState(false);
  const [isGameCenterOpen, setIsGameCenterOpen] = useState(false);
  const [gameCenterInitialTab, setGameCenterInitialTab] = useState('start');
  const [isSetBreakOpen, setIsSetBreakOpen] = useState(false);
  const [isMatchRecapOpen, setIsMatchRecapOpen] = useState(false);
  const [lastCompletedSet, setLastCompletedSet] = useState(null);
  const [daySchedule, setDaySchedule] = useState(() => storageService.getDaySchedule());
  const [isLineupStudioOpen, setIsLineupStudioOpen] = useState(false);
  const [savedLineupPresets, setSavedLineupPresets] = useState(() => storageService.getSavedLineups());
  const [isFirebaseSettingsModalOpen, setIsFirebaseSettingsModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState(null);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isDrillsModalOpen, setIsDrillsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // -------------------------------------------------------------
  // Core Application Data State
  // -------------------------------------------------------------
  const [roster, setRoster] = useState(() => storageService.getRoster());
  const [teamSettings, setTeamSettings] = useState(() => storageService.getTeamSettings());
  const [activeTab, setActiveTab] = useState(() => storageService.getActiveTab()); // 'roster' | 'court' | 'formations' | 'stats'
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('number-asc');

  // Persist active tab selection across page refreshes
  useEffect(() => {
    storageService.saveActiveTab(activeTab);
  }, [activeTab]);

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

  // Match Stats & History State (Fully Lifted to App Level for 100% Cross-Device Sync)
  const [matchStats, setMatchStats] = useState(() => storageService.getMatchStats());
  const [matchHistory, setMatchHistory] = useState(() => storageService.getMatchHistory());
  const [remoteScoreEvent, setRemoteScoreEvent] = useState(null);
  const lastSeenScoreEventIdRef = useRef(null);
  const lastScoreStateRef = useRef({
    ourScore: matchStats?.ourScore ?? 0,
    opponentScore: matchStats?.opponentScore ?? 0
  });

  // -------------------------------------------------------------
  // Instant Cloud Sync Function for Game Events (Scores, Points, Rotations, Tournament Setup)
  // -------------------------------------------------------------
  const syncCloudImmediately = useCallback((bundleOverrides = {}) => {
    if (!user?.uid || isHydratingCloudRef.current || isApplyingRemoteUpdateRef.current) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    const activeTeamObj = teams.find(t => t.id === activeTeamId);
    const now = new Date().toISOString();

    const fullBundle = {
      teamId: activeTeamId,
      shareCode: activeTeamObj?.shareCode || '',
      ownerId: activeTeamObj?.ownerId || user.uid,
      ownerName: activeTeamObj?.ownerName || user.displayName || 'Coach',
      teamSettings,
      roster,
      matchState: {
        lineup,
        startingLineup,
        rotation,
        phase,
        liberoExchanges,
        liberoServingRotation,
        subHistory,
        maxSubs,
        enforcePositionLock
      },
      matchStats,
      matchHistory,
      daySchedule,
      savedLineups: savedLineupPresets,
      updatedAt: now,
      updatedByDeviceId: currentDeviceId,
      ...bundleOverrides
    };

    setSyncStatus('syncing');
    firebaseService.syncFullTeamToCloud(user.uid, fullBundle, user, currentDeviceId).then((res) => {
      if (res.success) {
        setSyncStatus('synced');
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setSyncStatus('error');
      }
    }).catch((err) => {
      console.error('Immediate sync error:', err);
      setSyncStatus('error');
    });
  }, [user, activeTeamId, teams, teamSettings, roster, lineup, startingLineup, rotation, phase, liberoExchanges, liberoServingRotation, subHistory, maxSubs, enforcePositionLock, matchStats, matchHistory, daySchedule, savedLineupPresets, currentDeviceId]);

  // -------------------------------------------------------------
  // Check URL Join Invite Parameter on Startup (?join=VB-CODE)
  // -------------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      if (user?.uid) {
        handleJoinTeam(joinCode).then((res) => {
          if (res.success) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        });
      } else {
        setIsAuthModalOpen(true);
      }
    }
  }, [user?.uid]);

  // -------------------------------------------------------------
  // Hook 1: Firebase Auth Lifecycle & Initial Cloud Hydration
  // -------------------------------------------------------------
  useEffect(() => {
    const unsubscribeAuth = firebaseService.onAuthChange(async (currentUser) => {
      setUser(currentUser);
      storageService.setCachedUser(currentUser);

      if (currentUser?.uid) {
        isHydratingCloudRef.current = true;
        setSyncStatus('syncing');

        try {
          // Check if there was a pending join from the URL
          const params = new URLSearchParams(window.location.search);
          const joinCode = params.get('join');
          if (joinCode) {
            await firebaseService.joinTeamWithCode(currentUser, joinCode);
            window.history.replaceState({}, document.title, window.location.pathname);
          }

          // 1. Fetch user's teams from Google Cloud Firestore
          const res = await firebaseService.fetchUserTeamsFromCloud(currentUser.uid);

          if (res.success && Array.isArray(res.teams) && res.teams.length > 0) {
            const formattedTeams = res.teams.map(t => ({
              id: t.id,
              teamName: t.teamSettings?.teamName || t.teamName || 'Volleyball Team',
              season: t.teamSettings?.season || t.season || '2026',
              primaryColor: t.teamSettings?.primaryColor || t.primaryColor || '#ff6b35',
              secondaryColor: t.teamSettings?.secondaryColor || t.secondaryColor || '#1e3a8a',
              liberoColor: t.teamSettings?.liberoColor || t.liberoColor || '#8b5cf6',
              shareCode: t.shareCode || '',
              role: t.role || (t.ownerId === currentUser.uid ? 'owner' : 'coach'),
              ownerId: t.ownerId || currentUser.uid,
              ownerName: t.ownerName || currentUser.displayName || 'Coach',
              members: t.members || {},
              updatedAt: t.updatedAt || new Date().toISOString()
            }));

            setTeams(formattedTeams);
            storageService.saveTeamsList(formattedTeams);

            // Find current active team or first team from cloud
            const currentActiveId = storageService.getActiveTeamId();
            const targetCloudTeam = res.teams.find(t => t.id === currentActiveId) || res.teams[0];

            if (targetCloudTeam) {
              setActiveTeamId(targetCloudTeam.id);
              storageService.setActiveTeamId(targetCloudTeam.id);

              if (targetCloudTeam.teamSettings) setTeamSettings(targetCloudTeam.teamSettings);
              if (Array.isArray(targetCloudTeam.roster)) setRoster(targetCloudTeam.roster);

              if (targetCloudTeam.matchState?.lineup) {
                setLineup(targetCloudTeam.matchState.lineup);
                setStartingLineup(targetCloudTeam.matchState.startingLineup || targetCloudTeam.matchState.lineup);
                setRotation(targetCloudTeam.matchState.rotation || 1);
                setPhase(targetCloudTeam.matchState.phase || 'serve');
                setLiberoExchanges(targetCloudTeam.matchState.liberoExchanges || {});
                setLiberoServingRotation(targetCloudTeam.matchState.liberoServingRotation ?? null);
                setSubHistory(targetCloudTeam.matchState.subHistory || []);
                setMaxSubs(targetCloudTeam.matchState.maxSubs || 12);
                setEnforcePositionLock(targetCloudTeam.matchState.enforcePositionLock || false);
              }
              if (targetCloudTeam.matchStats) setMatchStats(targetCloudTeam.matchStats);
              if (Array.isArray(targetCloudTeam.matchHistory)) setMatchHistory(targetCloudTeam.matchHistory);
            }
          } else {
            // True first-time user login: upload initial team bundle to cloud
            const currentBundle = storageService.getFullTeamBundle(activeTeamId);
            await firebaseService.syncFullTeamToCloud(currentUser.uid, currentBundle, currentUser, currentDeviceId);
          }

          setSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch (err) {
          console.error('Error during cloud hydration:', err);
          setSyncStatus('error');
        } finally {
          setTimeout(() => {
            isHydratingCloudRef.current = false;
          }, 300);
        }
      }
    });

    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
    };
  }, []);

  // -------------------------------------------------------------
  // Hook 2: Dedicated Real-Time Collaborative Listener on Active Squad
  // -------------------------------------------------------------
  useEffect(() => {
    if (!user?.uid || !activeTeamId) return;

    const unsubscribeSnapshot = firebaseService.subscribeToUserTeam(
      user.uid,
      activeTeamId,
      (cloudTeam, { hasPendingWrites }) => {
        if (hasPendingWrites || isHydratingCloudRef.current || !cloudTeam) return;

        // Ignore update only if it was written by this EXACT same browser session
        if (cloudTeam.updatedByDeviceId && cloudTeam.updatedByDeviceId === currentDeviceId) {
          return;
        }

        // Mark that we are applying remote updates (prevents echo loop)
        isApplyingRemoteUpdateRef.current = true;

        // 1. Live Match Score & Stats
        if (cloudTeam.matchStats) {
          const incomingOurScore = cloudTeam.matchStats.ourScore ?? 0;
          const incomingOppScore = cloudTeam.matchStats.opponentScore ?? 0;
          const localOurScore = lastScoreStateRef.current.ourScore;
          const localOppScore = lastScoreStateRef.current.opponentScore;

          // Check if remote score changed or if there's an incoming lastScoreEvent from another coach
          const incomingScoreEvent = cloudTeam.lastScoreEvent;
          const isNewEventId = incomingScoreEvent && incomingScoreEvent.id !== lastSeenScoreEventIdRef.current;
          const isScoreDifferent = incomingOurScore !== localOurScore || incomingOppScore !== localOppScore;

          if (isNewEventId || isScoreDifferent) {
            const eventTimestamp = incomingScoreEvent?.timestamp
              ? new Date(incomingScoreEvent.timestamp).getTime()
              : Date.now();
            const isRecent = Date.now() - eventTimestamp < 90000; // within last 90 seconds

            if (isRecent) {
              // Resolve the most accurate name for the person who entered the score
              const scorerUid = incomingScoreEvent?.scorer?.uid || cloudTeam.updatedBy;
              const memberInfo = cloudTeam.members && scorerUid ? cloudTeam.members[scorerUid] : null;
              const resolvedName = (incomingScoreEvent?.scorer?.name && incomingScoreEvent.scorer.name !== 'Coach' && incomingScoreEvent.scorer.name !== 'Co-Coach')
                ? incomingScoreEvent.scorer.name
                : (memberInfo?.displayName || cloudTeam.updatedByName || incomingScoreEvent?.scorer?.name || 'Co-Coach');

              const eventToShow = {
                ...(incomingScoreEvent || {
                  id: `remote-score-${Date.now()}`,
                  type: incomingOurScore > localOurScore ? 'point_won_by_us' : 'point_won_by_opponent',
                  pointWonBy: incomingOurScore > localOurScore ? 'us' : (incomingOppScore > localOppScore ? 'opponent' : 'adjust'),
                  timestamp: new Date().toISOString(),
                  newScore: {
                    ourScore: incomingOurScore,
                    opponentScore: incomingOppScore,
                    setNumber: cloudTeam.matchStats.setNumber || 1
                  },
                  details: {
                    earnedTypeName: incomingOurScore > localOurScore ? 'Point Awarded (+1)' : null,
                    errorTypeName: incomingOppScore > localOppScore ? 'Opponent Point (+1)' : null,
                    opponentName: cloudTeam.matchStats.opponentName || 'Opponent',
                    rotation: cloudTeam.matchState?.rotation || rotation,
                    phase: cloudTeam.matchState?.phase || phase
                  }
                }),
                scorer: {
                  ...(incomingScoreEvent?.scorer || {}),
                  name: resolvedName,
                  email: incomingScoreEvent?.scorer?.email || memberInfo?.email || '',
                  uid: scorerUid,
                  deviceId: cloudTeam.updatedByDeviceId || incomingScoreEvent?.scorer?.deviceId
                }
              };

              lastSeenScoreEventIdRef.current = eventToShow.id;
              setRemoteScoreEvent(eventToShow);

              // 🔔 Dispatch Lock Screen Notification for Remote Co-Coach Score Update
              const targetPoints = cloudTeam.matchStats?.targetPoints || 25;
              const isSetPoint = incomingOurScore >= targetPoints - 1 || incomingOppScore >= targetPoints - 1;
              const isMatchPoint = isSetPoint && ((cloudTeam.matchStats?.ourSetsWon || 0) >= 1 || (cloudTeam.matchStats?.opponentSetsWon || 0) >= 1);

              if (isSetPoint) {
                notificationService.sendSetPointNotification({
                  teamLeading: incomingOurScore >= incomingOppScore ? 'us' : 'opponent',
                  ourScore: incomingOurScore,
                  opponentScore: incomingOppScore,
                  setNumber: cloudTeam.matchStats.setNumber || 1,
                  isMatchPoint
                });
              } else {
                notificationService.sendScoreUpdateNotification({
                  ourScore: incomingOurScore,
                  opponentScore: incomingOppScore,
                  opponentName: cloudTeam.matchStats.opponentName || 'Opponent',
                  setNumber: cloudTeam.matchStats.setNumber || 1,
                  scorerName: resolvedName,
                  detailText: incomingOurScore > localOurScore ? 'Point for Our Squad' : 'Opponent Point'
                });
              }
            }
          }

          lastScoreStateRef.current = { ourScore: incomingOurScore, opponentScore: incomingOppScore };

          // Detect set changes or tournament context changes to display friendly toast & alert
          if (cloudTeam.matchStats.setNumber && cloudTeam.matchStats.setNumber !== matchStats?.setNumber) {
            setSyncToast({
              title: `🏐 Set ${cloudTeam.matchStats.setNumber} Started`,
              message: `Co-coach advanced match to Set ${cloudTeam.matchStats.setNumber}`,
              type: 'new_set'
            });

            notificationService.sendLockScreenNotification({
              title: `🏐 Set ${cloudTeam.matchStats.setNumber} Started`,
              body: `Match against ${cloudTeam.matchStats.opponentName || 'Opponent'} advanced to Set ${cloudTeam.matchStats.setNumber}`,
              tag: 'volleyball-set-start',
              alertType: 'new_game'
            });
          }

          setMatchStats(cloudTeam.matchStats);
          storageService.saveMatchStats(cloudTeam.matchStats);
        }

        // 2. Match State (Lineups, Rotations, Subs, Liberos)
        if (cloudTeam.matchState) {
          const ms = cloudTeam.matchState;
          if (ms.lineup) setLineup(ms.lineup);
          if (ms.startingLineup) setStartingLineup(ms.startingLineup);
          if (typeof ms.rotation === 'number') setRotation(ms.rotation);
          if (ms.phase) setPhase(ms.phase);
          if (ms.liberoExchanges) setLiberoExchanges(ms.liberoExchanges);
          if (ms.liberoServingRotation !== undefined) setLiberoServingRotation(ms.liberoServingRotation);
          if (Array.isArray(ms.subHistory)) setSubHistory(ms.subHistory);
          if (ms.maxSubs !== undefined) setMaxSubs(ms.maxSubs);
          if (ms.enforcePositionLock !== undefined) setEnforcePositionLock(ms.enforcePositionLock);
          storageService.saveMatchState(ms);
        }

        // 3. Team Settings
        if (cloudTeam.teamSettings) {
          setTeamSettings(cloudTeam.teamSettings);
          storageService.saveTeamSettings(cloudTeam.teamSettings);
        }

        // 4. Player Roster
        if (Array.isArray(cloudTeam.roster)) {
          setRoster(cloudTeam.roster);
          storageService.saveRoster(cloudTeam.roster);
        }

        // 5. Match History
        if (Array.isArray(cloudTeam.matchHistory)) {
          setMatchHistory(cloudTeam.matchHistory);
          storageService.saveMatchHistory(cloudTeam.matchHistory);
        }

        // 6. Day Schedule
        if (Array.isArray(cloudTeam.daySchedule)) {
          setDaySchedule(cloudTeam.daySchedule);
          storageService.saveDaySchedule(cloudTeam.daySchedule);
        }

        // 7. Saved Lineups Presets
        if (Array.isArray(cloudTeam.savedLineups)) {
          setSavedLineupPresets(cloudTeam.savedLineups);
          storageService.saveSavedLineups(cloudTeam.savedLineups);
        }

        // 8. Share Code & Members
        if (cloudTeam.shareCode) {
          setTeams(prevTeams => prevTeams.map(t => t.id === cloudTeam.id ? { ...t, shareCode: cloudTeam.shareCode, members: cloudTeam.members || t.members } : t));
        }

        setSyncStatus('synced');
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    );

    return () => {
      if (typeof unsubscribeSnapshot === 'function') {
        unsubscribeSnapshot();
      }
    };
  }, [user?.uid, activeTeamId, currentDeviceId, matchStats?.setNumber]);

  // -------------------------------------------------------------
  // Real-Time Local Persistence + Google Cloud Auto-Save (Debounced)
  // -------------------------------------------------------------
  const performCloudAutoSync = useCallback((fullBundle) => {
    if (!user?.uid || isHydratingCloudRef.current || isApplyingRemoteUpdateRef.current) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    setSyncStatus('syncing');
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await firebaseService.syncFullTeamToCloud(user.uid, fullBundle, user, currentDeviceId);
        if (res.success) {
          setSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else {
          setSyncStatus('error');
        }
      } catch (err) {
        console.error('Auto sync error:', err);
        setSyncStatus('error');
      }
    }, 400);
  }, [user, currentDeviceId]);

  // Sync state changes locally and trigger debounced cloud sync
  useEffect(() => {
    storageService.saveRoster(roster);
    storageService.saveTeamSettings(teamSettings);
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
    storageService.saveMatchStats(matchStats);
    storageService.saveMatchHistory(matchHistory);

    // If this state change was caused by receiving a remote snapshot, consume the flag and don't re-upload
    if (isApplyingRemoteUpdateRef.current) {
      isApplyingRemoteUpdateRef.current = false;
      return;
    }

    const activeTeamObj = teams.find(t => t.id === activeTeamId);

    const fullBundle = {
      teamId: activeTeamId,
      shareCode: activeTeamObj?.shareCode || '',
      ownerId: activeTeamObj?.ownerId || user?.uid,
      ownerName: activeTeamObj?.ownerName || user?.displayName || 'Coach',
      teamSettings,
      roster,
      matchState: {
        lineup,
        startingLineup,
        rotation,
        phase,
        liberoExchanges,
        liberoServingRotation,
        subHistory,
        maxSubs,
        enforcePositionLock
      },
      matchStats,
      matchHistory,
      updatedAt: new Date().toISOString(),
      updatedByDeviceId: currentDeviceId
    };

    performCloudAutoSync(fullBundle);
  }, [
    roster,
    teamSettings,
    lineup,
    startingLineup,
    rotation,
    phase,
    liberoExchanges,
    liberoServingRotation,
    subHistory,
    maxSubs,
    enforcePositionLock,
    matchStats,
    matchHistory,
    activeTeamId,
    performCloudAutoSync,
    currentDeviceId
  ]);

  // -------------------------------------------------------------
  // Tournament & Match Setup Handlers
  // -------------------------------------------------------------
  const handleUpdateMatchDetails = (details) => {
    const nextStats = {
      ...matchStats,
      ...details
    };
    setMatchStats(nextStats);

    setSyncToast({
      title: '📍 Match Details Updated',
      message: `${details.tournamentName || 'Tournament'} • ${details.courtNumber || 'Court 1'} (vs ${details.opponentName || 'Opponent'})`,
      type: 'court_change'
    });

    syncCloudImmediately({
      matchStats: nextStats
    });
  };

  const handleStartFreshMatch = (newMatchPayload = {}) => {
    // 1. If previous match had scores or sets, archive it
    if ((matchStats?.ourScore > 0 || matchStats?.opponentScore > 0 || (matchStats?.setHistory && matchStats.setHistory.length > 0))) {
      storageService.archiveCurrentMatch(matchStats, matchStats.opponentName);
      const nextHistory = storageService.getMatchHistory();
      setMatchHistory(nextHistory);
    }

    const chosenMaxSubs = newMatchPayload.maxSubs || maxSubs || 12;
    const freshStats = {
      ...storageService.resetFullMatch(),
      tournamentName: newMatchPayload.tournamentName || matchStats?.tournamentName || 'Tournament Day',
      courtNumber: newMatchPayload.courtNumber || matchStats?.courtNumber || 'Court 1',
      opponentName: newMatchPayload.opponentName || 'Opponent',
      matchStage: newMatchPayload.matchStage || 'Match 1',
      matchFormat: newMatchPayload.matchFormat || 'Best of 3 (25, 25, 15)',
      targetPoints: newMatchPayload.targetPoints || 25,
      setNumber: 1,
      ourScore: 0,
      opponentScore: 0,
      ourSetsWon: 0,
      opponentSetsWon: 0,
      ourTimeoutsRemaining: 2,
      opponentTimeoutsRemaining: 2,
      timeoutHistory: [],
      maxSubs: chosenMaxSubs,
      subHistory: [],
      pointHistory: [],
      setHistory: []
    };

    const newLineup = newMatchPayload.lineup || startingLineup || getDefaultLineup(roster);
    const newPhase = newMatchPayload.phase || 'serve';
    const newRotation = newMatchPayload.rotation || 1;

    setMatchStats(freshStats);
    setLineup(newLineup);
    setStartingLineup(newLineup);
    setRotation(newRotation);
    setPhase(newPhase);
    setSubHistory([]);
    setMaxSubs(chosenMaxSubs);

    const nextExchanges = {};
    if (newMatchPayload.liberoId) {
      const mbOnBench = roster.find(p => p.position === 'Middle Blocker' && !Object.values(newLineup).includes(p.id));
      if (mbOnBench) {
        nextExchanges[newMatchPayload.liberoId] = mbOnBench.id;
      }
    }
    setLiberoExchanges(nextExchanges);
    setLiberoServingRotation(null);

    setSyncToast({
      title: '🏆 New Match Started',
      message: `${freshStats.matchStage} vs ${freshStats.opponentName} at ${freshStats.courtNumber} (Set 1)`,
      type: 'new_match'
    });

    notificationService.sendNewMatchNotification({
      opponentName: freshStats.opponentName,
      tournamentName: freshStats.tournamentName,
      courtNumber: freshStats.courtNumber,
      matchFormat: freshStats.matchFormat
    });

    syncCloudImmediately({
      matchStats: freshStats,
      matchHistory: storageService.getMatchHistory(),
      matchState: {
        lineup: newLineup,
        startingLineup: newLineup,
        rotation: newRotation,
        phase: newPhase,
        liberoExchanges: nextExchanges,
        liberoServingRotation: null,
        subHistory: [],
        maxSubs: chosenMaxSubs,
        enforcePositionLock
      }
    });
  };

  const handleCallTimeout = (team) => {
    const isUs = team === 'us';
    const currentRemaining = isUs ? (matchStats?.ourTimeoutsRemaining ?? 2) : (matchStats?.opponentTimeoutsRemaining ?? 2);
    if (currentRemaining <= 0) return;

    const timeoutEntry = {
      id: `to-${Date.now()}`,
      setNumber: matchStats?.setNumber || 1,
      team: isUs ? 'us' : 'opponent',
      ourScore: matchStats?.ourScore || 0,
      opponentScore: matchStats?.opponentScore || 0,
      timestamp: new Date().toISOString()
    };

    const nextStats = {
      ...matchStats,
      ourTimeoutsRemaining: isUs ? Math.max(0, currentRemaining - 1) : (matchStats?.ourTimeoutsRemaining ?? 2),
      opponentTimeoutsRemaining: !isUs ? Math.max(0, currentRemaining - 1) : (matchStats?.opponentTimeoutsRemaining ?? 2),
      timeoutHistory: [...(matchStats?.timeoutHistory || []), timeoutEntry]
    };

    setMatchStats(nextStats);

    setSyncToast({
      title: isUs ? '⏱️ Timeout Called (US)' : `⏱️ Timeout (${matchStats?.opponentName || 'Opponent'})`,
      message: `Score: US ${nextStats.ourScore} - ${nextStats.opponentScore} OPP (${isUs ? nextStats.ourTimeoutsRemaining : nextStats.opponentTimeoutsRemaining} left this set)`,
      type: 'new_point'
    });

    notificationService.sendTimeoutNotification({
      teamCalling: isUs ? 'us' : 'opponent',
      ourScore: nextStats.ourScore,
      opponentScore: nextStats.opponentScore
    });

    syncCloudImmediately({
      matchStats: nextStats
    });
  };

  // -------------------------------------------------------------
  // Team Management & Sharing Handlers
  // -------------------------------------------------------------
  const handleSelectTeam = async (targetTeamId) => {
    if (targetTeamId === activeTeamId) return;

    // 1. Save current team bundle before switching
    const currentBundle = storageService.getFullTeamBundle(activeTeamId);
    if (user?.uid) {
      await firebaseService.syncFullTeamToCloud(user.uid, currentBundle, user, currentDeviceId);
    }

    // 2. Fetch target team data
    setActiveTeamId(targetTeamId);
    storageService.setActiveTeamId(targetTeamId);

    if (user?.uid) {
      setSyncStatus('syncing');
      const res = await firebaseService.fetchTeamDataFromCloud(user.uid, targetTeamId);
      if (res.success && res.data) {
        const d = res.data;
        isApplyingRemoteUpdateRef.current = true;
        if (d.teamSettings) setTeamSettings(d.teamSettings);
        if (Array.isArray(d.roster)) setRoster(d.roster);
        if (d.matchState?.lineup) {
          setLineup(d.matchState.lineup);
          setStartingLineup(d.matchState.startingLineup || d.matchState.lineup);
          setRotation(d.matchState.rotation || 1);
          setPhase(d.matchState.phase || 'serve');
          setLiberoExchanges(d.matchState.liberoExchanges || {});
          setLiberoServingRotation(d.matchState.liberoServingRotation ?? null);
          setSubHistory(d.matchState.subHistory || []);
          setMaxSubs(d.matchState.maxSubs || 12);
          setEnforcePositionLock(d.matchState.enforcePositionLock || false);
        } else {
          const newLineup = getDefaultLineup(d.roster || []);
          setLineup(newLineup);
          setStartingLineup(newLineup);
          setRotation(1);
          setPhase('serve');
        }
        if (d.matchStats) setMatchStats(d.matchStats);
        if (Array.isArray(d.matchHistory)) setMatchHistory(d.matchHistory);
        setSyncStatus('synced');
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        return;
      }
    }

    const targetTeam = teams.find(t => t.id === targetTeamId);
    if (targetTeam) {
      const updatedSettings = {
        teamName: targetTeam.teamName,
        season: targetTeam.season,
        primaryColor: targetTeam.primaryColor || '#ff6b35',
        secondaryColor: targetTeam.secondaryColor || '#1e3a8a',
        liberoColor: targetTeam.liberoColor || '#8b5cf6'
      };
      setTeamSettings(updatedSettings);
    }
  };

  const handleCreateTeam = async (newTeamPayload) => {
    const newTeamId = newTeamPayload.id || `team-${Date.now()}`;
    const newShareCode = firebaseService.generateShareCode();

    const newSettings = {
      teamName: newTeamPayload.teamName,
      season: newTeamPayload.season,
      primaryColor: newTeamPayload.primaryColor,
      secondaryColor: newTeamPayload.secondaryColor,
      liberoColor: newTeamPayload.liberoColor
    };

    const initialTeamRoster = newTeamPayload.cloneRoster ? [...roster] : [];
    const newLineup = getDefaultLineup(initialTeamRoster);

    const newTeamEntry = {
      id: newTeamId,
      teamName: newTeamPayload.teamName,
      season: newTeamPayload.season,
      primaryColor: newTeamPayload.primaryColor,
      secondaryColor: newTeamPayload.secondaryColor,
      liberoColor: newTeamPayload.liberoColor,
      shareCode: newShareCode,
      role: 'owner',
      ownerId: user?.uid,
      ownerName: user?.displayName || 'Coach',
      updatedAt: new Date().toISOString()
    };

    const updatedTeams = [newTeamEntry, ...teams];
    setTeams(updatedTeams);
    storageService.saveTeamsList(updatedTeams);

    // Set new team as active
    setActiveTeamId(newTeamId);
    storageService.setActiveTeamId(newTeamId);
    setTeamSettings(newSettings);
    setRoster(initialTeamRoster);
    setLineup(newLineup);
    setStartingLineup(newLineup);
    setRotation(1);
    setPhase('serve');
    setLiberoExchanges({});
    setLiberoServingRotation(null);
    setSubHistory([]);
    setMatchStats(storageService.resetFullMatch());
    setMatchHistory([]);

    // Sync to cloud
    if (user?.uid) {
      const bundle = {
        teamId: newTeamId,
        shareCode: newShareCode,
        ownerId: user.uid,
        ownerName: user.displayName || 'Coach',
        teamSettings: newSettings,
        roster: initialTeamRoster,
        matchState: {
          lineup: newLineup,
          startingLineup: newLineup,
          rotation: 1,
          phase: 'serve',
          liberoExchanges: {},
          liberoServingRotation: null,
          subHistory: [],
          maxSubs: 12,
          enforcePositionLock: false
        },
        matchStats: storageService.resetFullMatch(),
        matchHistory: [],
        updatedAt: new Date().toISOString(),
        updatedByDeviceId: currentDeviceId
      };
      await firebaseService.syncFullTeamToCloud(user.uid, bundle, user, currentDeviceId);
    }
  };

  const handleJoinTeam = async (shareCode) => {
    if (!user?.uid) {
      setIsAuthModalOpen(true);
      return { success: false, error: 'Please sign in with your Google account first.' };
    }

    const res = await firebaseService.joinTeamWithCode(user, shareCode);
    if (res.success && res.team) {
      const joined = res.team;
      const joinedEntry = {
        id: joined.id,
        teamName: joined.teamSettings?.teamName || joined.teamName || 'Shared Squad',
        season: joined.teamSettings?.season || joined.season || '2026',
        primaryColor: joined.teamSettings?.primaryColor || joined.primaryColor || '#ff6b35',
        secondaryColor: joined.teamSettings?.secondaryColor || joined.secondaryColor || '#1e3a8a',
        liberoColor: joined.teamSettings?.liberoColor || joined.liberoColor || '#8b5cf6',
        shareCode: joined.shareCode || shareCode.toUpperCase(),
        role: 'coach',
        ownerId: joined.ownerId,
        ownerName: joined.ownerName || 'Head Coach',
        members: joined.members || {},
        updatedAt: new Date().toISOString()
      };

      const existingIndex = teams.findIndex(t => t.id === joined.id);
      let updatedTeams;
      if (existingIndex >= 0) {
        updatedTeams = [...teams];
        updatedTeams[existingIndex] = joinedEntry;
      } else {
        updatedTeams = [joinedEntry, ...teams];
      }

      setTeams(updatedTeams);
      storageService.saveTeamsList(updatedTeams);

      // Switch active squad to joined team
      setActiveTeamId(joined.id);
      storageService.setActiveTeamId(joined.id);

      isApplyingRemoteUpdateRef.current = true;
      if (joined.teamSettings) setTeamSettings(joined.teamSettings);
      if (Array.isArray(joined.roster)) setRoster(joined.roster);
      if (joined.matchState?.lineup) {
        setLineup(joined.matchState.lineup);
        setStartingLineup(joined.matchState.startingLineup || joined.matchState.lineup);
        setRotation(joined.matchState.rotation || 1);
        setPhase(joined.matchState.phase || 'serve');
        setLiberoExchanges(joined.matchState.liberoExchanges || {});
        setLiberoServingRotation(joined.matchState.liberoServingRotation ?? null);
        setSubHistory(joined.matchState.subHistory || []);
        setMaxSubs(joined.matchState.maxSubs || 12);
        setEnforcePositionLock(joined.matchState.enforcePositionLock || false);
      }
      if (joined.matchStats) setMatchStats(joined.matchStats);
      if (Array.isArray(joined.matchHistory)) setMatchHistory(joined.matchHistory);

      return { success: true, team: joined };
    }
    return res;
  };

  const handleShareCodeGenerated = (teamId, code) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, shareCode: code } : t));
    const currentTeams = storageService.getTeamsList();
    const updated = currentTeams.map(t => t.id === teamId ? { ...t, shareCode: code } : t);
    storageService.saveTeamsList(updated);
  };

  const handleDuplicateTeam = async (targetTeam) => {
    const newTeamId = `team-${Date.now()}`;
    const newTeamEntry = {
      ...targetTeam,
      id: newTeamId,
      teamName: `${targetTeam.teamName} (Copy)`,
      shareCode: firebaseService.generateShareCode(),
      role: 'owner',
      ownerId: user?.uid,
      ownerName: user?.displayName || 'Coach',
      updatedAt: new Date().toISOString()
    };

    const updatedTeams = [newTeamEntry, ...teams];
    setTeams(updatedTeams);
    storageService.saveTeamsList(updatedTeams);

    if (user?.uid) {
      const bundle = storageService.getFullTeamBundle(activeTeamId);
      await firebaseService.syncFullTeamToCloud(user.uid, {
        ...bundle,
        teamId: newTeamId,
        shareCode: newTeamEntry.shareCode,
        teamSettings: {
          ...bundle.teamSettings,
          teamName: `${targetTeam.teamName} (Copy)`
        }
      }, user, currentDeviceId);
    }
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
  };

  const handleDeleteTeam = async (teamIdToDelete) => {
    const updated = teams.filter(t => t.id !== teamIdToDelete);
    setTeams(updated);
    storageService.saveTeamsList(updated);

    if (user?.uid) {
      await firebaseService.deleteTeamFromCloud(user.uid, teamIdToDelete);
    }

    if (activeTeamId === teamIdToDelete && updated.length > 0) {
      handleSelectTeam(updated[0].id);
    }
  };

  const handleOpenShare = async (team) => {
    const target = team || activeTeamObj;
    setTeamToShare(target);
    setIsShareModalOpen(true);

    if (user?.uid) {
      const currentBundle = storageService.getFullTeamBundle(target.id || activeTeamId);
      await firebaseService.syncFullTeamToCloud(user.uid, currentBundle, user, currentDeviceId);
    }
  };

  const handleManualSync = async () => {
    if (!user?.uid) {
      setIsAuthModalOpen(true);
      return;
    }

    setSyncStatus('syncing');
    const bundle = storageService.getFullTeamBundle(activeTeamId);
    const res = await firebaseService.syncFullTeamToCloud(user.uid, bundle, user, currentDeviceId);
    if (res.success) {
      setSyncStatus('synced');
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.2 } });
    } else {
      setSyncStatus('error');
    }
  };

  const handleLogout = async () => {
    await firebaseService.logout();
    setUser(null);
    storageService.clearCachedUser();
  };

  // -------------------------------------------------------------
  // Rotation & Rally Handlers (With 0ms Instant Cloud Sync)
  // -------------------------------------------------------------
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

    // Sync rotation change immediately to collaborators
    syncCloudImmediately({
      matchState: {
        lineup: current,
        startingLineup,
        rotation: newRotation,
        phase,
        liberoExchanges,
        liberoServingRotation,
        subHistory,
        maxSubs,
        enforcePositionLock
      }
    });
  };

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

    const nextStats = {
      ...matchStats,
      ourScore: (matchStats?.ourScore || 0) + 1,
      pointHistory: [...(matchStats?.pointHistory || []), newPoint]
    };

    let nextRot = rotation;
    let nextPhase = phase;
    let nextLineup = lineup;

    if (phase === 'receive') {
      nextRot = rotation === 6 ? 1 : rotation + 1;
      nextLineup = rotateLineupClockwise(lineup);
      const violation = checkLineupFrontRowLiberoViolation(nextLineup, roster, liberoExchanges);
      if (violation.hasViolation && violation.replacedPlayer) {
        nextLineup[violation.zoneKey] = violation.replacedPlayer.id;
      }
      nextPhase = 'serve';
      setLineup(nextLineup);
      setRotation(nextRot);
      setPhase(nextPhase);
    }

    setMatchStats(nextStats);
    lastScoreStateRef.current = { ourScore: nextStats.ourScore, opponentScore: nextStats.opponentScore || 0 };

    const scoreEvent = {
      id: newPoint.id,
      type: 'point_won_by_us',
      pointWonBy: 'us',
      timestamp: newPoint.timestamp,
      newScore: {
        ourScore: nextStats.ourScore,
        opponentScore: nextStats.opponentScore || 0,
        setNumber: nextStats.setNumber || 1
      },
      scorer: {
        name: user?.displayName || user?.email?.split('@')[0] || 'Coach',
        email: user?.email || '',
        uid: user?.uid || null,
        deviceId: currentDeviceId
      },
      details: {
        earnedType: pointDetails.earnedType || 'quick_point',
        earnedTypeName: pointDetails.earnedTypeName || (pointDetails.earnedType === 'quick_point' ? 'Quick Point (+1)' : 'Point Won'),
        earnedPlayerId: pointDetails.earnedPlayerId || null,
        earnedPlayerName: pointDetails.earnedPlayerName || null,
        earnedPlayerNumber: pointDetails.earnedPlayerNumber || null,
        rotation,
        phase
      }
    };
    lastSeenScoreEventIdRef.current = scoreEvent.id;

    // Push score update to cloud IMMEDIATELY (0ms delay)
    syncCloudImmediately({
      matchStats: nextStats,
      matchState: {
        lineup: nextLineup,
        startingLineup,
        rotation: nextRot,
        phase: nextPhase,
        liberoExchanges,
        liberoServingRotation,
        subHistory,
        maxSubs,
        enforcePositionLock
      },
      lastScoreEvent: scoreEvent
    });
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

    const nextStats = {
      ...matchStats,
      opponentScore: (matchStats?.opponentScore || 0) + 1,
      pointHistory: [...(matchStats?.pointHistory || []), newPoint]
    };

    let nextPhase = phase;
    if (phase === 'serve') {
      nextPhase = 'receive';
      setPhase('receive');
    }

    setMatchStats(nextStats);
    lastScoreStateRef.current = { ourScore: nextStats.ourScore || 0, opponentScore: nextStats.opponentScore };

    const scoreEvent = {
      id: newPoint.id,
      type: 'point_won_by_opponent',
      pointWonBy: 'opponent',
      timestamp: newPoint.timestamp,
      newScore: {
        ourScore: nextStats.ourScore || 0,
        opponentScore: nextStats.opponentScore,
        setNumber: nextStats.setNumber || 1
      },
      scorer: {
        name: user?.displayName || user?.email?.split('@')[0] || 'Coach',
        email: user?.email || '',
        uid: user?.uid || null,
        deviceId: currentDeviceId
      },
      details: {
        errorTypeId: pointDetails.errorTypeId || 'unspecified_error',
        errorTypeName: pointDetails.errorTypeName || (pointDetails.errorTypeId === 'unspecified_error' ? 'Opponent Point (+1)' : 'Opponent Point'),
        errorCategory: pointDetails.errorCategory || null,
        errorPlayerName: pointDetails.errorPlayerName || null,
        errorPlayerNumber: pointDetails.errorPlayerNumber || null,
        opponentName: matchStats?.opponentName || 'Opponent',
        rotation,
        phase
      }
    };
    lastSeenScoreEventIdRef.current = scoreEvent.id;

    // Push opponent score update to cloud IMMEDIATELY (0ms delay)
    syncCloudImmediately({
      matchStats: nextStats,
      matchState: {
        lineup,
        startingLineup,
        rotation,
        phase: nextPhase,
        liberoExchanges,
        liberoServingRotation,
        subHistory,
        maxSubs,
        enforcePositionLock
      },
      lastScoreEvent: scoreEvent
    });
  };

  const handleUndoLastPoint = () => {
    if (!matchStats?.pointHistory || matchStats.pointHistory.length === 0) return;
    const lastPoint = matchStats.pointHistory[matchStats.pointHistory.length - 1];

    const updatedHistory = matchStats.pointHistory.slice(0, -1);
    const nextStats = {
      ...matchStats,
      ourScore: lastPoint.pointWonBy === 'us' ? Math.max(0, matchStats.ourScore - 1) : matchStats.ourScore,
      opponentScore: lastPoint.pointWonBy === 'opponent' ? Math.max(0, matchStats.opponentScore - 1) : matchStats.opponentScore,
      pointHistory: updatedHistory
    };

    setMatchStats(nextStats);
    lastScoreStateRef.current = { ourScore: nextStats.ourScore, opponentScore: nextStats.opponentScore };

    let nextRot = rotation;
    let nextPhase = phase;
    if (lastPoint.rotation && lastPoint.rotation !== rotation) {
      nextRot = lastPoint.rotation;
      handleUpdateRotation(lastPoint.rotation);
    }
    if (lastPoint.phase && lastPoint.phase !== phase) {
      nextPhase = lastPoint.phase;
      setPhase(lastPoint.phase);
    }

    const scoreEvent = {
      id: `undo-${Date.now()}`,
      type: 'point_undone',
      pointWonBy: 'undo',
      isUndo: true,
      timestamp: new Date().toISOString(),
      newScore: {
        ourScore: nextStats.ourScore,
        opponentScore: nextStats.opponentScore,
        setNumber: nextStats.setNumber || 1
      },
      scorer: {
        name: user?.displayName || user?.email?.split('@')[0] || 'Coach',
        email: user?.email || '',
        uid: user?.uid || null,
        deviceId: currentDeviceId
      },
      details: {
        description: 'Point undone / score reverted by coach'
      }
    };
    lastSeenScoreEventIdRef.current = scoreEvent.id;

    syncCloudImmediately({
      matchStats: nextStats,
      matchState: {
        lineup,
        startingLineup,
        rotation: nextRot,
        phase: nextPhase,
        liberoExchanges,
        liberoServingRotation,
        subHistory,
        maxSubs,
        enforcePositionLock
      },
      lastScoreEvent: scoreEvent
    });
  };

  const handleUpdatePoint = (pointId, updatedPointData, isOverturn = false) => {
    if (!matchStats?.pointHistory) return;
    const existingIndex = matchStats.pointHistory.findIndex(p => p.id === pointId);
    if (existingIndex === -1) return;

    const oldPoint = matchStats.pointHistory[existingIndex];
    const newHistory = [...matchStats.pointHistory];
    newHistory[existingIndex] = { ...oldPoint, ...updatedPointData };

    let nextOurScore = matchStats.ourScore || 0;
    let nextOppScore = matchStats.opponentScore || 0;

    // If referee overturned the call
    if (isOverturn && oldPoint.pointWonBy !== updatedPointData.pointWonBy) {
      if (updatedPointData.pointWonBy === 'us') {
        nextOurScore = nextOurScore + 1;
        nextOppScore = Math.max(0, nextOppScore - 1);
      } else {
        nextOurScore = Math.max(0, nextOurScore - 1);
        nextOppScore = nextOppScore + 1;
      }
    }

    const nextStats = {
      ...matchStats,
      ourScore: nextOurScore,
      opponentScore: nextOppScore,
      pointHistory: newHistory
    };

    setMatchStats(nextStats);
    lastScoreStateRef.current = { ourScore: nextOurScore, opponentScore: nextOppScore };

    syncCloudImmediately({
      matchStats: nextStats,
      matchState: {
        lineup,
        startingLineup,
        rotation,
        phase,
        liberoExchanges,
        liberoServingRotation,
        subHistory,
        maxSubs,
        enforcePositionLock
      }
    });
  };

  const handleDeletePointById = (pointId) => {
    if (!matchStats?.pointHistory) return;
    const pointToDelete = matchStats.pointHistory.find(p => p.id === pointId);
    if (!pointToDelete) return;

    const newHistory = matchStats.pointHistory.filter(p => p.id !== pointId);
    const nextStats = {
      ...matchStats,
      ourScore: pointToDelete.pointWonBy === 'us' ? Math.max(0, matchStats.ourScore - 1) : matchStats.ourScore,
      opponentScore: pointToDelete.pointWonBy === 'opponent' ? Math.max(0, matchStats.opponentScore - 1) : matchStats.opponentScore,
      pointHistory: newHistory
    };

    setMatchStats(nextStats);
    lastScoreStateRef.current = { ourScore: nextStats.ourScore, opponentScore: nextStats.opponentScore };

    syncCloudImmediately({
      matchStats: nextStats,
      matchState: {
        lineup,
        startingLineup,
        rotation,
        phase,
        liberoExchanges,
        liberoServingRotation,
        subHistory,
        maxSubs,
        enforcePositionLock
      }
    });
  };

  const handleResetScore = () => {
    const nextStats = {
      ...matchStats,
      ourScore: 0,
      opponentScore: 0,
      pointHistory: []
    };
    setMatchStats(nextStats);
    lastScoreStateRef.current = { ourScore: 0, opponentScore: 0 };

    const scoreEvent = {
      id: `reset-${Date.now()}`,
      type: 'score_reset',
      pointWonBy: 'undo',
      isUndo: true,
      timestamp: new Date().toISOString(),
      newScore: {
        ourScore: 0,
        opponentScore: 0,
        setNumber: matchStats?.setNumber || 1
      },
      scorer: {
        name: user?.displayName || user?.email?.split('@')[0] || 'Coach',
        deviceId: currentDeviceId
      },
      details: {
        description: 'Score reset to 0 - 0'
      }
    };
    lastSeenScoreEventIdRef.current = scoreEvent.id;

    syncCloudImmediately({
      matchStats: nextStats,
      lastScoreEvent: scoreEvent
    });
  };

  const handleOpenSetBreak = () => {
    const isOurSet = (matchStats?.ourScore || 0) > (matchStats?.opponentScore || 0);
    const currentSubs = (subHistory || []).filter(s => !s.isLiberoExchange).length;
    setLastCompletedSet({
      setNumber: matchStats?.setNumber || 1,
      ourScore: matchStats?.ourScore || 0,
      opponentScore: matchStats?.opponentScore || 0,
      winner: isOurSet ? 'us' : 'opponent',
      subsCount: currentSubs
    });
    setIsSetBreakOpen(true);
  };

  const handleConfirmStartNextSet = ({ nextSetNumber, nextPhase, useSameLineup = true } = {}) => {
    const isOurSet = (matchStats?.ourScore || 0) > (matchStats?.opponentScore || 0);
    const currentSubs = (subHistory || []).filter(s => !s.isLiberoExchange).length;
    const ourTOsUsed = 2 - (matchStats?.ourTimeoutsRemaining ?? 2);
    const oppTOsUsed = 2 - (matchStats?.opponentTimeoutsRemaining ?? 2);

    const completedSet = {
      setNumber: matchStats?.setNumber || 1,
      ourScore: matchStats?.ourScore || 0,
      opponentScore: matchStats?.opponentScore || 0,
      winner: isOurSet ? 'us' : 'opponent',
      subsCount: currentSubs,
      ourTimeoutsUsed: ourTOsUsed,
      opponentTimeoutsUsed: oppTOsUsed
    };

    const targetSetNumber = nextSetNumber || ((matchStats?.setNumber || 1) + 1);
    const targetPhase = nextPhase || (phase === 'serve' ? 'receive' : 'serve');

    const nextStats = {
      ...matchStats,
      ourScore: 0,
      opponentScore: 0,
      setNumber: targetSetNumber,
      ourSetsWon: isOurSet ? (matchStats?.ourSetsWon || 0) + 1 : (matchStats?.ourSetsWon || 0),
      opponentSetsWon: !isOurSet ? (matchStats?.opponentSetsWon || 0) + 1 : (matchStats?.opponentSetsWon || 0),
      ourTimeoutsRemaining: 2,
      opponentTimeoutsRemaining: 2,
      setHistory: [...(matchStats?.setHistory || []), completedSet]
    };

    const newLineup = useSameLineup ? (startingLineup || lineup) : lineup;

    setMatchStats(nextStats);
    setLineup(newLineup);
    setRotation(1);
    setPhase(targetPhase);
    setSubHistory([]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.3 } });

    setSyncToast({
      title: `🏐 Set ${targetSetNumber} Started`,
      message: `Set ${matchStats?.setNumber || 1} finished (${completedSet.ourScore}-${completedSet.opponentScore}). ${targetPhase === 'serve' ? 'We Serve First' : 'We Receive First'} (0-0).`,
      type: 'new_set'
    });

    syncCloudImmediately({
      matchStats: nextStats,
      matchState: {
        lineup: newLineup,
        startingLineup,
        rotation: 1,
        phase: targetPhase,
        liberoExchanges,
        liberoServingRotation,
        subHistory: [],
        maxSubs,
        enforcePositionLock
      }
    });
  };

  const handleStartNewSet = () => {
    handleOpenSetBreak();
  };

  const handleSelectSetNumber = (targetSetNum) => {
    if (!targetSetNum || targetSetNum === matchStats?.setNumber) return;
    const nextStats = {
      ...matchStats,
      setNumber: targetSetNum
    };
    setMatchStats(nextStats);
    syncCloudImmediately({ matchStats: nextStats });
  };

  const handleQuickStartScrimmage = () => {
    handleStartFreshMatch({
      opponentName: 'Practice / Scrimmage',
      tournamentName: matchStats?.tournamentName || 'Practice',
      courtNumber: matchStats?.courtNumber || 'Court 1',
      matchStage: 'Scrimmage',
      matchFormat: '1 Set (to 25)',
      targetPoints: 25,
      maxSubs: maxSubs || 12,
      phase: 'serve',
      rotation: 1,
      lineup: lineup || startingLineup
    });
  };

  const handleStartScheduledMatch = (schedItem) => {
    handleStartFreshMatch({
      opponentName: schedItem.opponentName,
      tournamentName: matchStats?.tournamentName || 'Tournament Day',
      courtNumber: schedItem.courtNumber || matchStats?.courtNumber || 'Court 1',
      matchStage: schedItem.matchStage || 'Match',
      matchFormat: schedItem.format || 'Best of 3 (25, 25, 15)',
      targetPoints: 25,
      maxSubs: maxSubs || 12,
      phase: 'serve',
      rotation: 1,
      lineup: startingLineup || lineup
    });

    const updated = daySchedule.map(s =>
      s.id === schedItem.id ? { ...s, status: 'in_progress' } : s
    );
    setDaySchedule(updated);
    storageService.saveDaySchedule(updated);
    syncCloudImmediately({ daySchedule: updated });
  };

  const handleUpdateDaySchedule = (newSchedule) => {
    setDaySchedule(newSchedule);
    storageService.saveDaySchedule(newSchedule);
    syncCloudImmediately({ daySchedule: newSchedule });
  };

  const handleArchiveMatch = (customOpponentOrOptions = null) => {
    let opp = matchStats?.opponentName || 'Opponent';
    let overrides = {
      tournamentName: matchStats?.tournamentName,
      courtNumber: matchStats?.courtNumber,
      matchStage: matchStats?.matchStage,
      matchFormat: matchStats?.matchFormat
    };

    if (typeof customOpponentOrOptions === 'string') {
      opp = customOpponentOrOptions;
    } else if (customOpponentOrOptions && typeof customOpponentOrOptions === 'object') {
      if (customOpponentOrOptions.opponentName) opp = customOpponentOrOptions.opponentName;
      if (customOpponentOrOptions.tournamentName) overrides.tournamentName = customOpponentOrOptions.tournamentName;
      if (customOpponentOrOptions.courtNumber) overrides.courtNumber = customOpponentOrOptions.courtNumber;
    } else if (customOpponentOrOptions === null) {
      const promptRes = window.prompt('Enter Opponent Team Name for match archive:', opp);
      if (!promptRes || promptRes.trim() === '') return false;
      opp = promptRes;
    }

    if (opp && opp.trim() !== '') {
      const archived = storageService.archiveCurrentMatch(matchStats, opp.trim(), overrides);
      if (archived) {
        const nextHistory = storageService.getMatchHistory();
        setMatchHistory(nextHistory);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });

        setSyncToast({
          title: '🏆 Match Saved to Archive',
          message: `Saved vs ${opp.trim()} (${overrides.tournamentName || 'Tournament'} • ${overrides.courtNumber || 'Court 1'})`,
          type: 'new_match'
        });

        syncCloudImmediately({
          matchHistory: nextHistory
        });
        return true;
      }
    }
    return false;
  };

  const handleDeleteMatchHistory = (matchId) => {
    const updated = storageService.deleteMatchFromHistory(matchId);
    setMatchHistory(updated);

    syncCloudImmediately({
      matchHistory: updated
    });
  };

  const handleSaveLineupPreset = (name, lineupObj, liberoId = null, description = '') => {
    const newPreset = storageService.saveLineupPreset(name, lineupObj, liberoId, description);
    if (newPreset) {
      const updated = storageService.getSavedLineups();
      setSavedLineupPresets(updated);
      setSyncToast({
        title: '💾 Lineup Preset Saved',
        message: `Saved "${name}" to team presets.`,
        type: 'new_match'
      });
      syncCloudImmediately({
        savedLineups: updated
      });
    }
  };

  const handleDeleteLineupPreset = (presetId) => {
    const updated = storageService.deleteLineupPreset(presetId);
    setSavedLineupPresets(updated);
    syncCloudImmediately({
      savedLineups: updated
    });
  };

  const handleApplyLineupFromStudio = (newLineup, newLiberoId = null) => {
    setLineup(newLineup);
    setStartingLineup(newLineup);
    setRotation(1);
    setPhase('serve');

    const nextExchanges = {};
    if (newLiberoId) {
      const mbOnBench = roster.find(p => p.position === 'Middle Blocker' && !Object.values(newLineup).includes(p.id));
      if (mbOnBench) {
        nextExchanges[newLiberoId] = mbOnBench.id;
      }
    }
    setLiberoExchanges(nextExchanges);
    setLiberoServingRotation(null);

    setSyncToast({
      title: '📋 Lineup Applied to Match',
      message: 'Starting 6 updated to selected 6-2 rotation.',
      type: 'new_match'
    });

    syncCloudImmediately({
      matchState: {
        lineup: newLineup,
        startingLineup: newLineup,
        rotation: 1,
        phase: 'serve',
        liberoExchanges: nextExchanges,
        liberoServingRotation: null,
        subHistory: [],
        maxSubs,
        enforcePositionLock
      }
    });
  };

  const handleUpdateRosterPlayerStatus = (playerId, updates) => {
    const updatedRoster = roster.map(p => p.id === playerId ? { ...p, ...updates } : p);
    setRoster(updatedRoster);
    storageService.saveRoster(updatedRoster);
    syncCloudImmediately({
      roster: updatedRoster
    });
  };

  const handleResetFullMatch = () => {
    const fresh = storageService.resetFullMatch();
    setMatchStats(fresh);
    if (startingLineup) {
      setLineup(startingLineup);
    }
    setRotation(1);
    setPhase('serve');

    syncCloudImmediately({
      matchStats: fresh,
      matchState: {
        lineup: startingLineup || lineup,
        startingLineup,
        rotation: 1,
        phase: 'serve',
        liberoExchanges: {},
        liberoServingRotation: null,
        subHistory: [],
        maxSubs,
        enforcePositionLock
      }
    });
  };

  // -------------------------------------------------------------
  // Player Actions
  // -------------------------------------------------------------
  const handleSavePlayer = (playerData) => {
    let nextRoster;
    setRoster(prev => {
      let updatedList = playerToEdit
        ? prev.map(p => p.id === playerData.id ? playerData : p)
        : [playerData, ...prev];

      if (playerData.isFirstServer) {
        updatedList = updatedList.map(p => p.id === playerData.id ? p : { ...p, isFirstServer: false });
      }
      nextRoster = updatedList;
      return updatedList;
    });

    if (!playerToEdit) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    }
    setIsPlayerModalOpen(false);
    setPlayerToEdit(null);

    if (nextRoster) {
      syncCloudImmediately({ roster: nextRoster });
    }
  };

  const handleDeletePlayer = (id) => {
    if (window.confirm('Are you sure you want to remove this player from the roster?')) {
      const nextRoster = roster.filter(p => p.id !== id);
      setRoster(nextRoster);

      const nextLineup = { ...lineup };
      Object.keys(nextLineup).forEach(k => {
        if (nextLineup[k] === id) nextLineup[k] = null;
      });
      setLineup(nextLineup);

      const nextStartingLineup = { ...startingLineup };
      Object.keys(nextStartingLineup).forEach(k => {
        if (nextStartingLineup[k] === id) nextStartingLineup[k] = null;
      });
      setStartingLineup(nextStartingLineup);

      const nextExchanges = { ...liberoExchanges };
      delete nextExchanges[id];
      Object.keys(nextExchanges).forEach(k => {
        if (nextExchanges[k] === id) delete nextExchanges[k];
      });
      setLiberoExchanges(nextExchanges);

      syncCloudImmediately({
        roster: nextRoster,
        matchState: {
          lineup: nextLineup,
          startingLineup: nextStartingLineup,
          rotation,
          phase,
          liberoExchanges: nextExchanges,
          liberoServingRotation,
          subHistory,
          maxSubs,
          enforcePositionLock
        }
      });
    }
  };

  const handleUpdatePlayerPosition = (playerId, targetPosition) => {
    const nextRoster = roster.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          position: targetPosition,
          isLibero: targetPosition === 'Libero'
        };
      }
      return p;
    });
    setRoster(nextRoster);
    syncCloudImmediately({ roster: nextRoster });
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
    const nextRoster = [newPlayer, ...roster];
    setRoster(nextRoster);
    syncCloudImmediately({ roster: nextRoster });
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
  const activeTeamObj = teams.find(t => t.id === activeTeamId) || { teamName: teamSettings.teamName, season: teamSettings.season, primaryColor: teamSettings.primaryColor, shareCode: '' };

  const userRole = teamSettings?.userRole || 'head_coach';
  const isCoachOrAssistant = userRole === 'head_coach' || userRole === 'assistant_coach';

  const handleUpdateUserRole = (newRole) => {
    const updated = { ...teamSettings, userRole: newRole };
    setTeamSettings(updated);
    storageService.saveTeamSettings(updated);
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenAddModal={handleOpenAdd}
        onOpenImportExportModal={() => setIsImportExportModalOpen(true)}
        onOpenMatchWizard={() => setIsMatchWizardOpen(true)}
        onOpenLineupStudio={() => setIsLineupStudioOpen(true)}
        onOpenDrillsModal={() => setActiveTab('drills')}
        onOpenWhiteboard={() => setActiveTab('whiteboard')}
        onOpenNotificationSettings={() => setIsNotificationModalOpen(true)}
        user={user}
        syncStatus={syncStatus}
        lastSyncTime={lastSyncTime}
        activeTeam={activeTeamObj}
        lastScoreEvent={remoteScoreEvent || activeTeamObj?.lastScoreEvent}
        userRole={userRole}
        onUpdateUserRole={handleUpdateUserRole}
        onOpenAuthModal={(tab) => {
          setAuthModalTab(tab || 'login');
          setIsAuthModalOpen(true);
        }}
        onOpenTeamManagerModal={() => setIsTeamManagerModalOpen(true)}
        onOpenShareModal={handleOpenShare}
        onOpenFirebaseSettingsModal={() => setIsFirebaseSettingsModalOpen(true)}
        onManualSync={handleManualSync}
        onLogout={handleLogout}
      />

      <InstallPrompt />

      {/* Floating Tournament Sync Notification Toast */}
      <TournamentSyncToast toast={syncToast} onDismiss={() => setSyncToast(null)} />

      {/* Real-Time Co-Coach Score Update Overlay & Anti-Duplicate Alert */}
      <RemoteScoreUpdateOverlay
        scoreEvent={remoteScoreEvent}
        onDismiss={() => setRemoteScoreEvent(null)}
        autoDismissSeconds={15}
      />

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <LayoutGrid size={18} className="tab-icon" />
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 900,
                padding: '1px 5px',
                borderRadius: '999px',
                background: phase === 'serve' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                color: phase === 'serve' ? '#34d399' : '#93c5fd',
                border: `1px solid ${phase === 'serve' ? '#10b981' : '#3b82f6'}`,
                lineHeight: 1.2
              }}
            >
              {phase === 'serve' ? 'SERVE' : 'RECV'}
            </span>
          </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Compass size={18} className="tab-icon" />
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 900,
                padding: '1px 5px',
                borderRadius: '999px',
                background: phase === 'serve' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                color: phase === 'serve' ? '#34d399' : '#93c5fd',
                border: `1px solid ${phase === 'serve' ? '#10b981' : '#3b82f6'}`,
                lineHeight: 1.2
              }}
            >
              {phase === 'serve' ? 'SERVE' : 'RECV'}
            </span>
          </div>
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

      {/* Floating In-Game Scoreboard Ribbon with Tournament Context Header (Hidden on Drills & Whiteboard pages for maximum coaching area) */}
      {activeTab !== 'drills' && activeTab !== 'whiteboard' && (
        <ScoreboardBar
          matchStats={matchStats}
          setMatchStats={setMatchStats}
          onRallyWonByUs={handleRallyWonByUs}
          onRallyWonByOpponent={handleRallyWonByOpponent}
          onUndoLastPoint={handleUndoLastPoint}
          onResetScore={handleResetScore}
          onStartNewSet={handleOpenSetBreak}
          onArchiveMatch={handleArchiveMatch}
          onResetFullMatch={handleResetFullMatch}
          onOpenMatchSetup={() => {
            setGameCenterInitialTab('start');
            setIsGameCenterOpen(true);
          }}
          onOpenMatchWizard={() => setIsMatchWizardOpen(true)}
          onOpenTournamentDayHub={() => {
            setGameCenterInitialTab('schedule');
            setIsGameCenterOpen(true);
          }}
          onOpenGameCenter={() => {
            setGameCenterInitialTab('start');
            setIsGameCenterOpen(true);
          }}
          onOpenSetBreak={handleOpenSetBreak}
          onOpenMatchRecap={() => setIsMatchRecapOpen(true)}
          onSelectSetNumber={handleSelectSetNumber}
          onCallTimeout={handleCallTimeout}
          onOpenSubModal={() => setActiveTab('court')}
          onOpenLineupStudio={() => setIsLineupStudioOpen(true)}
          subHistory={subHistory}
          maxSubs={maxSubs}
          lineup={lineup}
          roster={roster}
          rotation={rotation}
          phase={phase}
          userRole={userRole}
          isCoachOrAssistant={isCoachOrAssistant}
          onOpenWhiteboard={() => setActiveTab('whiteboard')}
          onUpdatePoint={handleUpdatePoint}
          onDeletePoint={handleDeletePointById}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'roster' && (
        <>
          {/* Quick Action Banners: Start Game & Make a Lineup Studio */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {/* Quick Start Game Banner */}
            <div
              onClick={() => {
                setGameCenterInitialTab('start');
                setIsGameCenterOpen(true);
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
                border: '1.5px solid rgba(16, 185, 129, 0.5)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                    flexShrink: 0
                  }}
                >
                  <VolleyballIcon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#f8fafc' }}>
                    Start Game Wizard
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>
                    Match setup & coin toss
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#34d399' }}>Start →</span>
            </div>

            {/* 📋 6-2 Make a Lineup Studio Banner */}
            <div
              onClick={() => setIsLineupStudioOpen(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(126, 34, 206, 0.3))',
                border: '1.5px solid rgba(168, 85, 247, 0.5)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                    flexShrink: 0
                  }}
                >
                  <Sparkles size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#f8fafc' }}>
                    Make a Lineup (6-2 Studio)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#e9d5ff' }}>
                    AI stats, presets & injury subs
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#c084fc' }}>Open Studio →</span>
            </div>
          </div>

          {/* Stats Ribbon (Roster Size, Captain, Starting 6, Setters) */}
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
              <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                <Shield size={22} />
              </div>
              <div>
                <div className="stat-val">{captain ? `#${captain.number}` : 'None'}</div>
                <div className="stat-label">Captain: {captain?.name ? captain.name.split(' ')[0] : '—'}</div>
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
          </div>

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
          matchStats={matchStats}
          savedPresets={savedLineupPresets}
          onSavePreset={handleSaveLineupPreset}
          onDeletePreset={handleDeleteLineupPreset}
          onApplyPresetLineup={handleApplyLineupFromStudio}
          onOpenLineupStudio={() => setIsLineupStudioOpen(true)}
          onOpenMatchWizard={() => setIsMatchWizardOpen(true)}
          onRallyWonByUs={handleRallyWonByUs}
          onRallyWonByOpponent={handleRallyWonByOpponent}
          onStartNewSet={handleStartNewSet}
          onArchiveMatch={handleArchiveMatch}
          onResetScore={handleResetScore}
          onResetFullMatch={handleResetFullMatch}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'formations' && (
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
          onNavigateTab={(tab, rot) => {
            setActiveTab(tab);
            if (rot) setRotation(rot);
          }}
          matchStats={matchStats}
          onRallyWonByUs={handleRallyWonByUs}
          onRallyWonByOpponent={handleRallyWonByOpponent}
          onStartNewSet={handleStartNewSet}
          onArchiveMatch={handleArchiveMatch}
          onResetScore={handleResetScore}
          onResetFullMatch={handleResetFullMatch}
        />
      )}

      {activeTab === 'stats' && (
        <MatchStatsView
          matchStats={matchStats}
          setMatchStats={setMatchStats}
          roster={roster}
          teamSettings={teamSettings}
          onResetScore={handleResetScore}
          onStartNewSet={handleStartNewSet}
          onResetFullMatch={handleResetFullMatch}
          onNavigateTab={(tab, rot) => {
            setActiveTab(tab);
            if (rot) setRotation(rot);
          }}
          matchHistory={matchHistory}
          onArchiveMatch={handleArchiveMatch}
          onDeleteMatchHistory={handleDeleteMatchHistory}
          onOpenMatchSetup={() => setIsMatchSetupModalOpen(true)}
          onUpdatePoint={handleUpdatePoint}
          onDeletePoint={handleDeletePointById}
        />
      )}

      {/* Dedicated Volleyball Practice Drills & 2D Animated Lab Page */}
      {activeTab === 'drills' && (
        <DrillHubPage
          onBack={() => setActiveTab('roster')}
          onNavigateToWhiteboard={() => setActiveTab('whiteboard')}
        />
      )}

      {/* Dedicated Tactical Volleyball Whiteboard & Chalkboard Page */}
      {activeTab === 'whiteboard' && (
        <WhiteboardPage
          lineup={lineup}
          roster={roster}
          rotation={rotation}
          teamSettings={teamSettings}
          onBack={() => setActiveTab('roster')}
          onNavigateToDrills={() => setActiveTab('drills')}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(authUser) => {
          setUser(authUser);
          storageService.setCachedUser(authUser);
        }}
      />

      {/* Team Manager Modal */}
      <TeamManagerModal
        isOpen={isTeamManagerModalOpen}
        onClose={() => setIsTeamManagerModalOpen(false)}
        teams={teams}
        activeTeamId={activeTeamId}
        onSelectTeam={handleSelectTeam}
        onCreateTeam={handleCreateTeam}
        onDuplicateTeam={handleDuplicateTeam}
        onDeleteTeam={handleDeleteTeam}
        onJoinTeam={handleJoinTeam}
        onOpenShareModal={handleOpenShare}
        user={user}
      />

      {/* Share Team Modal */}
      <ShareTeamModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setTeamToShare(null);
        }}
        activeTeam={teamToShare || activeTeamObj}
        user={user}
        onShareCodeGenerated={handleShareCodeGenerated}
      />

      {/* Tournament & Match Setup Modal */}
      <MatchSetupModal
        isOpen={isMatchSetupModalOpen}
        onClose={() => setIsMatchSetupModalOpen(false)}
        matchStats={matchStats}
        onUpdateMatchDetails={handleUpdateMatchDetails}
        onStartFreshMatch={handleStartFreshMatch}
      />

      {/* 3-Step Start Match & Rules Wizard */}
      <MatchWizardModal
        isOpen={isMatchWizardOpen}
        onClose={() => setIsMatchWizardOpen(false)}
        matchStats={matchStats}
        matchHistory={matchHistory}
        roster={roster}
        currentLineup={lineup}
        teamSettings={teamSettings}
        onStartFreshMatch={handleStartFreshMatch}
      />

      {/* Tournament Day Hub (Slide-up Mobile Sheet) */}
      <TournamentDayHubModal
        isOpen={isTournamentDayHubOpen}
        onClose={() => setIsTournamentDayHubOpen(false)}
        matchStats={matchStats}
        matchHistory={matchHistory}
        onUpdateMatchDetails={handleUpdateMatchDetails}
        onStartFreshMatch={handleStartFreshMatch}
        onStartNewSet={handleStartNewSet}
        onArchiveMatch={handleArchiveMatch}
        onDeleteMatchHistory={handleDeleteMatchHistory}
        onSelectSetNumber={handleSelectSetNumber}
        onOpenMatchWizard={() => setIsMatchWizardOpen(true)}
        onOpenShareModal={handleOpenShare}
        activeTeam={activeTeamObj}
      />

      {/* Unified Game Operations Center */}
      <GameCenterModal
        isOpen={isGameCenterOpen}
        onClose={() => setIsGameCenterOpen(false)}
        initialTab={gameCenterInitialTab}
        matchStats={matchStats}
        matchHistory={matchHistory}
        daySchedule={daySchedule}
        onUpdateDaySchedule={handleUpdateDaySchedule}
        onUpdateMatchDetails={handleUpdateMatchDetails}
        onStartFreshMatch={handleStartFreshMatch}
        onQuickStartScrimmage={handleQuickStartScrimmage}
        onStartScheduledMatch={handleStartScheduledMatch}
        onArchiveMatch={handleArchiveMatch}
        onDeleteMatchHistory={handleDeleteMatchHistory}
        onOpenPdfExport={() => setActiveTab('stats')}
        onOpenMatchWizard={() => setIsMatchWizardOpen(true)}
        onOpenLineupStudio={() => setIsLineupStudioOpen(true)}
        roster={roster}
        lineup={lineup}
      />

      {/* Guided Set Intermission & Side Switch Break Modal */}
      <SetBreakModal
        isOpen={isSetBreakOpen}
        onClose={() => setIsSetBreakOpen(false)}
        completedSet={lastCompletedSet}
        matchStats={matchStats}
        roster={roster}
        lineup={lineup}
        startingLineup={startingLineup}
        currentPhase={phase}
        onConfirmStartNextSet={handleConfirmStartNextSet}
        onOpenMatchRecap={() => setIsMatchRecapOpen(true)}
      />

      {/* Broadcast Post-Match Box Score & Recap Modal */}
      <MatchRecapModal
        isOpen={isMatchRecapOpen}
        onClose={() => setIsMatchRecapOpen(false)}
        matchStats={matchStats}
        roster={roster}
        onConfirmArchive={handleArchiveMatch}
        onOpenPdfExport={() => setActiveTab('stats')}
        onStartNextMatchFromQueue={handleStartScheduledMatch}
        nextScheduledMatch={daySchedule.find(s => s.status === 'upcoming' || s.status === 'ready')}
      />

      {/* Firebase Cloud Settings Modal */}
      <FirebaseSettingsModal
        isOpen={isFirebaseSettingsModalOpen}
        onClose={() => setIsFirebaseSettingsModalOpen(false)}
        onConfigSaved={() => {
          handleManualSync();
        }}
        onTriggerSync={handleManualSync}
      />

      {/* Player Add/Edit Modal */}
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

      {/* Import / Export Backup Modal */}
      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        onRosterUpdated={(newRoster) => setRoster(newRoster)}
      />

      {/* 🎯 Volleyball Drills & Animated Practice Hub Modal */}
      <DrillCenterModal
        isOpen={isDrillsModalOpen}
        onClose={() => setIsDrillsModalOpen(false)}
      />

      {/* 📋 6-2 Make a Lineup & Rotation Studio */}
      {isLineupStudioOpen && (
        <LineupStudioModal
          isOpen={isLineupStudioOpen}
          onClose={() => setIsLineupStudioOpen(false)}
          roster={roster}
          lineup={lineup}
          startingLineup={startingLineup}
          matchStats={matchStats}
          matchHistory={matchHistory}
          savedPresets={savedLineupPresets}
          onSavePreset={handleSaveLineupPreset}
          onDeletePreset={handleDeleteLineupPreset}
          onApplyLineup={handleApplyLineupFromStudio}
          onUpdateRosterPlayer={handleUpdateRosterPlayerStatus}
        />
      )}

      {/* 🔔 Lock Screen & Background Match Alerts Modal */}
      {isNotificationModalOpen && (
        <NotificationSettingsModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
        />
      )}
    </div>
  );
}
