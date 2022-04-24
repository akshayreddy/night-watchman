
import { ObservableInterface } from "./ObservableInterface"

export interface SubscriberInterface {
    subscriberList: Array<ObservableInterface>;
    listen: Function;
    subscribe(id:number): any;
    unsubscribe(id:number): any;
}