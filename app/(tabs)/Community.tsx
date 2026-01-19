import { useTheme } from "@/context/ThemeContext";
import { Button, View } from "react-native";
import { Text } from "react-native-paper";

export default function Community() {
  const { setTheme, currentTheme } = useTheme()
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Community Screen 07</Text>

      <Text
        style={{fontFamily: "Montserrat-Regular", fontWeight: '400'}}
      >
        Поточна тема 07: {currentTheme}
      </Text>

      <Button onPress={() => setTheme("light")} title={"Світла"} />
      <Button onPress={() => setTheme("dark")} title={"Темна"} />
    </View>
  );
}
