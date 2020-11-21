const assertEquals = (actual, expected) => {
  if (actual !== expected) {
    throw new Error(`got: ${actual}\nexpected: ${expected}`);
  }
}

export {
  assertEquals,
}