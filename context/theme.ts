type RNFontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

interface theme {
  colors: {
    background: string,
    accent: string,
    muted: string,
    textBlack: string,
    textGreen: string
    red: string
  },
  text: {
    regular: { color: string, fontSize: number, fontWeight: RNFontWeight, fontFamily: string },
    bold: { color: string, fontSize: number, fontWeight: RNFontWeight, fontFamily: string },
    green: { color: string, fontSize: number, fontWeight: RNFontWeight, fontFamily: string },
    muted: { color: string, fontSize: number, fontWeight: RNFontWeight, fontFamily: string },
  },
}

const createTheme = (colors: theme['colors']): theme => ({
  colors,
  text: {
    regular: { color: colors.textBlack, fontSize: 14, fontWeight: "400", fontFamily: "Montserrat-Regular" },
    bold: { color: colors.accent, fontSize: 14, fontWeight: "700", fontFamily: "Montserrat-Medium" },
    green: { color: colors.textGreen, fontSize: 14, fontWeight: "400", fontFamily: "Montserrat-Regular" },
    muted: { color: colors.muted, fontSize: 14, fontWeight: "400", fontFamily: "Montserrat-Regular" },
  },
});

const lightColors = {
  background: "#E8F5E9",
  accent: "#FFD54F",
  muted: "#9E9E9E",
  textBlack: "#000000",
  textGreen: "#2E7D32",
  red: "#D72121"
};

const darkTheme = {
  background: "#1C1C1C",
  accent: "#FFD54F",
  muted: "#9E9E9E",
  textBlack: "#FFFFFF",
  textGreen: "#64B5F6",
  red: "#D72121"
};

export const lightThemeBase = createTheme(lightColors);
export const darkThemeBase = createTheme(darkTheme);