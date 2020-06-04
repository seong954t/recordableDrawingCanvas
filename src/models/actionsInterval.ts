import {Action} from "./action";

export class ActionsInterval {
    actions: Action[];
    interval: number;

    constructor(actions: Action[], interval: number) {
        this.actions = actions;
        this.interval = interval;
    }
}