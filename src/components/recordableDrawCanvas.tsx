import React, {forwardRef} from "react";
import DrawableCanvas, {IDrawableCanvas} from "./drawableCanvas";
import RecordableService from "../services/recordableService";

interface IRecordableDrawCanvas extends IDrawableCanvas {
    recordableService: RecordableService
}

const RecordableDrawCanvas = forwardRef<HTMLCanvasElement, IRecordableDrawCanvas>((props: IRecordableDrawCanvas, ref) => {

    return (
        <DrawableCanvas ref={ref}
                        canvasWidth={props.canvasWidth}
                        canvasHeight={props.canvasHeight}
                        drawableService={props.drawableService}/>
    )
});