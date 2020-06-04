import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import RecordableDrawCanvas from "../components/recordableDrawCanvas";
import RecordableService from "../services/recordableService";
import DrawableService from "../services/drawableService";
import {RecordType} from "../types/recordType";
import {PlayState, PlayStateType} from "../models/playState";

const StyledCanvas = styled(RecordableDrawCanvas)`
    width: 300px;
    border: 1px solid black;
`;

const StyledInput = styled.input`
    width: 50px;
    padding: 5px;
`;

const RecordableTestPage: React.FC = () => {

    const [drawable, setDrawable] = useState<boolean>(false);
    const [lineWidth, setLineWidth] = useState<number>(1);
    const [strokeStyle, setStrokeStyle] = useState<string>("rgb(0, 0, 0)");
    const [R, setR] = useState<number>(0);
    const [G, setG] = useState<number>(0);
    const [B, setB] = useState<number>(0);
    const [drawableService] = useState<DrawableService>(new DrawableService());
    const [recordableService] = useState<RecordableService>(new RecordableService());
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [recordState, setRecordState] = useState<RecordType>(RecordType.READY);

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if(canvasElement === null) {
            return;
        }
        drawableService.init(canvasElement, drawable);
        recordableService.setDrawableService(drawableService);
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

    const startHandler = () => {
        setRecordState(RecordType.START);
    };

    const stopHandler = () => {
        setRecordState(RecordType.STOP);
    };

    const playHandler = () => {
        if(recordableService.playInfo === null) {
            drawableService.clearCanvas();
        }
        setRecordState(RecordType.PLAY);
    };

    const pauseHandler = () => {
        setRecordState(RecordType.PAUSE);
    };

    const resetHandler = () => {
        setRecordState(RecordType.READY);
    };

    const setTimePlay = () => {
        recordableService.setPlayInfo(new PlayState(6000, PlayStateType.MODIFIED));
        setRecordState(RecordType.PLAY);
    };

    return (
        <>
            <StyledCanvas ref={canvasRef}
                          state={recordState}
                          recordableService={recordableService}
                          drawableService={drawableService}
                          canvasWidth={500}
                          canvasHeight={400}
                          drawable={drawable}
                          lineWidth={lineWidth}
                          strokeStyle={strokeStyle}/>
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

            <div>
                <span> 캡쳐 시간 : {Math.floor(Math.floor((recordableService.stopTime - recordableService.startTime)/1000)/60)} : {(Math.floor((recordableService.stopTime - recordableService.startTime)/1000))%60} : {(Math.floor(((recordableService.stopTime - recordableService.startTime)%1000)/10))}</span>
            </div>

            <div>
                <button onClick={startHandler}>녹화 시작</button>
                <button onClick={stopHandler}>녹화 중지</button>
                <button onClick={playHandler}>영상 시작</button>
                <button onClick={pauseHandler}>영상 중지</button>
                <button onClick={resetHandler}>영상 리셋</button>
                <button onClick={setTimePlay}>영상을 6초로</button>
            </div>
        </>
    )
};

export default RecordableTestPage;