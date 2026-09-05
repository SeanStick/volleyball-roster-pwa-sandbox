// Voice Scorekeeper Service using Web Speech API (Hands-free Sideline Scoring)
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, 'twenty one': 21, 'twenty-one': 21,
  'twenty two': 22, 'twenty-two': 22, 'twenty three': 23, 'twenty-three': 23, 'twenty four': 24,
  'twenty-four': 24, 'twenty five': 25, 'twenty-five': 25, thirty: 30, forty: 40, fifty: 50
};

class VoiceScoreService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onCommandCallback = null;
    this.onTranscriptCallback = null;
    this.onErrorCallback = null;
    this.onStateChangeCallback = null;
    this.silenceTimeout = null;
    this.restartAttempts = 0;
    this.shouldKeepListening = false;
  }

  isSupported() {
    return typeof window !== 'undefined' && Boolean(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
  }

  // Parse spoken words into a clean jersey number
  extractJerseyNumber(text) {
    if (!text) return null;
    // Check for direct digits like 14, 7, etc.
    const digitMatch = text.match(/\b([0-9]{1,2})\b/);
    if (digitMatch) {
      return parseInt(digitMatch[1], 10);
    }
    // Check for number words
    const lower = text.toLowerCase();
    for (const [word, val] of Object.entries(NUMBER_WORDS)) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(lower)) {
        return val;
      }
    }
    return null;
  }

  // Parse spoken text into a recognized volleyball action
  parseVolleyballCommand(rawText) {
    if (!rawText) return null;
    const text = rawText.toLowerCase().trim();
    const jerseyNumber = this.extractJerseyNumber(text);

    // 1. Attack Kill: "kill 14", "14 kill", "spike 12", "attack 8"
    if (/\b(kill|attack|spike|hit)\b/i.test(text)) {
      return {
        action: 'kill',
        jerseyNumber,
        rawText,
        description: jerseyNumber ? `Attack Kill #${jerseyNumber}` : 'Attack Kill'
      };
    }

    // 2. Service Ace: "ace 3", "3 ace", "service ace", "ace"
    if (/\b(ace|service ace)\b/i.test(text)) {
      return {
        action: 'ace',
        jerseyNumber,
        rawText,
        description: jerseyNumber ? `Service Ace #${jerseyNumber}` : 'Service Ace'
      };
    }

    // 3. Block Kill: "block 5", "stuff block 9", "block"
    if (/\b(block|roof|stuff)\b/i.test(text)) {
      return {
        action: 'block',
        jerseyNumber,
        rawText,
        description: jerseyNumber ? `Block Kill #${jerseyNumber}` : 'Block Kill'
      };
    }

    // 4. Point for Our Team: "point us", "our point", "we scored", "score us", "plus one us"
    if (
      /\b(point us|our point|point our|we scored|score us|score for us|plus us|plus one us|point we)\b/i.test(text) ||
      text === 'us' || text === 'point'
    ) {
      return {
        action: 'point_us',
        jerseyNumber,
        rawText,
        description: jerseyNumber ? `Point to Us (#${jerseyNumber})` : 'Point to Us'
      };
    }

    // 5. Opponent Point / Error: "point opponent", "opp point", "missed serve", "serve out", "net"
    if (
      /\b(point opponent|opponent point|opp point|their point|they scored|them|opponent|missed serve|serve in net|serve out|net violation|foot fault|double|lift)\b/i.test(text)
    ) {
      let errorType = 'unspecified_error';
      if (/missed serve|serve in net|serve out/i.test(text)) errorType = 'missed_serve_net';
      else if (/net violation/i.test(text)) errorType = 'net_touch';
      else if (/foot fault/i.test(text)) errorType = 'service_foot_fault';

      return {
        action: 'point_opponent',
        jerseyNumber,
        errorType,
        rawText,
        description: 'Point to Opponent'
      };
    }

    // 6. Timeout: "timeout", "call timeout", "time out"
    if (/\b(timeout|time out|take a timeout)\b/i.test(text)) {
      const isOpponent = /opponent|them|their/i.test(text);
      return {
        action: 'timeout',
        team: isOpponent ? 'opponent' : 'us',
        rawText,
        description: isOpponent ? 'Timeout Opponent' : 'Timeout Called (Our Squad)'
      };
    }

    // 7. Undo: "undo", "undo point", "mistake", "scratch that"
    if (/\b(undo|undo point|take back|scratch that|cancel point)\b/i.test(text)) {
      return {
        action: 'undo',
        rawText,
        description: 'Undo Last Point'
      };
    }

    // 8. Next Rotation: "rotate", "next rotation"
    if (/\b(rotate|next rotation|rotation)\b/i.test(text)) {
      return {
        action: 'rotate',
        rawText,
        description: 'Rotate Court Lineup'
      };
    }

    return null;
  }

  // Start continuous listening
  startListening({ onCommand, onTranscript, onError, onStateChange }) {
    if (!this.isSupported()) {
      if (onError) onError('Speech Recognition is not supported in this browser.');
      return false;
    }

    this.onCommandCallback = onCommand;
    this.onTranscriptCallback = onTranscript;
    this.onErrorCallback = onError;
    this.onStateChangeCallback = onStateChange;
    this.shouldKeepListening = true;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.restartAttempts = 0;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        const transcriptToProcess = finalTranscript || interimTranscript;
        if (this.onTranscriptCallback && transcriptToProcess) {
          this.onTranscriptCallback(transcriptToProcess, Boolean(finalTranscript));
        }

        if (finalTranscript) {
          const command = this.parseVolleyballCommand(finalTranscript);
          if (command && this.onCommandCallback) {
            this.onCommandCallback(command);
          }
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error === 'no-speech') return; // Normal silence
        console.warn('Speech recognition warning:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.shouldKeepListening = false;
          this.isListening = false;
          if (this.onErrorCallback) this.onErrorCallback('Microphone permission blocked. Enable microphone in site settings.');
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // Auto-restart continuous listening if coach hasn't stopped it
        if (this.shouldKeepListening && this.restartAttempts < 15) {
          this.restartAttempts += 1;
          setTimeout(() => {
            if (this.shouldKeepListening) {
              try {
                this.recognition.start();
              } catch {
                // ignore
              }
            }
          }, 350);
        } else {
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
        }
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      this.isListening = false;
      if (this.onErrorCallback) this.onErrorCallback(err.message || 'Could not access microphone');
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      return false;
    }
  }

  stopListening() {
    this.shouldKeepListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.isListening = false;
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }
}

export const voiceScoreService = new VoiceScoreService();
