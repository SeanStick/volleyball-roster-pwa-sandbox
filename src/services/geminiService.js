/**
 * geminiService.js
 * 
 * Intelligent Volleyball Head Coach Advisor powered by Google Gemini AI.
 * Packages live match statistics, rotation, court lineup, recent momentum,
 * and error distribution into a contextual prompt for Gemini, returning
 * expert tactical adjustments and high-energy motivational pep talks.
 */

import { storageService } from './storageService';
import { ZONE_LABELS } from './volleyballRules';

/**
 * Builds a structured, detailed match situation prompt from live game state.
 * 
 * @param {Object} gameData
 * @param {Object} gameData.matchStats - Current match stats (ourScore, opponentScore, setNumber, pointHistory, etc.)
 * @param {number} gameData.rotation - Current rotation index (1..6)
 * @param {string} gameData.phase - 'serve' | 'receive'
 * @param {Array} gameData.roster - Array of all team players
 * @param {Object} gameData.courtLineup - Current zone assignments { pos1..pos6 }
 * @param {string} gameData.opponentName - Opponent team name
 * @param {string} gameData.customQuestion - Optional custom prompt or question from the coach
 * @returns {string} Fully formatted prompt for Gemini
 */
export function buildGameContextPrompt({
  matchStats = {},
  rotation = 1,
  phase = 'receive',
  roster = [],
  courtLineup = {},
  opponentName = 'Opponent',
  customQuestion = ''
}) {
  const safeCustomQuestion = typeof customQuestion === 'string' ? customQuestion.trim() : '';
  const ourScore = matchStats.ourScore || 0;
  const oppScore = matchStats.opponentScore || 0;
  const setNumber = matchStats.setNumber || 1;
  const ourSetsWon = matchStats.ourSetsWon || 0;
  const oppSetsWon = matchStats.opponentSetsWon || 0;
  const pointHistory = matchStats.pointHistory || [];
  const setHistory = matchStats.setHistory || [];

  // 1. Momentum & Scoring Streak
  const last6Points = pointHistory.slice(-6);
  let streakDescription = 'Game is evenly matched back-and-forth.';
  if (last6Points.length > 0) {
    let run = 0;
    const lastWinner = last6Points[last6Points.length - 1].pointWonBy;
    for (let i = last6Points.length - 1; i >= 0; i--) {
      if (last6Points[i].pointWonBy === lastWinner) run++;
      else break;
    }
    if (run >= 2) {
      streakDescription = lastWinner === 'us'
        ? `🔥 Momentum: Our team is surging on a ${run}-point run!`
        : `⚠️ Warning: ${opponentName} is currently on a ${run}-point scoring run.`;
    }
  }

  // 2. Score Gap & Pressure
  const scoreDiff = ourScore - oppScore;
  let pressureContext = 'Normal set flow.';
  if (ourScore >= 20 || oppScore >= 20) {
    pressureContext = Math.abs(scoreDiff) <= 2
      ? 'CRUNCH TIME: High-leverage end of set. Margin of error is razor thin.'
      : scoreDiff > 0 ? 'Closing out the set: Maintain focus and eliminate unforced errors.' : 'Must break serve immediately to avoid dropping the set.';
  } else if (scoreDiff <= -5) {
    pressureContext = `Trailing by ${Math.abs(scoreDiff)} points. Need a spark and disciplined side-out offense.`;
  } else if (scoreDiff >= 5) {
    pressureContext = `Leading by ${scoreDiff} points. Keep aggressive pressure on serve and avoid complacency.`;
  }

  // 3. Current On-Court Players & Server
  const getPlayer = (id) => roster.find(p => p.id === id);
  const onCourtDetails = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6'].map(zone => {
    const p = getPlayer(courtLineup[zone]);
    const label = ZONE_LABELS[zone]?.name || zone;
    const num = ZONE_LABELS[zone]?.num || zone;
    return p
      ? `Zone ${num} (${label}): #${p.number} ${p.name} [${p.position || 'Player'}]`
      : `Zone ${num} (${label}): Open`;
  }).join('\n');

  const server = getPlayer(courtLineup?.pos1);
  const serverInfo = phase === 'serve'
    ? `We are SERVING. Current server in Zone 1 is #${server?.number || '?'} ${server?.name || 'Server'} [${server?.position || 'Player'}].`
    : `We are on SERVE-RECEIVE. Our team must pass cleanly and side out on first ball contact.`;

  // 4. Match Stat Aggregations
  let totalKills = 0;
  let totalAces = 0;
  let totalBlocks = 0;
  let attackErrors = 0;
  let serveErrors = 0;
  let passErrors = 0;

  pointHistory.forEach(pt => {
    if (pt.pointWonBy === 'us') {
      if (pt.earnedType === 'kill') totalKills++;
      if (pt.earnedType === 'ace') totalAces++;
      if (pt.earnedType === 'block') totalBlocks++;
    } else {
      if (pt.errorCategory === 'Attack Errors' || pt.errorTypeId?.includes('attack')) attackErrors++;
      if (pt.errorCategory === 'Service Errors' || pt.errorTypeId?.includes('serve')) serveErrors++;
      if (pt.errorCategory === 'Passing & Receive Errors' || pt.errorTypeId?.includes('receive') || pt.errorTypeId === 'dropped_ball') passErrors++;
    }
  });

  const setSummary = setHistory.length > 0
    ? setHistory.map(s => `Set ${s.setNumber}: Us ${s.ourScore} - ${s.opponentScore} Opp`).join(' | ')
    : 'Set 1 in progress';

  return `
LIVE VOLLEYBALL MATCH DATA FOR HEAD COACH ADVISOR:
----------------------------------------------------
MATCH STATUS:
- Opponent: ${opponentName}
- Current Set: Set #${setNumber} (Match Sets: Us ${ourSetsWon} - ${oppSetsWon} Opponent)
- Previous Sets: ${setSummary}
- Score in Set #${setNumber}: Us ${ourScore} - ${oppScore} ${opponentName}
- Score Gap: ${scoreDiff > 0 ? `+${scoreDiff} (Lead)` : scoreDiff < 0 ? `${scoreDiff} (Deficit)` : 'Tied'}
- Game State: ${pressureContext}
- Momentum: ${streakDescription}

ROTATION & COURT SITUATION:
- Active Rotation: Rotation ${rotation} (R${rotation})
- Phase: ${phase.toUpperCase()} (${serverInfo})
- On-Court Lineup:
${onCourtDetails}

STATISTICAL BREAKDOWN IN CURRENT MATCH:
- Our Attack Kills: ${totalKills}
- Our Service Aces: ${totalAces}
- Our Block Kills: ${totalBlocks}
- Our Attack Errors: ${attackErrors}
- Our Missed Serves: ${serveErrors}
- Our Reception / Passing Errors: ${passErrors}
- Timeouts Remaining for Us: ${matchStats.ourTimeoutsRemaining !== undefined ? matchStats.ourTimeoutsRemaining : 2}
- Timeouts Remaining for Opponent: ${matchStats.opponentTimeoutsRemaining !== undefined ? matchStats.opponentTimeoutsRemaining : 2}

${safeCustomQuestion ? `COACH'S SPECIFIC INQUIRY / FOCUS:\n"${safeCustomQuestion}"\n` : ''}
`;
}

/**
 * Executes a call to Google Gemini to act as the team's Head Coach.
 * 
 * @param {Object} options
 * @param {Object} options.gameData - Parameters passed to buildGameContextPrompt
 * @param {string} [options.customQuestion] - Custom prompt/question
 * @param {string} [options.apiKey] - User-supplied or stored Gemini API Key
 * @param {string} [options.model] - 'gemini-1.5-flash' | 'gemini-2.0-flash'
 * @returns {Promise<{
 *   tacticalAdvice: string[],
 *   playerFocus: string[],
 *   motivationalSpeech: string,
 *   rawText: string,
 *   isSimulated: boolean
 * }>}
 */
export async function askGeminiHeadCoach({
  gameData = {},
  customQuestion = '',
  apiKey = null,
  model = 'gemini-1.5-flash',
  excludeSpeech = ''
}) {
  const safeQuestion = typeof customQuestion === 'string' ? customQuestion.trim() : '';
  const safeApiKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  const storedKey = storageService.getGeminiApiKey();
  const safeStoredKey = typeof storedKey === 'string' ? storedKey.trim() : '';
  const activeKey = safeApiKey || safeStoredKey;

  const promptContext = buildGameContextPrompt({ ...gameData, customQuestion: safeQuestion });

  const systemInstruction = `You are a legendary, championship-winning Volleyball Head Coach.
