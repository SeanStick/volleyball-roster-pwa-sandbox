/**
 * Official Volleyball Rules & Substitution Engine
 * Supports USAV / FIVB / NFHS / NCAA substitution mechanics:
 * 1. Front Row: Zones 4, 3, 2 (Left Front, Middle Front, Right Front)
 * 2. Back Row:  Zones 5, 6, 1 (Left Back, Middle Back, Right Back / Server)
 * 3. Libero Rules (Rule 19):
 *    - Strictly a back-row player (cannot play in Zones 4, 3, 2).
 *    - Replaces a back-row player without counting as a regular sub.
 *    - When rotating from Zone 5 to Zone 4 (Front Row), MUST exit the court.
 *    - Remembers which player the Libero replaced to prompt for their return.
 * 4. Libero Serving Rules (USAV / NFHS / NCAA Rule 19.3.1.3):
 *    - A Libero may serve in ONE designated rotational position per set.
 *    - Once a Libero serves in a rotational position, they can only serve in that position for that set.
 * 5. Standard Substitution Rules:
 *    - Position Locking: In an official set, bench players can only sub into ONE rotational position.
 *    - Starter Re-entry: A starter may leave and re-enter the set once, only in their original position.
 *    - Substitution limits per set (e.g. 12, 15, 18, or unlimited).
 */

export const FRONT_ROW_ZONES = ['pos4', 'pos3', 'pos2'];
export const BACK_ROW_ZONES = ['pos5', 'pos6', 'pos1'];

export const ZONE_LABELS = {
  pos1: { num: 1, name: 'Right Back (Server)', isFront: false, isServer: true },
  pos2: { num: 2, name: 'Right Front', isFront: true, isServer: false },
  pos3: { num: 3, name: 'Middle Front', isFront: true, isServer: false },
  pos4: { num: 4, name: 'Left Front', isFront: true, isServer: false },
  pos5: { num: 5, name: 'Left Back', isFront: false, isServer: false },
  pos6: { num: 6, name: 'Middle Back', isFront: false, isServer: false },
};

// Clockwise rotation order in volleyball
// Zone 2 -> Zone 1 -> Zone 6 -> Zone 5 -> Zone 4 -> Zone 3 -> Zone 2
export const ROTATION_MAPPING = {
  pos1: 'pos2', // New Pos 1 gets player from Pos 2
  pos6: 'pos1', // New Pos 6 gets player from Pos 1
  pos5: 'pos6', // New Pos 5 gets player from Pos 6
  pos4: 'pos5', // New Pos 4 gets player from Pos 5  <-- CRITICAL: Zone 5 rotates into Zone 4 (Front Row)
  pos3: 'pos4', // New Pos 3 gets player from Pos 4
  pos2: 'pos3'  // New Pos 2 gets player from Pos 3
};

// Reverse rotation (Counter-Clockwise)
export const REVERSE_ROTATION_MAPPING = {
  pos2: 'pos1',
  pos3: 'pos2',
  pos4: 'pos3',
  pos5: 'pos4',
  pos6: 'pos5',
  pos1: 'pos6'
};

/**
 * Checks if rotating clockwise will cause a Libero to enter the Front Row (Zone 4).
 * @param {Object} currentLineup - Object with pos1..pos6 player IDs
 * @param {Array} roster - Full team roster
 * @param {Object} liberoExchanges - Map of libero replacements { [liberoId]: replacedPlayerId }
 * @returns {Object} { willViolate: boolean, libero: Player|null, replacedPlayer: Player|null }
 */
export function checkLiberoRotationViolation(currentLineup, roster, liberoExchanges = {}) {
  // Pos 5 player is about to move to Pos 4 (Left Front - Front Row)
  const incomingPos4Id = currentLineup.pos5;
  if (!incomingPos4Id) return { willViolate: false, libero: null, replacedPlayer: null };

  const player = roster.find(p => p.id === incomingPos4Id);
  if (player && (player.position === 'Libero' || player.isLibero)) {
    const originalPlayerId = liberoExchanges[player.id];
    const replacedPlayer = originalPlayerId ? roster.find(p => p.id === originalPlayerId) : null;
    return {
      willViolate: true,
      libero: player,
      replacedPlayer: replacedPlayer || null,
      fromZone: 'pos5',
      toZone: 'pos4'
    };
  }

  return { willViolate: false, libero: null, replacedPlayer: null };
}

/**
 * Checks if the current lineup currently has a Libero in the front row (Zones 4, 3, 2).
 * Rule 19.3.1 strictly forbids a Libero in the front row.
 */
