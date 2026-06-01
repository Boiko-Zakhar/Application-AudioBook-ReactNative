import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useSettings } from "./SettingsContext";
import { blueColors, createTheme, darkColors, inclusiveColors, lightColors, lightThemeBase } from "./theme";

type Theme = typeof lightThemeBase;

interface ThemeContextType {
  theme: Theme,
  currentTheme: string;
  setTheme: (nameTheme: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightThemeBase,
  currentTheme: "dark",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");
  const { settings } = useSettings();

  const setTheme = (nameTheme: string) => {
    setCurrentTheme(nameTheme);
  };

  const theme = useMemo(() => {
    const palettes = {
      light: lightColors,
      dark: darkColors,
      blue: blueColors,
      inclusive: inclusiveColors
    };

    const selectedPalette = palettes[currentTheme as keyof typeof palettes] || palettes.light;
    const isDark = currentTheme === "dark" || currentTheme === "blue" || currentTheme === "inclusive";

    return createTheme(selectedPalette, isDark, settings.isDyslexicFont);

  }, [currentTheme, settings.isDyslexicFont]);

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};