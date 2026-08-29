/**
 * Volleyball Match Stats & Error Analysis Service
 * Standardized volleyball error taxonomy following USAV, NFHS, and FIVB definitions.
 */

export const ERROR_CATEGORIES = {
  SERVICE: 'Service Errors',
  ATTACK: 'Attack Errors',
  PASS_RECEIVE: 'Passing & Receive Errors',
  HANDLING: 'Ball Handling & Setting Violations',
  NET_COURT: 'Net & Court Violations',
  ROTATION: 'Rotation & Positional Faults',
  OPPONENT_EARNED: 'Opponent Earned Point'
};

export const VOLLEYBALL_ERRORS = [
  // Service Errors
  {
    id: 'missed_serve_net',
    label: 'Missed Serve (Into Net)',
    category: ERROR_CATEGORIES.SERVICE,
    icon: '🏐',
    shortLabel: 'Serve in Net',
    description: 'Served ball contacted net and failed to pass into opponent court (Rule 12.6.2.1).'
  },
  {
    id: 'missed_serve_out',
    label: 'Missed Serve (Out of Bounds)',
    category: ERROR_CATEGORIES.SERVICE,
    icon: '🏐',
    shortLabel: 'Serve Out',
    description: 'Served ball landed completely outside boundary lines (Rule 12.6.2.2).'
  },
  {
    id: 'service_foot_fault',
    label: 'Service Foot Fault',
    category: ERROR_CATEGORIES.SERVICE,
    icon: '🦶',
    shortLabel: 'Foot Fault',
    description: 'Server touched endline or court before contacting the ball (Rule 12.4.3).'
  },

  // Attack Errors
  {
    id: 'attack_net',
    label: 'Attack (Into Net)',
    category: ERROR_CATEGORIES.ATTACK,
    icon: '💥',
    shortLabel: 'Hit in Net',
    description: 'Spike or attack hit directly into the net and died (Rule 13.3.1).'
  },
  {
    id: 'attack_out',
    label: 'Attack (Out of Bounds)',
    category: ERROR_CATEGORIES.ATTACK,
    icon: '💥',
    shortLabel: 'Hit Out',
    description: 'Spike or tip landed out of bounds without contacting an opponent block (Rule 13.3.2).'
  },
  {
    id: 'attack_blocked',
    label: 'Attack (Blocked / Roofed)',
    category: ERROR_CATEGORIES.ATTACK,
    icon: '🛑',
    shortLabel: 'Hit Blocked',
    description: 'Spike was rejected by opponent block and landed on our side (Rule 14.1.1).'
  },
  {
    id: 'attack_backrow',
    label: 'Back-Row Attack Violation',
    category: ERROR_CATEGORIES.ATTACK,
    icon: '⚠️',
    shortLabel: 'Back-Row Hit',
    description: 'Back-row player took off on or in front of 10ft attack line while ball was above net (Rule 13.2.2).'
  },

  // Passing & Receive Errors
  {
    id: 'receive_ace_against',
    label: 'Serve Receive Error (Ace Against)',
    category: ERROR_CATEGORIES.PASS_RECEIVE,
    icon: '🎯',
    shortLabel: 'Pass Shanked / Ace',
    description: 'Serve contacted passer and could not be kept in play, resulting in opponent ace (Rule 9.2).'
  },
  {
    id: 'overpass_kill',
    label: 'Overpass (Gave Up Easy Kill)',
    category: ERROR_CATEGORIES.PASS_RECEIVE,
    icon: '📈',
    shortLabel: 'Overpass',
    description: 'Shanked pass traveled over net allowing immediate opponent attack kill.'
  },
  {
    id: 'dig_error',
    label: 'Dig / Free Ball Error',
    category: ERROR_CATEGORIES.PASS_RECEIVE,
    icon: '🛡️',
    shortLabel: 'Dig Error',
    description: 'Defensive dig or free ball pass could not be retrieved by teammates.'
  },

  // Ball Handling & Setting Violations
  {
    id: 'double_contact',
    label: 'Double Contact (Illegal Multiple Hits)',
    category: ERROR_CATEGORIES.HANDLING,
    icon: '🖐️',
    shortLabel: 'Double Contact',
    description: 'Player contacted ball twice consecutively or hands did not touch ball simultaneously (Rule 9.3.4).'
  },
  {
    id: 'lift_carry',
    label: 'Lift / Held Ball (Catch & Throw)',
    category: ERROR_CATEGORIES.HANDLING,
    icon: '🤲',
    shortLabel: 'Lift / Carry',
    description: 'Ball came to rest momentarily in player hands or was scooped/thrown (Rule 9.3.3).'
  },
  {
    id: 'four_hits',
    label: 'Four Hits Violation',
    category: ERROR_CATEGORIES.HANDLING,
    icon: '4️⃣',
    shortLabel: '4 Hits',
    description: 'Team contacted the ball four times before sending it over the net (Rule 9.1).'
  },

  // Net & Court Violations
  {
    id: 'net_touch',
    label: 'Net Touch Violation',
    category: ERROR_CATEGORIES.NET_COURT,
    icon: '🚫',
    shortLabel: 'Net Touch',
    description: 'Player contacted net mesh, tape, or antenna during play (Rule 11.3).'
  },
  {
    id: 'centerline_fault',
    label: 'Centerline Fault',
    category: ERROR_CATEGORIES.NET_COURT,
    icon: '👟',
    shortLabel: 'Centerline',
    description: 'Player foot completely crossed centerline into opponent court interfering with play (Rule 11.2.2).'
  },
  {
    id: 'reaching_over',
    label: 'Reaching Over Net Fault',
    category: ERROR_CATEGORIES.NET_COURT,
    icon: '✋',
    shortLabel: 'Over Net',
    description: 'Player contacted ball in opponent space before attack completion (Rule 11.1.2).'
  },

  // Rotational Violations
  {
    id: 'rotation_overlap',
    label: 'Rotation Overlap / Positional Fault',
    category: ERROR_CATEGORIES.ROTATION,
    icon: '🔄',
    shortLabel: 'Overlap Fault',
    description: 'Players were out of rotational position relative to adjacent teammates at service contact (Rule 7.5).'
  },
  {
    id: 'wrong_server',
    label: 'Wrong Server Fault',
    category: ERROR_CATEGORIES.ROTATION,
    icon: '⚠️',
    shortLabel: 'Wrong Server',
    description: 'Incorrect player in rotation served the ball (Rule 7.7).'
  },

  // Opponent Earned Plays
  {
    id: 'opp_kill',
    label: 'Opponent Spike Kill',
    category: ERROR_CATEGORIES.OPPONENT_EARNED,
    icon: '⚡',
    shortLabel: 'Opponent Kill',
    description: 'Opponent hitter struck an unstoppable kill point.'
  },
  {
    id: 'opp_ace',
    label: 'Opponent Clean Ace',
    category: ERROR_CATEGORIES.OPPONENT_EARNED,
    icon: '🎯',
    shortLabel: 'Opponent Ace',
    description: 'Opponent serve landed untouched on court for an ace.'
  },
  {
    id: 'opp_block',
    label: 'Opponent Block Kill',
    category: ERROR_CATEGORIES.OPPONENT_EARNED,
    icon: '🧱',
    shortLabel: 'Opponent Block',
    description: 'Opponent blocker executed a point-ending block.'
  }
];