export function checkLineupFrontRowLiberoViolation(currentLineup, roster, liberoExchanges = {}) {
  for (const zoneKey of FRONT_ROW_ZONES) {
    const occupantId = currentLineup[zoneKey];
    if (occupantId) {
      const player = roster.find(p => p.id === occupantId);
      if (player && (player.position === 'Libero' || player.isLibero)) {
        const originalPlayerId = liberoExchanges[player.id];
        const replacedPlayer = originalPlayerId ? roster.find(p => p.id === originalPlayerId) : null;
        return {
          hasViolation: true,
          zoneKey,
          zoneNum: ZONE_LABELS[zoneKey]?.num,
          libero: player,
          replacedPlayer: replacedPlayer || null
        };
      }
    }
  }
  return { hasViolation: false, zoneKey: null, zoneNum: null, libero: null, replacedPlayer: null };
}

/**
 * Checks whether a Libero is eligible to serve in Zone 1 (USAV / NFHS Rule 19.3.1.3).
 * @param {Object} libero - Libero player object
 * @param {number} rotationNumber - Current rotation (1..6)
 * @param {number|null} designatedServingRotation - Rotation index where Libero previously served (if any)
 * @returns {Object} { canServe: boolean, isDesignated: boolean, reason: string }
 */
export function checkLiberoServingEligibility(libero, rotationNumber, designatedServingRotation = null) {
  if (!libero) {
    return { canServe: false, isDesignated: false, reason: 'No Libero on team roster.' };
  }

  // Case 1: Libero has already served in this specific rotation position
  if (designatedServingRotation === rotationNumber) {
    return {
      canServe: true,
      isDesignated: true,
      reason: `Libero is designated to serve in Rotation #${rotationNumber}.`
    };
  }

  // Case 2: Libero has NOT yet served in any rotation this set (eligible to establish)
  if (designatedServingRotation === null) {
    return {
      canServe: true,
      isDesignated: false,
      reason: `Libero is eligible to serve in Rotation #${rotationNumber} (will lock this rotation for the set).`
    };
  }

  // Case 3: Libero already served in a different rotation (Rule Violation to serve elsewhere)
  return {
    canServe: false,
    isDesignated: false,
    reason: `Rule 19.3.1.3: Libero is locked to serving in Rotation #${designatedServingRotation} for this set and cannot serve here.`
  };
}

/**
 * Checks if there is an opportunity for a benched Libero to re-enter for a back-row player.
 * In volleyball, after exiting the front row, the Libero almost always replaces the other Middle Blocker
 * (or back-row player) who just rotated into the back row (Zone 6, 5, or 1).
 * @param {Object} currentLineup - Current active lineup
 * @param {Array} roster - Full team roster
 * @param {Object} liberoExchanges - Existing active libero exchanges
 * @returns {Object} { canReenter: boolean, libero: Player|null, candidatePlayer: Player|null, targetZone: string|null }
 */
export function checkLiberoReentryOpportunity(currentLineup, roster, liberoExchanges = {}) {
  // Find team libero
  const libero = roster.find(p => p.position === 'Libero' || p.isLibero);
  if (!libero) return { canReenter: false, libero: null, candidatePlayer: null, targetZone: null };

  // If Libero is already on the court, no re-entry needed
  const isLiberoOnCourt = Object.values(currentLineup).includes(libero.id);
  if (isLiberoOnCourt) {
    return { canReenter: false, libero, candidatePlayer: null, targetZone: null };
  }

  // Check back-row zones (Zone 6 is Middle Back, Zone 5 is Left Back, Zone 1 is Right Back)
  // Standard priority for Libero replacement: Middle Blocker in back row (Zone 6 or 5 or 1)
  const backRowZones = ['pos6', 'pos5', 'pos1'];
  for (const zoneKey of backRowZones) {
    const occupantId = currentLineup[zoneKey];
    if (occupantId) {
      const player = roster.find(p => p.id === occupantId);
      if (player && (player.position === 'Middle Blocker' || player.position === 'Defensive Specialist' || player.position === 'Outside Hitter')) {
        return {
          canReenter: true,
          libero,
          candidatePlayer: player,
          targetZone: zoneKey
        };
      }
    }
  }

  return { canReenter: false, libero, candidatePlayer: null, targetZone: null };
}

/**
 * Validates whether a player can legally be assigned to or substituted into a zone.
 */