You are in the middle of a live competitive volleyball match, coaching from the sideline during a critical moment / timeout.

Your mission:
1. Deliver razor-sharp, actionable TACTICAL ADJUSTMENTS tailored specifically to the live score, rotation (R1-R6), and errors.
2. Direct specific players on court by name and position with precise technical cues (arm swing, platform angle, block timing, setter tempo).
3. Deliver an electric, high-energy MOTIVATIONAL PEP TALK that lights a fire under the team, builds unwavering confidence, and commands 100% effort.

Formatting Requirement:
Organize your response clearly with these three exact headers:
### 🎯 TACTICAL GAMEPLAN
(3-4 high-impact, specific bullet points on what to do tactically right now)

### 👥 ROTATION & PLAYER DIRECTIVES
(Directives addressing the specific players on court in this rotation)

### 🔥 HEAD COACH PEP TALK
(1-2 paragraphs of intense, motivating speech spoken directly to the team in the huddle)

Tone: Authoritative, energetic, inspiring, sharp, professional yet passionate. No generic clichés — make it feel like you are standing in the huddle with them right now.`;

  // If no API key configured, use local intelligent head coach generator
  if (!activeKey) {
    return generateLocalHeadCoachAdvice(gameData, safeQuestion, excludeSpeech);
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(activeKey)}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\n\n${promptContext}\n\nCoach, step in right now and give us your tactical gameplan and an entirely FRESH, newly composed huddle speech (different from previous timeouts, variation id: ${Date.now()}):`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1200
        }
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const message = errJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      console.warn('Gemini API call failed, falling back to local coach intelligence:', message);
      const fallback = generateLocalHeadCoachAdvice(gameData, safeQuestion, excludeSpeech);
      fallback.apiError = message;
      return fallback;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return generateLocalHeadCoachAdvice(gameData, customQuestion);
    }

    return parseGeminiCoachResponse(candidateText);

  } catch (error) {
    console.error('Gemini API Network Exception:', error);
    const fallback = generateLocalHeadCoachAdvice(gameData, customQuestion);
    fallback.apiError = error.message;
    return fallback;
  }
}

