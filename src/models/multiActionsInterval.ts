import {Action} from "./action";

export class MultiActionsInterval {
    actions: Action[];
    interval: number;
    actionTarget: number;

    constructor(actions: Action[], interval: number, actionTarget: number) {
        this.actions = actions;
        this.interval = interval;
        this.actionTarget = actionTarget;
    }
}