/**
 * Comprehensive Volleyball Drills & Practice Library (25+ In-Depth Drills)
 * Includes multi-phase animation coordinates, player movement paths, and coaching cues.
 */

export const DRILL_CATEGORIES = [
  { id: 'all', label: 'All Drills', icon: 'Sparkles', color: '#f59e0b' },
  { id: 'warmup', label: 'Warm-Up & Footwork', icon: 'Flame', color: '#ef4444' },
  { id: 'serving_passing', label: 'Serving & Passing', icon: 'Target', color: '#3b82f6' },
  { id: 'defense', label: 'Defense & Digging', icon: 'Shield', color: '#10b981' },
  { id: 'setting', label: 'Setting & Transition', icon: 'Layers', color: '#a855f7' },
  { id: 'hitting', label: 'Attacking & Hitting', icon: 'Zap', color: '#f97316' },
  { id: 'blocking', label: 'Blocking & Net Play', icon: 'ShieldAlert', color: '#06b6d4' },
  { id: 'wash_games', label: 'Wash & Scrimmage', icon: 'Trophy', color: '#ec4899' }
];

export const VOLLEYBALL_DRILLS = [
  // =========================================================================
  // 1. WARM-UP & FOOTWORK (4 Drills)
  // =========================================================================
  {
    id: 'warmup-3step-approach',
    title: '3-Step & 4-Step Hitter Approach Acceleration',
    category: 'warmup',
    categoryLabel: 'Warm-Up & Footwork',
    difficulty: 'Beginner',
    intensity: 'Moderate',
    minPlayers: 2,
    maxPlayers: 12,
    durationMinutes: 10,
    equipment: ['Volleyballs', 'Cones / Marker Lines', 'Net'],
    overview: 'Dynamic footwork drill focusing on penultimate step explosion, directional plant, and vertical jump biomechanics for outside and opposite hitters.',
    setup: 'Hitters line up at the 10ft line in Zone 4 (Left Front) and Zone 2 (Right Front). Cones mark the starting spot, penultimate step, and jump plant spot.',
    instructions: [
      'Right-handed hitters start with right foot forward at the 10ft line.',
      'Step 1 (Directional / Timing step): Smooth Left step toward the anticipated set point.',
      'Step 2 (Penultimate step): Long, explosive Right step driving arms back behind the torso.',
      'Step 3 (Block step): Quick Left heel-to-toe brake step turning feet 45° to the net to convert forward momentum into vertical height.',
      'Explosive double-arm swing lift to high-contact spike position, landing balanced on two feet.'
    ],
    coachingKeys: [
      'Explode on the last two steps (Slow to Fast rhythm: Step... Quick-Quick!).',
      'Drive both arms back at least parallel to the floor before swinging up.',
      'Land softly on two feet with knees bent to protect joints.'
    ],
    variations: [
      'Add a soft tossed ball from a coach for high-reach catch at peak jump.',
      'Transition footwork: Start at the net, block jump, transition off to 10ft line, then execute approach.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Starting Stance at 10ft Line',
          description: 'Hitter loaded in athletic stance behind the attack line.',
          duration: 2200,
          players: [
            { id: 'h1', label: 'OH', role: 'Hitter', action: '🏃 Ready Stance', x: 20, y: 70, color: '#f97316', path: [{ x: 20, y: 70 }, { x: 25, y: 35 }] },
            { id: 'c1', label: 'Coach', role: 'Toss', action: '🏐 High Toss', x: 50, y: 30, color: '#64748b' }
          ],
          ball: { x: 50, y: 30, visible: true, arc: false, height: 1 },
          annotations: [{ text: '10ft Attack Line Starting Spot', x: 20, y: 76 }]
        },
        {
          name: 'Phase 2: Penultimate & Plant Step',
          description: 'Hitter accelerates into explosive Right-Left plant at the attack zone.',
          duration: 2400,
          players: [
            { id: 'h1', label: 'OH', role: 'Hitter', action: '💥 Explosive Plant', x: 25, y: 35, color: '#f97316', path: [{ x: 25, y: 35 }, { x: 25, y: 28 }] },
            { id: 'c1', label: 'Coach', role: 'Toss', action: '👀 Tracking', x: 50, y: 30, color: '#64748b' }
          ],
          ball: { x: 25, y: 28, visible: true, arc: true, height: 3, from: { x: 50, y: 30 } },
          annotations: [{ text: 'Drive Arms Back! 🚀', x: 25, y: 42 }]
        },
        {
          name: 'Phase 3: Peak Contact & Soft Landing',
          description: 'Contact ball at maximum vertical reach and land balanced on two feet.',
          duration: 2500,
          players: [
            { id: 'h1', label: 'OH', role: 'Hitter', action: '🏐 Spike Contact', x: 25, y: 28, color: '#f97316' },
            { id: 'c1', label: 'Coach', role: 'Toss', action: '✅ Complete', x: 50, y: 30, color: '#64748b' }
          ],
          ball: { x: 75, y: 85, visible: true, arc: true, height: 2, from: { x: 25, y: 28 } },
          annotations: [{ text: 'Deep Cross-Court Hit 💥', x: 75, y: 80 }]
        }
      ]
    }
  },

  {
    id: 'warmup-butterfly-pepper',
    title: 'Continuous 3-Person Butterfly Pepper',
    category: 'warmup',
    categoryLabel: 'Warm-Up & Footwork',
    difficulty: 'Intermediate',
    intensity: 'High',
    minPlayers: 6,
    maxPlayers: 12,
    durationMinutes: 12,
    equipment: ['4-6 Volleyballs', 'Net'],
    overview: 'High-repetition control drill emphasizing over-the-net ball control, tracking off-speed balls, and immediate follow-through rotation across the net.',
    setup: '3 players on Side A (Zone 5, Zone 3, Zone 4) and 3 players on Side B (Zone 5, Zone 3, Zone 4).',
    instructions: [
      'Player A1 in Zone 5 passes high over the net to Player B1 in Zone 5.',
      'Player B1 passes to Setter B2 in Zone 3.',
      'Setter B2 sets high ball to Player B3 in Zone 4, who hits a controlled downball over to Side A.',
      'Immediately after contacting the ball, each player follows their ball and transitions under the net to the opposite side.',
      'Continue rally continuously aiming for 20+ unbroken contacts.'
    ],
    coachingKeys: [
      'Call "MINE" loudly on every pass and set.',
      'Controlled wrist snap on downballs—keep the ball high and playable for the defender.',
      'Hustle under the net safely along the sideline poles.'
    ],
    variations: [
      'Add a rule: First 10 balls must be roll shots, next 10 must be tip recoveries.',
      'Speed round: 60-second timer to see which pair achieves the highest rally count.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Controlled Pass Across Net',
          description: 'Side A passes to Side B Passer in Zone 5.',
          duration: 2500,
          players: [
            { id: 'a1', label: 'A1', role: 'Passer', action: '🏐 High Pass', x: 25, y: 75, color: '#3b82f6', path: [{ x: 25, y: 75 }, { x: 50, y: 55 }] },
            { id: 'a2', label: 'A2', role: 'Setter', action: '👀 Ready', x: 50, y: 55, color: '#a855f7' },
            { id: 'b1', label: 'B1', role: 'Passer', action: '🛡️ Dig/Pass', x: 25, y: 25, color: '#10b981' },
            { id: 'b2', label: 'B2', role: 'Setter', action: '🏐 Setting', x: 50, y: 40, color: '#f59e0b' }
          ],
          ball: { x: 25, y: 25, visible: true, arc: true, height: 3, from: { x: 25, y: 75 } },
          annotations: [{ text: 'High Float Pass Over Net', x: 25, y: 50 }]
        },
        {
          name: 'Phase 2: Set to Antenna',
          description: 'Side B Setter sets high ball to Zone 4 hitter.',
          duration: 2500,
          players: [
            { id: 'a1', label: 'A1', role: 'Transition', action: '🏃 Rotating', x: 45, y: 60, color: '#3b82f6' },
            { id: 'a2', label: 'A2', role: 'Setter', action: '👀 Ready', x: 50, y: 55, color: '#a855f7' },
            { id: 'b1', label: 'B1', role: 'Passer', action: '🏃 Follow Ball', x: 25, y: 25, color: '#10b981' },
            { id: 'b2', label: 'B2', role: 'Setter', action: '🏐 High Set', x: 50, y: 38, color: '#f59e0b' }
          ],
          ball: { x: 20, y: 42, visible: true, arc: true, height: 2.5, from: { x: 50, y: 38 } },
          annotations: [{ text: 'High Set to Zone 4', x: 35, y: 38 }]
        },
        {
          name: 'Phase 3: Downball Return & Cross-Over',
          description: 'Hitter hits controlled downball back to Side A and sprints under net.',
          duration: 2500,
          players: [
            { id: 'a1', label: 'A1', role: 'Passer', action: '🛡️ Ready Dig', x: 30, y: 75, color: '#3b82f6' },
            { id: 'a2', label: 'A2', role: 'Setter', action: '👀 Setting', x: 50, y: 55, color: '#a855f7' },
            { id: 'b1', label: 'B1', role: 'Passer', action: '🏃 Under Net', x: 15, y: 50, color: '#10b981' },
            { id: 'b2', label: 'B2', role: 'Setter', action: '👀 Follow Ball', x: 50, y: 38, color: '#f59e0b' }
          ],
          ball: { x: 30, y: 75, visible: true, arc: true, height: 2.8, from: { x: 20, y: 40 } },
          annotations: [{ text: 'Continuous Cycle Across Net 🔄', x: 25, y: 60 }]
        }
      ]
    }
  },

  {
    id: 'warmup-figure-8-peppering',
    title: 'Figure-8 Speed Pepper & Lateral Movement',
    category: 'warmup',
    categoryLabel: 'Warm-Up & Footwork',
    difficulty: 'Intermediate',
    intensity: 'High',
    minPlayers: 3,
    maxPlayers: 9,
    durationMinutes: 10,
    equipment: ['Volleyballs'],
    overview: 'High-speed pepper variation where two passers continuously weave in a Figure-8 pattern behind each other after every touch, keeping the rally alive with 1 setter.',
    setup: 'Setter stands at 10ft line facing two passers in back row. Passers start 10 feet apart.',
    instructions: [
      'Setter tosses to Passer 1 (Left). Passer 1 passes to Setter.',
      'Immediately after passing, Passer 1 sprints in a figure-8 loop behind Passer 2 (Right).',
      'Setter sets to Passer 2, who downballs back to Setter and runs the loop behind Passer 1.',
      'Maintain continuous rapid rally for 30 consecutive touches.'
    ],
    coachingKeys: [
      'Sprint through the crossover loop—do not jog.',
      'Square hips to setter before contacting the ball.',
      'Keep your platform out and ready before feet stop moving.'
    ],
    variations: [
      'Left-hand only setter contacts to increase touch difficulty.',
      'Add sprawl / dive before running the figure-8 loop.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Pass & Crossover Loop',
          description: 'Passer 1 passes and sprints behind Passer 2.',
          duration: 2400,
          players: [
            { id: 'p1', label: 'P1', role: 'Passer', action: '🏃 Weave Behind', x: 30, y: 75, color: '#3b82f6', path: [{ x: 30, y: 75 }, { x: 70, y: 80 }] },
            { id: 'p2', label: 'P2', role: 'Passer', action: '🛡️ Moving Left', x: 70, y: 75, color: '#10b981', path: [{ x: 70, y: 75 }, { x: 30, y: 75 }] },
            { id: 's', label: 'Setter', role: 'Setter', action: '🏐 Soft Set', x: 50, y: 35, color: '#a855f7' }
          ],
          ball: { x: 50, y: 35, visible: true, arc: true, height: 2, from: { x: 30, y: 75 } },
          annotations: [{ text: 'Figure-8 Weave Path ♾️', x: 50, y: 80 }]
        },
        {
          name: 'Phase 2: Next Touch & Continuous Cycle',
          description: 'Passer 2 takes the next ball while Passer 1 fills the vacated spot.',
          duration: 2400,
          players: [
            { id: 'p1', label: 'P1', role: 'Passer', action: '🛡️ Set to Dig', x: 70, y: 75, color: '#3b82f6' },
            { id: 'p2', label: 'P2', role: 'Passer', action: '🏃 Loop Back', x: 30, y: 75, color: '#10b981' },
            { id: 's', label: 'Setter', role: 'Setter', action: '🏐 Return Ball', x: 50, y: 35, color: '#a855f7' }
          ],
          ball: { x: 30, y: 75, visible: true, arc: true, height: 2, from: { x: 50, y: 35 } },
          annotations: [{ text: 'Fast Footwork Transition', x: 30, y: 70 }]
        }
      ]
    }
  },

  {
    id: 'warmup-shuttle-dive-recover',
    title: 'Floor Defense Shuttle: Pancake, Sprawl & Rapid Recovery',
    category: 'warmup',
    categoryLabel: 'Warm-Up & Footwork',
    difficulty: 'Advanced',
    intensity: 'Maximum',
    minPlayers: 2,
    maxPlayers: 8,
    durationMinutes: 10,
    equipment: ['Volleyballs', 'Knee Pads'],
    overview: 'Emergency floor recovery conditioning drill training defenders to sprawl, slide, pancake dying balls, and pop up to athletic stance in under 1 second.',
    setup: 'Defenders start at baseline. Coach stands at 10ft line with ball cart.',
    instructions: [
      'Defender sprints forward from baseline toward 10ft line.',
      'Coach drops short ball 3 feet in front of defender.',
      'Defender executes full extension sprawl or pancake slide with flat hand under ball.',
      'Defender pops up immediately, backpedals 3 steps, and dives laterally to right for 2nd ball.',
      'Complete 4 rapid floor touches per turn.'
    ],
    coachingKeys: [
      'Slide on chest and hips—do not crash on knees.',
      'Hand must be completely flat on the floor for pancakes.',
      'Drive elbows forward to pop up instantly.'
    ],
    variations: [
      'Timed 30-second endurance burner.',
      'Add live setter who sets the popped pancake ball to a transition hitter.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Sprint to Short Ball',
          description: 'Defender accelerates from baseline toward campfire zone.',
          duration: 2000,
          players: [
            { id: 'def', label: 'LIB', role: 'Defender', action: '🏃 Sprinting', x: 50, y: 85, color: '#10b981', path: [{ x: 50, y: 85 }, { x: 50, y: 45 }] },
            { id: 'c', label: 'Coach', role: 'Toss', action: '🏐 Short Drop', x: 50, y: 25, color: '#64748b' }
          ],
          ball: { x: 50, y: 45, visible: true, arc: false, height: 0.5 },
          annotations: [{ text: 'Emergency Short Ball!', x: 50, y: 40 }]
        },
        {
          name: 'Phase 2: Full Extension Pancake',
          description: 'Defender executes flat-hand pancake slide to save ball.',
          duration: 2200,
          players: [
            { id: 'def', label: 'LIB', role: 'Defender', action: '🥞 Pancake Slide', x: 50, y: 45, color: '#10b981' },
            { id: 'c', label: 'Coach', role: 'Toss', action: '👀 Watching', x: 50, y: 25, color: '#64748b' }
          ],
          ball: { x: 50, y: 35, visible: true, arc: true, height: 2, from: { x: 50, y: 45 } },
          annotations: [{ text: 'PANCAKE SAVE! 🥞', x: 50, y: 50 }]
        }
      ]
    }
  },

  // =========================================================================
  // 2. SERVING & SERVE RECEIVE (4 Drills)
  // =========================================================================
  {
    id: 'serve-zone-targets',
    title: 'Zone 1 / 5 / 6 Deep & Short Target Serving',
    category: 'serving_passing',
    categoryLabel: 'Serving & Passing',
    difficulty: 'Intermediate',
    intensity: 'Moderate',
    minPlayers: 4,
    maxPlayers: 14,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Floor Mats / Cones in Zones 1, 5, 6 and Short 2/4'],
    overview: 'High-pressure serving accuracy drill to develop float consistency, deep-corner drive, and tactical short serves in front of the 10ft line.',
    setup: 'Servers line up behind endline on Side A. Target mats/towels placed in deep corners (Zone 1 & 5) and short zones (Zone 2 & 4) on Side B.',
    instructions: [
      'Each server receives 5 designated target calls from coach (e.g., "Deep 5", "Short 4", "Deep 1").',
      'Server must execute consistent toss height (2-3 feet above hitting shoulder) and firm palm contact through center of ball.',
      'Scoring system: 3 points for hitting target mat directly, 2 points for target zone, 1 point for in-bounds in general, -1 for net/out error.',
      'First player or squad to 15 points wins the round.'
    ],
    coachingKeys: [
      'Keep wrist locked and flat hand to generate no-spin knuckleball float.',
      'Toss with non-dominant hand directly in front of hitting shoulder.',
      'Accelerate through contact on deep serves; abbreviate follow-through on short floaters.'
    ],
    variations: [
      'Put live passers on Side B who must grade the pass; servers only score if passers produce a 0 or 1 pass.',
      'Consecutive streak: Must hit 3 consecutive called zones before rotating.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Serve Toss & Float Trajectory',
          description: 'Server serves float ball aiming deep for corner Zone 5.',
          duration: 2500,
          players: [
            { id: 's1', label: 'Server', role: 'Server', action: '🏐 Float Serve', x: 80, y: 95, color: '#3b82f6', path: [{ x: 80, y: 95 }, { x: 80, y: 90 }] }
          ],
          ball: { x: 80, y: 92, visible: true, arc: false, height: 1 },
          annotations: [
            { text: 'Target Mat Zone 5', x: 20, y: 15 },
            { text: 'Target Mat Zone 1', x: 80, y: 15 }
          ]
        },
        {
          name: 'Phase 2: Ball Flight Across Net',
          description: 'Ball clears net with flat trajectory toward back corner.',
          duration: 2500,
          players: [
            { id: 's1', label: 'Server', role: 'Server', action: '👀 Follow Through', x: 80, y: 90, color: '#3b82f6' }
          ],
          ball: { x: 20, y: 15, visible: true, arc: true, height: 3.5, from: { x: 80, y: 90 } },
          annotations: [{ text: 'Direct Hit on Deep 5! 🎯 (+3 Pts)', x: 25, y: 20 }]
        }
      ]
    }
  },

  {
    id: 'pass-3man-receive-triangle',
    title: '3-Person Serve Receive Triangle & Seam Mastery',
    category: 'serving_passing',
    categoryLabel: 'Serving & Passing',
    difficulty: 'Intermediate',
    intensity: 'High',
    minPlayers: 6,
    maxPlayers: 12,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Ball Cart', 'Target Ring / Setter Target Basket'],
    overview: 'Foundational receive system drill training Libero and two Outside Hitters to communicate seam boundaries, drop-step, and deliver 3-point passes to Zone 2/3 target.',
    setup: '3 primary passers on Side A in standard cup: Left Passer (Zone 5), Libero (Zone 6), Right Passer (Zone 1). Target setter in Zone 2/3. Live servers on Side B.',
    instructions: [
      'Server on Side B serves live float or top-spin serve.',
      'Passers must call "ME!" or "YOU!" before the ball crosses the net plane.',
      'Passer cuts behind the ball, drops hips, creates flat angled platform toward Zone 2/3 target.',
      'Passer must freeze platform on contact for 1 full second to confirm angle.',
      'Setter catches ball and grades pass: 3 (Perfect in target zone), 2 (Playable 5-8ft off net), 1 (Out of system high ball), 0 (Ace / Shank).'
    ],
    coachingKeys: [
      'Beat the ball to the spot with quick feet rather than reaching with swinging arms.',
      'Keep platform elbows locked and shrug shoulders to cushion hard serves.',
      'Libero takes full priority on middle seams (Zone 5/6 and Zone 6/1).'
    ],
    variations: [
      'Speed Receive: 10 serves in rapid succession without pause.',
      'Target Game: Passers must achieve 21 quality points (cumulative) before servers score 5 aces.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Serve Inbound & Ready Stance',
          description: 'Passers in athletic ready position as serve enters court.',
          duration: 2500,
          players: [
            { id: 'p5', label: 'OH1', role: 'Passer', action: '🛡️ Ready', x: 25, y: 80, color: '#f97316' },
            { id: 'p6', label: 'LIB', role: 'Libero', action: '🏃 Sliding Over', x: 50, y: 85, color: '#8b5cf6', path: [{ x: 50, y: 85 }, { x: 38, y: 72 }] },
            { id: 'p1', label: 'OH2', role: 'Passer', action: '🛡️ Ready', x: 75, y: 80, color: '#f97316' },
            { id: 'st', label: 'S Target', role: 'Target', action: '🎯 Target', x: 65, y: 30, color: '#3b82f6' }
          ],
          ball: { x: 38, y: 20, visible: true, arc: false, height: 3 },
          annotations: [{ text: 'Incoming Float Serve', x: 38, y: 25 }]
        },
        {
          name: 'Phase 2: Libero Calls Seam & Passes',
          description: 'Libero slides over to take seam ball, angling platform to target.',
          duration: 2500,
          players: [
            { id: 'p5', label: 'OH1', role: 'Passer', action: '👀 Cover', x: 22, y: 78, color: '#f97316' },
            { id: 'p6', label: 'LIB', role: 'Libero', action: '🏐 Angling Platform', x: 38, y: 72, color: '#8b5cf6' },
            { id: 'p1', label: 'OH2', role: 'Passer', action: '👀 Cover', x: 75, y: 80, color: '#f97316' },
            { id: 'st', label: 'S Target', role: 'Target', action: '🎯 Target', x: 65, y: 30, color: '#3b82f6' }
          ],
          ball: { x: 38, y: 72, visible: true, arc: true, height: 1.5, from: { x: 38, y: 20 } },
          annotations: [{ text: '"MINE! MINE!" 🗣️', x: 38, y: 78 }]
        },
        {
          name: 'Phase 3: Pinpoint Pass to Setter Target',
          description: 'Ball delivers high arching 3-point pass directly into target.',
          duration: 2500,
          players: [
            { id: 'p5', label: 'OH1', role: 'Passer', action: '🏃 Approach Prep', x: 22, y: 78, color: '#f97316' },
            { id: 'p6', label: 'LIB', role: 'Libero', action: '✅ Freeze Platform', x: 38, y: 72, color: '#8b5cf6' },
            { id: 'p1', label: 'OH2', role: 'Passer', action: '🏃 Approach Prep', x: 75, y: 80, color: '#f97316' },
            { id: 'st', label: 'S Target', role: 'Target', action: '⭐ Perfect Catch', x: 65, y: 30, color: '#3b82f6' }
          ],
          ball: { x: 65, y: 30, visible: true, arc: true, height: 2.8, from: { x: 38, y: 72 } },
          annotations: [{ text: '⭐ 3-Point Perfect Pass', x: 65, y: 22 }]
        }
      ]
    }
  },

  {
    id: 'serve-pressure-short-corners',
    title: 'Short Zone 2 / Zone 4 Drop Float Serves',
    category: 'serving_passing',
    categoryLabel: 'Serving & Passing',
    difficulty: 'Advanced',
    intensity: 'Moderate',
    minPlayers: 4,
    maxPlayers: 12,
    durationMinutes: 12,
    equipment: ['Volleyballs', 'Cones 2ft Inside 10ft Line'],
    overview: 'Tactical serving drill targeting the short front corners of the opponent court to pull front-row hitters out of their attacking approach.',
    setup: 'Servers on Side A. Cones placed in front-row corners (Zone 2 and Zone 4, 2 feet inside attack line).',
    instructions: [
      'Server contacts under the equator of the ball with high wrist pop.',
      'Ball must crest the net tape by less than 1 foot and drop dead before the 10ft line.',
      'Target: 5 balls in Zone 4 short, 5 balls in Zone 2 short.',
      'Score 2 points for landing in short box, 0 points if past 10ft line.'
    ],
    coachingKeys: [
      'Use a shorter arm swing (bunt contact) to take pace off the ball.',
      'Target the opposing middle blocker or outside hitter pulling off the net.'
    ],
    variations: [
      'Live passer in front row who must dive forward to pass.',
      'Alternate 1 deep float, 1 short drop float.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Short Drop Serve Trajectory',
          description: 'Server executes short float skimming the net tape.',
          duration: 2500,
          players: [
            { id: 's', label: 'Server', role: 'Server', action: '🏐 Short Pop', x: 25, y: 95, color: '#3b82f6' },
            { id: 'p', label: 'OH', role: 'Passer', action: '🏃 Sprinting Forward', x: 20, y: 25, color: '#f97316', path: [{ x: 20, y: 25 }, { x: 20, y: 42 }] }
          ],
          ball: { x: 20, y: 42, visible: true, arc: true, height: 2, from: { x: 25, y: 95 } },
          annotations: [{ text: 'Dead Drop Inside 10ft Line! 🎯', x: 20, y: 46 }]
        }
      ]
    }
  },

  {
    id: 'pass-deep-over-shoulder',
    title: 'Deep Over-The-Shoulder Drop-Step Passing',
    category: 'serving_passing',
    categoryLabel: 'Serving & Passing',
    difficulty: 'Advanced',
    intensity: 'High',
    minPlayers: 3,
    maxPlayers: 8,
    durationMinutes: 12,
    equipment: ['Volleyballs', 'Ball Cart'],
    overview: 'Specialized passing drill training passers to drop-step on deep topspin or heavy float serves that travel over their head to avoid getting handcuffed.',
    setup: 'Passer starts at 15ft line. Coach standing on opposite baseline driving deep high balls.',
    instructions: [
      'Coach drives deep ball toward endline.',
      'Passer opens hips with 45° drop-step, runs with shoulders turned to track ball.',
      'Passer cuts behind ball, re-squares to setter target in Zone 2/3, and lifts pass with soft platform.',
      'Rotate after 5 reps.'
    ],
    coachingKeys: [
      'Do not backpedal! Turn and sprint back.',
      'Tilt platform back toward the net to create high arching trajectory.'
    ],
    variations: [
      'Hand-passing option: Setter hands above forehead for high deep balls.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Drop-Step & Sprint Back',
          description: 'Passer drop-steps and tracks deep ball to baseline.',
          duration: 2200,
          players: [
            { id: 'p', label: 'LIB', role: 'Passer', action: '🏃 Drop-Step Sprint', x: 50, y: 60, color: '#8b5cf6', path: [{ x: 50, y: 60 }, { x: 50, y: 88 }] },
            { id: 's', label: 'Setter', role: 'Target', action: '🎯 Target', x: 65, y: 30, color: '#3b82f6' }
          ],
          ball: { x: 50, y: 88, visible: true, arc: true, height: 3.5, from: { x: 50, y: 15 } },
          annotations: [{ text: 'Deep Driven Ball Over Head', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: Re-Square & High Target Pass',
          description: 'Passer plants, tilts platform, and delivers high pass to setter.',
          duration: 2400,
          players: [
            { id: 'p', label: 'LIB', role: 'Passer', action: '🏐 High Platform Lift', x: 50, y: 88, color: '#8b5cf6' },
            { id: 's', label: 'Setter', role: 'Target', action: '⭐ Perfect Catch', x: 65, y: 30, color: '#3b82f6' }
          ],
          ball: { x: 65, y: 30, visible: true, arc: true, height: 3, from: { x: 50, y: 88 } },
          annotations: [{ text: 'High Arc to Zone 2/3', x: 65, y: 22 }]
        }
      ]
    }
  },

  // =========================================================================
  // 3. DEFENSE & DIGGING (4 Drills)
  // =========================================================================
  {
    id: 'def-coach-box-rapid-dig',
    title: 'Coach-on-Box Rapid Fire Perimeter Digging',
    category: 'defense',
    categoryLabel: 'Defense & Digging',
    difficulty: 'Advanced',
    intensity: 'Maximum',
    minPlayers: 3,
    maxPlayers: 8,
    durationMinutes: 12,
    equipment: ['Volleyballs (10+)', 'Sturdy Attack Box / Table', 'Ball Cart'],
    overview: 'High-speed reaction defense drill training back-row defenders to dig full-power spikes, absorb pace, and pop high balls to mid-court for counter-attack.',
    setup: 'Coach standing on box at Zone 4 hitting into Zone 5, Zone 6, and Zone 1.',
    instructions: [
      'Defender starts at base defense (12ft off net, balanced stance, chest forward).',
      'As coach takes arm back on box, defender stops and reads arm swing direction.',
      'Coach spikes hard-driven ball cross-court or down the line.',
      'Defender reacts, stays low, and digs ball high toward the 10ft line middle court.',
      'Defender immediately resets for 4 consecutive rapid balls.'
    ],
    coachingKeys: [
      'Be STOPPED and balanced on defense at the moment the hitter makes contact.',
      'Absorb heavy balls by relaxing platform and dropping shoulders slightly.',
      'Dig balls high (15+ feet) so transition hitters have time to open up.'
    ],
    variations: [
      'Add occasional off-speed tip/roll shot requiring a sprint and pancake/sprawl.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Base Position & Read',
          description: 'Defender reading coach arm-swing on attack box.',
          duration: 2000,
          players: [
            { id: 'box', label: 'Coach', role: 'Hitter', action: '💥 Arm Loaded', x: 20, y: 15, color: '#ef4444' },
            { id: 'd1', label: 'LIB', role: 'Defender', action: '🛡️ Base Defense', x: 75, y: 80, color: '#10b981' }
          ],
          ball: { x: 20, y: 15, visible: true, arc: false, height: 2 },
          annotations: [{ text: 'Attack Box (Zone 4)', x: 20, y: 10 }]
        },
        {
          name: 'Phase 2: Hard-Driven Spike Cross-Court',
          description: 'Coach spikes fast ball toward deep Right Back (Zone 1).',
          duration: 2000,
          players: [
            { id: 'box', label: 'Coach', role: 'Hitter', action: '⚡ Full Power Spike', x: 20, y: 15, color: '#ef4444' },
            { id: 'd1', label: 'LIB', role: 'Defender', action: '🛡️ Absorb Platform', x: 75, y: 80, color: '#10b981' }
          ],
          ball: { x: 75, y: 80, visible: true, arc: true, height: 1.5, from: { x: 20, y: 15 } },
          annotations: [{ text: '90mph Spike! ⚡', x: 45, y: 50 }]
        },
        {
          name: 'Phase 3: High Absorb Dig to 10ft Line',
          description: 'Defender digs ball high and center for transition offense.',
          duration: 2500,
          players: [
            { id: 'box', label: 'Coach', role: 'Hitter', action: '👀 Follow Ball', x: 20, y: 15, color: '#ef4444' },
            { id: 'd1', label: 'LIB', role: 'Defender', action: '✅ Recovery Stance', x: 75, y: 80, color: '#10b981' }
          ],
          ball: { x: 50, y: 40, visible: true, arc: true, height: 3.5, from: { x: 75, y: 80 } },
          annotations: [{ text: 'High Transition Dig 🛡️', x: 50, y: 35 }]
        }
      ]
    }
  },

  {
    id: 'def-tip-coverage-campfire',
    title: 'Campfire & Roll-Shot Coverage Pursuit',
    category: 'defense',
    categoryLabel: 'Defense & Digging',
    difficulty: 'Intermediate',
    intensity: 'High',
    minPlayers: 4,
    maxPlayers: 10,
    durationMinutes: 12,
    equipment: ['Volleyballs', 'Net'],
    overview: 'Drill preventing the dreaded "campfire ball" where tips and roll shots fall untouched in the middle 10-foot donut hole between blockers and back-row defenders.',
    setup: '3 back-row defenders (Zones 5, 6, 1) and 2 front-row blockers (Zones 4, 3). Hitter on opposite side.',
    instructions: [
      'Opponent hitter shows power approach, then tips short into Zone 3/6 donut hole.',
      'Back-row defenders collapse forward with verbal call ("TIP! TIP!").',
      'Defender sprawls or uses low platform to pop ball high.',
      'Libero or Setter steps in to secondary-set the dug ball to the outside pin.'
    ],
    coachingKeys: [
      'Read hitter hand deceleration before they contact the ball.',
      'Front-row off-blocker peels off the net to assist tip coverage.'
    ],
    variations: [
      'Alternate between deep corners and short donut tips.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Opponent Hitter Tips Short',
          description: 'Hitter fakes hard spike and tips ball into campfire zone.',
          duration: 2200,
          players: [
            { id: 'opp', label: 'Opp Hitter', role: 'Attacker', action: '🏐 Soft Tip', x: 25, y: 15, color: '#ef4444' },
            { id: 'd5', label: 'OH', role: 'Defense', action: '🏃 Collapsing', x: 25, y: 75, color: '#3b82f6', path: [{ x: 25, y: 75 }, { x: 40, y: 48 }] },
            { id: 'lib', label: 'LIB', role: 'Defense', action: '🏃 Sprinting', x: 50, y: 80, color: '#8b5cf6', path: [{ x: 50, y: 80 }, { x: 48, y: 48 }] }
          ],
          ball: { x: 45, y: 48, visible: true, arc: true, height: 2, from: { x: 25, y: 15 } },
          annotations: [{ text: '"TIP! TIP!" 🗣️', x: 45, y: 42 }]
        },
        {
          name: 'Phase 2: Low Platform Pop & Set Transition',
          description: 'Defender pops ball high; setter transitions to set outside.',
          duration: 2400,
          players: [
            { id: 'opp', label: 'Opp Hitter', role: 'Attacker', action: '👀 Recovering', x: 25, y: 15, color: '#ef4444' },
            { id: 'd5', label: 'OH', role: 'Defense', action: '🛡️ Low Dig', x: 40, y: 48, color: '#3b82f6' },
            { id: 'lib', label: 'LIB', role: 'Secondary Set', action: '🏐 Jump Set', x: 48, y: 45, color: '#8b5cf6' }
          ],
          ball: { x: 20, y: 35, visible: true, arc: true, height: 2.5, from: { x: 40, y: 48 } },
          annotations: [{ text: 'Secondary Set to Pin 🎯', x: 20, y: 30 }]
        }
      ]
    }
  },

  {
    id: 'def-3-man-perimeter-transition',
    title: 'Perimeter Defense to 3-Hitter Transition Swing',
    category: 'defense',
    categoryLabel: 'Defense & Digging',
    difficulty: 'Advanced',
    intensity: 'High',
    minPlayers: 6,
    maxPlayers: 12,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net', 'Ball Cart'],
    overview: 'Full court defensive transition drill training 3 back-row defenders to dig live spikes, while 3 front-row hitters immediately transition off the net for a 3-option attack.',
    setup: 'Side A has full 6 players on court. Coach on Side B with ball cart.',
    instructions: [
      'Coach hits hard ball into Side A perimeter defense.',
      'Defender digs ball high to Zone 2/3 target.',
      'Outside (Zone 4), Middle (Zone 3), and Right Side (Zone 2) all call their approach tempos ("FOUR!", "ONE!", "TWO!").',
      'Setter distributes to best option; hitter executes transition kill.'
    ],
    coachingKeys: [
      'All 3 hitters must approach on every single dig, even if they do not get the ball (run decoys!).',
      'High dig gives time for all 3 hitters to transition.'
    ],
    variations: [
      'Add back-row pipe attacker as a 4th hitting option.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Perimeter Dig & Triple Transition',
          description: 'Defender digs while 3 front-row hitters transition off net.',
          duration: 2500,
          players: [
            { id: 'oh', label: 'OH', role: 'Hitter', action: '🏃 Transition to 10ft', x: 20, y: 25, color: '#f97316', path: [{ x: 20, y: 25 }, { x: 15, y: 65 }] },
            { id: 'mb', label: 'MB', role: 'Hitter', action: '🏃 Quick Approach', x: 50, y: 25, color: '#f97316', path: [{ x: 50, y: 25 }, { x: 48, y: 45 }] },
            { id: 'rs', label: 'RS', role: 'Hitter', action: '🏃 Transition to 10ft', x: 80, y: 25, color: '#f97316', path: [{ x: 80, y: 25 }, { x: 85, y: 65 }] },
            { id: 's', label: 'S', role: 'Setter', action: '🏐 Sette Release', x: 65, y: 30, color: '#a855f7' },
            { id: 'lib', label: 'LIB', role: 'Defense', action: '🛡️ High Dig', x: 50, y: 80, color: '#10b981' }
          ],
          ball: { x: 65, y: 30, visible: true, arc: true, height: 3.5, from: { x: 50, y: 80 } },
          annotations: [{ text: '3 Hitters Live! (OH, MB, RS)', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: Quick Middle Set & Spike',
          description: 'Setter runs fast-tempo 51 quick set to Middle Blocker.',
          duration: 2500,
          players: [
            { id: 'oh', label: 'OH', role: 'Hitter', action: '👀 Decoy Approach', x: 15, y: 65, color: '#f97316' },
            { id: 'mb', label: 'MB', role: 'Hitter', action: '💥 Quick 51 Spike', x: 48, y: 28, color: '#f97316' },
            { id: 'rs', label: 'RS', role: 'Hitter', action: '👀 Decoy Approach', x: 85, y: 65, color: '#f97316' },
            { id: 's', label: 'S', role: 'Setter', action: '🏐 Quick Push', x: 65, y: 30, color: '#a855f7' },
            { id: 'lib', label: 'LIB', role: 'Defense', action: '👀 Cover', x: 50, y: 80, color: '#10b981' }
          ],
          ball: { x: 48, y: 28, visible: true, arc: true, height: 1.8, from: { x: 65, y: 30 } },
          annotations: [{ text: 'FAST TEMPO KILL! ⚡', x: 48, y: 22 }]
        }
      ]
    }
  },

  // =========================================================================
  // 4. SETTING & TRANSITION (4 Drills)
  // =========================================================================
  {
    id: 'set-out-of-system-wheel',
    title: 'Setter Out-of-System Wheel & Back-Set Accuracy',
    category: 'setting',
    categoryLabel: 'Setting & Transition',
    difficulty: 'Advanced',
    intensity: 'Moderate',
    minPlayers: 4,
    maxPlayers: 10,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Target Hoops / Antennas', 'Ball Cart'],
    overview: 'Specialized setting drill training setters to sprint off the net to retrieve imperfect passes (Zones 5, 6, 1) and deliver clean, hittable sets to both pins (Zone 4 and Zone 2).',
    setup: 'Setter starts at home base (Zone 2/3). Coach tosses balls to various off-net locations: 10ft off, deep Zone 6, and tight to Zone 4 antenna.',
    instructions: [
      'Coach tosses varied passes away from the target spot.',
      'Setter tracks ball with fast footwork (Right-Left-Right), squares shoulders to the Left Front antenna.',
      'Setter makes contact above forehead, using strong wrist and leg extension to push high-ball to Zone 4 (Outside) or back-set to Zone 2 (Opposite).',
      'Hitters at the pins catch or hit the sets to verify tempo and distance from net (3 feet off net).',
      'Setter must complete 10 consecutive accurate sets to both pins.'
    ],
    coachingKeys: [
      'Always square hips and shoulders to the left antenna, even when setting backward.',
      'Contact ball with soft, dish-shaped hands directly above hairline.',
      'Use legs to power long sets across the court rather than pushing with elbows.'
    ],
    variations: [
      'Jump Setting: Setter must jump set all balls within 10ft of the net.',
      'Blind Call: Coach shouts "FOUR!" or "TWO!" in mid-air to test reactionary setting.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Off-Net Toss to 12ft Line',
          description: 'Pass is pushed 12ft off net into Zone 6.',
          duration: 2000,
          players: [
            { id: 's1', label: 'Setter', role: 'Setter', action: '🏃 Sprinting Off Net', x: 65, y: 30, color: '#a855f7', path: [{ x: 65, y: 30 }, { x: 45, y: 55 }] },
            { id: 'c1', label: 'Coach', role: 'Toss', action: '🏐 Off-Net Toss', x: 50, y: 80, color: '#64748b' }
          ],
          ball: { x: 45, y: 55, visible: true, arc: true, height: 2.5, from: { x: 50, y: 80 } },
          annotations: [{ text: 'Off-Net Pass (12ft Off)', x: 45, y: 60 }]
        },
        {
          name: 'Phase 2: Setter Sprint & Square Up',
          description: 'Setter sprints to ball, establishes base, and squares to Zone 4.',
          duration: 2500,
          players: [
            { id: 's1', label: 'Setter', role: 'Setter', action: '📐 Square to Antenna', x: 45, y: 55, color: '#a855f7' },
            { id: 'c1', label: 'Coach', role: 'Toss', action: '👀 Watching', x: 50, y: 80, color: '#64748b' }
          ],
          ball: { x: 45, y: 52, visible: true, arc: false, height: 1.5 },
          annotations: [{ text: 'Hands Above Hairline 🏐', x: 45, y: 48 }]
        },
        {
          name: 'Phase 3: Back-Set Delivery to Right Side',
          description: 'Setter pushes high back-set to Zone 2 antenna.',
          duration: 2500,
          players: [
            { id: 's1', label: 'Setter', role: 'Setter', action: '🏐 Back-Set Extension', x: 45, y: 55, color: '#a855f7' },
            { id: 'opp', label: 'OPP', role: 'Hitter', action: '💥 Attack Approach', x: 80, y: 30, color: '#f97316' }
          ],
          ball: { x: 80, y: 25, visible: true, arc: true, height: 3, from: { x: 45, y: 52 } },
          annotations: [{ text: 'Pinpoint Back-Set to Zone 2 🏐', x: 80, y: 20 }]
        }
      ]
    }
  },

  {
    id: 'set-middle-slide-tempo',
    title: 'Setter-Middle Slide Connection (Zone 2 Antenna Cut)',
    category: 'setting',
    categoryLabel: 'Setting & Transition',
    difficulty: 'Advanced',
    intensity: 'High',
    minPlayers: 4,
    maxPlayers: 8,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net', 'Target Ring'],
    overview: 'High-level offensive connection drill training Middle Blockers to run a fast slide approach behind the setter to the right antenna, hitting off one foot.',
    setup: 'Setter in Zone 2/3. Middle Blocker starts in Zone 3. Passer/Coach in Zone 6.',
    instructions: [
      'Passer passes ball to Setter in Zone 2/3.',
      'As ball leaves passer hands, Middle Blocker cuts behind setter toward Zone 2 right antenna.',
      'Middle takes off explosively from Left foot (one-foot takeoff), drifting laterally along the net.',
      'Setter pushes flat, fast back-set right into Middle hitting window.',
      'Middle spikes sharp cross-court or down the line.'
    ],
    coachingKeys: [
      'Middle must take off on the LEFT foot like a basketball layup.',
      'Setter sets the ball with a flat arc that meets the middle at peak jump.'
    ],
    variations: [
      'Add a live blocker who must read whether middle is running slide or quick 51.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Pass & Middle Slide Cut',
          description: 'Middle cuts behind setter as pass enters Zone 2/3.',
          duration: 2200,
          players: [
            { id: 'mb', label: 'MB', role: 'Hitter', action: '🏃 Cutting Behind Setter', x: 45, y: 30, color: '#f97316', path: [{ x: 45, y: 30 }, { x: 82, y: 25 }] },
            { id: 's', label: 'Setter', role: 'Setter', action: '🏐 Jump Setting', x: 65, y: 28, color: '#a855f7' }
          ],
          ball: { x: 65, y: 28, visible: true, arc: true, height: 2.2, from: { x: 50, y: 75 } },
          annotations: [{ text: 'Slide Cut Behind Setter 🏃', x: 60, y: 35 }]
        },
        {
          name: 'Phase 2: One-Foot Takeoff & Slide Spike',
          description: 'Middle leaps off one foot at right antenna and spikes.',
          duration: 2500,
          players: [
            { id: 'mb', label: 'MB', role: 'Hitter', action: '💥 1-Foot Takeoff Spike', x: 82, y: 25, color: '#f97316' },
            { id: 's', label: 'Setter', role: 'Setter', action: '👀 Follow Ball', x: 65, y: 28, color: '#a855f7' }
          ],
          ball: { x: 25, y: 80, visible: true, arc: true, height: 2, from: { x: 82, y: 25 } },
          annotations: [{ text: 'UNSTOPPABLE SLIDE KILL! ⚡', x: 30, y: 75 }]
        }
      ]
    }
  },

  {
    id: 'set-pipe-backrow-tempo',
    title: 'Back-Row Pipe Attack & Middle Decoy Timing',
    category: 'setting',
    categoryLabel: 'Setting & Transition',
    difficulty: 'Advanced',
    intensity: 'High',
    minPlayers: 5,
    maxPlayers: 12,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net'],
    overview: 'Trains offensive synchronization where Middle Blocker jumps for a quick decoy while the back-row Outside Hitter leaps from behind the 10ft line in Zone 8 for a high-speed pipe kill.',
    setup: 'Setter in Zone 2/3, Middle in Zone 3, Pipe Hitter in Zone 8 (Middle Back behind 10ft line).',
    instructions: [
      'Pass delivered to Setter.',
      'Middle blocker leaps for quick 51 set, drawing the opposing middle blocker.',
      'Setter pushes fast 2nd-tempo set into middle back (Zone 8, 3 feet behind 10ft line).',
      'Pipe hitter leaps from behind 10ft line, contacts ball at 10.5ft height, and spikes down into deep corners.'
    ],
    coachingKeys: [
      'Middle must jump with full intent to sell the fake block.',
      'Pipe hitter must not step on the 10ft line before takeoff.'
    ],
    variations: [
      'Bic Set: Super-fast 1st tempo pipe set where back-row hitter jumps simultaneously with middle.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Middle Decoy Jump & Pipe Approach',
          description: 'Middle jumps on quick set while pipe hitter approaches Zone 8.',
          duration: 2400,
          players: [
            { id: 'mb', label: 'MB', role: 'Decoy', action: '💥 Decoy Jump', x: 48, y: 22, color: '#f97316' },
            { id: 'pipe', label: 'OH', role: 'Pipe Hitter', action: '🚀 10ft Line Takeoff', x: 50, y: 55, color: '#3b82f6', path: [{ x: 50, y: 75 }, { x: 50, y: 48 }] },
            { id: 's', label: 'Setter', role: 'Setter', action: '🏐 Push to Zone 8', x: 65, y: 28, color: '#a855f7' }
          ],
          ball: { x: 50, y: 46, visible: true, arc: true, height: 2.8, from: { x: 65, y: 28 } },
          annotations: [{ text: 'Middle Draws Blockers! 🎯', x: 48, y: 15 }]
        },
        {
          name: 'Phase 2: Pipe Spike Over Net',
          description: 'Pipe hitter contacts at peak height and hits past block.',
          duration: 2400,
          players: [
            { id: 'mb', label: 'MB', role: 'Decoy', action: '👀 Landing', x: 48, y: 22, color: '#f97316' },
            { id: 'pipe', label: 'OH', role: 'Pipe Hitter', action: '💥 PIPE SPIKE', x: 50, y: 46, color: '#3b82f6' },
            { id: 's', label: 'Setter', role: 'Setter', action: '👀 Cover', x: 65, y: 28, color: '#a855f7' }
          ],
          ball: { x: 80, y: 85, visible: true, arc: true, height: 2, from: { x: 50, y: 46 } },
          annotations: [{ text: 'THUNDEROUS PIPE KILL! 💥', x: 80, y: 80 }]
        }
      ]
    }
  },

  {
    id: 'set-dump-tactics',
    title: 'Left-Handed Setter Tip & Power Dump Drill',
    category: 'setting',
    categoryLabel: 'Setting & Transition',
    difficulty: 'Intermediate',
    intensity: 'Moderate',
    minPlayers: 3,
    maxPlayers: 8,
    durationMinutes: 10,
    equipment: ['Volleyballs', 'Net'],
    overview: 'Drill for front-row setters to disguise 2nd-contact setter dumps into deep Zone 4 corner or short Zone 2 campfire hole.',
    setup: 'Setter in front-row Zone 2/3. Defense set up on opposite side.',
    instructions: [
      'Pass delivered tight to net (1-2 feet off).',
      'Setter jumps with both hands high, appearing to set to outside pin.',
      'At peak jump, setter flicks left hand / wrist to push ball into open deep corner (Zone 4) or short tip over block.',
      'Execute 10 dumps: 5 power pushes to deep corner, 5 soft tips over blocker hands.'
    ],
    coachingKeys: [
      'Disguise is everything—keep both hands up until the microsecond of contact.',
      'Eye the blockers: dump when middle commits early to the quick hitter.'
    ],
    variations: [
      'Live middle blocker who jumps on setter to test decision making.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Setter Jump Set Disguise',
          description: 'Setter leaps with 2 hands up as if setting outside pin.',
          duration: 2200,
          players: [
            { id: 's', label: 'Setter', role: 'Setter', action: '🏐 Jump Disguise', x: 65, y: 52, color: '#a855f7' },
            { id: 'opp', label: 'Opp MB', role: 'Blocker', action: '👀 Reading', x: 50, y: 45, color: '#ef4444' }
          ],
          ball: { x: 65, y: 52, visible: true, arc: false, height: 2.5 },
          annotations: [{ text: 'Both Hands Up High', x: 65, y: 58 }]
        },
        {
          name: 'Phase 2: Left-Hand Power Dump to Deep Corner',
          description: 'Setter flicks left hand and dumps ball into deep Zone 4 corner.',
          duration: 2500,
          players: [
            { id: 's', label: 'Setter', role: 'Setter', action: '💥 Left-Hand Dump', x: 65, y: 52, color: '#a855f7' },
            { id: 'opp', label: 'Opp MB', role: 'Blocker', action: '😮 Fooled!', x: 50, y: 45, color: '#ef4444' }
          ],
          ball: { x: 15, y: 15, visible: true, arc: true, height: 2, from: { x: 65, y: 52 } },
          annotations: [{ text: 'SNEAKY SETTER DUMP! 🎯 (+Point)', x: 20, y: 20 }]
        }
      ]
    }
  },

  // =========================================================================
  // 5. ATTACKING & HITTING (4 Drills)
  // =========================================================================
  {
    id: 'hit-transition-off-net',
    title: 'Blocker Transition Off-The-Net to Fast Counter-Attack',
    category: 'hitting',
    categoryLabel: 'Attacking & Hitting',
    difficulty: 'Intermediate',
    intensity: 'High',
    minPlayers: 4,
    maxPlayers: 12,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net', 'Ball Cart'],
    overview: 'Game-realistic transition drill training front-row hitters to land from a block jump, turn and sprint off the net to the 10ft line, and immediately accelerate into an approach.',
    setup: 'Outside Hitter (Zone 4) and Middle Blocker (Zone 3) start in ready blocking position at the net. Setter in Zone 2/3. Coach on opposite side.',
    instructions: [
      'Coach taps ball on Side B to trigger block jump by OH and MB.',
      'Hitters execute block jump with hands penetrating over net.',
      'Upon landing, hitters turn toward the court interior, take 2-3 explosive transition steps off the net past the 10ft line.',
      'Coach free-balls or passes to Setter, who sets high ball to OH or quick to MB.',
      'Hitter accelerates into standard 3-step approach and spikes into designated court target.'
    ],
    coachingKeys: [
      'Never backpedal off the net! Turn your hips and sprint forward to the 10ft line.',
      'Get fully behind the 10ft line before initiating your attacking approach.',
      'Keep eyes on the setter while transitioning.'
    ],
    variations: [
      'Live Block: Place a live blocker on the opposite side to contest the spike.',
      'Opposite Side: Run for Right-Side / Opposite hitter in Zone 2.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Block Jump at Net',
          description: 'Outside hitter executes block jump at Zone 4 net.',
          duration: 2000,
          players: [
            { id: 'h4', label: 'OH', role: 'Blocker', action: '🧱 Block Jump', x: 20, y: 22, color: '#f97316' },
            { id: 's1', label: 'S', role: 'Setter', action: '👀 Ready', x: 65, y: 30, color: '#a855f7' }
          ],
          ball: { x: 20, y: 15, visible: false },
          annotations: [{ text: 'Block Jump at Net 🧱', x: 20, y: 28 }]
        },
        {
          name: 'Phase 2: Sprint Transition to 10ft Line',
          description: 'Hitter lands, opens hips, and sprints to 10ft line.',
          duration: 2500,
          players: [
            { id: 'h4', label: 'OH', role: 'Transition', action: '🏃 Sprinting Back', x: 15, y: 65, color: '#f97316', path: [{ x: 20, y: 22 }, { x: 15, y: 65 }] },
            { id: 's1', label: 'S', role: 'Setter', action: '🏐 Setting Outside', x: 65, y: 30, color: '#a855f7' }
          ],
          ball: { x: 65, y: 30, visible: true, arc: true, height: 2.5, from: { x: 50, y: 80 } },
          annotations: [{ text: 'Open Hips & Transition Back 🏃', x: 15, y: 70 }]
        },
        {
          name: 'Phase 3: High Set & Spike Across Court',
          description: 'Setter delivers high ball to Zone 4; hitter approaches and spikes.',
          duration: 2500,
          players: [
            { id: 'h4', label: 'OH', role: 'Hitter', action: '💥 Spike Approach', x: 20, y: 28, color: '#f97316' },
            { id: 's1', label: 'S', role: 'Setter', action: '👀 Cover', x: 65, y: 30, color: '#a855f7' }
          ],
          ball: { x: 80, y: 80, visible: true, arc: true, height: 2, from: { x: 20, y: 28 } },
          annotations: [{ text: 'Spike Deep Cross-Court 💥', x: 75, y: 75 }]
        }
      ]
    }
  },

  {
    id: 'hit-tooling-block-wipes',
    title: 'Tooling the Block & Outside Hand Wipes',
    category: 'hitting',
    categoryLabel: 'Attacking & Hitting',
    difficulty: 'Advanced',
    intensity: 'High',
    minPlayers: 4,
    maxPlayers: 10,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net', 'Blocker Board or Live Blockers'],
    overview: 'High-IQ attacking drill teaching hitters how to score off tight or out-of-system sets by wiping the ball off the outside hand of the opposing blocker out of bounds.',
    setup: 'Hitter in Zone 4 (Left Front). Two live blockers on opposite side sealing the cross-court angle.',
    instructions: [
      'Setter pushes tight set toward antenna.',
      'Hitter approaches, sees the double block closing the angle.',
      'Hitter reaches high, contacts the outside half of the ball, and wipes sideways off the right blocker’s pinky finger out of bounds.',
      'Score 2 points for successful tool out-of-bounds, 0 points for hitting into court defense, -1 for hitting into block roof.'
    ],
    coachingKeys: [
      'Hit the ball high off the top 2 inches of blocker fingers.',
      'Swipe hand laterally from inside to outside across the body.'
    ],
    variations: [
      'Right-side hitter wiping off opposing left blocker.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Tight Set & Double Block Formed',
          description: 'Setter pushes set close to antenna as double block goes up.',
          duration: 2200,
          players: [
            { id: 'h', label: 'OH', role: 'Hitter', action: '💥 Approach', x: 20, y: 65, color: '#f97316', path: [{ x: 20, y: 65 }, { x: 18, y: 54 }] },
            { id: 'b1', label: 'B1', role: 'Blocker', action: '🧱 Sealing Angle', x: 18, y: 46, color: '#06b6d4' },
            { id: 'b2', label: 'B2', role: 'Blocker', action: '🧱 Middle Seal', x: 28, y: 46, color: '#06b6d4' }
          ],
          ball: { x: 18, y: 52, visible: true, arc: true, height: 2.8, from: { x: 50, y: 65 } },
          annotations: [{ text: 'Double Block Set', x: 25, y: 42 }]
        },
        {
          name: 'Phase 2: Wipe Off Outside Hand Out of Bounds',
          description: 'Hitter swipes ball off outside blocker hand off the sideline.',
          duration: 2500,
          players: [
            { id: 'h', label: 'OH', role: 'Hitter', action: '🖐️ Lateral Wipe', x: 18, y: 54, color: '#f97316' },
            { id: 'b1', label: 'B1', role: 'Blocker', action: '🧱 Hand Deflection', x: 18, y: 46, color: '#06b6d4' },
            { id: 'b2', label: 'B2', role: 'Blocker', action: '🧱 Land', x: 28, y: 46, color: '#06b6d4' }
          ],
          ball: { x: 2, y: 35, visible: true, arc: true, height: 1.5, from: { x: 18, y: 50 } },
          annotations: [{ text: 'TOOLED OFF HANDS! 💥 (Point Us)', x: 5, y: 30 }]
        }
      ]
    }
  },

  {
    id: 'hit-cross-vs-line-shotmaking',
    title: 'Sharp Cross-Court vs Line Attack Target Challenge',
    category: 'hitting',
    categoryLabel: 'Attacking & Hitting',
    difficulty: 'Intermediate',
    intensity: 'High',
    minPlayers: 4,
    maxPlayers: 12,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net', 'Target Mats in Deep Line and Sharp Angle'],
    overview: 'Trains hitters to read the opposing blocker positioning during their approach and make the split-second decision to rip line or cut sharp cross-court.',
    setup: 'Hitter in Zone 4. Blocker on opposite side randomly taking away line or cross. Target mats placed in sharp angle (10ft sideline) and deep line corner.',
    instructions: [
      'Setter sets medium-tempo ball to Zone 4.',
      'Hitter approaches with eyes up watching blocker.',
      'If blocker shades cross-court, hitter rotates wrist and hits hard down the line.',
      'If blocker sets line, hitter drops thumb down and cuts sharp cross-court into 10ft box.'
    ],
    coachingKeys: [
      'Do not telegraph your shot with your approach angle—approach the same every time.',
      'Wrist snap determines final ball direction.'
    ],
    variations: [
      'Coach calls "LINE!" or "CROSS!" during hitter approach.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Approach & Read Line Blocker',
          description: 'Hitter sees blocker set on the line.',
          duration: 2200,
          players: [
            { id: 'h', label: 'OH', role: 'Hitter', action: '💥 Approach Plant', x: 20, y: 30, color: '#f97316' }
          ],
          ball: { x: 20, y: 24, visible: true, arc: false, height: 2.5 },
          annotations: [
            { text: 'Target Mat Sharp Cut', x: 80, y: 45 },
            { text: 'Target Mat Deep Line', x: 15, y: 85 }
          ]
        },
        {
          name: 'Phase 2: Sharp Cut Across 10ft Box',
          description: 'Hitter turns wrist and hits sharp cut into open angle.',
          duration: 2500,
          players: [
            { id: 'h', label: 'OH', role: 'Hitter', action: '🏐 Wrist Snap', x: 20, y: 24, color: '#f97316' }
          ],
          ball: { x: 80, y: 45, visible: true, arc: true, height: 1.5, from: { x: 20, y: 24 } },
          annotations: [{ text: 'SHARP ANGLE KILL! 🎯 (+Point)', x: 80, y: 50 }]
        }
      ]
    }
  },

  {
    id: 'hit-out-of-system-high-ball',
    title: 'Out-of-System Deep Corner High Balls',
    category: 'hitting',
    categoryLabel: 'Attacking & Hitting',
    difficulty: 'Advanced',
    intensity: 'High',
    minPlayers: 4,
    maxPlayers: 12,
    durationMinutes: 12,
    equipment: ['Volleyballs', 'Net'],
    overview: 'Trains hitters to manage chaotic, out-of-system high sets pushed 8 feet off the net, avoiding unforced net errors and targeting deep corners.',
    setup: 'Coach tosses high out-of-system balls from deep Zone 6 to Zone 4 and Zone 2.',
    instructions: [
      'Hitter stays patient behind the 10ft line, timing the slow-falling ball.',
      'Wait until ball reaches peak height before initiating penultimate step.',
      'Contact high and drive ball with heavy topspin to deep corners (Zone 5 or Zone 1 baseline).'
    ],
    coachingKeys: [
      'Patience on out-of-system sets—do not run under the ball too early.',
      'High-risk balls: aim for back corners or deep roll shots.'
    ],
    variations: [
      'Add 3 transition defenders on opposite side.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: High Rainbow Set',
          description: 'Pass is pushed high and 8ft off the net.',
          duration: 2500,
          players: [
            { id: 'h', label: 'OH', role: 'Hitter', action: '⏳ Patient Timing', x: 15, y: 70, color: '#f97316' },
            { id: 's', label: 'Setter', role: 'Setter', action: '🏐 High Moonball', x: 50, y: 60, color: '#a855f7' }
          ],
          ball: { x: 20, y: 45, visible: true, arc: true, height: 4, from: { x: 50, y: 60 } },
          annotations: [{ text: 'High Moonball Set (15ft High)', x: 25, y: 40 }]
        },
        {
          name: 'Phase 2: Deep Corner Topspin Attack',
          description: 'Hitter contacts high and drives ball deep into Zone 1 corner.',
          duration: 2500,
          players: [
            { id: 'h', label: 'OH', role: 'Hitter', action: '💥 High Reach Hit', x: 20, y: 45, color: '#f97316' }
          ],
          ball: { x: 80, y: 90, visible: true, arc: true, height: 2, from: { x: 20, y: 45 } },
          annotations: [{ text: 'Deep Baseline Topspin! 🏐', x: 80, y: 85 }]
        }
      ]
    }
  },

  // =========================================================================
  // 6. BLOCKING & NET PLAY (3 Drills)
  // =========================================================================
  {
    id: 'block-shuffle-and-seal',
    title: 'Middle-Pin Shuffle & Swing Blocking Seam Seal',
    category: 'blocking',
    categoryLabel: 'Blocking & Net Play',
    difficulty: 'Advanced',
    intensity: 'High',
    minPlayers: 4,
    maxPlayers: 8,
    durationMinutes: 12,
    equipment: ['Volleyballs', 'Net', 'Blocker Pad / Foam Pool Noodle (optional)'],
    overview: 'Technique drill teaching Middle Blockers and Pin Blockers to close the seam, press hands deep across the net, and angle outer hand inward to prevent toolouts.',
    setup: 'Middle Blocker (Zone 3) and Outside Pin Blocker (Zone 4) start at net with hands up in ready posture. Coach on opposite side with ball.',
    instructions: [
      'Coach on Side B sets ball to Left or Right pin.',
      'Pin blocker sets the block 3 feet inside the antenna, angling outer hand inside toward court center.',
      'Middle blocker reads set, executes dynamic 3-step swing block (Open-Crossover-Plant) and closes shoulder-to-shoulder with pin blocker.',
      'Both blockers jump simultaneously, reaching across net into opponent airspace before hitter makes contact.',
      'Land balanced, turn toward inside court to track the ball.'
    ],
    coachingKeys: [
      'Eye sequence: Ball ➔ Setter ➔ Ball ➔ Hitter.',
      'Penetrate across the net—do NOT reach straight up.',
      'Middle must close the seam completely: "No daylight between shoulders!"'
    ],
    variations: [
      'Double vs Triple Block: Add Opposite blocker in Zone 2 to seal against opponent middle quicks.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Ready Base at Net',
          description: 'Middle and Pin blockers in ready blocking stance.',
          duration: 2000,
          players: [
            { id: 'pin', label: 'OH', role: 'Pin Blocker', action: '🧱 Ready Posture', x: 25, y: 22, color: '#06b6d4' },
            { id: 'mid', label: 'MB', role: 'Middle Blocker', action: '👀 Reading Setter', x: 50, y: 22, color: '#06b6d4', path: [{ x: 50, y: 22 }, { x: 30, y: 22 }] }
          ],
          ball: { x: 50, y: 15, visible: true, arc: false, height: 1.5 },
          annotations: [{ text: 'Hands at Eye Height 👀', x: 50, y: 27 }]
        },
        {
          name: 'Phase 2: Crossover Step to Close Seam',
          description: 'Middle executes crossover step to seal with pin blocker.',
          duration: 2000,
          players: [
            { id: 'pin', label: 'OH', role: 'Pin Blocker', action: '🧱 Set Block Line', x: 25, y: 22, color: '#06b6d4' },
            { id: 'mid', label: 'MB', role: 'Middle Blocker', action: '🏃 Crossover Seal', x: 30, y: 22, color: '#06b6d4' }
          ],
          ball: { x: 25, y: 15, visible: true, arc: true, height: 2, from: { x: 50, y: 15 } },
          annotations: [{ text: 'Seam Closed Tight! 🔒', x: 28, y: 28 }]
        },
        {
          name: 'Phase 3: Penetrate Across Net & Stuff Block',
          description: 'Both blockers press hands over net and stuff opponent spike.',
          duration: 2500,
          players: [
            { id: 'pin', label: 'OH', role: 'Pin Blocker', action: '💥 Press Over Net', x: 25, y: 20, color: '#06b6d4' },
            { id: 'mid', label: 'MB', role: 'Middle Blocker', action: '💥 Press Over Net', x: 30, y: 20, color: '#06b6d4' }
          ],
          ball: { x: 28, y: 10, visible: true, arc: true, height: 1.5, from: { x: 28, y: 20 } },
          annotations: [{ text: 'STUFF BLOCK! 💥 (+Point)', x: 28, y: 5 }]
        }
      ]
    }
  },

  {
    id: 'block-joust-and-press',
    title: 'Tight Net Ball Joust & Core Press',
    category: 'blocking',
    categoryLabel: 'Blocking & Net Play',
    difficulty: 'Intermediate',
    intensity: 'Moderate',
    minPlayers: 2,
    maxPlayers: 8,
    durationMinutes: 10,
    equipment: ['Volleyballs', 'Net'],
    overview: '1-on-1 net battle drill training blockers to win jousts on tight balls by flexing core, waiting for the opponent to touch first, and pushing through ball center.',
    setup: 'Two players face each other on opposite sides of the net tape in Zone 3.',
    instructions: [
      'Coach tosses tight ball directly above the net tape.',
      'Both players jump simultaneously.',
      'Player must let opponent make initial touch, then violently lock wrists and press straight down into opponent court.',
      'Score 1 point per won joust; play to 5.'
    ],
    coachingKeys: [
      'Second to touch the ball almost always wins the joust!',
      'Flex core and do not swipe sideways into the net.'
    ],
    variations: [
      '1-handed joust vs 2-handed press.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Tight Ball on Net Tape',
          description: 'Ball floats directly on the plane of the net.',
          duration: 2000,
          players: [
            { id: 'b1', label: 'A Blocker', role: 'Blocker', action: '🚀 Jump Press', x: 50, y: 55, color: '#3b82f6' },
            { id: 'b2', label: 'B Blocker', role: 'Blocker', action: '🚀 Jump Press', x: 50, y: 45, color: '#ec4899' }
          ],
          ball: { x: 50, y: 50, visible: true, arc: false, height: 2 },
          annotations: [{ text: 'Tight on Net Tape! ⚡', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: Core Flex & Downward Press',
          description: 'Player A locks wrists and drives ball down into Side B.',
          duration: 2500,
          players: [
            { id: 'b1', label: 'A Blocker', role: 'Blocker', action: '💥 Power Press', x: 50, y: 55, color: '#3b82f6' },
            { id: 'b2', label: 'B Blocker', role: 'Blocker', action: '😮 Pushed Back', x: 50, y: 45, color: '#ec4899' }
          ],
          ball: { x: 50, y: 35, visible: true, arc: true, height: 1, from: { x: 50, y: 50 } },
          annotations: [{ text: 'JOUST WON! 💥 (+Point)', x: 50, y: 30 }]
        }
      ]
    }
  },

  // =========================================================================
  // 7. WASH & SCRIMMAGE GAMES (4 Drills)
  // =========================================================================
  {
    id: 'wash-6v6-transition-2in-a-row',
    title: '6v6 Free-Ball Transition Wash (2-in-a-Row)',
    category: 'wash_games',
    categoryLabel: 'Wash & Scrimmage',
    difficulty: 'Advanced',
    intensity: 'Maximum',
    minPlayers: 12,
    maxPlayers: 16,
    durationMinutes: 20,
    equipment: ['Volleyballs', 'Net', 'Scoreboard / Flip Chart'],
    overview: 'High-intensity full 6v6 scrimmage wash drill where a team must win both a serve rally AND a coach-entered free ball rally to score 1 big point.',
    setup: 'Full 6v6 on court (Side A vs Side B) in standard rotation formations with Libero and starting lineups.',
    instructions: [
      'Rally 1 starts with a live serve from Side A.',
      'Teams play out the point to completion.',
      'If the serving team (Side A) wins the serve rally, coach immediately bowls/tosses a high Free Ball into Side B to start Rally 2.',
      'Side A must transition and win Rally 2 to earn 1 "Big Point".',
      'If Side B wins either rally, the game is "WASHED" (no point awarded), and Side B takes the serve.',
      'First team to reach 5 Big Points wins the game.'
    ],
    coachingKeys: [
      'Value every touch—do not give away unforced errors during the wash bonus ball.',
      'Immediate verbal call on free balls: "FREE BALL! FREE BALL!" with setter releasing early.',
      'High-tempo offense off transition free balls.'
    ],
    variations: [
      '3-in-a-row Wash: For elite varsity squads (Serve ➔ Free Ball ➔ Downball).',
      'Back-Row Attack Bonus: Earning a point on a back-row pipe spike counts as 2 big points.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Serve & First Rally',
          description: 'Side A serves to Side B to start Rally 1.',
          duration: 2500,
          players: [
            { id: 'sa_s', label: 'S1', role: 'Server', action: '🏐 Live Serve', x: 80, y: 92, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Front', role: 'Blockers', action: '🧱 Front Wall', x: 50, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Pass', role: 'Passers', action: '🛡️ Serve Receive', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Front', role: 'Hitters', action: '💥 Approach Prep', x: 50, y: 40, color: '#ec4899' }
          ],
          ball: { x: 50, y: 25, visible: true, arc: true, height: 3.5, from: { x: 80, y: 92 } },
          annotations: [{ text: 'Rally 1: Live Serve', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: Side A Wins Rally 1 & Coach Enters Free Ball',
          description: 'Coach throws Free Ball into Side B; Side A sets up counter-attack.',
          duration: 2500,
          players: [
            { id: 'sa_s', label: 'A Back', role: 'Defense', action: '🛡️ Base Defense', x: 50, y: 80, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Front', role: 'Blockers', action: '🧱 Read Block', x: 50, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Back', role: 'Defense', action: '🏃 Free Ball Pass', x: 50, y: 20, color: '#ec4899' },
            { id: 'sb_f', label: 'B Front', role: 'Hitters', action: '👀 Transition', x: 50, y: 40, color: '#ec4899' }
          ],
          ball: { x: 50, y: 20, visible: true, arc: true, height: 3.2, from: { x: 5, y: 50 } },
          annotations: [{ text: 'Coach Bonus Free Ball 🏐', x: 25, y: 35 }]
        },
        {
          name: 'Phase 3: Side A Counter-Attack Kills for Big Point',
          description: 'Side A digs, sets outside, and scores to win the 2-in-a-row wash!',
          duration: 2500,
          players: [
            { id: 'sa_s', label: 'A Back', role: 'Defense', action: '🎉 Celebrate', x: 50, y: 80, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Hit', role: 'Hitter', action: '💥 SPIKE KILL', x: 25, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Back', role: 'Defense', action: '🛡️ Dig Attempt', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Front', role: 'Blockers', action: '🧱 Block Attempt', x: 25, y: 45, color: '#ec4899' }
          ],
          ball: { x: 75, y: 20, visible: true, arc: true, height: 1.8, from: { x: 25, y: 55 } },
          annotations: [{ text: '⭐ BIG POINT EARNED! (2-in-a-Row)', x: 75, y: 15 }]
        }
      ]
    }
  },

  {
    id: 'wash-22-22-pressure-game',
    title: '22-22 Crunch-Time Pressure Scrimmage',
    category: 'wash_games',
    categoryLabel: 'Wash & Scrimmage',
    difficulty: 'Advanced',
    intensity: 'Maximum',
    minPlayers: 12,
    maxPlayers: 16,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net', 'Scoreboard'],
    overview: 'End-of-set pressure simulation starting at 22-22 to train aggressive serving, side-out execution, timeout management, and mental toughness when the game is on the line.',
    setup: 'Set up two teams of 6. Set score is manually set to 22 - 22 (playing to 25, win by 2). Each team is granted exactly 1 timeout.',
    instructions: [
      'Coin toss determines starting serve.',
      'Teams must play under official tournament rules (substitutions and 1 timeout per team).',
      'Focus on high-percentage attacking: avoid hitting into the block or serving into the net on game points.',
      'Team that reaches 25 (with 2-point lead) wins the set.',
      'Rotate starting rotations and repeat with reverse servers.'
    ],
    coachingKeys: [
      'Communicate trust and positive body language under pressure.',
      'Setters must know their "go-to" hot hitter on 23-23 and 24-24 points.',
      'Aggressive serving to seams—do not give away lollipop free serves.'
    ],
    variations: [
      'Sudden Death 14-14: Simulate a deciding 3rd or 5th set tiebreak to 15.',
      'Minus-Point Penalty: Any missed serve on game point gives the opponent 2 points.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Score 24-24 Deciding Rally',
          description: 'Side A serves with match on the line at deuce (24-24).',
          duration: 2500,
          players: [
            { id: 'sa_s', label: 'S1', role: 'Server', action: '🏐 Clutch Serve', x: 80, y: 92, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Front', role: 'Blockers', action: '🧱 Wall Ready', x: 50, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Pass', role: 'Passers', action: '🛡️ Perfect Pass', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Front', role: 'Hitters', action: '💥 Attack Approach', x: 50, y: 40, color: '#ec4899' }
          ],
          ball: { x: 50, y: 25, visible: true, arc: true, height: 3.5, from: { x: 80, y: 92 } },
          annotations: [{ text: 'Match Point at 24-24! 💥', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: Side B Perfect Side-Out Kill',
          description: 'Side B executes side-out kill off pin to reach game point.',
          duration: 2500,
          players: [
            { id: 'sa_s', label: 'A Defense', role: 'Defense', action: '🛡️ Dig Attempt', x: 50, y: 80, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Block', role: 'Blockers', action: '🧱 Block Jump', x: 25, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Back', role: 'Defense', action: '👀 Cover', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Hit', role: 'Hitter', action: '💥 CLUTCH SPIKE', x: 25, y: 42, color: '#ec4899' }
          ],
          ball: { x: 75, y: 85, visible: true, arc: true, height: 2, from: { x: 25, y: 42 } },
          annotations: [{ text: 'CLUTCH KILL! 🏐 25-24', x: 75, y: 80 }]
        }
      ]
    }
  },

  {
    id: 'wash-speed-4s-continuous',
    title: 'Speed 4s Continuous Short-Court Wash',
    category: 'wash_games',
    categoryLabel: 'Wash & Scrimmage',
    difficulty: 'Intermediate',
    intensity: 'Maximum',
    minPlayers: 8,
    maxPlayers: 16,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net'],
    overview: 'High-speed 4v4 continuous wash game playing on a shortened court (10ft line to baseline), forcing fast transitions, communication, and all-around skills.',
    setup: '4 players on Side A (1 Setter, 2 Hitters, 1 Libero) vs 4 players on Side B. New team rotates on after each 3-point wash.',
    instructions: [
      'Coach enters free ball to start rally.',
      'Team must make 3 contacts (Pass ➔ Set ➔ Attack).',
      'Winning team stays on court; losing team runs off and a new group of 4 sprints on.',
      'First quad to stay on for 4 consecutive washes wins.'
    ],
    coachingKeys: [
      'Sprint onto the court immediately when rotating on—be in ready position before the coach tosses!',
      'Secondary setting: If setter digs first ball, Libero must take 2nd ball with clean hands.'
    ],
    variations: [
      'Queens of the Court speed ladder.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: 4v4 High-Pace Transition',
          description: 'Side A and Side B battle in 4v4 fast-paced wash.',
          duration: 2500,
          players: [
            { id: 'a1', label: 'A1', role: 'Setter', action: '🏐 Fast Set', x: 65, y: 65, color: '#3b82f6' },
            { id: 'a2', label: 'A2', role: 'Hitter', action: '💥 Attack', x: 30, y: 65, color: '#3b82f6' },
            { id: 'b1', label: 'B1', role: 'Defense', action: '🛡️ Low Dig', x: 50, y: 25, color: '#ec4899' },
            { id: 'b2', label: 'B2', role: 'Setter', action: '🏃 Release', x: 65, y: 35, color: '#ec4899' }
          ],
          ball: { x: 30, y: 65, visible: true, arc: true, height: 2, from: { x: 65, y: 65 } },
          annotations: [{ text: 'Fast 4v4 Transition ⚡', x: 50, y: 50 }]
        }
      ]
    }
  },

  {
    id: 'wash-downball-chaos',
    title: 'Downball Chaos & Scramble Coverage Scrimmage',
    category: 'wash_games',
    categoryLabel: 'Wash & Scrimmage',
    difficulty: 'Advanced',
    intensity: 'Maximum',
    minPlayers: 10,
    maxPlayers: 14,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net', 'Ball Cart'],
    overview: 'Unpredictable scramble defense scrimmage where coach enters rapid alternating downballs to unexpected zones, forcing loud communication and high-out-of-system setting.',
    setup: 'Full 5v5 or 6v6 on court. Coach stands on elevated platform at mid-court with ball cart.',
    instructions: [
      'Coach enters hard downball to random corner (e.g. deep Zone 1).',
      'Team must dig, set out-of-system, and attack over.',
      'As soon as ball lands or point ends, coach immediately fires the next downball into the opposite court.',
      'No rest between rallies—play 10 continuous balls before rotating.'
    ],
    coachingKeys: [
      'Never give up on a ball—commit to pursuing every shank off the court.',
      'Loud calling: "HELP! SET HIGH OUTSIDE!"'
    ],
    variations: [
      'Bonus point for any one-handed pancake recovery.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Rapid Coach Downball',
          description: 'Coach drives unexpected downball into deep corner.',
          duration: 2200,
          players: [
            { id: 'c', label: 'Coach', role: 'Toss', action: '💥 Downball', x: 10, y: 50, color: '#ef4444' },
            { id: 'd1', label: 'A1', role: 'Defense', action: '🏃 Sprinting', x: 50, y: 75, color: '#3b82f6', path: [{ x: 50, y: 75 }, { x: 80, y: 88 }] }
          ],
          ball: { x: 80, y: 88, visible: true, arc: true, height: 2, from: { x: 10, y: 50 } },
          annotations: [{ text: 'Deep Scramble Corner! 🏃', x: 75, y: 82 }]
        },
        {
          name: 'Phase 2: High Emergency Dig to Center',
          description: 'Defender makes emergency dig high into mid-court.',
          duration: 2400,
          players: [
            { id: 'c', label: 'Coach', role: 'Toss', action: '👀 Loading Next', x: 10, y: 50, color: '#ef4444' },
            { id: 'd1', label: 'A1', role: 'Defense', action: '🛡️ High Pop Dig', x: 80, y: 88, color: '#3b82f6' }
          ],
          ball: { x: 50, y: 60, visible: true, arc: true, height: 3.5, from: { x: 80, y: 88 } },
          annotations: [{ text: 'High Out-Of-System Pop 🏐', x: 50, y: 55 }]
        }
      ]
    }
  },

  // =========================================================================
  // 8. NEW BEGINNER & INTERMEDIATE DRILLS
  // =========================================================================
  {
    id: 'warmup-pass-to-self-shuffle',
    title: 'Pass-to-Self & Lateral Line Shuffles',
    category: 'warmup',
    categoryLabel: 'Warm-Up & Footwork',
    difficulty: 'Beginner',
    intensity: 'Low',
    minPlayers: 1,
    maxPlayers: 12,
    durationMinutes: 8,
    equipment: ['1 Volleyball per player'],
    overview: 'Essential beginner ball control drill teaching players to maintain soft, consistent forearm passes above forehead height while shuffling laterally along court lines.',
    setup: 'Players space out along the 10ft attack line or endline with one volleyball each.',
    instructions: [
      'Player tosses ball up gently to initiate continuous forearm passing to self.',
      'Maintain each pass at consistent height (3-4 feet above head).',
      'Shuffle laterally from sideline to sideline without crossing feet, keeping platform locked and level.',
      'Goal: 20 continuous self-passes while completing 2 full sideline-to-sideline trips.'
    ],
    coachingKeys: [
      'Thumbs pressed together side-by-side, wrists pointed downward toward floor.',
      'Absorb and lift with legs rather than swinging arms wildly from shoulders.',
      'Keep eyes locked on ball contact point on the flat forearm sweet-spot.'
    ],
    variations: [
      'Alternate 1 forearm pass, 1 overhead set to self.',
      'Kneel on floor and pass to self from knees to isolate upper body mechanics.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Self-Pass & Lateral Shuffle',
          description: 'Player passes ball up to self and shuffles laterally along the line.',
          duration: 2200,
          players: [
            { id: 'p1', label: 'P1', role: 'Player', action: '🏐 Soft Self-Pass', x: 25, y: 65, color: '#3b82f6', path: [{ x: 25, y: 65 }, { x: 55, y: 65 }] }
          ],
          ball: { x: 25, y: 52, visible: true, arc: true, height: 2, from: { x: 25, y: 65 } },
          annotations: [{ text: 'Lateral Shuffle Across Court ↔️', x: 40, y: 72 }]
        },
        {
          name: 'Phase 2: Continued Rhythm Along Line',
          description: 'Player maintains level platform and catches rhythm at mid-court.',
          duration: 2200,
          players: [
            { id: 'p1', label: 'P1', role: 'Player', action: '🛡️ Platform Locked', x: 55, y: 65, color: '#3b82f6', path: [{ x: 55, y: 65 }, { x: 80, y: 65 }] }
          ],
          ball: { x: 55, y: 52, visible: true, arc: true, height: 2, from: { x: 55, y: 65 } },
          annotations: [{ text: '20 Touches Target! 🎯', x: 65, y: 60 }]
        }
      ]
    }
  },

  {
    id: 'warmup-partner-triangle-pepper',
    title: 'Stationary 3-Player Triangle Pepper',
    category: 'warmup',
    categoryLabel: 'Warm-Up & Footwork',
    difficulty: 'Beginner',
    intensity: 'Moderate',
    minPlayers: 3,
    maxPlayers: 12,
    durationMinutes: 10,
    equipment: ['1 Volleyball per trio'],
    overview: 'Foundational beginner/intermediate group drill reinforcing the standard 3-touch sequence (Pass ➔ Set ➔ Downball) in a controlled triangle format.',
    setup: '3 players form an equilateral triangle 12 feet apart (Passer, Setter, Hitter).',
    instructions: [
      'Player 1 passes to Player 2 (Setter).',
      'Player 2 sets high, controlled ball to Player 3 (Hitter).',
      'Player 3 executes a standing overhand downball with wrist snap to Player 1.',
      'Player 1 digs the ball back to Player 2, and the cycle continues.',
      'Rotate roles after 15 successful unbroken cycles.'
    ],
    coachingKeys: [
      'Call "MINE" clearly on every single touch.',
      'Downball hitter must aim directly at partner chest for easy reception.',
      'Setter establishes balanced base facing hitter before releasing set.'
    ],
    variations: [
      'Add a rule: Every player must touch the floor with one hand after hitting.',
      'Reverse rotation direction (Passer ➔ Setter ➔ Downball counter-clockwise).'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Pass to Setter in Triangle',
          description: 'Passer delivers ball to Setter at triangle apex.',
          duration: 2200,
          players: [
            { id: 'p1', label: 'P1', role: 'Passer', action: '🏐 Clean Pass', x: 30, y: 75, color: '#3b82f6' },
            { id: 'p2', label: 'P2', role: 'Setter', action: '👀 Hands Ready', x: 50, y: 40, color: '#a855f7' },
            { id: 'p3', label: 'P3', role: 'Hitter', action: '👀 Ready', x: 70, y: 75, color: '#f97316' }
          ],
          ball: { x: 50, y: 40, visible: true, arc: true, height: 2.2, from: { x: 30, y: 75 } },
          annotations: [{ text: 'Pass to Apex', x: 40, y: 55 }]
        },
        {
          name: 'Phase 2: Set to Hitter',
          description: 'Setter delivers high arching ball to Hitter.',
          duration: 2200,
          players: [
            { id: 'p1', label: 'P1', role: 'Passer', action: '🛡️ Base Defense', x: 30, y: 75, color: '#3b82f6' },
            { id: 'p2', label: 'P2', role: 'Setter', action: '🏐 High Set', x: 50, y: 40, color: '#a855f7' },
            { id: 'p3', label: 'P3', role: 'Hitter', action: '💥 Arm Loaded', x: 70, y: 75, color: '#f97316' }
          ],
          ball: { x: 70, y: 75, visible: true, arc: true, height: 2.5, from: { x: 50, y: 40 } },
          annotations: [{ text: 'High Set to Hitter', x: 60, y: 55 }]
        },
        {
          name: 'Phase 3: Controlled Downball',
          description: 'Hitter snaps wrist and hits controlled ball back to Passer.',
          duration: 2200,
          players: [
            { id: 'p1', label: 'P1', role: 'Passer', action: '🛡️ Ready Dig', x: 30, y: 75, color: '#3b82f6' },
            { id: 'p2', label: 'P2', role: 'Setter', action: '👀 Follow Ball', x: 50, y: 40, color: '#a855f7' },
            { id: 'p3', label: 'P3', role: 'Hitter', action: '💥 Downball Snap', x: 70, y: 75, color: '#f97316' }
          ],
          ball: { x: 30, y: 75, visible: true, arc: true, height: 1.8, from: { x: 70, y: 75 } },
          annotations: [{ text: 'Controlled Downball 🔄', x: 50, y: 80 }]
        }
      ]
    }
  },

  {
    id: 'serve-underhand-foundations',
    title: 'Underhand Serving Accuracy & Bowling Mechanics',
    category: 'serving_passing',
    categoryLabel: 'Serving & Passing',
    difficulty: 'Beginner',
    intensity: 'Low',
    minPlayers: 2,
    maxPlayers: 12,
    durationMinutes: 10,
    equipment: ['Volleyballs', 'Target Cones across Net'],
    overview: 'Essential entry-level serving drill teaching young and beginner players proper foot placement, rigid fist/heel contact, and bowling follow-through to get serves consistently over the net.',
    setup: 'Servers stand behind baseline on Side A. Cones placed across the net on Side B at varying depths.',
    instructions: [
      'Stance: Right-handed server places left foot forward (heel-to-toe staggered stance) pointing at target.',
      'Hold ball in non-dominant hand at waist level directly in front of hitting hip.',
      'Draw dominant arm straight back like a pendulum with rigid flat fist or heel of open hand.',
      'Step forward with lead foot while swinging arm smoothly like a bowling ball.',
      'Contact ball off holding hand without tossing it in the air; follow through upward toward target.',
      'Goal: 8 out of 10 serves in-bounds over the net.'
    ],
    coachingKeys: [
      'Do not toss the ball high—let the swinging hand sweep it off the holding palm.',
      'Keep wrist locked rigid—do not let fingers flop on contact.',
      'Transfer weight smoothly from back foot to front foot.'
    ],
    variations: [
      'Start 10 feet inside the baseline (at 20ft line) and take one step back after every successful serve.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Pendulum Swing Stance',
          description: 'Server in staggered stance holding ball at waist height.',
          duration: 2200,
          players: [
            { id: 's', label: 'Server', role: 'Server', action: '🎳 Bowling Pendulum', x: 50, y: 95, color: '#3b82f6', path: [{ x: 50, y: 95 }, { x: 50, y: 90 }] }
          ],
          ball: { x: 50, y: 92, visible: true, arc: false, height: 1 },
          annotations: [{ text: 'Step & Sweep Swing', x: 50, y: 85 }]
        },
        {
          name: 'Phase 2: High Arching Flight Over Net',
          description: 'Ball clears net with high consistent trajectory into deep court.',
          duration: 2500,
          players: [
            { id: 's', label: 'Server', role: 'Server', action: '✅ Follow-Through', x: 50, y: 90, color: '#3b82f6' }
          ],
          ball: { x: 50, y: 25, visible: true, arc: true, height: 3.8, from: { x: 50, y: 90 } },
          annotations: [{ text: 'Clean Over-Net Serve! 🏐 (+1 Pt)', x: 50, y: 20 }]
        }
      ]
    }
  },

  {
    id: 'serve-overhand-toss-and-trap',
    title: 'Overhand Standing Float: Toss, Step & Catch Drill',
    category: 'serving_passing',
    categoryLabel: 'Serving & Passing',
    difficulty: 'Beginner',
    intensity: 'Moderate',
    minPlayers: 2,
    maxPlayers: 12,
    durationMinutes: 10,
    equipment: ['Volleyballs'],
    overview: 'The number one fundamental drill to fix erratic overhand serves by isolating a consistent 2-foot toss in front of the hitting shoulder and matching bow-and-arrow arm loading.',
    setup: 'Servers stand behind baseline facing the net, or facing a wall 15 feet away.',
    instructions: [
      'Ready Stance: Left foot forward (for righties), holding ball in left hand out in front of right shoulder.',
      'Draw hitting arm back into "Bow-and-Arrow" posture with elbow high at ear level.',
      'Toss ball 2-3 feet straight up with no spin, stepping forward with left foot.',
      'Progression 1 (Toss & Trap): Reach up with hitting hand at peak height and TRAP/CATCH the ball against the non-dominant hand.',
      'Progression 2 (Live Float Serve): Step and strike the center of the ball with a flat, rigid palm.'
    ],
    coachingKeys: [
      'The toss determines 90% of the serve quality—keep it consistent!',
      'Contact the dead center of the ball to create knuckleball float.',
      'Freeze hand on contact for 1 second (abbreviated follow-through).'
    ],
    variations: [
      'Toss and let the ball bounce on floor to verify it lands 1 foot in front of lead toe.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Bow & Arrow Loading',
          description: 'Elbow high at ear level, toss straight up in front of shoulder.',
          duration: 2200,
          players: [
            { id: 's', label: 'Server', role: 'Server', action: '🏹 Bow & Arrow', x: 50, y: 85, color: '#3b82f6' }
          ],
          ball: { x: 50, y: 75, visible: true, arc: true, height: 2.2, from: { x: 50, y: 85 } },
          annotations: [{ text: 'Consistent 2ft Toss', x: 50, y: 70 }]
        },
        {
          name: 'Phase 2: High Palm Contact & Float Flight',
          description: 'Contact high with flat palm, driving ball across the net.',
          duration: 2500,
          players: [
            { id: 's', label: 'Server', role: 'Server', action: '💥 Firm Palm Pop', x: 50, y: 82, color: '#3b82f6' }
          ],
          ball: { x: 50, y: 15, visible: true, arc: true, height: 3, from: { x: 50, y: 75 } },
          annotations: [{ text: 'Knuckleball Float Across Net! 🎯', x: 50, y: 20 }]
        }
      ]
    }
  },

  {
    id: 'pass-wall-pass-platform-lock',
    title: 'Wall Bouncing Platform Lock & Angle Isolation',
    category: 'serving_passing',
    categoryLabel: 'Serving & Passing',
    difficulty: 'Beginner',
    intensity: 'Low',
    minPlayers: 1,
    maxPlayers: 12,
    durationMinutes: 8,
    equipment: ['1 Volleyball per player', 'Gym Wall'],
    overview: 'Solo repetitive control drill to build muscle memory for locking elbows, tilting platform angle, and absorbing ball rebounds against a flat wall.',
    setup: 'Player stands 6 feet from gym wall with knees bent in ready athletic posture.',
    instructions: [
      'Toss ball against wall at a height of 8 feet.',
      'As ball rebounds off wall, move feet into path of ball, lock platform straight, and bump ball back against wall.',
      'Keep platform angle tilted at 45° to rebound ball upward.',
      'Goal: Complete 25 continuous wall passes without dropping the ball.'
    ],
    coachingKeys: [
      'Never swing arms toward wall—let the angle of your platform do the work.',
      'Shrug shoulders up toward ears to create a flat passing board across forearms.'
    ],
    variations: [
      'Alternate 1 high pass, 1 low pass.',
      'Add target square on wall with tape (e.g. 2ft x 2ft box).'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Wall Rebound & Platform Angle',
          description: 'Player passes ball against wall target and tracks rebound.',
          duration: 2200,
          players: [
            { id: 'p', label: 'Player', role: 'Passer', action: '🛡️ Platform Lock', x: 50, y: 65, color: '#3b82f6' }
          ],
          ball: { x: 50, y: 20, visible: true, arc: true, height: 2.5, from: { x: 50, y: 65 } },
          annotations: [{ text: 'Wall Target Rebound 🧱', x: 50, y: 15 }]
        },
        {
          name: 'Phase 2: Continuous Rebound Rhythm',
          description: 'Player stays low and catches rebound with frozen platform.',
          duration: 2200,
          players: [
            { id: 'p', label: 'Player', role: 'Passer', action: '✅ Freeze Angle', x: 50, y: 65, color: '#3b82f6' }
          ],
          ball: { x: 50, y: 65, visible: true, arc: true, height: 2, from: { x: 50, y: 20 } },
          annotations: [{ text: '25 Consecutive Target Reps!', x: 50, y: 72 }]
        }
      ]
    }
  },

  {
    id: 'pass-partner-target-bowling',
    title: 'Partner 10ft Deep-to-Short Passing Exchange',
    category: 'serving_passing',
    categoryLabel: 'Serving & Passing',
    difficulty: 'Intermediate',
    intensity: 'Moderate',
    minPlayers: 2,
    maxPlayers: 12,
    durationMinutes: 10,
    equipment: ['Volleyballs'],
    overview: 'Partner drill training passers to adjust their platform depth for short drop balls versus deep float balls without losing target accuracy.',
    setup: 'Two partners face each other 15 feet apart.',
    instructions: [
      'Partner A passes high ball 3 feet deep behind Partner B.',
      'Partner B takes 2 drop-steps back, locks platform, and delivers high pass back to Partner A.',
      'Partner A passes short ball 3 feet in front of Partner B.',
      'Partner B sprints forward and pops short ball back to target.',
      'Switch roles after 10 deep/short cycles.'
    ],
    coachingKeys: [
      'Drop-step on deep balls; do not jump backward in mid-air.',
      'Get low on short balls by bending knees, not bending at waist.'
    ],
    variations: [
      'Add target hoop on floor between partners.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Deep Drop-Step Pass',
          description: 'Partner B drop-steps and passes deep ball back to target.',
          duration: 2400,
          players: [
            { id: 'pA', label: 'P1', role: 'Target', action: '🎯 Target', x: 50, y: 35, color: '#3b82f6' },
            { id: 'pB', label: 'P2', role: 'Passer', action: '🏃 Drop-Step', x: 50, y: 65, color: '#10b981', path: [{ x: 50, y: 65 }, { x: 50, y: 85 }] }
          ],
          ball: { x: 50, y: 85, visible: true, arc: true, height: 3, from: { x: 50, y: 35 } },
          annotations: [{ text: 'Deep Float Rebound', x: 50, y: 60 }]
        },
        {
          name: 'Phase 2: Short Sprint & Pop',
          description: 'Partner B sprints forward to pop short ball.',
          duration: 2400,
          players: [
            { id: 'pA', label: 'P1', role: 'Target', action: '🎯 Target', x: 50, y: 35, color: '#3b82f6' },
            { id: 'pB', label: 'P2', role: 'Passer', action: '🏃 Sprint Forward', x: 50, y: 85, color: '#10b981', path: [{ x: 50, y: 85 }, { x: 50, y: 55 }] }
          ],
          ball: { x: 50, y: 55, visible: true, arc: true, height: 2, from: { x: 50, y: 35 } },
          annotations: [{ text: 'Short Ball Sprint! 🏃', x: 50, y: 50 }]
        }
      ]
    }
  },

  {
    id: 'def-partner-knee-drop-digging',
    title: 'Knee-Drop & Low Athletic Posture Digging',
    category: 'defense',
    categoryLabel: 'Defense & Digging',
    difficulty: 'Beginner',
    intensity: 'Moderate',
    minPlayers: 2,
    maxPlayers: 10,
    durationMinutes: 10,
    equipment: ['Volleyballs', 'Knee Pads'],
    overview: 'Foundational defensive drill teaching defenders to drop hips, widen base, and absorb low balls without falling backward onto their heels.',
    setup: 'Defender starts in ready defensive posture (feet wider than shoulders, knees bent 90°, chest forward). Coach/Partner 10 feet away with ball.',
    instructions: [
      'Partner hits controlled low downballs to defender left and right.',
      'Defender drops inside knee close to floor (knee drop) to create flat angle.',
      'Absorb ball off forearms, popping it high (12+ feet) to mid-court.',
      'Defender immediately resets feet to base position before next ball.'
    ],
    coachingKeys: [
      'Weight on the balls of your feet, not your heels.',
      'Keep platform out in front of knees—do not let arms get pulled between legs.'
    ],
    variations: [
      'Rapid fire 10-ball endurance round.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Low Stance & Knee Drop',
          description: 'Defender drops knee to reach low ball off floor.',
          duration: 2200,
          players: [
            { id: 'c', label: 'Partner', role: 'Hitter', action: '💥 Low Hit', x: 50, y: 30, color: '#ef4444' },
            { id: 'd', label: 'Defender', role: 'Defense', action: '🛡️ Knee Drop Dig', x: 50, y: 75, color: '#10b981' }
          ],
          ball: { x: 50, y: 75, visible: true, arc: true, height: 1.2, from: { x: 50, y: 30 } },
          annotations: [{ text: 'Low Dig Off Floor 🛡️', x: 50, y: 80 }]
        },
        {
          name: 'Phase 2: High Pop to Target',
          description: 'Ball pops high toward center court transition spot.',
          duration: 2400,
          players: [
            { id: 'c', label: 'Partner', role: 'Hitter', action: '👀 Tracking', x: 50, y: 30, color: '#ef4444' },
            { id: 'd', label: 'Defender', role: 'Defense', action: '✅ Quick Reset', x: 50, y: 75, color: '#10b981' }
          ],
          ball: { x: 65, y: 40, visible: true, arc: true, height: 3.2, from: { x: 50, y: 75 } },
          annotations: [{ text: 'High Target Dig 🎯', x: 65, y: 35 }]
        }
      ]
    }
  },

  {
    id: 'set-wall-triangle-dishes',
    title: 'Wall Setting Window & Finger Cushioning',
    category: 'setting',
    categoryLabel: 'Setting & Transition',
    difficulty: 'Beginner',
    intensity: 'Low',
    minPlayers: 1,
    maxPlayers: 12,
    durationMinutes: 8,
    equipment: ['1 Volleyball per player', 'Wall'],
    overview: 'Solo setting drill building soft hand dish shape, 10-finger contact, and wrist cushioning against a gym wall.',
    setup: 'Player stands 3 feet from wall with hands shaped in a triangle window 2 inches above hairline.',
    instructions: [
      'Rapid-set the ball against the wall with soft finger pads (no palm slap).',
      'Thumbs and index fingers form a diamond/triangle window around the ball.',
      'Extend wrists and elbows smoothly into each wall push.',
      'Perform 50 continuous rapid wall sets.'
    ],
    coachingKeys: [
      'Contact ball with pads of all 10 fingers—thumbs must point back toward eyes.',
      'Listen for silent contact—loud slapping means too much palm.'
    ],
    variations: [
      'One-handed setting against wall to develop weak hand finger strength.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Rapid Wall Setting Dishes',
          description: 'Player executes rapid soft-finger sets against wall target.',
          duration: 2000,
          players: [
            { id: 's', label: 'Setter', role: 'Setter', action: '🏐 10-Finger Dishes', x: 50, y: 65, color: '#a855f7' }
          ],
          ball: { x: 50, y: 25, visible: true, arc: true, height: 1.5, from: { x: 50, y: 65 } },
          annotations: [{ text: 'Rapid Finger Dishes 👐', x: 50, y: 20 }]
        }
      ]
    }
  },

  {
    id: 'hit-standing-bow-and-arrow-arm-swing',
    title: 'Standing Bow-and-Arrow Arm Swing & Torso Rotation',
    category: 'hitting',
    categoryLabel: 'Attacking & Hitting',
    difficulty: 'Beginner',
    intensity: 'Low',
    minPlayers: 2,
    maxPlayers: 12,
    durationMinutes: 8,
    equipment: ['Volleyballs'],
    overview: 'Teaches beginner hitters how to rotate their torso, raise hitting elbow high, reach at peak extension, and snap wrist for topspin without jump timing complexity.',
    setup: 'Partners stand 20 feet apart on court, or hitters face net 5 feet back.',
    instructions: [
      'Stance: Non-hitting shoulder faces target (staggered stance).',
      'Draw hitting arm back into bow-and-arrow posture with high elbow.',
      'Guide hand points at ball in mid-air.',
      'Rotate hips and torso forward, swing arm up to full vertical reach, and snap wrist over top hemisphere of ball.',
      'Hit down into floor so ball bounces up to partner.'
    ],
    coachingKeys: [
      'Reach HIGH! Do not contact ball at shoulder height.',
      'Snap wrist down like throwing a ball over a fence to create topspin.'
    ],
    variations: [
      'Stand on a sturdy box at the net to practice hitting over net tape.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: High Contact & Floor Bounce',
          description: 'Hitter executes standing arm swing snapping wrist down.',
          duration: 2200,
          players: [
            { id: 'h', label: 'Hitter', role: 'Hitter', action: '🏹 High Reach Swing', x: 35, y: 65, color: '#f97316' },
            { id: 'p', label: 'Partner', role: 'Catch', action: '👀 Catch Rebound', x: 65, y: 65, color: '#3b82f6' }
          ],
          ball: { x: 50, y: 65, visible: true, arc: true, height: 1.8, from: { x: 35, y: 65 } },
          annotations: [{ text: 'Floor Bounce to Partner 💥', x: 50, y: 70 }]
        }
      ]
    }
  },

  {
    id: 'block-hand-penetration-net-tape',
    title: 'Standing Net Tape Hands-Over Penetration',
    category: 'blocking',
    categoryLabel: 'Blocking & Net Play',
    difficulty: 'Beginner',
    intensity: 'Low',
    minPlayers: 2,
    maxPlayers: 8,
    durationMinutes: 8,
    equipment: ['Net', 'Volleyball held by Coach'],
    overview: 'Beginner blocking drill teaching players to reach across the net tape into the opponent court, spread fingers wide, and lock wrists to prevent net fouls.',
    setup: 'Blockers stand at net with hands up at shoulder height. Coach stands on opposite side holding ball over net tape.',
    instructions: [
      'Blocker jumps straight up from standing position.',
      'Push hands forward and over the net tape ("roofing" the ball).',
      'Press palms flat against coach’s held ball without brushing net with chest or arms.',
      'Land softly on two feet with knees bent, turning into court.'
    ],
    coachingKeys: [
      'Jump STRAIGHT UP—do not drift forward into the net.',
      'Spread fingers as wide as possible to maximize blocking surface.'
    ],
    variations: [
      'Add 1 lateral shuffle step before jumping.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Standing Hands-Over Press',
          description: 'Blocker jumps straight up and penetrates across net tape.',
          duration: 2200,
          players: [
            { id: 'b', label: 'Blocker', role: 'Blocker', action: '🧱 Penetrate Over Net', x: 50, y: 22, color: '#06b6d4' }
          ],
          ball: { x: 50, y: 14, visible: true, arc: false, height: 2 },
          annotations: [{ text: 'Hands Over Net Tape! 🔒', x: 50, y: 8 }]
        }
      ]
    }
  },

  {
    id: 'wash-king-of-the-court-3v3',
    title: '3v3 King of the Court Continuous Mini-Game',
    category: 'wash_games',
    categoryLabel: 'Wash & Scrimmage',
    difficulty: 'Intermediate',
    intensity: 'High',
    minPlayers: 6,
    maxPlayers: 15,
    durationMinutes: 15,
    equipment: ['Volleyballs', 'Net'],
    overview: 'Fast-paced, high-energy 3v3 mini-scrimmage game where the "King" side scores points by winning rallies while challenging teams sprint on from the challenger side.',
    setup: '3 players on "King" side (Side A). 3 challengers on Side B. Remaining players in line off court.',
    instructions: [
      'Challengers serve or enter free ball to King side.',
      'Play out rally with mandatory 3-touch rule.',
      'If King side wins: they earn 1 point and stay on King side.',
      'If Challenger side wins: they sprint under net to become new Kings! Defeated Kings run to end of challenger line.',
      'First team to reach 7 King points wins.'
    ],
    coachingKeys: [
      'Fast transitions—new challengers must enter court immediately.',
      'Communicate every ball—3 players must cover all 900 square feet!'
    ],
    variations: [
      'Queen of the Court (All hits must be back-row attacks).'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Challenger Serve to King Side',
          description: 'Challengers serve to King team to start fast mini-rally.',
          duration: 2400,
          players: [
            { id: 'k1', label: 'King 1', role: 'Kings', action: '👑 Pass', x: 30, y: 75, color: '#f59e0b' },
            { id: 'k2', label: 'King 2', role: 'Kings', action: '👑 Set', x: 50, y: 60, color: '#f59e0b' },
            { id: 'k3', label: 'King 3', role: 'Kings', action: '👑 Hit', x: 70, y: 75, color: '#f59e0b' },
            { id: 'c1', label: 'Challenger', role: 'Challenger', action: '🏐 Serve', x: 50, y: 15, color: '#3b82f6' }
          ],
          ball: { x: 30, y: 75, visible: true, arc: true, height: 3, from: { x: 50, y: 15 } },
          annotations: [{ text: 'King of the Court Rally! 👑', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: King Kill & Point Scored',
          description: 'King side sets outside, scores kill, and retains King side.',
          duration: 2400,
          players: [
            { id: 'k1', label: 'King 1', role: 'Kings', action: '👀 Cover', x: 30, y: 75, color: '#f59e0b' },
            { id: 'k2', label: 'King 2', role: 'Kings', action: '🏐 High Set', x: 50, y: 60, color: '#f59e0b' },
            { id: 'k3', label: 'King 3', role: 'Kings', action: '💥 SPIKE KILL', x: 70, y: 55, color: '#f59e0b' },
            { id: 'c1', label: 'Challenger', role: 'Challenger', action: '🛡️ Dig Attempt', x: 50, y: 25, color: '#3b82f6' }
          ],
          ball: { x: 30, y: 25, visible: true, arc: true, height: 1.8, from: { x: 70, y: 55 } },
          annotations: [{ text: '👑 POINT KINGS! (+1 Pt)', x: 30, y: 20 }]
        }
      ]
    }
  },

  {
    id: 'wash-free-ball-3touch-relay',
    title: '3-Touch Mandatory Cooperative Free Ball Relay',
    category: 'wash_games',
    categoryLabel: 'Wash & Scrimmage',
    difficulty: 'Beginner',
    intensity: 'Moderate',
    minPlayers: 6,
    maxPlayers: 12,
    durationMinutes: 10,
    equipment: ['Volleyballs', 'Net'],
    overview: 'Cooperative beginner scrimmage drill where both teams work together to achieve high rally records, enforcing a mandatory 3-touch sequence (Pass ➔ Set ➔ Attack over net).',
    setup: '3 to 6 players on each side of the net in base rotation.',
    instructions: [
      'Coach enters easy free ball to Side A.',
      'Side A MUST execute 3 distinct contacts: Forearm Pass ➔ Overhead Set ➔ Controlled Downball over net.',
      'Side B receives, executes 3 contacts, and sends it back to Side A.',
      'Team earns 1 milestone point for every successful 10-touch rally.',
      'Goal: Achieve a 30-touch unbroken cooperative rally record as a squad.'
    ],
    coachingKeys: [
      'No one-touch panic returns—trust your teammates to make 3 touches.',
      'Call "MINE" loudly before touching every single ball.'
    ],
    variations: [
      'Add a rule: Ball sent over net must be an overhead tip or roll shot.'
    ],
    animationData: {
      courtType: 'full',
      phases: [
        {
          name: 'Phase 1: Side A 3-Touch Progression',
          description: 'Side A executes Pass, Set, and Downball over net.',
          duration: 2500,
          players: [
            { id: 'a1', label: 'A1', role: 'Passer', action: '🏐 Pass', x: 30, y: 75, color: '#3b82f6' },
            { id: 'a2', label: 'A2', role: 'Setter', action: '🏐 Set', x: 50, y: 58, color: '#a855f7' },
            { id: 'a3', label: 'A3', role: 'Hitter', action: '💥 Downball', x: 70, y: 58, color: '#f97316' }
          ],
          ball: { x: 50, y: 25, visible: true, arc: true, height: 3, from: { x: 70, y: 58 } },
          annotations: [{ text: 'Pass ➔ Set ➔ Attack! 3 Touches', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: Side B 3-Touch Return',
          description: 'Side B digs, sets, and returns ball to continue rally record.',
          duration: 2500,
          players: [
            { id: 'b1', label: 'B1', role: 'Passer', action: '🛡️ Dig', x: 50, y: 25, color: '#10b981' },
            { id: 'b2', label: 'B2', role: 'Setter', action: '🏐 Set', x: 50, y: 40, color: '#f59e0b' },
            { id: 'b3', label: 'B3', role: 'Hitter', action: '💥 Return', x: 30, y: 40, color: '#ec4899' }
          ],
          ball: { x: 30, y: 75, visible: true, arc: true, height: 2.8, from: { x: 30, y: 40 } },
          annotations: [{ text: 'RALLY COUNT: 20 Touches! 🎯', x: 50, y: 50 }]
        }
      ]
    }
  }
];
