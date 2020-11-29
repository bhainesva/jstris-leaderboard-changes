import { getChangeType, changeType } from './changeDetails.js';

const getLeaderboardAnalyzer = config => {
  const { top=500 } = config;
  return {
    compareRankings: getRankingsComparer(top),
  }
};

// ---- Internal -------------------------
const getChangeDetails = (oldPlacing, newPlacing) => {
  const old = oldPlacing || {};
  const nu = newPlacing || {};

  if (old.pos === nu.pos) return null;

  return {
    name: old.name || nu.name,
    oldPos: old.pos,
    oldGame: old.game,
    oldId: old.id,
    oldTs: old.ts,
    newPos: nu.pos,
    newGame: nu.game,
    newId: nu.id,
    newTs: nu.ts,
  }
}

const placingByName = (placements) => placements.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.name]: curr,
    }
  }, {})

const getRankingsComparer = leaderboardSize => (old, nu) => {
  if (old.length < leaderboardSize || nu.length < leaderboardSize) {
    throw new Error(`leaderboardAnalyzer intialized for size ${leaderboardSize} was not provided enough data`);
  }
  const oldPlacingsByName = placingByName(old.slice(0, leaderboardSize));
  const newPlacingsByName = placingByName(nu.slice(0, leaderboardSize));

  const uniqueUsers = Array.from(new Set([...Object.keys(oldPlacingsByName), ...Object.keys(newPlacingsByName)]))
  return uniqueUsers.map(user => getChangeDetails(oldPlacingsByName[user], newPlacingsByName[user]))
    .filter(change => change !== null);
}

export {
  getLeaderboardAnalyzer,
  getChangeDetails,
  changeType,
  getChangeType,
}
