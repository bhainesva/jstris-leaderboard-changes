import hg from 'highground';
import { assertEquals } from './testUtil.js';
import { changeType, getChangeType, sortDetails } from '../src/changeDetails.js';

const {describe, it} = hg;

describe("getChangeType", () => {
  it("returns expected change type", () => {
    const tests = [
      { // Rise
        details: {name: 'Vince_HD', oldPos: 10, oldGame: 20.654, newPos: 1, newGame: 15.654},
        expected: changeType.RISE,
      },
      { // Fall
        details: {name: 'Vince_HD', oldPos: 2, oldGame: 20.654, newPos: 3, newGame: 20.654},
        expected: changeType.FALL,
      },
      { // Exit leaderboard
        details: {name: 'Vince_HD', oldPos: 2, oldGame: 20.654},
        expected:  changeType.EXIT,
      },
      { // Enter leaderboard
        details: {name: 'Vince_HD', newPos: 2, newGame: 15.654, newId: 16008204},
        expected: changeType.ENTER,
      },
    ];

    for (const test of tests) {
      assertEquals(getChangeType(test.details), test.expected);
    }
  });
});

describe("sortDetails", () => {
  it("sorts according to expected order", () => {
    const changes = [
      {oldPos: 1, newPos: 10},
      {oldPos: 10, newPos: 1},
      {newPos: 10},
      {oldPos: 1},
    ];
    const expectedOrder = [
      {oldPos: 10, newPos: 1},
      {newPos: 10},
      {oldPos: 1, newPos: 10},
      {oldPos: 1},
    ];

    assertEquals(JSON.stringify(sortDetails(changes)), JSON.stringify(expectedOrder));
  });
});

