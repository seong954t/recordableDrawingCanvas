import React, {useState} from "react";
import styled from "styled-components";
import DrawableCanvas from "../components/drawableCanvas";

const TestPage: React.FC = () => {

    const [drawable, setDrawable] = useState<boolean>(false);

    const switchDrawable = () => {
        setDrawable(!drawable);
    };

    return (
        <>
            <DrawableCanvas canvasWidth={500} canvasHeight={400} drawable={drawable}></DrawableCanvas>
            <button onClick={switchDrawable}>{drawable ? "그리기 중단" : "그리기 시작"}</button>
        </>
    )
};

export default TestPage;