const NightWatchman = require("../dist");

let cricket = new NightWatchman.Cricket();
let matchId = 0

cricket.fetchMatches();

cricket.ready = (matches) => {

    console.log(matches);
    if (matches.length === 0) {
        console.log('No Matches Available');
    } else {
        cricket.subscribe(matchId);
        console.log(`You are subscribed to ${matches[0].match}`);
    }
}

cricket.startFetchingScore();
cricket.listen = (score) => {
    console.log(score);
}