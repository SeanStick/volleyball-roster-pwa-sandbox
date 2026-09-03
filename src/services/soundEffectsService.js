/**
 * Sound & Haptic Feedback Service
 * Optimized for iOS Safari, iOS PWA Standalone Mode, and Android.
 * Handles iOS Web Audio unlocking, sports alert sound effects, and device vibration.
 */

class SoundEffectsService {
  constructor() {
    this.audioCtx = null;
    this.isUnlocked = false;
    this._initListeners();
  }

  /**
   * Listen for the first touch or click anywhere on the page to unlock iOS Web Audio.
   */
  _initListeners() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.unlockAudioContext();
      if (this.isUnlocked) {
        window.removeEventListener('touchstart', unlock, true);
        window.removeEventListener('touchend', unlock, true);
        window.removeEventListener('click', unlock, true);
      }
    };

    window.addEventListener('touchstart', unlock, true);
    window.addEventListener('touchend', unlock, true);
    window.addEventListener('click', unlock, true);
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    return this.audioCtx;
  }

  unlockAudioContext() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    } else if (ctx.state === 'running') {
      this.isUnlocked = true;
    }

    // Play a microscopic silent buffer to guarantee iOS WebKit hardware audio session is active
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Vibrate the physical phone if supported by the browser and operating system.
   * Note: Android and Chrome PWAs support navigator.vibrate.
   * Apple's iOS Safari/WebKit does NOT implement navigator.vibrate for web pages.
   */
  vibrate(pattern = [220, 90, 220, 90, 350]) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
        return true;
      }
    } catch (e) {
      // Ignore
    }
    return false;
  }

  /**
   * High-visibility alert sound when someone else records a score.
   * Produces a crisp, bright ascending stadium double-chime with sports referee punch.
   */
  playScoreAlertSound(pointWonBy = 'us') {
    // 1. Trigger physical vibration if device supports it
    this.vibrate([220, 90, 220, 90, 350]);

    // 2. Play Web Audio chime
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (pointWonBy === 'undo') {
        // Soft double blip for score undo / revert (E5 -> C5)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(523.25, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
        return;
      }

      // Sports Stadium Chime: Rich dual-harmonic bell (A5 880Hz + D6 1174Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle'; // triangle adds warm harmonic presence audible on phone speakers

      if (pointWonBy === 'us') {
        // Cheerful high-energy ascending alert: G5 (784Hz) -> C6 (1046Hz) -> E6 (1318Hz)
        osc1.frequency.setValueAtTime(783.99, now);
        osc1.frequency.setValueAtTime(1046.50, now + 0.12);
        osc1.frequency.setValueAtTime(1318.51, now + 0.24);

        osc2.frequency.setValueAtTime(392.00, now);
        osc2.frequency.setValueAtTime(523.25, now + 0.12);
        osc2.frequency.setValueAtTime(659.25, now + 0.24);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      } else {
        // Opponent / General score: Distinct 2-tone chime: D5 (587Hz) -> A5 (880Hz)
        osc1.frequency.setValueAtTime(587.33, now);
        osc1.frequency.setValueAtTime(880.00, now + 0.15);

        osc2.frequency.setValueAtTime(293.66, now);
        osc2.frequency.setValueAtTime(440.00, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      }

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch (err) {
      console.warn('Sound playback notice:', err);
    }
  }
}

export const soundEffectsService = new SoundEffectsService();
