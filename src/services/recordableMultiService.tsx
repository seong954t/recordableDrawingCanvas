import {ActionsInterval} from "../models/actionsInterval";
import DrawableService from "./drawableService";
import {RecordType} from "../types/recordType";
import {PlayState, PlayStateType} from "../models/playState";
import {DrawableActionsInterval} from "../models/drawableActionsInterval";
import {setInterval} from "timers";
import {MultiActionsInterval} from "../models/multiActionsInterval";

class RecordableMultiService {
    multiActionsIntervalList: MultiActionsInterval[];
    actionsIntervalPlayPosition: number;
    drawableServiceList: DrawableService[];
    drawableServiceIndex: number;
    timeInterval: number;
    drawingTimeInterval: number;
    intervalId: NodeJS.Timeout | null;
    state: RecordType;
    startTime: number;
    stopTime: number;
    playTime: number;
    isPlay: boolean;
    playInfo: PlayState | null;
    prevActionsInterval: ActionsInterval;

    constructor(drawableService: DrawableService[], timeInterval = 100) {
        this.multiActionsIntervalList = [];
        this.actionsIntervalPlayPosition = 0;
        this.drawableServiceList = drawableService;
        this.drawableServiceIndex = 0;
        this.timeInterval = timeInterval;
        this.drawingTimeInterval = 0;
        this.intervalId = null;
        this.state = RecordType.READY;
        this.startTime = 0;
        this.stopTime = 0;
        this.playTime = 0;
        this.prevActionsInterval = new ActionsInterval([], 0);
        this.playInfo = null;
        this.isPlay = false;
    }

    setState = (state: RecordType) => {
        if (this.state === state) {
            return;
        }
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
        const actionList = this.getCurrentDrawableService().getActionList();
        if (actionList.length > 0) {
            const nextTimeInterval = (new Date().getTime()) - this.startTime;
            this.multiActionsIntervalList.push(new MultiActionsInterval(this.getCurrentDrawableService().getActionList(), nextTimeInterval, this.drawableServiceIndex));
            this.getCurrentDrawableService().clearActionList();
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
        this.getCurrentDrawableService().clearCanvas();
        this.actionsIntervalPlayPosition = 0;
        for (let i = 0; i < this.multiActionsIntervalList.length; i++) {
            const actionsInterval = this.multiActionsIntervalList[i];
            if ((this.playInfo ? this.playInfo.timeStamp : 0) < actionsInterval.interval) {
                break;
            }

            const currentActionsInterval = this.multiActionsIntervalList[i];

            const currentDrawableService = this.getDrawableService(currentActionsInterval.actionTarget);
            currentDrawableService.setActionList(currentActionsInterval.actions);
            currentDrawableService.drawActions();
            this.actionsIntervalPlayPosition++;
            this.prevActionsInterval = actionsInterval;
        }
    };

    drawingInterval = () => {
        if (this.actionsIntervalPlayPosition < this.multiActionsIntervalList.length) {
            const currentActionsInterval = this.multiActionsIntervalList[this.actionsIntervalPlayPosition];
            let timeSlot = currentActionsInterval.interval - this.prevActionsInterval.interval;
            if (this.playInfo !== null) {
                timeSlot = currentActionsInterval.interval - this.playInfo.timeStamp;
                this.playInfo = null;
            }
            //@ts-ignore
            this.drawingTimeInterval = setTimeout(() => {
                if (!this.isPlay) {
                    return;
                }
                const currentDrawableService = this.getDrawableService(currentActionsInterval.actionTarget);
                currentDrawableService.setActionList(currentActionsInterval.actions);
                currentDrawableService.drawActions();

                this.actionsIntervalPlayPosition++;
                this.prevActionsInterval = currentActionsInterval;
                this.drawingInterval();
            }, timeSlot);
        } 
    };

    pause = () => {
        this.setPlayInfo(new PlayState(new Date().getTime() - this.playTime, PlayStateType.NORMAL));
        console.log(this.drawingTimeInterval);
        clearTimeout(this.drawingTimeInterval);
        this.drawingTimeInterval = 0;
        this.isPlay = false;
    };

    setPlayInfo = (playInfo: PlayState) => {
        this.playInfo = playInfo;
    };

    reset = () => {
        for (const drawableService of this.drawableServiceList) {
            drawableService.clearCanvas();
            drawableService.clearActionList();
        }
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
        this.multiActionsIntervalList = [];
        this.actionsIntervalPlayPosition = 0;
        this.intervalId = null;
        this.state = RecordType.STOP;
        this.startTime = 0;
        this.stopTime = 0;
        this.playTime = 0;
        this.prevActionsInterval = new ActionsInterval([], 0);
        this.playInfo = null;
        this.isPlay = false;
    };

    getCurrentDrawableService = () => {
        return this.drawableServiceList[this.drawableServiceIndex];
    };

    getDrawableService = (index: number) => {
        return this.drawableServiceList[index];
    };

    setDrawableServiceIndex = (index: number) => {
        this.drawableServiceIndex = index;
    };

    serialize = () => {
        return JSON.stringify(this.multiActionsIntervalList);
    };

    deserialize = (data: string) => {
        this.multiActionsIntervalList = JSON.parse(data);
    };
}

export default RecordableMultiService;