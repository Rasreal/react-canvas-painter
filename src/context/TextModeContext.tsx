import { createContext, useContext, useState } from "react";

interface TextModeContextProps {
    isTextMode: boolean;
    enableTextMode: () => void;
    disableTextMode: () => void;
}

const TextModeContext = createContext<TextModeContextProps | null>(null);

export const TextModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isTextMode, setIsTextMode] = useState(false);

    return (
        <TextModeContext.Provider
            value={{
                isTextMode,
                enableTextMode: () => setIsTextMode(true),
                disableTextMode: () => setIsTextMode(false),
            }}
        >
            {children}
        </TextModeContext.Provider>
    );
};

export const useTextMode = () => {
    const ctx = useContext(TextModeContext);
    if (!ctx) throw new Error("useTextMode must be used inside <TextModeProvider>");
    return ctx;
};
