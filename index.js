import { promises as fs } from 'fs';
import { changeType, getChangeType, getLeaderboardAnalyzer } from './src/leaderboardAnalyzer.js';
import { getFileName, getUrl } from './src/config.js';
import { getDiscordClient } from './src/discord.js';
import parseArgs from 'minimist';

import bent from 'bent';
const getJSON = bent('json');

const fail = err => {
  console.log(err)
  process.exitCode = 1;
}

const filter = f => iter => iter.filter(f);

const getReportRunner = config => reportConfig => {
  const { compareRankings, describeChanges } = getLeaderboardAnalyzer(reportConfig);
  const fileName = getFileName(reportConfig);

  const loadingResult = Promise.all([
    fs.readFile(fileName).then(JSON.parse),
    getJSON(getUrl(reportConfig))]
  );

  // You can only drop ranks when other people gain ranks, reporting them is a lot
  // of noise so we filter them out
  const compareResult = loadingResult.then(res => compareRankings(...res))
    .then(filter(details => getChangeType(details) !== changeType.FALL))

  const summarizeResult = compareResult.then(describeChanges);

  if (config.discordWebhook) {
    const { sendMessage } = getDiscordClient(config.discordWebhook);
    summarizeResult.then(summary => sendMessage(reportConfig.name + ' Leaderboard Changes\n```' + summary + '```'));
  } else {
    summarizeResult.then(res => console.log(`${reportConfig.name} Leaderboard Changes\n${res}`));
  }

  // If everything succeeded, replace old data file with new one
  Promise.all([loadingResult, summarizeResult])
    .then(res => fs.writeFile(fileName, JSON.stringify(res[0][1])))
    .catch(fail);
}

const main = async () => {
  const argv = parseArgs(process.argv.slice(2));
  const configPath = argv['config'] || argv['c'] || 'config.json';

  const config = await fs.readFile(configPath)
    .then(JSON.parse)
    .catch(fail);
  if (!config) return;

  const run = getReportRunner(config);
  config.reports.forEach(run);
}

main();