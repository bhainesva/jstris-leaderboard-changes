const getLeaderboardAnalyzer = config => {
  const { top=500 } = config;
  return {
    compareRankings: getRankingsComparer(top),
    describeChanges,
  }
};

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
const compareType = (a, b) => {
  const order = [changeType.RISE, changeType.ENTER, changeType.FALL, changeType.EXIT];
  return order.indexOf(a) - order.indexOf(b);
}

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

const sortChanges = changes => [...changes].sort((a, b) => {
  const typeA = getChangeType(a);
  const typeB = getChangeType(b);
  if (typeA !== typeB) return compareType(typeA, typeB)
  if (typeA === compareType.EXIT) return a.oldPos - b.oldPos
  return a.newPos - b.newPos;
});

const describeChanges = changes => {
  const maxNameLength = Math.max(...changes.map(details => details.name.length));
  const summary = sortChanges(changes)
    .map(details => describeChange(details, maxNameLength))
    .join('\n');

  return summary || 'No changes';
}

const describeChange = (details, pad = 0) => {
  const type = getChangeType(details);
  const changeDescriptor = (type === changeType.FALL || type === changeType.EXIT) ? '▼' : '▲';
  const extension = (type !== changeType.EXIT) ? ` [${details.newGame}]` : ''

  return `${String(details.oldPos || '').padStart(4, ' ')} ${changeDescriptor}${String(details.newPos || '').padStart(4, ' ')} ${details.name.padEnd(pad, ' ')}${extension}`;
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
