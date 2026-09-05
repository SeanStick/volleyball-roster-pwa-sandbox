/**
 * timeoutAdvisorService.js
 * 
 * Deep In-Game Tactical & Motivational Timeout Advisor for Volleyball Coaches.
 * Evaluates real-time match state, scoring momentum, rotational vulnerabilities,
 * recent error distributions, and crunch-time pressure to deliver targeted, high-impact
 * coaching adjustments and inspiring motivational rally cries during 60-second timeouts.
 * 
 * Contains 112+ Tactical Coaching Advice Items & 105+ Situational Motivational Affirmations.
 */

// =========================================================================
// 🎯 PART 1: MASSIVE CATALOG OF TACTICAL COACHING ADVICE (112 ITEMS)
// =========================================================================

export const TACTICAL_ADVICE_CATALOG = [
  // --- A. SERVE RECEIVE & PASSING STABILITY (25 ITEMS) ---
  {
    id: 'tac-pass-1',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'opponent_run', 'trailing', 'general'],
    title: 'Platform Angle to Target Zone',
    instruction: 'Drop your platform early and freeze it through contact. Stop swinging your arms — let the ball rebound off your platform toward zone 2/3.'
  },
  {
    id: 'tac-pass-2',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'opponent_run', 'trailing'],
    title: 'Call the Seam Early with Vocal Ownership',
    instruction: 'Call "MINE" before the ball crosses the net. If the ball is in the seam between two passers, the left-side passer takes priority on cross-court floats.'
  },
  {
    id: 'tac-pass-3',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'general'],
    title: 'Read the Server’s Toss & Hand Contact',
    instruction: 'Watch the server’s toss height and hand contact. If they toss low and strike flat, expect a sharp float that drops quickly — stay low on the balls of your feet.'
  },
  {
    id: 'tac-pass-4',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'crunch_time'],
    title: 'High-Hands Defense on Deep Floaters',
    instruction: 'Take deep float serves with your hands overhead instead of retreating backward on your heels. Clean finger action and push it straight up to the 10-foot line.'
  },
  {
    id: 'tac-pass-5',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'opponent_run'],
    title: 'Split-Step on Server’s Contact',
    instruction: 'Take a hop split-step the exact moment the server strikes the ball. That small bounce activates your calves and gives you an explosive first reaction step.'
  },
  {
    id: 'tac-pass-6',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'trailing'],
    title: 'Pass to the 10-Foot Line on Heavy Topspin',
    instruction: 'Don’t try to make a perfect 3-point pass on heavy topspin. Give our setter a 10-foot ball with height so we stay in-system and avoid tight overpasses.'
  },
  {
    id: 'tac-pass-7',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'general'],
    title: 'Widen the Libero Receive Corridor',
    instruction: 'Libero, take one full step toward middle court and claim 60% of the passing area. Pinch the sideline and relieve pressure off our outside hitter.'
  },
  {
    id: 'tac-pass-8',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'opponent_run'],
    title: 'Short Serve Warning & Push Forward',
    instruction: 'Their server is aiming short to zones 2 and 4 to pull our front-row attackers out of transition. Back-row passers, step up and take that short ball.'
  },
  {
    id: 'tac-pass-9',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'crunch_time'],
    title: 'Shoulders Tilted Inward on Sideline Balls',
    instruction: 'When passing a serve driven toward the sideline, drop your outside shoulder to angle your platform back into the center of the court.'
  },
  {
    id: 'tac-pass-10',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'trailing'],
    title: 'Neutral Stance — Weight on Balls of Feet',
    instruction: 'You are standing too upright before the serve. Bend your knees, chest over knees, arms relaxed in front, ready to react in any direction.'
  },
  {
    id: 'tac-pass-11',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'general'],
    title: 'Communicate Deep Line In/Out Calls',
    instruction: 'Non-passers on court must scream "OUT" or "IN" early. Give your passers clear auditory cues so they can let borderline deep floaters sail out.'
  },
  {
    id: 'tac-pass-12',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'opponent_run'],
    title: 'One Good Pass Resets Everything',
    instruction: 'Forget the last 2 rallies. All we need right now is one solid contact to our setter. Keep your eye locked on the ball all the way into your forearms.'
  },
  {
    id: 'tac-pass-13',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'general'],
    title: 'Communicate Overpass Recovery',
    instruction: 'If the pass is tight to the net, middle blocker call "OVER" and turn immediately to jump and contest or soft-block the opponent’s quick attack.'
  },
  {
    id: 'tac-pass-14',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'crunch_time'],
    title: 'Trust Your Passing Triangle',
    instruction: 'Keep our three-person receive triangle tight and connected. Constant talking before the whistle: "You have line, I have cross, mine on the seam."'
  },
  {
    id: 'tac-pass-15',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'trailing'],
    title: 'Absorb Fast Jump Serves with Soft Hands',
    instruction: 'Against high-velocity jump serves, give with your platform slightly at contact. Do not punch at the ball; let the ball’s own speed bounce it up.'
  },
  {
    id: 'tac-pass-16',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'general'],
    title: 'Feet Beat the Ball to the Spot',
    instruction: 'Move your feet first! Do not reach outside your body frame on easy floaters. Slide your hips behind the ball and pass midline.'
  },
  {
    id: 'tac-pass-17',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'opponent_run'],
    title: 'Deep Float Drop Step Discipline',
    instruction: 'Open your hips with a clean drop step when tracking a deep ball. Running backward squared to the net leads to shanks off the thumbs.'
  },
  {
    id: 'tac-pass-18',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'crunch_time'],
    title: 'Height Over Perfection in Serve Receive',
    instruction: 'Give the pass 12 to 15 feet of arc. Height gives our setter time to get underneath and gives our hitters time to execute full approaches.'
  },
  {
    id: 'tac-pass-19',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'general'],
    title: 'Left Passer Takes Deep Middle Seam',
    instruction: 'Re-clarify seam rules: when the ball splits 6 and 5, our Zone 5 passer takes it moving right so their platform faces target naturally.'
  },
  {
    id: 'tac-pass-20',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'trailing'],
    title: 'Shake Off the Ace — First Ball Kill',
    instruction: 'An ace happens. Look at your setter, take your ready posture, and earn a first-ball sideout. They have to serve over our wall now.'
  },
  {
    id: 'tac-pass-21',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'general'],
    title: 'Lower Your Core Center of Gravity',
    instruction: 'Sink into your quads. The lower your hips start, the easier it is to drive upward through the ball without swinging your shoulders.'
  },
  {
    id: 'tac-pass-22',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'opponent_run'],
    title: 'Isolate the Primary Target Server',
    instruction: 'Their server has dialed in on our left seam. Step 18 inches to your left and show them that window is slammed shut.'
  },
  {
    id: 'tac-pass-23',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'crunch_time'],
    title: 'Lock Thumbs and Wrists Downward',
    instruction: 'Point your thumbs straight down toward the ground at contact. That locks your elbows rigid and gives you a completely flat rebound surface.'
  },
  {
    id: 'tac-pass-24',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'general'],
    title: 'Protect the Sideline Float Drift',
    instruction: 'Float serves hook toward the sideline late. Don’t commit your platform until the ball passes the 10-foot line.'
  },
  {
    id: 'tac-pass-25',
    category: 'Passing & Serve Receive',
    scenario: ['receive_errors', 'trailing'],
    title: 'Call Out Early Trajectory ("DEEP" / "SHORT")',
    instruction: 'The moment the ball leaves the server’s hand, call the trajectory loudly. Clear communication removes all doubt.'
  },

  // --- B. ATTACKING & HITTER SHOT SELECTION (25 ITEMS) ---
  {
    id: 'tac-att-1',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'trailing', 'general'],
    title: 'Tool the Outside Block Hands',
    instruction: 'Stop hitting straight down into their double block! Aim for the outside blocker’s outside hand and swipe the ball off the fingertips out of bounds.'
  },
  {
    id: 'tac-att-2',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'crunch_time'],
    title: 'Deep Corner Roll Shot Over the Block',
    instruction: 'When the set is off the net, don’t swing full power into the net tape. Roll high and deep into Zone 1 or Zone 5 corner where their defense is empty.'
  },
  {
    id: 'tac-att-3',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'opponent_run'],
    title: 'High Hand Contact & Deep Line Wipe',
    instruction: 'Contact the ball at your highest reach. Their blockers are late closing the pin — wipe hard high off their hands or slice line.'
  },
  {
    id: 'tac-att-4',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Cut Back Across the Middle on Out-of-System Sets',
    instruction: 'When pushed out-of-system, cut your attack back into the angle/doughnut (Zone 6) rather than forcing down the line against their closed block.'
  },
  {
    id: 'tac-att-5',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'crunch_time'],
    title: 'Recycle Out-of-System Balls Off the Block',
    instruction: 'If the set is tight or you have no angle to kill, softly chip the ball into the mid-chest of their block and scream "COVER!" to get a second chance.'
  },
  {
    id: 'tac-att-6',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Explosive Last Two Steps of Approach',
    instruction: 'Slow-to-fast approach! Your penultimate step must be long and explosive, converting horizontal speed into vertical jump height above their block.'
  },
  {
    id: 'tac-att-7',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'trailing'],
    title: 'Tip into the "Campfire" Zone 3 Behind the Block',
    instruction: 'Their middle blocker is over-committing forward and their back-row is pinned deep. A soft, deceptive push tip right behind their block into zone 3 is wide open.'
  },
  {
    id: 'tac-att-8',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'leading'],
    title: 'Aggressive Swings with Margin for Error',
    instruction: 'Swing aggressive, but aim for 2 feet inside the court baseline. Never give away free points with unforced hitting errors when we have momentum.'
  },
  {
    id: 'tac-att-9',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Middle Blocker Quick Transition',
    instruction: 'Middles, open up to the setter the instant the opponent contacts the ball. We need your quick attack threatening the net even if you don’t get set.'
  },
  {
    id: 'tac-att-10',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'crunch_time'],
    title: 'Feed the Hot Hand on High-Percentage Swings',
    instruction: 'Setter, in crunch time, feed the hitter who is in rhythm. Put the ball up high, 2 feet off the net, and give them room to jump and swing.'
  },
  {
    id: 'tac-att-11',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'trailing'],
    title: 'Attack the Seam Between Middle and Pin',
    instruction: 'Their middle is late getting across to help on the pin. Look for the open seam between their two blockers and drive the ball right through the split.'
  },
  {
    id: 'tac-att-12',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Back-Row Pipe Attack Threat',
    instruction: 'Back-row outside, stay available for the Pipe attack (Zone 6) from behind the 10-foot line. It freezes their middle blocker and opens up the pins.'
  },
  {
    id: 'tac-att-13',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Wrist Snap on Topspin Drives',
    instruction: 'Snap your wrist firmly over the top of the ball at the peak of your jump. Topspin dips the ball sharply inside their end line.'
  },
  {
    id: 'tac-att-14',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'trailing'],
    title: 'Use High Flat Contact on Low Trapping Sets',
    instruction: 'When a set drops below the net tape, do not try to bounce it straight down. Hit deep with flat contact to the opponent back corners.'
  },
  {
    id: 'tac-att-15',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'crunch_time'],
    title: 'See the Block in Your Peripheral Vision',
    instruction: 'Look at the block as you take off. If their middle closed the pin, roll cross-court; if their middle is late, blast the seam.'
  },
  {
    id: 'tac-att-16',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'opponent_run'],
    title: 'Opposite / Right Side Sharp Cross-Court',
    instruction: 'Right-side hitter, turn your wrist inward on cross-court sets and slice hard across Zone 4 where their setter is defending.'
  },
  {
    id: 'tac-att-17',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Delay Your Jump on High Out-of-System Sets',
    instruction: 'Don’t jump too early on moon balls! Wait until the set reaches its apex before beginning your 3-step explosive approach.'
  },
  {
    id: 'tac-att-18',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'leading'],
    title: 'Keep Swings In Play on Tough Out-of-System Rallies',
    instruction: 'Make them make a play! An aggressive high shot deep into their court forces them to pass from 25 feet away instead of giving them a free error.'
  },
  {
    id: 'tac-att-19',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Open Up Body Angle on Approach',
    instruction: 'Approach facing the setter at 45 degrees so you can rotate through your core and see the entire opponent court at peak contact.'
  },
  {
    id: 'tac-att-20',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'trailing'],
    title: 'Slide Attack Behind Setter in Transition',
    instruction: 'Middle, on any transition pass from right court, sprint behind the setter on a one-foot takeoff slide. Their blockers are unable to track it.'
  },
  {
    id: 'tac-att-21',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'crunch_time'],
    title: 'Aggressive Swing on Overpasses',
    instruction: 'When the opponent gives us an overpass, do not hesitate. Jump straight up and hammer it with authority to the floor.'
  },
  {
    id: 'tac-att-22',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Joust at the Net: Push and Turn',
    instruction: 'In a 50/50 joust above the tape, do not slap. Place both hands firmly under the ball and twist your shoulders to push it into their block.'
  },
  {
    id: 'tac-att-23',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'opponent_run'],
    title: 'High Line Shot Over the Setter Block',
    instruction: 'Their setter is blocking the pin and is 4 inches shorter than their middle. Hit high over the setter’s hands down the line.'
  },
  {
    id: 'tac-att-24',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'general'],
    title: 'Two-Hand Push Tip to Back Corners',
    instruction: 'If the block is giant, reach high with two open hands (clean touch) and direct the ball deep to Zone 1. It forces a 20-foot scramble.'
  },
  {
    id: 'tac-att-25',
    category: 'Attacking & Shot Selection',
    scenario: ['attack_errors', 'leading'],
    title: 'Patience on Tight Sets — Use the Tape',
    instruction: 'If set is right on the tape, press through the ball rather than sweeping side to side to avoid net contact calls.'
  },

  // --- C. SETTING & IN-SYSTEM FLOW (15 ITEMS) ---
  {
    id: 'tac-set-1',
    category: 'Setting & In-System Flow',
    scenario: ['attack_errors', 'trailing', 'general'],
    title: 'Push Sets 2 to 3 Feet Off the Net',
    instruction: 'Our sets are drifting too tight into the tape, giving our hitters no room to swing. Set the ball 2 to 3 feet off the net so hitters can see the block.'
  },
  {
    id: 'tac-set-2',
    category: 'Setting & In-System Flow',
    scenario: ['opponent_run', 'trailing'],
    title: 'High-Tempo Outside to Beat the Opponent Block',
    instruction: 'Speed up the release to the outside antenna. If we can beat their middle from closing, our outside will have a clean 1-on-1 hit.'
  },
  {
    id: 'tac-set-3',
    category: 'Setting & In-System Flow',
    scenario: ['leading', 'general'],
    title: 'Run Middle Quick on Free Balls & Perfect Passes',
    instruction: 'Whenever we get a free ball or perfect pass, run the middle quick (1 or slide). Force their blockers to honor the middle every single rotation.'
  },
  {
    id: 'tac-set-4',
    category: 'Setting & In-System Flow',
    scenario: ['crunch_time', 'general'],
    title: 'Setter Dump Option When Front Row',
    instruction: 'Setter, when you are in the front row, keep your eyes on the opponent defense. If their libero is creeping deep, a soft left-hand tip to zone 4 is a free kill.'
  },
  {
    id: 'tac-set-5',
    category: 'Setting & In-System Flow',
    scenario: ['attack_errors', 'opponent_run'],
    title: 'Square Shoulders to the Left Antenna',
    instruction: 'Square your hips and shoulders toward the left antenna before every set. Hiding your posture keeps both pins honest until the ball leaves your fingertips.'
  },
  {
    id: 'tac-set-6',
    category: 'Setting & In-System Flow',
    scenario: ['general', 'trailing'],
    title: 'Back-Set to Opposite / Right Side',
    instruction: 'Their block is cheating toward our outside. Reverse the flow and back-set to our right side in Zone 2 to isolate their weaker left-side blocker.'
  },
  {
    id: 'tac-set-7',
    category: 'Setting & In-System Flow',
    scenario: ['general', 'leading'],
    title: 'Vary the Set Tempo to Confuse Their Middle',
    instruction: 'Alternate between high-ball pins and fast 2-balls in the center. Keeping their middle guessing prevents them from setting up a solid double block.'
  },
  {
    id: 'tac-set-8',
    category: 'Setting & In-System Flow',
    scenario: ['attack_errors', 'trailing'],
    title: 'Consistent Contact Point Above Forehead',
    instruction: 'Take every ball with hands high directly above your hairline. Contacting near your chin telegraphs back-sets and leads to lift calls.'
  },
  {
    id: 'tac-set-9',
    category: 'Setting & In-System Flow',
    scenario: ['crunch_time', 'general'],
    title: 'Quiet Hands on Tight Passes',
    instruction: 'On tight balls near the net, cushion with soft wrists. Do not slap at the ball; absorb and release smoothly to the open pin.'
  },
  {
    id: 'tac-set-10',
    category: 'Setting & In-System Flow',
    scenario: ['opponent_run', 'general'],
    title: 'Establish Middle Blocker Early in the Set',
    instruction: 'Force them to respect our quick middle attack. Even on a medium pass, push a 31 or 51 ball to keep their blockers honest.'
  },
  {
    id: 'tac-set-11',
    category: 'Setting & In-System Flow',
    scenario: ['general', 'trailing'],
    title: 'Call the Play Early Before the Whistle',
    instruction: 'Flash the hand signs or call the combination before the serve. When our hitters know their route early, transition is twice as fast.'
  },
  {
    id: 'tac-set-12',
    category: 'Setting & In-System Flow',
    scenario: ['leading', 'general'],
    title: 'Use the Pipe Attack in Transition',
    instruction: 'On good transition digs, set our back-row attacker in Zone 6. It opens up the floor and gives us 4 active hitting options.'
  },
  {
    id: 'tac-set-13',
    category: 'Setting & In-System Flow',
    scenario: ['attack_errors', 'general'],
    title: 'Set the Ball with High Arc on Bad Digs',
    instruction: 'When we are scrambled, give the ball 15 feet of air toward the 10-foot line. That buys our hitter time to reset their approach.'
  },
  {
    id: 'tac-set-14',
    category: 'Setting & In-System Flow',
    scenario: ['crunch_time', 'leading'],
    title: 'Single-Hand Tip Dump on Overpasses',
    instruction: 'If an overpass is hovering above the net, rise up and punch it into the open deep angle before their middle can contest.'
  },
  {
    id: 'tac-set-15',
    category: 'Setting & In-System Flow',
    scenario: ['general', 'trailing'],
    title: 'Jump Setting to Accelerate Release Tempo',
    instruction: 'Jump setting steals half a second from their middle blocker’s reaction time. Get up in the air and flick the ball to the pins.'
  },

  // --- D. BLOCKING & FRONT-ROW DEFENSE (15 ITEMS) ---
  {
    id: 'tac-blk-1',
    category: 'Blocking & Front-Row Defense',
    scenario: ['opponent_run', 'trailing', 'general'],
    title: 'Press and Penetrate Over the Net',
    instruction: 'Stop jumping up and swatting down. Reach OVER the net, lock your wrists, spread your fingers, and press into their court to take away angles.'
  },
  {
    id: 'tac-blk-2',
    category: 'Blocking & Front-Row Defense',
    scenario: ['opponent_run', 'crunch_time'],
    title: 'Pin Blocker: Seal the Line Antenna',
    instruction: 'Pin blocker, do not let their outside hitter beat you down the sideline. Set your block half-a-ball inside the antenna and seal the line completely.'
  },
  {
    id: 'tac-blk-3',
    category: 'Blocking & Front-Row Defense',
    scenario: ['general', 'trailing'],
    title: 'Middle Blocker: Read the Setter, Not the Hitter',
    instruction: 'Middles, watch the setter’s hands and body posture. Do not jump early on deceptive fakes. Wait for the set release, then drive two steps to close.'
  },
  {
    id: 'tac-blk-4',
    category: 'Blocking & Front-Row Defense',
    scenario: ['opponent_run', 'general'],
    title: 'Soft Block: High Hands for Back-Row Touches',
    instruction: 'If you are late closing the block, tilt your hands back toward our ceiling for a soft touch. Deflect the hard hit up into the air for our libero to dig.'
  },
  {
    id: 'tac-blk-5',
    category: 'Blocking & Front-Row Defense',
    scenario: ['opponent_run', 'crunch_time'],
    title: 'Close the Seam with Your Middle Partner',
    instruction: 'No ball should ever split our block! Outside blocker sets the reference mark, middle blocker flies in and glues their shoulder to close the gap.'
  },
  {
    id: 'tac-blk-6',
    category: 'Blocking & Front-Row Defense',
    scenario: ['general'],
    title: 'Discipline on Opponent Setter Dumps',
    instruction: 'Front-row left side, keep an eye on the opponent setter when they are front row. Do not drop off the net until the ball is confirmed set past them.'
  },
  {
    id: 'tac-blk-7',
    category: 'Blocking & Front-Row Defense',
    scenario: ['trailing', 'general'],
    title: 'Land on Balanced Feet — Avoid Net Touch Violations',
    instruction: 'Control your core on landing. Net touch errors on easy blocks kill our momentum. Absorb on both feet and spin immediately to cover.'
  },
  {
    id: 'tac-blk-8',
    category: 'Blocking & Front-Row Defense',
    scenario: ['opponent_run', 'general'],
    title: 'Timing on Slide Hitters: Delay Your Jump',
    instruction: 'Against a slide attacker, don’t jump when they take off. Delay half a second until they cock their arm, then press straight across their hitting shoulder.'
  },
  {
    id: 'tac-blk-9',
    category: 'Blocking & Front-Row Defense',
    scenario: ['leading', 'general'],
    title: 'Channel Hitters to Our Best Diggers',
    instruction: 'Blockers take away the hitter’s favorite power zone. Force them to hit down the line where our libero is waiting in low posture.'
  },
  {
    id: 'tac-blk-10',
    category: 'Blocking & Front-Row Defense',
    scenario: ['crunch_time', 'general'],
    title: 'Eyes Open Across the Net',
    instruction: 'Do not close your eyes when you jump to block! Keep your eyes wide open, track the hitter’s hand swing, and orient your hands to their contact.'
  },
  {
    id: 'tac-blk-11',
    category: 'Blocking & Front-Row Defense',
    scenario: ['general', 'trailing'],
    title: 'Bunch Block Defense Against Fast Middles',
    instruction: 'Pinch both pin blockers 3 feet inward toward the middle. That stops their quick hits while giving your pins an easy shuffle step to close outside.'
  },
  {
    id: 'tac-blk-12',
    category: 'Blocking & Front-Row Defense',
    scenario: ['opponent_run', 'crunch_time'],
    title: 'Commit Block When They are Out of System',
    instruction: 'When their pass is off the 10-foot line, their middle cannot hit. Release the middle immediately and form an early double block on their pin.'
  },
  {
    id: 'tac-blk-13',
    category: 'Blocking & Front-Row Defense',
    scenario: ['leading', 'general'],
    title: 'Hands Straight Up on Back-Row Hitters',
    instruction: 'Against a back-row attack from 10 feet back, do not press deep over the tape. Jump straight up to block the flat drive or roof the downward spike.'
  },
  {
    id: 'tac-blk-14',
    category: 'Blocking & Front-Row Defense',
    scenario: ['trailing', 'general'],
    title: 'Middle Blocker Lateral Crossover Step',
    instruction: 'Use dynamic crossover footwork instead of side-shuffling when closing to the pin. It generates 6 more inches of vertical jump height.'
  },
  {
    id: 'tac-blk-15',
    category: 'Blocking & Front-Row Defense',
    scenario: ['crunch_time', 'general'],
    title: 'Lock Wrists Rigid Through the Hit',
    instruction: 'Soft wrists get tooled! Squeeze your fingers as wide as possible and lock your forearms tight to bounce the spike back into their face.'
  },

  // --- E. FLOOR DEFENSE & COVERAGE DISCIPLINE (15 ITEMS) ---
  {
    id: 'tac-def-1',
    category: 'Floor Defense & Coverage',
    scenario: ['opponent_run', 'trailing', 'general'],
    title: 'Hitter Coverage: 3-Person Umbrella',
    instruction: 'Whenever our hitter swings against a big block, our nearest three players must collapse in a low cup around the hitter to pancake any roof blocks.'
  },
  {
    id: 'tac-def-2',
    category: 'Floor Defense & Coverage',
    scenario: ['opponent_run', 'general'],
    title: 'Defend the Tip in the "Doughnut" (Zone 6)',
    instruction: 'Their hitters are tipping short over our block into the middle of the floor. Middle-back, creep 2 steps forward and read the hitter’s elbow drop.'
  },
  {
    id: 'tac-def-3',
    category: 'Floor Defense & Coverage',
    scenario: ['general', 'crunch_time'],
    title: 'Low Base — Hands Free and Ready',
    instruction: 'Back-row defenders, stop resting your hands on your knees before the swing. Lower your hips below ball level, hands out, ready to dig high and middle.'
  },
  {
    id: 'tac-def-4',
    category: 'Floor Defense & Coverage',
    scenario: ['general', 'trailing'],
    title: 'Funnel Hard Hits to Our Libero',
    instruction: 'Blockers, take away the sharp cross-court angle so their hitter is forced to hit directly into the position where our libero is waiting in Zone 5.'
  },
  {
    id: 'tac-def-5',
    category: 'Floor Defense & Coverage',
    scenario: ['opponent_run', 'general'],
    title: 'Communication on Errant Transition Balls',
    instruction: 'First contact out of system must go high into the center of the court. Any player can set — libero step in and hand-set or bump-set out to the pins.'
  },
  {
    id: 'tac-def-6',
    category: 'Floor Defense & Coverage',
    scenario: ['general', 'crunch_time'],
    title: 'Pancake & Sprawl Discipline',
    instruction: 'Commit to the floor! If a ball is dropping short, extend flat with a slide or pancake hand. Never watch a ball drop without an aggressive dive.'
  },
  {
    id: 'tac-def-7',
    category: 'Floor Defense & Coverage',
    scenario: ['opponent_run', 'general'],
    title: 'Perimeter Defense: Heels Off the End Line',
    instruction: 'Do not get pinned on the back boundary line. Step 2 feet inside the court so you can move forward on tips and step back on high drives.'
  },
  {
    id: 'tac-def-8',
    category: 'Floor Defense & Coverage',
    scenario: ['trailing', 'general'],
    title: 'Off-Blocker Transition to Digging Position',
    instruction: 'If you are front row and the ball is set to the other pin, peel off the net immediately to 10 feet to dig the sharp cross-court roll shot.'
  },
  {
    id: 'tac-def-9',
    category: 'Floor Defense & Coverage',
    scenario: ['general', 'leading'],
    title: 'Free Ball Transition Sprint',
    instruction: 'When the opponent passes a free ball over, call "FREE" instantly. Everyone sprint to your attack approach marks — do not drift.'
  },
  {
    id: 'tac-def-10',
    category: 'Floor Defense & Coverage',
    scenario: ['crunch_time', 'general'],
    title: 'Dig the Ball High and to the Center of Court',
    instruction: 'On hard spikes, do not aim for the setter’s hands. Dig the ball 15 feet high into the middle of the 10-foot line so anyone can step in and set.'
  },
  {
    id: 'tac-def-11',
    category: 'Floor Defense & Coverage',
    scenario: ['general', 'trailing'],
    title: 'Read Hitter’s Shoulder Angle Before the Swing',
    instruction: 'Watch the hitter’s chest. If their shoulders turn toward line, they cannot hit sharp cross. Shift your defensive base 2 steps toward the sideline.'
  },
  {
    id: 'tac-def-12',
    category: 'Floor Defense & Coverage',
    scenario: ['opponent_run', 'general'],
    title: 'Pursuit Rule: Chase Balls Outside the Antenna',
    instruction: 'If a dig flies over the net outside the antenna, sprint under the net on our side, call it, and pass it back outside the antenna. Never give up on a touch!'
  },
  {
    id: 'tac-def-13',
    category: 'Floor Defense & Coverage',
    scenario: ['crunch_time', 'general'],
    title: 'Touch Every Block Deflection',
    instruction: 'When a block touch pops up, scream "TOUCH!" so our back-row knows they have three full touches remaining to run an attack.'
  },
  {
    id: 'tac-def-14',
    category: 'Floor Defense & Coverage',
    scenario: ['general', 'leading'],
    title: 'Setter Defends Zone 1 When Back Row',
    instruction: 'When our setter is back row in Zone 1, dig the ball high and let our libero take second touch so the setter can transition smoothly.'
  },
  {
    id: 'tac-def-15',
    category: 'Floor Defense & Coverage',
    scenario: ['trailing', 'crunch_time'],
    title: 'Sacrifice Your Body for the Team',
    instruction: 'One diving dig lights up our entire sideline. Go all out for every loose ball and let your teammates pick you up off the floor.'
  },

  // --- F. SERVING STRATEGY & TARGETING (15 ITEMS) ---
  {
    id: 'tac-srv-1',
    category: 'Serving Strategy & Targeting',
    scenario: ['serving_errors', 'opponent_run', 'trailing'],
    title: 'Target Their Cold Passer in Zone 5',
    instruction: 'Their outside hitter in Zone 5 has shanked their last two passes. Drive a low, flat float directly at their right hip and force them into error.'
  },
  {
    id: 'tac-srv-2',
    category: 'Serving Strategy & Targeting',
    scenario: ['serving_errors', 'crunch_time'],
    title: 'Aggressive Serve, Zero Unforced Errors',
    instruction: 'Serve aggressively with 3 feet of margin inside the lines. Do not give them a free point out of our timeout with a missed serve into the net tape.'
  },
  {
    id: 'tac-srv-3',
    category: 'Serving Strategy & Targeting',
    scenario: ['leading', 'general'],
    title: 'Short Serve to Zone 2 to Neutralize the Slide',
    instruction: 'Their middle runs a lethal slide attack. Drop a short float into Zone 2 to pull their setter off the net and eliminate the slide option completely.'
  },
  {
    id: 'tac-srv-4',
    category: 'Serving Strategy & Targeting',
    scenario: ['opponent_timeout', 'leading'],
    title: 'Deep Corner Float to Zone 1 Baseline',
    instruction: 'Push their deep corner passer back against the wall. A hard, floating ball driven to the deep corners takes away their middle quick attack.'
  },
  {
    id: 'tac-srv-5',
    category: 'Serving Strategy & Targeting',
    scenario: ['opponent_run', 'general'],
    title: 'Serve the Seam Between Libero and Left Wing',
    instruction: 'Aim right down the dividing line between their libero and outside passer. Make them hesitate and debate who takes the ball.'
  },
  {
    id: 'tac-srv-6',
    category: 'Serving Strategy & Targeting',
    scenario: ['serving_errors', 'general'],
    title: 'Lock In Your Pre-Serve Routine',
    instruction: 'Take 2 bounces, look at your target zone, deep breath, and execute your toss. Consistency in your routine eliminates unforced serving errors.'
  },
  {
    id: 'tac-srv-7',
    category: 'Serving Strategy & Targeting',
    scenario: ['trailing', 'general'],
    title: 'Serve Short to Zone 4 to Trap Their Outside Hitter',
    instruction: 'Drop a short serve right into Zone 4 so their primary outside hitter is forced to pass and cannot get a full 4-step approach to attack.'
  },
  {
    id: 'tac-srv-8',
    category: 'Serving Strategy & Targeting',
    scenario: ['leading', 'general'],
    title: 'Speed Up the Velocity of Float Contact',
    instruction: 'Strike through the middle of the ball with a firm, solid hand. Do not let your wrist snap — a flat punch creates unpredictable knuckleball movement.'
  },
  {
    id: 'tac-srv-9',
    category: 'Serving Strategy & Targeting',
    scenario: ['opponent_timeout', 'crunch_time'],
    title: 'Ice the Opponent Out of Their Timeout',
    instruction: 'Out of their timeout, they expect an easy lollipop serve. Hit a sharp, aggressive float right at their weakest passer’s knees.'
  },
  {
    id: 'tac-srv-10',
    category: 'Serving Strategy & Targeting',
    scenario: ['serving_errors', 'crunch_time'],
    title: 'Aim for Big Targets (Middle Deep)',
    instruction: 'Under high pressure, do not try to skim the sideline paint. Aim 4 feet inside the back baseline — let your ball speed and float do the work.'
  },
  {
    id: 'tac-srv-11',
    category: 'Serving Strategy & Targeting',
    scenario: ['leading', 'general'],
    title: 'Serve Across the Body to Zone 5 from Zone 1',
    instruction: 'Serving sharp diagonal creates an optical illusion against their passers. Drive the ball diagonally across the court.'
  },
  {
    id: 'tac-srv-12',
    category: 'Serving Strategy & Targeting',
    scenario: ['trailing', 'general'],
    title: 'Target the Substitute Player Who Just Entered',
    instruction: 'Their coach just put in a sub who is cold off the bench. Put the next serve directly into their chest on the first rally.'
  },
  {
    id: 'tac-srv-13',
    category: 'Serving Strategy & Targeting',
    scenario: ['serving_errors', 'trailing'],
    title: 'Toss in Front of Your Hitting Shoulder',
    instruction: 'If your toss drifts behind your head, you are forced to hit out of bounds. Toss 18 inches forward so you can step into the ball.'
  },
  {
    id: 'tac-srv-14',
    category: 'Serving Strategy & Targeting',
    scenario: ['general', 'crunch_time'],
    title: 'Keep Serves 1 Foot Above the White Net Tape',
    instruction: 'A float serve that clears the net by 12 inches drops like a stone. Don’t serve high rainbows; punch it flat and low.'
  },
  {
    id: 'tac-srv-15',
    category: 'Serving Strategy & Targeting',
    scenario: ['opponent_run', 'leading'],
    title: 'Break Their Rhythm with Deep Float to Zone 6',
    instruction: 'Push their middle-back defender deep to the wall. That pushes their entire offense 20 feet away from the setter target.'
  },

  // --- G. ROTATIONAL SPECIFICS (R1 TO R6) (12 ITEMS) ---
  {
    id: 'tac-rot-r1',
    category: 'Rotational Tactics (R1)',
    scenario: ['rotation_1', 'general'],
    title: 'Rotation 1: Setter Running from Zone 1',
    instruction: 'Setter is in Zone 1. Passers, hold the ball high to Zone 2/3 so the setter has time to penetrate without sprinting through traffic.'
  },
  {
    id: 'tac-rot-r1-b',
    category: 'Rotational Tactics (R1)',
    scenario: ['rotation_1', 'trailing'],
    title: 'Rotation 1: Outside Hitter Back-Row Isolation',
    instruction: 'In R1 our outside has the whole left side. Stack the receive tightly to the right to clear space for our outside’s transition swing.'
  },
  {
    id: 'tac-rot-r2',
    category: 'Rotational Tactics (R2)',
    scenario: ['rotation_2', 'general'],
    title: 'Rotation 2: Protect the Middle in Serve Receive',
    instruction: 'Setter is in Zone 6. Middle is stacked left — make sure our libero covers the seam so our middle can transition freely to the net.'
  },
  {
    id: 'tac-rot-r2-b',
    category: 'Rotational Tactics (R2)',
    scenario: ['rotation_2', 'trailing'],
    title: 'Rotation 2: Right-Side Attack on Cross Court',
    instruction: 'Our right side is front row in Zone 3/4. Run them off the right antenna to exploit the opponent’s smaller setter block.'
  },
  {
    id: 'tac-rot-r3',
    category: 'Rotational Tactics (R3)',
    scenario: ['rotation_3', 'general'],
    title: 'Rotation 3: Setter in Zone 5 Penetration',
    instruction: 'Setter penetrates from Zone 5 along the left sideline. Passers must pass forward toward Zone 2 and not back toward the setter’s origin.'
  },
  {
    id: 'tac-rot-r3-b',
    category: 'Rotational Tactics (R3)',
    scenario: ['rotation_3', 'crunch_time'],
    title: 'Rotation 3: Middle Transition to Center 1-Ball',
    instruction: 'Middle blocker, stay open to setter penetration. If pass is on target, an instant 1-ball beats their middle block before they can react.'
  },
  {
    id: 'tac-rot-r4',
    category: 'Rotational Tactics (R4)',
    scenario: ['rotation_4', 'general'],
    title: 'Rotation 4: Three Front-Row Attackers Loaded',
    instruction: 'Setter is front row in Zone 4. Run a fast slide or back-one with the middle to create a single block for our right-side attacker.'
  },
  {
    id: 'tac-rot-r4-b',
    category: 'Rotational Tactics (R4)',
    scenario: ['rotation_4', 'leading'],
    title: 'Rotation 4: Outside Hitter Cross-Court Wipe',
    instruction: 'With three attackers front row, the opponent block is spread thin. Outside hitter, take advantage of the 1-on-1 block on the left pin.'
  },
  {
    id: 'tac-rot-r5',
    category: 'Rotational Tactics (R5)',
    scenario: ['rotation_5', 'general'],
    title: 'Rotation 5: Middle Passing Relief',
    instruction: 'Setter in Zone 3. Keep middle blocker tucked behind the 10-foot line so our outside and libero can handle 100% of the serve receive.'
  },
  {
    id: 'tac-rot-r5-b',
    category: 'Rotational Tactics (R5)',
    scenario: ['rotation_5', 'trailing'],
    title: 'Rotation 5: Left-Side Quick Tempo Set',
    instruction: 'Setter release from Zone 3 is short. Push a fast 4-set to the outside pin to beat their right-side block before they can set up.'
  },
  {
    id: 'tac-rot-r6',
    category: 'Rotational Tactics (R6)',
    scenario: ['rotation_6', 'general'],
    title: 'Rotation 6: Setter in Zone 2 Quick Release',
    instruction: 'Setter is front row in Zone 2. Look for the quick 1-on-1 set to middle or setter attack dump if their blockers ignore you.'
  },
  {
    id: 'tac-rot-r6-b',
    category: 'Rotational Tactics (R6)',
    scenario: ['rotation_6', 'crunch_time'],
    title: 'Rotation 6: Deep Cross-Court Defense',
    instruction: 'In R6 our defensive spacing must shift right. Libero in Zone 6 watch the sharp roll shot while Zone 5 digs the hard line.'
  },

  // --- H. CRUNCH TIME & MOMENTUM SHIFTS (10 ITEMS) ---
  {
    id: 'tac-crn-1',
    category: 'Crunch Time & Momentum',
    scenario: ['crunch_time', 'tied_late'],
    title: 'Execute First-Ball Sideout Discipline',
    instruction: 'At 20+ points, matches are won on first-ball sideouts. Perfect pass, smart set, high contact swing with authority. Win this point right now.'
  },
  {
    id: 'tac-crn-2',
    category: 'Crunch Time & Momentum',
    scenario: ['crunch_time', 'trailing'],
    title: 'Play with Courage — Do Not Play Not to Lose',
    instruction: 'Playing timid causes errors. Swing hard with confidence, jump aggressively, and challenge their defenders to make a play.'
  },
  {
    id: 'tac-crn-3',
    category: 'Crunch Time & Momentum',
    scenario: ['opponent_timeout', 'leading'],
    title: 'They Called Timeout to Freeze Us — Break Their Rhythm',
    instruction: 'They called timeout because we have them on their heels. Step back onto the court with fiery focus and bury the next serve.'
  },
  {
    id: 'tac-crn-4',
    category: 'Crunch Time & Momentum',
    scenario: ['opponent_run', 'trailing'],
    title: 'Halt Their Momentum with High Huddle Energy',
    instruction: 'Their run ends right here on this point. High fives after every touch, loud communication on every ball. Bring the court alive!'
  },
  {
    id: 'tac-crn-5',
    category: 'Crunch Time & Momentum',
    scenario: ['crunch_time', 'tied_late'],
    title: 'Serve In Bounds at 23-23 or 24-24',
    instruction: 'Missed serves in deuce give away sets. Hit an aggressive 85% float to the middle of the court and trust our block and transition defense to earn the point.'
  },
  {
    id: 'tac-crn-6',
    category: 'Crunch Time & Momentum',
    scenario: ['crunch_time', 'general'],
    title: 'Clear Call on Free Balls in Crunch Time',
    instruction: 'On high balls over the net late in the set, the nearest player scream "MINE, MINE!" at the top of their lungs. Zero hesitation.'
  },
  {
    id: 'tac-crn-7',
    category: 'Crunch Time & Momentum',
    scenario: ['trailing', 'crunch_time'],
    title: 'Two-Point Swing Focus',
    instruction: 'Don’t worry about winning 4 points. Just earn this sideout and put our server behind the line. That’s our two-point swing.'
  },
  {
    id: 'tac-crn-8',
    category: 'Crunch Time & Momentum',
    scenario: ['leading', 'crunch_time'],
    title: 'Close the Set on Out-of-System Points',
    instruction: 'When both teams are scrambled, the team that keeps their cool and bump-sets clean to the pin wins. Calm eyes, high contact.'
  },
  {
    id: 'tac-crn-9',
    category: 'Crunch Time & Momentum',
    scenario: ['tied_late', 'crunch_time'],
    title: 'Stay Glued on Hitter Coverage',
    instruction: 'On match point, blocks are jumping out of the gym. If our hitter gets stuffed, be on the floor ready to pancake the rebound.'
  },
  {
    id: 'tac-crn-10',
    category: 'Crunch Time & Momentum',
    scenario: ['opponent_run', 'general'],
    title: 'Take the Whistle Full 8 Seconds',
    instruction: 'Server, use the referee’s 8-second serve clock. Slow down the pace of the match, let our team breathe, and serve on our terms.'
  }
];

