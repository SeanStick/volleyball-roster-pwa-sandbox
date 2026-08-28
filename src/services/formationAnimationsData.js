/**
 * 6-1 Volleyball Multi-Stage Tactical Animation Data
 *
 * Each rotation contains 5 granular animation stages for both 'receiving' and 'serving':
 * Stage 1: Initial Setup / Stack
 * Stage 2: Ball Crosses Net / Serve Flight
 * Stage 3: Setter Penetration & Pass to Target
 * Stage 4: Set Release & Hitters Approach
 * Stage 5: Attack Strike, Coverage Cup & Base Transition
 */

export const FORMATION_ANIMATIONS = {
  1: {
    rotation: 1,
    title: 'Rotation 1 (Setter in Zone 1)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'Initial Serve-Receive Overlap Stack',
          narrative: 'Setter (Z1) is stacked closely behind OH1 (Z2) on the right side. OH1, Libero (Z6), and OH2 (Z5) form the primary 3-passer serve receive cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S:   { x: 78, y: 46, action: 'Ready to Penetrate', role: 'S', zone: 1 },
            OH1: { x: 74, y: 70, action: 'Passing Right Seam', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 15, action: 'Ready at Net', role: 'MB1', zone: 3 },
            OPP: { x: 18, y: 24, action: 'Left Pin Ready', role: 'OPP', zone: 4 },
            OH2: { x: 22, y: 72, action: 'Passing Left Seam', role: 'OH2', zone: 5 },
            L:   { x: 48, y: 76, action: 'Anchoring Middle', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — Passers Form Platform',
          narrative: 'Opponent serves high over the net. Passers read ball trajectory and square up platforms. Setter begins forward penetration sprint toward the net.',
          ball: { visible: true, x: 38, y: 70, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            S:   { x: 74, y: 32, action: 'Sprinting to Target', role: 'S', zone: 1 },
            OH1: { x: 72, y: 68, action: 'Passing Platform', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 18, action: 'Tracking Pass', role: 'MB1', zone: 3 },
            OPP: { x: 14, y: 32, action: 'Opening to Left Pin', role: 'OPP', zone: 4 },
            OH2: { x: 26, y: 70, action: 'Calling In/Out', role: 'OH2', zone: 5 },
            L:   { x: 44, y: 74, action: 'Passing Ball', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Setter to Target',
          title: 'Pass Delivered to Target (Zone 2.5)',
          narrative: 'Libero delivers a perfect pass to the setter target spot (Zone 2.5 near net). Setter sets feet with hands high. Hitters transition off the net.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S:   { x: 68, y: 14, action: 'Hands High at Target', role: 'S', zone: 1 },
            OH1: { x: 80, y: 44, action: 'Transitioning Right', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 22, action: 'Timing Quick 1-Ball', role: 'MB1', zone: 3 },
            OPP: { x: 12, y: 38, action: 'Transitioning Left Pin', role: 'OPP', zone: 4 },
            OH2: { x: 26, y: 62, action: 'Moving to Cover', role: 'OH2', zone: 5 },
            L:   { x: 46, y: 62, action: 'Following Pass', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Set & Approach',
          title: 'Setter Releases Ball — Hitters Approach',
          narrative: 'Setter jump-sets a high ball to the left pin (OPP) while Middle Blocker runs an aggressive 1-ball decoy. Hitters explode into 4-step approach.',
          ball: { visible: true, x: 14, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S:   { x: 68, y: 12, action: 'Jump Set Released', role: 'S', zone: 1 },
            OH1: { x: 84, y: 20, action: 'Right Pin Approach', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 12, action: 'Jumping Quick Decoy', role: 'MB1', zone: 3 },
            OPP: { x: 14, y: 12, action: 'Spiking Left Pin', role: 'OPP', zone: 4 },
            OH2: { x: 24, y: 48, action: 'Covering Hitter', role: 'OH2', zone: 5 },
            L:   { x: 40, y: 52, action: 'Covering Hitter', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Coverage',
          title: 'Attack Executed — Team Collapses into Coverage Cup',
          narrative: 'OPP drives ball past the opposing block into opponent court. Non-attacking players collapse into a tight 2-3 coverage cup around the hitter.',
          ball: { visible: true, x: 10, y: -20, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S:   { x: 56, y: 22, action: 'Coverage Cup (Deep)', role: 'S', zone: 1 },
            OH1: { x: 80, y: 24, action: 'Off-Side Coverage', role: 'OH1', zone: 2 },
            MB1: { x: 36, y: 20, action: 'Coverage Cup (Close)', role: 'MB1', zone: 3 },
            OPP: { x: 14, y: 10, action: 'Landing & Transition', role: 'OPP', zone: 4 },
            OH2: { x: 20, y: 38, action: 'Coverage Cup (Left)', role: 'OH2', zone: 5 },
            L:   { x: 32, y: 46, action: 'Coverage Anchor', role: 'L', zone: 6 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Setup',
          title: 'Setter at Baseline — Front Row Clustered',
          narrative: 'Setter (Z1) prepares to serve from behind the baseline. Front-row players (OH1, MB1, OPP) line up ready to switch to their specialty base positions immediately.',
          ball: { visible: true, x: 84, y: 94, scale: 1.0, shadowOpacity: 0.9 },
          positions: {
            S:   { x: 84, y: 94, action: 'Serving Baseline', role: 'S', zone: 1 },
            OH1: { x: 24, y: 16, action: 'Ready to Switch Left', role: 'OH1', zone: 2 },
            MB1: { x: 50, y: 16, action: 'Middle Blocker Base', role: 'MB1', zone: 3 },
            OPP: { x: 76, y: 16, action: 'Ready to Switch Right', role: 'OPP', zone: 4 },
            OH2: { x: 22, y: 72, action: 'Left Back Base', role: 'OH2', zone: 5 },
            L:   { x: 50, y: 74, action: 'Middle Back Base', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — Blockers Execute Switch',
          narrative: 'Serve travels fast over the net into opponent court. Front-row players execute immediate cross-court switches to their base defensive blocking spots.',
          ball: { visible: true, x: 50, y: -25, scale: 0.9, shadowOpacity: 0.2 },
          positions: {
            S:   { x: 82, y: 84, action: 'Stepping into Court', role: 'S', zone: 1 },
            OH1: { x: 18, y: 16, action: 'Switching Left Pin', role: 'OH1', zone: 2 },
            MB1: { x: 50, y: 16, action: 'Middle Block Ready', role: 'MB1', zone: 3 },
            OPP: { x: 82, y: 16, action: 'Switching Right Pin', role: 'OPP', zone: 4 },
            OH2: { x: 22, y: 72, action: 'Left Back Perimeter', role: 'OH2', zone: 5 },
            L:   { x: 50, y: 74, action: 'Middle Back Deep', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Base Defense',
          title: 'Full Base Defensive Alignment',
          narrative: 'Setter moves up to Right Back (Zone 1) defense. OH1 anchors Left Front block (Zone 4), MB1 ready in Middle Front (Zone 3), OPP at Right Front block (Zone 2).',
          ball: { visible: true, x: 20, y: -20, scale: 1.1, shadowOpacity: 0.3 },
          positions: {
            S:   { x: 80, y: 70, action: 'Right Back Dig', role: 'S', zone: 1 },
            OH1: { x: 16, y: 16, action: 'Left Pin Block', role: 'OH1', zone: 2 },
            MB1: { x: 50, y: 16, action: 'Reading Opponent Set', role: 'MB1', zone: 3 },
            OPP: { x: 84, y: 16, action: 'Right Pin Block', role: 'OPP', zone: 4 },
            OH2: { x: 22, y: 70, action: 'Left Back Cross-Court', role: 'OH2', zone: 5 },
            L:   { x: 50, y: 76, action: 'Reading Tips & Deep', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Block & Dig',
          title: 'Double Block on Pin — Defense Shifts',
          narrative: 'Opponent sets their outside hitter. MB1 closes to OPP to form a 2-person roof block on right side. Back row rotates to dig cross-court and cover tip.',
          ball: { visible: true, x: 82, y: 4, scale: 1.2, shadowOpacity: 0.9 },
          positions: {
            S:   { x: 76, y: 58, action: 'Digging Line / Tip', role: 'S', zone: 1 },
            OH1: { x: 20, y: 28, action: 'Pulling Off Net to Hit', role: 'OH1', zone: 2 },
            MB1: { x: 74, y: 10, action: 'Closing Double Block', role: 'MB1', zone: 3 },
            OPP: { x: 84, y: 10, action: 'Pin Block Anchor', role: 'OPP', zone: 4 },
            OH2: { x: 26, y: 64, action: 'Digging Angle Cross', role: 'OH2', zone: 5 },
            L:   { x: 52, y: 70, action: 'Deep Angle Dig', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Transition Attack',
          title: 'Dig to Setter — Transition Counter-Attack',
          narrative: 'Libero digs the spike up to Setter target (Zone 2.5). Blockers land and rapidly transition off the net ready for the counter-attack kill!',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.8 },
          positions: {
            S:   { x: 68, y: 14, action: 'Setting Counter-Attack', role: 'S', zone: 1 },
            OH1: { x: 14, y: 36, action: 'Transitioning Left Pin', role: 'OH1', zone: 2 },
            MB1: { x: 48, y: 22, action: 'Transitioning Quick', role: 'MB1', zone: 3 },
            OPP: { x: 86, y: 34, action: 'Transitioning Right Pin', role: 'OPP', zone: 4 },
            OH2: { x: 28, y: 60, action: 'Supporting & Covering', role: 'OH2', zone: 5 },
            L:   { x: 48, y: 64, action: 'Coverage Positioning', role: 'L', zone: 6 }
          }
        }
      ]
    }
  },

  2: {
    rotation: 2,
    title: 'Rotation 2 (Setter in Zone 6)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'Setter Stacked Behind MB1 in Center',
          narrative: 'Setter (Z6) stacks directly behind MB1 (Z2) at the net. Passers (OH2 in Z4, Libero in Z6 area, OH1 in Z2 area) form the 3-passer cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S:   { x: 48, y: 45, action: 'Ready to Sprint', role: 'S', zone: 6 },
            OH1: { x: 78, y: 70, action: 'Passing Right Seam', role: 'OH1', zone: 1 },
            MB1: { x: 78, y: 16, action: 'Shielding at Net', role: 'MB1', zone: 2 },
            OPP: { x: 18, y: 18, action: 'Left Pin Ready', role: 'OPP', zone: 3 },
            OH2: { x: 18, y: 68, action: 'Passing Left Seam', role: 'OH2', zone: 4 },
            L:   { x: 48, y: 74, action: 'Passing Middle Seam', role: 'L', zone: 5 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — Setter Sprints Right',
          narrative: 'Serve crosses net. Setter bursts forward through the seam toward the right-front target. Passers prepare platform.',
          ball: { visible: true, x: 74, y: 68, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            S:   { x: 58, y: 26, action: 'Sprinting to Target', role: 'S', zone: 6 },
            OH1: { x: 76, y: 68, action: 'Passing Ball', role: 'OH1', zone: 1 },
            MB1: { x: 62, y: 18, action: 'Moving to Middle', role: 'MB1', zone: 2 },
            OPP: { x: 16, y: 28, action: 'Pulling Off Net', role: 'OPP', zone: 3 },
            OH2: { x: 22, y: 64, action: 'Platform Angle', role: 'OH2', zone: 4 },
            L:   { x: 46, y: 72, action: 'Calling Seam', role: 'L', zone: 5 }
          }
        },
        {
          id: 3,
          name: '3. Setter to Target',
          title: 'Setter Arrives at Target Spot',
          narrative: 'Setter squares to left pin at Zone 2.5 target. OH1 delivers accurate pass. OH2 pulls outside court boundary to prepare left pin approach.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S:   { x: 68, y: 14, action: 'Target Set Stance', role: 'S', zone: 6 },
            OH1: { x: 74, y: 58, action: 'Moving Up to Cover', role: 'OH1', zone: 1 },
            MB1: { x: 48, y: 20, action: 'Transitioning Quick', role: 'MB1', zone: 2 },
            OPP: { x: 84, y: 38, action: 'Transitioning Right Pin', role: 'OPP', zone: 3 },
            OH2: { x: 12, y: 38, action: 'Transitioning Left Pin', role: 'OH2', zone: 4 },
            L:   { x: 46, y: 62, action: 'Covering Center', role: 'L', zone: 5 }
          }
        },
        {
          id: 4,
          name: '4. Set & Approach',
          title: 'High Set to Outside Pin (OH2)',
          narrative: 'Setter delivers clean set to OH2 on left pin. MB1 runs 1-ball decoy. OH2 accelerates into 4-step spike approach.',
          ball: { visible: true, x: 14, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S:   { x: 68, y: 12, action: 'Set Delivered', role: 'S', zone: 6 },
            OH1: { x: 70, y: 52, action: 'Covering Right', role: 'OH1', zone: 1 },
            MB1: { x: 48, y: 10, action: 'Decoy Quick Jump', role: 'MB1', zone: 2 },
            OPP: { x: 84, y: 18, action: 'Right Pin Approach', role: 'OPP', zone: 3 },
            OH2: { x: 14, y: 10, action: 'Spiking Left Pin', role: 'OH2', zone: 4 },
            L:   { x: 38, y: 52, action: 'Coverage Cup', role: 'L', zone: 5 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Coverage',
          title: 'Attack Strikes Opponent Floor — Coverage in Place',
          narrative: 'OH2 terminates the rally. Team forms tight coverage cup around OH2 to protect against block deflection.',
          ball: { visible: true, x: 10, y: -20, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S:   { x: 56, y: 22, action: 'Coverage Cup (Deep)', role: 'S', zone: 6 },
            OH1: { x: 68, y: 48, action: 'Off-Side Guard', role: 'OH1', zone: 1 },
            MB1: { x: 36, y: 20, action: 'Coverage Cup (Close)', role: 'MB1', zone: 2 },
            OPP: { x: 82, y: 24, action: 'Off-Side Guard', role: 'OPP', zone: 3 },
            OH2: { x: 14, y: 10, action: 'Landing & Reset', role: 'OH2', zone: 4 },
            L:   { x: 30, y: 42, action: 'Coverage Anchor', role: 'L', zone: 5 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Setup',
          title: 'OH1 Serving — Middle Block Stacking',
          narrative: 'OH1 (Z1) serves from baseline. MB1 and OPP in front row prepare to switch to base positions.',
          ball: { visible: true, x: 84, y: 94, scale: 1.0, shadowOpacity: 0.9 },
          positions: {
            OH1: { x: 84, y: 94, action: 'Serving Baseline', role: 'OH1', zone: 1 },
            MB1: { x: 74, y: 16, action: 'Ready to Switch Middle', role: 'MB1', zone: 2 },
            OPP: { x: 48, y: 16, action: 'Ready to Switch Right', role: 'OPP', zone: 3 },
            OH2: { x: 18, y: 16, action: 'Left Pin Base Block', role: 'OH2', zone: 4 },
            L:   { x: 22, y: 72, action: 'Left Back Base', role: 'L', zone: 5 },
            S:   { x: 50, y: 74, action: 'Middle Back Defense', role: 'S', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Serve Crosses Net — Blockers Switch',
          narrative: 'Serve crosses net. MB1 switches to center (Zone 3) and OPP switches to right pin (Zone 2).',
          ball: { visible: true, x: 50, y: -25, scale: 0.9, shadowOpacity: 0.2 },
          positions: {
            OH1: { x: 82, y: 84, action: 'Entering Court', role: 'OH1', zone: 1 },
            MB1: { x: 52, y: 16, action: 'Switching Middle', role: 'MB1', zone: 2 },
            OPP: { x: 80, y: 16, action: 'Switching Right Pin', role: 'OPP', zone: 3 },
            OH2: { x: 16, y: 16, action: 'Left Pin Ready', role: 'OH2', zone: 4 },
            L:   { x: 22, y: 72, action: 'Left Back Ready', role: 'L', zone: 5 },
            S:   { x: 50, y: 74, action: 'Middle Back Ready', role: 'S', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Base Defense',
          title: 'Established Base Defense',
          narrative: 'Team settled in base defense. Setter defends Middle Back (Zone 6) to read deep spikes and roll shots.',
          ball: { visible: true, x: 20, y: -20, scale: 1.1, shadowOpacity: 0.3 },
          positions: {
            OH1: { x: 80, y: 72, action: 'Right Back Defense', role: 'OH1', zone: 1 },
            MB1: { x: 50, y: 16, action: 'Middle Block Base', role: 'MB1', zone: 2 },
            OPP: { x: 84, y: 16, action: 'Right Pin Block Base', role: 'OPP', zone: 3 },
            OH2: { x: 16, y: 16, action: 'Left Pin Block Base', role: 'OH2', zone: 4 },
            L:   { x: 22, y: 70, action: 'Left Back Defense', role: 'L', zone: 5 },
            S:   { x: 50, y: 76, action: 'Middle Back Defense', role: 'S', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Block & Dig',
          title: 'Double Block at Left Pin',
          narrative: 'Opponent sets right side. OH2 and MB1 form double block on left pin. Setter shifts forward to cover tip.',
          ball: { visible: true, x: 16, y: 4, scale: 1.2, shadowOpacity: 0.9 },
          positions: {
            OH1: { x: 74, y: 60, action: 'Digging Cross', role: 'OH1', zone: 1 },
            MB1: { x: 26, y: 10, action: 'Closing Double Block', role: 'MB1', zone: 2 },
            OPP: { x: 78, y: 28, action: 'Pulling Off Net', role: 'OPP', zone: 3 },
            OH2: { x: 16, y: 10, action: 'Pin Block Anchor', role: 'OH2', zone: 4 },
            L:   { x: 28, y: 64, action: 'Digging Line / Tip', role: 'L', zone: 5 },
            S:   { x: 52, y: 62, action: 'Digging Deep Angle', role: 'S', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Transition Attack',
          title: 'Dig to Setter — Transition Counter-Attack',
          narrative: 'Ball dug cleanly to Setter at target. Hitters explode into transition approaches for kill.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.8 },
          positions: {
            OH1: { x: 78, y: 56, action: 'Covering Right', role: 'OH1', zone: 1 },
            MB1: { x: 48, y: 22, action: 'Transitioning Quick', role: 'MB1', zone: 2 },
            OPP: { x: 86, y: 34, action: 'Transitioning Right Pin', role: 'OPP', zone: 3 },
            OH2: { x: 14, y: 36, action: 'Transitioning Left Pin', role: 'OH2', zone: 4 },
            L:   { x: 34, y: 62, action: 'Coverage Positioning', role: 'L', zone: 5 },
            S:   { x: 68, y: 14, action: 'Setting Counter-Attack', role: 'S', zone: 6 }
          }
        }
      ]
    }
  },

  3: {
    rotation: 3,
    title: 'Rotation 3 (Setter in Zone 5)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'Setter Stacked in Left Back (Zone 5)',
          narrative: 'Setter (Z5) is hidden on the left sideline behind OH2 (Z5 area). Passers (OH2, Libero, OH1) form the 3-passer cup across the court.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S:   { x: 22, y: 48, action: 'Ready for Cross-Sprint', role: 'S', zone: 5 },
            OH1: { x: 74, y: 70, action: 'Passing Right Seam', role: 'OH1', zone: 6 },
            MB1: { x: 48, y: 15, action: 'Ready in Center', role: 'MB1', zone: 1 },
            OPP: { x: 78, y: 22, action: 'Right Pin Ready', role: 'OPP', zone: 2 },
            OH2: { x: 22, y: 70, action: 'Passing Left Seam', role: 'OH2', zone: 3 },
            L:   { x: 48, y: 74, action: 'Passing Middle Seam', role: 'L', zone: 4 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — Setter Sprints Across Court',
          narrative: 'Ball served high over the net. Setter sprints diagonally from left-back to right-front target. Passers stabilize platform.',
          ball: { visible: true, x: 48, y: 72, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            S:   { x: 45, y: 30, action: 'Cross-Court Sprint', role: 'S', zone: 5 },
            OH1: { x: 72, y: 68, action: 'Calling Ball', role: 'OH1', zone: 6 },
            MB1: { x: 48, y: 18, action: 'Tracking Pass', role: 'MB1', zone: 1 },
            OPP: { x: 82, y: 30, action: 'Opening to Right Pin', role: 'OPP', zone: 2 },
            OH2: { x: 20, y: 66, action: 'Platform Angle', role: 'OH2', zone: 3 },
            L:   { x: 46, y: 74, action: 'Passing Ball', role: 'L', zone: 4 }
          }
        },
        {
          id: 3,
          name: '3. Setter to Target',
          title: 'Setter Arrives at Target Spot',
          narrative: 'Setter reaches Zone 2.5 target with hands high. Libero delivers pass. All 3 front-row hitters transition into attack lanes.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S:   { x: 68, y: 14, action: 'Target Set Stance', role: 'S', zone: 5 },
            OH1: { x: 70, y: 60, action: 'Moving Up to Cover', role: 'OH1', zone: 6 },
            MB1: { x: 48, y: 20, action: 'Transitioning Quick', role: 'MB1', zone: 1 },
            OPP: { x: 86, y: 38, action: 'Transitioning Right Pin', role: 'OPP', zone: 2 },
            OH2: { x: 12, y: 38, action: 'Transitioning Left Pin', role: 'OH2', zone: 3 },
            L:   { x: 44, y: 62, action: 'Coverage Position', role: 'L', zone: 4 }
          }
        },
        {
          id: 4,
          name: '4. Set & Approach',
          title: 'Back-Set to Opposite on Right Pin (OPP)',
          narrative: 'Setter back-sets a fast ball to OPP on right pin (Zone 2). MB1 jumps on 1-ball. OPP elevates for attack.',
          ball: { visible: true, x: 84, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S:   { x: 68, y: 12, action: 'Back-Set Released', role: 'S', zone: 5 },
            OH1: { x: 68, y: 52, action: 'Covering Right', role: 'OH1', zone: 6 },
            MB1: { x: 48, y: 10, action: 'Quick 1-Ball Jump', role: 'MB1', zone: 1 },
            OPP: { x: 84, y: 10, action: 'Spiking Right Pin', role: 'OPP', zone: 2 },
            OH2: { x: 16, y: 24, action: 'Decoy Approach', role: 'OH2', zone: 3 },
            L:   { x: 48, y: 52, action: 'Coverage Cup', role: 'L', zone: 4 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Coverage',
          title: 'Attack Strikes Opponent Floor — Coverage in Place',
          narrative: 'OPP crushes the ball down the line. Setter, MB1, and Libero collapse in tight coverage cup around right pin.',
          ball: { visible: true, x: 88, y: -20, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S:   { x: 74, y: 22, action: 'Coverage Cup (Close)', role: 'S', zone: 5 },
            OH1: { x: 68, y: 48, action: 'Off-Side Guard', role: 'OH1', zone: 6 },
            MB1: { x: 60, y: 20, action: 'Coverage Cup (Inside)', role: 'MB1', zone: 1 },
            OPP: { x: 84, y: 10, action: 'Landing & Reset', role: 'OPP', zone: 2 },
            OH2: { x: 22, y: 38, action: 'Off-Side Guard', role: 'OH2', zone: 3 },
            L:   { x: 56, y: 42, action: 'Coverage Anchor', role: 'L', zone: 4 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Setup',
          title: 'MB1 Serving — Front Row Ready',
          narrative: 'MB1 (Z1) serves from baseline. OPP (Z2), OH2 (Z3), and Setter (Z5) prepare for base defensive alignment.',
          ball: { visible: true, x: 84, y: 94, scale: 1.0, shadowOpacity: 0.9 },
          positions: {
            MB1: { x: 84, y: 94, action: 'Serving Baseline', role: 'MB1', zone: 1 },
            OPP: { x: 80, y: 16, action: 'Right Pin Ready', role: 'OPP', zone: 2 },
            OH2: { x: 48, y: 16, action: 'Ready to Switch Left', role: 'OH2', zone: 3 },
            L:   { x: 18, y: 16, action: 'Ready to Switch Center', role: 'L', zone: 4 },
            S:   { x: 22, y: 72, action: 'Ready to Switch Right', role: 'S', zone: 5 },
            OH1: { x: 50, y: 74, action: 'Middle Back Defense', role: 'OH1', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Serve Crosses Net — Team Switches to Base',
          narrative: 'Ball crosses net. Front-row and back-row execute simultaneous switches to established base defense.',
          ball: { visible: true, x: 50, y: -25, scale: 0.9, shadowOpacity: 0.2 },
          positions: {
            MB1: { x: 82, y: 84, action: 'Entering Court', role: 'MB1', zone: 1 },
            OPP: { x: 82, y: 16, action: 'Right Pin Base', role: 'OPP', zone: 2 },
            OH2: { x: 18, y: 16, action: 'Switching Left Pin', role: 'OH2', zone: 3 },
            L:   { x: 50, y: 16, action: 'Middle Block Base', role: 'L', zone: 4 },
            S:   { x: 80, y: 72, action: 'Switching Right Back', role: 'S', zone: 5 },
            OH1: { x: 22, y: 72, action: 'Switching Left Back', role: 'OH1', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Base Defense',
          title: 'Established Base Defense Alignment',
          narrative: 'Setter settles in Right Back (Zone 1) defense. OH2 at Left Pin, Middle Blocker in center, OPP at Right Pin.',
          ball: { visible: true, x: 20, y: -20, scale: 1.1, shadowOpacity: 0.3 },
          positions: {
            MB1: { x: 50, y: 76, action: 'Middle Back Deep', role: 'MB1', zone: 1 },
            OPP: { x: 84, y: 16, action: 'Right Pin Block Base', role: 'OPP', zone: 2 },
            OH2: { x: 16, y: 16, action: 'Left Pin Block Base', role: 'OH2', zone: 3 },
            L:   { x: 50, y: 16, action: 'Middle Block Base', role: 'L', zone: 4 },
            S:   { x: 80, y: 70, action: 'Right Back Defense', role: 'S', zone: 5 },
            OH1: { x: 22, y: 70, action: 'Left Back Defense', role: 'OH1', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Block & Dig',
          title: 'Block and Defensive Read',
          narrative: 'Opponent attacks left side. Our blockers seal the net and back-row defenders dig cross-court.',
          ball: { visible: true, x: 82, y: 4, scale: 1.2, shadowOpacity: 0.9 },
          positions: {
            MB1: { x: 52, y: 64, action: 'Digging Deep Angle', role: 'MB1', zone: 1 },
            OPP: { x: 84, y: 10, action: 'Pin Block Anchor', role: 'OPP', zone: 2 },
            OH2: { x: 20, y: 28, action: 'Pulling Off Net to Hit', role: 'OH2', zone: 3 },
            L:   { x: 74, y: 10, action: 'Closing Double Block', role: 'L', zone: 4 },
            S:   { x: 76, y: 58, action: 'Digging Line / Tip', role: 'S', zone: 5 },
            OH1: { x: 26, y: 64, action: 'Digging Cross', role: 'OH1', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Transition Attack',
          title: 'Dig to Setter — Transition Counter-Attack',
          narrative: 'Clean dig delivered to Setter. Setter runs fast transition offense.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.8 },
          positions: {
            MB1: { x: 48, y: 64, action: 'Coverage Positioning', role: 'MB1', zone: 1 },
            OPP: { x: 86, y: 34, action: 'Transitioning Right Pin', role: 'OPP', zone: 2 },
            OH2: { x: 14, y: 36, action: 'Transitioning Left Pin', role: 'OH2', zone: 3 },
            L:   { x: 48, y: 22, action: 'Transitioning Quick', role: 'L', zone: 4 },
            S:   { x: 68, y: 14, action: 'Setting Counter-Attack', role: 'S', zone: 5 },
            OH1: { x: 28, y: 60, action: 'Supporting & Covering', role: 'OH1', zone: 6 }
          }
        }
      ]
    }
  },

  4: {
    rotation: 4,
    title: 'Rotation 4 (Setter in Zone 4 — Front Row)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'Setter in Front Row (Left Front)',
          narrative: 'Setter (Z4) starts in front-row left side. Setter slides across net to target. OH1 (Z3), Libero (Z4 area), and OH2 (Z1) pass in 3-passer cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S:   { x: 18, y: 18, action: 'Front-Row Setter', role: 'S', zone: 4 },
            OH1: { x: 24, y: 70, action: 'Passing Left Seam', role: 'OH1', zone: 3 },
            MB1: { x: 48, y: 16, action: 'Ready in Center', role: 'MB1', zone: 2 },
            OPP: { x: 78, y: 72, action: 'Back-Row Attack Ready', role: 'OPP', zone: 1 },
            OH2: { x: 74, y: 70, action: 'Passing Right Seam', role: 'OH2', zone: 6 },
            L:   { x: 48, y: 74, action: 'Passing Middle Seam', role: 'L', zone: 5 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — Setter Slides Across Net',
          narrative: 'Ball served high. Setter slides smoothly along the net from left to target (Zone 2.5). Passers track ball.',
          ball: { visible: true, x: 48, y: 72, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            S:   { x: 48, y: 15, action: 'Sliding Across Net', role: 'S', zone: 4 },
            OH1: { x: 22, y: 68, action: 'Platform Ready', role: 'OH1', zone: 3 },
            MB1: { x: 48, y: 18, action: 'Tracking Pass', role: 'MB1', zone: 2 },
            OPP: { x: 78, y: 66, action: 'Timing D-Ball Attack', role: 'OPP', zone: 1 },
            OH2: { x: 72, y: 68, action: 'Calling Ball', role: 'OH2', zone: 6 },
            L:   { x: 46, y: 74, action: 'Passing Ball', role: 'L', zone: 5 }
          }
        },
        {
          id: 3,
          name: '3. Setter to Target',
          title: 'Setter at Target — 2 Front-Row Hitters + BIC',
          narrative: 'Setter arrives at target (68, 14). OH1 pulls back outside to left pin (12, 38). MB1 approaches for quick 1-ball.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S:   { x: 68, y: 14, action: 'Target Set Stance', role: 'S', zone: 4 },
            OH1: { x: 12, y: 38, action: 'Transitioning Left Pin', role: 'OH1', zone: 3 },
            MB1: { x: 48, y: 20, action: 'Transitioning Quick', role: 'MB1', zone: 2 },
            OPP: { x: 82, y: 48, action: 'D-Ball Approach', role: 'OPP', zone: 1 },
            OH2: { x: 70, y: 60, action: 'Moving Up to Cover', role: 'OH2', zone: 6 },
            L:   { x: 44, y: 62, action: 'Coverage Position', role: 'L', zone: 5 }
          }
        },
        {
          id: 4,
          name: '4. Set & Approach',
          title: 'High Set to Outside Pin (OH1)',
          narrative: 'Setter pushes ball to OH1 on left pin. Setter also has option to dump over net (setter dump).',
          ball: { visible: true, x: 14, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S:   { x: 68, y: 12, action: 'Set Released / Dump Threat', role: 'S', zone: 4 },
            OH1: { x: 14, y: 10, action: 'Spiking Left Pin', role: 'OH1', zone: 3 },
            MB1: { x: 48, y: 10, action: 'Quick Decoy Jump', role: 'MB1', zone: 2 },
            OPP: { x: 80, y: 38, action: 'Back-Row Threat', role: 'OPP', zone: 1 },
            OH2: { x: 66, y: 52, action: 'Off-Side Guard', role: 'OH2', zone: 6 },
            L:   { x: 38, y: 52, action: 'Coverage Cup', role: 'L', zone: 5 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Coverage',
          title: 'Attack Strike & Coverage Cup',
          narrative: 'OH1 terminates the attack. Setter and Middle Blocker form immediate close coverage around left pin.',
          ball: { visible: true, x: 10, y: -20, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S:   { x: 56, y: 22, action: 'Coverage Cup (Close)', role: 'S', zone: 4 },
            OH1: { x: 14, y: 10, action: 'Landing & Reset', role: 'OH1', zone: 3 },
            MB1: { x: 36, y: 20, action: 'Coverage Cup (Inside)', role: 'MB1', zone: 2 },
            OPP: { x: 76, y: 36, action: 'Off-Side Guard', role: 'OPP', zone: 1 },
            OH2: { x: 64, y: 48, action: 'Off-Side Guard', role: 'OH2', zone: 6 },
            L:   { x: 30, y: 42, action: 'Coverage Anchor', role: 'L', zone: 5 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Setup',
          title: 'OPP Serving — Front-Row Setter at Net',
          narrative: 'OPP (Z1) serves from baseline. Setter (Z4) is in front row at net ready to block right side.',
          ball: { visible: true, x: 84, y: 94, scale: 1.0, shadowOpacity: 0.9 },
          positions: {
            OPP: { x: 84, y: 94, action: 'Serving Baseline', role: 'OPP', zone: 1 },
            MB1: { x: 48, y: 16, action: 'Middle Blocker Ready', role: 'MB1', zone: 2 },
            OH1: { x: 20, y: 16, action: 'Left Pin Ready', role: 'OH1', zone: 3 },
            S:   { x: 18, y: 16, action: 'Ready to Switch Right', role: 'S', zone: 4 },
            L:   { x: 22, y: 72, action: 'Left Back Base', role: 'L', zone: 5 },
            OH2: { x: 50, y: 74, action: 'Middle Back Base', role: 'OH2', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Serve Crosses Net — Setter Switches to Right Pin Block',
          narrative: 'Serve crosses net. Setter switches from left side to Right Pin (Zone 2) to establish block.',
          ball: { visible: true, x: 50, y: -25, scale: 0.9, shadowOpacity: 0.2 },
          positions: {
            OPP: { x: 82, y: 84, action: 'Entering Court', role: 'OPP', zone: 1 },
            MB1: { x: 50, y: 16, action: 'Middle Block Ready', role: 'MB1', zone: 2 },
            OH1: { x: 18, y: 16, action: 'Left Pin Ready', role: 'OH1', zone: 3 },
            S:   { x: 82, y: 16, action: 'Switching Right Pin', role: 'S', zone: 4 },
            L:   { x: 22, y: 72, action: 'Left Back Ready', role: 'L', zone: 5 },
            OH2: { x: 50, y: 74, action: 'Middle Back Ready', role: 'OH2', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Base Defense',
          title: 'Established Base Defense — Front-Row Setter Blocking',
          narrative: 'Setter anchors Right Pin block against opposing outside hitter. MB1 in center, OH1 at left pin.',
          ball: { visible: true, x: 20, y: -20, scale: 1.1, shadowOpacity: 0.3 },
          positions: {
            OPP: { x: 80, y: 70, action: 'Right Back Defense', role: 'OPP', zone: 1 },
            MB1: { x: 50, y: 16, action: 'Reading Opponent Set', role: 'MB1', zone: 2 },
            OH1: { x: 16, y: 16, action: 'Left Pin Block Base', role: 'OH1', zone: 3 },
            S:   { x: 84, y: 16, action: 'Right Pin Block Base', role: 'S', zone: 4 },
            L:   { x: 22, y: 70, action: 'Left Back Defense', role: 'L', zone: 5 },
            OH2: { x: 50, y: 76, action: 'Middle Back Defense', role: 'OH2', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Block & Dig',
          title: 'Setter & MB Double Block on Right Pin',
          narrative: 'Opponent attacks left. Setter and MB1 form roof double block on right pin (Zone 2).',
          ball: { visible: true, x: 82, y: 4, scale: 1.2, shadowOpacity: 0.9 },
          positions: {
            OPP: { x: 76, y: 58, action: 'Digging Line / Tip', role: 'OPP', zone: 1 },
            MB1: { x: 74, y: 10, action: 'Closing Double Block', role: 'MB1', zone: 2 },
            OH1: { x: 20, y: 28, action: 'Pulling Off Net to Hit', role: 'OH1', zone: 3 },
            S:   { x: 84, y: 10, action: 'Right Pin Block Anchor', role: 'S', zone: 4 },
            L:   { x: 26, y: 64, action: 'Digging Cross', role: 'L', zone: 5 },
            OH2: { x: 52, y: 62, action: 'Digging Deep Angle', role: 'OH2', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Transition Attack',
          title: 'Setter Lands & Sets Transition Ball',
          narrative: 'Setter lands from block and sets counter-attack to OH1 or MB1.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.8 },
          positions: {
            OPP: { x: 78, y: 56, action: 'Covering Right', role: 'OPP', zone: 1 },
            MB1: { x: 48, y: 22, action: 'Transitioning Quick', role: 'MB1', zone: 2 },
            OH1: { x: 14, y: 36, action: 'Transitioning Left Pin', role: 'OH1', zone: 3 },
            S:   { x: 68, y: 14, action: 'Setting Transition', role: 'S', zone: 4 },
            L:   { x: 28, y: 60, action: 'Supporting & Covering', role: 'L', zone: 5 },
            OH2: { x: 48, y: 64, action: 'Coverage Positioning', role: 'OH2', zone: 6 }
          }
        }
      ]
    }
  },

  5: {
    rotation: 5,
    title: 'Rotation 5 (Setter in Zone 3 — Middle Front)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'Setter in Middle Front (Zone 3)',
          narrative: 'Setter (Z3) is in front-row center. OH1 (Z4) ready on left. Passers (OH1, Libero, OH2) form 3-passer cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S:   { x: 48, y: 16, action: 'Front-Row Center', role: 'S', zone: 3 },
            OH1: { x: 22, y: 68, action: 'Passing Left Seam', role: 'OH1', zone: 4 },
            MB1: { x: 78, y: 16, action: 'Right Front Ready', role: 'MB1', zone: 1 },
            OPP: { x: 50, y: 74, action: 'Back-Row BIC Threat', role: 'OPP', zone: 6 },
            OH2: { x: 74, y: 70, action: 'Passing Right Seam', role: 'OH2', zone: 5 },
            L:   { x: 48, y: 76, action: 'Passing Middle Seam', role: 'L', zone: 2 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — Setter Shifts to Right-Front Target',
          narrative: 'Serve crosses net. Setter shifts a few steps right to target (Zone 2.5). Passers track ball.',
          ball: { visible: true, x: 48, y: 72, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            S:   { x: 62, y: 14, action: 'Shifting to Target', role: 'S', zone: 3 },
            OH1: { x: 20, y: 66, action: 'Platform Angle', role: 'OH1', zone: 4 },
            MB1: { x: 72, y: 18, action: 'Moving to Middle', role: 'MB1', zone: 1 },
            OPP: { x: 50, y: 66, action: 'Timing Pipe Attack', role: 'OPP', zone: 6 },
            OH2: { x: 72, y: 68, action: 'Calling Ball', role: 'OH2', zone: 5 },
            L:   { x: 46, y: 74, action: 'Passing Ball', role: 'L', zone: 2 }
          }
        },
        {
          id: 3,
          name: '3. Setter to Target',
          title: 'Setter at Target — Quick Middle / Slide Options',
          narrative: 'Setter at target. MB1 approaches for quick 1-ball or slide behind setter. OH1 transitions left.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S:   { x: 68, y: 14, action: 'Target Set Stance', role: 'S', zone: 3 },
            OH1: { x: 12, y: 38, action: 'Transitioning Left Pin', role: 'OH1', zone: 4 },
            MB1: { x: 48, y: 20, action: 'Transitioning Quick / Slide', role: 'MB1', zone: 1 },
            OPP: { x: 50, y: 52, action: 'Pipe Attack Approach', role: 'OPP', zone: 6 },
            OH2: { x: 70, y: 60, action: 'Moving Up to Cover', role: 'OH2', zone: 5 },
            L:   { x: 44, y: 62, action: 'Coverage Position', role: 'L', zone: 2 }
          }
        },
        {
          id: 4,
          name: '4. Set & Approach',
          title: 'Quick 1-Ball Set to Middle Blocker',
          narrative: 'Setter delivers crisp quick set to MB1 in center. MB1 hammer-hits past opposing block.',
          ball: { visible: true, x: 48, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S:   { x: 68, y: 12, action: 'Quick Set Released', role: 'S', zone: 3 },
            OH1: { x: 14, y: 12, action: 'Left Pin Decoy', role: 'OH1', zone: 4 },
            MB1: { x: 48, y: 10, action: 'Spiking Quick 1-Ball', role: 'MB1', zone: 1 },
            OPP: { x: 50, y: 44, action: 'Pipe Follow-Through', role: 'OPP', zone: 6 },
            OH2: { x: 66, y: 52, action: 'Off-Side Guard', role: 'OH2', zone: 5 },
            L:   { x: 38, y: 52, action: 'Coverage Cup', role: 'L', zone: 2 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Coverage',
          title: 'Attack Strikes Floor — Full Coverage',
          narrative: 'MB1 puts ball away. Tight coverage cup surrounding center attack zone.',
          ball: { visible: true, x: 48, y: -20, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S:   { x: 62, y: 22, action: 'Coverage Cup', role: 'S', zone: 3 },
            OH1: { x: 22, y: 24, action: 'Off-Side Guard', role: 'OH1', zone: 4 },
            MB1: { x: 48, y: 10, action: 'Landing & Reset', role: 'MB1', zone: 1 },
            OPP: { x: 50, y: 46, action: 'Coverage Cup (Deep)', role: 'OPP', zone: 6 },
            OH2: { x: 64, y: 48, action: 'Off-Side Guard', role: 'OH2', zone: 5 },
            L:   { x: 36, y: 42, action: 'Coverage Anchor', role: 'L', zone: 2 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Setup',
          title: 'OH2 Serving — Front-Row Setter in Middle',
          narrative: 'OH2 (Z1) serves from baseline. Setter (Z3) at middle net ready to switch to right pin.',
          ball: { visible: true, x: 84, y: 94, scale: 1.0, shadowOpacity: 0.9 },
          positions: {
            OH2: { x: 84, y: 94, action: 'Serving Baseline', role: 'OH2', zone: 1 },
            MB1: { x: 74, y: 16, action: 'Ready to Switch Middle', role: 'MB1', zone: 2 },
            S:   { x: 48, y: 16, action: 'Ready to Switch Right', role: 'S', zone: 3 },
            OH1: { x: 18, y: 16, action: 'Left Pin Ready', role: 'OH1', zone: 4 },
            OPP: { x: 22, y: 72, action: 'Left Back Ready', role: 'OPP', zone: 5 },
            L:   { x: 50, y: 74, action: 'Middle Back Base', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Serve Crosses Net — Setter & MB Switch',
          narrative: 'Serve crosses net. Setter moves to Right Pin (Zone 2) block and MB1 moves to Middle (Zone 3) block.',
          ball: { visible: true, x: 50, y: -25, scale: 0.9, shadowOpacity: 0.2 },
          positions: {
            OH2: { x: 82, y: 84, action: 'Entering Court', role: 'OH2', zone: 1 },
            MB1: { x: 52, y: 16, action: 'Switching Middle', role: 'MB1', zone: 2 },
            S:   { x: 82, y: 16, action: 'Switching Right Pin', role: 'S', zone: 3 },
            OH1: { x: 16, y: 16, action: 'Left Pin Ready', role: 'OH1', zone: 4 },
            OPP: { x: 22, y: 72, action: 'Left Back Ready', role: 'OPP', zone: 5 },
            L:   { x: 50, y: 74, action: 'Middle Back Ready', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Base Defense',
          title: 'Established Base Defense',
          narrative: 'Setter established at Right Pin block. OH2 in Right Back defense.',
          ball: { visible: true, x: 20, y: -20, scale: 1.1, shadowOpacity: 0.3 },
          positions: {
            OH2: { x: 80, y: 70, action: 'Right Back Defense', role: 'OH2', zone: 1 },
            MB1: { x: 50, y: 16, action: 'Middle Block Base', role: 'MB1', zone: 2 },
            S:   { x: 84, y: 16, action: 'Right Pin Block Base', role: 'S', zone: 3 },
            OH1: { x: 16, y: 16, action: 'Left Pin Block Base', role: 'OH1', zone: 4 },
            OPP: { x: 22, y: 70, action: 'Left Back Defense', role: 'OPP', zone: 5 },
            L:   { x: 50, y: 76, action: 'Middle Back Defense', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Block & Dig',
          title: 'Double Block at Center / Pin',
          narrative: 'Double block forms against opponent attack. Defenders adjust for dig.',
          ball: { visible: true, x: 82, y: 4, scale: 1.2, shadowOpacity: 0.9 },
          positions: {
            OH2: { x: 76, y: 58, action: 'Digging Line / Tip', role: 'OH2', zone: 1 },
            MB1: { x: 74, y: 10, action: 'Closing Double Block', role: 'MB1', zone: 2 },
            S:   { x: 84, y: 10, action: 'Right Pin Block Anchor', role: 'S', zone: 3 },
            OH1: { x: 20, y: 28, action: 'Pulling Off Net to Hit', role: 'OH1', zone: 4 },
            OPP: { x: 26, y: 64, action: 'Digging Cross', role: 'OPP', zone: 5 },
            L:   { x: 52, y: 62, action: 'Digging Deep Angle', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Transition Attack',
          title: 'Setter Lands & Sets Transition Counter-Attack',
          narrative: 'Setter sets transition offense for fast point finish.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.8 },
          positions: {
            OH2: { x: 78, y: 56, action: 'Covering Right', role: 'OH2', zone: 1 },
            MB1: { x: 48, y: 22, action: 'Transitioning Quick', role: 'MB1', zone: 2 },
            S:   { x: 68, y: 14, action: 'Setting Transition', role: 'S', zone: 3 },
            OH1: { x: 14, y: 36, action: 'Transitioning Left Pin', role: 'OH1', zone: 4 },
            OPP: { x: 28, y: 60, action: 'Supporting & Covering', role: 'OPP', zone: 5 },
            L:   { x: 48, y: 64, action: 'Coverage Positioning', role: 'L', zone: 6 }
          }
        }
      ]
    }
  },

  6: {
    rotation: 6,
    title: 'Rotation 6 (Setter in Zone 2 — Right Front)',
    receiving: {
      stages: [
        {
          id: 1,
          name: '1. Receive Stack',
          title: 'Setter in Ideal Right-Front Position (Zone 2)',
          narrative: 'Setter (Z2) is already in the optimal target position at Right Front! Passers (OH1, Libero, OH2) form the 3-passer cup.',
          ball: { visible: false, x: 50, y: -25, scale: 0.8, shadowOpacity: 0 },
          positions: {
            S:   { x: 78, y: 16, action: 'Target Position (Ready)', role: 'S', zone: 2 },
            OH1: { x: 74, y: 68, action: 'Passing Right Seam', role: 'OH1', zone: 1 },
            MB1: { x: 48, y: 16, action: 'Ready in Center', role: 'MB1', zone: 3 },
            OPP: { x: 50, y: 74, action: 'Back-Row BIC Threat', role: 'OPP', zone: 5 },
            OH2: { x: 22, y: 68, action: 'Passing Left Seam', role: 'OH2', zone: 4 },
            L:   { x: 48, y: 74, action: 'Passing Middle Seam', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Ball Crosses Net — Setter Holds Target Position',
          narrative: 'Serve crosses net. Setter holds stable target position at (68, 14) with minimal movement needed.',
          ball: { visible: true, x: 28, y: 68, scale: 1.3, shadowOpacity: 0.7 },
          positions: {
            S:   { x: 68, y: 14, action: 'Holding Target Spot', role: 'S', zone: 2 },
            OH1: { x: 72, y: 66, action: 'Calling Ball', role: 'OH1', zone: 1 },
            MB1: { x: 48, y: 18, action: 'Tracking Pass', role: 'MB1', zone: 3 },
            OPP: { x: 50, y: 66, action: 'Timing Pipe Attack', role: 'OPP', zone: 5 },
            OH2: { x: 24, y: 68, action: 'Passing Platform', role: 'OH2', zone: 4 },
            L:   { x: 46, y: 74, action: 'Covering Seam', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Setter to Target',
          title: 'Pass Delivered Directly to Setter',
          narrative: 'Pass arrives right at setter hands. OH2 transitions to left pin. MB1 runs 1-ball in center.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.9 },
          positions: {
            S:   { x: 68, y: 14, action: 'Ready to Set / Dump', role: 'S', zone: 2 },
            OH1: { x: 70, y: 58, action: 'Moving Up to Cover', role: 'OH1', zone: 1 },
            MB1: { x: 48, y: 20, action: 'Transitioning Quick', role: 'MB1', zone: 3 },
            OPP: { x: 50, y: 52, action: 'Pipe Attack Approach', role: 'OPP', zone: 5 },
            OH2: { x: 12, y: 38, action: 'Transitioning Left Pin', role: 'OH2', zone: 4 },
            L:   { x: 44, y: 62, action: 'Coverage Position', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Set & Approach',
          title: 'Jump-Set to Outside Hitter on Left Pin',
          narrative: 'Setter delivers fast tempo ball to OH2 on left pin. Setter also threatens 2nd-contact dump.',
          ball: { visible: true, x: 14, y: 10, scale: 1.2, shadowOpacity: 0.8 },
          positions: {
            S:   { x: 68, y: 12, action: 'Jump Set / Dump Option', role: 'S', zone: 2 },
            OH1: { x: 68, y: 52, action: 'Covering Right', role: 'OH1', zone: 1 },
            MB1: { x: 48, y: 10, action: 'Decoy Quick Jump', role: 'MB1', zone: 3 },
            OPP: { x: 50, y: 44, action: 'Pipe Follow-Through', role: 'OPP', zone: 5 },
            OH2: { x: 14, y: 10, action: 'Spiking Left Pin', role: 'OH2', zone: 4 },
            L:   { x: 38, y: 52, action: 'Coverage Cup', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Attack & Coverage',
          title: 'Attack Strikes Opponent Floor — Coverage in Place',
          narrative: 'OH2 scores kill. Full coverage cup surrounds left pin.',
          ball: { visible: true, x: 10, y: -20, scale: 0.7, shadowOpacity: 0.2 },
          positions: {
            S:   { x: 56, y: 22, action: 'Coverage Cup (Close)', role: 'S', zone: 2 },
            OH1: { x: 68, y: 48, action: 'Off-Side Guard', role: 'OH1', zone: 1 },
            MB1: { x: 36, y: 20, action: 'Coverage Cup (Inside)', role: 'MB1', zone: 3 },
            OPP: { x: 50, y: 46, action: 'Coverage Cup (Deep)', role: 'OPP', zone: 5 },
            OH2: { x: 14, y: 10, action: 'Landing & Reset', role: 'OH2', zone: 4 },
            L:   { x: 30, y: 42, action: 'Coverage Anchor', role: 'L', zone: 6 }
          }
        }
      ]
    },
    serving: {
      stages: [
        {
          id: 1,
          name: '1. Service Setup',
          title: 'OH1 Serving — Front-Row Setter at Right Net',
          narrative: 'OH1 (Z1) serves from baseline. Setter (Z2) is already in Right Pin block position. MB1 in center, OH2 on left.',
          ball: { visible: true, x: 84, y: 94, scale: 1.0, shadowOpacity: 0.9 },
          positions: {
            OH1: { x: 84, y: 94, action: 'Serving Baseline', role: 'OH1', zone: 1 },
            S:   { x: 84, y: 16, action: 'Right Pin Block Base', role: 'S', zone: 2 },
            MB1: { x: 50, y: 16, action: 'Middle Block Base', role: 'MB1', zone: 3 },
            OH2: { x: 16, y: 16, action: 'Left Pin Block Base', role: 'OH2', zone: 4 },
            OPP: { x: 22, y: 72, action: 'Left Back Ready', role: 'OPP', zone: 5 },
            L:   { x: 50, y: 74, action: 'Middle Back Base', role: 'L', zone: 6 }
          }
        },
        {
          id: 2,
          name: '2. Serve In-Flight',
          title: 'Serve Crosses Net — Defense Stays in Position',
          narrative: 'Serve crosses net. No switches needed in front row since all 3 players are already in specialty positions!',
          ball: { visible: true, x: 50, y: -25, scale: 0.9, shadowOpacity: 0.2 },
          positions: {
            OH1: { x: 82, y: 84, action: 'Entering Court', role: 'OH1', zone: 1 },
            S:   { x: 84, y: 16, action: 'Right Pin Ready', role: 'S', zone: 2 },
            MB1: { x: 50, y: 16, action: 'Middle Block Ready', role: 'MB1', zone: 3 },
            OH2: { x: 16, y: 16, action: 'Left Pin Ready', role: 'OH2', zone: 4 },
            OPP: { x: 22, y: 72, action: 'Left Back Ready', role: 'OPP', zone: 5 },
            L:   { x: 50, y: 74, action: 'Middle Back Ready', role: 'L', zone: 6 }
          }
        },
        {
          id: 3,
          name: '3. Base Defense',
          title: 'Established Base Defense Alignment',
          narrative: 'Setter anchors Right Pin block against opposing outside hitter. OH1 in Right Back defense.',
          ball: { visible: true, x: 20, y: -20, scale: 1.1, shadowOpacity: 0.3 },
          positions: {
            OH1: { x: 80, y: 70, action: 'Right Back Defense', role: 'OH1', zone: 1 },
            S:   { x: 84, y: 16, action: 'Right Pin Block Base', role: 'S', zone: 2 },
            MB1: { x: 50, y: 16, action: 'Reading Opponent Set', role: 'MB1', zone: 3 },
            OH2: { x: 16, y: 16, action: 'Left Pin Block Base', role: 'OH2', zone: 4 },
            OPP: { x: 22, y: 70, action: 'Left Back Defense', role: 'OPP', zone: 5 },
            L:   { x: 50, y: 76, action: 'Middle Back Defense', role: 'L', zone: 6 }
          }
        },
        {
          id: 4,
          name: '4. Block & Dig',
          title: 'Double Block at Left Pin',
          narrative: 'Double block seals opponent attack. Back-row defenders dig cross-court and cover tip.',
          ball: { visible: true, x: 16, y: 4, scale: 1.2, shadowOpacity: 0.9 },
          positions: {
            OH1: { x: 76, y: 58, action: 'Digging Line / Tip', role: 'OH1', zone: 1 },
            S:   { x: 84, y: 10, action: 'Right Pin Block Anchor', role: 'S', zone: 2 },
            MB1: { x: 26, y: 10, action: 'Closing Double Block', role: 'MB1', zone: 3 },
            OH2: { x: 16, y: 10, action: 'Left Pin Block Base', role: 'OH2', zone: 4 },
            OPP: { x: 28, y: 64, action: 'Digging Cross', role: 'OPP', zone: 5 },
            L:   { x: 52, y: 62, action: 'Digging Deep Angle', role: 'L', zone: 6 }
          }
        },
        {
          id: 5,
          name: '5. Transition Attack',
          title: 'Setter Lands & Sets Transition Counter-Attack',
          narrative: 'Setter sets transition offense for fast point finish.',
          ball: { visible: true, x: 68, y: 14, scale: 1.1, shadowOpacity: 0.8 },
          positions: {
            OH1: { x: 78, y: 56, action: 'Covering Right', role: 'OH1', zone: 1 },
            S:   { x: 68, y: 14, action: 'Setting Transition', role: 'S', zone: 2 },
            MB1: { x: 48, y: 22, action: 'Transitioning Quick', role: 'MB1', zone: 3 },
            OH2: { x: 14, y: 36, action: 'Transitioning Left Pin', role: 'OH2', zone: 4 },
            OPP: { x: 28, y: 60, action: 'Supporting & Covering', role: 'OPP', zone: 5 },
            L:   { x: 48, y: 64, action: 'Coverage Positioning', role: 'L', zone: 6 }
          }
        }
      ]
    }
  }
};
