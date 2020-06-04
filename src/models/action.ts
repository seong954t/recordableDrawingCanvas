import {ActionType} from "../types/actionType";

export class Action {
    actionType: ActionType;
    x: number;
    y: number;
    lineWidth: number;
    strokeStyle: string;

    constructor(x:number, y:number, actionType:ActionType, lineWidth = 1, strokeStyles = "black") {
        this.x = x;
        this.y = y;
        this.actionType = actionType;
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyles;
    }
}