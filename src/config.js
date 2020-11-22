const getFileName = report => {
  const { game, mode=1 } = report;
  return `${game}-${mode}.json`;
}

const getUrl = report => {
  const { game, mode=1 } = report;
  return `https://jstris.jezevec10.com/api/leaderboard/${game}?mode=${mode}&offset=0`;
}

export {
  getFileName,
  getUrl,
}