// =========================================================================
// 🌟 PART 2: MASSIVE CATALOG OF SITUATIONAL MOTIVATIONAL AFFIRMATIONS (108 ITEMS)
// =========================================================================

export const MOTIVATIONAL_AFFIRMATIONS_CATALOG = [
  // --- A. BATTLING BACK FROM A DEFICIT / TRAILING (25 ITEMS) ---
  {
    id: 'mot-def-1',
    scenario: ['trailing', 'opponent_run'],
    text: "Take a deep breath and look around. This match is not won in the first 10 points. We built this squad for moments exactly like this. One pass, one set, one kill — let's go!"
  },
  {
    id: 'mot-def-2',
    scenario: ['trailing', 'opponent_run'],
    text: "Reset to 0-0 in your minds right now. They had their run, now it’s our turn. Play free, trust each other, and leave everything on this hardwood."
  },
  {
    id: 'mot-def-3',
    scenario: ['trailing'],
    text: "They cannot score 3 points at once. We only need to win ONE ball to get the serve back. Lock in on this single next rally."
  },
  {
    id: 'mot-def-4',
    scenario: ['trailing', 'opponent_run'],
    text: "Composure is our superpower. When things get loud and chaotic, that is when we get calm and connected. Look each other in the eye and let's work."
  },
  {
    id: 'mot-def-5',
    scenario: ['trailing'],
    text: "Adversity reveals what this team is truly made of. Dig deep, stand tall, and fight for every single inch of this court together!"
  },
  {
    id: 'mot-def-6',
    scenario: ['trailing', 'opponent_run'],
    text: "Forget what just happened. The scoreboard doesn't define the next 60 seconds — your energy, your heart, and your communication do."
  },
  {
    id: 'mot-def-7',
    scenario: ['trailing'],
    text: "You have trained for hundreds of hours for this very moment. Trust your reps, trust your instincts, and play with fearless joy."
  },
  {
    id: 'mot-def-8',
    scenario: ['trailing', 'opponent_run'],
    text: "Every comeback in sports starts with a single gritty sideout. Let’s get our sideout, bring the noise, and turn the tide right now."
  },
  {
    id: 'mot-def-9',
    scenario: ['trailing'],
    text: "No dropped heads on this court! Stand proud, shoulders back, eyes up. We are right in this fight and we are taking it to them."
  },
  {
    id: 'mot-def-10',
    scenario: ['trailing', 'opponent_run'],
    text: "Believe in the player standing next to you. Pick each other up, celebrate every hustle touch, and watch how quickly momentum swings back to us."
  },
  {
    id: 'mot-def-11',
    scenario: ['trailing'],
    text: "A 4-point deficit in volleyball is nothing when you play with relentless tempo. Stay aggressive, swing with intent, and believe!"
  },
  {
    id: 'mot-def-12',
    scenario: ['trailing'],
    text: "We don't need magic right now; we just need our standard. Clean platform, solid sets, smart swings. Let’s play OUR volleyball."
  },
  {
    id: 'mot-def-13',
    scenario: ['trailing', 'opponent_run'],
    text: "Breathe in strength, breathe out tension. The best response to an opponent run is quiet, confident, ruthless execution."
  },
  {
    id: 'mot-def-14',
    scenario: ['trailing'],
    text: "Champions love the chase! When our backs are against the wall, that's when we play our most inspiring, relentless volleyball."
  },
  {
    id: 'mot-def-15',
    scenario: ['trailing', 'opponent_run'],
    text: "Give yourself permission to swing with confidence. Mistakes don't matter — your courage on the next swing is all that counts."
  },
  {
    id: 'mot-def-16',
    scenario: ['trailing'],
    text: "We are tougher than this moment. Grit your teeth, lock your platform, and let’s show everyone in this gym our backbone."
  },
  {
    id: 'mot-def-17',
    scenario: ['trailing', 'opponent_run'],
    text: "One pass changes the entire story of this set. Who wants to make that play? All of us together on three!"
  },
  {
    id: 'mot-def-18',
    scenario: ['trailing'],
    text: "Energy is a choice, not an accident. Look at your teammate, give a high five, and bring electric noise back onto the court."
  },
  {
    id: 'mot-def-19',
    scenario: ['trailing', 'opponent_run'],
    text: "Pressure breaks pipes, but it also creates diamonds. Let’s shine under this heat and turn this game around right now."
  },
  {
    id: 'mot-def-20',
    scenario: ['trailing'],
    text: "Refuse to be out-worked on this floor. If a ball is in the air, six bodies are moving to cover. That's our team identity!"
  },
  {
    id: 'mot-def-21',
    scenario: ['trailing', 'opponent_run'],
    text: "The score is temporary, but our pride and heart are forever. Step onto that line and let’s play with all our passion!"
  },
  {
    id: 'mot-def-22',
    scenario: ['trailing'],
    text: "Shake off the tension in your shoulders. Smile at each other. Volleyball is fun when you play with complete freedom!"
  },
  {
    id: 'mot-def-23',
    scenario: ['trailing', 'opponent_run'],
    text: "We have come back from bigger deficits than this in practice every single week. We know the formula — execute it!"
  },
  {
    id: 'mot-def-24',
    scenario: ['trailing'],
    text: "Every great team gets tested. This is our test right here. Pass it together with unity and fight!"
  },
  {
    id: 'mot-def-25',
    scenario: ['trailing', 'opponent_run'],
    text: "Eyes locked, voices loud, hearts full. Let’s take back the court and show them who we are!"
  },

  // --- B. CRUNCH TIME & DOGFIGHT (TIED LATE / 20+ POINTS) (25 ITEMS) ---
  {
    id: 'mot-crn-1',
    scenario: ['crunch_time', 'tied_late'],
    text: "This is where champions are made! 20-all is our playground. Own this moment, trust your swings, and attack with supreme confidence."
  },
  {
    id: 'mot-crn-2',
    scenario: ['crunch_time', 'tied_late'],
    text: "Play to WIN this game, do not play to not lose! The bold team that takes aggressive swings and covers their hitters will take this set."
  },
  {
    id: 'mot-crn-3',
    scenario: ['crunch_time'],
    text: "Feel your heartbeat, take one deep collective breath together. Inhale confidence, exhale doubt. We want the ball in our hands right now."
  },
  {
    id: 'mot-crn-4',
    scenario: ['crunch_time', 'tied_late'],
    text: "Look at each other. There is no other team I would rather be in this battle with. Let’s execute our game plan and finish this together!"
  },
  {
    id: 'mot-crn-5',
    scenario: ['crunch_time'],
    text: "Courage over comfort! Do not tip out of fear — swing high, swing hard, and let our defense back you up on every single ball."
  },
  {
    id: 'mot-crn-6',
    scenario: ['crunch_time', 'tied_late'],
    text: "Two points. That is all that separates us from taking this set. Stay disciplined, communicate early, and fight for every touch."
  },
  {
    id: 'mot-crn-7',
    scenario: ['crunch_time'],
    text: "Pressure is a privilege. It means what we are doing matters, and you earned the right to be in this dogfight. Now go take it!"
  },
  {
    id: 'mot-crn-8',
    scenario: ['crunch_time', 'tied_late'],
    text: "Six players moving as one heart on this floor. When the ball is in the air, nobody hesitates. Call it loud, commit 100%, and win the point."
  },
  {
    id: 'mot-crn-9',
    scenario: ['crunch_time'],
    text: "Stay in the present second. Don't think about the score or the match — just this one incoming serve. Nail the pass and bury the kill."
  },
  {
    id: 'mot-crn-10',
    scenario: ['crunch_time', 'tied_late'],
    text: "Refuse to let any ball hit the floor without a body on the ground! Out-hustle them, out-communicate them, and seal the win."
  },
  {
    id: 'mot-crn-11',
    scenario: ['crunch_time'],
    text: "Heart and composure! When the gym is roaring, our communication gets sharper and clearer. Call the ball early and own it."
  },
  {
    id: 'mot-crn-12',
    scenario: ['crunch_time', 'tied_late'],
    text: "You were made for big moments. Step onto that line with your head high and attack this finish with joy and swagger."
  },
  {
    id: 'mot-crn-13',
    scenario: ['crunch_time'],
    text: "Trust your hands, trust your feet. The fundamentals you've practiced thousands of times will carry us across the finish line."
  },
  {
    id: 'mot-crn-14',
    scenario: ['crunch_time', 'tied_late'],
    text: "This set belongs to whoever wants it more on defense. Scramble, touch every ball, and put all the pressure on their shoulders."
  },
  {
    id: 'mot-crn-15',
    scenario: ['crunch_time'],
    text: "Finish what we started! No regrets, no holding back. Play free, play fast, play together!"
  },
  {
    id: 'mot-crn-16',
    scenario: ['crunch_time', 'tied_late'],
    text: "Look into the eyes of your sister on court. Know that she has your back on every single cover ball. Go be great!"
  },
  {
    id: 'mot-crn-17',
    scenario: ['crunch_time'],
    text: "Big players make big plays when the lights are bright. Be that player on this next point!"
  },
  {
    id: 'mot-crn-18',
    scenario: ['crunch_time', 'tied_late'],
    text: "Deuce volleyball is pure heart. Forget technique for two seconds and just will that ball onto their floor!"
  },
  {
    id: 'mot-crn-19',
    scenario: ['crunch_time'],
    text: "We relish close games. This is our territory. Stand tall and let’s close this out!"
  },
  {
    id: 'mot-crn-20',
    scenario: ['crunch_time', 'tied_late'],
    text: "Zero hesitation. If you swing, swing 100%. We believe in you!"
  },
  {
    id: 'mot-crn-21',
    scenario: ['crunch_time'],
    text: "The noise in the gym doesn't matter. The only thing that matters is the ball in front of you. Win it!"
  },
  {
    id: 'mot-crn-22',
    scenario: ['crunch_time', 'tied_late'],
    text: "Earn this celebration! Two great touches and a spike. Let’s do it!"
  },
  {
    id: 'mot-crn-23',
    scenario: ['crunch_time'],
    text: "Lock in! Everything we've worked for all season comes down to the courage of this finish."
  },
  {
    id: 'mot-crn-24',
    scenario: ['crunch_time', 'tied_late'],
    text: "Breathe together. Six heartbeats as one. Take the court with pride!"
  },
  {
    id: 'mot-crn-25',
    scenario: ['crunch_time'],
    text: "We are taking this set right now. Go finish it!"
  },

  // --- C. PROTECTING & EXTENDING A LEAD (20 ITEMS) ---
  {
    id: 'mot-lead-1',
    scenario: ['leading'],
    text: "Great energy out there! But remember: the most dangerous lead is the one you take for granted. Foot on the gas, keep the pressure on them!"
  },
  {
    id: 'mot-lead-2',
    scenario: ['leading'],
    text: "They are searching for answers because our tempo is suffocating them. Don't relax for a single second. Stay hungry, stay ruthless!"
  },
  {
    id: 'mot-lead-3',
    scenario: ['leading'],
    text: "Respect every single point like it’s set point. Play with crisp precision, celebrate together, and extend this lead point by point."
  },
  {
    id: 'mot-lead-4',
    scenario: ['leading'],
    text: "This is our court and our tempo. Maintain your defensive intensity and make them earn every single point against our wall."
  },
  {
    id: 'mot-lead-5',
    scenario: ['leading'],
    text: "Champions know how to close doors. Don't let them sneak back into this set with easy free balls. Keep attacking and stay sharp!"
  },
  {
    id: 'mot-lead-6',
    scenario: ['leading'],
    text: "Loving the chemistry and communication! Keep feeding the hot hands, stay low on defense, and finish this set with pride."
  },
  {
    id: 'mot-lead-7',
    scenario: ['leading'],
    text: "Good teams get complacent when they lead; great teams get hungrier! Let’s show them what great looks like."
  },
  {
    id: 'mot-lead-8',
    scenario: ['leading'],
    text: "Relentless focus right now. Every serve aggressive, every pass to target. Do not let up an inch until the whistle blows."
  },
  {
    id: 'mot-lead-9',
    scenario: ['leading'],
    text: "Keep the bench loud and the court electric! When we support each other like this, we are unbeatable."
  },
  {
    id: 'mot-lead-10',
    scenario: ['leading'],
    text: "Protect our house! Every dig, every block is a message. Let’s close this set with authority."
  },
  {
    id: 'mot-lead-11',
    scenario: ['leading'],
    text: "Do not let them catch their breath. Keep the ball moving fast, keep the pressure on their passers."
  },
  {
    id: 'mot-lead-12',
    scenario: ['leading'],
    text: "You worked hard to earn this lead. Now honor your hard work by finishing with ruthless precision."
  },
  {
    id: 'mot-lead-13',
    scenario: ['leading'],
    text: "Every rally is an opportunity to set a championship standard. Play to our standard, not the scoreboard."
  },
  {
    id: 'mot-lead-14',
    scenario: ['leading'],
    text: "Stay humble, stay aggressive. Keep your eyes on the next point and nothing else."
  },
  {
    id: 'mot-lead-15',
    scenario: ['leading'],
    text: "Suffocate their hope with clean, error-free volleyball. Make them beat our wall!"
  },
  {
    id: 'mot-lead-16',
    scenario: ['leading'],
    text: "Love the energy, love the smiles! Keep the positive vibes flowing all the way to 25."
  },
  {
    id: 'mot-lead-17',
    scenario: ['leading'],
    text: "Keep diving on defense! When our hitters see our defense grinding, they swing with twice the power."
  },
  {
    id: 'mot-lead-18',
    scenario: ['leading'],
    text: "No free points! Make them earn everything on this court."
  },
  {
    id: 'mot-lead-19',
    scenario: ['leading'],
    text: "Great squads know how to put opponents away. Put them away right now."
  },
  {
    id: 'mot-lead-20',
    scenario: ['leading'],
    text: "High-level execution from start to finish. Keep the standard sky high!"
  },

  // --- D. AFTER AN OPPONENT TIMEOUT (THEY CALLED IT TO FREEZE US) (18 ITEMS) ---
  {
    id: 'mot-oppto-1',
    scenario: ['opponent_timeout'],
    text: "They called timeout because they are feeling our heat! They are trying to ice our server. Stay warm, keep your energy high, and come out blazing!"
  },
  {
    id: 'mot-oppto-2',
    scenario: ['opponent_timeout'],
    text: "They need a break, but we don’t! Keep our huddle electric. Server, take your routine, bounce the ball, and deliver another dart."
  },
  {
    id: 'mot-oppto-3',
    scenario: ['opponent_timeout'],
    text: "They are on their heels. First ball out of this timeout, expect them to sell out on their outside hitter. Read their setter and shut them down."
  },
  {
    id: 'mot-oppto-4',
    scenario: ['opponent_timeout'],
    text: "Ride our wave! Do not let their timeout slow down our momentum. High energy step back onto the floor and strike first!"
  },
  {
    id: 'mot-oppto-5',
    scenario: ['opponent_timeout'],
    text: "Their coach had to burn a timeout to stop our rhythm. Keep your foot on the accelerator. We dictate everything on this court."
  },
  {
    id: 'mot-oppto-6',
    scenario: ['opponent_timeout'],
    text: "Stay loose, stay locked in. They are talking about how to stop us — we just need to keep playing our high-speed game."
  },
  {
    id: 'mot-oppto-7',
    scenario: ['opponent_timeout'],
    text: "Server, step back, breath, pick your spot. We have total faith in your serve. Let’s keep this run alive!"
  },
  {
    id: 'mot-oppto-8',
    scenario: ['opponent_timeout'],
    text: "They are desperate for a sideout. Expect their best hitter to get the set. Line up the double block and bury it!"
  },
  {
    id: 'mot-oppto-9',
    scenario: ['opponent_timeout'],
    text: "Don't let them cool us off! Hop on the spot, high five, keep your legs warm. We are in charge here."
  },
  {
    id: 'mot-oppto-10',
    scenario: ['opponent_timeout'],
    text: "They called timeout because we are playing beautiful volleyball. Step back out there and keep the show rolling!"
  },
  {
    id: 'mot-oppto-11',
    scenario: ['opponent_timeout'],
    text: "Maintain our rhythm! Server, trust your mechanics and let it rip."
  },
  {
    id: 'mot-oppto-12',
    scenario: ['opponent_timeout'],
    text: "Our huddle is full of fire! Walk back onto that court with total authority."
  },
  {
    id: 'mot-oppto-13',
    scenario: ['opponent_timeout'],
    text: "They are adjusting to us — that means we are winning the tactical battle. Keep applying the pressure!"
  },
  {
    id: 'mot-oppto-14',
    scenario: ['opponent_timeout'],
    text: "First touch out of their timeout sets the tone. Make it a statement touch!"
  },
  {
    id: 'mot-oppto-15',
    scenario: ['opponent_timeout'],
    text: "Keep our communication loud so they know we never stopped working. Let's go!"
  },
  {
    id: 'mot-oppto-16',
    scenario: ['opponent_timeout'],
    text: "They need magic; we just need our next serve. Deliver it!"
  },
  {
    id: 'mot-oppto-17',
    scenario: ['opponent_timeout'],
    text: "Love where our heads are at! Step onto the court ready to crush their first ball."
  },
  {
    id: 'mot-oppto-18',
    scenario: ['opponent_timeout'],
    text: "Stay electric! Our momentum doesn't stop for 60 seconds of timeout."
  },

  // --- E. SQUAD UNITY, HEART & JOY (20 ITEMS) ---
  {
    id: 'mot-team-1',
    scenario: ['general'],
    text: "Remember why you love this game! Play with freedom, play with joy, and play for the sister standing next to you in your jersey."
  },
  {
    id: 'mot-team-2',
    scenario: ['general'],
    text: "Volleyball is 80% heart and 20% mechanics. When we bring loud joy and relentless hustle, nobody in this gym can stay with us."
  },
  {
    id: 'mot-team-3',
    scenario: ['general'],
    text: "Look around this huddle. We are a family on and off this court. Support each other through every touch and let's have some fun!"
  },
  {
    id: 'mot-team-4',
    scenario: ['general'],
    text: "Body language speaks louder than words. Heads high, proud posture, eye contact, loud voices. Bring the thunder onto this court!"
  },
  {
    id: 'mot-team-5',
    scenario: ['general'],
    text: "Every ball that goes over the net is an opportunity to show our grit. No excuses, no regrets, just 100% pure effort on every play!"
  },
  {
    id: 'mot-team-6',
    scenario: ['general'],
    text: "Trust the sisterhood on this court. We win together, we fight together, and we never give up on a single play."
  },
  {
    id: 'mot-team-7',
    scenario: ['general'],
    text: "Bring the joy! When you smile and play free, your swings are faster and your reaction time is quicker. Have fun out there!"
  },
  {
    id: 'mot-team-8',
    scenario: ['general'],
    text: "Leave no doubt. When this match is over, we will look in the mirror knowing we gave every drop of sweat to each other."
  },
  {
    id: 'mot-team-9',
    scenario: ['general'],
    text: "Six players, one mission. Play for the name on the front of your jersey and the teammate beside you."
  },
  {
    id: 'mot-team-10',
    scenario: ['general'],
    text: "Effort is 100% within your control. Give everything you have right now!"
  },
  {
    id: 'mot-team-11',
    scenario: ['general'],
    text: "Celebrate your teammates' success louder than your own! That is the secret to an unstoppable team."
  },
  {
    id: 'mot-team-12',
    scenario: ['general'],
    text: "No fear of mistakes on this team. We swing hard, we dive flat, and we pick each other up."
  },
  {
    id: 'mot-team-13',
    scenario: ['general'],
    text: "Be the teammate that brings energy when someone else needs a boost. That’s leadership."
  },
  {
    id: 'mot-team-14',
    scenario: ['general'],
    text: "Play this game with gratitude. We get to compete on this floor together today. Make it memorable!"
  },
  {
    id: 'mot-team-15',
    scenario: ['general'],
    text: "Pure heart and relentless hustle beat pure talent every single time. Out-hustle them!"
  },
  {
    id: 'mot-team-16',
    scenario: ['general'],
    text: "Stay connected! In volleyball, connection is stronger than any individual star."
  },
  {
    id: 'mot-team-17',
    scenario: ['general'],
    text: "Look at our bench — they are screaming for you! Give them something to cheer about."
  },
  {
    id: 'mot-team-18',
    scenario: ['general'],
    text: "Play bold, play beautiful, play together. We love this team!"
  },
  {
    id: 'mot-team-19',
    scenario: ['general'],
    text: "Leave everything on the court. There is no tomorrow for this set — win it today!"
  },
  {
    id: 'mot-team-20',
    scenario: ['general'],
    text: "Together on three: ONE, TWO, THREE, SQUAD!"
  }
];

