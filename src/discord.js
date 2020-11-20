import bent from 'bent';

export const getDiscordClient = url => {
  const post = bent('POST', 200, 204);
  return {
    sendMessage: msg => post(url, {content: msg}),
  }
}