export function checkSubstitutionLegality(player, zoneKey, currentLineup, subHistory = [], options = {}) {
  const { maxSubs = 12, enforcePositionLock = false } = options;
  const isFrontRow = FRONT_ROW_ZONES.includes(zoneKey);
  const isLibero = player.position === 'Libero' || player.isLibero;

  // RULE 1: Libero cannot enter Front Row
  if (isLibero && isFrontRow) {
    return {
      isLegal: false,
      reason: 'Rule Violation: Libero is strictly a back-row player and cannot play in Zones 4, 3, or 2 (Front Row).',
      isLiberoExchange: false
    };
  }

  // RULE 2: A team cannot have multiple Liberos on the court simultaneously
  if (isLibero) {
    const existingLiberoOnCourt = Object.entries(currentLineup).find(([k, id]) => {
      if (k === zoneKey) return false;
      return id === player.id;
    });
    if (existingLiberoOnCourt) {
      return {
        isLegal: false,
        reason: 'Rule Violation: This Libero is already on the court in another zone.',
        isLiberoExchange: false
      };
    }
  }

  // RULE 3: Player already on court in another zone cannot be subbed in without swapping
  const isAlreadyOnCourt = Object.entries(currentLineup).some(([k, id]) => k !== zoneKey && id === player.id);
  if (isAlreadyOnCourt) {
    return {
      isLegal: false,
      reason: `${player.name} is already playing on the court.`,
      isLiberoExchange: false
    };
  }

  // RULE 4: Libero Exchange (Back row only, doesn't count towards team sub limits)
  if (isLibero && !isFrontRow) {
    return {
      isLegal: true,
      reason: 'Libero Exchange: Free back-row replacement (does not count toward set sub limit).',
      isLiberoExchange: true
    };
  }

  // RULE 5: Substitution count limit (regular substitutions only)
  const regularSubsUsed = subHistory.filter(s => !s.isLiberoExchange).length;
  if (maxSubs > 0 && regularSubsUsed >= maxSubs) {
    return {
      isLegal: false,
      reason: `Maximum team substitution limit reached (${maxSubs} subs per set).`,
      isLiberoExchange: false
    };
  }

  // RULE 6: Position-locking rule (if enforced)
  if (enforcePositionLock) {
    const previousEntry = subHistory.find(s => s.incomingPlayerId === player.id || s.outgoingPlayerId === player.id);
    if (previousEntry && previousEntry.zoneKey !== zoneKey) {
      return {
        isLegal: false,
        reason: `Position Lock Violation: ${player.name} is locked to rotational Zone ${ZONE_LABELS[previousEntry.zoneKey]?.num || ''} for this set.`,
        isLiberoExchange: false
      };
    }
  }

  return {
    isLegal: true,
    reason: null,
    isLiberoExchange: false
  };
}

/**
 * Generates an annotated list of bench players with their eligibility for a specific zone.
 */
export function getAnnotatedBench(benchPlayers, targetZoneKey, currentLineup, subHistory = [], options = {}) {
  return benchPlayers.map(player => {
    const check = checkSubstitutionLegality(player, targetZoneKey, currentLineup, subHistory, options);
    return {
      ...player,
      eligibility: check
    };
  });
}

/**
 * Executes a rotation and applies an updated lineup.
 */
export function rotateLineupClockwise(currentLineup) {
  return {
    pos1: currentLineup.pos2,
    pos6: currentLineup.pos1,
    pos5: currentLineup.pos6,
    pos4: currentLineup.pos5,
    pos3: currentLineup.pos4,
    pos2: currentLineup.pos3
  };
}

export function rotateLineupCounterClockwise(currentLineup) {
  return {
    pos2: currentLineup.pos1,
    pos3: currentLineup.pos2,
    pos4: currentLineup.pos3,
    pos5: currentLineup.pos4,
    pos6: currentLineup.pos5,
    pos1: currentLineup.pos6
  };
}

/**
 * Validates a 6-2 Volleyball Formation Lineup.
 *
 * In an official 6-2 Offensive System:
 * - 2 Setters (S1 and S2) or Setter/Right Side pairs are positioned opposite each other (Zones 1 ⇄ 4).
 * - 2 Outside Hitters (OH1 and OH2) are positioned opposite each other (Zones 2 ⇄ 5).
 * - 2 Middle Blockers (MB1 and MB2/Libero) are positioned opposite each other (Zones 3 ⇄ 6).
 * - The setter in the BACK ROW runs the offense, allowing 3 front-row hitters in all 6 rotations!
 */
