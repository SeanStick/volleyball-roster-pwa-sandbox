import {
  computeErrorRankings,
  computeCategoryBreakdown,
  computePlayerStats,
  computeRotationPerformance,
  computeHistoricalAverages,
  generateTacticalSuggestions,
  ERROR_CATEGORIES,
  VOLLEYBALL_ERRORS
} from '../src/services/matchStatsService.js';
import { SAMPLE_MATCH_HISTORY, INITIAL_SAMPLE_ROSTER } from '../src/services/storageService.js';

console.log('🧠 Running Comprehensive Tactical Coaching & Match Analysis Test Suite...\n');

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

// ----------------------------------------------------------------------------
// Test 1: Rotation Performance Engine (R1 - R6)
// ----------------------------------------------------------------------------
console.log('--- Test Suite 1: Rotation Performance & Side-Out Analytics ---');
const samplePoints = [
  { id: 'p1', setNumber: 1, rotation: 1, phase: 'serve', pointWonBy: 'us', earnedType: 'ace', earnedPlayerId: 'p-1' },
  { id: 'p2', setNumber: 1, rotation: 1, phase: 'serve', pointWonBy: 'opponent', errorTypeId: 'missed_serve_net', errorPlayerId: 'p-1' },
  { id: 'p3', setNumber: 1, rotation: 2, phase: 'receive', pointWonBy: 'us', earnedType: 'kill', earnedPlayerId: 'p-2' },
  { id: 'p4', setNumber: 1, rotation: 3, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'receive_ace_against', errorPlayerId: 'p-7' },
  { id: 'p5', setNumber: 1, rotation: 3, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'receive_ace_against', errorPlayerId: 'p-7' },
  { id: 'p6', setNumber: 1, rotation: 4, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'attack_net', errorPlayerId: 'p-2' },
  { id: 'p7', setNumber: 1, rotation: 4, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'attack_net', errorPlayerId: 'p-2' },
  { id: 'p8', setNumber: 1, rotation: 4, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'attack_blocked', errorPlayerId: 'p-6' }
];

const rotStats = computeRotationPerformance(samplePoints);
assert(rotStats.length === 6, 'Exactly 6 rotations are calculated');
assert(rotStats[0].rotation === 1 && rotStats[0].servePointsWon === 1, 'Rotation 1 tracked 1 serve point won');
assert(rotStats[1].rotation === 2 && rotStats[1].sideOutPercentage === 100, 'Rotation 2 has 100% side-out rate');
assert(rotStats[2].rotation === 3 && rotStats[2].netDifferential === -2, 'Rotation 3 has -2 net differential');
assert(rotStats[3].rotation === 4 && rotStats[3].errorCount === 3, 'Rotation 4 has 3 error count');
assert(rotStats[3].topError && rotStats[3].topError.errorTypeId === 'attack_net', 'Rotation 4 top error identified as attack_net');

// ----------------------------------------------------------------------------
// Test 2: Historical Multi-Game Averages Engine
// ----------------------------------------------------------------------------
console.log('\n--- Test Suite 2: Multi-Match Historical Averages ---');
const histAvg = computeHistoricalAverages(SAMPLE_MATCH_HISTORY, INITIAL_SAMPLE_ROSTER);
assert(histAvg.totalMatches === 2, '2 historical matches recognized');
assert(histAvg.matchesWon === 1, '1 historical match won (50% win rate)');
assert(histAvg.winRate === 50, 'Win rate computed accurately');
assert(histAvg.totalSets === 6, 'Total sets summed across matches (3 + 3 = 6)');
assert(histAvg.avgErrorsPerSet > 0, 'Average errors per set computed');
assert(histAvg.recurrentWeakRotations.length === 6, 'All 6 rotations ranked historically');

// ----------------------------------------------------------------------------
// Test 3: Tactical Suggestions Engine — Serve Receive Breakdown
// ----------------------------------------------------------------------------
console.log('\n--- Test Suite 3: Tactical Suggestions — Serve Receive & DS Subs ---');
const matchWithPassErrors = {
  setNumber: 1,
  ourScore: 10,
  opponentScore: 14,
  pointHistory: [
    { id: 'pt-1', setNumber: 1, rotation: 3, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'receive_ace_against', errorPlayerId: 'p-7', errorCategory: 'Passing & Receive Errors' },
    { id: 'pt-2', setNumber: 1, rotation: 3, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'overpass_kill', errorPlayerId: 'p-7', errorCategory: 'Passing & Receive Errors' },
    { id: 'pt-3', setNumber: 1, rotation: 3, phase: 'receive', pointWonBy: 'opponent', errorTypeId: 'receive_ace_against', errorPlayerId: 'p-7', errorCategory: 'Passing & Receive Errors' }
  ]
};

