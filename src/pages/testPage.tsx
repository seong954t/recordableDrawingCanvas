import React, {useEffect, useRef, useState} from "react";
import DrawableCanvas from "../components/drawableCanvas";
import styled from "styled-components";
import DrawableService from "../services/drawableService";

const StyledInput = styled.input`
    width: 50px;
    padding: 5px;
`;
const TestPage: React.FC = () => {

    const [drawable, setDrawable] = useState<boolean>(false);
    const [lineWidth, setLineWidth] = useState<number>(1);
    const [strokeStyle, setStrokeStyle] = useState<string>("rgb(0, 0, 0)");
    const [R, setR] = useState<number>(0);
    const [G, setG] = useState<number>(0);
    const [B, setB] = useState<number>(0);
    const [drawableService] = useState<DrawableService>(new DrawableService());
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [drawableService2] = useState<DrawableService>(new DrawableService());
    const canvasRef2 = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        const canvasElement = canvasRef.current;
        if(canvasElement === null) {
            return;
        }
        drawableService.init(canvasElement, drawable);

        if(canvasRef2.current === null) {
            return;
        }
        drawableService2.init(canvasRef2.current, false);
    }, []);

    const switchDrawable = () => {
        setDrawable(!drawable);
    };

    const lineWidthChangeHandler = (e: any) => {
        const value = e.currentTarget.value;
        setLineWidth(value);
    };

    const RChangeHandler = (e: any) => {
        const value = e.currentTarget.value;
        setR(value);
        setStrokeStyle(`rgb(${value}, ${G}, ${B})`);
    };

    const GChangeHandler = (e: any) => {
        const value = e.currentTarget.value;
        setG(value);
        setStrokeStyle(`rgb(${R}, ${value}, ${B})`);
    };

    const BChangeHandler = (e: any) => {
        const value = e.currentTarget.value;
        setB(value);
        setStrokeStyle(`rgb(${R}, ${G}, ${value})`);
    };

    const redrawHandler = (e: any) => {
        console.log(drawableService.getActionList());
        drawableService2.setActionList(drawableService.getActionList());
        console.log(drawableService2.getActionList());
        drawableService2.drawActions();
    };

    return (
        <>
            <DrawableCanvas ref={canvasRef} drawableService={drawableService} canvasWidth={500} canvasHeight={400} drawable={drawable}
                            lineWidth={lineWidth} strokeStyle={strokeStyle}></DrawableCanvas>
            <div>
                <button onClick={switchDrawable}>{drawable ? "그리기 중단" : "그리기 시작"}</button>
            </div>
            <div>
                <button onClick={drawableService.undoHandler}>UNDO</button>
                <button onClick={drawableService.redoHandler}>REDO</button>
                <button onClick={drawableService.clearHandler}>CLEAR</button>
            </div>
            <div>
                <span>lineWidth : </span>
                <StyledInput type="number" onChange={lineWidthChangeHandler} value={lineWidth}/>
            </div>
            <div>
                <div>
                    <span>R : </span><StyledInput type="number" onChange={RChangeHandler} value={R}/>
                </div>
                <div>
                    <span>G : </span><StyledInput type="number" onChange={GChangeHandler} value={G}/>
                </div>
                <div>
                    <span>B : </span><StyledInput type="number" onChange={BChangeHandler} value={B}/>
                </div>
            </div>

            <DrawableCanvas ref={canvasRef2} drawableService={drawableService2} canvasWidth={500} canvasHeight={400} drawable={drawable}
                            lineWidth={lineWidth} strokeStyle={strokeStyle}></DrawableCanvas>
            <button onClick={redrawHandler}>그대로 그리기</button>
        </>
    )
};

export default TestPage;