import { MatchInterface } from "./MatchInterface";
import { ObservableInterface } from "./ObservableInterface";

export interface CricketMatchInterface extends MatchInterface, ObservableInterface {
    id: number,
    name: string,
}