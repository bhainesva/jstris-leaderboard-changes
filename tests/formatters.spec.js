import hg from 'highground';
import { formatTime, getDiscordFormatter, getTextFormatter } from '../src/formatters.js'
import { assertEquals } from './testUtil.js';

const {describe, it} = hg;

describe('discord formatter', () => {
  it('gives expected results', () => {
    const changes = [
      {name: 'A', oldPos: 1, newPos: 10, newGame: 12.14},
      {name: 'Bee', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'C', newPos: 10, newGame: 1},
      {name: 'D', oldPos: 1},
    ];
    const expectedOutput = '**Test Report** Changes\n```css\n  10 ▲   1 Bee [1:06]\n     ▲  10 C   [1]\n   1 ▼  10 A   [12.14]\n   1 ▼     D  ```';
    const format = getDiscordFormatter({name: 'Test Report', formatTime: true})

    assertEquals(format(changes)[0], expectedOutput);
  });

  it('splits long messages', () => {
    const changes = [
      {name: 'Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', oldPos: 1, newPos: 10, newGame: 12.14},
      {name: 'Bbbbb', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'Ccccc', newPos: 10, newGame: 1},
      {name: 'Ddddd', oldPos: 1},
      {name: 'Eeeee', oldPos: 1, newPos: 10, newGame: 12.14},
      {name: 'Fffff', oldPos: 1, newPos: 10, newGame: 12.14},
      {name: 'Ggggg', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'Hhhhh', newPos: 10, newGame: 1},
      {name: 'Iiiii', oldPos: 1},
      {name: 'Jjjjj', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'Kkkkk', newPos: 10, newGame: 1},
      {name: 'Lllll', oldPos: 1},
      {name: 'Mmmmm', oldPos: 1, newPos: 10, newGame: 12.14},
      {name: 'Nnnnn', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'Ooooo', newPos: 10, newGame: 1},
      {name: 'Ppppp', oldPos: 1},
      {name: 'Qqqqq', oldPos: 1, newPos: 10, newGame: 12.14},
      {name: 'Rrrrr', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'Sssss', newPos: 10, newGame: 1},
      {name: 'Ttttt', oldPos: 1},
      {name: 'Uuuuu', oldPos: 1, newPos: 10, newGame: 12.14},
      {name: 'Vvvvv', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'Wwwww', newPos: 10, newGame: 1},
      {name: 'Xxxxx', oldPos: 1},
      {name: 'Yyyyy', oldPos: 1},
      {name: 'Zzzzz', oldPos: 1, newPos: 10, newGame: 12.14},
    ];
    const format = getDiscordFormatter({name: 'Test Report'});

    assertEquals(format(changes).length > 1, true);
  });
});

describe('text formatter', () => {
  it('gives expected results', () => {
    const changes = [
      {name: 'A', oldPos: 1, newPos: 10, newGame: 1},
      {name: 'Bee', oldPos: 10, newPos: 1, newGame: 66},
      {name: 'C', newPos: 10, newGame: 1},
      {name: 'D', oldPos: 1},
    ];
    const expectedOutput = 'Test Report Changes\n  10 ▲   1 Bee [66]\n     ▲  10 C   [1]\n   1 ▼  10 A   [1]\n   1 ▼     D  ';
    const format = getTextFormatter({name: 'Test Report', formatTime: false})

    assertEquals(format(changes)[0], expectedOutput);
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