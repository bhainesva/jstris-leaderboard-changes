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

export {
  handleSettledPromise,
  filter,
  map,
  fail,
}