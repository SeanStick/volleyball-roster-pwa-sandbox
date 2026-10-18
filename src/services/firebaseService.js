import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { DEFAULT_FIREBASE_CONFIG } from './firebaseConfig';

const FIREBASE_CONFIG_KEY = 'gostandoverthere_firebase_config_v1';
const DEMO_USER_KEY = 'gostandoverthere_demo_auth_user_v1';
const DEMO_CLOUD_STORE_KEY = 'gostandoverthere_demo_cloud_store_v1';

export const firebaseService = {
  // -------------------------------------------------------------
  // Firebase Configuration & Initialization
  // -------------------------------------------------------------
  getStoredConfig() {
    try {
      let data = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.apiKey && parsed.projectId === DEFAULT_FIREBASE_CONFIG.projectId) {
          return {
            ...DEFAULT_FIREBASE_CONFIG,
            ...parsed,
            authDomain: DEFAULT_FIREBASE_CONFIG.authDomain
          };
        }
      }

      if (DEFAULT_FIREBASE_CONFIG && DEFAULT_FIREBASE_CONFIG.apiKey) {
        return DEFAULT_FIREBASE_CONFIG;
      }
    } catch (e) {
      console.error('Error reading Firebase config:', e);
    }
    return DEFAULT_FIREBASE_CONFIG;
  },

  saveConfig(config) {
    try {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving Firebase config:', e);
    }
  },

  clearConfig() {
    try {
      localStorage.removeItem(FIREBASE_CONFIG_KEY);
    } catch (e) {
      console.warn('Error clearing Firebase config:', e);
    }
  },

  isConfigured() {
    const config = this.getStoredConfig();
    return Boolean(config && config.projectId && config.apiKey && !config.apiKey.startsWith('AIzaSyDemoKey'));
  },

  getFirebaseApp() {
    const config = this.getStoredConfig();
    if (!config || !config.apiKey) return null;

    try {
      if (getApps().length > 0) {
        return getApp();
      }
      return initializeApp(config);
    } catch (e) {
      console.error('Firebase initialization error:', e);
      return null;
    }
  },

  getAuthInstance() {
    const app = this.getFirebaseApp();
    if (!app) return null;
    try {
      return getAuth(app);
    } catch (e) {
      console.error('Firebase Auth initialization error:', e);
      return null;
    }
  },

  getDbInstance() {
    const app = this.getFirebaseApp();
    if (!app) return null;
    try {
      return getFirestore(app);
    } catch (e) {
      console.error('Firestore initialization error:', e);
      return null;
    }
  },

  // -------------------------------------------------------------
  // Authentication Services
  // -------------------------------------------------------------
  async registerWithEmail(email, password, displayName = '') {
    const auth = this.getAuthInstance();
    if (!auth || !this.isConfigured()) {
      return this._mockRegister(email, password, displayName);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (displayName.trim()) {
        try {
          await updateProfile(user, { displayName: displayName.trim() });
        } catch (profileErr) {
          console.warn('Could not set displayName on user profile:', profileErr);
        }
      }

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName.trim() || user.displayName || email.split('@')[0],
        photoURL: user.photoURL || null,
        providerId: 'password',
        createdAt: new Date().toISOString()
      };

      try {
        await this.saveUserProfile(userData);
      } catch (dbErr) {
        console.warn('Could not save user profile to Firestore yet:', dbErr);
      }

      return { success: true, user: userData };
    } catch (e) {
      console.error('Firebase registration error:', e);
      return { success: false, error: this._formatAuthError(e) };
    }
  },

  async loginWithEmail(email, password) {
    const auth = this.getAuthInstance();
    if (!auth || !this.isConfigured()) {
      return this._mockLogin(email, password);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || null,
        providerId: 'password',
        lastLoginAt: new Date().toISOString()
      };

      try {
        await this.saveUserProfile(userData);
      } catch (dbErr) {
        console.warn('Could not update user profile in Firestore:', dbErr);
      }

      return { success: true, user: userData };
    } catch (e) {
      console.error('Firebase login error:', e);
      return { success: false, error: this._formatAuthError(e) };
    }
  },

  async loginWithGoogle() {
    const auth = this.getAuthInstance();
    if (!auth || !this.isConfigured()) {
      return this._mockGoogleLogin();
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Coach'),
        photoURL: user.photoURL || null,
        providerId: 'google.com',
        lastLoginAt: new Date().toISOString()
      };

      try {
        await this.saveUserProfile(userData);
      } catch (dbErr) {
        console.warn('Could not save Google profile in Firestore:', dbErr);
      }

      return { success: true, user: userData };
    } catch (e) {
      console.error('Firebase Google login error:', e);
      return { success: false, error: this._formatAuthError(e) };
    }
  },

  async resetPassword(email) {
    const auth = this.getAuthInstance();
    if (!auth || !this.isConfigured()) {
      return { success: true, message: `Password reset link simulated for ${email} (Demo Mode).` };
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true, message: `Password reset email sent to ${email}.` };
    } catch (e) {
      console.error('Firebase reset password error:', e);
      return { success: false, error: this._formatAuthError(e) };
    }
  },

  async logout() {
    const auth = this.getAuthInstance();
    try {
      if (auth && this.isConfigured()) {
        await signOut(auth);
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
    try {
      localStorage.removeItem(DEMO_USER_KEY);
    } catch {}
    return { success: true };
  },

  onAuthChange(callback) {
    const auth = this.getAuthInstance();
    if (auth && this.isConfigured()) {
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const user = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Coach'),
            photoURL: firebaseUser.photoURL || null,
            providerId: firebaseUser.providerData?.[0]?.providerId || 'firebase'
          };
          callback(user);
        } else {
          const demoUser = this._getDemoUser();
          callback(demoUser);
        }
      });
    } else {
      const demoUser = this._getDemoUser();
      callback(demoUser);
      return () => {};
    }
  },

  // -------------------------------------------------------------
  // Multi-User Collaborative Teams & Real-Time Sync
  // -------------------------------------------------------------
  generateShareCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'VB-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  async saveUserProfile(userData) {
    if (!userData || !userData.uid) return;
    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) return;

    try {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore saveUserProfile notice:', e.message);
    }
  },

  async ensureTeamShareCode(user, teamId, teamData) {
    if (!user || !user.uid || !teamId) return null;
    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) return teamData?.shareCode || this.generateShareCode();

    try {
      const teamDocRef = doc(db, 'teams', teamId);
      const snap = await getDoc(teamDocRef);

      if (snap.exists() && snap.data().shareCode) {
        return snap.data().shareCode;
      }

      // Generate and persist new shareCode
      const newCode = teamData?.shareCode || this.generateShareCode();
      await this.syncFullTeamToCloud(user.uid, {
        ...teamData,
        id: teamId,
        shareCode: newCode
      }, user);

      return newCode;
    } catch (e) {
      console.warn('ensureTeamShareCode notice:', e.message);
      return teamData?.shareCode || this.generateShareCode();
    }
  },

  async syncFullTeamToCloud(userId, teamData, userProfile = null, deviceId = null) {
    if (!userId || !teamData) return { success: false, error: 'User ID and team data are required.' };
    const teamId = teamData.teamId || teamData.id || 'default_team';

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return this._mockSyncTeam(userId, teamId, teamData);
    }

    try {
      const userDisplayName = userProfile?.displayName || teamData.ownerName || 'Coach';
      const userEmail = userProfile?.email || '';

      // 1. Check existing shared collection /teams/{teamId}
      const sharedTeamDocRef = doc(db, 'teams', teamId);
      const existingSnap = await getDoc(sharedTeamDocRef);
      
      let existingData = {};
      let existingMembers = {};
      let existingShareCode = teamData.shareCode;
      let ownerId = userId;
      let ownerName = userDisplayName;

      if (existingSnap.exists()) {
        existingData = existingSnap.data() || {};
        existingMembers = existingData.members || {};
        existingShareCode = existingData.shareCode || existingShareCode || this.generateShareCode();
        ownerId = existingData.ownerId || ownerId;
        ownerName = existingData.ownerName || ownerName;
      } else {
        if (!existingShareCode) {
          existingShareCode = this.generateShareCode();
        }
      }

      // Ensure current user is registered in members map
      const role = (ownerId === userId) ? 'owner' : (existingMembers[userId]?.role || 'coach');
      const updatedMembers = {
        ...existingMembers,
        [userId]: {
          uid: userId,
          role,
          email: userEmail,
          displayName: userDisplayName,
          lastActiveAt: new Date().toISOString()
        }
      };

      // Smart Collaborative Roster Merge: prevents overwriting when two coaches edit players concurrently
      let finalRoster = teamData.roster || [];
      const remoteDeletedIds = new Set(existingData.deletedPlayerIds || []);
      if (teamData.deletedPlayerId) remoteDeletedIds.add(teamData.deletedPlayerId);
      if (Array.isArray(teamData.deletedPlayerIds)) {
        teamData.deletedPlayerIds.forEach(id => remoteDeletedIds.add(id));
      }

      if (Array.isArray(existingData.roster) && Array.isArray(teamData.roster)) {
        const incomingMap = new Map(teamData.roster.map(p => [p.id, p]));
        const mergedList = [];

        // 1. First add incoming players (resolving by updatedAt timestamp if both modified the same player)
        teamData.roster.forEach(player => {
          if (!remoteDeletedIds.has(player.id)) {
            const remoteP = existingData.roster.find(rp => rp.id === player.id);
            if (remoteP && remoteP.updatedAt && player.updatedAt) {
              if (new Date(remoteP.updatedAt).getTime() > new Date(player.updatedAt).getTime()) {
                mergedList.push(remoteP);
                return;
              }
            }
            mergedList.push(player);
          }
        });

        // 2. Preserve any player added by another coach that this client had not yet loaded
        existingData.roster.forEach(remoteP => {
          if (!incomingMap.has(remoteP.id) && !remoteDeletedIds.has(remoteP.id)) {
            mergedList.push(remoteP);
          }
        });

        finalRoster = mergedList;
      }

      const payload = {
        id: teamId,
        shareCode: existingShareCode,
        ownerId,
        ownerName,
        members: updatedMembers,
        teamSettings: teamData.teamSettings || {},
        roster: finalRoster,
        deletedPlayerIds: Array.from(remoteDeletedIds).slice(0, 50),
        matchState: teamData.matchState || null,
        matchStats: teamData.matchStats || null,
        matchHistory: teamData.matchHistory || [],
        updatedAt: new Date().toISOString(),
        updatedBy: userId,
        updatedByDeviceId: deviceId || teamData.updatedByDeviceId || null,
        updatedByName: userDisplayName
      };

      if (teamData.lastScoreEvent !== undefined) {
        payload.lastScoreEvent = teamData.lastScoreEvent;
      }
      if (teamData.lastTimeoutEvent !== undefined) {
        payload.lastTimeoutEvent = teamData.lastTimeoutEvent;
      }
      if (teamData.lastRosterEvent !== undefined) {
        payload.lastRosterEvent = teamData.lastRosterEvent;
      }

      // Write full collaborative squad to /teams/{teamId}
      await setDoc(sharedTeamDocRef, payload, { merge: true });

      // 2. Also index under /users/{userId}/teams/{teamId}
      try {
        const userTeamIndexRef = doc(db, 'users', userId, 'teams', teamId);
        await setDoc(userTeamIndexRef, {
          id: teamId,
          teamName: teamData.teamSettings?.teamName || 'Volleyball Team',
          season: teamData.teamSettings?.season || '2026',
          primaryColor: teamData.teamSettings?.primaryColor || '#ff6b35',
          secondaryColor: teamData.teamSettings?.secondaryColor || '#1e3a8a',
          liberoColor: teamData.teamSettings?.liberoColor || '#8b5cf6',
          shareCode: existingShareCode,
          role,
          ownerId,
          ownerName,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          activeTeamId: teamId,
          lastSyncAt: new Date().toISOString()
        }, { merge: true });
      } catch (indexErr) {
        // Non-fatal index write
      }

      return { success: true, teamId, shareCode: existingShareCode, members: updatedMembers, roster: finalRoster };
    } catch (e) {
      console.warn('Firestore collaborative team sync error:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Dedicated atomic method to save or update an individual player.
   * Eliminates roster clobbering when multiple coaches edit simultaneously.
   */
  async saveRosterPlayer(teamId, user, playerData, deviceId) {
    if (!teamId || !playerData) return { success: false, error: 'Team ID and player data required' };

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return { success: true, player: playerData };
    }

    try {
      const sharedTeamDocRef = doc(db, 'teams', teamId);
      const snap = await getDoc(sharedTeamDocRef);
      if (!snap.exists()) {
        return { success: false, error: 'Team document not found' };
      }

      const teamData = snap.data();
      const currentRoster = Array.isArray(teamData.roster) ? teamData.roster : [];
      const now = new Date().toISOString();
      const playerWithMeta = {
        ...playerData,
        updatedAt: now,
        updatedBy: user?.uid || null,
        updatedByName: user?.displayName || user?.email?.split('@')[0] || 'Coach'
      };

      const existingIndex = currentRoster.findIndex(p => p.id === playerData.id);
      let updatedRoster;
      if (existingIndex >= 0) {
        updatedRoster = currentRoster.map(p => p.id === playerData.id ? playerWithMeta : p);
      } else {
        updatedRoster = [playerWithMeta, ...currentRoster];
      }

      // If player set as first server, ensure others are unset
      if (playerWithMeta.isFirstServer) {
        updatedRoster = updatedRoster.map(p => p.id === playerWithMeta.id ? p : { ...p, isFirstServer: false });
      }

      const lastRosterEvent = {
        id: `re-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: existingIndex >= 0 ? 'update_player' : 'add_player',
        playerId: playerWithMeta.id,
        playerName: playerWithMeta.name,
        playerNumber: playerWithMeta.number,
        callerName: user?.displayName || user?.email?.split('@')[0] || 'Coach',
        callerUid: user?.uid || null,
        callerDeviceId: deviceId || null,
        timestamp: now
      };

      await setDoc(sharedTeamDocRef, {
        roster: updatedRoster,
        lastRosterEvent,
        updatedAt: now,
        updatedBy: user?.uid || null,
        updatedByDeviceId: deviceId || null,
        updatedByName: user?.displayName || user?.email?.split('@')[0] || 'Coach'
      }, { merge: true });

      return { success: true, roster: updatedRoster, player: playerWithMeta, lastRosterEvent };
    } catch (e) {
      console.warn('saveRosterPlayer error:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Dedicated atomic method to delete a player from the collaborative team roster.
   */
  async deleteRosterPlayer(teamId, user, playerId, deviceId) {
    if (!teamId || !playerId) return { success: false, error: 'Team ID and player ID required' };

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return { success: true, playerId };
    }

    try {
      const sharedTeamDocRef = doc(db, 'teams', teamId);
      const snap = await getDoc(sharedTeamDocRef);
      if (!snap.exists()) {
        return { success: false, error: 'Team document not found' };
      }

      const teamData = snap.data();
      const currentRoster = Array.isArray(teamData.roster) ? teamData.roster : [];
      const playerToDelete = currentRoster.find(p => p.id === playerId);
      const updatedRoster = currentRoster.filter(p => p.id !== playerId);
      const now = new Date().toISOString();

      const existingDeleted = Array.isArray(teamData.deletedPlayerIds) ? teamData.deletedPlayerIds : [];
      const updatedDeleted = [playerId, ...existingDeleted.filter(id => id !== playerId)].slice(0, 50);

      const lastRosterEvent = {
        id: `re-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'delete_player',
        playerId,
        playerName: playerToDelete?.name || 'Player',
        playerNumber: playerToDelete?.number,
        callerName: user?.displayName || user?.email?.split('@')[0] || 'Coach',
        callerUid: user?.uid || null,
        callerDeviceId: deviceId || null,
        timestamp: now
      };

      await setDoc(sharedTeamDocRef, {
        roster: updatedRoster,
        deletedPlayerIds: updatedDeleted,
        lastRosterEvent,
        updatedAt: now,
        updatedBy: user?.uid || null,
        updatedByDeviceId: deviceId || null,
        updatedByName: user?.displayName || user?.email?.split('@')[0] || 'Coach'
      }, { merge: true });

      return { success: true, roster: updatedRoster, lastRosterEvent };
    } catch (e) {
      console.warn('deleteRosterPlayer error:', e);
      return { success: false, error: e.message };
    }
  },

  async fetchUserTeamsFromCloud(userId) {
    if (!userId) return { success: false, error: 'User ID is required', teams: [] };

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return this._mockFetchTeams(userId);
    }

    try {
      // 1. Fetch user's indexed teams
      const userTeamsRef = collection(db, 'users', userId, 'teams');
      const snapshot = await getDocs(userTeamsRef);

      const teamSummaries = [];
      snapshot.forEach((docSnap) => {
        teamSummaries.push({ id: docSnap.id, ...docSnap.data() });
      });

      // 2. Hydrate full squad documents from /teams/{teamId}
      const teams = [];
      for (const summary of teamSummaries) {
        try {
          const teamDocRef = doc(db, 'teams', summary.id);
          const snap = await getDoc(teamDocRef);
          if (snap.exists()) {
            teams.push({ id: snap.id, ...snap.data() });
          } else {
            teams.push(summary);
          }
        } catch (err) {
          teams.push(summary);
        }
      }

      // Sort in memory by updatedAt descending
      teams.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.teamSettings?.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.teamSettings?.updatedAt || 0).getTime();
        return dateB - dateA;
      });

      return { success: true, teams };
    } catch (e) {
      console.warn('Firestore fetchUserTeams error:', e);
      return { success: false, error: e.message, teams: [] };
    }
  },

  async fetchTeamDataFromCloud(userId, teamId) {
    if (!teamId) return { success: false, error: 'Team ID required' };

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return this._mockFetchTeamData(userId, teamId);
    }

    try {
      const teamDocRef = doc(db, 'teams', teamId);
      const snap = await getDoc(teamDocRef);
      if (snap.exists()) {
        return { success: true, data: snap.data() };
      }
      return { success: false, error: 'Team not found in Google Cloud Firestore' };
    } catch (e) {
      console.warn('Firestore fetchTeamData error:', e);
      return { success: false, error: e.message };
    }
  },

  async joinTeamWithCode(user, shareCode) {
    if (!user || !user.uid) return { success: false, error: 'Please sign in to join a team.' };
    if (!shareCode || !shareCode.trim()) return { success: false, error: 'Please enter a valid Team Share Code.' };

    let cleanCode = shareCode.trim().toUpperCase();
    if (!cleanCode.startsWith('VB-') && cleanCode.length === 4) {
      cleanCode = `VB-${cleanCode}`;
    }

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return { success: false, error: 'Cloud service not available.' };
    }

    try {
      // 1. Query /teams by shareCode
      const teamsCollRef = collection(db, 'teams');
      const q = query(teamsCollRef, where('shareCode', '==', cleanCode));
      let querySnap = await getDocs(q);

      let targetTeamDoc = null;
      if (!querySnap.empty) {
        targetTeamDoc = querySnap.docs[0];
      } else {
        // Fallback: search all teams in collection if index pending
        const allTeamsSnap = await getDocs(teamsCollRef);
        allTeamsSnap.forEach(docSnap => {
          const data = docSnap.data();
          if (
            (data.shareCode && data.shareCode.toUpperCase() === cleanCode) ||
            docSnap.id.toUpperCase() === cleanCode ||
            (data.shareCode && data.shareCode.replace('VB-', '') === cleanCode.replace('VB-', ''))
          ) {
            targetTeamDoc = docSnap;
          }
        });
      }

      if (!targetTeamDoc) {
        return { success: false, error: `No team found matching share code "${cleanCode}". Please verify the code with your head coach.` };
      }

      const teamData = targetTeamDoc.data();
      const teamId = targetTeamDoc.id;

      // Add user to team's members list
      const updatedMembers = {
        ...(teamData.members || {}),
        [user.uid]: {
          uid: user.uid,
          role: teamData.ownerId === user.uid ? 'owner' : 'coach',
          email: user.email || '',
          displayName: user.displayName || 'Coach',
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        }
      };

      await setDoc(doc(db, 'teams', teamId), {
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Save to user's team index
      await setDoc(doc(db, 'users', user.uid, 'teams', teamId), {
        id: teamId,
        teamName: teamData.teamSettings?.teamName || 'Volleyball Team',
        season: teamData.teamSettings?.season || '2026',
        primaryColor: teamData.teamSettings?.primaryColor || '#ff6b35',
        secondaryColor: teamData.teamSettings?.secondaryColor || '#1e3a8a',
        liberoColor: teamData.teamSettings?.liberoColor || '#8b5cf6',
        shareCode: cleanCode,
        role: teamData.ownerId === user.uid ? 'owner' : 'coach',
        ownerId: teamData.ownerId,
        ownerName: teamData.ownerName || 'Head Coach',
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return {
        success: true,
        team: {
          id: teamId,
          ...teamData,
          members: updatedMembers
        }
      };
    } catch (e) {
      console.error('Join team with code error:', e);
      return { success: false, error: e.message || 'Failed to join team.' };
    }
  },

  async deleteTeamFromCloud(userId, teamId) {
    if (!userId || !teamId) return { success: false, error: 'User ID and team ID required' };

    const db = this.getDbInstance();
    if (db && this.isConfigured()) {
      try {
        const userIndexRef = doc(db, 'users', userId, 'teams', teamId);
        await deleteDoc(userIndexRef);

        const sharedTeamRef = doc(db, 'teams', teamId);
        const snap = await getDoc(sharedTeamRef);
        if (snap.exists() && snap.data().ownerId === userId) {
          await deleteDoc(sharedTeamRef);
        }
      } catch (e) {
        console.warn('Firestore deleteDoc error:', e.message);
      }
    }

    this._mockDeleteTeam(userId, teamId);
    return { success: true };
  },

  subscribeToUserTeam(userId, teamId, onData, onError) {
    if (!teamId) return () => {};

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) return () => {};

    try {
      const teamDocRef = doc(db, 'teams', teamId);
      return onSnapshot(
        teamDocRef,
        { includeMetadataChanges: true },
        (snap) => {
          if (snap.exists()) {
            onData(snap.data(), { hasPendingWrites: snap.metadata.hasPendingWrites });
          }
        },
        (err) => {
          console.warn('Firestore collaborative team listener error:', err.message);
          if (onError) onError(err);
        }
      );
    } catch (e) {
      console.warn('Error attaching Firestore team listener:', e.message);
      return () => {};
    }
  },

  // -------------------------------------------------------------
  // Internal Mock / Demo Fallbacks
  // -------------------------------------------------------------
  _getDemoUser() {
    try {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  _setDemoUser(user) {
    if (user) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
    }
  },

  _mockRegister(email, password, displayName) {
    const name = displayName.trim() || email.split('@')[0];
    const user = {
      uid: `user-local-${Date.now()}`,
      email: email.trim().toLowerCase(),
      displayName: name,
      photoURL: null,
      providerId: 'local-demo',
      createdAt: new Date().toISOString()
    };
    this._setDemoUser(user);
    return { success: true, user };
  },

  _mockLogin(email, password) {
    const current = this._getDemoUser();
    const user = {
      uid: current?.uid || `user-local-${Date.now()}`,
      email: email.trim().toLowerCase(),
      displayName: current?.displayName || email.split('@')[0],
      photoURL: current?.photoURL || null,
      providerId: 'local-demo',
      lastLoginAt: new Date().toISOString()
    };
    this._setDemoUser(user);
    return { success: true, user };
  },

  _mockGoogleLogin() {
    const user = {
      uid: `google-user-${Date.now()}`,
      email: 'coach.google@gmail.com',
      displayName: 'Coach Google',
      photoURL: null,
      providerId: 'google.com',
      lastLoginAt: new Date().toISOString()
    };
    this._setDemoUser(user);
    return { success: true, user };
  },

  _mockSyncTeam(userId, teamId, teamData) {
    try {
      let store = {};
      const raw = localStorage.getItem(DEMO_CLOUD_STORE_KEY);
      if (raw) store = JSON.parse(raw);

      if (!store[userId]) store[userId] = {};
      store[userId][teamId] = {
        ...teamData,
        id: teamId,
        shareCode: teamData.shareCode || this.generateShareCode(),
        updatedAt: new Date().toISOString(),
        isDemoCloud: true
      };

      localStorage.setItem(DEMO_CLOUD_STORE_KEY, JSON.stringify(store));
      return { success: true, teamId, shareCode: store[userId][teamId].shareCode };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  _mockFetchTeams(userId) {
    try {
      const raw = localStorage.getItem(DEMO_CLOUD_STORE_KEY);
      if (raw) {
        const store = JSON.parse(raw);
        if (store[userId]) {
          const list = Object.values(store[userId]);
          return { success: true, teams: list };
        }
      }
      return { success: true, teams: [] };
    } catch (e) {
      return { success: false, error: e.message, teams: [] };
    }
  },

  _mockFetchTeamData(userId, teamId) {
    try {
      const raw = localStorage.getItem(DEMO_CLOUD_STORE_KEY);
      if (raw) {
        const store = JSON.parse(raw);
        if (store[userId] && store[userId][teamId]) {
          return { success: true, data: store[userId][teamId] };
        }
      }
      return { success: false, error: 'Team not found in local cloud cache' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  _mockDeleteTeam(userId, teamId) {
    try {
      const raw = localStorage.getItem(DEMO_CLOUD_STORE_KEY);
      if (raw) {
        const store = JSON.parse(raw);
        if (store[userId] && store[userId][teamId]) {
          delete store[userId][teamId];
          localStorage.setItem(DEMO_CLOUD_STORE_KEY, JSON.stringify(store));
        }
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  _formatAuthError(error) {
    if (!error) return 'An unknown error occurred.';
    const code = error.code || '';
    switch (code) {
      case 'auth/operation-not-allowed':
        return 'Google Sign-In is not enabled yet in Firebase Console. Please enable Google in Firebase Console > Authentication > Sign-in method.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized in Firebase. Please add this domain to Firebase Console > Authentication > Settings > Authorized Domains.';
      case 'auth/email-already-in-use':
        return 'This email address is already registered. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In popup was closed before completing.';
      case 'auth/popup-blocked':
        return 'Google Sign-In popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few moments and try again.';
      default:
        return error.message || 'Authentication failed.';
    }
  }
};
