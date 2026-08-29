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

/**
 * Computes performance analytics for each of the 6 volleyball rotations (R1 through R6).
 *
 * @param {Array} pointHistory - Array of point events
 * @returns {Array} List of 6 rotation performance metrics
 */
export function computeRotationPerformance(pointHistory = []) {
  const rotationStats = {};

  for (let r = 1; r <= 6; r++) {
    rotationStats[r] = {
      rotation: r,
      ourPointsWon: 0,
      opponentPointsWon: 0,
      totalRallies: 0,
      servePointsWon: 0,
      servePointsTotal: 0,
      receivePointsWon: 0,
      receivePointsTotal: 0,
      errorCount: 0,
      errorsByType: {},
      netDifferential: 0,
      sideOutPercentage: 0,
      servePercentage: 0,
      topError: null
    };
  }

  if (!Array.isArray(pointHistory)) return Object.values(rotationStats);

  pointHistory.forEach(pt => {
    const r = pt.rotation || 1;
    if (!rotationStats[r]) return;

    const rStat = rotationStats[r];
    rStat.totalRallies += 1;

    if (pt.phase === 'serve') {
      rStat.servePointsTotal += 1;
      if (pt.pointWonBy === 'us') rStat.servePointsWon += 1;
    } else {
      rStat.receivePointsTotal += 1;
      if (pt.pointWonBy === 'us') rStat.receivePointsWon += 1;
    }

    if (pt.pointWonBy === 'us') {
      rStat.ourPointsWon += 1;
    } else {
      rStat.opponentPointsWon += 1;
      if (pt.errorTypeId) {
        rStat.errorCount += 1;
        rStat.errorsByType[pt.errorTypeId] = (rStat.errorsByType[pt.errorTypeId] || 0) + 1;
      }
    }
  });

  return Object.values(rotationStats).map(rStat => {
    rStat.netDifferential = rStat.ourPointsWon - rStat.opponentPointsWon;
    rStat.sideOutPercentage = rStat.receivePointsTotal > 0
      ? Math.round((rStat.receivePointsWon / rStat.receivePointsTotal) * 100)
      : 0;
    rStat.servePercentage = rStat.servePointsTotal > 0
      ? Math.round((rStat.servePointsWon / rStat.servePointsTotal) * 100)
      : 0;

    // Determine top error in this rotation
    const errorEntries = Object.entries(rStat.errorsByType).sort((a, b) => b[1] - a[1]);
    if (errorEntries.length > 0) {
      const errDef = VOLLEYBALL_ERRORS.find(e => e.id === errorEntries[0][0]);
      rStat.topError = {
        errorTypeId: errorEntries[0][0],
        count: errorEntries[0][1],
        label: errDef?.label || errorEntries[0][0]
      };
    }

    return rStat;
  });
}

/**
 * Computes historical averages across all saved past matches.
 *
 * @param {Array} matchHistory - List of saved matches
 * @param {Array} roster - Team roster
 * @returns {Object} Historical metrics summary
 */
