import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

type RNFontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export interface AppTheme extends Object {
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

const createTheme = (palette: AppPalette, isDark: boolean): AppTheme => {
  const baseMD3 = isDark ? MD3DarkTheme : MD3LightTheme;

  return {
    ...baseMD3,
    dark: isDark,
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
      regular: { color: palette.onSurface, fontSize: 14, fontWeight: "400", fontFamily: "Montserrat-Regular" },
      bold: { color: palette.primary, fontSize: 14, fontWeight: "700", fontFamily: "Montserrat-Medium" },
      green: { color: palette.secondary, fontSize: 14, fontWeight: "400", fontFamily: "Montserrat-Regular" },
      muted: { color: palette.onSurfaceVariant, fontSize: 14, fontWeight: "400", fontFamily: "Montserrat-Regular" },
    },
  };
};

const lightColors = {
  primary: "#FFD54F",      
  secondary: "#2E7D32",   
  surface: "#E8F5E9",   
  onSurface: "#000000",  
  onSurfaceVariant: "#9E9E9E", 
  error: "#D72121",        
};

const darkColors = {
  primary: "#FFD54F",     
  secondary: "#64B5F6", 
  surface: "#1C1C1C",      
  onSurface: "#FFFFFF",    
  onSurfaceVariant: "#9E9E9E",
  error: "#D72121",       
};  

export const lightThemeBase = createTheme(lightColors, false);
export const darkThemeBase = createTheme(darkColors, true);
export { createTheme };
