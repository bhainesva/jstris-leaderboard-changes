# jstris leaderboard changes

Script to pull from the jstris leaderboard and diff against a local copy.

## usage
Requires node 13.
1. Clone repo `git clone git@github.com:bhainesva/jstris-leaderboard-changes.git`
2. `cd jstris-leaderboard-changes`
3. Install dependencies `yarn install`
4. Run with `node index.js`

Each time the script is run it will overwrite the saved snapshot of the leaderboard in `data/old.json`.

Can run the tests with `node index.spec.js`

## example

given this data in `old.json`
```
{id: 1, pos: 1, game: 10, ts: "2018-05-27 10:25:10", name: "Ace"},
{id: 2, pos: 2, game: 11, ts: "2018-05-27 10:25:10", name: "Bob"},
{id: 3, pos: 3, game: 12, ts: "2018-05-27 10:25:10", name: "Carly"},
{id: 4, pos: 4, game: 13, ts: "2018-05-27 10:25:10", name: "Diane"},
```

and this data returned from the jstris api
```
{id: 11, pos: 1, game: 6, ts: "2018-05-27 10:25:10", name: "Fraulein Maria"},
{id: 12, pos: 2, game: 7, ts: "2018-05-27 10:25:10", name: "Diane"},
{id: 13, pos: 3, game: 8, ts: "2018-05-27 10:25:10", name: "Carly"},
{id: 1, pos: 4, game: 10, ts: "2018-05-27 10:25:10", name: "Ace"},
```

the script will output
```
Bob fell out of the top 4
Diane rose from position 4 to position 2 with a time of 7
Fraulein Maria entered the top 4 at position 1 with a time of 6
```

output running now (11/19/2020) against a snapshot from yesterday is
```
kneesocks rose from position 221 to position 161 with a time of 24.826
NameNoName fell out of the top 500
Frostfire entered the top 500 at position 446 with a time of 28.366
```