export function computeHistoricalAverages(matchHistory = [], roster = []) {
  if (!Array.isArray(matchHistory) || matchHistory.length === 0) {
    return {
      totalMatches: 0,
      totalSets: 0,
      totalPoints: 0,
      winRate: 0,
      avgErrorsPerSet: 0,
      serviceErrorPct: 0,
      attackErrorPct: 0,
      passingErrorPct: 0,
      handlingErrorPct: 0,
      recurrentWeakRotations: []
    };
  }

  let totalMatches = matchHistory.length;
  let matchesWon = 0;
  let totalSets = 0;
  let totalPoints = 0;
  let totalErrors = 0;
  let serviceErrors = 0;
  let attackErrors = 0;
  let passingErrors = 0;
  let handlingErrors = 0;
  const rotationErrorMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  matchHistory.forEach(match => {
    if (match.result === 'WON') matchesWon += 1;
    const sets = match.setScores?.length || 1;
    totalSets += sets;

    const points = match.pointHistory || [];
    totalPoints += points.length;

    points.forEach(pt => {
      if (pt.pointWonBy === 'opponent' && pt.errorTypeId) {
        totalErrors += 1;
        const r = pt.rotation || 1;
        rotationErrorMap[r] = (rotationErrorMap[r] || 0) + 1;

        const cat = pt.errorCategory || '';
        if (cat === ERROR_CATEGORIES.SERVICE || pt.errorTypeId.includes('serve')) serviceErrors += 1;
        else if (cat === ERROR_CATEGORIES.ATTACK || pt.errorTypeId.includes('attack')) attackErrors += 1;
        else if (cat === ERROR_CATEGORIES.PASS_RECEIVE || pt.errorTypeId.includes('receive') || pt.errorTypeId.includes('pass')) passingErrors += 1;
        else if (cat === ERROR_CATEGORIES.HANDLING || pt.errorTypeId.includes('contact') || pt.errorTypeId.includes('lift')) handlingErrors += 1;
      }
    });
  });

  const winRate = totalMatches > 0 ? Math.round((matchesWon / totalMatches) * 100) : 0;
  const avgErrorsPerSet = totalSets > 0 ? Number((totalErrors / totalSets).toFixed(1)) : 0;
  const serviceErrorPct = totalErrors > 0 ? Math.round((serviceErrors / totalErrors) * 100) : 0;
  const attackErrorPct = totalErrors > 0 ? Math.round((attackErrors / totalErrors) * 100) : 0;
  const passingErrorPct = totalErrors > 0 ? Math.round((passingErrors / totalErrors) * 100) : 0;
  const handlingErrorPct = totalErrors > 0 ? Math.round((handlingErrors / totalErrors) * 100) : 0;

  // Rank historical weak rotations
  const recurrentWeakRotations = Object.entries(rotationErrorMap)
    .map(([rot, errCount]) => ({ rotation: Number(rot), errorCount: errCount }))
    .sort((a, b) => b.errorCount - a.errorCount);

  return {
    totalMatches,
    matchesWon,
    winRate,
    totalSets,
    totalPoints,
    totalErrors,
    avgErrorsPerSet,
    serviceErrorPct,
    attackErrorPct,
    passingErrorPct,
    handlingErrorPct,
    recurrentWeakRotations
  };
}

/**
 * Generates intelligent, rule-compliant tactical coaching recommendations and game adjustments.
 *
 * @param {Object} params - Context parameters
 * @param {Object} params.currentMatch - Current match statistics object
 * @param {Array} params.matchHistory - Saved historical matches
 * @param {Array} params.roster - Full team roster
 * @param {Object} params.teamSettings - Team settings
 * @returns {Array} Prioritized list of actionable tactical coaching suggestions
 */
