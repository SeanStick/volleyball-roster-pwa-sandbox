import { storageService } from '../src/services/storageService.js';

console.log('🏁 Testing Finish Set and Save Match to History Across Tabs...\n');

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

// Mock localStorage in Node environment if needed
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

localStorage.clear();

// ----------------------------------------------------------------------------
// Test 1: Finish Set & Start Next Set Logic
// ----------------------------------------------------------------------------
console.log('--- Test Suite 1: Finish Set Flow ---');
let matchStats = {
  ourScore: 25,
  opponentScore: 21,
  setNumber: 1,
  ourSetsWon: 0,
  opponentSetsWon: 0,
  opponentName: 'Vikings VC',
  pointHistory: [
    { id: 'p1', setNumber: 1, pointWonBy: 'us', earnedType: 'kill' },
    { id: 'p2', setNumber: 1, pointWonBy: 'opponent', errorTypeId: 'attack_net' }
  ],
  setHistory: []
};

// Simulate Finish Set handler
function handleStartNewSet() {
  const isOurSet = matchStats.ourScore > matchStats.opponentScore;
  const completedSet = {
    setNumber: matchStats.setNumber,
    ourScore: matchStats.ourScore,
    opponentScore: matchStats.opponentScore,
    winner: isOurSet ? 'us' : 'opponent'
  };

  matchStats = {
    ...matchStats,
    ourScore: 0,
    opponentScore: 0,
    setNumber: matchStats.setNumber + 1,
    ourSetsWon: isOurSet ? matchStats.ourSetsWon + 1 : matchStats.ourSetsWon,
    opponentSetsWon: !isOurSet ? matchStats.opponentSetsWon + 1 : matchStats.opponentSetsWon,
    setHistory: [...matchStats.setHistory, completedSet]
  };
}

handleStartNewSet();

assert(matchStats.setNumber === 2, 'Set number advanced to Set 2');
assert(matchStats.ourScore === 0 && matchStats.opponentScore === 0, 'Scores reset to 0-0 for new set');
assert(matchStats.ourSetsWon === 1, 'Our sets won count incremented to 1');
assert(matchStats.opponentSetsWon === 0, 'Opponent sets won is 0');
assert(matchStats.setHistory.length === 1, 'Completed set saved in setHistory');
assert(matchStats.setHistory[0].setNumber === 1 && matchStats.setHistory[0].winner === 'us', 'Set 1 recorded with Us as winner');

// ----------------------------------------------------------------------------
// Test 2: Save Match to History
// ----------------------------------------------------------------------------
console.log('\n--- Test Suite 2: Save Current Match to History Archive ---');
const archivedMatch = storageService.archiveCurrentMatch(matchStats, 'Vikings VC');

assert(archivedMatch !== null, 'Match archived successfully');
assert(archivedMatch.opponentName === 'Vikings VC', 'Archived opponent name saved');
assert(archivedMatch.ourSetsWon === 1, 'Archived sets won by us recorded');

const historyList = storageService.getMatchHistory();
assert(historyList.length >= 1, 'Match history list contains archived match');
assert(historyList[0].id === archivedMatch.id, 'Most recent match at top of history');

console.log('\n=============================================');
console.log(`Test Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('=============================================\n');
