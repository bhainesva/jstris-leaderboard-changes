const getLeaderboardAnalyzer = leaderboardSize => ({
  compareRankings: getRankingsComparer(leaderboardSize),
  describeChange: getChangeDescriber(leaderboardSize)
});

const reportChange = (details) => {
  // TODO: hit discord API here I guess
}

const changeType = {
  RISE: "rise",
  FALL: "fall",
  ENTER: "enter",
  EXIT: "exit",
};

const getChangeType = details => {
  if (!details.oldPos && details.newPos) {
    return changeType.ENTER;
  } else if (details.oldPos && !details.newPos) {
    return changeType.EXIT;
  } else if (details.oldPos < details.newPos) {
    return changeType.FALL;
  } else {
    return changeType.RISE;
  }
}

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
    newPos: nu.pos,
    newGame: nu.game,
    newId: nu.id,
  }
}

const getChangeDescriber = leaderboardSize => details => {
  const type = getChangeType(details);
  if (type === changeType.ENTER) {
    return `${details.name} entered the top ${leaderboardSize} at position ${details.newPos} with a time of ${details.newGame}`;
  } else if (type === changeType.EXIT) {
    return `${details.name} fell out of the top ${leaderboardSize}`
  }
  const changeDescriptor = (type === changeType.FALL) ? 'fell' : 'rose';
  const changeDetails = (type === changeType.FALL) ? '' : ` with a new time of ${details.newGame}`;
  return `${details.name} ${changeDescriptor} from position ${details.oldPos} to position ${details.newPos}${changeDetails}`;
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
  reportChange,
  changeType,
  getChangeType,
}