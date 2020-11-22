import bent from 'bent';

const resolveAfter = ms => new Promise(ok => setTimeout(ok, ms));

export const getDiscordClient = url => {
  const post = bent('POST', 200, 204);
  let queue = Promise.resolve();

  const handleRateLimitHeaders = resp => {
    const remaining = Number(resp.headers['x-ratelimit-remaining']);
    const refreshIn = Number(resp.headers['x-ratelimit-reset-after']);
    return remaining === 0 ?
      resolveAfter(refreshIn * 1000) :
      Promise.resolve();
  }

  const sendMessage = msg => {
    const res = queue.then(() => post(url, {content: msg}));
    queue = queue.then(() => res.then(handleRateLimitHeaders));
    return res;
  }

  return {
    sendMessage,
  }
}