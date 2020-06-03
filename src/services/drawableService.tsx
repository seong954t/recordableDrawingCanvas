import {ActionType} from "../types/actionType";
import Action from "../models/action";

class DrawableService {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    drawable: boolean = false;
    isDrawing: boolean = false;
    strokeStyle: string = "rgb(0, 0, 0)";
    lineWidth: number = 1;

    constructor() {
        this.canvas = document.createElement("canvas");
        const tempCtx = this.canvas.getContext("2d");
        if(tempCtx instanceof  CanvasRenderingContext2D) {
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
        if(tempCtx instanceof  CanvasRenderingContext2D) {
            this.context = tempCtx;
        } else {
            throw "can not find canvas context";
        }
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
        if(!this.drawable) {
            return;
        }
        this.isDrawing = true;
        const newAction = this.createAction(e.pageX, e.pageY, ActionType.MOVETO);
        this.drawAction(newAction);
    };

    mouseUpHandler = (e: any) => {
        if(!this.drawable) {
            return;
        }
        this.isDrawing = false;
    };

    mouseMoveHandler = (e: any) => {
        if(!this.drawable) {
            return;
        }
        if(this.isDrawing) {
            const newAction = this.createAction(e.pageX, e.pageY, ActionType.LINETO);
            this.drawAction(newAction);
        }
    };

    createAction = (pageX: number, pageY: number, actionType: ActionType) => {

        const {offsetLeft, offsetTop} = this.getCanvasOffset();
        const canvasRatio = this.getCanvasRatio();

        const x = Math.floor((pageX - offsetLeft) * canvasRatio);
        const y = Math.floor((pageY - offsetTop) * canvasRatio);
        return new Action(x, y, actionType, this.lineWidth, this.strokeStyle);
    };

    getCanvasOffset = () => {
        const domRect = this.canvas.getBoundingClientRect();
        return {offsetLeft: domRect.left, offsetTop: domRect.top}
    };

    getCanvasRatio = () => {
        return this.canvas.width / this.canvas.clientWidth;
    };

    drawAction = (action: Action) => {
        switch (action.actionType)
        {
            case ActionType.MOVETO:
                this.context.beginPath();
                this.context.moveTo(action.x, action.y);
                this.context.strokeStyle = action.strokeStyle;
                this.context.lineWidth = action.lineWidth;
                break;
            case ActionType.LINETO:
                this.context.lineTo(action.x, action.y);
                this.context.stroke();
                break;
            case ActionType.REDO:
                break;
            case ActionType.UNDO:
                break;
            case ActionType.CLEAR:
                break;
        }
    };
}

export default DrawableService;