export const POINT_EARNED_TYPES = [
  { id: 'kill', label: 'Attack Kill (Spike Winner)', icon: '💥', shortLabel: 'Kill' },
  { id: 'ace', label: 'Service Ace (Direct Winner)', icon: '🏐', shortLabel: 'Ace' },
  { id: 'block', label: 'Block Kill (Roof Winner)', icon: '🧱', shortLabel: 'Block' },
  { id: 'opp_error', label: 'Opponent Error (Out / Net / Fault)', icon: '❌', shortLabel: 'Opp Error' }
];

/**
 * Computes Error Rankings from point history, sorted strictly from MOST COMMON to LEAST COMMON.
 *
 * @param {Array} pointHistory - Array of point events
 * @returns {Array} List of error metrics sorted by frequency descending
 */
export function computeErrorRankings(pointHistory = []) {
  if (!Array.isArray(pointHistory) || pointHistory.length === 0) {
    return [];
  }

  // Filter for rallies where opponent won the point due to our error
  const errorPoints = pointHistory.filter(pt => pt.pointWonBy === 'opponent' && pt.errorTypeId);
  const totalErrors = errorPoints.length;

  if (totalErrors === 0) return [];

  // Group by errorTypeId
  const countMap = {};
  errorPoints.forEach(pt => {
    const errorDef = VOLLEYBALL_ERRORS.find(e => e.id === pt.errorTypeId) || {
      id: pt.errorTypeId,
      label: pt.errorTypeName || 'Unknown Error',
      category: pt.errorCategory || 'General',
      icon: '⚠️',
      shortLabel: pt.errorTypeName || 'Error'
    };

    if (!countMap[pt.errorTypeId]) {
      countMap[pt.errorTypeId] = {
        errorId: pt.errorTypeId,
        label: errorDef.label,
        shortLabel: errorDef.shortLabel,
        category: errorDef.category,
        icon: errorDef.icon,
        description: errorDef.description,
        count: 0,
        percentage: 0,
        playerCounts: {} // { [playerId]: count }
      };
    }

    countMap[pt.errorTypeId].count += 1;
    if (pt.errorPlayerId) {
      countMap[pt.errorTypeId].playerCounts[pt.errorPlayerId] =
        (countMap[pt.errorTypeId].playerCounts[pt.errorPlayerId] || 0) + 1;
    }
  });

  // Convert to array and sort strictly from highest to lowest count
  const sorted = Object.values(countMap)
    .map(item => ({
      ...item,
      percentage: Math.round((item.count / totalErrors) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  return sorted;
}

/**
 * Computes category breakdown of errors (Service, Attack, Passing, Handling, Violations).
 */
export function computeCategoryBreakdown(pointHistory = []) {
  const errorPoints = pointHistory.filter(pt => pt.pointWonBy === 'opponent' && pt.errorCategory);
  const total = errorPoints.length;
  if (total === 0) return [];

  const catMap = {};
  errorPoints.forEach(pt => {
    const cat = pt.errorCategory;
    if (!catMap[cat]) {
      catMap[cat] = { category: cat, count: 0, percentage: 0 };
    }
    catMap[cat].count += 1;
  });

  return Object.values(catMap)
    .map(c => ({
      ...c,
      percentage: Math.round((c.count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Computes individual player statistics & error ledgers.
 *
 * @param {Array} pointHistory - Array of point events
 * @param {Array} roster - Complete team roster
 * @returns {Array} List of player stat objects sorted by total contribution
 */
export function computePlayerStats(pointHistory = [], roster = []) {
  if (!Array.isArray(roster)) return [];

  const playerMap = {};

  // Initialize for all rostered players
  roster.forEach(p => {
    playerMap[p.id] = {
      player: p,
      totalErrors: 0,
      serviceErrors: 0,
      attackErrors: 0,
      passingErrors: 0,
      handlingErrors: 0,
      violationErrors: 0,
      kills: 0,
      aces: 0,
      blocks: 0,
      pointsEarned: 0,
      netScore: 0, // pointsEarned - totalErrors
      errorBreakdown: [] // list of specific errors
    };
  });

  // Track team unforced errors not assigned to a single player
  const teamErrors = {
    total: 0,
    errors: []
  };

  pointHistory.forEach(pt => {
    // 1. If Opponent won point and an error was assigned to a player
    if (pt.pointWonBy === 'opponent') {
      if (pt.errorPlayerId && playerMap[pt.errorPlayerId]) {
        const pStat = playerMap[pt.errorPlayerId];
        pStat.totalErrors += 1;
        const errDef = VOLLEYBALL_ERRORS.find(e => e.id === pt.errorTypeId);
        const category = pt.errorCategory || errDef?.category;

        if (category === ERROR_CATEGORIES.SERVICE) pStat.serviceErrors += 1;
        else if (category === ERROR_CATEGORIES.ATTACK) pStat.attackErrors += 1;
        else if (category === ERROR_CATEGORIES.PASS_RECEIVE) pStat.passingErrors += 1;
        else if (category === ERROR_CATEGORIES.HANDLING) pStat.handlingErrors += 1;
        else pStat.violationErrors += 1;

        pStat.errorBreakdown.push({
          errorTypeId: pt.errorTypeId,
          label: pt.errorTypeName || errDef?.label || 'Error',
          timestamp: pt.timestamp,
          setNumber: pt.setNumber
        });
      } else {
        teamErrors.total += 1;
        teamErrors.errors.push(pt);
      }
    }

    // 2. If Our team won point and an earned point was attributed to a player
    if (pt.pointWonBy === 'us') {
      if (pt.earnedPlayerId && playerMap[pt.earnedPlayerId]) {
        const pStat = playerMap[pt.earnedPlayerId];
        if (pt.earnedType === 'kill') pStat.kills += 1;
        else if (pt.earnedType === 'ace') pStat.aces += 1;
        else if (pt.earnedType === 'block') pStat.blocks += 1;

        pStat.pointsEarned += 1;
      }
    }
  });

  // Calculate Net Rating (+/-)
  const result = Object.values(playerMap).map(stat => ({
    ...stat,
    netScore: stat.pointsEarned - stat.totalErrors
  }));

  // Sort by players who were involved (active errors or points earned) first
  return result.sort((a, b) => {
    const activityA = a.totalErrors + a.pointsEarned;
    const activityB = b.totalErrors + b.pointsEarned;
    if (activityB !== activityA) return activityB - activityA;
    return a.player.number - b.player.number;
  });
}
