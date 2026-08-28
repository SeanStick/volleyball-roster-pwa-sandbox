import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const FIREBASE_CONFIG_KEY = 'gostandoverthere_firebase_config_v1';
const LEGACY_FIREBASE_CONFIG_KEY = 'spikesync_firebase_config_v1';

export const firebaseService = {
  getStoredConfig() {
    try {
      let data = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (!data) {
        data = localStorage.getItem(LEGACY_FIREBASE_CONFIG_KEY);
        if (data) {
          localStorage.setItem(FIREBASE_CONFIG_KEY, data);
        }
      }
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading Firebase config from localStorage:', e);
    }
    return null;
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
    return Boolean(config && config.projectId && config.apiKey);
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
      console.error('Firebase sync error:', e);
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
      console.error('Firebase fetch error:', e);
      return { success: false, error: e.message };
    }
  }
};
