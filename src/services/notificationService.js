// Notification Service for Lock Screen & Background Match Alerts
const NOTIFICATION_PREFS_KEY = 'gostandoverthere_notification_prefs';

const DEFAULT_PREFS = {
  enabled: true,
  notifyScoreUpdates: true,
  notifyNewGame: true,
  notifySetPoints: true,
  notifyTimeouts: true,
  notifySound: true
};

export const notificationService = {
  getPreferences() {
    try {
      const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (!raw) return { ...DEFAULT_PREFS };
      return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_PREFS };
    }
  },

  savePreferences(prefs) {
    try {
      localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving notification preferences:', e);
    }
  },

  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  getPermissionStatus() {
    if (!this.isSupported()) return 'denied';
    return Notification.permission; // 'default' | 'granted' | 'denied'
  },

  async requestPermission() {
    if (!this.isSupported()) {
      return { success: false, status: 'denied', reason: 'unsupported' };
    }

    try {
      const status = await Notification.requestPermission();
      return {
        success: status === 'granted',
        status
      };
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return { success: false, status: 'denied', error: err };
    }
  },

  // Play micro-chime tone using Web Audio API when points/alerts occur
  playAlertChime(type = 'point') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'set_point' || type === 'new_game') {
        // High 2-tone celebratory chime
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        // Quick energetic blip
        osc.frequency.setValueAtTime(659.25, now); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch {
      // Audio not permitted or user hasn't interacted yet
    }
  },

  // Core Dispatcher: Sends notification to OS Lock Screen and Notification Shade
  async sendLockScreenNotification({
    title,
    body,
    tag = 'volleyball-live-update',
    renotify = true,
    data = {},
    icon = '/icon-192.png',
    badge = '/icon-192.png',
    alertType = 'point'
  }) {
    if (!this.isSupported()) return false;
    if (this.getPermissionStatus() !== 'granted') return false;

    const prefs = this.getPreferences();
    if (!prefs.enabled) return false;

    // Check specific toggle preferences
    if (alertType === 'score' && !prefs.notifyScoreUpdates) return false;
    if (alertType === 'new_game' && !prefs.notifyNewGame) return false;
    if (alertType === 'set_point' && !prefs.notifySetPoints) return false;
    if (alertType === 'timeout' && !prefs.notifyTimeouts) return false;

    // Sound / Chime
    if (prefs.notifySound) {
      this.playAlertChime(alertType);
    }

    const options = {
      body,
      icon,
      badge,
      tag,
      renotify,
      vibrate: [200, 100, 200],
      data: {
        url: window.location.origin,
        timestamp: Date.now(),
        ...data
      },
      silent: false
    };

    // Prefer Service Worker registration (required on mobile lock screens)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && typeof registration.showNotification === 'function') {
          await registration.showNotification(title, options);
          return true;
        }
      } catch (e) {
        console.warn('Service worker showNotification fallback:', e);
      }
    }

    // Standard Desktop fallback
    try {
      const n = new Notification(title, options);
      n.onclick = function() {
        window.focus();
        this.close();
      };
      return true;
    } catch (err) {
      console.warn('Notification construction error:', err);
      return false;
    }
  },

  // Dispatches a Live Score update to the lock screen
  sendScoreUpdateNotification({ ourScore, opponentScore, opponentName, setNumber, scorerName, detailText }) {
    const title = `🏐 Live: Us ${ourScore} - ${opponentScore} ${opponentName || 'Opponent'}`;
    const body = `${scorerName ? `${scorerName}: ` : ''}${detailText || 'Point recorded'} • Set ${setNumber || 1}`;

    return this.sendLockScreenNotification({
      title,
      body,
      tag: 'volleyball-live-score', // Consistent tag groups and updates the single score notification on lock screen
      renotify: true,
      alertType: 'score',
      data: { ourScore, opponentScore, setNumber }
    });
  },

  // Dispatches a Set Point / Match Point alert
  sendSetPointNotification({ teamLeading, ourScore, opponentScore, setNumber, isMatchPoint = false }) {
    const title = isMatchPoint
      ? `🔥 MATCH POINT: Us ${ourScore} - ${opponentScore}`
      : `⚡ SET POINT: Us ${ourScore} - ${opponentScore}`;
    const body = `${teamLeading === 'us' ? 'Our squad' : 'Opponent'} is serving for the ${isMatchPoint ? 'match' : 'set'}! (Set ${setNumber})`;

    return this.sendLockScreenNotification({
      title,
      body,
      tag: 'volleyball-set-point',
      renotify: true,
      alertType: 'set_point',
      data: { setNumber }
    });
  },

  // Dispatches New Match alert
  sendNewMatchNotification({ opponentName, tournamentName, courtNumber, matchFormat }) {
    const title = `🏐 New Match Started: vs ${opponentName || 'Opponent'}`;
    const body = `${tournamentName ? `${tournamentName} • ` : ''}${courtNumber ? `${courtNumber} • ` : ''}${matchFormat || 'Starting 6 Ready'}`;

    return this.sendLockScreenNotification({
      title,
      body,
      tag: 'volleyball-new-game',
      renotify: true,
      alertType: 'new_game'
    });
  },

  // Dispatches Timeout alert
  sendTimeoutNotification({ teamCalling, ourScore, opponentScore }) {
    const title = `⏱️ Timeout Called by ${teamCalling === 'us' ? 'Our Squad' : 'Opponent'}`;
    const body = `Score: Us ${ourScore} - ${opponentScore} Opponent • 60-second break`;

    return this.sendLockScreenNotification({
      title,
      body,
      tag: 'volleyball-timeout',
      renotify: true,
      alertType: 'timeout'
    });
  },

  // Test Notification for Coaches
  async sendTestNotification() {
    return this.sendLockScreenNotification({
      title: '🏐 Live Volleyball Alert (Lock Screen Test)',
      body: 'Score: Us 24 - 22 Opponent • Real-time background notifications active!',
      tag: 'volleyball-test',
      renotify: true,
      alertType: 'set_point'
    });
  }
};
