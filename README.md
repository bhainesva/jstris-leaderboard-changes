# jstris leaderboard changes

Script to pull from the jstris leaderboard and diff against a local copy.

## usage
Requires node 13.
1. Clone repo `git clone git@github.com:bhainesva/jstris-leaderboard-changes.git`
2. `cd jstris-leaderboard-changes`
3. Install dependencies `yarn install`
4. Run with `node index.js`

Each time the script is run it will overwrite the saved snapshots of the relevant leaderboards in `data/`.

The script takes a config file as input. By default this is `config.json`, or a custom file can be specified with a `-config` or `-c` option.

The config file has two top level properties
1. discordWebhook - optional discord webhook url, if provided, change summaries will be postted to the url
2. reports - array of report configs. A report config has 4 properties.
    1. name - used for labeling output
    2. game - jstris game type (see [jstris api](https://erickmack.github.io/JstrisAPIdocs/#/?id=http-request))
    3. mode - jstris game mode (see [jstris api](https://erickmack.github.io/JstrisAPIdocs/#/?id=http-request)), default 1
    4. top - what portion of the leaderboard should be monitored, between 0 and 500, default 500

Can run the tests with `node index.spec.js`

## example

given this data in the snapshot data file
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
   4 ⬆   2 Diane            (7)
     ⬆   1 Frauelein Maria  (6)
   2 ⬇     Bob
```

output running now (11/19/2020) against a snapshot from yesterday is
```
 221 ⬆ 161 kneesocks  (24.826)
     ⬆ 446 Frostfire  (28.366)
 500 ⬇     NameNoName
```