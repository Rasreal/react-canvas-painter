import {useCallback, useRef, useState} from "react";

export const usePainter = () => {
    const canvas = useRef<HTMLCanvasElement>();
    const [isReady, setIsReady] = useState(false);
    const [isRegularMode, setIsRegularMode] = useState(true);
    const [isAutoWidth, setIsAutoWidth] = useState(false);
    const [isEraser, setIsEraser] = useState(false);

    const [currentColor, setCurrentColor] = useState("#000000");
    const [currentWidth, setCurrentWidth] = useState(50);

    const autoWidth = useRef(false);
    const selectedSaturation = useRef(100);
    const selectedLightness = useRef(50);
    const selectedColor = useRef("#000000");
    const selectedLineWidth = useRef(50);
    const lastX = useRef(0);
    const lastY = useRef(0);
    const hue = useRef(0);
    const isDrawing = useRef(false);
    const direction = useRef(true);
    const isRegularPaintMode = useRef(true);
    const isEraserMode = useRef(false);

    const ctx = useRef(canvas?.current?.getContext("2d"));


    const history = useRef<ImageData[]>([]);

    const snapshotSavedCurrentStroke = useRef(false);

    const drawOnCanvas = useCallback((event: any) => {
        if (!ctx || !ctx.current) {
            return;
        }
        ctx.current.beginPath();
        ctx.current.moveTo(lastX.current, lastY.current);
        ctx.current.lineTo(event.offsetX, event.offsetY);
        ctx.current.stroke();
        [lastX.current, lastY.current] = [event.offsetX, event.offsetY];
    }, []);

    const handleMouseDown = useCallback((e: any) => {
        isDrawing.current = true;
        [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    }, []);

    const dynamicLineWidth = useCallback(() => {
        if (!ctx || !ctx.current) {
            return;
        }
        if (ctx.current.lineWidth > 90 || ctx.current.lineWidth < 10) {
            direction.current = !direction.current;
        }
        direction.current ? ctx.current.lineWidth++ : ctx.current.lineWidth--;
        setCurrentWidth(ctx.current.lineWidth);
    }, []);

    const drawNormal = useCallback(
        (e: any) => {
            if (!isDrawing.current || !ctx.current) return;
            if (isRegularPaintMode.current || isEraserMode.current) {
                ctx.current.strokeStyle = selectedColor.current;

                setCurrentColor(selectedColor.current);

                autoWidth.current && !isEraserMode.current
                    ? dynamicLineWidth()
                    : (ctx.current.lineWidth = selectedLineWidth.current);

                isEraserMode.current
                    ? (ctx.current.globalCompositeOperation = "destination-out")
                    : (ctx.current.globalCompositeOperation = "source-over");
            } else {
                setCurrentColor(
                    `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`,
                );
                ctx.current.strokeStyle = `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`;
                ctx.current.globalCompositeOperation = "source-over";

                hue.current++;

                if (hue.current >= 360) hue.current = 0;

                autoWidth.current
                    ? dynamicLineWidth()
                    : (ctx.current.lineWidth = selectedLineWidth.current);
            }


            // === Save Canvas Snapshot for Undo ===
            //
            // We need to allow the user to undo the most recent stroke.
            // To do this correctly, we must save the canvas state (as ImageData)
            // **before** anything is drawn.
            //
            // But since `drawNormal()` is called many times per stroke (on mousemove),
            // we use `snapshotSavedThisStroke` as a flag to ensure we only
            // save ONE snapshot per stroke — on the very first move.
            //
            // This way:
            // ✅ The undo stack holds the canvas state before the stroke.
            // ✅ Pressing "Undo" once removes the last visible stroke.
            // ✅ No extra or missing undo steps.
            //

            //если снапшот не сохранен в истории, сохраняем его до момента рисовки на канвасе
            if (!snapshotSavedCurrentStroke.current) {
                const snapshot = ctx.current.getImageData(
                    0, 0, canvas!.current!.width, canvas!.current!.height,
                );

                history.current.push(snapshot);

                //console.log("history", history.current);
                snapshotSavedCurrentStroke.current = true;
            }
            drawOnCanvas(e);
        },
        [drawOnCanvas, dynamicLineWidth],
    );

    const stopDrawing = useCallback(() => {

        if (!canvas.current || !ctx.current) return;
        isDrawing.current = false;
        snapshotSavedCurrentStroke.current = false;

    }, []);

    const init = useCallback(() => {
        ctx.current = canvas?.current?.getContext("2d");
        if (canvas && canvas.current && ctx && ctx.current) {
            const dpr = window.devicePixelRatio || 1;


            // Set actual pixel size of canvas
            // Применить реальный масштаб холста
            canvas.current.width = (window.innerWidth - 196) * dpr;
            canvas.current.height = window.innerHeight * dpr;


            // Set display size (CSS size)
            canvas.current.style.width = `${window.innerWidth - 196}px`;
            canvas.current.style.height = `${window.innerHeight}px`;

            // Scale drawing context
            //мсштаб девайс пиксель соотношение
            ctx.current.scale(dpr, dpr);


            ctx.current.strokeStyle = "#000";
            ctx.current.lineJoin = "round";
            ctx.current.lineCap = "round";
            ctx.current.lineWidth = 10;

            canvas.current.addEventListener("mousedown", handleMouseDown);
            canvas.current.addEventListener("mousemove", drawNormal);
            canvas.current.addEventListener("mouseup", stopDrawing);
            canvas.current.addEventListener("mouseout", stopDrawing);



            const blankSnapsht = ctx.current.getImageData(0, 0, canvas.current.width, canvas.current.height);

            history.current.push(blankSnapsht);

            setIsReady(true);


        }
    }, [drawNormal, handleMouseDown, stopDrawing]);

    const handleRegularMode = useCallback(() => {
        setIsRegularMode(true);
        isEraserMode.current = false;
        setIsEraser(false);
        isRegularPaintMode.current = true;
    }, []);

    const handleSpecialMode = useCallback(() => {
        setIsRegularMode(false);
        isEraserMode.current = false;
        setIsEraser(false);
        isRegularPaintMode.current = false;
    }, []);

    const handleColor = (e: any) => {
        setCurrentColor(e.currentTarget.value);
        selectedColor.current = e.currentTarget.value;
    };

    const handleWidth = (e: any) => {
        setCurrentWidth(e.currentTarget.value);
        selectedLineWidth.current = e.currentTarget.value;
    };

    const handleUndo = useCallback((e: any) => {
        if (!ctx.current || history.current.length === 0 || !canvas.current) return;
        console.log("222", history)
        const previousState = history.current.pop();

        ctx.current.putImageData(previousState!, 0, 0);
    }, []);

    const handleClear = useCallback(() => {
        if (!ctx || !ctx.current || !canvas || !canvas.current) {
            return;
        }
        ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    }, []);

    const handleEraserMode = (e: any) => {
        autoWidth.current = false;
        setIsAutoWidth(false);
        setIsRegularMode(true);
        isEraserMode.current = true;
        setIsEraser(true);
    };

    const setCurrentSaturation = (e: any) => {
        setCurrentColor(
            `hsl(${hue.current},${e.currentTarget.value}%,${selectedLightness.current}%)`,
        );
        selectedSaturation.current = e.currentTarget.value;
    };

    const setCurrentLightness = (e: any) => {
        setCurrentColor(
            `hsl(${hue.current},${selectedSaturation.current}%,${e.currentTarget.value}%)`,
        );
        selectedLightness.current = e.currentTarget.value;
    };

    const setAutoWidth = (e: any) => {
        autoWidth.current = e.currentTarget.checked;
        setIsAutoWidth(e.currentTarget.checked);

        if (!e.currentTarget.checked) {
            setCurrentWidth(selectedLineWidth.current);
        } else {
            setCurrentWidth(ctx?.current?.lineWidth ?? selectedLineWidth.current);
        }
    };

    return [
        {
            canvas,
            isReady,
            currentWidth,
            currentColor,
            isRegularMode,
            isAutoWidth,
            isEraser,
        },
        {
            init,
            handleRegularMode,
            handleSpecialMode,
            handleColor,
            handleWidth,
            handleClear,
            handleEraserMode,
            setAutoWidth,
            setCurrentSaturation,
            setCurrentLightness,
            handleUndo
        },
    ] as any;
};
