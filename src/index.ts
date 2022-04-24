import * as cheerio from 'cheerio';
import axios from "axios";

import { CricketGameInterface } from './Interfaces/CricketGameInterface';
import { CricketMatch } from "./CricketMatch";

enum FetchStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED  = 'failed'
}

export class Cricket implements CricketGameInterface {

    private baseUrl: string = 'https://www.cricbuzz.com';
    private fetchTimeInSeconds: number = 10;
    private matches: Array<CricketMatch> = [];
    private fetchSocreIntervalId: any;
    public fetchStatus: FetchStatus = FetchStatus.IN_PROGRESS;
    public listen: Function = new Function();
    public ready: Function = new Function();
    public subscriberList: Array<CricketMatch> = [];

    public getMatches() {
        return this.matches.map((match) => {
            return {
                'id': match.id,
                'match': match.name
            }
        })
    }

    public getMatch(id:number) {
        return this.matches.filter((match) => {
            return match.id === id;
        })[0];
    }

    public subscribe(id:number) {
        let match = this.getMatch(id);

        if (match instanceof CricketMatch) {
            this.subscriberList.push(match);
        }
    }

    public unsubscribe(id:number) {
        let match = this.getMatch(id);

        if (match instanceof CricketMatch) {
            this.subscriberList.splice(this.subscriberList.indexOf(match), 1);
        }
    }

    public unsubscribeAll() {
        this.subscriberList.forEach((match) => {
            this.unsubscribe(match.id);
        });
    }

    public async fetchMatches() {
        this.matches = [];
        await axios.get(`${this.baseUrl}/cricket-match/live-scores`)
        .then((response) => {
                const $ = cheerio.load(response.data);
                $('.cb-lv-scrs-well').each((i, element) => {
                    this.matches.push(
                        new CricketMatch(this, i, $(element).attr('title'), 
                            $(element).text(), `${this.baseUrl}${$(element).attr('href')}`
                        )
                    );
                });

                this.fetchStatus = FetchStatus.COMPLETED;
                this.ready(this.getMatches());
        })
        .catch(() => {
            this.fetchStatus = FetchStatus.FAILED;
        });
    }

    public stopFetchingScore() {
        clearInterval(this.fetchSocreIntervalId);
    }

    public startFetchingScore() {
        clearInterval(this.fetchSocreIntervalId);
        this.fetchSocreIntervalId = setInterval(function(subscriberList) {
            subscriberList.forEach((match) => {
                match.fetchScore();
            });
        }, this.fetchTimeInSeconds * 1000, this.subscriberList);
    }
}
