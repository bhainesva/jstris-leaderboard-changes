const handleSettledPromise = (success, failure) => p => {
  return p.status === "fulfilled" ?
    success(p) :
    failure(p);
}

const filter = f => iter => iter.filter(f);
const map = f => iter => iter.map(f);

const fail = err => {
  console.error(err)
  process.exitCode = 1;
}

const chunkLines = (size, lines) => {
  const chunks = lines.reduce((acc, cur) => {
    if (acc.length && (acc[acc.length-1].length + cur.length + 1) <= size) {
      acc[acc.length-1] = [acc[acc.length-1], cur].join('\n')
    } else {
      acc.push(cur)
    }
    return acc;
  }, []);

  return chunks
}

export {
  handleSettledPromise,
  filter,
  map,
  fail,
  chunkLines,
}