export function validate62Formation(lineup = {}, roster = []) {
  if (!lineup || !roster) {
    return { isValid62: true, isValid61: true, isComplete: false, issues: [], pairsSummary: null, autoCorrectLineup: null, suggestedRoleUpdates: [] };
  }

  const getPlayer = (id) => roster.find(p => p.id === id);

  const players = {
    pos1: getPlayer(lineup.pos1),
    pos2: getPlayer(lineup.pos2),
    pos3: getPlayer(lineup.pos3),
    pos4: getPlayer(lineup.pos4),
    pos5: getPlayer(lineup.pos5),
    pos6: getPlayer(lineup.pos6),
  };

  const issues = [];
  const suggestedRoleUpdates = [];

  // 1. Check for Duplicate Players across zones
  const seenPlayerIds = new Set();
  Object.entries(lineup).forEach(([zoneKey, pId]) => {
    if (!pId) return;
    if (seenPlayerIds.has(pId)) {
      const p = getPlayer(pId);
      issues.push({
        type: 'duplicate_player',
        severity: 'error',
        message: `Duplicate Player Violation: ${p?.name || 'Player'} is assigned to multiple zones simultaneously.`
      });
    }
    seenPlayerIds.add(pId);
  });

  // 2. Check for Libero in Front-Row (Rule 19.3.1)
  FRONT_ROW_ZONES.forEach(zk => {
    const p = players[zk];
    if (p && (p.position === 'Libero' || p.isLibero)) {
      issues.push({
        type: 'libero_front_row',
        severity: 'error',
        zoneKey: zk,
        message: `Rule 19.3.1 Violation: ${p.name} is a Libero and cannot be placed in front-row ${ZONE_LABELS[zk]?.name}.`
      });
    }
  });

  // 3. Check for Unavailable / Injured players in lineup
  Object.entries(players).forEach(([zk, p]) => {
    if (p && (p.status === 'Injured' || p.status === 'Absent' || p.status === 'Out')) {
      issues.push({
        type: 'player_unavailable',
        severity: 'warning',
        zoneKey: zk,
        playerId: p.id,
        message: `${p.name} in ${ZONE_LABELS[zk]?.name} is currently marked as ${p.status}.`
      });
    }
  });

  // Verify all 6 slots are filled
  const filledSlots = Object.entries(players).filter(([k, v]) => Boolean(v));
  if (filledSlots.length < 6) {
    const fallback62 = generate62LineupForServeState(roster, 'serve');
    return {
      isValid62: false,
      isValid61: false,
      isComplete: false,
      issues: [{ type: 'incomplete_lineup', severity: 'error', message: `Lineup has only ${filledSlots.length}/6 positions assigned.` }, ...issues],
      pairsSummary: null,
      autoCorrectLineup: fallback62,
      suggestedRoleUpdates: []
    };
  }

  // Role matching supporting both Primary AND Secondary positions
  const hasRole = (p, targetRole) => {
    if (!p) return false;
    const prim = (p.position || '').toLowerCase();
    const sec = (p.secondaryPosition || '').toLowerCase();
    if (targetRole === 'setter') {
      return prim.includes('setter') || prim.includes('opposite') || prim.includes('right side') ||
             sec.includes('setter') || sec.includes('right side') || sec.includes('opposite');
    }
    if (targetRole === 'outside') {
      return prim.includes('outside') || sec.includes('outside');
    }
    if (targetRole === 'middle') {
      return prim.includes('middle') || prim.includes('libero') || p.isLibero || prim.includes('defensive') ||
             sec.includes('middle') || sec.includes('defensive') || sec.includes('libero');
    }
    return false;
  };

  // Check 3-zone diagonal pairs (opposite across court)
  const pairs = [
    { name: 'Pair 1 (Zones 1 ⇄ 4)', posA: 'pos1', posB: 'pos4', pA: players.pos1, pB: players.pos4 },
    { name: 'Pair 2 (Zones 2 ⇄ 5)', posA: 'pos2', posB: 'pos5', pA: players.pos2, pB: players.pos5 },
    { name: 'Pair 3 (Zones 3 ⇄ 6)', posA: 'pos3', posB: 'pos6', pA: players.pos3, pB: players.pos6 }
  ];

  let setterPair = null;
  let outsidePair = null;
  let middlePair = null;

  for (const pair of pairs) {
    const isSetterPair = hasRole(pair.pA, 'setter') && hasRole(pair.pB, 'setter');
    const bothOH = hasRole(pair.pA, 'outside') && hasRole(pair.pB, 'outside');
    const bothMBorL = hasRole(pair.pA, 'middle') && hasRole(pair.pB, 'middle');

    if (isSetterPair) {
      setterPair = pair;
    } else if (bothOH) {
      outsidePair = pair;
    } else if (bothMBorL) {
      middlePair = pair;
    } else {
      issues.push({
        type: 'pair_mismatch',
        severity: 'warning',
        message: `${pair.name}: ${pair.pA?.name || 'Player'} (${pair.pA?.position || 'Unknown'}) and ${pair.pB?.name || 'Player'} (${pair.pB?.position || 'Unknown'}) are paired across the court. In a 6-2, Setters/Right Sides (S1 ⇄ S2/RS), Outsides (OH ⇄ OH), and Middles (MB ⇄ MB/Libero) play opposite each other.`
      });
    }
  }

  // Generate 1-Tap Auto-Correct 6-2 Lineup
  const allOnCourt = [players.pos1, players.pos2, players.pos3, players.pos4, players.pos5, players.pos6].filter(Boolean);
  
  const settersAndRS = allOnCourt.filter(p => p.position === 'Setter' || p.position === 'Opposite Hitter' || p.position === 'Right Side');
  const s1 = settersAndRS[0] || allOnCourt[0];
  const s2 = settersAndRS[1] || allOnCourt.find(p => p.id !== s1?.id);
  
  const rest = allOnCourt.filter(p => p.id !== s1?.id && p.id !== s2?.id);
  const activeOHs = rest.filter(p => p.position === 'Outside Hitter');
  const activeMBs = rest.filter(p => p.position === 'Middle Blocker');
  const activeLibs = rest.filter(p => p.position === 'Libero' || p.isLibero || p.position === 'Defensive Specialist');

  const poolOH = [...activeOHs, ...rest.filter(p => !activeOHs.includes(p) && !activeMBs.includes(p) && !activeLibs.includes(p))];
  const poolMB = [...activeMBs, ...activeLibs, ...rest.filter(p => !poolOH.includes(p))];

  const oh1 = poolOH[0] || rest[0] || null;
  const oh2 = poolOH[1] || rest[1] || null;
  const mb1 = poolMB[0] || rest[2] || null;
  const mb2 = poolMB[1] || rest[3] || null;

  const autoCorrectLineup = {
    pos1: s1?.id || null,  // Setter 1 (Zone 1)
    pos2: oh1?.id || null, // OH1 (Zone 2)
    pos3: mb1?.id || null, // MB1 (Zone 3)
    pos4: s2?.id || null,  // Setter 2 / Right Side (Zone 4 - opposite S1)
    pos5: oh2?.id || null, // OH2 (Zone 5 - opposite OH1)
    pos6: mb2?.id || null  // MB2 / Libero (Zone 6 - opposite MB1)
  };

  return {
    isValid62: issues.length === 0,
    isValid61: issues.length === 0, // backwards compatibility
    isComplete: true,
    issues,
    pairsSummary: {
      setterOpposite: setterPair ? `${setterPair.pA.name} ⇄ ${setterPair.pB.name}` : null,
      outsides: outsidePair ? `${outsidePair.pA.name} ⇄ ${outsidePair.pB.name}` : null,
      middles: middlePair ? `${middlePair.pA.name} ⇄ ${middlePair.pB.name}` : null
    },
    autoCorrectLineup,
    suggestedRoleUpdates
  };
}

