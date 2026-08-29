import {
  rotateLineupClockwise,
  checkLineupFrontRowLiberoViolation
} from '../src/services/volleyballRules.js';
import { INITIAL_SAMPLE_ROSTER } from '../src/services/storageService.js';

console.log('🏐 Testing Side-Out & Serve/Receive Score Tracking Resolution Engine...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// Initial 6-2 Test Lineup
const testLineup = {
  pos1: 'p-1', // S1 (Setter 1)
  pos2: 'p-2', // OH1 (Outside 1)
  pos3: 'p-3', // MB1 (Middle 1)
  pos4: 'p-6', // S2 / RS2 (Setter 2 / Right Side 2)
  pos5: 'p-7', // OH2 (Outside 2)
  pos6: 'p-4'  // Libero (replaces MB2 in Zone 6)
};

// ----------------------------------------------------------------------------
// Test 1: Serve Receive Phase -> Side-Out Won (+1 Us)
// ----------------------------------------------------------------------------
console.log('--- Test Suite 1: Serve Receive -> Side-Out Won (+1 Us & Rotate) ---');
let currentScore = { ourScore: 10, opponentScore: 8, setNumber: 1, pointHistory: [] };
let activePhase = 'receive';
let activeRotation = 1;
let activeLineup = { ...testLineup };

function simulateRallyWonByUs(pointDetails) {
  const newPoint = {
    id: `pt-${Date.now()}`,
    pointWonBy: 'us',
    rotation: activeRotation,
    phase: activePhase,
    setNumber: currentScore.setNumber,
    ...pointDetails
  };

  currentScore = {
    ...currentScore,
    ourScore: currentScore.ourScore + 1,
    pointHistory: [...currentScore.pointHistory, newPoint]
  };

  if (activePhase === 'receive') {
    activeRotation = activeRotation === 6 ? 1 : activeRotation + 1;
    let nextLineup = rotateLineupClockwise(activeLineup);
    const violation = checkLineupFrontRowLiberoViolation(nextLineup, INITIAL_SAMPLE_ROSTER, {});
    if (violation.hasViolation && violation.replacedPlayer) {
      nextLineup[violation.zoneKey] = violation.replacedPlayer.id;
    }
    activeLineup = nextLineup;
    activePhase = 'serve';
  }
}

// Execute side-out won via Kill by Gracyn (#14)
simulateRallyWonByUs({
  earnedType: 'kill',
  earnedPlayerId: 'p-2',
  earnedPlayerName: 'Gracyn Brandt',
  earnedPlayerNumber: 14
});

assert(currentScore.ourScore === 11, 'Our score incremented from 10 to 11');
assert(activePhase === 'serve', 'Phase successfully switched from receive to serve');
assert(activeRotation === 2, 'Rotation successfully advanced clockwise from R1 to R2');
assert(activeLineup.pos1 === 'p-2', 'Zone 1 server is now OH1 Gracyn Brandt');
assert(currentScore.pointHistory.length === 1, 'Point event logged in point history');
assert(currentScore.pointHistory[0].earnedType === 'kill', 'Earned kill recorded on side-out');

// ----------------------------------------------------------------------------
// Test 2: Serving Phase -> Lost Serve / Side-Out to Opponent (+1 Opponent)
// ----------------------------------------------------------------------------
console.log('\n--- Test Suite 2: Serving -> Side-Out to Opponent (+1 Opp & Switch to Receive) ---');

function simulateRallyWonByOpponent(pointDetails) {
  const newPoint = {
    id: `pt-${Date.now()}`,
    pointWonBy: 'opponent',
    rotation: activeRotation,
    phase: activePhase,
    setNumber: currentScore.setNumber,
    ...pointDetails
  };

  currentScore = {
    ...currentScore,
    opponentScore: currentScore.opponentScore + 1,
    pointHistory: [...currentScore.pointHistory, newPoint]
  };

  if (activePhase === 'serve') {
    activePhase = 'receive'; // Switch to receive in same rotation
  }
}

// Execute side-out to opponent via Missed Serve in Net
simulateRallyWonByOpponent({
  errorTypeId: 'missed_serve_net',
  errorTypeName: 'Missed Serve (Into Net)',
  errorPlayerId: 'p-2',
  errorPlayerName: 'Gracyn Brandt',
  errorPlayerNumber: 14
});

assert(currentScore.opponentScore === 9, 'Opponent score incremented from 8 to 9');
assert(activePhase === 'receive', 'Phase switched to receive upon lost serve');
assert(activeRotation === 2, 'Rotation stays in Rotation 2 while receiving');
assert(currentScore.pointHistory.length === 2, 'Second point logged');
assert(currentScore.pointHistory[1].errorTypeId === 'missed_serve_net', 'Missed serve error logged');

// ----------------------------------------------------------------------------
// Test 3: Serving Phase -> Point Won on Serve (+1 Us & Keep Serving)
// ----------------------------------------------------------------------------
console.log('\n--- Test Suite 3: Serving -> Point Won (+1 Us & Keep Serving) ---');
activePhase = 'serve';

simulateRallyWonByUs({
  earnedType: 'ace',
  earnedPlayerId: 'p-2',
  earnedPlayerName: 'Gracyn Brandt',
  earnedPlayerNumber: 14
});

assert(currentScore.ourScore === 12, 'Our score incremented from 11 to 12');
assert(activePhase === 'serve', 'Phase remains on serve (team continues serving)');
assert(activeRotation === 2, 'Rotation remains on R2');
assert(currentScore.pointHistory.length === 3, 'Ace logged in history');

console.log('\n=============================================');
console.log(`Test Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('=============================================\n');
