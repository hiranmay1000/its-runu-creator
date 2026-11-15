import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ThemeContextType {
  brandColor: string;
  setBrandColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [brandColor, setBrandColor] = useState("#e4c1b4");

  return (
    <ThemeContext.Provider value={{ brandColor, setBrandColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useBrandTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useBrandTheme must be used within ThemeProvider");
  }

  return context;
}