// Backwards-compatible alias
export const validate61Formation = validate62Formation;

/**
 * Mathematically derives the court lineup for any target rotation (1..6) from a starting lineup (Rotation 1).
 * Automatically applies Libero front-row replacement checks to keep lineup legal.
 */
export function deriveLineupForRotation(startingLineup, targetRotation, roster = [], liberoExchanges = {}) {
  if (!startingLineup) return startingLineup;
  let current = { ...startingLineup };
  const steps = (targetRotation - 1 + 6) % 6;
  for (let i = 0; i < steps; i++) {
    current = rotateLineupClockwise(current);
    const violation = checkLineupFrontRowLiberoViolation(current, roster, liberoExchanges);
    if (violation.hasViolation && violation.replacedPlayer) {
      current[violation.zoneKey] = violation.replacedPlayer.id;
    }
  }
  return current;
}

/**
 * Generates an official 6-2 starting lineup based on whether the team Serves 1st or Receives 1st.
 * - If Serves 1st: Setter 1 starts in Zone 1 (Position I).
 * - If Receives 1st: Setter 1 starts in Zone 2 (Position II) so they rotate to Zone 1 on the 1st side-out (USAV / FIVB Rule 7.3.5.2).
 */
export function generate62LineupForServeState(rosterPool = [], serveState = 'serve', preferredServerId = null) {
  if (!Array.isArray(rosterPool) || rosterPool.length === 0) {
    return { pos1: null, pos2: null, pos3: null, pos4: null, pos5: null, pos6: null };
  }

  const setters = rosterPool.filter(p => p.position === 'Setter');
  const outsides = rosterPool.filter(p => p.position === 'Outside Hitter');
  const middles = rosterPool.filter(p => p.position === 'Middle Blocker');
  const opposites = rosterPool.filter(p => p.position === 'Opposite Hitter' || p.position === 'Right Side');
  const liberos = rosterPool.filter(p => p.position === 'Libero' || p.isLibero || p.position === 'Defensive Specialist');
  const starters = rosterPool.filter(p => p.isStarter);

  // Determine Designated First Server / S1
  let firstServer = null;
  if (preferredServerId) {
    firstServer = rosterPool.find(p => p.id === preferredServerId);
  }
  if (!firstServer) {
    firstServer = rosterPool.find(p => p.isFirstServer);
  }
  if (!firstServer) {
    firstServer = setters[0] || starters[0] || rosterPool[0];
  }

  // Resolve S1 and S2 (Setter / Right Side Pair)
  const s1 = (firstServer?.position === 'Setter')
    ? firstServer
    : (setters[0] || starters[0] || rosterPool[0]);

  const s2 = setters.find(p => p.id !== s1?.id) ||
             opposites.find(p => p.id !== s1?.id) ||
             starters.find(p => p.id !== s1?.id) ||
             rosterPool.find(p => p.id !== s1?.id);

  // Resolve Outsides (OH1 and OH2)
  const availableOH = outsides.filter(p => p.id !== s1?.id && p.id !== s2?.id);
  const oh1 = availableOH[0] || starters.find(p => p.id !== s1?.id && p.id !== s2?.id) || rosterPool[1];
  const oh2 = availableOH[1] || starters.find(p => p.id !== s1?.id && p.id !== s2?.id && p.id !== oh1?.id) || rosterPool[2];

  // Resolve Middles (MB1 and MB2 / Libero)
  const availableMB = middles.filter(p => p.id !== s1?.id && p.id !== s2?.id && p.id !== oh1?.id && p.id !== oh2?.id);
  const mb1 = availableMB[0] || starters.find(p => p.id !== s1?.id && p.id !== s2?.id && p.id !== oh1?.id && p.id !== oh2?.id) || rosterPool[3];
  const mb2OrLibero = liberos[0] || availableMB[1] || rosterPool[4];

  // Base Rotation 1 Lineup
  const baseLineup = {
    pos1: s1?.id || null,          // Setter 1 (Zone 1)
    pos2: oh1?.id || null,         // OH1 (Zone 2)
    pos3: mb1?.id || null,         // MB1 (Zone 3)
    pos4: s2?.id || null,          // Setter 2 / RS2 (Zone 4 - opposite S1)
    pos5: oh2?.id || null,         // OH2 (Zone 5 - opposite OH1)
    pos6: mb2OrLibero?.id || null  // MB2 / Libero (Zone 6 - opposite MB1)
  };

  const isFirstServerLibero = firstServer && (firstServer.position === 'Libero' || firstServer.isLibero);

  if (serveState === 'serve') {
    // SERVING FIRST: First server must start in Zone 1 (Position I)
    if (isFirstServerLibero) {
      return {
        pos1: firstServer.id,
        pos2: oh1?.id || null,
        pos3: mb1?.id || null,
        pos4: s2?.id || null,
        pos5: oh2?.id || null,
        pos6: s1?.id || null
      };
    }

    // Find which zone firstServer is in baseLineup, and rotate until in pos1
    let lineup = { ...baseLineup };
    for (let i = 0; i < 6; i++) {
      if (lineup.pos1 === firstServer?.id) break;
      lineup = rotateLineupClockwise(lineup);
    }
    return lineup;
  } else {
    // RECEIVING FIRST (USAV 7.3.5.2):
    // First server must start in Zone 2 so they rotate into Zone 1 on 1st side-out!
    if (isFirstServerLibero) {
      // RULE 19.3.1.1: Libero CANNOT start in front row (Zone 2)!
      // MB1 starts in Zone 2 (rotates to Z1 on side-out for Libero serve exchange)
      return {
        pos1: s1?.id || null,
        pos2: mb1?.id || null,
        pos3: oh1?.id || null,
        pos4: s2?.id || null,
        pos5: firstServer.id,
        pos6: oh2?.id || null
      };
    }

    // Find lineup where firstServer is in pos2 (rotates to pos1 on 1st side-out)
    let lineup = { ...baseLineup };
    for (let i = 0; i < 6; i++) {
      if (lineup.pos2 === firstServer?.id) break;
      lineup = rotateLineupClockwise(lineup);
    }
    return lineup;
  }
}

