import React, {forwardRef, useEffect, useState} from "react";
import DrawableCanvas, {IDrawableCanvas} from "./drawableCanvas";
import RecordableService from "../services/recordableService";
import DrawableService from "../services/drawableService";
import {RecordType} from "../types/recordType";

interface IRecordableDrawCanvas extends IDrawableCanvas {
    recordableService: RecordableService;
    state: RecordType;
}

const RecordableDrawCanvas = forwardRef<HTMLCanvasElement, IRecordableDrawCanvas>((props: IRecordableDrawCanvas, ref) => {

    const [drawableService] = useState<DrawableService>(props.drawableService);
    const [recordableService] = useState<RecordableService>(props.recordableService);

    useEffect(() => {
        recordableService.setDrawableService(drawableService);
    }, []);

    useEffect(() => {
        props.recordableService.setState(props.state);
    }, [props.state])

    return (
        <DrawableCanvas className={props.className}
                        ref={ref}
                        drawable={props.drawable}
                        canvasWidth={props.canvasWidth}
                        canvasHeight={props.canvasHeight}
                        lineWidth={props.lineWidth}
                        strokeStyle={props.strokeStyle}
                        drawableService={drawableService}/>
    )
});

export default RecordableDrawCanvas;