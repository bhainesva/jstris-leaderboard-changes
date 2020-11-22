import hg from 'highground';
import { handleSettledPromise, filter, map } from '../src/util.js'
import { assertEquals } from './testUtil.js';

const {describe, it} = hg;

describe('map', () => {
  it('gives expected results', () => {
    const tests = [
      {arr: [1, 2, 3], f: x => x * 2, expected: [2, 4, 6]},
      {arr: [1, 2, 3], f: x => 1, expected: [1, 1, 1]},
    ]

    for (const test of tests) {
      assertEquals(JSON.stringify(map(test.f)(test.arr)), JSON.stringify(test.expected));
    }
  });
});

describe('filter', () => {
  it('gives expected results', () => {
    const tests = [
      {arr: [1, 2, 3, -1, -2, -3], f: x => x > 0, expected: [1, 2, 3]},
      {arr: [1, 2, 3], f: x => x%2 == 0, expected: [2]},
    ]

    for (const test of tests) {
      assertEquals(JSON.stringify(filter(test.f)(test.arr)), JSON.stringify(test.expected));
    }
  });
});

describe('handleSettledPromise', () => {
  it('handles rejected and resolved promises', () => {
    const promises = Promise.allSettled([Promise.reject(false), Promise.resolve(true)]);
    const expectedOutput = [false, true];
    promises.then(map(handleSettledPromise(p => p.value, p => p.reason)))
      .then(actualOutput => assertEquals(JSON.stringify(actualOutput), JSON.stringify(expectedOutput)))
  });
});