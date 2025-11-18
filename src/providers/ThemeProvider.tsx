import React, { createContext, useContext, ReactNode } from "react";
import { useAudience } from "../hooks/useAudience";

// Define the shape of your theme
export interface Theme {
  BLACK: string;
  REEF_DOCS_BLUE: string;
  REEF_DOCS_LIGHT_BLUE: string;
  REEF_DOCS_GREY: string;
  REEF_DOCS_WINNER: string;
  INPUT_BORDER_COLOR: string;
  SCREEN_BACKGROUND_COLOR: string;
  WHITE: string;
  SUCCESS: string;
  REGISTER_GRADIENT: string[];
}

// Create a context with undefined initially, to enforce usage within a provider
export const ThemeContext = createContext<Theme | undefined>(undefined);

// Hook to use the theme context safely
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Props for the provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isFresh } = useAudience();

  const theme: Theme = {
    BLACK: "#161618",
    REEF_DOCS_BLUE: isFresh ? "#2E6F40" : "#0071bd",
    REEF_DOCS_LIGHT_BLUE: isFresh ? "#2E6F40" : "#00a2ff",
    REEF_DOCS_GREY: "#83919A",
    REEF_DOCS_WINNER: "#FFF77A",
    INPUT_BORDER_COLOR: "#f1f1f1",
    SCREEN_BACKGROUND_COLOR: "#f1f1f1",
    WHITE: "#ffffff",
    SUCCESS: "green",
    REGISTER_GRADIENT: isFresh
      ? ["#174b25", "#2E6F40", "#82e99f"]
      : ["#4c669f", "#1277BA", "#3AA1E5"],
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
