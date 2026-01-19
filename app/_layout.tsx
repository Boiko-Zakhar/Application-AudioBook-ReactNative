import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { configureFonts, DefaultTheme, PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

// Налаштування шрифтів (ваша закоментована частина)
const fontConfig = {
  fontFamily: 'Montserrat-Regular', // Встановлюємо основний шрифт
};

const theme = {
  ...DefaultTheme,
  // В React Native Paper v5 це найпростіший спосіб змінити всі шрифти
  fonts: configureFonts({ config: fontConfig }),
};

export default function RootLayout() {

  const [loaded] = useFonts({
    'Montserrat': require('../assets/fonts/Montserrat.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </PaperProvider>
  )
}
