import React, {useEffect, useRef, useState, forwardRef, ComponentProps} from "react";
import styled from "styled-components";
import DrawableService from "../services/drawableService";

export interface IDrawableCanvas extends ComponentProps<any>{
    canvasWidth: number;
    canvasHeight: number;
    drawableService: DrawableService;
    drawable?: boolean;
    strokeStyle?: string;
    lineWidth?: number;
}

const DrawableCanvas = forwardRef<HTMLCanvasElement, IDrawableCanvas>((props: IDrawableCanvas, ref) => {

    useEffect(() => {
        if(props.strokeStyle) {
            props.drawableService.setStrokeStyle(props.strokeStyle);
        }
    }, [props.strokeStyle]);

    useEffect(() => {
        if(props.lineWidth) {
            props.drawableService.setLineWidth(props.lineWidth);
        }
    }, [props.lineWidth]);

    useEffect(() => {
        props.drawableService.setIsDrawable(props.drawable || false);
    }, [props.drawable]);

    return (
        <canvas className={props.className}
                ref={ref}
                width={props.canvasWidth}
                height={props.canvasHeight}
                onMouseDown={props.drawableService.mouseDownHandler}
                onMouseUp={props.drawableService.mouseUpHandler}
                onMouseMove={props.drawableService.mouseMoveHandler}/>
    );
});

export default DrawableCanvas;