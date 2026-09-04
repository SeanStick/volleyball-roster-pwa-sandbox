/**
 * Statistical Intelligence & 6-2 Lineup Optimization Engine
 * Analyzes matchHistory and active matchStats to recommend optimal player placement,
 * primary/secondary role matchups, and instant injury/absence replacements.
 */

/**
 * Aggregates all player performance stats across past matches and current game.
 * @param {Array} roster - Full team roster
 * @param {Array} matchHistory - Historical matches
 * @param {Object} currentMatchStats - Active live match stats
 * @returns {Object} Map of playerId -> aggregated statistics
 */
export function aggregatePlayerStats(roster = [], matchHistory = [], currentMatchStats = null) {
  const statsMap = {};

  // Initialize for all rostered players
  roster.forEach(p => {
    statsMap[p.id] = {
      playerId: p.id,
      name: p.name,
      number: p.number,
      primaryPosition: p.position,
      secondaryPosition: p.secondaryPosition || '',
      status: p.status || 'Active',
      isAvailable: p.status !== 'Injured' && p.status !== 'Absent' && p.status !== 'Out',
      kills: 0,
      attackErrors: 0,
      aces: 0,
      serviceErrors: 0,
      blocks: 0,
      digs: 0,
      plusMinus: 0,
      totalPointsRecorded: 0
    };
  });

  // Collect points from past matches
  const allPoints = [];
  (matchHistory || []).forEach(match => {
    if (Array.isArray(match.pointHistory)) {
      allPoints.push(...match.pointHistory);
    }
  });

  // Include current active match points
  if (currentMatchStats && Array.isArray(currentMatchStats.pointHistory)) {
    allPoints.push(...currentMatchStats.pointHistory);
  }

  // Process all recorded rallies
  allPoints.forEach(pt => {
    // Earned Points
    if (pt.earnedPlayerId && statsMap[pt.earnedPlayerId]) {
      const pStats = statsMap[pt.earnedPlayerId];
      pStats.totalPointsRecorded++;
      pStats.plusMinus += 1;

      if (pt.earnedType === 'kill') pStats.kills++;
      else if (pt.earnedType === 'ace') pStats.aces++;
      else if (pt.earnedType === 'block') pStats.blocks++;
    }

    // Errors
    if (pt.errorPlayerId && statsMap[pt.errorPlayerId]) {
      const pStats = statsMap[pt.errorPlayerId];
      pStats.totalPointsRecorded++;
      pStats.plusMinus -= 1;

      if (pt.errorCategory === 'Attack Errors' || (pt.errorTypeId && pt.errorTypeId.startsWith('attack_'))) {
        pStats.attackErrors++;
      } else if (pt.errorCategory === 'Service Errors' || (pt.errorTypeId && pt.errorTypeId.startsWith('missed_serve_'))) {
        pStats.serviceErrors++;
      }
    }
  });

  return statsMap;
}

/**
 * Computes a positional suitability rating (0-100) for a player in a specific role.
 * Considers:
 * 1. Primary position match (+40)
 * 2. Secondary position match (+25)
 * 3. Statistical metrics (kills, aces, blocks, plus/minus) (+0 to 35)
 */
