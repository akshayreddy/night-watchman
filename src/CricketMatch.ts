import axios from "axios";
import * as cheerio from 'cheerio';

import { CricketGameInterface } from './Interfaces/CricketGameInterface';
import { CricketMatchInterface } from "./Interfaces/CricketMatchInterface";

enum MatchStatus {
    LIVE = 'live',
    BREAK = 'break',
    ENDED = 'ended',
    DELAYED = 'delayed',
    ABANDONED = 'abandoned',
    UNKNOWN = 'unknown',
}

enum MatchType {
    TEST = 'test',
    ODI = 'odi',
    T20 = 't20',
}

export class CricketMatch implements CricketMatchInterface {

    public id: number;
    public name: string;
    private status: MatchStatus = MatchStatus.UNKNOWN;
    private title: string;
    private liveScoreUrl: string;
    public currentScore: any = {};
    public previousScore: any = {};
    private subscriber: CricketGameInterface;


    constructor(subscriber: CricketGameInterface, id: number, name: any, title: string, liveScoreUrl: string) {
        this.subscriber = subscriber;
        this.id = id;
        this.name = name;Object
        this.liveScoreUrl = liveScoreUrl
        this.title = this.trimTitle(title);
    }

    // validate the score fetched is moving forward by matching the overs
    private validateScore(currentScore: any, previousScore: any) {
        if (! previousScore.hasOwnProperty('score')) {
            return true;
        }

        let previousOver = previousScore.score.match(/(?<=\().+?(?=\))/g)[0];
        let currentOver = currentScore.score.match(/(?<=\().+?(?=\))/g)[0];

        if (currentOver >= previousOver) {
            return true;
        } else {
            return false;
        }
    }

    // remove the leading and trailing spaces
    private trimTitle(title:string) {
        return title.replace(/\s+/g,' ').trim();
    }

    private getScore(query: any) {
        
        let score = null;
        query('.cb-font-20').each((i: any, element: any) => {
            score = query(element).text().replace(/\s+/g,' ').trim();
        });

        return score;
    }

    private getOvers(query: any) {

        let overs = null;
        query('.cb-min-rcnt > span').each((i: any, element: any) => {
            if (typeof query(element).attr('class') === 'undefined') {
                overs = query(element).text().split("|");
            }
        });

        return overs;
    }

    private getHighlight(query: any) {

        let highlight = null;
        if (query('.cb-text-inprogress').text() != '') {
            this.status = MatchStatus.LIVE;
            highlight = query('.cb-text-inprogress').text();

        } else if (query('.cb-toss-sts').text()) {
            this.status = MatchStatus.LIVE;
            highlight = query('.cb-toss-sts').text()
            
        } else if (query('.cb-text-delay').text() != '') {
            this.status = MatchStatus.DELAYED;
            highlight = query('.cb-text-delay').text();

        } else if (query('.cb-text-rain').text() != '') {
            this.status = MatchStatus.ABANDONED;
            highlight = query('.cb-text-rain').text();

        } else if (query('.cb-text-lunch').text() != '') {
            this.status = MatchStatus.BREAK;
            highlight = query('.cb-text-lunch').text();

        } else if (query('.cb-text-complete').text() != '') {
            this.status = MatchStatus.ENDED;
            highlight = query('.cb-text-complete').text();
        }

        return highlight;
    }

    public async fetchScore() {

        await axios.get(`${this.liveScoreUrl}`)
        .then((response) => {
                const $ = cheerio.load(response.data);
                this.currentScore['score'] = this.getScore($);
                this.currentScore['overs'] = this.getOvers($);
                this.currentScore['highlight'] = this.getHighlight($);
                this.currentScore['matchId'] = this.id;
                this.currentScore['match'] = this.name;

                this.notify();
        })
        .catch((error) => {
            console.log(error); 
        });
    }

    public notify() {

        if (this.validateScore(this.currentScore, this.previousScore)) {
            // notify the observer
            this.subscriber.listen(this.currentScore);

            // save previous score
            this.previousScore = this.currentScore;

            // clear current score
            this.currentScore = {};
        }
    }

    public getStatus() {
        return this.status;
    }

    public getTitle() {
        return this.title;
    }
}