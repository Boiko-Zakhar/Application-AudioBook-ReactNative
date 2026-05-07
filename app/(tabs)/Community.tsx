import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { speak } from "../src/features/speach";

export default function Community() {
  const { setTheme, currentTheme, theme } = useTheme()
  const { settings } = useSettings();

  useFocusEffect(
    useCallback(() => {
      if (settings.voiceMeta) {
        speak("Екран спільноти");
      }
    }, [settings.voiceMeta]) 
  );
  return (
    <View style={[style.container, { backgroundColor: theme.colors.surface }]}>
      <Text>Community Screen 07</Text>

      <Text
        style={{ fontFamily: "Montserrat-Regular", fontWeight: '400' }}
      >
        Поточна тема 07: {currentTheme}
      </Text>

      <Button mode="contained" onPress={() => setTheme("light")} style={{ marginVertical: 5 }}>
        Світла
      </Button>

      <Button mode="contained" onPress={() => setTheme("dark")} style={{ marginVertical: 5 }}>
        Темна
      </Button>

      <Ionicons name="settings-outline" size={24} color="black" />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});