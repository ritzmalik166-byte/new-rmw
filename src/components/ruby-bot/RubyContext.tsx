"use client";

import { createContext, useState, type ReactNode } from "react";

interface RubyContextType {
    isRubyOpen: boolean;
    setIsRubyOpen: (isRubyOpen: boolean) => void;
}

export const RubyContext = createContext<RubyContextType | null>(null);

interface RubyProviderProps {
    children: ReactNode;
}

const RubyProvider = ({ children }: RubyProviderProps) => {
    const [isRubyOpen, setIsRubyOpen] = useState(false);

    return (
        <RubyContext.Provider value={{ isRubyOpen, setIsRubyOpen }}>
            {children}
        </RubyContext.Provider>
    );
};

export default RubyProvider;
