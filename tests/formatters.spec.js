import hg from 'highground';
import { getMarkdownFormatter, getTextFormatter } from '../src/formatters.js'
import { assertEquals } from './testUtil.js';

const {describe, it} = hg;

describe('text formatters', () => {
  it('gives expected results', () => {
    const changes = [
      {name: 'A', oldPos: 1, newPos: 10, newGame: 1},
      {name: 'Bee', oldPos: 10, newPos: 1, newGame: 1},
      {name: 'C', newPos: 10, newGame: 1},
      {name: 'D', oldPos: 1},
    ];
    const expectedOutput = '**Test Report** Changes\n```css\n  10 ▲   1 Bee [1]\n     ▲  10 C   [1]\n   1 ▼  10 A   [1]\n   1 ▼     D  ```';
    const format = getMarkdownFormatter('Test Report')

    assertEquals(format(changes), expectedOutput);
  });
});

describe('markdown formatter', () => {
  it('gives expected results', () => {
    const changes = [
      {name: 'A', oldPos: 1, newPos: 10, newGame: 1},
      {name: 'Bee', oldPos: 10, newPos: 1, newGame: 1},
      {name: 'C', newPos: 10, newGame: 1},
      {name: 'D', oldPos: 1},
    ];
    const expectedOutput = 'Test Report Changes\n  10 ▲   1 Bee [1]\n     ▲  10 C   [1]\n   1 ▼  10 A   [1]\n   1 ▼     D  ';
    const format = getTextFormatter('Test Report')

    assertEquals(format(changes), expectedOutput);
  });
});