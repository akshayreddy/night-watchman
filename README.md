## NightWatchman

NightWatchman is a client that fetches the cricket score of all the live matches happening across the world. 

It is a crawler that fetches the data from [crickbuzz](https://www.cricbuzz.com)

The intent behind this is to use the client to build some cool games, extension and more. Also, just for the love of cricket!

## Usage

Install the package
```shell
npm install night-watchman
```

Import the package
```javascript
const NightWatchman = require("night-watchman");
const cricket = new NightWatchman.Cricket();
```

Run the `fetchMatches` function to get an updated list of matches.
```javascript
cricket.fetchMatches();
```


`ready` channel notifies when the updated list of matches have been fetched.
```javascript
cricket.ready = (matches) => {
    if (matches.length === 0) {
        console.log('No Matches Available');
    } else {
        console.log(matches);
    }
}
```

Matches
```json
[
  { id: 0, match: 'Lucknow Super Giants vs Mumbai Indians 37th Match' },
  { id: 1, match: 'Gloucestershire vs Lancashire County Div 1' },
  { id: 2, match: 'Yorkshire vs Northamptonshire County Div 1' },
  { id: 3, match: 'Somerset vs Surrey County Div 1' },
  { id: 4, match: 'Kent vs Hampshire County Div 1' },
  { id: 5, match: 'Essex vs Warwickshire County Div 1' },
  { id: 6, match: 'Leicestershire vs Derbyshire County Div 2' },
  { id: 7, match: 'Zimbabwe Women vs Namibia Women 8th Match' },
  { id: 8, match: 'Zimbabwe Women vs Uganda Women 7th Match' }
]
```

## Subscribe

Subscribe to a match by using its ID.

```javascript
cricket.subscribe(matchId);
```

Run `startFetchingScore` function to get notifications of the match score on the `listen` channel

```javascript
cricket.startFetchingScore() // need to run this once

cricket.listen = (score) => {
    console.log(score);
}
```

```json
{
  score: 'MI 44/0 (6.1)',
  overs: [ '... 0 1 1 1 4 ', ' 1 0 0 6 4 1 ', ' 1' ],
  highlight: 'Mumbai Indians need 125 runs in 83 balls',
  matchId: 0,
  match: 'Lucknow Super Giants vs Mumbai Indians 37th Match'
}
{
  score: 'MI 45/0 (6.2)',
  overs: [ '... 1 1 1 4 ', ' 1 0 0 6 4 1 ', ' 1 1' ],
  highlight: 'Mumbai Indians need 124 runs in 82 balls',
  matchId: 0,
  match: 'Lucknow Super Giants vs Mumbai Indians 37th Match'
}
```

## Unsubscribe

Unsubscribe a match by using its ID.

```javascript
cricket.unsubscribe(matchId);
```

Unsubscribe all the matches.

```javascript
cricket.unsubscribeAll();
```

Run `stopFetchingScore` to stop all the notification on the `listen` channel
```javascript
cricket.stopFetchingScore();
```

## Build

```shell
npm run build
```

## Test

```shell
node test/demo.js
```

## Contribute

Help improve the client by reporting the bugs, features, enhancement and PRs.