// Backwards-compatible alias
export const generate61LineupForServeState = generate62LineupForServeState;

/**
 * Detects smart tactical substitution opportunities based on the active 6-2 rotation and player settings.
 * Strictly adheres to all USAV, NFHS, and FIVB volleyball substitution rules:
 * - Libero NEVER enters front row (Zones 4, 3, 2).
 * - Position-locking and re-entry constraints (Rule 15.6 / NFHS 10-3).
 * - Traditional 6-2 Setter / Right Side substitution pairs (subbing in front-row hitter and back-row setter).
 * - Matches designated player substitution strategies (DS, Serving Specialist, Hitter Re-entry).
 *
 * @param {Object} currentLineup - Active court positions { pos1..pos6 }
 * @param {number} rotation - Current rotation 1..6
 * @param {string} phase - Current phase ('serve' | 'receive')
 * @param {Array} roster - Complete team roster array
 * @param {Array} subHistory - Substitution event log
 * @param {Object} options - { maxSubs: 12, enforcePositionLock: true }
 * @returns {Array} List of recommended substitution opportunities
 */
export function detect62SubstitutionOpportunities(
  currentLineup = {},
  rotation = 1,
  phase = 'serve',
  roster = [],
  subHistory = [],
  options = {}
) {
  if (!Array.isArray(roster) || roster.length === 0 || !currentLineup) {
    return [];
  }

  const recommendations = [];
  const assignedIds = Object.values(currentLineup).filter(Boolean);
  const benchPlayers = roster.filter(p => !assignedIds.includes(p.id) && p.status !== 'Injured');

  const getPlayer = (id) => roster.find(p => p.id === id);

  // 1. Classic 6-2 Setter / Right Side Sub Opportunity
  // When a setter rotates to the front row (Zone 4), sub in an attacking Right Side in front row and fresh Setter in back row (Zone 1)
  const z4Player = getPlayer(currentLineup.pos4);
  const z1Player = getPlayer(currentLineup.pos1);

  if (z4Player && z4Player.position === 'Setter') {
    const benchRS = benchPlayers.find(p => p.position === 'Opposite Hitter' || p.position === 'Right Side');
    const benchSetter = benchPlayers.find(p => p.position === 'Setter');

    if (benchRS) {
      const legality = checkSubstitutionLegality(benchRS, 'pos4', currentLineup, subHistory, options);
      if (legality.isLegal) {
        recommendations.push({
          id: `rec-62-rs-${benchRS.id}-${z4Player.id}`,
          priority: 'high',
          type: '62_setter_hitter_sub',
          incomingPlayer: benchRS,
          outgoingPlayer: z4Player,
          targetZone: 'pos4',
          zoneNum: 4,
          rotation,
          phase,
          isLiberoExchange: false,
          title: `6-2 Front-Row Hitter Sub: #${benchRS.number} ${benchRS.name}`,
          description: `Sub in Right Side attacker #${benchRS.number} ${benchRS.name} for Setter #${z4Player.number} ${z4Player.name} in Zone 4 to maximize front-row attacking power.`,
          ruleNote: 'Standard 6-2 offensive substitution (USAV 15.6).'
        });
      }
    }

    if (benchSetter && z1Player && (z1Player.position === 'Opposite Hitter' || z1Player.position === 'Right Side')) {
      const legality = checkSubstitutionLegality(benchSetter, 'pos1', currentLineup, subHistory, options);
      if (legality.isLegal) {
        recommendations.push({
          id: `rec-62-setter-${benchSetter.id}-${z1Player.id}`,
          priority: 'high',
          type: '62_setter_hitter_sub',
          incomingPlayer: benchSetter,
          outgoingPlayer: z1Player,
          targetZone: 'pos1',
          zoneNum: 1,
          rotation,
          phase,
          isLiberoExchange: false,
          title: `6-2 Back-Row Setter Sub: #${benchSetter.number} ${benchSetter.name}`,
          description: `Sub in Setter #${benchSetter.number} ${benchSetter.name} for #${z1Player.number} ${z1Player.name} in Zone 1 to run the 6-2 offense from the back row.`,
          ruleNote: 'Standard 6-2 offensive substitution (USAV 15.6).'
        });
      }
    }
  }

  // 1. Check Configured Sub Partners (from Player Settings)
  benchPlayers.forEach(benchPlayer => {
    const isLibero = benchPlayer.position === 'Libero' || benchPlayer.isLibero;

    if (benchPlayer.subPartnerId) {
      const partner = getPlayer(benchPlayer.subPartnerId);
      if (partner) {
        // Find which zone partner occupies
        const zoneEntry = Object.entries(currentLineup).find(([k, id]) => id === partner.id);
        if (zoneEntry) {
          const [zoneKey] = zoneEntry;
          const isFrontRow = FRONT_ROW_ZONES.includes(zoneKey);
          const isBackRow = BACK_ROW_ZONES.includes(zoneKey);
          const isServingZone = zoneKey === 'pos1' && phase === 'serve';

          // Check if trigger matches
          let triggerMatches = false;
          if (benchPlayer.subTrigger === 'back_row' && isBackRow) {
            triggerMatches = true;
          } else if (benchPlayer.subTrigger === 'serving' && isServingZone) {
            triggerMatches = true;
          } else if (benchPlayer.subTrigger === 'front_row' && isFrontRow && !isLibero) {
            triggerMatches = true;
          } else if (!benchPlayer.subTrigger && isBackRow) {
            // Default trigger for DS/Libero is back row
            triggerMatches = true;
          }

          // Rule Check: Libero can NEVER enter front row!
          if (isLibero && isFrontRow) {
            triggerMatches = false;
          }

          if (triggerMatches) {
            const legality = checkSubstitutionLegality(benchPlayer, zoneKey, currentLineup, subHistory, options);
            if (legality.isLegal) {
              const zoneNum = ZONE_LABELS[zoneKey]?.num || zoneKey;
              recommendations.push({
                id: `rec-partner-${benchPlayer.id}-${partner.id}`,
                priority: 'high',
                type: 'configured_partner',
                incomingPlayer: benchPlayer,
                outgoingPlayer: partner,
                targetZone: zoneKey,
                zoneNum,
                rotation,
                phase,
                isLiberoExchange: isLibero,
                title: `Designated Sub: #${benchPlayer.number} ${benchPlayer.name}`,
                description: `Sub in #${benchPlayer.number} ${benchPlayer.name} (${benchPlayer.position}) for #${partner.number} ${partner.name} in Zone ${zoneNum} (${isBackRow ? 'Back Row' : isServingZone ? 'Server' : 'Front Row'}).`,
                ruleNote: isLibero ? 'Free Libero back-row replacement (USAV 19.3.2).' : 'Follows configured player substitution strategy.'
              });
            }
          }
        }
      }
    }
  });

  // 2. Defensive Specialist (DS) Smart Opportunity
  const dsBench = benchPlayers.filter(p => (p.position === 'Defensive Specialist' || p.secondaryPosition === 'Defensive Specialist') && !p.subPartnerId);
  dsBench.forEach(ds => {
    // Find back-row Outside Hitter or Opposite
    BACK_ROW_ZONES.forEach(zoneKey => {
      const occupantId = currentLineup[zoneKey];
      const occupant = getPlayer(occupantId);
      if (occupant && (occupant.position === 'Outside Hitter' || occupant.position === 'Opposite Hitter' || occupant.position === 'Right Side')) {
        const legality = checkSubstitutionLegality(ds, zoneKey, currentLineup, subHistory, options);
        if (legality.isLegal) {
          const zoneNum = ZONE_LABELS[zoneKey]?.num || zoneKey;
          recommendations.push({
            id: `rec-ds-${ds.id}-${occupant.id}`,
            priority: 'medium',
            type: 'defensive_specialist',
            incomingPlayer: ds,
            outgoingPlayer: occupant,
            targetZone: zoneKey,
            zoneNum,
            rotation,
            phase,
            isLiberoExchange: false,
            title: `Defensive Upgrade: #${ds.number} ${ds.name}`,
            description: `Sub in Defensive Specialist #${ds.number} ${ds.name} for #${occupant.number} ${occupant.name} in Zone ${zoneNum} to boost back-row serve receive and digging.`,
            ruleNote: 'Counts as 1 team substitution. Regular starter may re-enter when rotating to front row (Rule 15.6).'
          });
        }
      }
    });
  });

  // 3. Serving Specialist (SS) Smart Opportunity (When in Zone 1 on Serve)
  if (phase === 'serve') {
    const serverId = currentLineup.pos1;
    const currentServer = getPlayer(serverId);
    const ssBench = benchPlayers.filter(p => p.position === 'Serving Specialist' || p.secondaryPosition === 'Serving Specialist');

    ssBench.forEach(ss => {
      if (currentServer && currentServer.position !== 'Serving Specialist' && !currentServer.isFirstServer) {
        const legality = checkSubstitutionLegality(ss, 'pos1', currentLineup, subHistory, options);
        if (legality.isLegal) {
          recommendations.push({
            id: `rec-ss-${ss.id}-${currentServer.id}`,
            priority: 'medium',
            type: 'serving_specialist',
            incomingPlayer: ss,
            outgoingPlayer: currentServer,
            targetZone: 'pos1',
            zoneNum: 1,
            rotation,
            phase,
            isLiberoExchange: false,
            title: `Serving Specialist: #${ss.number} ${ss.name}`,
            description: `Sub in #${ss.number} ${ss.name} to take the opening serve in Zone 1 for #${currentServer.number} ${currentServer.name}.`,
            ruleNote: 'Enters server position (Zone 1).'
          });
        }
      }
    });
  }

  // 4. Starter Re-Entry Opportunity (Rule 15.6: Starter returns to front row)
  FRONT_ROW_ZONES.forEach(zoneKey => {
    const currentOccupantId = currentLineup[zoneKey];
    const currentOccupant = getPlayer(currentOccupantId);
    if (currentOccupant && (currentOccupant.position === 'Defensive Specialist' || currentOccupant.position === 'Serving Specialist')) {
      // Find original starter who was subbed out for this player
      const subRecord = subHistory.find(s => s.incomingPlayerId === currentOccupant.id && !s.isLiberoExchange);
      if (subRecord) {
        const originalStarter = getPlayer(subRecord.outgoingPlayerId);
        if (originalStarter && benchPlayers.some(p => p.id === originalStarter.id)) {
          const legality = checkSubstitutionLegality(originalStarter, zoneKey, currentLineup, subHistory, options);
          if (legality.isLegal) {
            const zoneNum = ZONE_LABELS[zoneKey]?.num || zoneKey;
            recommendations.push({
              id: `rec-reentry-${originalStarter.id}-${currentOccupant.id}`,
              priority: 'high',
              type: 'starter_reentry',
              incomingPlayer: originalStarter,
              outgoingPlayer: currentOccupant,
              targetZone: zoneKey,
              zoneNum,
              rotation,
              phase,
              isLiberoExchange: false,
              title: `Front-Row Re-Entry: #${originalStarter.number} ${originalStarter.name}`,
              description: `Re-enter primary attacker #${originalStarter.number} ${originalStarter.name} (${originalStarter.position}) for #${currentOccupant.number} ${currentOccupant.name} as they rotate into front row (Zone ${zoneNum}).`,
              ruleNote: 'Legal starter re-entry in same rotational position (USAV 15.6 / NFHS 10-3).'
            });
          }
        }
      }
    }
  });

  return recommendations;
}

// Backwards-compatible alias
export const detect61SubstitutionOpportunities = detect62SubstitutionOpportunities;


