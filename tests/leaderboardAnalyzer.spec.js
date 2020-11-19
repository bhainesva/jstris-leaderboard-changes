import hg from 'highground';
import { getLeaderboardAnalyzer, getChangeDetails, changeType, getChangeType } from '../src/leaderboardAnalyzer.js';

const {describe, it} = hg;

const assertEquals = (actual, expected) => {
  if (actual !== expected) {
    throw new Error(`got: ${actual}\nexpected: ${expected}`);
  }
}

describe("compareRankings", () => {
  it("gives expected results", () => {
    const old = [
      {id: 1, pos: 1, game: 10, ts: "2018-05-27 10:25:10", name: "A"},
      {id: 2, pos: 2, game: 11, ts: "2018-05-27 10:25:10", name: "B"},
      {id: 3, pos: 3, game: 12, ts: "2018-05-27 10:25:10", name: "C"},
      {id: 4, pos: 4, game: 13, ts: "2018-05-27 10:25:10", name: "D"},
    ];
    const nu = [
      {id: 11, pos: 1, game: 6, ts: "2018-05-27 10:25:10", name: "F"},
      {id: 12, pos: 2, game: 7, ts: "2018-05-27 10:25:10", name: "D"},
      {id: 13, pos: 3, game: 8, ts: "2018-05-27 10:25:10", name: "C"},
      {id: 1, pos: 4, game: 10, ts: "2018-05-27 10:25:10", name: "A"},
    ];
    const compare = (a, b) => {
      return a.name === b.name && a.oldPos === b.oldPos && a.oldGame === b.oldGame && a.oldId === b.oldId &&
        a.newPos === b.newPos && a.newGame === b.newGame && a.newId === b.newId;
    }
    const expected = [
      {name: "A", oldPos: 1, oldGame: 10, oldId: 1, newPos: 4, newGame: 10, newId: 1},
      {name: "B", oldPos: 2, oldGame: 11, oldId: 2},
      {name: "D", oldPos: 4, oldGame: 13, oldId: 4, newPos: 2, newGame: 7, newId: 12},
      {name: "F", newPos: 1, newGame: 6, newId: 11},
    ];

    const { compareRankings } = getLeaderboardAnalyzer(4);
    const res = compareRankings(old, nu);

    for (const ex of expected) {
      let found = false;
      for (const r of res) {
        if (compare(ex, r)) {
          found = true;
        }
      }

      if (!found) {
        throw new Error(`did not find expected change: ${JSON.stringify(ex)}`);
      }
    }

    for (const r of res) {
      let found = false;
      for (const ex of expected) {
        if (compare(ex, r)) {
          found = true;
        }
      }

      if (!found) {
        throw new Error(`found unexpected change: ${JSON.stringify(r)}`);
      }
    }
  })
})

describe("getChangeDetails", () => {
  describe("Identifies name", () => {
    const named = {name: "name", pos: 1};
    it("when there is no old ranking", () => {
      const details = getChangeDetails(null, named)
      assertEquals(details.name, "name");
    });

    it("when there is no new ranking", () => {
      const details = getChangeDetails(named, null)
      assertEquals(details.name, "name");
    });
  });

  it("returns expected value", () => {
    const old = {
      id: 5239239,
      pos: 10,
      game: 20.654,
      ts: "2018-05-27 10:25:10",
      name: "Vince_HD"
    }
    const nu = {
      id: 16008204,
      pos: 1,
      game: 15.654,
      ts: "2020-05-27 10:25:10",
      name: "Vince_HD"
    }
    const expected = {
      name: "Vince_HD",
      oldPos: 10,
      oldGame: 20.654,
      oldId: 5239239,
      newPos: 1,
      newGame: 15.654,
      newId: 16008204,
    }
    assertEquals(JSON.stringify(getChangeDetails(old, nu)), JSON.stringify(expected));
  })
});

describe("describeChange", () => {
  it("describes a new entry", () => {
    const { describeChange } = getLeaderboardAnalyzer(4);

    const tests = [
      { // Rise
        details: {name: "Vince_HD", oldPos: 10, oldGame: 20.654, newPos: 1, newGame: 15.654},
        expected: 'Vince_HD rose from position 10 to position 1 with a new time of 15.654',
      },
      { // Fall
        details: {name: "Vince_HD", oldPos: 2, oldGame: 20.654, newPos: 3, newGame: 20.654},
        expected: 'Vince_HD fell from position 2 to position 3',
      },
      { // Exit leaderboard
        details: {name: "Vince_HD", oldPos: 2, oldGame: 20.654},
        expected: 'Vince_HD fell out of the top 4',
      },
      { // Enter leaderboard
        details: {name: "Vince_HD", newPos: 2, newGame: 15.654, newId: 16008204},
        expected: 'Vince_HD entered the top 4 at position 2 with a time of 15.654',
      },
    ]

    for (const {details, expected} of tests) {
      assertEquals(describeChange(details), expected);
    }
  });
});

describe("getChangeType", () => {
  it("correctly identifies change type", () => {
    const tests = [
      { // Rise
        details: {name: "Vince_HD", oldPos: 10, oldGame: 20.654, newPos: 1, newGame: 15.654},
        expected: changeType.RISE,
      },
      { // Fall
        details: {name: "Vince_HD", oldPos: 2, oldGame: 20.654, newPos: 3, newGame: 20.654},
        expected: changeType.FALL,
      },
      { // Exit leaderboard
        details: {name: "Vince_HD", oldPos: 2, oldGame: 20.654},
        expected:  changeType.EXIT,
      },
      { // Enter leaderboard
        details: {name: "Vince_HD", newPos: 2, newGame: 15.654, newId: 16008204},
        expected: changeType.ENTER,
      },
    ]

    for (const {details, expected} of tests) {
      assertEquals(getChangeType(details), expected);
    }
  });
});