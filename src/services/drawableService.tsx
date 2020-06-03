import {ActionType} from "../types/actionType";
import Action from "../models/action";

class DrawableService {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    drawable: boolean = false;
    isDrawing: boolean = false;
    strokeStyle: string = "rgb(0, 0, 0)";
    lineWidth: number = 1;
    snapshotImageList: ImageData[] = [];
    snapshotPosition: number = -1;
    tempImage: HTMLImageElement;
    actionList: Action[] = [];

    constructor() {
        this.canvas = document.createElement("canvas");
        this.tempImage = document.createElement("img");
        const tempCtx = this.canvas.getContext("2d");
        if (tempCtx instanceof CanvasRenderingContext2D) {
            this.context = tempCtx;
        } else {
            throw "can not find canvas context";
        }
    }

    init = (canvas: HTMLCanvasElement, drawable: boolean) => {
        this.canvas = canvas;
        this.drawable = drawable;
        this.isDrawing = false;

        const tempCtx = canvas.getContext("2d");
        if (tempCtx instanceof CanvasRenderingContext2D) {
            this.context = tempCtx;
        } else {
            throw "can not find canvas context";
        }
        this.snapshotImageList.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
        this.snapshotPosition++;
    };

    setIsDrawable = (drawable: boolean) => {
        this.drawable = drawable;
    };

    setStrokeStyle = (strokeStyle: string) => {
        this.strokeStyle = strokeStyle;
    };

    setLineWidth = (lineWidth: number) => {
        this.lineWidth = lineWidth;
    };

    mouseDownHandler = (e: any) => {
        if (!this.drawable) {
            return;
        }
        this.isDrawing = true;
        const newAction = this.createAction(e.pageX, e.pageY, ActionType.MOVETO);
        this.drawAction(newAction);
    };

    mouseUpHandler = (e: any) => {
        if (!this.drawable) {
            return;
        }
        const newAction = this.createAction(e.pageX, e.pageY, ActionType.MOVEEND);
        this.drawAction(newAction);
        this.isDrawing = false;
    };

    mouseMoveHandler = (e: any) => {
        if (!this.drawable) {
            return;
        }
        if (this.isDrawing) {
            const newAction = this.createAction(e.pageX, e.pageY, ActionType.LINETO);
            this.drawAction(newAction);
        }
    };

    undoHandler = () => {
        const newAction = this.createAction(0, 0, ActionType.UNDO);
        this.drawAction(newAction);
    };

    redoHandler = () => {
        const newAction = this.createAction(0, 0, ActionType.REDO);
        this.drawAction(newAction);
    };


    clearHandler = () => {
        const newAction = this.createAction(0, 0, ActionType.CLEAR);
        this.drawAction(newAction);
    };

    createAction = (pageX: number, pageY: number, actionType: ActionType) => {
        const {offsetLeft, offsetTop} = this.getCanvasOffset();
        const canvasRatio = this.getCanvasRatio();

        const x = Math.floor((pageX - offsetLeft) * canvasRatio);
        const y = Math.floor((pageY - offsetTop) * canvasRatio);
        const newAction = new Action(x, y, actionType, this.lineWidth, this.strokeStyle);
        this.actionList.push(newAction);
        return newAction;
    };

    getCanvasOffset = () => {
        const domRect = this.canvas.getBoundingClientRect();
        return {offsetLeft: domRect.left, offsetTop: domRect.top}
    };

    getCanvasRatio = () => {
        return this.canvas.width / this.canvas.clientWidth;
    };

    drawAction = (action: Action) => {
        switch (action.actionType) {
            case ActionType.MOVETO:
                this.context.beginPath();
                this.context.moveTo(action.x, action.y);
                this.context.strokeStyle = action.strokeStyle;
                this.context.lineWidth = action.lineWidth;
                break;
            case ActionType.MOVEEND:
                this.pushSnapshot();
                break;
            case ActionType.LINETO:
                this.context.lineTo(action.x, action.y);
                this.context.stroke();
                break;
            case ActionType.REDO:
                if (this.snapshotPosition < this.snapshotImageList.length - 1) {
                    this.context.putImageData(this.snapshotImageList[this.snapshotPosition + 1], 0, 0);
                    this.context.drawImage(this.tempImage, 0, 0);
                    this.snapshotPosition++;
                }
                break;
            case ActionType.UNDO:
                if (this.snapshotPosition > 0) {
                    this.context.putImageData(this.snapshotImageList[this.snapshotPosition - 1], 0, 0);
                    this.snapshotPosition--;
                } else if (this.snapshotPosition === 0) {
                    this.clearCanvas();
                }
                break;
            case ActionType.CLEAR:
                this.clearCanvas();
                this.pushSnapshot();
                break;
        }
    };

    pushSnapshot = () => {
        if (this.snapshotImageList.length - 1 !== this.snapshotPosition) {
            this.snapshotImageList = this.snapshotImageList.slice(0, this.snapshotPosition + 1);
        }
        this.snapshotPosition++;
        this.snapshotImageList.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
    };

    drawActions = () => {
        this.actionList.map((action, index) => {
            this.drawAction(action);
        })
    };

    getActionList = () => {
        return this.actionList;
    };

    setActionList = (actionList: Action[]) => {
        this.actionList = actionList;
    };

    clearActionList = () => {
        this.actionList = [];
    };

    clearCanvas = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default DrawableService;