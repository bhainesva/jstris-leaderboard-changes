import hg from 'highground';
import { formatTime, getMarkdownFormatter, getTextFormatter } from '../src/formatters.js'
import { assertEquals } from './testUtil.js';

const {describe, it} = hg;

describe('text formatters', () => {
  it('gives expected results', () => {
    const changes = [
      {name: 'A', oldPos: 1, newPos: 10, newGame: 12.14},
      {name: 'Bee', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'C', newPos: 10, newGame: 1},
      {name: 'D', oldPos: 1},
    ];
    const expectedOutput = '**Test Report** Changes\n```css\n  10 ▲   1 Bee [1:06]\n     ▲  10 C   [1]\n   1 ▼  10 A   [12.14]\n   1 ▼     D  ```';
    const format = getMarkdownFormatter({name: 'Test Report', formatTime: true})

    assertEquals(format(changes), expectedOutput);
  });
});

describe('markdown formatter', () => {
  it('gives expected results', () => {
    const changes = [
      {name: 'A', oldPos: 1, newPos: 10, newGame: 1},
      {name: 'Bee', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'C', newPos: 10, newGame: 1},
      {name: 'D', oldPos: 1},
    ];
    const expectedOutput = 'Test Report Changes\n  10 ▲   1 Bee [66]\n     ▲  10 C   [1]\n   1 ▼  10 A   [1]\n   1 ▼     D  ';
    const format = getTextFormatter({name: 'Test Report'})

    assertEquals(format(changes), expectedOutput);
  });
});

describe('formatTime', () => {
  it('gives expected results', () => {
    const tests = [
      {in: 24.67, out: "24.67"},
      {in: 120.35, out: "2:00.35"},
      {in: 1.323, out: "1.323"},
      {in: 1.300, out: "1.3"},
      {in: 10.000, out: "10"},
      {in: 785.45, out: "13:05.45"},
    ]

    for (const test of tests) {
      assertEquals(formatTime(test.in), test.out);
    }
  });
});