import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const fontConfig = {
  fontFamily: 'Montserrat-Regular',
};

function RootContent() {
  const { theme } = useTheme();

  return (
    <PaperProvider theme={theme}>
      <SettingsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SettingsProvider>
    </PaperProvider>
  );
}

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
    <ThemeProvider>
      <RootContent />
    </ThemeProvider>
  )
}