export function computePositionFitScore(player, roleKey, playerStats) {
  if (!player) return 0;

  const stats = playerStats[player.id] || {};
  let score = 20; // baseline

  const primary = (player.position || '').toLowerCase();
  const secondary = (player.secondaryPosition || '').toLowerCase();

  switch (roleKey) {
    case 'setter': {
      const isPrimary = primary.includes('setter');
      const isSecondary = secondary.includes('setter') || secondary.includes('right side');
      const isOpposite = primary.includes('opposite') || primary.includes('right side');

      if (isPrimary) score += 45;
      else if (isOpposite) score += 35;
      else if (isSecondary) score += 25;

      // Stats: Aces & low service errors
      const aceBonus = Math.min(15, (stats.aces || 0) * 3);
      const pmBonus = Math.max(-10, Math.min(15, (stats.plusMinus || 0) * 2));
      score += aceBonus + pmBonus;
      break;
    }

    case 'outside': {
      const isPrimary = primary.includes('outside');
      const isSecondary = secondary.includes('outside');

      if (isPrimary) score += 45;
      else if (isSecondary) score += 25;

      // Stats: Kills, aces, +/-
      const killBonus = Math.min(20, (stats.kills || 0) * 2);
      const attackEffBonus = (stats.kills || 0) > (stats.attackErrors || 0) ? 10 : -5;
      score += killBonus + attackEffBonus;
      break;
    }

    case 'middle': {
      const isPrimary = primary.includes('middle');
      const isSecondary = secondary.includes('middle');

      if (isPrimary) score += 45;
      else if (isSecondary) score += 25;

      // Stats: Blocks & quick kills
      const blockBonus = Math.min(20, (stats.blocks || 0) * 4);
      const killBonus = Math.min(15, (stats.kills || 0) * 2);
      score += blockBonus + killBonus;
      break;
    }

    case 'libero': {
      const isPrimary = primary.includes('libero') || player.isLibero;
      const isDS = primary.includes('defensive');
      const isSecondary = secondary.includes('libero') || secondary.includes('defensive');

      if (isPrimary) score += 50;
      else if (isDS) score += 40;
      else if (isSecondary) score += 25;

      // Low errors & defensive contributions
      const lowErrorBonus = (stats.serviceErrors || 0) <= 2 ? 15 : 5;
      score += lowErrorBonus;
      break;
    }

    default:
      break;
  }

  return Math.max(5, Math.min(100, Math.round(score)));
}

/**
 * Intelligent 6-2 Lineup Solver.
 * Evaluates all available players on the roster and suggests the optimal starting 6-2 rotation.
 * 6-2 System:
 * - Zone 1 (RB) = Setter 1  <--> Zone 4 (LF) = Setter 2 / Opposite
 * - Zone 2 (RF) = Outside 1 <--> Zone 5 (LB) = Outside 2
 * - Zone 3 (MF) = Middle 1  <--> Zone 6 (MB) = Middle 2 (replaced by Libero in back row)
 */
