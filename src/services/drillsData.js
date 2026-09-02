/**
 * Official Volleyball Drills & Animated Practice Library
 * Comprehensive collection of drills categorized by skill discipline with 2D court animation coordinates.
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
  // 1. WARM-UP & FOOTWORK
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
          name: 'Phase 1: Starting Stance',
          description: 'Hitter is loaded at Zone 4 behind the 10ft line.',
          duration: 2000,
          players: [
            { id: 'h1', label: 'OH', role: 'Hitter', x: 20, y: 70, color: '#f97316' },
            { id: 'c1', label: 'Coach', role: 'Toss', x: 50, y: 30, color: '#64748b' }
          ],
          ball: { x: 50, y: 30, visible: true, arc: false },
          annotations: [{ text: '10ft Line Starting Spot', x: 20, y: 75 }]
        },
        {
          name: 'Phase 2: Penultimate & Plant Step',
          description: 'Hitter accelerates into explosive Right-Left plant at the attack zone.',
          duration: 2500,
          players: [
            { id: 'h1', label: 'OH', role: 'Hitter', x: 25, y: 35, color: '#f97316' },
            { id: 'c1', label: 'Coach', role: 'Toss', x: 50, y: 30, color: '#64748b' }
          ],
          ball: { x: 25, y: 25, visible: true, arc: true, from: { x: 50, y: 30 } },
          annotations: [{ text: 'Explosive Plant Step 💥', x: 25, y: 40 }]
        },
        {
          name: 'Phase 3: High Contact & Soft Landing',
          description: 'Contact ball at maximum vertical reach and land balanced.',
          duration: 2500,
          players: [
            { id: 'h1', label: 'OH', role: 'Hitter', x: 25, y: 30, color: '#f97316' },
            { id: 'c1', label: 'Coach', role: 'Toss', x: 50, y: 30, color: '#64748b' }
          ],
          ball: { x: 75, y: 85, visible: true, arc: true, from: { x: 25, y: 30 } },
          annotations: [{ text: 'Deep Cross-Court Hit 🏐', x: 70, y: 80 }]
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
      'Player A1 in Zone 5 on Side A free-ball serves/passes over the net to Player B1 in Zone 5.',
      'Player B1 passes to Setter B2 in Zone 3.',
      'Setter B2 sets to Player B3 in Zone 4, who hits a controlled downball over to Side A Player A1.',
      'Immediately after touching the ball, each player follows their ball and transitions under the net to the opposite side.',
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
            { id: 'a1', label: 'A1', role: 'Passer', x: 25, y: 75, color: '#3b82f6' },
            { id: 'a2', label: 'A2', role: 'Setter', x: 50, y: 55, color: '#a855f7' },
            { id: 'b1', label: 'B1', role: 'Passer', x: 25, y: 25, color: '#10b981' },
            { id: 'b2', label: 'B2', role: 'Setter', x: 50, y: 40, color: '#f59e0b' }
          ],
          ball: { x: 25, y: 25, visible: true, arc: true, from: { x: 25, y: 75 } },
          annotations: [{ text: 'High Float Pass', x: 25, y: 50 }]
        },
        {
          name: 'Phase 2: Set to Antenna',
          description: 'Side B Setter sets high ball to Zone 4 hitter.',
          duration: 2500,
          players: [
            { id: 'a1', label: 'A1', role: 'Passer', x: 25, y: 75, color: '#3b82f6' },
            { id: 'a2', label: 'A2', role: 'Setter', x: 50, y: 55, color: '#a855f7' },
            { id: 'b1', label: 'B1', role: 'Passer', x: 25, y: 25, color: '#10b981' },
            { id: 'b2', label: 'B2', role: 'Setter', x: 50, y: 38, color: '#f59e0b' }
          ],
          ball: { x: 20, y: 42, visible: true, arc: true, from: { x: 50, y: 38 } },
          annotations: [{ text: 'High Set to Zone 4', x: 35, y: 38 }]
        },
        {
          name: 'Phase 3: Downball Return & Rotation',
          description: 'Hitter hits controlled downball back to Side A and rotates.',
          duration: 2500,
          players: [
            { id: 'a1', label: 'A1', role: 'Passer', x: 30, y: 75, color: '#3b82f6' },
            { id: 'a2', label: 'A2', role: 'Setter', x: 50, y: 55, color: '#a855f7' },
            { id: 'b1', label: 'B1', role: 'Passer', x: 20, y: 40, color: '#10b981' },
            { id: 'b2', label: 'B2', role: 'Setter', x: 50, y: 38, color: '#f59e0b' }
          ],
          ball: { x: 30, y: 75, visible: true, arc: true, from: { x: 20, y: 40 } },
          annotations: [{ text: 'Downball Across Net', x: 25, y: 60 }]
        }
      ]
    }
  },

  // =========================================================================
  // 2. SERVING & SERVE RECEIVE
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
            { id: 's1', label: 'Server', role: 'Server', x: 80, y: 95, color: '#3b82f6' }
          ],
          ball: { x: 80, y: 92, visible: true, arc: false },
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
            { id: 's1', label: 'Server', role: 'Server', x: 80, y: 90, color: '#3b82f6' }
          ],
          ball: { x: 20, y: 15, visible: true, arc: true, from: { x: 80, y: 90 } },
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
            { id: 'p5', label: 'OH1', role: 'Passer', x: 25, y: 80, color: '#f97316' },
            { id: 'p6', label: 'LIB', role: 'Libero', x: 50, y: 85, color: '#8b5cf6' },
            { id: 'p1', label: 'OH2', role: 'Passer', x: 75, y: 80, color: '#f97316' },
            { id: 'st', label: 'S Target', role: 'Target', x: 65, y: 30, color: '#3b82f6' }
          ],
          ball: { x: 38, y: 20, visible: true, arc: false },
          annotations: [{ text: 'Incoming Float Serve', x: 38, y: 25 }]
        },
        {
          name: 'Phase 2: Libero Calls Seam & Passes',
          description: 'Libero slides over to take seam ball, angling platform to target.',
          duration: 2500,
          players: [
            { id: 'p5', label: 'OH1', role: 'Passer', x: 22, y: 78, color: '#f97316' },
            { id: 'p6', label: 'LIB', role: 'Libero', x: 38, y: 72, color: '#8b5cf6' },
            { id: 'p1', label: 'OH2', role: 'Passer', x: 75, y: 80, color: '#f97316' },
            { id: 'st', label: 'S Target', role: 'Target', x: 65, y: 30, color: '#3b82f6' }
          ],
          ball: { x: 38, y: 72, visible: true, arc: true, from: { x: 38, y: 20 } },
          annotations: [{ text: '"MINE! MINE!" 🗣️', x: 38, y: 78 }]
        },
        {
          name: 'Phase 3: Pinpoint Pass to Setter Target',
          description: 'Ball delivers high arching 3-point pass directly into target.',
          duration: 2500,
          players: [
            { id: 'p5', label: 'OH1', role: 'Passer', x: 22, y: 78, color: '#f97316' },
            { id: 'p6', label: 'LIB', role: 'Libero', x: 38, y: 72, color: '#8b5cf6' },
            { id: 'p1', label: 'OH2', role: 'Passer', x: 75, y: 80, color: '#f97316' },
            { id: 'st', label: 'S Target', role: 'Target', x: 65, y: 30, color: '#3b82f6' }
          ],
          ball: { x: 65, y: 30, visible: true, arc: true, from: { x: 38, y: 72 } },
          annotations: [{ text: '⭐ 3-Point Perfect Pass', x: 65, y: 22 }]
        }
      ]
    }
  },

  // =========================================================================
  // 3. DEFENSE & DIGGING
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
    setup: 'Coach standing on box at Zone 4 (Left Front) hitting into Zone 5, Zone 6, and Zone 1. Defender starts in base defense and reads hitter approach.',
    instructions: [
      'Defender starts at base defense (12ft off net, balanced stance, chest forward).',
      'As coach takes arm back on box, defender stops and reads arm swing direction.',
      'Coach spikes hard-driven ball cross-court or down the line.',
      'Defender reacts, stays low, and digs ball high toward the 10ft line middle court (Zone 3/6 transition zone).',
      'Defender immediately resets for 4 consecutive rapid balls.'
    ],
    coachingKeys: [
      'Be STOPPED and balanced on defense at the moment the hitter makes contact.',
      'Absorb heavy balls by relaxing platform and dropping shoulders slightly.',
      'Dig balls high (15+ feet) so transition hitters have time to open up and approach.'
    ],
    variations: [
      'Add occasional off-speed tip/roll shot requiring a sprint and pancake/sprawl.',
      'Dual defenders with seam responsibility.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Base Position & Read',
          description: 'Defender reading coach arm-swing on attack box.',
          duration: 2000,
          players: [
            { id: 'box', label: 'Coach', role: 'Hitter', x: 20, y: 15, color: '#ef4444' },
            { id: 'd1', label: 'LIB', role: 'Defender', x: 75, y: 80, color: '#10b981' }
          ],
          ball: { x: 20, y: 15, visible: true, arc: false },
          annotations: [{ text: 'Attack Box (Zone 4)', x: 20, y: 10 }]
        },
        {
          name: 'Phase 2: Hard-Driven Spike Cross-Court',
          description: 'Coach spikes fast ball toward deep Right Back (Zone 1).',
          duration: 2000,
          players: [
            { id: 'box', label: 'Coach', role: 'Hitter', x: 20, y: 15, color: '#ef4444' },
            { id: 'd1', label: 'LIB', role: 'Defender', x: 75, y: 80, color: '#10b981' }
          ],
          ball: { x: 75, y: 80, visible: true, arc: true, from: { x: 20, y: 15 } },
          annotations: [{ text: '90mph Spike! ⚡', x: 45, y: 50 }]
        },
        {
          name: 'Phase 3: High Absorb Dig to 10ft Line',
          description: 'Defender digs ball high and center for transition offense.',
          duration: 2500,
          players: [
            { id: 'box', label: 'Coach', role: 'Hitter', x: 20, y: 15, color: '#ef4444' },
            { id: 'd1', label: 'LIB', role: 'Defender', x: 75, y: 80, color: '#10b981' }
          ],
          ball: { x: 50, y: 40, visible: true, arc: true, from: { x: 75, y: 80 } },
          annotations: [{ text: 'High Transition Dig 🛡️', x: 50, y: 35 }]
        }
      ]
    }
  },

  // =========================================================================
  // 4. SETTING & TRANSITION
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
          name: 'Phase 1: Off-Net Toss',
          description: 'Pass is pushed 12ft off net into Zone 6.',
          duration: 2000,
          players: [
            { id: 's1', label: 'Setter', role: 'Setter', x: 65, y: 30, color: '#a855f7' },
            { id: 'c1', label: 'Coach', role: 'Toss', x: 50, y: 80, color: '#64748b' }
          ],
          ball: { x: 45, y: 55, visible: true, arc: true, from: { x: 50, y: 80 } },
          annotations: [{ text: 'Off-Net Pass (12ft Off)', x: 45, y: 60 }]
        },
        {
          name: 'Phase 2: Setter Sprint & Square Up',
          description: 'Setter sprints to ball, establishes base, and squares to Zone 4.',
          duration: 2500,
          players: [
            { id: 's1', label: 'Setter', role: 'Setter', x: 45, y: 55, color: '#a855f7' },
            { id: 'c1', label: 'Coach', role: 'Toss', x: 50, y: 80, color: '#64748b' }
          ],
          ball: { x: 45, y: 52, visible: true, arc: false },
          annotations: [{ text: 'Square Hips to Antenna 📐', x: 45, y: 48 }]
        },
        {
          name: 'Phase 3: Back-Set Delivery to Right Side',
          description: 'Setter pushes high back-set to Zone 2 antenna.',
          duration: 2500,
          players: [
            { id: 's1', label: 'Setter', role: 'Setter', x: 45, y: 55, color: '#a855f7' },
            { id: 'opp', label: 'OPP', role: 'Hitter', x: 80, y: 30, color: '#f97316' }
          ],
          ball: { x: 80, y: 25, visible: true, arc: true, from: { x: 45, y: 52 } },
          annotations: [{ text: 'Pinpoint Back-Set to Zone 2 🏐', x: 80, y: 20 }]
        }
      ]
    }
  },

  // =========================================================================
  // 5. ATTACKING & HITTING
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
            { id: 'h4', label: 'OH', role: 'Blocker', x: 20, y: 22, color: '#f97316' },
            { id: 's1', label: 'S', role: 'Setter', x: 65, y: 30, color: '#a855f7' }
          ],
          ball: { x: 20, y: 15, visible: false },
          annotations: [{ text: 'Block Jump at Net 🧱', x: 20, y: 28 }]
        },
        {
          name: 'Phase 2: Sprint Transition to 10ft Line',
          description: 'Hitter lands, opens hips, and sprints to 10ft line.',
          duration: 2500,
          players: [
            { id: 'h4', label: 'OH', role: 'Transition', x: 15, y: 65, color: '#f97316' },
            { id: 's1', label: 'S', role: 'Setter', x: 65, y: 30, color: '#a855f7' }
          ],
          ball: { x: 65, y: 30, visible: true, arc: true, from: { x: 50, y: 80 } },
          annotations: [{ text: 'Open Hips & Transition Back 🏃', x: 15, y: 70 }]
        },
        {
          name: 'Phase 3: High Set & Spike Across Court',
          description: 'Setter delivers high ball to Zone 4; hitter approaches and spikes.',
          duration: 2500,
          players: [
            { id: 'h4', label: 'OH', role: 'Hitter', x: 20, y: 28, color: '#f97316' },
            { id: 's1', label: 'S', role: 'Setter', x: 65, y: 30, color: '#a855f7' }
          ],
          ball: { x: 80, y: 80, visible: true, arc: true, from: { x: 20, y: 28 } },
          annotations: [{ text: 'Spike Deep Cross-Court 💥', x: 75, y: 75 }]
        }
      ]
    }
  },

  // =========================================================================
  // 6. BLOCKING & NET PLAY
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
    setup: 'Middle Blocker (Zone 3) and Outside Pin Blocker (Zone 4) start at net with hands up in ready posture (fingers spread at eye height). Coach on opposite side with ball.',
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
      'Double vs Triple Block: Add Opposite blocker in Zone 2 to seal against opponent middle quicks.',
      'Joust Drill: Toss tight ball onto the net tape for 1-on-1 power press joust.'
    ],
    animationData: {
      courtType: 'half',
      phases: [
        {
          name: 'Phase 1: Ready Base at Net',
          description: 'Middle and Pin blockers in ready blocking stance.',
          duration: 2000,
          players: [
            { id: 'pin', label: 'OH', role: 'Pin Blocker', x: 25, y: 22, color: '#06b6d4' },
            { id: 'mid', label: 'MB', role: 'Middle Blocker', x: 50, y: 22, color: '#06b6d4' }
          ],
          ball: { x: 50, y: 15, visible: true, arc: false },
          annotations: [{ text: 'Hands at Eye Height 👀', x: 50, y: 27 }]
        },
        {
          name: 'Phase 2: Crossover Step to Close Seam',
          description: 'Middle executes crossover step to seal with pin blocker.',
          duration: 2000,
          players: [
            { id: 'pin', label: 'OH', role: 'Pin Blocker', x: 25, y: 22, color: '#06b6d4' },
            { id: 'mid', label: 'MB', role: 'Middle Blocker', x: 30, y: 22, color: '#06b6d4' }
          ],
          ball: { x: 25, y: 15, visible: true, arc: true, from: { x: 50, y: 15 } },
          annotations: [{ text: 'Seam Closed Tight! 🔒', x: 28, y: 28 }]
        },
        {
          name: 'Phase 3: Penetrate Across Net & Stuff Block',
          description: 'Both blockers press hands over net and stuff opponent spike.',
          duration: 2500,
          players: [
            { id: 'pin', label: 'OH', role: 'Pin Blocker', x: 25, y: 20, color: '#06b6d4' },
            { id: 'mid', label: 'MB', role: 'Middle Blocker', x: 30, y: 20, color: '#06b6d4' }
          ],
          ball: { x: 28, y: 10, visible: true, arc: true, from: { x: 28, y: 20 } },
          annotations: [{ text: 'STUFF BLOCK! 💥 (+Point)', x: 28, y: 5 }]
        }
      ]
    }
  },

  // =========================================================================
  // 7. WASH & SCRIMMAGE GAMES
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
            { id: 'sa_s', label: 'S1', role: 'Server', x: 80, y: 92, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Front', role: 'Blockers', x: 50, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Pass', role: 'Passers', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Front', role: 'Hitters', x: 50, y: 40, color: '#ec4899' }
          ],
          ball: { x: 50, y: 25, visible: true, arc: true, from: { x: 80, y: 92 } },
          annotations: [{ text: 'Rally 1: Live Serve', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: Side A Wins Rally 1 & Coach Enters Free Ball',
          description: 'Coach throws Free Ball into Side B; Side A sets up counter-attack.',
          duration: 2500,
          players: [
            { id: 'sa_s', label: 'A Back', role: 'Defense', x: 50, y: 80, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Front', role: 'Blockers', x: 50, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Back', role: 'Defense', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Front', role: 'Hitters', x: 50, y: 40, color: '#ec4899' }
          ],
          ball: { x: 50, y: 20, visible: true, arc: true, from: { x: 5, y: 50 } },
          annotations: [{ text: 'Coach Bonus Free Ball 🏐', x: 25, y: 35 }]
        },
        {
          name: 'Phase 3: Side A Counter-Attack Kills for Big Point',
          description: 'Side A digs, sets outside, and scores to win the 2-in-a-row wash!',
          duration: 2500,
          players: [
            { id: 'sa_s', label: 'A Back', role: 'Defense', x: 50, y: 80, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Hit', role: 'Hitter', x: 25, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Back', role: 'Defense', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Front', role: 'Blockers', x: 25, y: 45, color: '#ec4899' }
          ],
          ball: { x: 75, y: 20, visible: true, arc: true, from: { x: 25, y: 55 } },
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
            { id: 'sa_s', label: 'S1', role: 'Server', x: 80, y: 92, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Front', role: 'Blockers', x: 50, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Pass', role: 'Passers', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Front', role: 'Hitters', x: 50, y: 40, color: '#ec4899' }
          ],
          ball: { x: 50, y: 25, visible: true, arc: true, from: { x: 80, y: 92 } },
          annotations: [{ text: 'Match Point at 24-24! 💥', x: 50, y: 50 }]
        },
        {
          name: 'Phase 2: Side B Perfect Side-Out Kill',
          description: 'Side B executes side-out kill off pin to reach game point.',
          duration: 2500,
          players: [
            { id: 'sa_s', label: 'A Defense', role: 'Defense', x: 50, y: 80, color: '#3b82f6' },
            { id: 'sa_f', label: 'A Block', role: 'Blockers', x: 25, y: 55, color: '#3b82f6' },
            { id: 'sb_p', label: 'B Back', role: 'Defense', x: 50, y: 25, color: '#ec4899' },
            { id: 'sb_f', label: 'B Hit', role: 'Hitter', x: 25, y: 42, color: '#ec4899' }
          ],
          ball: { x: 75, y: 85, visible: true, arc: true, from: { x: 25, y: 42 } },
          annotations: [{ text: 'CLUTCH KILL! 🏐 25-24', x: 75, y: 80 }]
        }
      ]
    }
  }
];
