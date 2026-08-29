import { storageService } from '../src/services/storageService.js';

console.log('🔄 Testing Active Tab Persistence on Refresh...\n');

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

// Setup simple mock for localStorage in node environment if needed
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

// 1. Initial tab defaults to 'roster'
localStorage.clear();
assert(storageService.getActiveTab() === 'roster', 'Default initial tab is "roster"');

// 2. Save 'stats' tab and retrieve
storageService.saveActiveTab('stats');
assert(storageService.getActiveTab() === 'stats', 'Retrieved "stats" tab after refresh/reload');

// 3. Save 'formations' tab and retrieve
storageService.saveActiveTab('formations');
assert(storageService.getActiveTab() === 'formations', 'Retrieved "formations" tab after refresh/reload');

// 4. Save 'court' tab and retrieve
storageService.saveActiveTab('court');
assert(storageService.getActiveTab() === 'court', 'Retrieved "court" tab after refresh/reload');

// 5. Invalid tab name is rejected and falls back safely to 'roster'
storageService.saveActiveTab('invalid_unknown_tab');
assert(storageService.getActiveTab() === 'court', 'Invalid tab was ignored and previous valid tab preserved');

console.log('\n=============================================');
console.log(`Test Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('=============================================\n');
