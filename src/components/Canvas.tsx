// Canvas.tsx
import React, { useEffect } from "react";
import { useTextOverlay } from "../hooks/useTextOverlay";
import { usePainter } from "../hooks/usePainter";
import { useTextMode } from "../context/TextModeContext";

interface Props {
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | undefined>;
  width?: number;
}

export const Canvas: React.FC<Props> = ({ canvasRef, width }) => {
  const widthHalf = width ? width / 2 : 0;
  const cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000000" opacity="0.3" height="${width}" viewBox="0 0 ${width} ${width}" width="${width}"><circle cx="${widthHalf}" cy="${widthHalf}" r="${widthHalf}" fill="%23000000" /></svg>') ${widthHalf} ${widthHalf}, auto`;

  const [, { commitText }] = usePainter();

  const { isTextMode, disableTextMode } = useTextMode();

  const { TextInputElement, showInputAt } = useTextOverlay({
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
    commitText,
    disableTextMode,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isTextMode) showInputAt(e);
    };

    const canvas = canvasRef?.current;
    if (canvas) canvas.addEventListener("click", handler);
    return () => canvas?.removeEventListener("click", handler);
  }, [canvasRef, showInputAt, isTextMode]);

  return (
      <section style={{ position: "relative" }}>
        <canvas style={{ cursor }} ref={canvasRef as any} />
        {TextInputElement}
      </section>
  );
};
