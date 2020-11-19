import { promises as fs } from 'fs';
import { changeType, getChangeType, getLeaderboardAnalyzer, reportChange } from './src/leaderboardAnalyzer.js';
import bent from 'bent';
const getJSON = bent('json');

// What portion of the leaderboard should be checked, 0 < TOP_X <= 500;
const TOP_X = 100;

// Which leaderboard are we interested in
const GAME = 1;
const MODE = 1;

const fail = err => {
  console.log(err)
  process.exitCode = 1;
}

const map = f => iter => iter.map(f);
const filter = f => iter => iter.filter(f);

const main = async () => {
  const { compareRankings, describeChange } = getLeaderboardAnalyzer(TOP_X);

  const loadingResult = Promise.all([
    fs.readFile('data/old.json').then(JSON.parse),
    getJSON("https://jstris.jezevec10.com/api/leaderboard/1?mode=1&offset=0")]
  );

  // You can only drop ranks when other people gain ranks, reporting them is a lot
  // of noise so we filter them out
  const compareResult = loadingResult.then(res => compareRankings(...res))
    .then(filter(details => getChangeType(details) !== changeType.FALL));

  const summarizeResult = compareResult.then(map(describeChange))
    .then(map(val => console.log(val)))

  // Currerntly no-op, could replace with discord api call or something
  const reportResult = compareResult.then(map(reportChange))

  // If everything succeeded, replace old data file with new one
  Promise.all([loadingResult, summarizeResult, reportResult])
    .then(res => fs.writeFile('data/old.json', JSON.stringify(res[0][1])))
    .catch(fail);
}

main();