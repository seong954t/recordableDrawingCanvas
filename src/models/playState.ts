export class PlayState {
    timeStamp: number;
    playStateType: PlayStateType;

    constructor(timeStamp: number, playStateType: PlayStateType) {
        this.timeStamp = timeStamp;
        this.playStateType = playStateType;
    }
}

export enum PlayStateType {
    NORMAL,
    MODIFIED
}