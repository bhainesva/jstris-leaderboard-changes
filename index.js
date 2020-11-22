import { promises as fs } from 'fs';
import { changeType, getChangeType, getLeaderboardAnalyzer } from './src/leaderboardAnalyzer.js';
import { getFileName, getUrl } from './src/config.js';
import { getDiscordClient } from './src/discord.js';
import { getMarkdownFormatter, getTextFormatter } from './src/formatters.js';
import { fail, handleSettledPromise, map, filter } from './src/util.js';
import parseArgs from 'minimist';

import bent from 'bent';
const getJSON = bent('json');
const dataFolder = 'data'

const getReportProcessor = config => reportConfig => {
  const sendReport = config.discordWebhook ?
    getDiscordClient(config.discordWebhook).sendMessage :
    msg => Promise.resolve(console.log(msg));

  const format = config.discordWebhook ?
    getMarkdownFormatter(reportConfig) :
    getTextFormatter(reportConfig)

  const fileName = getFileName(reportConfig);

  const loadingResult = Promise.all([
    fs.readFile(`${dataFolder}/${fileName}`).then(JSON.parse),
    getJSON(getUrl(reportConfig))]
  );

  const prepareReporter = compareResults => () => {
    if (config.skipEmpty && !compareResults.length) return;

    const formattedResults = format(compareResults);
    return sendReport(formattedResults)
              .then(() => loadingResult.then(res => fs.writeFile(`${dataFolder}/${fileName}`, JSON.stringify(res[1]))))
              .catch(fail);
  }

  // You can only drop ranks when other people gain ranks, reporting them is a lot
  // of noise so we filter them out
  const { compareRankings } = getLeaderboardAnalyzer(reportConfig);
  const compareResult = loadingResult.then(res => compareRankings(...res))
    .then(filter(details => getChangeType(details) !== changeType.FALL))
    .then(prepareReporter);

  return compareResult.catch(err => Promise.reject(`${reportConfig.name} failed: ${err}`));
}

const main = async () => {
  const argv = parseArgs(process.argv.slice(2));
  const configPath = argv['config'] || argv['c'] || 'config.json';

  const config = await fs.readFile(configPath)
    .then(JSON.parse)
    .catch(fail);
  if (!config) return;

  const runProcessor = getReportProcessor(config);

  const reporters = await Promise.allSettled(config.reports.map(runProcessor));
  const settledReporterHandler = handleSettledPromise(p => p.value().catch(fail), p => fail(p.reason));
  reporters.reduce((promise, cur) => promise.then(() => settledReporterHandler(cur)), Promise.resolve())
    .catch(fail);
}

main();
