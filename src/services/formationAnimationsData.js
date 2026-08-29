/**
 * 6-2 Volleyball Multi-Stage Tactical Animation Data
 *
 * In an official 6-2 system (6 Hitters, 2 Setters):
 * - The setter in the BACK ROW always penetrates to the net to set.
 * - The front row ALWAYS has 3 attacking threats (Outside, Middle, Right Side).
 * - Rotations 1-3: Setter 1 (S1) is in back row (Z1, Z6, Z5), RS2/S2 is hitting in front row.
 * - Rotations 4-6: Setter 2 (S2) is in back row (Z1, Z6, Z5), RS1/S1 is hitting in front row.
 *
 * Each rotation contains 5 granular animation stages for both 'receiving' and 'serving':
 * Stage 1: Initial Setup / Overlap Stack
 * Stage 2: Serve Flight & Passer Read
 * Stage 3: Back-Row Setter Penetration & Pass to Target
 * Stage 4: 3-Hitter Front-Row Routes & Set Delivery
 * Stage 5: Attack Strike, Net Crossing & Defense Transition
 */

export const FORMATION_ANIMATIONS = {
  1: {
    rotation: 1,
    title: 'Rotation 1 (Setter 1 in Zone 1)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'Initial 6-2 Overlap Stack',
          narrative: 'Setter 1 (Z1) stacks closely behind OH1 (Z2). Front row has 3 attackers (OH1, MB1, RS2). OH1, Libero (Z6), and OH2 (Z5) form the primary 3-passer serve receive cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S1:  { x: 78, y: 46, action: 'Ready to Penetrate', role: 'S1', zone: 1 },
            OH1: { x: 74, y: 70, action: 'Passing Right Seam', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 15, action: 'Ready at Net', role: 'MB1', zone: 3 },
            RS2: { x: 18, y: 24, action: '3rd Attacker (Left/Right)', role: 'RS2', zone: 4 },
            OH2: { x: 22, y: 72, action: 'Passing Left Seam', role: 'OH2', zone: 5 },
            L:   { x: 48, y: 76, action: 'Anchoring Middle', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — S1 Begins Penetration',
          narrative: 'Opponent serves over the net. Passers read ball trajectory and square up platforms. Setter 1 begins forward penetration sprint toward the net target.',
          ball: { visible: true, x: 38, y: 70, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            S1:  { x: 74, y: 32, action: 'Sprinting to Target', role: 'S1', zone: 1 },
            OH1: { x: 72, y: 68, action: 'Passing Platform', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 18, action: 'Tracking Pass', role: 'MB1', zone: 3 },
            RS2: { x: 24, y: 24, action: 'Opening to Attack Pin', role: 'RS2', zone: 4 },
            OH2: { x: 26, y: 70, action: 'Calling In/Out', role: 'OH2', zone: 5 },
            L:   { x: 44, y: 74, action: 'Passing Ball', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. S1 to Target',
          title: 'Pass Delivered to Target (Zone 2.5)',
          narrative: 'Libero delivers a perfect pass to Setter 1 at the net target (Zone 2.5). S1 sets feet with hands high. All 3 front-row hitters transition off the net.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S1:  { x: 68, y: 14, action: 'Hands High at Target', role: 'S1', zone: 1 },
            OH1: { x: 80, y: 44, action: 'Transitioning Right', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 22, action: 'Timing Quick 1-Ball', role: 'MB1', zone: 3 },
            RS2: { x: 14, y: 38, action: 'Transitioning Left Pin', role: 'RS2', zone: 4 },
            OH2: { x: 26, y: 62, action: 'Moving to Cover', role: 'OH2', zone: 5 },
            L:   { x: 46, y: 62, action: 'Following Pass', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. 3-Hitter Routes & Set',
          title: 'S1 Distributes Set — 3 Front-Row Attackers Approach',
          narrative: 'Setter 1 jump-sets high to the pin while Middle Blocker runs an aggressive 1-ball decoy and Right Side attacks. All 3 front-row hitters explode into approaches.',
          ball: { visible: true, x: 14, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S1:  { x: 68, y: 12, action: 'Jump Set Released', role: 'S1', zone: 1 },
            OH1: { x: 84, y: 20, action: 'Right Pin Approach', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 12, action: 'Jumping Quick Decoy', role: 'MB1', zone: 3 },
            RS2: { x: 14, y: 12, action: 'Spiking Left Pin', role: 'RS2', zone: 4 },
            OH2: { x: 24, y: 48, action: 'Covering Hitter', role: 'OH2', zone: 5 },
            L:   { x: 40, y: 52, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Base Cover',
          title: 'Attack Strikes Over Net — Team Enters Base Defense',
          narrative: 'The spike crosses deep into the opponent court. Attackers land safely and the team transitions into base defense (S1 in Right Back, OH2 in Left Back, Libero Middle).',
          ball: { visible: true, x: 20, y: -30, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S1:  { x: 80, y: 68, action: 'Base Right Back', role: 'S1', zone: 1 },
            OH1: { x: 80, y: 20, action: 'Ready for Block/Cover', role: 'OH1', zone: 2 },
            MB1: { x: 50, y: 16, action: 'Landing & Tracking', role: 'MB1', zone: 3 },
            RS2: { x: 18, y: 18, action: 'Left Pin Block/Defense', role: 'RS2', zone: 4 },
            OH2: { x: 20, y: 70, action: 'Base Left Back', role: 'OH2', zone: 5 },
            L:   { x: 50, y: 74, action: 'Base Middle Back', role: 'L', zone: 6 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Lineup',
          title: 'Setter 1 Serves from Baseline',
          narrative: 'Setter 1 lines up to serve behind Zone 1. 3 front-row blockers (OH1, MB1, RS2) stack near the net ready to switch into base positions immediately upon contact.',
          ball: { visible: true, x: 82, y: 92, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S1:  { x: 82, y: 92, action: 'Serving Baseline', role: 'S1', zone: 1 },
            OH1: { x: 65, y: 18, action: 'Stacking at Net', role: 'OH1', zone: 2 },
            MB1: { x: 50, y: 18, action: 'Stacking at Net', role: 'MB1', zone: 3 },
            RS2: { x: 35, y: 18, action: 'Stacking at Net', role: 'RS2', zone: 4 },
            OH2: { x: 22, y: 72, action: 'Left Back Ready', role: 'OH2', zone: 5 },
            L:   { x: 50, y: 74, action: 'Middle Back Ready', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve Delivery',
          title: 'Ball Crosses Net — 3 Blockers Switch',
          narrative: 'Setter 1 strikes a float serve over the net. All 3 front-row blockers immediately cross and switch into their base blocking positions (OH1 to Z4, RS2 to Z2).',
          ball: { visible: true, x: 60, y: -25, scale: 0.9, shadowOpacity: 0.3 },
          positions: {
            S1:  { x: 80, y: 84, action: 'Entering Court', role: 'S1', zone: 1 },
            OH1: { x: 30, y: 16, action: 'Switching to Left Front', role: 'OH1', zone: 2 },
            MB1: { x: 50, y: 16, action: 'Holding Middle Front', role: 'MB1', zone: 3 },
            RS2: { x: 70, y: 16, action: 'Switching to Right Front', role: 'RS2', zone: 4 },
            OH2: { x: 20, y: 70, action: 'Reading Opponent Pass', role: 'OH2', zone: 5 },
            L:   { x: 50, y: 74, action: 'Reading Opponent Pass', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Read Opponent Set',
          title: 'Triple Block Read — Base Defense Set',
          narrative: 'Opponent setter sets to left side. RS2 and MB1 close to form a solid double block on the right pin, while S1, Libero, and OH2 position for digging perimeter.',
          ball: { visible: false, x: 50, y: -30, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S1:  { x: 80, y: 68, action: 'Digging Line / Tip', role: 'S1', zone: 1 },
            OH1: { x: 20, y: 32, action: 'Pulled Off for Off-Block', role: 'OH1', zone: 2 },
            MB1: { x: 68, y: 14, action: 'Closing Double Block', role: 'MB1', zone: 3 },
            RS2: { x: 78, y: 14, action: 'Setting Right Pin Block', role: 'RS2', zone: 4 },
            OH2: { x: 24, y: 68, action: 'Digging Deep Cross', role: 'OH2', zone: 5 },
            L:   { x: 50, y: 72, action: 'Digging Middle Seam', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Dig & S1 Break',
          title: 'Libero Digs Attack — S1 Sprints to Set',
          narrative: 'Libero digs the cross-court spike cleanly. Setter 1 immediately releases from Right Back and sprints to the net to quarterback the counter-attack.',
          ball: { visible: true, x: 68, y: 16, scale: 1.1, shadowOpacity: 0.8 },
          positions: {
            S1:  { x: 68, y: 14, action: 'Hands High for Counter-Set', role: 'S1', zone: 1 },
            OH1: { x: 16, y: 36, action: 'Opening for High Ball', role: 'OH1', zone: 2 },
            MB1: { x: 50, y: 22, action: 'Transitioning Quick', role: 'MB1', zone: 3 },
            RS2: { x: 82, y: 36, action: 'Transitioning Slide/Back', role: 'RS2', zone: 4 },
            OH2: { x: 24, y: 60, action: 'Moving to Cover', role: 'OH2', zone: 5 },
            L:   { x: 48, y: 64, action: 'Recovering from Dig', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Counter-Attack',
          title: '3-Hitter Counter-Attack Strike',
          narrative: 'S1 sets Outside 1 (OH1) on the left pin who terminates the rally with a kill into the opponent court.',
          ball: { visible: true, x: 18, y: -30, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S1:  { x: 68, y: 14, action: 'Watching Counter Hit', role: 'S1', zone: 1 },
            OH1: { x: 18, y: 12, action: 'Spiking Left Pin Kill', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 14, action: 'Middle Quick Decoy', role: 'MB1', zone: 3 },
            RS2: { x: 80, y: 20, action: 'Right Pin Option', role: 'RS2', zone: 4 },
            OH2: { x: 22, y: 50, action: 'Covering Hitter', role: 'OH2', zone: 5 },
            L:   { x: 42, y: 56, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        }
      ]
    }
  },

  2: {
    rotation: 2,
    title: 'Rotation 2 (Setter 1 in Zone 6)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'S1 Stacks in Middle Back (Zone 6)',
          narrative: 'Setter 1 (Z6) stacks closely behind MB1 (Z2). OH2 drops from Zone 4 to pass left seam with Libero (Z5) and OH1 (Z1). 3 front-row hitters ready (OH2, MB1, RS2).',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            OH1: { x: 78, y: 72, action: 'Passing Right Seam', role: 'OH1', zone: 1 },
            MB1: { x: 64, y: 15, action: 'Shielding S1 at Net', role: 'MB1', zone: 2 },
            RS2: { x: 36, y: 18, action: 'Front-Row Right Hitter', role: 'RS2', zone: 3 },
            OH2: { x: 20, y: 68, action: 'Passing Left Seam', role: 'OH2', zone: 4 },
            L:   { x: 48, y: 74, action: 'Passing Middle Seam', role: 'L', zone: 5 },
            S1:  { x: 62, y: 42, action: 'Stacked Behind MB1', role: 'S1', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'S1 Penetrates from Middle Back',
          narrative: 'Ball is served. Setter 1 sprints past MB1 into the setting slot between Zones 2 and 3.',
          ball: { visible: true, x: 52, y: 70, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            OH1: { x: 76, y: 70, action: 'Calling In/Out', role: 'OH1', zone: 1 },
            MB1: { x: 60, y: 18, action: 'Tracking Pass', role: 'MB1', zone: 2 },
            RS2: { x: 45, y: 22, action: 'Opening to Pin', role: 'RS2', zone: 3 },
            OH2: { x: 24, y: 66, action: 'Platform Angle', role: 'OH2', zone: 4 },
            L:   { x: 48, y: 72, action: 'Passing Ball', role: 'L', zone: 5 },
            S1:  { x: 66, y: 26, action: 'Sprinting Forward', role: 'S1', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. S1 at Setting Slot',
          title: 'Setter Hands High — 3 Hitters Transition',
          narrative: 'Pass arrives at setting target. S1 sets up. OH2 transitions to left pin, MB1 runs 1-ball in middle, RS2 transitions to right pin.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            OH1: { x: 74, y: 64, action: 'Moving to Cover', role: 'OH1', zone: 1 },
            MB1: { x: 50, y: 22, action: 'Timing Quick 1-Ball', role: 'MB1', zone: 2 },
            RS2: { x: 78, y: 38, action: 'Transitioning Right Pin', role: 'RS2', zone: 3 },
            OH2: { x: 14, y: 38, action: 'Transitioning Left Pin', role: 'OH2', zone: 4 },
            L:   { x: 46, y: 62, action: 'Following Pass', role: 'L', zone: 5 },
            S1:  { x: 68, y: 14, action: 'Hands High at Target', role: 'S1', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. 3-Hitter Attack Routes',
          title: 'S1 Releases Set to Outside Hitter',
          narrative: 'S1 sets a fast tempo ball to OH2 on the left pin while MB1 draws the middle blocker.',
          ball: { visible: true, x: 16, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            OH1: { x: 70, y: 56, action: 'Covering Hitter', role: 'OH1', zone: 1 },
            MB1: { x: 50, y: 12, action: 'Jumping Quick Decoy', role: 'MB1', zone: 2 },
            RS2: { x: 82, y: 18, action: 'Right Pin Ready', role: 'RS2', zone: 3 },
            OH2: { x: 16, y: 12, action: 'Spiking Left Pin', role: 'OH2', zone: 4 },
            L:   { x: 38, y: 52, action: 'Covering Hitter', role: 'L', zone: 5 },
            S1:  { x: 68, y: 12, action: 'Jump Set Released', role: 'S1', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Transition',
          title: 'Spike Scores — Team Enters Base Defense',
          narrative: 'OH2 finishes the attack and team assumes defensive base (S1 Right Back, Libero Middle, OH1 Left Back).',
          ball: { visible: true, x: 22, y: -30, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            OH1: { x: 20, y: 70, action: 'Base Left Back', role: 'OH1', zone: 1 },
            MB1: { x: 50, y: 16, action: 'Base Middle Front', role: 'MB1', zone: 2 },
            RS2: { x: 80, y: 16, action: 'Base Right Front', role: 'RS2', zone: 3 },
            OH2: { x: 20, y: 16, action: 'Base Left Front', role: 'OH2', zone: 4 },
            L:   { x: 50, y: 74, action: 'Base Middle Back', role: 'L', zone: 5 },
            S1:  { x: 80, y: 70, action: 'Base Right Back', role: 'S1', zone: 6 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Lineup',
          title: 'OH1 Serves — 3 Front-Row Blockers Ready',
          narrative: 'OH1 serves from Zone 1. 3 front-row blockers (MB1, RS2, OH2) prepare to defend against opponent attack.',
          ball: { visible: true, x: 82, y: 92, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            OH1: { x: 82, y: 92, action: 'Serving Baseline', role: 'OH1', zone: 1 },
            MB1: { x: 65, y: 18, action: 'Stacking at Net', role: 'MB1', zone: 2 },
            RS2: { x: 45, y: 18, action: 'Stacking at Net', role: 'RS2', zone: 3 },
            OH2: { x: 25, y: 18, action: 'Left Front Blocker', role: 'OH2', zone: 4 },
            L:   { x: 50, y: 74, action: 'Middle Back Ready', role: 'L', zone: 5 },
            S1:  { x: 70, y: 68, action: 'Right Back Ready', role: 'S1', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve Flight & Block Shift',
          title: 'Ball Crosses Net — Blockers Switch',
          narrative: 'Serve crosses net. MB1 moves to Middle Front (Z3) and RS2 moves to Right Front (Z2).',
          ball: { visible: true, x: 60, y: -25, scale: 0.9, shadowOpacity: 0.3 },
          positions: {
            OH1: { x: 78, y: 84, action: 'Moving to Left Back', role: 'OH1', zone: 1 },
            MB1: { x: 50, y: 16, action: 'Holding Middle Front', role: 'MB1', zone: 2 },
            RS2: { x: 80, y: 16, action: 'Switching to Right Front', role: 'RS2', zone: 3 },
            OH2: { x: 20, y: 16, action: 'Holding Left Front', role: 'OH2', zone: 4 },
            L:   { x: 50, y: 74, action: 'Middle Back Defense', role: 'L', zone: 5 },
            S1:  { x: 80, y: 70, action: 'Right Back Defense', role: 'S1', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Defense Setup',
          title: 'Front-Row Triple Block Set',
          narrative: 'Team establishes perimeter defense ready to dig opponent hit.',
          ball: { visible: false, x: 50, y: -30, scale: 0.8, shadowOpacity: 0 },
          positions: {
            OH1: { x: 20, y: 72, action: 'Left Back Base', role: 'OH1', zone: 1 },
            MB1: { x: 50, y: 14, action: 'Read Blocking Middle', role: 'MB1', zone: 2 },
            RS2: { x: 80, y: 14, action: 'Right Pin Block', role: 'RS2', zone: 3 },
            OH2: { x: 20, y: 30, action: 'Off-Block Defense', role: 'OH2', zone: 4 },
            L:   { x: 50, y: 74, action: 'Middle Back Base', role: 'L', zone: 5 },
            S1:  { x: 80, y: 70, action: 'Right Back Base', role: 'S1', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Dig & S1 Set',
          title: 'OH1 Digs — S1 Delivers Counter-Set',
          narrative: 'OH1 digs from left back. S1 delivers back-set to RS2 on right pin.',
          ball: { visible: true, x: 80, y: 12, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            OH1: { x: 22, y: 68, action: 'Recovering from Dig', role: 'OH1', zone: 1 },
            MB1: { x: 48, y: 16, action: 'Middle Quick Decoy', role: 'MB1', zone: 2 },
            RS2: { x: 80, y: 12, action: 'Spiking Right Pin', role: 'RS2', zone: 3 },
            OH2: { x: 18, y: 22, action: 'Left Pin Option', role: 'OH2', zone: 4 },
            L:   { x: 48, y: 64, action: 'Covering Hitter', role: 'L', zone: 5 },
            S1:  { x: 68, y: 14, action: 'Back-Set Released', role: 'S1', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack Finish',
          title: 'RS2 Strikes Winner',
          narrative: 'RS2 pounds the ball cross-court for a kill.',
          ball: { visible: true, x: 75, y: -30, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            OH1: { x: 20, y: 70, action: 'Base Left Back', role: 'OH1', zone: 1 },
            MB1: { x: 50, y: 16, action: 'Base Middle Front', role: 'MB1', zone: 2 },
            RS2: { x: 80, y: 16, action: 'Landing & Celebrating', role: 'RS2', zone: 3 },
            OH2: { x: 20, y: 16, action: 'Base Left Front', role: 'OH2', zone: 4 },
            L:   { x: 50, y: 74, action: 'Base Middle Back', role: 'L', zone: 5 },
            S1:  { x: 80, y: 70, action: 'Base Right Back', role: 'S1', zone: 6 }
          }
        }
      ]
    }
  },

  3: {
    rotation: 3,
    title: 'Rotation 3 (Setter 1 in Zone 5)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'S1 in Left Back (Zone 5) Pushes Up',
          narrative: 'Setter 1 (Z5) starts behind OH2 (Z3) on the left side. 3 front-row attackers (OH2, MB1, RS2) ready. OH2, Libero (Z6), and OH1 (Z1) form 3-passer cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            MB2: { x: 80, y: 74, action: 'Right Back Bench/Cover', role: 'MB2', zone: 1 },
            RS2: { x: 80, y: 16, action: 'Front-Row Right Hitter', role: 'RS2', zone: 2 },
            OH2: { x: 48, y: 68, action: 'Passing Middle Seam', role: 'OH2', zone: 3 },
            MB1: { x: 20, y: 16, action: 'Front-Row Middle', role: 'MB1', zone: 4 },
            S1:  { x: 20, y: 44, action: 'Ready for Cross-Sprint', role: 'S1', zone: 5 },
            L:   { x: 52, y: 76, action: 'Passing Deep Middle', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve Flight & S1 Sprint',
          title: 'Ball Crosses Net — S1 Sprints Across Court',
          narrative: 'Serve is in flight. S1 sprints diagonally across the court from left-back to the setting zone at right-front.',
          ball: { visible: true, x: 48, y: 68, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            MB2: { x: 78, y: 72, action: 'Tracking Play', role: 'MB2', zone: 1 },
            RS2: { x: 82, y: 22, action: 'Opening to Right Pin', role: 'RS2', zone: 2 },
            OH2: { x: 46, y: 66, action: 'Passing Platform', role: 'OH2', zone: 3 },
            MB1: { x: 30, y: 18, action: 'Transitioning to Middle', role: 'MB1', zone: 4 },
            S1:  { x: 48, y: 28, action: 'Sprinting Diagonally', role: 'S1', zone: 5 },
            L:   { x: 52, y: 74, action: 'Calling Ball', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. S1 at Net Target',
          title: 'Setter Arrives — 3 Hitters Approach',
          narrative: 'Pass arrives at target. S1 receives ball with hands high. OH2 approaches left pin, MB1 approaches middle, RS2 approaches right pin.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            MB2: { x: 76, y: 68, action: 'Base Defense', role: 'MB2', zone: 1 },
            RS2: { x: 84, y: 34, action: 'Right Pin Approach', role: 'RS2', zone: 2 },
            OH2: { x: 18, y: 38, action: 'Transitioning Left Pin', role: 'OH2', zone: 3 },
            MB1: { x: 46, y: 20, action: 'Timing Quick 1-Ball', role: 'MB1', zone: 4 },
            S1:  { x: 68, y: 14, action: 'Hands High at Target', role: 'S1', zone: 5 },
            L:   { x: 48, y: 64, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. 3-Hitter Attack',
          title: 'S1 Sets Middle Quick Attack',
          narrative: 'S1 feeds MB1 a blazing 1-ball in the middle, beating the opponent block.',
          ball: { visible: true, x: 48, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            MB2: { x: 76, y: 68, action: 'Covering', role: 'MB2', zone: 1 },
            RS2: { x: 84, y: 18, action: 'Right Pin Decoy', role: 'RS2', zone: 2 },
            OH2: { x: 16, y: 18, action: 'Left Pin Decoy', role: 'OH2', zone: 3 },
            MB1: { x: 48, y: 12, action: 'Spiking Quick 1-Ball', role: 'MB1', zone: 4 },
            S1:  { x: 68, y: 12, action: 'Quick Set Delivered', role: 'S1', zone: 5 },
            L:   { x: 42, y: 52, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack Kill',
          title: 'MB1 Scores Kill',
          narrative: 'MB1 slams the quick set straight down onto the 10ft line.',
          ball: { visible: true, x: 50, y: -28, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            MB2: { x: 80, y: 70, action: 'Base Right Back', role: 'MB2', zone: 1 },
            RS2: { x: 80, y: 16, action: 'Base Right Front', role: 'RS2', zone: 2 },
            OH2: { x: 20, y: 16, action: 'Base Left Front', role: 'OH2', zone: 3 },
            MB1: { x: 50, y: 16, action: 'Landing & Celebrating', role: 'MB1', zone: 4 },
            S1:  { x: 80, y: 70, action: 'Base Right Back', role: 'S1', zone: 5 },
            L:   { x: 50, y: 74, action: 'Base Middle Back', role: 'L', zone: 6 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Lineup',
          title: 'MB1 / Libero Serves from Zone 1',
          narrative: 'Server prepares to serve from Zone 1. 3 front-row blockers (RS2 in Z2, OH2 in Z3, MB2 in Z4) prepare to block.',
          ball: { visible: true, x: 82, y: 92, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            MB1: { x: 82, y: 92, action: 'Serving Baseline', role: 'MB1', zone: 1 },
            RS2: { x: 80, y: 18, action: 'Right Front Blocker', role: 'RS2', zone: 2 },
            OH2: { x: 50, y: 18, action: 'Middle Stack Blocker', role: 'OH2', zone: 3 },
            MB2: { x: 20, y: 18, action: 'Left Stack Blocker', role: 'MB2', zone: 4 },
            S1:  { x: 70, y: 68, action: 'Right Back Defense', role: 'S1', zone: 5 },
            L:   { x: 48, y: 74, action: 'Middle Back Defense', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve Delivery & Shift',
          title: 'Ball Crosses Net — Blockers Switch',
          narrative: 'Ball is served. OH2 moves to Left Front (Z4) and MB2 moves to Middle Front (Z3).',
          ball: { visible: true, x: 60, y: -25, scale: 0.9, shadowOpacity: 0.3 },
          positions: {
            MB1: { x: 78, y: 82, action: 'Entering to Middle Back', role: 'MB1', zone: 1 },
            RS2: { x: 80, y: 16, action: 'Holding Right Front', role: 'RS2', zone: 2 },
            OH2: { x: 20, y: 16, action: 'Switching to Left Front', role: 'OH2', zone: 3 },
            MB2: { x: 50, y: 16, action: 'Switching to Middle Front', role: 'MB2', zone: 4 },
            S1:  { x: 80, y: 70, action: 'Holding Right Back', role: 'S1', zone: 5 },
            L:   { x: 30, y: 74, action: 'Moving to Left Back', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Defense Setup',
          title: 'Front-Row Triple Block Set',
          narrative: 'Defense forms perimeter ready to dig opponent spike.',
          ball: { visible: false, x: 50, y: -30, scale: 0.8, shadowOpacity: 0 },
          positions: {
            MB1: { x: 50, y: 74, action: 'Middle Back Base', role: 'MB1', zone: 1 },
            RS2: { x: 80, y: 14, action: 'Right Pin Block', role: 'RS2', zone: 2 },
            OH2: { x: 20, y: 30, action: 'Off-Block Defense', role: 'OH2', zone: 3 },
            MB2: { x: 50, y: 14, action: 'Middle Read Block', role: 'MB2', zone: 4 },
            S1:  { x: 80, y: 70, action: 'Right Back Base', role: 'S1', zone: 5 },
            L:   { x: 20, y: 72, action: 'Left Back Base', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Dig & Counter-Attack',
          title: 'Dig Delivered — S1 Sets Right Side',
          narrative: 'Dig delivered to S1 who jump-sets RS2 on the right pin.',
          ball: { visible: true, x: 82, y: 12, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            MB1: { x: 48, y: 64, action: 'Covering Hitter', role: 'MB1', zone: 1 },
            RS2: { x: 82, y: 12, action: 'Spiking Right Pin', role: 'RS2', zone: 2 },
            OH2: { x: 18, y: 22, action: 'Left Pin Option', role: 'OH2', zone: 3 },
            MB2: { x: 48, y: 16, action: 'Middle Quick Decoy', role: 'MB2', zone: 4 },
            S1:  { x: 68, y: 14, action: 'Set Released', role: 'S1', zone: 5 },
            L:   { x: 24, y: 64, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Rally Won',
          title: 'RS2 Attacks Point Winner',
          narrative: 'RS2 tool-wipes the opponent block out of bounds for the point.',
          ball: { visible: true, x: 95, y: -20, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            MB1: { x: 50, y: 74, action: 'Celebrating', role: 'MB1', zone: 1 },
            RS2: { x: 80, y: 16, action: 'Celebrating Kill', role: 'RS2', zone: 2 },
            OH2: { x: 20, y: 16, action: 'Celebrating', role: 'OH2', zone: 3 },
            MB2: { x: 50, y: 16, action: 'Celebrating', role: 'MB2', zone: 4 },
            S1:  { x: 80, y: 70, action: 'Celebrating', role: 'S1', zone: 5 },
            L:   { x: 20, y: 72, action: 'Celebrating', role: 'L', zone: 6 }
          }
        }
      ]
    }
  },

  4: {
    rotation: 4,
    title: 'Rotation 4 (Setter 2 in Zone 1)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'Setter 2 (S2) Enters Back Row in Zone 1',
          narrative: 'Setter 2 (Z1) is now in the back row running the offense! S2 stacks behind OH2 (Z2). 3 front-row attackers (OH2, MB2, RS1) ready. OH2, Libero (Z6), and OH1 (Z5) form 3-passer cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S2:  { x: 78, y: 46, action: 'Ready to Penetrate', role: 'S2', zone: 1 },
            OH2: { x: 74, y: 70, action: 'Passing Right Seam', role: 'OH2', zone: 2 },
            MB2: { x: 48, y: 15, action: 'Ready at Net', role: 'MB2', zone: 3 },
            RS1: { x: 18, y: 24, action: '3rd Attacker Ready', role: 'RS1', zone: 4 },
            OH1: { x: 22, y: 72, action: 'Passing Left Seam', role: 'OH1', zone: 5 },
            L:   { x: 48, y: 76, action: 'Anchoring Middle', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — S2 Sprints to Target',
          narrative: 'Opponent serves. Passers read ball trajectory. Setter 2 accelerates forward to the net setting target.',
          ball: { visible: true, x: 38, y: 70, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            S2:  { x: 74, y: 32, action: 'Sprinting to Target', role: 'S2', zone: 1 },
            OH2: { x: 72, y: 68, action: 'Passing Platform', role: 'OH2', zone: 2 },
            MB2: { x: 48, y: 18, action: 'Tracking Pass', role: 'MB2', zone: 3 },
            RS1: { x: 24, y: 24, action: 'Opening to Attack Pin', role: 'RS1', zone: 4 },
            OH1: { x: 26, y: 70, action: 'Calling Ball', role: 'OH1', zone: 5 },
            L:   { x: 44, y: 74, action: 'Passing Ball', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. S2 at Target',
          title: 'Pass Delivered — 3 Front-Row Attackers Ready',
          narrative: 'Pass delivered to S2 at target (Zone 2.5). S2 sets feet with hands high. All 3 front-row hitters transition off net.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S2:  { x: 68, y: 14, action: 'Hands High at Target', role: 'S2', zone: 1 },
            OH2: { x: 80, y: 44, action: 'Transitioning Right', role: 'OH2', zone: 2 },
            MB2: { x: 48, y: 22, action: 'Timing Quick 1-Ball', role: 'MB2', zone: 3 },
            RS1: { x: 14, y: 38, action: 'Transitioning Left Pin', role: 'RS1', zone: 4 },
            OH1: { x: 26, y: 62, action: 'Moving to Cover', role: 'OH1', zone: 5 },
            L:   { x: 46, y: 62, action: 'Following Pass', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. 3-Hitter Routes & Set Release',
          title: 'S2 Sets Left Pin — 3 Hitters Explode',
          narrative: 'Setter 2 jump-sets high to RS1 on left pin while MB2 runs middle quick decoy.',
          ball: { visible: true, x: 14, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S2:  { x: 68, y: 12, action: 'Jump Set Released', role: 'S2', zone: 1 },
            OH2: { x: 84, y: 20, action: 'Right Pin Approach', role: 'OH2', zone: 2 },
            MB2: { x: 48, y: 12, action: 'Jumping Quick Decoy', role: 'MB2', zone: 3 },
            RS1: { x: 14, y: 12, action: 'Spiking Left Pin', role: 'RS1', zone: 4 },
            OH1: { x: 24, y: 48, action: 'Covering Hitter', role: 'OH1', zone: 5 },
            L:   { x: 40, y: 52, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Base Defense',
          title: 'Spike Scores — Team in Base Defense',
          narrative: 'RS1 spikes into opponent court. Team assumes base defense (S2 Right Back, OH1 Left Back, Libero Middle Back).',
          ball: { visible: true, x: 20, y: -30, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S2:  { x: 80, y: 68, action: 'Base Right Back', role: 'S2', zone: 1 },
            OH2: { x: 80, y: 20, action: 'Ready for Block/Cover', role: 'OH2', zone: 2 },
            MB2: { x: 50, y: 16, action: 'Landing & Tracking', role: 'MB2', zone: 3 },
            RS1: { x: 18, y: 18, action: 'Left Pin Block/Defense', role: 'RS1', zone: 4 },
            OH1: { x: 20, y: 70, action: 'Base Left Back', role: 'OH1', zone: 5 },
            L:   { x: 50, y: 74, action: 'Base Middle Back', role: 'L', zone: 6 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Lineup',
          title: 'Setter 2 Serves from Baseline',
          narrative: 'Setter 2 lines up to serve behind Zone 1. 3 front-row blockers stack at the net.',
          ball: { visible: true, x: 82, y: 92, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S2:  { x: 82, y: 92, action: 'Serving Baseline', role: 'S2', zone: 1 },
            OH2: { x: 65, y: 18, action: 'Stacking at Net', role: 'OH2', zone: 2 },
            MB2: { x: 50, y: 18, action: 'Stacking at Net', role: 'MB2', zone: 3 },
            RS1: { x: 35, y: 18, action: 'Stacking at Net', role: 'RS1', zone: 4 },
            OH1: { x: 22, y: 72, action: 'Left Back Ready', role: 'OH1', zone: 5 },
            L:   { x: 50, y: 74, action: 'Middle Back Ready', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve Delivery & Shift',
          title: 'Ball Crosses Net — Blockers Switch',
          narrative: 'S2 delivers serve. OH2 switches to Left Front (Z4) and RS1 switches to Right Front (Z2).',
          ball: { visible: true, x: 60, y: -25, scale: 0.9, shadowOpacity: 0.3 },
          positions: {
            S2:  { x: 80, y: 84, action: 'Entering Court', role: 'S2', zone: 1 },
            OH2: { x: 30, y: 16, action: 'Switching to Left Front', role: 'OH2', zone: 2 },
            MB2: { x: 50, y: 16, action: 'Holding Middle Front', role: 'MB2', zone: 3 },
            RS1: { x: 70, y: 16, action: 'Switching to Right Front', role: 'RS1', zone: 4 },
            OH1: { x: 20, y: 70, action: 'Reading Pass', role: 'OH1', zone: 5 },
            L:   { x: 50, y: 74, action: 'Reading Pass', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Read Opponent Attack',
          title: 'Triple Block Established',
          narrative: 'Front row forms double block on opponent hitter while back row sets perimeter.',
          ball: { visible: false, x: 50, y: -30, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S2:  { x: 80, y: 68, action: 'Digging Line / Tip', role: 'S2', zone: 1 },
            OH2: { x: 20, y: 32, action: 'Off-Block Defense', role: 'OH2', zone: 2 },
            MB2: { x: 68, y: 14, action: 'Closing Double Block', role: 'MB2', zone: 3 },
            RS1: { x: 78, y: 14, action: 'Setting Right Pin Block', role: 'RS1', zone: 4 },
            OH1: { x: 24, y: 68, action: 'Digging Deep Cross', role: 'OH1', zone: 5 },
            L:   { x: 50, y: 72, action: 'Digging Middle Seam', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Dig & S2 Set',
          title: 'Libero Digs — S2 Counter-Sets Outside',
          narrative: 'Libero digs spike cleanly. S2 sprints from Right Back to deliver a perfect set to OH2 on left pin.',
          ball: { visible: true, x: 18, y: 12, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S2:  { x: 68, y: 14, action: 'Set Released', role: 'S2', zone: 1 },
            OH2: { x: 18, y: 12, action: 'Spiking Left Pin', role: 'OH2', zone: 2 },
            MB2: { x: 50, y: 16, action: 'Middle Quick Decoy', role: 'MB2', zone: 3 },
            RS1: { x: 82, y: 22, action: 'Right Pin Option', role: 'RS1', zone: 4 },
            OH1: { x: 24, y: 56, action: 'Covering Hitter', role: 'OH1', zone: 5 },
            L:   { x: 48, y: 64, action: 'Recovering from Dig', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Rally Kill',
          title: 'OH2 Strikes Terminal Spike',
          narrative: 'OH2 bounces the ball cross-court for the point.',
          ball: { visible: true, x: 20, y: -30, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S2:  { x: 80, y: 70, action: 'Celebrating Kill', role: 'S2', zone: 1 },
            OH2: { x: 18, y: 16, action: 'Celebrating Point', role: 'OH2', zone: 2 },
            MB2: { x: 50, y: 16, action: 'Celebrating', role: 'MB2', zone: 3 },
            RS1: { x: 80, y: 16, action: 'Celebrating', role: 'RS1', zone: 4 },
            OH1: { x: 20, y: 70, action: 'Celebrating', role: 'OH1', zone: 5 },
            L:   { x: 50, y: 74, action: 'Celebrating', role: 'L', zone: 6 }
          }
        }
      ]
    }
  },

  5: {
    rotation: 5,
    title: 'Rotation 5 (Setter 2 in Zone 6)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'S2 Stacks in Middle Back (Zone 6)',
          narrative: 'Setter 2 (Z6) stacks closely behind MB2 (Z2). OH1 drops from Zone 4 to pass left seam with Libero (Z5) and OH2 (Z1). 3 front-row hitters ready (OH1, MB2, RS1).',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            OH2: { x: 78, y: 72, action: 'Passing Right Seam', role: 'OH2', zone: 1 },
            MB2: { x: 64, y: 15, action: 'Shielding S2 at Net', role: 'MB2', zone: 2 },
            RS1: { x: 36, y: 18, action: 'Front-Row Right Hitter', role: 'RS1', zone: 3 },
            OH1: { x: 20, y: 68, action: 'Passing Left Seam', role: 'OH1', zone: 4 },
            L:   { x: 48, y: 74, action: 'Passing Middle Seam', role: 'L', zone: 5 },
            S2:  { x: 62, y: 42, action: 'Stacked Behind MB2', role: 'S2', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'S2 Penetrates from Middle Back',
          narrative: 'Ball is served. Setter 2 accelerates into the setting slot between Zones 2 and 3.',
          ball: { visible: true, x: 52, y: 70, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            OH2: { x: 76, y: 70, action: 'Calling In/Out', role: 'OH2', zone: 1 },
            MB2: { x: 60, y: 18, action: 'Tracking Pass', role: 'MB2', zone: 2 },
            RS1: { x: 45, y: 22, action: 'Opening to Pin', role: 'RS1', zone: 3 },
            OH1: { x: 24, y: 66, action: 'Platform Angle', role: 'OH1', zone: 4 },
            L:   { x: 48, y: 72, action: 'Passing Ball', role: 'L', zone: 5 },
            S2:  { x: 66, y: 26, action: 'Sprinting Forward', role: 'S2', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. S2 at Setting Slot',
          title: 'Setter Hands High — 3 Hitters Transition',
          narrative: 'Pass arrives at setting target. S2 sets up. OH1 transitions to left pin, MB2 runs 1-ball in middle, RS1 transitions to right pin.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            OH2: { x: 74, y: 64, action: 'Moving to Cover', role: 'OH2', zone: 1 },
            MB2: { x: 50, y: 22, action: 'Timing Quick 1-Ball', role: 'MB2', zone: 2 },
            RS1: { x: 78, y: 38, action: 'Transitioning Right Pin', role: 'RS1', zone: 3 },
            OH1: { x: 14, y: 38, action: 'Transitioning Left Pin', role: 'OH1', zone: 4 },
            L:   { x: 46, y: 62, action: 'Following Pass', role: 'L', zone: 5 },
            S2:  { x: 68, y: 14, action: 'Hands High at Target', role: 'S2', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. 3-Hitter Routes & Set',
          title: 'S2 Releases Set to Outside Hitter',
          narrative: 'S2 sets a fast tempo ball to OH1 on the left pin while MB2 draws the middle blocker.',
          ball: { visible: true, x: 16, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            OH2: { x: 70, y: 56, action: 'Covering Hitter', role: 'OH2', zone: 1 },
            MB2: { x: 50, y: 12, action: 'Jumping Quick Decoy', role: 'MB2', zone: 2 },
            RS1: { x: 82, y: 18, action: 'Right Pin Ready', role: 'RS1', zone: 3 },
            OH1: { x: 16, y: 12, action: 'Spiking Left Pin', role: 'OH1', zone: 4 },
            L:   { x: 38, y: 52, action: 'Covering Hitter', role: 'L', zone: 5 },
            S2:  { x: 68, y: 12, action: 'Jump Set Released', role: 'S2', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Base Defense',
          title: 'Spike Scores — Team in Base Defense',
          narrative: 'OH1 finishes the attack and team assumes defensive base (S2 Right Back, Libero Middle, OH2 Left Back).',
          ball: { visible: true, x: 22, y: -30, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            OH2: { x: 20, y: 70, action: 'Base Left Back', role: 'OH2', zone: 1 },
            MB2: { x: 50, y: 16, action: 'Base Middle Front', role: 'MB2', zone: 2 },
            RS1: { x: 80, y: 16, action: 'Base Right Front', role: 'RS1', zone: 3 },
            OH1: { x: 20, y: 16, action: 'Base Left Front', role: 'OH1', zone: 4 },
            L:   { x: 50, y: 74, action: 'Base Middle Back', role: 'L', zone: 5 },
            S2:  { x: 80, y: 70, action: 'Base Right Back', role: 'S2', zone: 6 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Lineup',
          title: 'OH2 Serves — 3 Front-Row Blockers Ready',
          narrative: 'OH2 serves from Zone 1. 3 front-row blockers (MB2, RS1, OH1) prepare to defend against opponent attack.',
          ball: { visible: true, x: 82, y: 92, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            OH2: { x: 82, y: 92, action: 'Serving Baseline', role: 'OH2', zone: 1 },
            MB2: { x: 65, y: 18, action: 'Stacking at Net', role: 'MB2', zone: 2 },
            RS1: { x: 45, y: 18, action: 'Stacking at Net', role: 'RS1', zone: 3 },
            OH1: { x: 25, y: 18, action: 'Left Front Blocker', role: 'OH1', zone: 4 },
            L:   { x: 50, y: 74, action: 'Middle Back Ready', role: 'L', zone: 5 },
            S2:  { x: 70, y: 68, action: 'Right Back Ready', role: 'S2', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve Flight & Block Shift',
          title: 'Ball Crosses Net — Blockers Switch',
          narrative: 'Serve crosses net. MB2 moves to Middle Front (Z3) and RS1 moves to Right Front (Z2).',
          ball: { visible: true, x: 60, y: -25, scale: 0.9, shadowOpacity: 0.3 },
          positions: {
            OH2: { x: 78, y: 84, action: 'Moving to Left Back', role: 'OH2', zone: 1 },
            MB2: { x: 50, y: 16, action: 'Holding Middle Front', role: 'MB2', zone: 2 },
            RS1: { x: 80, y: 16, action: 'Switching to Right Front', role: 'RS1', zone: 3 },
            OH1: { x: 20, y: 16, action: 'Holding Left Front', role: 'OH1', zone: 4 },
            L:   { x: 50, y: 74, action: 'Middle Back Defense', role: 'L', zone: 5 },
            S2:  { x: 80, y: 70, action: 'Right Back Defense', role: 'S2', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Defense Setup',
          title: 'Front-Row Triple Block Set',
          narrative: 'Team establishes perimeter defense ready to dig opponent hit.',
          ball: { visible: false, x: 50, y: -30, scale: 0.8, shadowOpacity: 0 },
          positions: {
            OH2: { x: 20, y: 72, action: 'Left Back Base', role: 'OH2', zone: 1 },
            MB2: { x: 50, y: 14, action: 'Read Blocking Middle', role: 'MB2', zone: 2 },
            RS1: { x: 80, y: 14, action: 'Right Pin Block', role: 'RS1', zone: 3 },
            OH1: { x: 20, y: 30, action: 'Off-Block Defense', role: 'OH1', zone: 4 },
            L:   { x: 50, y: 74, action: 'Middle Back Base', role: 'L', zone: 5 },
            S2:  { x: 80, y: 70, action: 'Right Back Base', role: 'S2', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Dig & S2 Set',
          title: 'OH2 Digs — S2 Delivers Counter-Set',
          narrative: 'OH2 digs from left back. S2 delivers back-set to RS1 on right pin.',
          ball: { visible: true, x: 80, y: 12, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            OH2: { x: 22, y: 68, action: 'Recovering from Dig', role: 'OH2', zone: 1 },
            MB2: { x: 48, y: 16, action: 'Middle Quick Decoy', role: 'MB2', zone: 2 },
            RS1: { x: 80, y: 12, action: 'Spiking Right Pin', role: 'RS1', zone: 3 },
            OH1: { x: 18, y: 22, action: 'Left Pin Option', role: 'OH1', zone: 4 },
            L:   { x: 48, y: 64, action: 'Covering Hitter', role: 'L', zone: 5 },
            S2:  { x: 68, y: 14, action: 'Back-Set Released', role: 'S2', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack Finish',
          title: 'RS1 Strikes Winner',
          narrative: 'RS1 pounds the ball cross-court for a kill.',
          ball: { visible: true, x: 75, y: -30, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            OH2: { x: 20, y: 70, action: 'Base Left Back', role: 'OH2', zone: 1 },
            MB2: { x: 50, y: 16, action: 'Base Middle Front', role: 'MB2', zone: 2 },
            RS1: { x: 80, y: 16, action: 'Landing & Celebrating', role: 'RS1', zone: 3 },
            OH1: { x: 20, y: 16, action: 'Base Left Front', role: 'OH1', zone: 4 },
            L:   { x: 50, y: 74, action: 'Base Middle Back', role: 'L', zone: 5 },
            S2:  { x: 80, y: 70, action: 'Base Right Back', role: 'S2', zone: 6 }
          }
        }
      ]
    }
  },

  6: {
    rotation: 6,
    title: 'Rotation 6 (Setter 2 in Zone 5)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'S2 in Left Back (Zone 5) Pushes Up',
          narrative: 'Setter 2 (Z5) starts behind OH1 (Z3) on left side. 3 front-row attackers (OH1, MB2, RS1) ready. OH1, Libero (Z6), and OH2 (Z1) form 3-passer cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            MB1: { x: 80, y: 74, action: 'Right Back Defense', role: 'MB1', zone: 1 },
            RS1: { x: 80, y: 16, action: 'Front-Row Right Hitter', role: 'RS1', zone: 2 },
            OH1: { x: 48, y: 68, action: 'Passing Middle Seam', role: 'OH1', zone: 3 },
            MB2: { x: 20, y: 16, action: 'Front-Row Middle', role: 'MB2', zone: 4 },
            S2:  { x: 20, y: 44, action: 'Ready for Cross-Sprint', role: 'S2', zone: 5 },
            L:   { x: 52, y: 76, action: 'Passing Deep Middle', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve Flight & S2 Sprint',
          title: 'Ball Crosses Net — S2 Sprints Across Court',
          narrative: 'Serve in flight. S2 sprints diagonally from left-back to the setting zone at right-front.',
          ball: { visible: true, x: 48, y: 68, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            MB1: { x: 78, y: 72, action: 'Tracking Play', role: 'MB1', zone: 1 },
            RS1: { x: 82, y: 22, action: 'Opening to Right Pin', role: 'RS1', zone: 2 },
            OH1: { x: 46, y: 66, action: 'Passing Platform', role: 'OH1', zone: 3 },
            MB2: { x: 30, y: 18, action: 'Transitioning to Middle', role: 'MB2', zone: 4 },
            S2:  { x: 48, y: 28, action: 'Sprinting Diagonally', role: 'S2', zone: 5 },
            L:   { x: 52, y: 74, action: 'Calling Ball', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. S2 at Net Target',
          title: 'Setter Arrives — 3 Hitters Approach',
          narrative: 'Pass arrives at target. S2 receives ball with hands high. OH1 approaches left pin, MB2 approaches middle, RS1 approaches right pin.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            MB1: { x: 76, y: 68, action: 'Base Defense', role: 'MB1', zone: 1 },
            RS1: { x: 84, y: 34, action: 'Right Pin Approach', role: 'RS1', zone: 2 },
            OH1: { x: 18, y: 38, action: 'Transitioning Left Pin', role: 'OH1', zone: 3 },
            MB2: { x: 46, y: 20, action: 'Timing Quick 1-Ball', role: 'MB2', zone: 4 },
            S2:  { x: 68, y: 14, action: 'Hands High at Target', role: 'S2', zone: 5 },
            L:   { x: 48, y: 64, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. 3-Hitter Attack',
          title: 'S2 Sets Middle Quick Attack',
          narrative: 'S2 feeds MB2 a blazing 1-ball in the middle, beating the opponent block.',
          ball: { visible: true, x: 48, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            MB1: { x: 76, y: 68, action: 'Covering', role: 'MB1', zone: 1 },
            RS1: { x: 84, y: 18, action: 'Right Pin Decoy', role: 'RS1', zone: 2 },
            OH1: { x: 16, y: 18, action: 'Left Pin Decoy', role: 'OH1', zone: 3 },
            MB2: { x: 48, y: 12, action: 'Spiking Quick 1-Ball', role: 'MB2', zone: 4 },
            S2:  { x: 68, y: 12, action: 'Quick Set Delivered', role: 'S2', zone: 5 },
            L:   { x: 42, y: 52, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack Kill',
          title: 'MB2 Scores Kill',
          narrative: 'MB2 slams the quick set straight down onto the 10ft line.',
          ball: { visible: true, x: 50, y: -28, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            MB1: { x: 80, y: 70, action: 'Base Right Back', role: 'MB1', zone: 1 },
            RS1: { x: 80, y: 16, action: 'Base Right Front', role: 'RS1', zone: 2 },
            OH1: { x: 20, y: 16, action: 'Base Left Front', role: 'OH1', zone: 3 },
            MB2: { x: 50, y: 16, action: 'Landing & Celebrating', role: 'MB2', zone: 4 },
            S2:  { x: 80, y: 70, action: 'Base Right Back', role: 'S2', zone: 5 },
            L:   { x: 50, y: 74, action: 'Base Middle Back', role: 'L', zone: 6 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Lineup',
          title: 'MB2 / Libero Serves from Zone 1',
          narrative: 'Server prepares to serve from Zone 1. 3 front-row blockers (RS1 in Z2, OH1 in Z3, MB1 in Z4) prepare to block.',
          ball: { visible: true, x: 82, y: 92, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            MB2: { x: 82, y: 92, action: 'Serving Baseline', role: 'MB2', zone: 1 },
            RS1: { x: 80, y: 18, action: 'Right Front Blocker', role: 'RS1', zone: 2 },
            OH1: { x: 50, y: 18, action: 'Middle Stack Blocker', role: 'OH1', zone: 3 },
            MB1: { x: 20, y: 18, action: 'Left Stack Blocker', role: 'MB1', zone: 4 },
            S2:  { x: 70, y: 68, action: 'Right Back Defense', role: 'S2', zone: 5 },
            L:   { x: 48, y: 74, action: 'Middle Back Defense', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve Delivery & Shift',
          title: 'Ball Crosses Net — Blockers Switch',
          narrative: 'Ball is served. OH1 moves to Left Front (Z4) and MB1 moves to Middle Front (Z3).',
          ball: { visible: true, x: 60, y: -25, scale: 0.9, shadowOpacity: 0.3 },
          positions: {
            MB2: { x: 78, y: 82, action: 'Entering to Middle Back', role: 'MB2', zone: 1 },
            RS1: { x: 80, y: 16, action: 'Holding Right Front', role: 'RS1', zone: 2 },
            OH1: { x: 20, y: 16, action: 'Switching to Left Front', role: 'OH1', zone: 3 },
            MB1: { x: 50, y: 16, action: 'Switching to Middle Front', role: 'MB1', zone: 4 },
            S2:  { x: 80, y: 70, action: 'Holding Right Back', role: 'S2', zone: 5 },
            L:   { x: 30, y: 74, action: 'Moving to Left Back', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Defense Setup',
          title: 'Front-Row Triple Block Set',
          narrative: 'Defense forms perimeter ready to dig opponent spike.',
          ball: { visible: false, x: 50, y: -30, scale: 0.8, shadowOpacity: 0 },
          positions: {
            MB2: { x: 50, y: 74, action: 'Middle Back Base', role: 'MB2', zone: 1 },
            RS1: { x: 80, y: 14, action: 'Right Pin Block', role: 'RS1', zone: 2 },
            OH1: { x: 20, y: 30, action: 'Off-Block Defense', role: 'OH1', zone: 3 },
            MB1: { x: 50, y: 14, action: 'Middle Read Block', role: 'MB1', zone: 4 },
            S2:  { x: 80, y: 70, action: 'Right Back Base', role: 'S2', zone: 5 },
            L:   { x: 20, y: 72, action: 'Left Back Base', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Dig & Counter-Attack',
          title: 'Dig Delivered — S2 Sets Right Side',
          narrative: 'Dig delivered to S2 who jump-sets RS1 on the right pin.',
          ball: { visible: true, x: 82, y: 12, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            MB2: { x: 48, y: 64, action: 'Covering Hitter', role: 'MB2', zone: 1 },
            RS1: { x: 82, y: 12, action: 'Spiking Right Pin', role: 'RS1', zone: 2 },
            OH1: { x: 18, y: 22, action: 'Left Pin Option', role: 'OH1', zone: 3 },
            MB1: { x: 48, y: 16, action: 'Middle Quick Decoy', role: 'MB1', zone: 4 },
            S2:  { x: 68, y: 14, action: 'Set Released', role: 'S2', zone: 5 },
            L:   { x: 24, y: 64, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Rally Won',
          title: 'RS1 Attacks Point Winner',
          narrative: 'RS1 tool-wipes the opponent block out of bounds for the point.',
          ball: { visible: true, x: 95, y: -20, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            MB2: { x: 50, y: 74, action: 'Celebrating', role: 'MB2', zone: 1 },
            RS1: { x: 80, y: 16, action: 'Celebrating Kill', role: 'RS1', zone: 2 },
            OH1: { x: 20, y: 16, action: 'Celebrating', role: 'OH1', zone: 3 },
            MB1: { x: 50, y: 16, action: 'Celebrating', role: 'MB1', zone: 4 },
            S2:  { x: 80, y: 70, action: 'Celebrating', role: 'S2', zone: 5 },
            L:   { x: 20, y: 72, action: 'Celebrating', role: 'L', zone: 6 }
          }
        }
      ]
    }
  }
};