// =========================================================================
// 🧠 PART 3: INTELLIGENT MATCH EVALUATION & TIMEOUT BRIEF GENERATOR
// =========================================================================

/**
 * Generates an intelligent, context-aware timeout briefing for coaches.
 * Analyzes score gap, momentum runs, recent errors, rotation, and timeout caller.
 * 
 * @param {Object} params
 * @param {Object} params.matchStats - Current live match statistics
 * @param {number} params.rotation - Current rotation (1-6)
 * @param {string} params.phase - 'serve' or 'receive'
 * @param {string} params.timeoutTeam - 'us' or 'opponent'
 * @param {Array} params.roster - Full player roster
 * @param {Object} params.courtLineup - Current 6 court player IDs
 * @returns {Object} Structured timeout brief with primary/secondary advice, affirmation, and pools
 */
export function generateTimeoutBrief({
  matchStats = {},
  rotation = 1,
  phase = 'receive',
  timeoutTeam = 'us',
  roster = [],
  courtLineup = {}
}) {
  const ourScore = matchStats.ourScore || 0;
  const opponentScore = matchStats.opponentScore || 0;
  const pointDiff = ourScore - opponentScore;
  const isLeading = pointDiff >= 2;
  const isTrailing = pointDiff <= -2;
  const isTied = Math.abs(pointDiff) <= 1;
  const isCrunchTime = ourScore >= 20 || opponentScore >= 20;
  const isTiedLate = isCrunchTime && Math.abs(pointDiff) <= 2;

  const points = matchStats.pointHistory || [];
  const currentSetPoints = points.filter(p => p.setNumber === (matchStats.setNumber || 1));

  // 1. Analyze scoring runs in last 5 points
  let opponentRun = 0;
  let ourRun = 0;
  for (let i = currentSetPoints.length - 1; i >= 0; i--) {
    if (currentSetPoints[i].pointWonBy === 'opponent') {
      if (ourRun > 0) break;
      opponentRun++;
    } else if (currentSetPoints[i].pointWonBy === 'us') {
      if (opponentRun > 0) break;
      ourRun++;
    }
  }

  // 2. Analyze primary error category in last 6 points
  const recentErrors = currentSetPoints
    .filter(p => p.pointWonBy === 'opponent' && p.errorTypeId)
    .slice(-6);

  let receiveErrors = 0;
  let attackErrors = 0;
  let serveErrors = 0;
  let netErrors = 0;

  recentErrors.forEach(err => {
    const id = (err.errorTypeId || '').toLowerCase();
    const cat = (err.errorCategory || '').toLowerCase();
    if (id.includes('receive') || id.includes('pass') || cat.includes('receive') || cat.includes('pass')) {
      receiveErrors++;
    } else if (id.includes('attack') || id.includes('hit') || cat.includes('attack')) {
      attackErrors++;
    } else if (id.includes('serve') || cat.includes('serve')) {
      serveErrors++;
    } else if (id.includes('net') || cat.includes('net')) {
      netErrors++;
    }
  });

  // 3. Filter Tactical Advice based on real-time triggers
  const tacticalPool = TACTICAL_ADVICE_CATALOG.filter(item => {
    // Rotation-specific check
    if (item.id.includes(`rot-r${rotation}`)) return true;

    // Error-triggered checks
    if (receiveErrors >= 2 && item.scenario.includes('receive_errors')) return true;
    if (attackErrors >= 2 && item.scenario.includes('attack_errors')) return true;
    if (serveErrors >= 1 && item.scenario.includes('serving_errors')) return true;

    // Situation checks
    if (timeoutTeam === 'opponent' && item.scenario.includes('opponent_timeout')) return true;
    if (opponentRun >= 2 && item.scenario.includes('opponent_run')) return true;
    if (isCrunchTime && item.scenario.includes('crunch_time')) return true;
    if (isTiedLate && item.scenario.includes('tied_late')) return true;
    if (isTrailing && item.scenario.includes('trailing')) return true;
    if (isLeading && item.scenario.includes('leading')) return true;

    return item.scenario.includes('general');
  });

  // 4. Filter Motivational Affirmations based on emotional state
  const motivationalPool = MOTIVATIONAL_AFFIRMATIONS_CATALOG.filter(item => {
    if (timeoutTeam === 'opponent' && item.scenario.includes('opponent_timeout')) return true;
    if (opponentRun >= 2 && item.scenario.includes('opponent_run')) return true;
    if (isTiedLate && item.scenario.includes('tied_late')) return true;
    if (isCrunchTime && item.scenario.includes('crunch_time')) return true;
    if (isTrailing && item.scenario.includes('trailing')) return true;
    if (isLeading && item.scenario.includes('leading')) return true;
    return item.scenario.includes('general');
  });

  // Pick primary and secondary tactical advice
  // Ensure rotation-specific advice is highlighted if available
  const rotationSpecific = tacticalPool.find(item => item.id.includes(`rot-r${rotation}`));
  const errorSpecific = tacticalPool.find(item => 
    (receiveErrors >= 2 && item.scenario.includes('receive_errors')) ||
    (attackErrors >= 2 && item.scenario.includes('attack_errors')) ||
    (opponentRun >= 2 && item.scenario.includes('opponent_run'))
  );

  let primaryTactical = errorSpecific || rotationSpecific || tacticalPool[0] || TACTICAL_ADVICE_CATALOG[0];
  let secondaryTactical = rotationSpecific && rotationSpecific.id !== primaryTactical.id
    ? rotationSpecific
    : tacticalPool.find(item => item.id !== primaryTactical.id) || TACTICAL_ADVICE_CATALOG[1];

  // Pick inspirational affirmation
  const primaryMotivation = motivationalPool[Math.floor(Math.random() * motivationalPool.length)] || MOTIVATIONAL_AFFIRMATIONS_CATALOG[0];

  // Game situation badge label
  let situationBadge = 'Standard Timeout (0-0)';
  if (opponentRun >= 3) {
    situationBadge = `⚠️ Opponent on ${opponentRun}-0 Run • Sideout Needed`;
  } else if (ourRun >= 3 && timeoutTeam === 'opponent') {
    situationBadge = `🔥 We are on a ${ourRun}-0 Run • Opponent Called Timeout`;
  } else if (isTiedLate) {
    situationBadge = `⚡ Tied ${ourScore}-${opponentScore} • Late-Set Crunch Time`;
  } else if (isTrailing) {
    situationBadge = `🛡️ Trailing by ${Math.abs(pointDiff)} (${ourScore}-${opponentScore}) • Reset & Rally`;
  } else if (isLeading) {
    situationBadge = `🏆 Leading by ${pointDiff} (${ourScore}-${opponentScore}) • Maintain Pressure`;
  }

  return {
    situationBadge,
    opponentRun,
    ourRun,
    pointDiff,
    isCrunchTime,
    rotation,
    phase,
    timeoutTeam,
    primaryTactical,
    secondaryTactical,
    primaryMotivation,
    tacticalPool,
    motivationalPool,
    totalTacticalInCatalog: TACTICAL_ADVICE_CATALOG.length,
    totalMotivationalInCatalog: MOTIVATIONAL_AFFIRMATIONS_CATALOG.length
  };
}

// =========================================================================
// 🔊 PART 4: WEB SPEECH SYNTHESIS ("SPEAK TO HUDDLE")
// =========================================================================

/**
 * Reads the timeout focus points aloud to the coaching huddle using Web Speech Synthesis.
 * 
 * @param {string} text - Content to speak
 * @param {Function} onEnd - Optional callback on completion
 */
export function speakTimeoutAdvice(text, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('SpeechSynthesis is not supported on this device.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  utterance.volume = 1.0;

  // Try to pick a natural energetic voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Aaron') || v.name.includes('Google') || v.name.includes('Natural')));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => { if (onEnd) onEnd(); };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeakingAdvice() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