export function generateTacticalSuggestions({
  currentMatch = {},
  matchHistory = [],
  roster = [],
  teamSettings = {}
}) {
  const suggestions = [];
  const points = currentMatch.pointHistory || [];
  const errorPoints = points.filter(p => p.pointWonBy === 'opponent' && p.errorTypeId);
  const totalErrors = errorPoints.length;

  const playerStats = computePlayerStats(points, roster);
  const rotationStats = computeRotationPerformance(points);
  const categoryBreakdown = computeCategoryBreakdown(points);
  const historical = computeHistoricalAverages(matchHistory, roster);

  // Helper lookups
  const liberos = roster.filter(p => p.position === 'Libero' || p.isLibero);
  const defensiveSpecialists = roster.filter(p => p.position === 'Defensive Specialist' || p.secondaryPosition?.includes('Defensive'));
  const setters = roster.filter(p => p.position === 'Setter');
  const opposites = roster.filter(p => p.position === 'Right Side' || p.position === 'Opposite');
  const middles = roster.filter(p => p.position === 'Middle Blocker');

  // =========================================================================
  // 1. IN-GAME MOMENTUM & ACTIVE OPPONENT SCORING RUNS (Rule 15.4)
  // =========================================================================
  if (points.length >= 3) {
    let opponentRun = 0;
    for (let i = points.length - 1; i >= 0; i--) {
      if (points[i].pointWonBy === 'opponent') {
        opponentRun += 1;
      } else {
        break;
      }
    }

    if (opponentRun >= 3) {
      suggestions.push({
        id: 'sug-timeout-momentum',
        category: 'Momentum & Timeouts',
        priority: 'critical',
        type: 'timeout',
        title: `Call Tactical Timeout (Opponent on ${opponentRun}-0 Run)`,
        evidence: `Opponent has scored ${opponentRun} consecutive unanswered points in the current set.`,
        recommendation: `Call an immediate 30-second timeout to freeze the opponent server's momentum, calm the team, and re-establish primary serve-receive passing responsibilities.`,
        ruleReference: `USAV / NFHS Rule 15.4 (Each team permitted 2 timeouts of 30 seconds per set).`,
        actionLabel: 'Call Timeout'
      });
    }
  }

  // =========================================================================
  // 2. SERVE RECEIVE & PASSING STABILIZATION (Rule 9.2 & Rule 15.6)
  // =========================================================================
  const receiveErrors = errorPoints.filter(p =>
    p.errorTypeId === 'receive_ace_against' ||
    p.errorTypeId === 'overpass_kill' ||
    p.errorCategory === ERROR_CATEGORIES.PASS_RECEIVE
  );

  if (receiveErrors.length >= 2) {
    // Find who made the receive errors
    const passerErrorMap = {};
    receiveErrors.forEach(p => {
      if (p.errorPlayerId) {
        passerErrorMap[p.errorPlayerId] = (passerErrorMap[p.errorPlayerId] || 0) + 1;
      }
    });

    const worstPasserEntry = Object.entries(passerErrorMap).sort((a, b) => b[1] - a[1])[0];
    const worstPasser = worstPasserEntry ? roster.find(p => p.id === worstPasserEntry[0]) : null;
    const count = worstPasserEntry ? worstPasserEntry[1] : receiveErrors.length;

    const dsAvailable = defensiveSpecialists.find(p => p.id !== worstPasser?.id) || liberos[0];

    suggestions.push({
      id: 'sug-serve-receive-pinch',
      category: 'Serve Receive',
      priority: count >= 3 ? 'critical' : 'tactical',
      type: 'formation',
      title: worstPasser ? `Stabilize Serve Receive: ${worstPasser.name}` : 'Tighten Serve Receive Passing Seams',
      evidence: worstPasser
        ? `${worstPasser.name} (#${worstPasser.number}) has ${count} reception/overpass errors (${Math.round((count / Math.max(1, receiveErrors.length)) * 100)}% of receive breakdowns).`
        : `Team has conceded ${receiveErrors.length} points on serve receive aces and overpasses.`,
      recommendation: worstPasser && dsAvailable
        ? `Shift Libero (#${liberos[0]?.number || 'L'}) toward the deep seam to pinch court coverage. Under Rule 15.6, consider subbing in Defensive Specialist #${dsAvailable.number} ${dsAvailable.name} for #${worstPasser.number} in the back row to solidify passing.`
        : `Tighten the 3-passer cup and instruct the Right Side to drop back into the left seam. Passers must hold their platform angle toward target rather than swinging their arms.`,
      ruleReference: `USAV Rule 9.2 (Ball Handling) & Rule 15.6 (Position-locked Substitutions).`,
      targetPlayerId: worstPasser?.id || null,
      actionLabel: 'View 6-2 Tactics'
    });
  }

  // =========================================================================
  // 3. SERVING STRATEGY & SERVICE ERROR REDUCTION (Rule 12 & Rule 19.3.1.3)
  // =========================================================================
  const serviceErrors = errorPoints.filter(p =>
    p.errorTypeId?.includes('serve') ||
    p.errorCategory === ERROR_CATEGORIES.SERVICE
  );

  if (serviceErrors.length >= 2) {
    const netServes = serviceErrors.filter(p => p.errorTypeId === 'missed_serve_net').length;
    const outServes = serviceErrors.filter(p => p.errorTypeId === 'missed_serve_out' || p.errorTypeId === 'service_foot_fault').length;

    const libero = liberos[0];

    suggestions.push({
      id: 'sug-serving-targets',
      category: 'Serving Strategy',
      priority: serviceErrors.length >= 4 ? 'critical' : 'tactical',
      type: 'tactical',
      title: 'Target Deep Corners & Lower Service Error Rate',
      evidence: `Team has committed ${serviceErrors.length} missed serves (${netServes} in the net, ${outServes} long/out), accounting for ${Math.round((serviceErrors.length / Math.max(1, totalErrors)) * 100)}% of opponent points.`,
      recommendation: netServes >= outServes
        ? `Servers are contacting with flat trajectory or dropping their elbow. Focus on driving deep float serves targeting Zone 5 (Left Back) and Zone 1 (Right Back). ${libero ? `Under Rule 19.3.1.3, ensure Libero #${libero.number} serves in Zone 1 for reliable ball control.` : ''}`
        : `Servers are over-hitting. Dial back power to 80% with high flat-hand contact aimed between opponent passers into the deep seam.`,
      ruleReference: `USAV Rule 12.4 (Execution of Service) & Rule 19.3.1.3 (Libero Serving in one rotational position per set).`,
      actionLabel: 'View Formations'
    });
  }

  // =========================================================================
  // 4. 6-2 ATTACK DISTRIBUTION & SETTER DEPTH (Rule 13 & 6-2 System)
  // =========================================================================
  const attackErrors = errorPoints.filter(p =>
    p.errorTypeId?.includes('attack') ||
    p.errorCategory === ERROR_CATEGORIES.ATTACK
  );

  if (attackErrors.length >= 2) {
    const blockedCount = attackErrors.filter(p => p.errorTypeId === 'attack_blocked').length;
    const netAttackCount = attackErrors.filter(p => p.errorTypeId === 'attack_net').length;
    const outAttackCount = attackErrors.filter(p => p.errorTypeId === 'attack_out').length;

    // Find hitter with most errors
    const hitterErrorMap = {};
    attackErrors.forEach(p => {
      if (p.errorPlayerId) {
        hitterErrorMap[p.errorPlayerId] = (hitterErrorMap[p.errorPlayerId] || 0) + 1;
      }
    });

    const worstHitterEntry = Object.entries(hitterErrorMap).sort((a, b) => b[1] - a[1])[0];
    const worstHitter = worstHitterEntry ? roster.find(p => p.id === worstHitterEntry[0]) : null;

    suggestions.push({
      id: 'sug-62-attack-depth',
      category: '6-2 Attack Strategy',
      priority: attackErrors.length >= 4 ? 'critical' : 'tactical',
      type: 'tactical',
      title: blockedCount >= 2 ? 'Spread 6-2 Offense to Break Opponent Block' : 'Push Sets 2-3 Feet Off the Net',
      evidence: `${attackErrors.length} attack errors logged (${netAttackCount} into net, ${blockedCount} roofed/blocked, ${outAttackCount} out). ${worstHitter ? `${worstHitter.name} has ${worstHitterEntry[1]} attack errors.` : ''}`,
      recommendation: blockedCount >= 2
        ? `In a 6-2 system, utilize all 3 active front-row hitters! Run Middle quicks (1-ball/31) and Right-Side back sets to freeze the opponent middle blocker and create 1-on-1 open nets for outside hitters.`
        : `Sets are currently too tight to the net tape. Back-row setters must push sets 2 to 3 feet off the net to give hitters approach depth and the ability to tool or roll-shot off opponent fingertips.`,
      ruleReference: `USAV Rule 13.1 (Attack-Hit) & 6-2 System 3-Hitter Front Row Principles.`,
      targetPlayerId: worstHitter?.id || null,
      actionLabel: 'View 6-2 Tactics'
    });
  }

  // =========================================================================
  // 5. ROTATION WEAKNESS PINPOINT (R1 - R6)
  // =========================================================================
  const weakRotations = [...rotationStats]
    .filter(r => r.totalRallies >= 2 && r.netDifferential < 0)
    .sort((a, b) => a.netDifferential - b.netDifferential);

  if (weakRotations.length > 0) {
    const weakest = weakRotations[0];
    suggestions.push({
      id: `sug-rotation-${weakest.rotation}-weakness`,
      category: `Rotation ${weakest.rotation} Adjustment`,
      priority: weakest.netDifferential <= -2 ? 'critical' : 'tactical',
      type: 'rotation',
      title: `Tactical Adjustment: Rotation ${weakest.rotation} (Net: ${weakest.netDifferential > 0 ? '+' : ''}${weakest.netDifferential})`,
      evidence: `Rotation ${weakest.rotation} has conceded ${weakest.opponentPointsWon} points with only ${weakest.sideOutPercentage}% side-out conversion. ${weakest.topError ? `Most frequent error: ${weakest.topError.label} (${weakest.topError.count}x).` : ''}`,
      recommendation: weakest.rotation === 4
        ? `In Rotation 4 (Setter 2 in Zone 1, Outside 2 in Zone 4), ensure Setter penetrates along the right sideline after serve contact without triggering Rule 7.4 overlap with Right Side in Zone 2.`
        : weakest.rotation === 3
        ? `In Rotation 3 (Setter in Zone 5), keep Outside Hitter stacked near the left pin to accelerate approach transition onto the high ball.`
        : `Reinforce primary passing seams in Rotation ${weakest.rotation} and execute high-percentage cross-court spikes to force side-out on the first ball.`,
      ruleReference: `USAV Rule 7.4 (Positional Faults & Overlaps) & Rule 7.5.`,
      targetRotation: weakest.rotation,
      actionLabel: `View Rotation ${weakest.rotation}`
    });
  }

  // =========================================================================
  // 6. HISTORICAL TRENDS & SAVED GAMES COMPARISON
  // =========================================================================
  if (historical.totalMatches >= 1) {
    const currentServicePct = totalErrors > 0
      ? Math.round((serviceErrors.length / totalErrors) * 100)
      : 0;

    if (totalErrors >= 3 && currentServicePct > historical.serviceErrorPct + 10) {
      suggestions.push({
        id: 'sug-hist-service-spike',
        category: 'Historical Comparison',
        priority: 'tactical',
        type: 'historical',
        title: `Service Errors Above Historical Average (${currentServicePct}% vs ${historical.serviceErrorPct}%)`,
        evidence: `In ${historical.totalMatches} saved matches, service errors averaged ${historical.serviceErrorPct}%. Today they account for ${currentServicePct}% of all team unforced errors.`,
        recommendation: `Switch to high-consistency tactical zones rather than aggressive jump serves to align with historical win-rate benchmarks (${historical.winRate}% win rate).`,
        ruleReference: `Longitudinal Multi-Match Benchmark across ${historical.totalMatches} matches.`
      });
    }

    if (historical.recurrentWeakRotations.length > 0) {
      const topHistoricalWeakRot = historical.recurrentWeakRotations[0].rotation;
      suggestions.push({
        id: 'sug-hist-rot-trend',
        category: 'Historical Comparison',
        priority: 'tactical',
        type: 'historical',
        title: `Historical Weak Point: Rotation ${topHistoricalWeakRot}`,
        evidence: `Across all ${historical.totalMatches} saved past games, Rotation ${topHistoricalWeakRot} is the team's #1 error magnet (${historical.recurrentWeakRotations[0].errorCount} historical errors).`,
        recommendation: `Prepare specific side-out release options for Rotation ${topHistoricalWeakRot} before entering this rotation during tight late-set points.`,
        ruleReference: `Multi-Game Historical Trend Analysis.`
      });
    }
  }

  // =========================================================================
  // 7. POSITIVE HIGHLIGHTS & BEST PRACTICES
  // =========================================================================
  const aces = points.filter(p => p.pointWonBy === 'us' && p.earnedType === 'ace').length;
  const kills = points.filter(p => p.pointWonBy === 'us' && p.earnedType === 'kill').length;
  const topPlayer = [...playerStats].sort((a, b) => b.netScore - a.netScore)[0];

  if (topPlayer && topPlayer.netScore >= 2) {
    suggestions.push({
      id: 'sug-positive-impact',
      category: 'Player Performance',
      priority: 'positive',
      type: 'strength',
      title: `Standout Contributor: ${topPlayer.player.name} (Net Rating: +${topPlayer.netScore})`,
      evidence: `${topPlayer.player.name} (#${topPlayer.player.number}) has generated ${topPlayer.pointsEarned} points (${topPlayer.kills} kills, ${topPlayer.aces} aces, ${topPlayer.blocks} blocks) with only ${topPlayer.totalErrors} errors.`,
      recommendation: `Continue feeding ${topPlayer.player.name} in transition and keep them involved as a primary scoring option in high-pressure rallies.`,
      ruleReference: `Team MVP Rating (+/- Net Efficiency).`
    });
  }

  // Default suggestions if match just started and little data exists
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'sug-default-start',
      category: '6-2 Game Plan',
      priority: 'tactical',
      type: 'tactical',
      title: '6-2 Offensive System Execution Focus',
      evidence: 'Match tracking is active. Log points, kills, aces, and errors to unlock real-time tactical adjustments.',
      recommendation: 'Maintain aggressive deep float serves, run middle hitters in transition to open up the pins, and ensure back-row setters penetrate promptly at serve contact.',
      ruleReference: 'USAV Volleyball Standard Rules & 6-2 System Tactics.'
    });
  }

  return suggestions;
}

