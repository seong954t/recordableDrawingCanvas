import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import DrawableService from "../services/drawableService";

const StyledCanvas = styled.canvas`
    width: 300px;
    border: 1px solid black;
`;

interface IDrawableCanvas {
    canvasWidth: number;
    canvasHeight: number;
    drawable?: boolean;
}

const DrawableCanvas: React.FC<IDrawableCanvas> = (props: IDrawableCanvas) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawableService] = useState<DrawableService>(new DrawableService());

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if(canvasElement === null) {
            return;
        }
        drawableService.init(canvasElement, props.drawable || false);
    }, []);

    useEffect(() => {
        drawableService.setIsDrawable(props.drawable || false);
    }, [props.drawable]);

    return (
        <StyledCanvas ref={canvasRef}
                      width={props.canvasWidth}
                      height={props.canvasHeight}
                      onMouseDown={drawableService.mouseDownHandler}
                      onMouseUp={drawableService.mouseUpHandler}
                      onMouseMove={drawableService.mouseMoveHandler}
        />
    );
};

export default DrawableCanvas;