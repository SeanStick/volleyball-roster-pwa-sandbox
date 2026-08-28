/**
 * Official 6-1 Volleyball System Formations Data
 *
 * In a standard 6-1 offensive system (1 dedicated Setter running all 6 rotations):
 * Positions on team in starting Rotation 1:
 * - Pos 1: Setter (S)
 * - Pos 2: Outside Hitter 1 (OH1)
 * - Pos 3: Middle Blocker 1 (MB1)
 * - Pos 4: Opposite Hitter (OPP)
 * - Pos 5: Outside Hitter 2 (OH2)
 * - Pos 6: Libero (L) / Middle Blocker 2 (MB2)
 *
 * Each token has a `zone: 1..6` representing which court slot (`pos1`..`pos6`)
 * that player occupies during that rotation.
 */

export const FORMATIONS_61_DATA = {
  1: {
    rotation: 1,
    title: 'Rotation 1 (Setter in Zone 1)',
    setterPosition: 'Zone 1 (Right Back)',
    receiving: {
      summary: 'Setter is in Zone 1 (Right Back). Setter pushes up near the net behind OH1. A 3-passer cup is formed by OH1, Libero, and OH2.',
      tactics: [
        { role: 'Setter (S)', desc: 'Pushes up toward Zone 2 right behind OH1 (cannot cross in front of OH1 before serve contact). Penetrates immediately to target at the net.' },
        { role: 'OH1', desc: 'Drops slightly back from Zone 2 to pass the right-seam in the 3-passer cup, then transitions out to the left or right pin to attack.' },
        { role: 'MB1', desc: 'Starts close to the net in Zone 3, stays ready for quick middle attack (1-ball / quick).' },
        { role: 'OPP', desc: 'Starts in Zone 4 (Left Front), stays ready to hit on the left pin (or crosses to right after attack).' },
        { role: 'OH2', desc: 'Passes left seam in the 3-passer cup in Zone 5.' },
        { role: 'Libero (L)', desc: 'Passes middle seam in Zone 6, anchoring the serve receive platform.' }
      ],
      overlapRules: 'Setter (1) must remain behind OH1 (2) and to the right of Libero (6) until the server contacts the ball.',
      positions: {
        S:   { role: 'S',   name: 'Setter',   x: 78, y: 46, zone: 1, isFront: false, isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 74, y: 70, zone: 2, isFront: true,  isPasser: true },
        MB1: { role: 'MB1', name: 'Middle 1',  x: 48, y: 15, zone: 3, isFront: true,  isHitter: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 18, y: 24, zone: 4, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 22, y: 72, zone: 5, isFront: false, isPasser: true },
        L:   { role: 'L',   name: 'Libero',    x: 48, y: 76, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 78, y: 46 }, to: { x: 68, y: 12 }, label: 'Setter Penetration to Target', color: '#38bdf8' },
        { from: { x: 18, y: 24 }, to: { x: 14, y: 12 }, label: 'OPP Approach', color: '#f59e0b' }
      ]
    },
    serving: {
      summary: 'Setter is serving at the baseline in Zone 1. Front row switches immediately upon serve: OH1 moves to Left Front, MB1 to Middle Front, OPP to Right Front.',
      tactics: [
        { role: 'Setter (S)', desc: 'Serves from behind Zone 1 baseline, then enters court into base defense (Right Back).' },
        { role: 'OH1', desc: 'Switches from right to left side to defend and attack from Left Front (Zone 4).' },
        { role: 'MB1', desc: 'Defends Middle Front (Zone 3), ready to read block opposing middle.' },
        { role: 'OPP', desc: 'Switches to Right Front (Zone 2) base block against opposing outside hitter.' },
        { role: 'OH2', desc: 'Defends Left Back (Zone 5) against cross-court attacks.' },
        { role: 'Libero (L)', desc: 'Defends Middle Back / Deep (Zone 6), reading tips and perimeter shots.' }
      ],
      overlapRules: 'No overlap restrictions apply after the server contacts the ball. Front-row players switch to base positions immediately.',
      positions: {
        S:   { role: 'S',   name: 'Setter',   x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 20, y: 16, zone: 2, isFront: true },
        MB1: { role: 'MB1', name: 'Middle 1',  x: 50, y: 16, zone: 3, isFront: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 80, y: 16, zone: 4, isFront: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 22, y: 72, zone: 5, isFront: false },
        L:   { role: 'L',   name: 'Libero',    x: 50, y: 74, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 80, y: 70 }, label: 'Enter to Base Defense', color: '#38bdf8' }
      ]
    }
  },

  2: {
    rotation: 2,
    title: 'Rotation 2 (Setter in Zone 6)',
    setterPosition: 'Zone 6 (Middle Back)',
    receiving: {
      summary: 'Setter is in Zone 6 (Middle Back). Setter hides in the middle behind MB1. 3-passer cup is formed by OH2, Libero, and OH1.',
      tactics: [
        { role: 'Setter (S)', desc: 'Stacks closely behind MB1 in middle-back. Sprints forward to the setting target at right front (Zone 2/3 seam).' },
        { role: 'OH2', desc: 'Starts in Zone 4, drops back into the passing line on the left side, then transitions out to attack on the left pin.' },
        { role: 'MB1', desc: 'Stands at the net in Zone 2 to shield the setter, then transitions into middle to run a 1-ball.' },
        { role: 'OPP', desc: 'In Zone 3, ready to hit slide or high-ball on the right pin.' },
        { role: 'OH1', desc: 'Passes right seam in Zone 1.' },
        { role: 'Libero (L)', desc: 'Passes middle seam in Zone 5.' }
      ],
      overlapRules: 'Setter (6) must stay behind MB1 (2) and between Libero (5) and OH1 (1) until serve contact.',
      positions: {
        OH1: { role: 'OH1', name: 'Outside 1', x: 78, y: 72, zone: 1, isFront: false, isPasser: true },
        MB1: { role: 'MB1', name: 'Middle 1',  x: 64, y: 15, zone: 2, isFront: true,  isHitter: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 36, y: 18, zone: 3, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 20, y: 68, zone: 4, isFront: true,  isPasser: true },
        L:   { role: 'L',   name: 'Libero',    x: 48, y: 74, zone: 5, isFront: false, isLibero: true },
        S:   { role: 'S',   name: 'Setter',    x: 62, y: 42, zone: 6, isFront: false, isSetter: true }
      },
      arrows: [
        { from: { x: 62, y: 42 }, to: { x: 68, y: 12 }, label: 'Setter Penetration', color: '#38bdf8' },
        { from: { x: 20, y: 68 }, to: { x: 15, y: 22 }, label: 'OH2 Approach', color: '#f59e0b' }
      ]
    },
    serving: {
      summary: 'OH1 is serving in Zone 1. Setter is in Middle Back (Zone 6) and moves to Right Back base defense.',
      tactics: [
        { role: 'OH1', desc: 'Serves from Zone 1, then enters court into Left Back or Right Back defense.' },
        { role: 'MB1', desc: 'Moves to Middle Front (Zone 3) block.' },
        { role: 'OPP', desc: 'Moves to Right Front (Zone 2) block.' },
        { role: 'OH2', desc: 'Defends Left Front (Zone 4).' },
        { role: 'Setter (S)', desc: 'Shifts to Right Back base defense (Zone 1) after serve.' },
        { role: 'Libero (L)', desc: 'Defends Middle Back / Left Back (Zone 5/6).' }
      ],
      overlapRules: 'Standard serve base alignment.',
      positions: {
        OH1: { role: 'OH1', name: 'Outside 1', x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        MB1: { role: 'MB1', name: 'Middle 1',  x: 50, y: 16, zone: 2, isFront: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 80, y: 16, zone: 3, isFront: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 20, y: 16, zone: 4, isFront: true },
        L:   { role: 'L',   name: 'Libero',    x: 25, y: 72, zone: 5, isFront: false, isLibero: true },
        S:   { role: 'S',   name: 'Setter',    x: 65, y: 70, zone: 6, isFront: false, isSetter: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 50, y: 74 }, label: 'OH1 to Middle/Left Back', color: '#38bdf8' }
      ]
    }
  },

  3: {
    rotation: 3,
    title: 'Rotation 3 (Setter in Zone 5)',
    setterPosition: 'Zone 5 (Left Back)',
    receiving: {
      summary: 'Setter is in Zone 5 (Left Back). Setter pushes all the way up to the left net line behind OH2, then sprints across court to the target.',
      tactics: [
        { role: 'Setter (S)', desc: 'Pushes up in Zone 5 right behind OH2 at left sideline. Penetrates across court to Zone 2/3 target upon serve contact.' },
        { role: 'OH2', desc: 'Starts at net left sideline to release the setter, then drops back slightly to pass left seam.' },
        { role: 'MB1', desc: 'In Zone 4 (Left Front), pulls back or transitions into middle for quick hit.' },
        { role: 'OPP', desc: 'In Zone 2, stays on the right pin ready to attack.' },
        { role: 'OH1', desc: 'Passes middle seam in Zone 6.' },
        { role: 'Libero (L)', desc: 'Passes right seam in Zone 1 (swapped with MB2 in back row).' }
      ],
      overlapRules: 'Setter (5) must stay behind OH2 (4) and to the left of OH1 (6) until serve contact.',
      positions: {
        L:   { role: 'L',   name: 'Libero',    x: 76, y: 74, zone: 1, isFront: false, isLibero: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 80, y: 20, zone: 2, isFront: true,  isHitter: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 22, y: 22, zone: 3, isFront: true,  isPasser: true },
        MB1: { role: 'MB1', name: 'Middle 1',  x: 44, y: 16, zone: 4, isFront: true,  isHitter: true },
        S:   { role: 'S',   name: 'Setter',   x: 22, y: 44, zone: 5, isFront: false, isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 46, y: 74, zone: 6, isFront: false, isPasser: true }
      },
      arrows: [
        { from: { x: 22, y: 44 }, to: { x: 68, y: 12 }, label: 'Long Setter Penetration to Target', color: '#38bdf8' }
      ]
    },
    serving: {
      summary: 'MB1 (or Libero) is serving in Zone 1. Setter is in Left Back (Zone 5) and shifts to Right Back after serve.',
      tactics: [
        { role: 'MB1/L', desc: 'Serves from Zone 1 baseline, then transitions to defensive base.' },
        { role: 'OH2', desc: 'Defends Left Front (Zone 4).' },
        { role: 'MB1', desc: 'Middle Front (Zone 3) block.' },
        { role: 'OPP', desc: 'Right Front (Zone 2) block.' },
        { role: 'Setter (S)', desc: 'Transitions from Left Back to Right Back base defense.' },
        { role: 'OH1', desc: 'Defends Middle Back / Left Back.' }
      ],
      overlapRules: 'Front row switches to base: OH2 left, MB middle, OPP right.',
      positions: {
        L:   { role: 'L',   name: 'Libero',    x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 80, y: 16, zone: 2, isFront: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 20, y: 16, zone: 3, isFront: true },
        MB1: { role: 'MB1', name: 'Middle 1',  x: 50, y: 16, zone: 4, isFront: true },
        S:   { role: 'S',   name: 'Setter',    x: 25, y: 70, zone: 5, isFront: false, isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 52, y: 74, zone: 6, isFront: false }
      },
      arrows: [
        { from: { x: 25, y: 70 }, to: { x: 78, y: 70 }, label: 'Setter shift to Right Back Base', color: '#38bdf8' }
      ]
    }
  },

  4: {
    rotation: 4,
    title: 'Rotation 4 (Setter in Zone 4 - Front Row)',
    setterPosition: 'Zone 4 (Left Front)',
    receiving: {
      summary: 'Setter is now a FRONT-ROW player in Zone 4. Setter penetrates directly from left front to target at right front. 3 front-row attack options available.',
      tactics: [
        { role: 'Setter (S)', desc: 'Starts at net left side (Zone 4) and slides along the net to Zone 2/3 target. Can dump/tip attack as a front-row player.' },
        { role: 'OH1', desc: 'In Zone 5, passes left seam and transitions to attack back row (pipe) or left pin.' },
        { role: 'MB2', desc: 'In Zone 3, runs quick middle 1-ball / slide.' },
        { role: 'OH2', desc: 'In Zone 2, crosses to left side to hit on the left pin (Zone 4).' },
        { role: 'OPP', desc: 'In Zone 1, passes right seam or prepares for back-row D-ball attack.' },
        { role: 'Libero (L)', desc: 'Passes middle seam in Zone 6.' }
      ],
      overlapRules: 'Setter (4) must remain to the left of MB2 (3) and in front of OH1 (5) until serve contact.',
      positions: {
        OPP: { role: 'OPP', name: 'Opposite',  x: 76, y: 70, zone: 1, isFront: false, isPasser: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 78, y: 22, zone: 2, isFront: true,  isHitter: true },
        MB2: { role: 'MB2', name: 'Middle 2',  x: 48, y: 15, zone: 3, isFront: true,  isHitter: true },
        S:   { role: 'S',   name: 'Setter',   x: 18, y: 15, zone: 4, isFront: true,  isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 22, y: 72, zone: 5, isFront: false, isPasser: true },
        L:   { role: 'L',   name: 'Libero',    x: 48, y: 76, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 18, y: 15 }, to: { x: 68, y: 12 }, label: 'Setter Slide to Target', color: '#38bdf8' },
        { from: { x: 78, y: 22 }, to: { x: 15, y: 20 }, label: 'OH2 Switch to Left Pin', color: '#f59e0b' }
      ]
    },
    serving: {
      summary: 'Opposite (OPP) is serving from Zone 1. Setter is front row and sets from Right Front (Zone 2).',
      tactics: [
        { role: 'OPP', desc: 'Serves from Zone 1, then enters Right Back defense.' },
        { role: 'Setter (S)', desc: 'Takes Right Front (Zone 2) base position at the net.' },
        { role: 'MB2', desc: 'Middle Front (Zone 3) block.' },
        { role: 'OH2', desc: 'Left Front (Zone 4) block and attack.' },
        { role: 'OH1', desc: 'Left Back (Zone 5) defense.' },
        { role: 'Libero (L)', desc: 'Middle Back (Zone 6) defense.' }
      ],
      overlapRules: 'Front row switches: Setter right, MB middle, OH2 left.',
      positions: {
        OPP: { role: 'OPP', name: 'Opposite',  x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 20, y: 16, zone: 2, isFront: true },
        MB2: { role: 'MB2', name: 'Middle 2',  x: 50, y: 16, zone: 3, isFront: true },
        S:   { role: 'S',   name: 'Setter',    x: 80, y: 16, zone: 4, isFront: true,  isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 22, y: 72, zone: 5, isFront: false },
        L:   { role: 'L',   name: 'Libero',    x: 50, y: 74, zone: 6, isFront: false, isLibero: true }
      },
      arrows: [
        { from: { x: 82, y: 92 }, to: { x: 78, y: 70 }, label: 'OPP to Right Back Defense', color: '#38bdf8' }
      ]
    }
  },

  5: {
    rotation: 5,
    title: 'Rotation 5 (Setter in Zone 3 - Front Row)',
    setterPosition: 'Zone 3 (Middle Front)',
    receiving: {
      summary: 'Setter is in Zone 3 (Middle Front). Setter starts just left of the target and steps right. OH1 in Zone 4 hits left pin, MB2 in Zone 2 hits right / middle.',
      tactics: [
        { role: 'Setter (S)', desc: 'Starts at net in middle (Zone 3) and takes 1-2 steps to setting target at Zone 2.' },
        { role: 'OH1', desc: 'In Zone 4, stays open for left-side spike.' },
        { role: 'MB2', desc: 'In Zone 2, runs slide or quick behind the setter.' },
        { role: 'OH2', desc: 'In Zone 1, passes right seam.' },
        { role: 'Libero (L)', desc: 'In Zone 5, passes left seam.' },
        { role: 'OPP', desc: 'In Zone 6, passes middle seam.' }
      ],
      overlapRules: 'Setter (3) must remain between OH1 (4) and MB2 (2), and in front of OPP (6).',
      positions: {
        OH2: { role: 'OH2', name: 'Outside 2', x: 76, y: 70, zone: 1, isFront: false, isPasser: true },
        MB2: { role: 'MB2', name: 'Middle 2',  x: 78, y: 18, zone: 2, isFront: true,  isHitter: true },
        S:   { role: 'S',   name: 'Setter',   x: 48, y: 15, zone: 3, isFront: true,  isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 18, y: 20, zone: 4, isFront: true,  isHitter: true },
        L:   { role: 'L',   name: 'Libero',    x: 22, y: 72, zone: 5, isFront: false, isLibero: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 48, y: 76, zone: 6, isFront: false, isPasser: true }
      },
      arrows: [
        { from: { x: 48, y: 15 }, to: { x: 68, y: 12 }, label: 'Setter step to Target', color: '#38bdf8' }
      ]
    },
    serving: {
      summary: 'OH2 is serving from Zone 1. Setter is in Right Front base.',
      tactics: [
        { role: 'OH2', desc: 'Serves from Zone 1, then defends Left Back / Middle Back.' },
        { role: 'Setter (S)', desc: 'Right Front (Zone 2) base defense.' },
        { role: 'MB2', desc: 'Middle Front (Zone 3) block.' },
        { role: 'OH1', desc: 'Left Front (Zone 4) attack.' },
        { role: 'Libero (L)', desc: 'Left Back (Zone 5) defense.' },
        { role: 'OPP', desc: 'Right Back (Zone 1) defense.' }
      ],
      overlapRules: 'Front row standard base alignment.',
      positions: {
        OH2: { role: 'OH2', name: 'Outside 2', x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        MB2: { role: 'MB2', name: 'Middle 2',  x: 50, y: 16, zone: 2, isFront: true },
        S:   { role: 'S',   name: 'Setter',    x: 80, y: 16, zone: 3, isFront: true,  isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 20, y: 16, zone: 4, isFront: true },
        L:   { role: 'L',   name: 'Libero',    x: 25, y: 72, zone: 5, isFront: false, isLibero: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 65, y: 70, zone: 6, isFront: false }
      },
      arrows: []
    }
  },

  6: {
    rotation: 6,
    title: 'Rotation 6 (Setter in Zone 2 - Front Row)',
    setterPosition: 'Zone 2 (Right Front)',
    receiving: {
      summary: 'Setter is already in Zone 2 (Right Front target). Easiest rotation for the setter. OH1 in Zone 3 switches to left pin, MB2 in Zone 4 hits middle.',
      tactics: [
        { role: 'Setter (S)', desc: 'Already standing at the setting target at Right Front (Zone 2). Ready to set immediately.' },
        { role: 'OH1', desc: 'In Zone 3, transitions to Left Front (Zone 4) to attack left pin.' },
        { role: 'MB2', desc: 'In Zone 4, transitions to Middle Front (Zone 3) to run quick attack.' },
        { role: 'OH2', desc: 'In Zone 6, passes middle seam.' },
        { role: 'Libero (L)', desc: 'In Zone 1 (or 5), passes deep seam.' },
        { role: 'OPP', desc: 'In Zone 5, passes left seam.' }
      ],
      overlapRules: 'Setter (2) must stay to the right of OH1 (3) and in front of Libero/MB (1) until serve contact.',
      positions: {
        L:   { role: 'L',   name: 'Libero',    x: 78, y: 72, zone: 1, isFront: false, isLibero: true },
        S:   { role: 'S',   name: 'Setter',   x: 78, y: 14, zone: 2, isFront: true,  isSetter: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 50, y: 18, zone: 3, isFront: true,  isHitter: true },
        MB2: { role: 'MB2', name: 'Middle 2',  x: 22, y: 18, zone: 4, isFront: true,  isHitter: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 22, y: 72, zone: 5, isFront: false, isPasser: true },
        OH2: { role: 'OH2', name: 'Outside 2', x: 50, y: 76, zone: 6, isFront: false, isPasser: true }
      },
      arrows: [
        { from: { x: 50, y: 18 }, to: { x: 16, y: 18 }, label: 'OH1 Switch to Left Pin', color: '#f59e0b' },
        { from: { x: 22, y: 18 }, to: { x: 46, y: 15 }, label: 'MB2 Shift to Middle Attack', color: '#38bdf8' }
      ]
    },
    serving: {
      summary: 'MB2 (or Libero) is serving from Zone 1. Setter is already in Right Front base.',
      tactics: [
        { role: 'MB2/L', desc: 'Serves from Zone 1 baseline.' },
        { role: 'Setter (S)', desc: 'Right Front (Zone 2) base.' },
        { role: 'MB1/2', desc: 'Middle Front (Zone 3) block.' },
        { role: 'OH1', desc: 'Left Front (Zone 4) attack.' },
        { role: 'OPP', desc: 'Left Back (Zone 5) defense.' },
        { role: 'OH2', desc: 'Middle Back (Zone 6) defense.' }
      ],
      overlapRules: 'Front row standard base alignment.',
      positions: {
        L:   { role: 'L',   name: 'Libero',    x: 82, y: 92, zone: 1, isFront: false, isServer: true },
        S:   { role: 'S',   name: 'Setter',    x: 80, y: 16, zone: 2, isFront: true,  isSetter: true },
        MB1: { role: 'MB1', name: 'Middle 1',  x: 50, y: 16, zone: 3, isFront: true },
        OH1: { role: 'OH1', name: 'Outside 1', x: 20, y: 16, zone: 4, isFront: true },
        OPP: { role: 'OPP', name: 'Opposite',  x: 25, y: 72, zone: 5, isFront: false },
        OH2: { role: 'OH2', name: 'Outside 2', x: 52, y: 74, zone: 6, isFront: false }
      },
      arrows: []
    }
  }
};