export function generateOptimal62Lineup(roster = [], matchHistory = [], currentMatchStats = null) {
  if (!Array.isArray(roster) || roster.length === 0) {
    return { lineup: { pos1: null, pos2: null, pos3: null, pos4: null, pos5: null, pos6: null }, liberoId: null };
  }

  const statsMap = aggregatePlayerStats(roster, matchHistory, currentMatchStats);

  // Filter available players (not injured or absent)
  const availablePool = roster.filter(p => p.status !== 'Injured' && p.status !== 'Absent' && p.status !== 'Out');
  const pool = availablePool.length >= 6 ? availablePool : roster;

  // Separate and score players by role
  const scoredPlayers = pool.map(p => ({
    player: p,
    setterScore: computePositionFitScore(p, 'setter', statsMap),
    outsideScore: computePositionFitScore(p, 'outside', statsMap),
    middleScore: computePositionFitScore(p, 'middle', statsMap),
    liberoScore: computePositionFitScore(p, 'libero', statsMap)
  }));

  // Identify Best Libero
  const libCandidates = [...scoredPlayers]
    .filter(sp => sp.player.position === 'Libero' || sp.player.isLibero || sp.player.position === 'Defensive Specialist')
    .sort((a, b) => b.liberoScore - a.liberoScore);
  const bestLibero = libCandidates[0]?.player || pool.find(p => p.position === 'Libero' || p.isLibero) || null;

  // Non-libero candidates for the 6 on-court zones
  const courtCandidates = scoredPlayers.filter(sp => sp.player.id !== bestLibero?.id);

  // 1. Pick Top 2 Setters / Opposites
  const setterRanked = [...courtCandidates].sort((a, b) => b.setterScore - a.setterScore);
  const s1 = setterRanked[0]?.player || null;
  const s2 = setterRanked.find(sp => sp.player.id !== s1?.id)?.player || null;

  const pickedIds = new Set([s1?.id, s2?.id].filter(Boolean));

  // 2. Pick Top 2 Outside Hitters
  const outsideRanked = courtCandidates
    .filter(sp => !pickedIds.has(sp.player.id))
    .sort((a, b) => b.outsideScore - a.outsideScore);
  const oh1 = outsideRanked[0]?.player || null;
  if (oh1) pickedIds.add(oh1.id);
  const oh2 = outsideRanked.find(sp => !pickedIds.has(sp.player.id))?.player || null;
  if (oh2) pickedIds.add(oh2.id);

  // 3. Pick Top 2 Middle Blockers
  const middleRanked = courtCandidates
    .filter(sp => !pickedIds.has(sp.player.id))
    .sort((a, b) => b.middleScore - a.middleScore);
  const mb1 = middleRanked[0]?.player || null;
  if (mb1) pickedIds.add(mb1.id);
  const mb2 = middleRanked.find(sp => !pickedIds.has(sp.player.id))?.player || null;
  if (mb2) pickedIds.add(mb2.id);

  // Fallbacks if team is short on specific positions
  const remaining = pool.filter(p => !pickedIds.has(p.id) && p.id !== bestLibero?.id);
  const getOrFallback = (current, fallbackIdx) => current?.id || remaining[fallbackIdx]?.id || pool[fallbackIdx]?.id || null;

  const finalLineup = {
    pos1: s1?.id || getOrFallback(s1, 0),
    pos2: oh1?.id || getOrFallback(oh1, 1),
    pos3: mb1?.id || getOrFallback(mb1, 2),
    pos4: s2?.id || getOrFallback(s2, 3),
    pos5: oh2?.id || getOrFallback(oh2, 4),
    pos6: mb2?.id || getOrFallback(mb2, 5)
  };

  return {
    lineup: finalLineup,
    liberoId: bestLibero?.id || null,
    statsMap
  };
}

/**
 * Finds the single best available bench replacement when a player is absent or injured,
 * ensuring the 6-2 rotation pairing remains intact.
 */
export function findBestSubReplacement(zoneKey, currentLineup, roster = [], matchHistory = [], currentMatchStats = null) {
  const statsMap = aggregatePlayerStats(roster, matchHistory, currentMatchStats);
  const onCourtIds = new Set(Object.values(currentLineup).filter(Boolean));

  // Benchmark role for this zone in 6-2:
  // pos1 & pos4: Setter / Right Side
  // pos2 & pos5: Outside Hitter
  // pos3 & pos6: Middle Blocker
  let targetRole = 'outside';
  if (zoneKey === 'pos1' || zoneKey === 'pos4') targetRole = 'setter';
  else if (zoneKey === 'pos3' || zoneKey === 'pos6') targetRole = 'middle';

  // Find available bench players (not already on court, not injured/absent, not libero in front row)
  const benchEligible = roster.filter(p => {
    if (onCourtIds.has(p.id)) return false;
    if (p.status === 'Injured' || p.status === 'Absent' || p.status === 'Out') return false;
    // Front row libero prevention
    if ((zoneKey === 'pos2' || zoneKey === 'pos3' || zoneKey === 'pos4') && (p.position === 'Libero' || p.isLibero)) {
      return false;
    }
    return true;
  });

  if (benchEligible.length === 0) return null;

  // Score candidates for this specific zone role
  const scored = benchEligible.map(player => ({
    player,
    fitScore: computePositionFitScore(player, targetRole, statsMap),
    stats: statsMap[player.id] || {}
  })).sort((a, b) => b.fitScore - a.fitScore);

  return scored[0];
}