/**
 * Parses raw text from Gemini into structured sections.
 */
function parseGeminiCoachResponse(rawText) {
  const tactical = [];
  const playerFocus = [];
  let pepTalk = '';

  const sections = rawText.split(/###\s+/);

  sections.forEach(sec => {
    const lower = sec.toLowerCase();
    if (lower.includes('tactical')) {
      const lines = sec.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*') || /^\d+\./.test(l.trim()));
      lines.forEach(l => {
        tactical.push(l.replace(/^[-*•\d.]+\s*/, '').trim());
      });
    } else if (lower.includes('player') || lower.includes('rotation')) {
      const lines = sec.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*') || /^\d+\./.test(l.trim()));
      lines.forEach(l => {
        playerFocus.push(l.replace(/^[-*•\d.]+\s*/, '').trim());
      });
    } else if (lower.includes('pep') || lower.includes('talk') || lower.includes('motivation')) {
      const bodyLines = sec.split('\n').slice(1).join('\n').trim();
      pepTalk = bodyLines || sec.trim();
    }
  });

  // Fallbacks if formatting differed
  if (tactical.length === 0) {
    tactical.push('Communicate seams early and aggressively swing high off the hands.');
    tactical.push('Drop platforms early on serve-receive and aim for the 10-foot line.');
  }

  if (!pepTalk) {
    pepTalk = rawText.slice(0, 300);
  }

  return {
    tacticalAdvice: tactical,
    playerFocus: playerFocus.length > 0 ? playerFocus : ['Passers: Form platform early.', 'Hitters: Fast four-step approach.'],
    motivationalSpeech: pepTalk,
    rawText,
    isSimulated: false
  };
}

let lastSpeechIndex = -1;

export const HUDDLE_SPEECHES = {
  crunchTime: [
    `"Look at me. This is why we practice 6 days a week! We live for these pressure points! Take a deep breath, trust your training, and trust the player standing next to you. No hesitation, no fear of mistakes — we attack this next point together on three! 1, 2, 3, FIGHT!"`,
    `"Game time! Championship volleyball comes down to discipline in the 20s. First ball side-out. High hands at the net, crisp platform in the back, and let's swing aggressive. Don't play not to lose — play to WIN!"`,
    `"Every rep in the gym, every early morning sprint was for this exact moment. Lock eyes, demand the ball, and execute your assignment. No one hesitates. We finish this together!"`,
    `"Composure and courage. That's what wins sets right here. Serve tough to their deep corner, set your feet on defense, and put the ball away with authority. Look at each other, believe, and let's take it!"`,
    `"This is where mental toughness wins the match. Block out the crowd, block out the score. Focus on your contact point and your footwork. One point at a time. Let's go!"`
  ],
  trailing: [
    `"Listen to me: they didn't win this match, we gave them easy points. That stops RIGHT NOW. It's one pass, one clean set, one violent swing. We chip away point by point. Eyes up, chest out, let's go take our momentum back!"`,
    `"Breathe. Reset your minds. Look around this huddle — every single one of you has fought back from bigger deficits than this. Don't look at the scoreboard, look at the ball. Win the first contact, trust the pass, and put all the pressure back on their side of the net. Let's go!"`,
    `"Adversity is where champions are made! They think they have us on our heels. Prove them wrong right now! Be vocal, communicate on the seams, and play with absolute fearless conviction. One side-out, right here, right now!"`,
    `"Stop overthinking! When we play free and aggressive, nobody can touch us. I want louder calls, deeper coverage, and full commitment on every single approach. Put the errors in the rearview mirror and fight for the next point!"`,
    `"This set is far from over. All it takes is one great dig, one emphatic kill to flip the momentum. Bring the noise, celebrate each other, and show them what this team is made of!"`
  ],
  leading: [
    `"We have them on their heels, but great teams don't just win — they put their foot on the gas! Stay relentless. Do not give them a single free ball. Every touch must have purpose. Stay hungry, stay locked in, finish this set!"`,
    `"Keep the pressure on! Do not let up for even half a second. They are waiting for us to make errors — don't give them anything cheap. Serve aggressively, seal the line, and shut the door right now!"`,
    `"Celebrate the points, but stay completely locked into the next whistle. Great teams finish with relentless precision. Talk early, transition fast, and let's bury this set!"`,
    `"We dictated the tempo all set, and we are not slowing down now. Keep your platforms solid, swing high off the hands, and finish with authority!"`
  ],
  general: [
    `"We are right here! Match their energy and raise the standard. Be vocal, cover your hitters, and celebrate every single hustle play. Bring the energy, play for each other, and execute!"`,
    `"Trust the system! Every pass doesn't have to be perfect — make it workable and let our hitters do damage. Floor defenders, stay low and hungry. Let's win this transition rally!"`,
    `"Who wants this ball more? Look at their eyes across the net — they're tired! This is our moment to outwork them, out-hustle them, and out-compete them on every single touch!"`,
    `"Energy is a choice, team! Pump each other up, scream for the ball, and fly around the floor. When we play with joy and fire, we are unstoppable!"`,
    `"Communication is our superpower! Call the ball loud, call the seams early, and call the hitter's tendencies. Six players moving as one heartbeat. Let's go get this point!"`
  ]
};

export function getRandomHuddleSpeech(gameData = {}, excludeSpeech = '') {
  const { matchStats = {} } = gameData;
  const ourScore = matchStats.ourScore || 0;
  const oppScore = matchStats.opponentScore || 0;
  const isTrailing = ourScore < oppScore;
  const isLeading = ourScore > oppScore;
  const isCrunchTime = ourScore >= 20 || oppScore >= 20;

  let pool;
  if (isCrunchTime) {
    pool = [...HUDDLE_SPEECHES.crunchTime, ...HUDDLE_SPEECHES.trailing];
  } else if (isTrailing) {
    pool = [...HUDDLE_SPEECHES.trailing, ...HUDDLE_SPEECHES.general];
  } else if (isLeading) {
    pool = [...HUDDLE_SPEECHES.leading, ...HUDDLE_SPEECHES.general];
  } else {
    pool = [...HUDDLE_SPEECHES.general, ...HUDDLE_SPEECHES.trailing];
  }

  const cleanExclude = typeof excludeSpeech === 'string' ? excludeSpeech.trim() : '';
  const available = pool.filter(s => s.trim() !== cleanExclude);
  const candidates = available.length > 0 ? available : pool;
  
  let idx = Math.floor(Math.random() * candidates.length);
  if (idx === lastSpeechIndex && candidates.length > 1) {
    idx = (idx + 1) % candidates.length;
  }
  lastSpeechIndex = idx;
  return candidates[idx];
}

/**
 * Generates an instant, highly realistic Head Coach tactical breakdown and motivation
 * when an API key is not configured or network request fails.
 */
export function generateLocalHeadCoachAdvice(gameData = {}, customQuestion = '', excludeSpeech = '') {
  const safeQuestion = typeof customQuestion === 'string' ? customQuestion.trim() : '';
  const { matchStats = {}, rotation = 1, phase = 'receive', opponentName = 'Opponent', roster = [], courtLineup = {} } = gameData;

  const getPlayer = (id) => roster.find(p => p.id === id);
  const setter = getPlayer(courtLineup.pos1) || getPlayer(courtLineup.pos4) || { name: 'Setter', number: 'S' };
  const oh1 = getPlayer(courtLineup.pos2) || { name: 'Outside', number: 'OH' };
  const middle = getPlayer(courtLineup.pos3) || { name: 'Middle', number: 'MB' };
  const libero = roster.find(p => p.position === 'Libero' || p.isLibero) || { name: 'Libero', number: 'L' };

  const tacticalAdvice = [];
  const playerFocus = [];

  if (phase === 'receive') {
    tacticalAdvice.push(`Side-out priority in Rotation ${rotation}: Call the seam early! Let ${libero.name} take ownership of the deep float seams and keep the ball 3 feet off the net.`);
    tacticalAdvice.push(`Set Distribution: ${setter.name}, establish ${middle.name} on the quick 1 if the pass is on target. If forced off the net, push a high ball out to ${oh1.name} to swing deep cross-court.`);
    tacticalAdvice.push(`Coverage: Every hitter swings with 3 teammates inside the 10-foot line in low athletic stance to pick up block deflections.`);
  } else {
    tacticalAdvice.push(`Aggressive Serve Strategy: Step back, strike through ball center, and target their deep corners or the seam between their passers to keep ${opponentName} out of system.`);
    tacticalAdvice.push(`Block Setup: Front-row blockers, seal the net! Do not reach over early; read the setter's hands, press high over the tape, and penetrate into their court.`);
    tacticalAdvice.push(`Transition Defense: Floor defenders, stay on the balls of your feet and dig high to the center of the court.`);
  }

  playerFocus.push(`#${setter.number} ${setter.name}: Make decisive, crisp sets. Give our hitters room to swing and don't hesitate to dump on tight passes.`);
  playerFocus.push(`#${oh1.number} ${oh1.name}: Attack high off the hands. If the block is closed, tool off the outside hand or tip into the campfire donut.`);
  playerFocus.push(`#${libero.number} ${libero.name}: Be the loudest voice in the gym. Command the back row and freeze your platform through contact.`);

  const motivationalSpeech = getRandomHuddleSpeech(gameData, excludeSpeech);

  if (safeQuestion) {
    tacticalAdvice.unshift(`Regarding "${safeQuestion}": Focus on discipline over power. Make them earn every ball and win the transition rallies.`);
  }

  return {
    tacticalAdvice,
    playerFocus,
    motivationalSpeech,
    rawText: `${tacticalAdvice.join('\n')}\n\n${motivationalSpeech}`,
    isSimulated: true
  };
}
