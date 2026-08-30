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
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { DEFAULT_FIREBASE_CONFIG } from './firebaseConfig';

const FIREBASE_CONFIG_KEY = 'gostandoverthere_firebase_config_v1';
const LEGACY_FIREBASE_CONFIG_KEY = 'spikesync_firebase_config_v1';
const DEMO_USER_KEY = 'gostandoverthere_demo_auth_user_v1';
const DEMO_CLOUD_STORE_KEY = 'gostandoverthere_demo_cloud_store_v1';

export const firebaseService = {
  // -------------------------------------------------------------
  // Firebase Configuration & Initialization
  // -------------------------------------------------------------
  getStoredConfig() {
    try {
      // 1. Check user override in localStorage
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

      // 2. Built-in dedicated project configuration
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
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
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
  // Authentication Services (Email/Password, Google, Demo)
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
    localStorage.removeItem(DEMO_USER_KEY);
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
  // Google Cloud Firestore — User Profile & Teams Persistence
  // -------------------------------------------------------------
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

  async syncFullTeamToCloud(userId, teamData) {
    if (!userId || !teamData) return { success: false, error: 'User ID and team data are required.' };
    const teamId = teamData.teamId || teamData.id || 'default_team';

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return this._mockSyncTeam(userId, teamId, teamData);
    }

    try {
      const teamDocRef = doc(db, 'users', userId, 'teams', teamId);
      const payload = {
        id: teamId,
        teamSettings: teamData.teamSettings || {},
        roster: teamData.roster || [],
        matchState: teamData.matchState || null,
        matchStats: teamData.matchStats || null,
        matchHistory: teamData.matchHistory || [],
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      };

      await setDoc(teamDocRef, payload, { merge: true });

      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          activeTeamId: teamId,
          lastSyncAt: new Date().toISOString()
        }, { merge: true });
      } catch (userErr) {
        // Non fatal
      }

      return { success: true, teamId };
    } catch (e) {
      console.warn('Firestore team sync fallback to local cache:', e.message);
      this._mockSyncTeam(userId, teamId, teamData);
      return { success: true, teamId, localFallback: true, warning: e.message };
    }
  },

  async fetchUserTeamsFromCloud(userId) {
    if (!userId) return { success: false, error: 'User ID is required' };

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return this._mockFetchTeams(userId);
    }

    try {
      const teamsCollRef = collection(db, 'users', userId, 'teams');
      const q = query(teamsCollRef, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);

      const teams = [];
      snapshot.forEach((docSnap) => {
        teams.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (teams.length === 0) {
        // Check mock cloud store
        const mock = this._mockFetchTeams(userId);
        if (mock.teams && mock.teams.length > 0) return mock;
      }

      return { success: true, teams };
    } catch (e) {
      console.warn('Firestore fetchUserTeams notice:', e.message);
      return this._mockFetchTeams(userId);
    }
  },

  async fetchTeamDataFromCloud(userId, teamId) {
    if (!userId || !teamId) return { success: false, error: 'User ID and team ID required' };

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return this._mockFetchTeamData(userId, teamId);
    }

    try {
      const teamDocRef = doc(db, 'users', userId, 'teams', teamId);
      const snap = await getDoc(teamDocRef);
      if (snap.exists()) {
        return { success: true, data: snap.data() };
      }
      return this._mockFetchTeamData(userId, teamId);
    } catch (e) {
      console.warn('Firestore fetchTeamData fallback:', e.message);
      return this._mockFetchTeamData(userId, teamId);
    }
  },

  async deleteTeamFromCloud(userId, teamId) {
    if (!userId || !teamId) return { success: false, error: 'User ID and team ID required' };

    const db = this.getDbInstance();
    if (db && this.isConfigured()) {
      try {
        const teamDocRef = doc(db, 'users', userId, 'teams', teamId);
        await deleteDoc(teamDocRef);
      } catch (e) {
        console.warn('Firestore deleteDoc notice:', e.message);
      }
    }

    this._mockDeleteTeam(userId, teamId);
    return { success: true };
  },

  subscribeToUserTeam(userId, teamId, onData, onError) {
    if (!userId || !teamId) return () => {};

    const db = this.getDbInstance();
    if (!db || !this.isConfigured()) {
      return () => {};
    }

    try {
      const teamDocRef = doc(db, 'users', userId, 'teams', teamId);
      return onSnapshot(
        teamDocRef,
        (snap) => {
          if (snap.exists()) {
            onData(snap.data());
          }
        },
        (err) => {
          console.warn('Firestore snapshot listener notice:', err.message);
          if (onError) onError(err);
        }
      );
    } catch (e) {
      console.warn('Error attaching Firestore team listener:', e.message);
      return () => {};
    }
  },

  // -------------------------------------------------------------
  // Legacy Roster Handlers for Backward Compatibility
  // -------------------------------------------------------------
  async syncRosterToCloud(roster, teamSettings, teamId = 'default_team') {
    const app = this.getFirebaseApp();
    if (!app) return { success: false, error: 'Firebase not configured' };

    try {
      const db = getFirestore(app);
      const teamDocRef = doc(db, 'volleyball_rosters', teamId);
      await setDoc(teamDocRef, {
        roster,
        teamSettings,
        updatedAt: new Date().toISOString(),
        device: navigator.userAgent
      }, { merge: true });
      return { success: true };
    } catch (e) {
      console.warn('Firebase legacy sync notice:', e.message);
      return { success: false, error: e.message };
    }
  },

  async fetchRosterFromCloud(teamId = 'default_team') {
    const app = this.getFirebaseApp();
    if (!app) return { success: false, error: 'Firebase not configured' };

    try {
      const db = getFirestore(app);
      const teamDocRef = doc(db, 'volleyball_rosters', teamId);
      const snap = await getDoc(teamDocRef);
      if (snap.exists()) {
        return { success: true, data: snap.data() };
      }
      return { success: false, error: 'No roster found on cloud for this team ID' };
    } catch (e) {
      console.warn('Firebase legacy fetch notice:', e.message);
      return { success: false, error: e.message };
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
        updatedAt: new Date().toISOString(),
        isDemoCloud: true
      };

      localStorage.setItem(DEMO_CLOUD_STORE_KEY, JSON.stringify(store));
      return { success: true, teamId };
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
        return 'Sign-In provider is disabled in Firebase Console. Please enable Email/Password or Google in Firebase Console > Authentication > Sign-in method.';
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
