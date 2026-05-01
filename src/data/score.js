// Shared scoring utility for all cases.
export function calculateScore(leadsVisited, isCorrect, sherlockLeadCount = 7) {
  const playerLeads = leadsVisited;

  if (!isCorrect) return 0;

  if (playerLeads <= sherlockLeadCount) return 100;
  if (playerLeads <= sherlockLeadCount + 2) return 80;
  if (playerLeads <= sherlockLeadCount + 4) return 60;
  if (playerLeads <= sherlockLeadCount + 6) return 40;
  return 20;
}

export function getVisitedLeadsCount(leadsVisited) {
  if (typeof leadsVisited === 'number') return leadsVisited;
  if (leadsVisited && typeof leadsVisited.size === 'number') return leadsVisited.size;
  return 0;
}

export function calculateWeightedScore({
  leadsVisited,
  sherlockLeadCount = 7,
  killerMatch,
  motiveMatch,
  methodMatch,
}) {
  const visitedLeadsCount = getVisitedLeadsCount(leadsVisited);
  const efficiencyMultiplier = Math.min(1, sherlockLeadCount / Math.max(1, visitedLeadsCount));
  const killerScore = killerMatch ? 80 * efficiencyMultiplier : 0;
  const motiveScore = motiveMatch ? 10 : 0;
  const methodScore = methodMatch ? 10 : 0;

  return Math.round(killerScore + motiveScore + methodScore);
}