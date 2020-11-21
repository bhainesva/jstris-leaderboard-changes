import { getChangeType, changeType, sortDetails } from './changeDetails.js';

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

const getMarkdownFormatter = title => changes => {
  const summary = formatMessageBody(changes);
  return '**'+ title + '** Changes\n```css\n' + summary + '```'
}

const getTextFormatter = title => changes => {
  const summary = formatMessageBody(changes);
  return `${title} Changes\n${summary}`;
}

export {
  getMarkdownFormatter,
  getTextFormatter,
}