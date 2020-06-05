import {RecordType} from "../types/recordType";
import {ActionsInterval} from "../models/actionsInterval";
import {setInterval} from "timers";
import DrawableService from "./drawableService";
import {PlayState, PlayStateType} from "../models/playState";

class RecordableService {
    actionsIntervalList: ActionsInterval[];
    actionsIntervalPlayPosition: number;
    drawableService: DrawableService;
    timeInterval: number;
    intervalId: NodeJS.Timeout | null;
    state: RecordType;
    startTime: number;
    stopTime: number;
    playTime: number;
    isPlay: boolean;
    playInfo: PlayState | null;
    prevActionsInterval: ActionsInterval;

    constructor(timeInterval = 100) {
        this.actionsIntervalList = [];
        this.drawableService = new DrawableService();
        this.timeInterval = timeInterval;
        this.intervalId = null;
        this.state = RecordType.READY;
        this.startTime = 0;
        this.stopTime = 0;
        this.playTime = 0;
        this.actionsIntervalPlayPosition = 0;
        this.prevActionsInterval = new ActionsInterval([], 0);
        this.playInfo = null;
        this.isPlay = false;
    }

    setDrawableService = (drawableService: DrawableService) => {
        this.drawableService = drawableService;
    };

    setState = (state: RecordType) => {
        this.state = state;
        switch (this.state) {
            case RecordType.READY:
                this.reset();
                break;
            case RecordType.START:
                this.start();
                break;
            case RecordType.STOP:
                this.stop();
                break;
            case RecordType.PLAY:
                this.play();
                break;
            case RecordType.PAUSE:
                this.pause();
                break;
            default:
                this.stop();
                break;
        }
    };

    recordingInterval = () => {
        const actionList = this.drawableService.getActionList();
        if (actionList.length > 0) {
            const nextTimeInterval = (new Date().getTime()) - this.startTime;
            this.actionsIntervalList.push(new ActionsInterval(this.drawableService.getActionList(), nextTimeInterval));
            this.drawableService.clearActionList();
        }
    };

    start = () => {
        const stopTimeInterval = (new Date().getTime()) - this.stopTime;
        this.startTime = this.startTime + stopTimeInterval;
        this.intervalId = setInterval(this.recordingInterval, this.timeInterval);
    };

    stop = () => {
        if (this.intervalId !== null) {
            this.stopTime = new Date().getTime();
            this.recordingInterval();
            // @ts-ignore
            clearInterval(this.intervalId._id);
            this.intervalId = null;
        }
    };

    play = () => {
        this.isPlay = true;
        if (this.playInfo !== null) {
            if (this.playInfo.playStateType === PlayStateType.MODIFIED) {
                this.drawingAuto();
                this.playTime = new Date().getTime() - this.playInfo.timeStamp;
                this.playInfo = null;
            } else if (this.playInfo.playStateType === PlayStateType.NORMAL) {
                this.playTime += this.playInfo.timeStamp;
            }
        } else {
            this.playTime = new Date().getTime();
        }
        this.drawingInterval();
    };

    drawingAuto = () => {
        this.drawableService.clearCanvas();
        for (let i = 0; i < this.actionsIntervalList.length; i++) {
            const actionsInterval = this.actionsIntervalList[i];
            if ((this.playInfo ? this.playInfo.timeStamp : 0) < actionsInterval.interval) {
                break;
            }
            this.drawableService.setActionList(actionsInterval.actions);
            this.drawableService.drawActions();
            this.actionsIntervalPlayPosition = i;
            this.prevActionsInterval = actionsInterval;
        }
    };

    drawingInterval = () => {
        if (this.actionsIntervalPlayPosition < this.actionsIntervalList.length) {
            const currentActionsInterval = this.actionsIntervalList[this.actionsIntervalPlayPosition];
            let timeSlot = currentActionsInterval.interval - this.prevActionsInterval.interval;
            if (this.playInfo !== null) {
                timeSlot = currentActionsInterval.interval - this.playInfo.timeStamp;
                this.playInfo = null;
            }
            setTimeout(() => {
                if (!this.isPlay) {
                    return;
                }
                this.drawableService.setActionList(currentActionsInterval.actions);
                this.drawableService.drawActions();

                this.actionsIntervalPlayPosition++;
                this.prevActionsInterval = currentActionsInterval;
                this.drawingInterval();
            }, timeSlot);
        }
    };

    pause = () => {
        this.setPlayInfo(new PlayState(new Date().getTime() - this.playTime, PlayStateType.NORMAL));
        this.isPlay = false;
    };

    setPlayInfo = (playInfo: PlayState) => {
        this.playInfo = playInfo;
    };

    reset = () => {
        this.drawableService.clearCanvas();
        this.drawableService.clearActionList();
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
        this.actionsIntervalList = [];
        this.intervalId = null;
        this.state = RecordType.STOP;
        this.startTime = 0;
        this.stopTime = 0;
        this.playTime = 0;
        this.actionsIntervalPlayPosition = 0;
        this.prevActionsInterval = new ActionsInterval([], 0);
        this.playInfo = null;
        this.isPlay = false;
    }
}

export default RecordableService;