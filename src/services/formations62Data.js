/**
 * Official 6-2 Volleyball System Formations Data
 *
 * In a standard 6-2 offensive system (6 Hitters, 2 Setters):
 * - Two setters (S1 and S2) are positioned opposite each other in the rotation (e.g. Pos 1 and Pos 4).
 * - The setter in the BACK ROW always sets (penetrating to target between Zone 2 & 3).
 * - The front row ALWAYS has 3 attacking options:
 *     1. Outside Hitter (OH) - Left Front (Zone 4)
 *     2. Middle Blocker (MB) - Middle Front (Zone 3)
 *     3. Right Side / Opposite (RS/OPP) - Right Front (Zone 2)
 *
 * Starting Rotation 1 Lineup (Pos 1 through Pos 6):
 * - Pos 1: Setter 1 (S1) - Back Row Setter
 * - Pos 2: Outside Hitter 1 (OH1) - Front Row
 * - Pos 3: Middle Blocker 1 (MB1) - Front Row
 * - Pos 4: Setter 2 / Right Side 2 (S2/RS2) - Front Row Right Side Attacker
 * - Pos 5: Outside Hitter 2 (OH2) - Back Row
 * - Pos 6: Libero (L) / Middle Blocker 2 (MB2) - Back Row
 *
 * Rotations 1, 2, 3: S1 sets from back row (Zones 1, 6, 5). S2/RS2 attacks in front row.
 * Rotations 4, 5, 6: S2 sets from back row (Zones 1, 6, 5). S1/RS1 attacks in front row.
 */