const passSuggestions = generateTacticalSuggestions({
  currentMatch: matchWithPassErrors,
  matchHistory: SAMPLE_MATCH_HISTORY,
  roster: INITIAL_SAMPLE_ROSTER
});

const receiveSug = passSuggestions.find(s => s.category === 'Serve Receive');
assert(receiveSug !== undefined, 'Serve receive suggestion generated');
assert(receiveSug.priority === 'critical', '3 receive errors flagged as critical priority');
assert(receiveSug.title.includes('Aliza Jackson'), 'Pinpoints Aliza Jackson (#2) as primary passer needing support');
assert(receiveSug.ruleReference.includes('Rule 15.6') || receiveSug.ruleReference.includes('Rule 9.2'), 'Cites Rule 15.6 / 9.2');

// ----------------------------------------------------------------------------
// Test 4: Tactical Suggestions Engine — 3+ Point Opponent Scoring Run Timeout
// ----------------------------------------------------------------------------
console.log('\n--- Test Suite 4: Tactical Suggestions — Rule 15.4 Timeout Trigger ---');
const matchWithRun = {
  setNumber: 1,
  ourScore: 18,
  opponentScore: 21,
  pointHistory: [
    { id: 'pt-a', setNumber: 1, pointWonBy: 'us', earnedType: 'kill' },
    { id: 'pt-b', setNumber: 1, pointWonBy: 'opponent', errorTypeId: 'attack_net' },
    { id: 'pt-c', setNumber: 1, pointWonBy: 'opponent', errorTypeId: 'attack_out' },
    { id: 'pt-d', setNumber: 1, pointWonBy: 'opponent', errorTypeId: 'missed_serve_net' }
  ]
};

const runSuggestions = generateTacticalSuggestions({
  currentMatch: matchWithRun,
  matchHistory: SAMPLE_MATCH_HISTORY,
  roster: INITIAL_SAMPLE_ROSTER
});

const timeoutSug = runSuggestions.find(s => s.type === 'timeout');
assert(timeoutSug !== undefined, 'Opponent 3-0 run triggered tactical timeout recommendation');
assert(timeoutSug.ruleReference.includes('Rule 15.4'), 'Cites USAV Rule 15.4 for timeouts');

// ----------------------------------------------------------------------------
// Test 5: Tactical Suggestions Engine — 6-2 Setter Depth & 3-Hitter Distribution
// ----------------------------------------------------------------------------
console.log('\n--- Test Suite 5: Tactical Suggestions — 6-2 Offensive System ---');
const matchWithAttackErrors = {
  setNumber: 1,
  ourScore: 12,
  opponentScore: 15,
  pointHistory: [
    { id: 'pt-h1', setNumber: 1, pointWonBy: 'opponent', errorTypeId: 'attack_blocked', errorPlayerId: 'p-2', errorCategory: 'Attack Errors' },
    { id: 'pt-h2', setNumber: 1, pointWonBy: 'opponent', errorTypeId: 'attack_blocked', errorPlayerId: 'p-2', errorCategory: 'Attack Errors' },
    { id: 'pt-h3', setNumber: 1, pointWonBy: 'opponent', errorTypeId: 'attack_net', errorPlayerId: 'p-2', errorCategory: 'Attack Errors' }
  ]
};

const attackSuggestions = generateTacticalSuggestions({
  currentMatch: matchWithAttackErrors,
  matchHistory: SAMPLE_MATCH_HISTORY,
  roster: INITIAL_SAMPLE_ROSTER
});

const attackSug = attackSuggestions.find(s => s.category.includes('Attack'));
assert(attackSug !== undefined, '6-2 Attack strategy suggestion generated');
assert(attackSug.recommendation.includes('6-2') || attackSug.recommendation.includes('Middle quicks') || attackSug.recommendation.includes('off the net'), 'Advises setter depth and 3-hitter front-row spread');

console.log('\n=============================================');
console.log(`Test Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('=============================================\n');
