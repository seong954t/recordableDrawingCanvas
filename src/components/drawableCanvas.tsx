import React, {useEffect, useRef, useState, forwardRef} from "react";
import styled from "styled-components";
import DrawableService from "../services/drawableService";

const StyledCanvas = styled.canvas`
    width: 300px;
    border: 1px solid black;
`;

interface IDrawableCanvas {
    canvasWidth: number;
    canvasHeight: number;
    drawableService: DrawableService;
    drawable?: boolean;
    strokeStyle?: string;
    lineWidth?: number;
}

const DrawableCanvas = forwardRef<HTMLCanvasElement, IDrawableCanvas>((props: IDrawableCanvas, ref) => {

    // const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [drawableService] = useState<DrawableService>(props.drawableService);

    // useEffect(() => {
    //     const canvasElement = ref.current;
    //     if(canvasElement === null) {
    //         return;
    //     }
    //     drawableService.init(canvasElement, props.drawable || false);
    // }, []);

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
        <StyledCanvas ref={ref}
                      width={props.canvasWidth}
                      height={props.canvasHeight}
                      onMouseDown={props.drawableService.mouseDownHandler}
                      onMouseUp={props.drawableService.mouseUpHandler}
                      onMouseMove={props.drawableService.mouseMoveHandler}
        />
    );
});

export default DrawableCanvas;