import { SettingsProvider } from "@/app/src/context/SettingsContext";
import { ThemeProvider, useTheme } from "@/app/src/context/ThemeContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Montserrat': require('./src/assets/fonts/Montserrat.ttf'),
    'Montserrat-Regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('./src/assets/fonts/Montserrat-Medium.ttf'),
    'OpenDyslexic': require('./src/assets/fonts/OpenDyslexic-Regular.otf'),
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
    <SettingsProvider>
      <ThemeProvider>
        <RootContent />
      </ThemeProvider>
    </SettingsProvider>
  );
}

function RootContent() {
  const { theme } = useTheme();

  return (
    <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
