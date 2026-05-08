import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

type RNFontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export interface AppTheme extends MD3Theme {
  dark: boolean;
  colors: typeof MD3LightTheme.colors & {
    background: string;
    accent: string;
    muted: string;
    textBlack: string;
    textGreen: string;
    red: string;
  };

  text: {
    regular: { color: string; fontSize: number; fontWeight: RNFontWeight; fontFamily: string };
    bold: { color: string; fontSize: number; fontWeight: RNFontWeight; fontFamily: string };
    green: { color: string; fontSize: number; fontWeight: RNFontWeight; fontFamily: string };
    muted: { color: string; fontSize: number; fontWeight: RNFontWeight; fontFamily: string };
  };
}

type AppPalette = {
  primary: string;
  secondary: string;
  surface: string;
  onSurface: string;
  onSurfaceVariant: string;
  error: string;
};


const createTheme = (palette: AppPalette, isDark: boolean, isDyslexic: boolean): AppTheme => {
  const baseMD3 = isDark ? MD3DarkTheme : MD3LightTheme;

  const fontFamily = isDyslexic ? "OpenDyslexic" : "Montserrat-Regular";
  const fontFamilyBold = isDyslexic ? "OpenDyslexic" : "Montserrat-Medium";

  const fontConfig = Object.fromEntries(
    Object.entries(baseMD3.fonts).map(([key, value]) => [
      key,
      {
        ...value,
        fontFamily: key.toLowerCase().includes('bold') || key.toLowerCase().includes('title') 
          ? fontFamilyBold 
          : fontFamily,
      },
    ])
  );

  return {
    ...baseMD3,
    dark: isDark,
    fonts: {
      ...baseMD3.fonts,
      ...fontConfig,
    },
    colors: {
      ...baseMD3.colors,
      ...palette,

      background: palette.surface,
      accent: palette.primary,
      muted: palette.onSurfaceVariant,
      textBlack: palette.onSurface,
      textGreen: palette.secondary,
      red: palette.error,
    },
    text: {
      regular: { color: palette.onSurface, fontSize: 14, fontWeight: "400", fontFamily: fontFamily },
      bold: { color: palette.primary, fontSize: 14, fontWeight: "700", fontFamily: fontFamilyBold },
      green: { color: palette.secondary, fontSize: 14, fontWeight: "400", fontFamily: fontFamily },
      muted: { color: palette.onSurfaceVariant, fontSize: 14, fontWeight: "400", fontFamily: fontFamily },
    },
  };
};

export const lightColors = {
  primary: "#FFD54F",
  secondary: "#2E7D32",
  surface: "#E8F5E9",
  onSurface: "#000000",
  onSurfaceVariant: "#9E9E9E",
  error: "#D72121",
};

export const darkColors = {
  primary: "#FFD54F",
  secondary: "#64B5F6",
  surface: "#1C1C1C",
  onSurface: "#FFFFFF",
  onSurfaceVariant: "#9E9E9E",
  error: "#D72121",
};

export const blueColors = {
  primary: "#1565C0",
  secondary: "#64B5F6",
  surface: "#FFFFFF",
  onSurface: "#212121",
  onSurfaceVariant: "#9E9E9E",
  error: "#D72121",
};

export const inclusiveColors = {
  primary: "#004BA0",          
  secondary: "#5D4037",        
  surface: "#FDF5E6",          
  onSurface: "#212121",        
  onSurfaceVariant: "#4E4E4E",
  error: "#B00020",
};

export const lightThemeBase = createTheme(lightColors, false, false);
export const darkThemeBase = createTheme(darkColors, true, false);
export const blueThemeBase = createTheme(darkColors, false, false);
export { createTheme };