export const FORMATIONS_62_DATA = {
  1: {
    rotation: 1,
    title: 'Rotation 1 (Setter 1 in Zone 1)',
    setterPosition: 'Zone 1 (Right Back)',
    activeSetter: 'Setter 1 (S1)',
    frontRowAttackers: ['Outside 1 (OH1)', 'Middle 1 (MB1)', 'Right Side 2 (RS2/S2)'],
    systemType: '6-2 (3 Front-Row Attackers)',
    receiving: {
      summary: 'Setter 1 (S1) is in Zone 1 (Right Back) and pushes up near the net behind OH1. 3 front-row hitters are ready (OH1, MB1, RS2). A 3-passer cup is formed by OH1, Libero, and OH2.',
      tactics: [
        { role: 'Setter 1 (S1)', desc: 'Back-Row Setter: Pushes up near Zone 2 right behind OH1. On serve contact, penetrates immediately to setting target at the net.' },
        { role: 'Outside 1 (OH1)', desc: 'Front-Row Left Hitter: Drops slightly to pass right seam in 3-passer cup, then transitions to left pin to attack.' },
        { role: 'Middle 1 (MB1)', desc: 'Front-Row Middle: Starts at net in Zone 3, ready for quick 1-ball or 31 attack.' },
        { role: 'Right Side 2 (RS2/S2)', desc: 'Front-Row Right Hitter: Starts in Zone 4, transitions to Right Front (Zone 2) to attack on the right pin.' },
        { role: 'Outside 2 (OH2)', desc: 'Back-Row Passer: Passes left seam in Zone 5.' },
        { role: 'Libero (L)', desc: 'Back-Row Passer: Passes middle seam in Zone 6, anchoring serve receive.' }
      ],
      overlapRules: 'S1 (Zone 1) must remain behind OH1 (Zone 2) and to the right of Libero (Zone 6) until the server contacts the ball.',
      positions: {
        S1:  { role: 'S1',  name: 'Setter 1',     x: 78, y: 46, zone: 1, isFront: false, isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1',    x: 74, y: 70, zone: 2, isFront: true,  isPasser: true, isHitter: true },
        MB1: { role: 'MB1', name: 'Middle 1',     x: 48, y: 15, zone: 3, isFront: true,  isHitter: true },
        RS2: { role: 'RS2', name: 'Right Side 2', x: 18, y: 24, zone: 4, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2',    x: 22, y: 72, zone: 5, isFront: false, isPasser: true },
        L:   { role: 'L',   name: 'Libero',       x: 48, y: 76, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 78, y: 46 }, to: { x: 68, y: 12 }, label: 'S1 Penetration to Target', color: '#38bdf8' },
        { from: { x: 18, y: 24 }, to: { x: 80, y: 18 }, label: 'RS2 Cross to Right Pin', color: '#f59e0b' }
      ]
    },
    serving: {
      summary: 'Setter 1 is serving at the baseline in Zone 1. Front row has 3 blockers and switches immediately: OH1 to Left Front (Z4), MB1 in Middle (Z3), RS2 to Right Front (Z2).',
      tactics: [
        { role: 'Setter 1 (S1)', desc: 'Serves from behind Zone 1 baseline, then enters court into base defense in Right Back (Zone 1).' },
        { role: 'Outside 1 (OH1)', desc: 'Switches from right to Left Front (Zone 4) to block and attack.' },
        { role: 'Middle 1 (MB1)', desc: 'Defends Middle Front (Zone 3), ready for read blocking.' },
        { role: 'Right Side 2 (RS2/S2)', desc: 'Switches from left to Right Front (Zone 2) to block opponent outside hitter and hit right pin.' },
        { role: 'Outside 2 (OH2)', desc: 'Defends Left Back (Zone 5) against cross-court attacks.' },
        { role: 'Libero (L)', desc: 'Defends Middle Back / Deep (Zone 6), reading tips and perimeter shots.' }
      ],
      overlapRules: 'No overlap restrictions after serve contact. All 3 front-row players switch to offensive base positions.',
      positions: {
        S1:  { role: 'S1',  name: 'Setter 1',     x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        OH1: { role: 'OH1', name: 'Outside 1',    x: 20, y: 16, zone: 2, isFront: true,  isHitter: true },
        MB1: { role: 'MB1', name: 'Middle 1',     x: 50, y: 16, zone: 3, isFront: true,  isHitter: true },
        RS2: { role: 'RS2', name: 'Right Side 2', x: 80, y: 16, zone: 4, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2',    x: 22, y: 72, zone: 5, isFront: false },
        L:   { role: 'L',   name: 'Libero',       x: 50, y: 74, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 80, y: 70 }, label: 'Enter to Base Defense', color: '#38bdf8' }
      ]
    }
  },

  2: {
    rotation: 2,
    title: 'Rotation 2 (Setter 1 in Zone 6)',
    setterPosition: 'Zone 6 (Middle Back)',
    activeSetter: 'Setter 1 (S1)',
    frontRowAttackers: ['Outside 2 (OH2)', 'Middle 1 (MB1)', 'Right Side 2 (RS2/S2)'],
    systemType: '6-2 (3 Front-Row Attackers)',
    receiving: {
      summary: 'Setter 1 is in Zone 6 (Middle Back) stacked behind MB1. 3 front-row attackers (OH2, MB1, RS2) ready. 3-passer cup formed by OH2, Libero, and OH1.',
      tactics: [
        { role: 'Setter 1 (S1)', desc: 'Back-Row Setter: Stacks closely behind MB1 in middle-back, sprints to setting target at right front (Zone 2/3 seam).' },
        { role: 'Outside 2 (OH2)', desc: 'Front-Row Left Hitter: Drops back on left side to pass, then transitions out to attack left pin.' },
        { role: 'Middle 1 (MB1)', desc: 'Front-Row Middle: Stays at net in Zone 2 to shield setter, then transitions into middle to run 1-ball.' },
        { role: 'Right Side 2 (RS2/S2)', desc: 'Front-Row Right Hitter: In Zone 3, transitions to right pin to attack.' },
        { role: 'Outside 1 (OH1)', desc: 'Back-Row Passer: Passes right seam in Zone 1.' },
        { role: 'Libero (L)', desc: 'Back-Row Passer: Passes middle seam in Zone 5.' }
      ],
      overlapRules: 'S1 (Zone 6) must remain behind MB1 (Zone 2) and between Libero (Zone 5) and OH1 (Zone 1) until serve contact.',
      positions: {
        OH1: { role: 'OH1', name: 'Outside 1',    x: 78, y: 72, zone: 1, isFront: false, isPasser: true },
        MB1: { role: 'MB1', name: 'Middle 1',     x: 64, y: 15, zone: 2, isFront: true,  isHitter: true },
        RS2: { role: 'RS2', name: 'Right Side 2', x: 36, y: 18, zone: 3, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2',    x: 20, y: 68, zone: 4, isFront: true,  isPasser: true, isHitter: true },
        L:   { role: 'L',   name: 'Libero',       x: 48, y: 74, zone: 5, isFront: false, isLibero: true },
        S1:  { role: 'S1',  name: 'Setter 1',     x: 62, y: 42, zone: 6, isFront: false, isSetter: true }
      },
      arrows: [
        { from: { x: 62, y: 42 }, to: { x: 68, y: 12 }, label: 'S1 Penetration', color: '#38bdf8' },
        { from: { x: 20, y: 68 }, to: { x: 15, y: 22 }, label: 'OH2 Approach', color: '#f59e0b' }
      ]
    },
    serving: {
      summary: 'Outside 1 is serving in Zone 1. Setter 1 is in Zone 6 and moves to Right Back base defense. 3 front-row hitters block and switch.',
      tactics: [
        { role: 'Outside 1 (OH1)', desc: 'Serves from Zone 1 baseline, then defends Left Back (Zone 5).' },
        { role: 'Middle 1 (MB1)', desc: 'Switches from right to Middle Front (Zone 3) to block.' },
        { role: 'Right Side 2 (RS2/S2)', desc: 'Switches from middle to Right Front (Zone 2) to block and attack.' },
        { role: 'Outside 2 (OH2)', desc: 'Defends and attacks Left Front (Zone 4).' },
        { role: 'Libero (L)', desc: 'Defends Middle Back (Zone 6).' },
        { role: 'Setter 1 (S1)', desc: 'Moves from Zone 6 to Right Back (Zone 1) base defense.' }
      ],
      overlapRules: 'Standard serving rules. Switch to base defense after ball is served.',
      positions: {
        OH1: { role: 'OH1', name: 'Outside 1',    x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        MB1: { role: 'MB1', name: 'Middle 1',     x: 50, y: 16, zone: 2, isFront: true,  isHitter: true },
        RS2: { role: 'RS2', name: 'Right Side 2', x: 80, y: 16, zone: 3, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2',    x: 20, y: 16, zone: 4, isFront: true,  isHitter: true },
        L:   { role: 'L',   name: 'Libero',       x: 50, y: 74, zone: 5, isFront: false, isLibero: true },
        S1:  { role: 'S1',  name: 'Setter 1',     x: 80, y: 70, zone: 6, isFront: false, isSetter: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 22, y: 72 }, label: 'OH1 to Left Back', color: '#f59e0b' }
      ]
    }
  },

  3: {
    rotation: 3,
    title: 'Rotation 3 (Setter 1 in Zone 5)',
    setterPosition: 'Zone 5 (Left Back)',
    activeSetter: 'Setter 1 (S1)',
    frontRowAttackers: ['Outside 2 (OH2)', 'Middle 1 (MB1)', 'Right Side 2 (RS2/S2)'],
    systemType: '6-2 (3 Front-Row Attackers)',
    receiving: {
      summary: 'Setter 1 is in Zone 5 (Left Back) pushing up behind OH2. 3 front-row attackers (OH2, MB1, RS2) ready. 3-passer cup formed by OH2, Libero, and OH1.',
      tactics: [
        { role: 'Setter 1 (S1)', desc: 'Back-Row Setter: Starts behind OH2 on left side, sprints across court to setting target at right front.' },
        { role: 'Outside 2 (OH2)', desc: 'Front-Row Left Hitter: Passes left seam in Zone 3/4, then approaches outside left pin.' },
        { role: 'Middle 1 (MB1)', desc: 'Front-Row Middle: Stays at net in Zone 4, approaches inside for quick 1-ball or slide.' },
        { role: 'Right Side 2 (RS2/S2)', desc: 'Front-Row Right Hitter: In Zone 2, stays ready to hit on right pin.' },
        { role: 'Libero (L)', desc: 'Back-Row Passer: Passes middle seam in Zone 6.' },
        { role: 'Outside 1 (OH1)', desc: 'Back-Row Passer: Passes right seam in Zone 1.' }
      ],
      overlapRules: 'S1 (Zone 5) must stay behind MB1 (Zone 4) and to the left of Libero (Zone 6) until serve contact.',
      positions: {
        MB2: { role: 'MB2', name: 'Middle 2',     x: 80, y: 74, zone: 1, isFront: false },
        RS2: { role: 'RS2', name: 'Right Side 2', x: 80, y: 16, zone: 2, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2',    x: 48, y: 68, zone: 3, isFront: true,  isPasser: true, isHitter: true },
        MB1: { role: 'MB1', name: 'Middle 1',     x: 20, y: 16, zone: 4, isFront: true,  isHitter: true },
        S1:  { role: 'S1',  name: 'Setter 1',     x: 20, y: 44, zone: 5, isFront: false, isSetter: true },
        L:   { role: 'L',   name: 'Libero',       x: 52, y: 76, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 20, y: 44 }, to: { x: 68, y: 12 }, label: 'S1 Long Sprint to Target', color: '#38bdf8' }
      ]
    },
    serving: {
      summary: 'Middle 1 (or Libero serving) serves from Zone 1. 3 front-row blockers in place (RS2 in Z2, MB1 in Z3, OH2 in Z4).',
      tactics: [
        { role: 'Middle 1 (MB1)', desc: 'Serves from Zone 1 baseline (or subbed for Libero if serving), then plays Middle Back defense.' },
        { role: 'Right Side 2 (RS2/S2)', desc: 'Blocks and attacks from Right Front (Zone 2).' },
        { role: 'Outside 2 (OH2)', desc: 'Blocks and attacks from Left Front (Zone 4).' },
        { role: 'Middle 2 (MB2)', desc: 'Blocks Middle Front (Zone 3).' },
        { role: 'Setter 1 (S1)', desc: 'Defends Right Back (Zone 1) base defense.' },
        { role: 'Libero (L)', desc: 'Defends Middle Back / Left Back.' }
      ],
      overlapRules: 'Standard serving rules.',
      positions: {
        MB1: { role: 'MB1', name: 'Middle 1',     x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        RS2: { role: 'RS2', name: 'Right Side 2', x: 80, y: 16, zone: 2, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2',    x: 20, y: 16, zone: 3, isFront: true,  isHitter: true },
        MB2: { role: 'MB2', name: 'Middle 2',     x: 50, y: 16, zone: 4, isFront: true,  isHitter: true },
        S1:  { role: 'S1',  name: 'Setter 1',     x: 80, y: 70, zone: 5, isFront: false, isSetter: true },
        L:   { role: 'L',   name: 'Libero',       x: 48, y: 74, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 50, y: 74 }, label: 'MB1 to Middle Back', color: '#f59e0b' }
      ]
    }
  },

  4: {
    rotation: 4,
    title: 'Rotation 4 (Setter 2 in Zone 1)',
    setterPosition: 'Zone 1 (Right Back)',
    activeSetter: 'Setter 2 (S2)',
    frontRowAttackers: ['Outside 2 (OH2)', 'Middle 2 (MB2)', 'Right Side 1 (RS1/S1)'],
    systemType: '6-2 (3 Front-Row Attackers)',
    receiving: {
      summary: 'Setter 2 (S2) is now in the back row in Zone 1 running the offense! S2 pushes up behind OH2. 3 front-row hitters ready (OH2, MB2, RS1). 3-passer cup formed by OH2, Libero, and OH1.',
      tactics: [
        { role: 'Setter 2 (S2)', desc: 'Back-Row Setter: Pushes up near Zone 2 right behind OH2. On serve contact, penetrates immediately to setting target at net.' },
        { role: 'Outside 2 (OH2)', desc: 'Front-Row Left Hitter: Drops slightly to pass right seam in 3-passer cup, then transitions to left pin to attack.' },
        { role: 'Middle 2 (MB2)', desc: 'Front-Row Middle: Starts at net in Zone 3, ready for quick 1-ball attack.' },
        { role: 'Right Side 1 (RS1/S1)', desc: 'Front-Row Right Hitter: Starts in Zone 4, transitions to Right Front (Zone 2) to attack on right pin.' },
        { role: 'Outside 1 (OH1)', desc: 'Back-Row Passer: Passes left seam in Zone 5.' },
        { role: 'Libero (L)', desc: 'Back-Row Passer: Passes middle seam in Zone 6.' }
      ],
      overlapRules: 'S2 (Zone 1) must remain behind OH2 (Zone 2) and to the right of Libero (Zone 6) until serve contact.',
      positions: {
        S2:  { role: 'S2',  name: 'Setter 2',     x: 78, y: 46, zone: 1, isFront: false, isSetter: true },
        OH2: { role: 'OH2', name: 'Outside 2',    x: 74, y: 70, zone: 2, isFront: true,  isPasser: true, isHitter: true },
        MB2: { role: 'MB2', name: 'Middle 2',     x: 48, y: 15, zone: 3, isFront: true,  isHitter: true },
        RS1: { role: 'RS1', name: 'Right Side 1', x: 18, y: 24, zone: 4, isFront: true,  isHitter: true },
        OH1: { role: 'OH1', name: 'Outside 1',    x: 22, y: 72, zone: 5, isFront: false, isPasser: true },
        L:   { role: 'L',   name: 'Libero',       x: 48, y: 76, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 78, y: 46 }, to: { x: 68, y: 12 }, label: 'S2 Penetration to Target', color: '#38bdf8' },
        { from: { x: 18, y: 24 }, to: { x: 80, y: 18 }, label: 'RS1 Cross to Right Pin', color: '#f59e0b' }
      ]
    },
    serving: {
      summary: 'Setter 2 is serving from Zone 1. 3 front-row blockers switch into base positions (OH2 to Z4, MB2 in Z3, RS1 in Z2).',
      tactics: [
        { role: 'Setter 2 (S2)', desc: 'Serves from behind Zone 1 baseline, then plays Right Back (Zone 1) base defense.' },
        { role: 'Outside 2 (OH2)', desc: 'Switches to Left Front (Zone 4) to block and attack.' },
        { role: 'Middle 2 (MB2)', desc: 'Defends Middle Front (Zone 3).' },
        { role: 'Right Side 1 (RS1/S1)', desc: 'Switches to Right Front (Zone 2) to block and attack.' },
        { role: 'Outside 1 (OH1)', desc: 'Defends Left Back (Zone 5).' },
        { role: 'Libero (L)', desc: 'Defends Middle Back (Zone 6).' }
      ],
      overlapRules: 'Standard serving rules.',
      positions: {
        S2:  { role: 'S2',  name: 'Setter 2',     x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        OH2: { role: 'OH2', name: 'Outside 2',    x: 20, y: 16, zone: 2, isFront: true,  isHitter: true },
        MB2: { role: 'MB2', name: 'Middle 2',     x: 50, y: 16, zone: 3, isFront: true,  isHitter: true },
        RS1: { role: 'RS1', name: 'Right Side 1', x: 80, y: 16, zone: 4, isFront: true,  isHitter: true },
        OH1: { role: 'OH1', name: 'Outside 1',    x: 22, y: 72, zone: 5, isFront: false },
        L:   { role: 'L',   name: 'Libero',       x: 50, y: 74, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 80, y: 70 }, label: 'Enter to Base Defense', color: '#38bdf8' }
      ]
    }
  },

  5: {
    rotation: 5,
    title: 'Rotation 5 (Setter 2 in Zone 6)',
    setterPosition: 'Zone 6 (Middle Back)',
    activeSetter: 'Setter 2 (S2)',
    frontRowAttackers: ['Outside 1 (OH1)', 'Middle 2 (MB2)', 'Right Side 1 (RS1/S1)'],
    systemType: '6-2 (3 Front-Row Attackers)',
    receiving: {
      summary: 'Setter 2 is in Zone 6 (Middle Back) stacked behind MB2. 3 front-row attackers (OH1, MB2, RS1) ready. 3-passer cup formed by OH1, Libero, and OH2.',
      tactics: [
        { role: 'Setter 2 (S2)', desc: 'Back-Row Setter: Stacks closely behind MB2 in middle-back, sprints to setting target at right front (Zone 2/3 seam).' },
        { role: 'Outside 1 (OH1)', desc: 'Front-Row Left Hitter: Drops back on left side to pass, then transitions out to attack left pin.' },
        { role: 'Middle 2 (MB2)', desc: 'Front-Row Middle: Stays at net in Zone 2 to shield setter, then transitions into middle for quick 1-ball.' },
        { role: 'Right Side 1 (RS1/S1)', desc: 'Front-Row Right Hitter: In Zone 3, transitions to right pin to attack.' },
        { role: 'Outside 2 (OH2)', desc: 'Back-Row Passer: Passes right seam in Zone 1.' },
        { role: 'Libero (L)', desc: 'Back-Row Passer: Passes middle seam in Zone 5.' }
      ],
      overlapRules: 'S2 (Zone 6) must remain behind MB2 (Zone 2) and between Libero (Zone 5) and OH2 (Zone 1) until serve contact.',
      positions: {
        OH2: { role: 'OH2', name: 'Outside 2',    x: 78, y: 72, zone: 1, isFront: false, isPasser: true },
        MB2: { role: 'MB2', name: 'Middle 2',     x: 64, y: 15, zone: 2, isFront: true,  isHitter: true },
        RS1: { role: 'RS1', name: 'Right Side 1', x: 36, y: 18, zone: 3, isFront: true,  isHitter: true },
        OH1: { role: 'OH1', name: 'Outside 1',    x: 20, y: 68, zone: 4, isFront: true,  isPasser: true, isHitter: true },
        L:   { role: 'L',   name: 'Libero',       x: 48, y: 74, zone: 5, isFront: false, isLibero: true },
        S2:  { role: 'S2',  name: 'Setter 2',     x: 62, y: 42, zone: 6, isFront: false, isSetter: true }
      },
      arrows: [
        { from: { x: 62, y: 42 }, to: { x: 68, y: 12 }, label: 'S2 Penetration', color: '#38bdf8' },
        { from: { x: 20, y: 68 }, to: { x: 15, y: 22 }, label: 'OH1 Approach', color: '#f59e0b' }
      ]
    },
    serving: {
      summary: 'Outside 2 is serving in Zone 1. Setter 2 is in Zone 6 and moves to Right Back base defense. 3 front-row blockers switch.',
      tactics: [
        { role: 'Outside 2 (OH2)', desc: 'Serves from Zone 1 baseline, then defends Left Back (Zone 5).' },
        { role: 'Middle 2 (MB2)', desc: 'Switches to Middle Front (Zone 3) to block.' },
        { role: 'Right Side 1 (RS1/S1)', desc: 'Switches to Right Front (Zone 2) to block and attack.' },
        { role: 'Outside 1 (OH1)', desc: 'Defends and attacks Left Front (Zone 4).' },
        { role: 'Libero (L)', desc: 'Defends Middle Back (Zone 6).' },
        { role: 'Setter 2 (S2)', desc: 'Moves to Right Back (Zone 1) base defense.' }
      ],
      overlapRules: 'Standard serving rules.',
      positions: {
        OH2: { role: 'OH2', name: 'Outside 2',    x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        MB2: { role: 'MB2', name: 'Middle 2',     x: 50, y: 16, zone: 2, isFront: true,  isHitter: true },
        RS1: { role: 'RS1', name: 'Right Side 1', x: 80, y: 16, zone: 3, isFront: true,  isHitter: true },
        OH1: { role: 'OH1', name: 'Outside 1',    x: 20, y: 16, zone: 4, isFront: true,  isHitter: true },
        L:   { role: 'L',   name: 'Libero',       x: 50, y: 74, zone: 5, isFront: false, isLibero: true },
        S2:  { role: 'S2',  name: 'Setter 2',     x: 80, y: 70, zone: 6, isFront: false, isSetter: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 22, y: 72 }, label: 'OH2 to Left Back', color: '#f59e0b' }
      ]
    }
  },

  6: {
    rotation: 6,
    title: 'Rotation 6 (Setter 2 in Zone 5)',
    setterPosition: 'Zone 5 (Left Back)',
    activeSetter: 'Setter 2 (S2)',
    frontRowAttackers: ['Outside 1 (OH1)', 'Middle 2 (MB2)', 'Right Side 1 (RS1/S1)'],
    systemType: '6-2 (3 Front-Row Attackers)',
    receiving: {
      summary: 'Setter 2 is in Zone 5 (Left Back) pushing up behind OH1. 3 front-row attackers (OH1, MB2, RS1) ready. 3-passer cup formed by OH1, Libero, and OH2.',
      tactics: [
        { role: 'Setter 2 (S2)', desc: 'Back-Row Setter: Starts behind OH1 on left side, sprints across court to setting target at right front.' },
        { role: 'Outside 1 (OH1)', desc: 'Front-Row Left Hitter: Passes left seam in Zone 3/4, then approaches outside left pin.' },
        { role: 'Middle 2 (MB2)', desc: 'Front-Row Middle: Stays at net in Zone 4, approaches inside for quick 1-ball or slide.' },
        { role: 'Right Side 1 (RS1/S1)', desc: 'Front-Row Right Hitter: In Zone 2, stays ready to hit on right pin.' },
        { role: 'Libero (L)', desc: 'Back-Row Passer: Passes middle seam in Zone 6.' },
        { role: 'Outside 2 (OH2)', desc: 'Back-Row Passer: Passes right seam in Zone 1.' }
      ],
      overlapRules: 'S2 (Zone 5) must stay behind MB2 (Zone 4) and to the left of Libero (Zone 6) until serve contact.',
      positions: {
        MB1: { role: 'MB1', name: 'Middle 1',     x: 80, y: 74, zone: 1, isFront: false },
        RS1: { role: 'RS1', name: 'Right Side 1', x: 80, y: 16, zone: 2, isFront: true,  isHitter: true },
        OH1: { role: 'OH1', name: 'Outside 1',    x: 48, y: 68, zone: 3, isFront: true,  isPasser: true, isHitter: true },
        MB2: { role: 'MB2', name: 'Middle 2',     x: 20, y: 16, zone: 4, isFront: true,  isHitter: true },
        S2:  { role: 'S2',  name: 'Setter 2',     x: 20, y: 44, zone: 5, isFront: false, isSetter: true },
        L:   { role: 'L',   name: 'Libero',       x: 52, y: 76, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 20, y: 44 }, to: { x: 68, y: 12 }, label: 'S2 Long Sprint to Target', color: '#38bdf8' }
      ]
    },
    serving: {
      summary: 'Middle 2 (or Libero serving) serves from Zone 1. 3 front-row blockers in place (RS1 in Z2, MB2 in Z3, OH1 in Z4).',
      tactics: [
        { role: 'Middle 2 (MB2)', desc: 'Serves from Zone 1 baseline, then plays Middle Back defense.' },
        { role: 'Right Side 1 (RS1/S1)', desc: 'Blocks and attacks from Right Front (Zone 2).' },
        { role: 'Outside 1 (OH1)', desc: 'Blocks and attacks from Left Front (Zone 4).' },
        { role: 'Middle 1 (MB1)', desc: 'Blocks Middle Front (Zone 3).' },
        { role: 'Setter 2 (S2)', desc: 'Defends Right Back (Zone 1) base defense.' },
        { role: 'Libero (L)', desc: 'Defends Middle Back / Left Back.' }
      ],
      overlapRules: 'Standard serving rules.',
      positions: {
        MB2: { role: 'MB2', name: 'Middle 2',     x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        RS1: { role: 'RS1', name: 'Right Side 1', x: 80, y: 16, zone: 2, isFront: true,  isHitter: true },
        OH1: { role: 'OH1', name: 'Outside 1',    x: 20, y: 16, zone: 3, isFront: true,  isHitter: true },
        MB1: { role: 'MB1', name: 'Middle 1',     x: 50, y: 16, zone: 4, isFront: true,  isHitter: true },
        S2:  { role: 'S2',  name: 'Setter 2',     x: 80, y: 70, zone: 5, isFront: false, isSetter: true },
        L:   { role: 'L',   name: 'Libero',       x: 48, y: 74, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 50, y: 74 }, label: 'MB2 to Middle Back', color: '#f59e0b' }
      ]
    }
  }
};
