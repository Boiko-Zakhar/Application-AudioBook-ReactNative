import { useSettings } from "@/app/src/context/SettingsContext";
import { useTheme } from "@/app/src/context/ThemeContext";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Icon, Surface, Text } from "react-native-paper";
import { speak } from "../src/features/speech";
import { useTypography } from "../src/hooks/useTypography";

export default function Community() {
  const { setTheme, currentTheme, theme } = useTheme()
  const { settings } = useSettings();
  const { getFontSize } = useTypography();

  const themes = [
    { id: 'dark', label: 'Ніч', bg: '#1C1C1C', primary: '#FFD54F', icon: 'moon-waning-crescent' },
    { id: 'blue', label: 'Океан', bg: '#0D1B2A', primary: '#FFD54F', icon: 'water' },
    { id: 'light', label: 'День', bg: '#E8F5E9', primary: '#FFD54F', icon: 'weather-sunny' },
  ];

  useFocusEffect(
    useCallback(() => {
      if (settings.voiceMeta) {
        speak("Екран спільноти");
      }
    }, [settings.voiceMeta])
  );
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 20 }}>
        <Text style={[styles.title, { fontSize: getFontSize(26), color: theme.colors.onSurface, fontFamily: theme.text.bold.fontFamily }]}>
          Персоналізація
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardContainer}>
          {themes.map((t) => (
            <TouchableOpacity key={t.id} onPress={() => {
              setTheme(t.id)
              if (settings.voiceAction) {
                speak("Тему зміненно на: " + t.label);
              }
            }}
              activeOpacity={0.8}
            >
              <Surface
                style={[
                  styles.themeCard,
                  { backgroundColor: t.bg, borderColor: currentTheme === t.id ? t.primary : 'transparent' }
                ]}
                elevation={currentTheme === t.id ? 4 : 1}
              >
                <View style={styles.cardHeader}>
                  <Icon source={t.icon} size={24} color={t.id === 'light' ? '#000' : '#FFF'} />
                  {currentTheme === t.id && (
                    <Icon source="check-circle" size={20} color={t.primary} />
                  )}
                </View>

                <View style={styles.cardPreview}>
                  <View style={[styles.miniLine, { backgroundColor: t.primary, width: '60%' }]} />
                  <View style={[styles.miniLine, { backgroundColor: t.id === 'light' ? '#ccc' : '#444', width: '40%' }]} />
                </View>

                <Text style={[styles.cardLabel, { color: t.id === 'light' ? '#000' : '#FFF', fontSize: getFontSize(16) }]}>
                  {t.label}
                </Text>
              </Surface>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.placeholderSection}>
          <Divider style={styles.divider} />
          <Icon source="account-group" size={48} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.placeholderTitle, { color: theme.colors.onSurface, fontSize: getFontSize(20) }]}>
            Соціальні функції
          </Text>
          <Text style={[styles.placeholderDesc, { color: theme.colors.onSurfaceVariant, fontSize: getFontSize(14) }]}>
            Незабаром ви зможете бачити, що слухають ваші друзі та ділитися власними списками відтвореннь та тем.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: 20, marginTop: 30 },
  cardContainer: { paddingVertical: 10, gap: 15 },
  themeCard: {
    width: 130,
    height: 160,
    borderRadius: 16,
    padding: 12,
    borderWidth: 3,
    justifyContent: 'space-between',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPreview: { gap: 6 },
  miniLine: { height: 6, borderRadius: 3 },
  cardLabel: { fontWeight: '600', marginTop: 10 },
  placeholderSection: { marginTop: 40, alignItems: 'center', opacity: 0.8 },
  divider: { width: '100%', marginBottom: 30 },
  placeholderTitle: { marginTop: 15, fontWeight: '700' },
  placeholderDesc: { textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
});