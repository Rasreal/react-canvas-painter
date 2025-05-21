import React, {useCallback, useRef, useState} from "react";

export const useTextOverlay = ({
                                   canvasRef,
                                   commitText,
                                   disableTextMode,
                               }: {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    commitText: (text: string, x: number, y: number) => void;
    disableTextMode: () => void;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const showInputAt = useCallback(
        (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setPosition({x, y});
            setInputValue("");
            setIsVisible(true);

            setTimeout(() => inputRef.current?.focus(), 0);
        },
        [canvasRef]
    );

    const handleInputKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && position) {
                const dpr = window.devicePixelRatio || 1;
                commitText(inputValue, position.x * dpr, position.y * dpr);
                setIsVisible(false);
                setPosition(null);
                disableTextMode();
            }
        },
        [inputValue, position, commitText, disableTextMode]
    );

    const TextInputElement = isVisible && position ? (
        <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                fontSize: "16px",
                padding: "4px",
                border: "1px solid #ccc",
                outline: "none",
                zIndex: 10,
            }}
        />
    ) : null;

    return {
        TextInputElement,
        showInputAt,
    };
};
