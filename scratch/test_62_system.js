import {
  validate62Formation,
  generate62LineupForServeState,
  detect62SubstitutionOpportunities,
  deriveLineupForRotation
} from '../src/services/volleyballRules.js';
import { FORMATIONS_62_DATA } from '../src/services/formations62Data.js';
import { FORMATION_ANIMATIONS } from '../src/services/formationAnimationsData.js';

console.log('🏐 Running Comprehensive 6-2 Volleyball System Test Suite...\n');

const mockRoster = [
  { id: 'p1', number: 1, name: 'Karch Kiraly', position: 'Setter', isStarter: true },
  { id: 'p2', number: 2, name: 'Jordan Larson', position: 'Outside Hitter', isStarter: true },
  { id: 'p3', number: 3, name: 'Foluke Akinradewo', position: 'Middle Blocker', isStarter: true },
  { id: 'p4', number: 4, name: 'Micah Christenson', position: 'Setter', isStarter: true },
  { id: 'p5', number: 5, name: 'Logan Tom', position: 'Outside Hitter', isStarter: true },
  { id: 'p6', number: 6, name: 'Justine Wong-Orantes', position: 'Libero', isStarter: true, isLibero: true },
  { id: 'p7', number: 7, name: 'Matt Anderson', position: 'Opposite Hitter', isStarter: false },
  { id: 'p8', number: 8, name: 'David Lee', position: 'Middle Blocker', isStarter: false }
];

let testsPassed = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// TEST SUITE 1: 6-2 Formations Data Integrity
console.log('--- Suite 1: FORMATIONS_62_DATA & 3-Hitter Active Check ---');
for (let r = 1; r <= 6; r++) {
  const rotData = FORMATIONS_62_DATA[r];
  assert(Boolean(rotData), `Rotation ${r} data exists`);
  assert(Boolean(rotData.receiving) && Boolean(rotData.serving), `Rotation ${r} has both receiving and serving data`);
  
  const recPositions = Object.values(rotData.receiving.positions);
  assert(recPositions.length === 6, `Rotation ${r} receive has 6 player positions`);
  
  // Verify back-row setter and 3 front-row hitters
  assert(rotData.setterPosition.includes('Zone'), `Rotation ${r} documents setter position: ${rotData.setterPosition}`);
  assert(rotData.frontRowAttackers.length === 3, `Rotation ${r} has exactly 3 active front-row hitters (${rotData.frontRowAttackers.join(', ')})`);
  assert(rotData.activeSetter.includes('Setter'), `Rotation ${r} documents active back-row setter: ${rotData.activeSetter}`);
}

// TEST SUITE 2: 6-2 Animations Data Integrity
console.log('\n--- Suite 2: FORMATION_ANIMATIONS 5-Stage Multi-Phase Check ---');
for (let r = 1; r <= 6; r++) {
  const animRot = FORMATION_ANIMATIONS[r];
  assert(Boolean(animRot), `Animation Rotation ${r} exists`);
  assert(animRot.receiving.stages.length >= 4, `Animation R${r} Receive has at least 4 stages`);
  assert(animRot.serving.stages.length >= 4, `Animation R${r} Serve has at least 4 stages`);
}

// TEST SUITE 3: 6-2 Formation Validation & Diagonal Pairs
console.log('\n--- Suite 3: 6-2 Lineup Validation & Pairings ---');
const legal62Lineup = {
  pos1: 'p1', // S1
  pos2: 'p2', // OH1
  pos3: 'p3', // MB1
  pos4: 'p4', // S2 (opposite S1)
  pos5: 'p5', // OH2 (opposite OH1)
  pos6: 'p6'  // Libero (opposite MB1)
};

const validation = validate62Formation(legal62Lineup, mockRoster);
assert(validation.isValid62 === true, 'Legal 6-2 lineup is valid');
assert(validation.issues.length === 0, 'No issues reported for textbook 6-2');
assert(validation.pairsSummary.setterOpposite !== null, 'Setter pair recognized');

// Mismatched Lineup Check
const mismatchedLineup = {
  pos1: 'p1', // S1
  pos2: 'p4', // S2 (adjacent, not opposite!)
  pos3: 'p3', // MB1
  pos4: 'p2', // OH1 (opposite S1!)
  pos5: 'p5', // OH2
  pos6: 'p6'  // Libero
};
const mismatchVal = validate62Formation(mismatchedLineup, mockRoster);
assert(mismatchVal.isValid62 === false, 'Mismatched lineup is flagged as invalid');
assert(mismatchVal.autoCorrectLineup.pos1 === 'p1' && mismatchVal.autoCorrectLineup.pos4 === 'p4', 'Auto-correct aligns S1 opposite S2 in Pos 1 & 4');

// TEST SUITE 4: Lineup Generation For Serve vs Receive
console.log('\n--- Suite 4: generate62LineupForServeState ---');
const serveLineup = generate62LineupForServeState(mockRoster, 'serve', 'p1');
assert(serveLineup.pos1 === 'p1', 'When serving first, S1 starts in Zone 1 (Server)');
assert(serveLineup.pos4 === 'p4', 'When serving first, S2 starts in Zone 4 (Opposite S1)');

const receiveLineup = generate62LineupForServeState(mockRoster, 'receive', 'p1');
assert(receiveLineup.pos2 === 'p1', 'When receiving first, S1 starts in Zone 2 to rotate to Zone 1 on 1st side-out (USAV 7.3.5.2)');
assert(receiveLineup.pos5 === 'p4', 'When receiving first, S2 starts in Zone 5 (opposite S1 in Zone 2)');

// TEST SUITE 5: 6-2 Substitution Opportunities
console.log('\n--- Suite 5: detect62SubstitutionOpportunities ---');
// Rotation 4: S1 is in Zone 4 (front row), S2 is on bench or in back row
const rot4Lineup = {
  pos1: 'p7', // Matt Anderson (Opposite Hitter / RS1 in back row)
  pos2: 'p5', // OH2
  pos3: 'p6', // Libero
  pos4: 'p1', // Karch Kiraly (Setter 1 in front row!)
  pos5: 'p2', // OH1
  pos6: 'p3'  // MB1
};
// Bench has Micah Christenson (Setter 2) and Matt Anderson (RS)
const subOpportunities = detect62SubstitutionOpportunities(rot4Lineup, 4, 'serve', mockRoster, [], { maxSubs: 12, enforcePositionLock: false });
const setterSubRec = subOpportunities.find(r => r.type === '62_setter_hitter_sub' || r.title.includes('6-2'));
assert(Boolean(setterSubRec), '6-2 Setter / Right Side substitution opportunity detected in Rotation 4');

// USAV 19.3.1.1: Verify Libero is never recommended for front-row zone
const frontRowLiberoRec = subOpportunities.find(r => r.incomingPlayer?.position === 'Libero' && ['pos4', 'pos3', 'pos2'].includes(r.targetZone));
assert(!frontRowLiberoRec, 'Strict USAV 19.3.1.1 Compliance: Libero is NEVER recommended for front-row zones');

console.log(`\n=============================================`);
console.log(`Test Results: ${testsPassed}/${totalTests} Passed (${Math.round((testsPassed / totalTests) * 100)}%)`);
console.log(`=============================================\n`);
