import { createContext, ReactNode, useContext, useState } from "react";
import { darkThemeBase, lightThemeBase } from "./theme";

type Theme = typeof lightThemeBase;

interface ThemeContextType {
  theme: Theme,
  currentTheme: string;
  setTheme: (nameTheme: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightThemeBase,
  currentTheme: "dark",
  setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  const setTheme = (nameTheme: string) => {
    setCurrentTheme(nameTheme);
  };

  const themeMap: Record<string, Theme> = {
    light: lightThemeBase,
    dark: darkThemeBase,
  };

  const theme = themeMap[currentTheme] || lightThemeBase;

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};