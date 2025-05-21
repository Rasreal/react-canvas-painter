import {useCallback, useState} from "react";
import {usePainter} from "@/hooks/usePainter";
import {Intro} from "@/components/Intro";
import {Toolbar} from "@/components/Toolbar";
import {Canvas} from "@/components/Canvas";
import {Goo} from "@/components/Goo";
import {TextModeProvider} from "@/context/TextModeContext";

const Paint = () => {
    const [dateUrl, setDataUrl] = useState("#");
    const [{canvas, isReady, ...state}, {init, ...api}] = usePainter();
    const [isTextMode, setIsTextMode] = useState(false); // text mode toggle

    // useEffect(() => {
    //   init()
    // });

    const handleDownload = useCallback(() => {
        if (!canvas || !canvas.current) return;
        setDataUrl(canvas.current.toDataURL("image/png"));
    }, [canvas]);

    const toolbarProps = {...state, ...api, dateUrl, handleDownload};

    // useEffect(() => {
    //     window.addEventListener("resize", api.resizeCanvas);
    //     return () => window.removeEventListener("resize", api.resizeCanvas);
    // }, [api.resizeCanvas]);

    const handleTextAdd = () => setIsTextMode((prev) => !prev);
    const disableTextMode = () => setIsTextMode(false); // pass to Canvas


    return (

        <TextModeProvider >

            <div style={{ display: "flex" }}>
                <Intro isReady={isReady} init={init}/>

                {isReady &&
                    <Toolbar {...toolbarProps} />}
                <Canvas width={state.currentWidth} canvasRef={canvas}/>
                <Goo/>
            </div>

        </TextModeProvider>

    );
};


export default Paint;