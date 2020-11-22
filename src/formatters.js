import { getChangeType, changeType, sortDetails } from './changeDetails.js';

const formatTime = secs => {
  const isoStr = new Date(secs * 1000).toISOString();
  return isoStr.substr(11, isoStr.length - 12).replace(/^[0:]+/, "").replace(/\.?0+$/, "");
}

const formatMessageBody = changes => {
  const maxNameLength = Math.max(...changes.map(details => details.name.length));
  return sortDetails(changes)
    .map(details => formatDetails(details, maxNameLength))
    .join('\n') || 'No changes';
}

const formatDetails = (details, pad = 0) => {
  const type = getChangeType(details);
  const changeDescriptor = (type === changeType.FALL || type === changeType.EXIT) ? '▼' : '▲';
  const extension = (type !== changeType.EXIT) ? ` [${details.newGame}]` : ''

  return `${String(details.oldPos || '').padStart(4, ' ')} ${changeDescriptor}${String(details.newPos || '').padStart(4, ' ')} ${details.name.padEnd(pad, ' ')}${extension}`;
}

const getMarkdownFormatter = config => changes => {
  const { name, formatTime: fTime  = true } = config;
  const preparedChanges = fTime ?
    changes.map(details => ({
      ...details,
      newGame: details.newGame && formatTime(details.newGame)
    })) :
    changes;
  const summary = formatMessageBody(preparedChanges);
  return '**'+ name + '** Changes\n```css\n' + summary + '```'
}

const getTextFormatter = config => changes => {
  const { name, formatTime: fTime = true } = config;
  const preparedChanges = fTime ?
    changes.map(details => ({
      ...details,
      newGame: details.newGame && formatTime(details.newGame)
    })) :
    changes;
  const summary = formatMessageBody(preparedChanges);
  return `${name} Changes\n${summary}`;
}

export {
  formatTime,
  getMarkdownFormatter,
  getTextFormatter,
}