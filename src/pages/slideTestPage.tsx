import React, {useEffect, useState} from "react";
import styled from "styled-components";
import DrawableService from "../services/drawableService";
import DrawableCanvas from "../components/drawableCanvas";
import RecordableMultiService from "../services/recordableMultiService";
import {RecordType} from "../types/recordType";

const WIDTH = 700;
const HEIGHT = 450;

const StyledSlideFrame = styled.div`
    position: relative;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    border: 1px solid black;
    overflow: hidden;
    margin: auto;
    margin-top: 100px;
    white-space:nowrap;
`;

const SlideTarget = styled.div`
    transform: ${(props) => `translate(${((props as any)['data-slide-offset']) * -WIDTH}px, 0)`};
    transition:transform ease .5s;
`;

const StyledButton = styled.button`
    width: 50px;
    height: 50px;
`;

const StyledCanvas = styled(DrawableCanvas)`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    position: relative;
`;

const ButtonFrame = styled.div`
    padding: 30px;
    text-align: center;
`;

const SlideTestPage: React.FC = (() => {

    const [canvasOffset, setCanvasOffset] = useState<number>(0);
    const [drawableServiceList] = useState<DrawableService[]>(
        Array.from({length: 7}).map(() => {
            return new DrawableService();
        })
    );
    const [recordableMultiService] = useState<RecordableMultiService>(new RecordableMultiService(drawableServiceList));
    const [recordState, setRecordState] = useState<RecordType>(RecordType.READY);



    const [canvasOffset2, setCanvasOffset2] = useState<number>(0);
    const [drawableServiceList2] = useState<DrawableService[]>(
        Array.from({length: 7}).map(() => {
            return new DrawableService();
        })
    );
    const [recordableMultiService2] = useState<RecordableMultiService>(new RecordableMultiService(drawableServiceList2));
    const [recordState2, setRecordState2] = useState<RecordType>(RecordType.READY);

    useEffect(() => {
        setCanvasOffset2(recordableMultiService2.drawableServiceIndex);
    }, [recordableMultiService2.drawableServiceIndex]);

    useEffect(() => {
        recordableMultiService2.setState(recordState2);
    }, [recordState2]);

    useEffect(() => {
        Array.from({length: 7}).map((_, i) => {
            const canvasElement = document.querySelector<HTMLCanvasElement>(`.canvas-${i}`);
            if (canvasElement !== null) {
                drawableServiceList[i].init(canvasElement, true);
            }
        });

        Array.from({length: 7}).map((_, i) => {
            const canvasElement = document.querySelector<HTMLCanvasElement>(`.canvas-${i}-${i}`);
            if (canvasElement !== null) {
                drawableServiceList2[i].init(canvasElement, true);
            }
        });
    }, []);

    useEffect(() => {
        recordableMultiService.setDrawableServiceIndex(canvasOffset);
    }, [canvasOffset]);

    useEffect(() => {
        recordableMultiService.setState(recordState);
    }, [recordState]);

    const leftHandler = () => {
        setCanvasOffset(canvasOffset - 1);
    };

    const rightHandler = () => {
        setCanvasOffset(canvasOffset + 1);
    };

    const start = () => {
        setRecordState(RecordType.START);
    };

    const stop = () => {
        setRecordState(RecordType.STOP);
    };

    const play = () => {
        const data = recordableMultiService.serialize();
        console.log(data);
        recordableMultiService2.deserialize(data);
        setRecordState2(RecordType.PLAY);
        // setRecordState(RecordType.PLAY);
    };

    const pause = () => {
        setRecordState2(RecordType.PAUSE);
        // setRecordState(RecordType.PAUSE);
    };

    const reset = () => {
        setRecordState(RecordType.READY);
    };

    return (
        <>
            <StyledSlideFrame>
                <SlideTarget data-slide-offset={canvasOffset}>
                    {
                        Array.from({length: 7}).map((_, i) => {
                            return <StyledCanvas className={`canvas-${i}`}
                                                 canvasWidth={WIDTH}
                                                 canvasHeight={HEIGHT}
                                                 drawableService={drawableServiceList[i]}/>
                        })
                    }
                </SlideTarget>

            </StyledSlideFrame>
            <ButtonFrame>
                <StyledButton onClick={leftHandler}>{"<"}</StyledButton>
                <StyledButton onClick={rightHandler}>{">"}</StyledButton>
            </ButtonFrame>
            <ButtonFrame>
                <StyledButton onClick={start}>녹화 시작</StyledButton>
                <StyledButton onClick={stop}>녹화 중지</StyledButton>
                <StyledButton onClick={play}>녹화 재생</StyledButton>
                <StyledButton onClick={pause}>재생 중지</StyledButton>
                <StyledButton onClick={reset}>리셋 하기</StyledButton>
            </ButtonFrame>
            <StyledSlideFrame>
                <SlideTarget data-slide-offset={canvasOffset2}>
                    {
                        Array.from({length: 7}).map((_, i) => {
                            return <StyledCanvas className={`canvas-${i}-${i}`}
                                                 canvasWidth={WIDTH}
                                                 canvasHeight={HEIGHT}
                                                 drawableService={drawableServiceList2[i]}/>
                        })
                    }
                </SlideTarget>
            </StyledSlideFrame>
        </>
    )
});

export default SlideTestPage;
