const changeType = {
  RISE: "rise",
  FALL: "fall",
  ENTER: "enter",
  EXIT: "exit",
};

const getChangeType = details => {
  if (!details.oldPos && details.newPos) {
    return changeType.ENTER;
  } else if (details.oldPos && !details.newPos) {
    return changeType.EXIT;
  } else if (details.oldPos < details.newPos) {
    return changeType.FALL;
  } else {
    return changeType.RISE;
  }
}

const compareType = (a, b) => {
  const order = [changeType.RISE, changeType.ENTER, changeType.FALL, changeType.EXIT];
  return order.indexOf(a) - order.indexOf(b);
}

const sortDetails = changes => [...changes].sort((a, b) => {
  const typeA = getChangeType(a);
  const typeB = getChangeType(b);
  if (typeA !== typeB) return compareType(typeA, typeB)
  if (typeA === compareType.EXIT) return a.oldPos - b.oldPos
  return a.newPos - b.newPos;
});

export {
  changeType,
  getChangeType,
  sortDetails,
}