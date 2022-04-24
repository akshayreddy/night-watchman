import { GameInterface } from "./GameInterface";
import { SubscriberInterface } from "./SubscriberInterface";


export interface CricketGameInterface extends GameInterface, SubscriberInterface {
    getMatches(): any;
}