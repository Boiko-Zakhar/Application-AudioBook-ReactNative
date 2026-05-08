import { useSettings } from "@/app/src/context/SettingsContext";
import { useTheme } from "@/app/src/context/ThemeContext";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, Modal, Portal, Switch, Text } from 'react-native-paper';
import { speak } from "../src/features/speech";
import { useTypography } from "../src/hooks/useTypography";

export default function Settings() {
    const { theme, setTheme, currentTheme } = useTheme();
    const { settings, setSetting } = useSettings();

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const FONT_SCALE = [1.0, 1.2, 1.5];
    const { getFontSize } = useTypography();

    useFocusEffect(
        useCallback(() => {
            if (settings.voiceAction) {
                speak("Екран налаштувань");
            }
        }, [])

    );

    const containerStyle = { backgroundColor: theme.colors.surface, padding: 20, marginHorizontal: 50, maxHeight: '50%' };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View>
                    <Text style={{
                        fontFamily: theme.text.green.fontFamily,
                        color: theme.colors.onSurface,
                        fontSize: getFontSize(22),
                        lineHeight: getFontSize(28),
                    }} variant="titleLarge">
                        Інклюзивність
                    </Text>

                    <View style={styles.row}>
                        <Text style={{
                            color: theme.colors.onSurface,
                            fontSize: getFontSize(16),
                            lineHeight: getFontSize(22),
                        }} variant="titleMedium">
                            Голосові метадані
                        </Text>

                        <Switch
                            value={settings.voiceMeta}
                            onValueChange={() => {
                                setSetting('voiceMeta', !settings.voiceMeta);
                                if (settings.voiceAction) {
                                    speak("Голосові метадані " + (settings.voiceMeta ? "вимкнено" : "увімкнено"));
                                }
                            }}
                            color={theme.colors.accent}
                        />
                    </View>

                    <Text style={[styles.lable, {
                        color: theme.colors.onSurface,
                        fontSize: getFontSize(11),
                        lineHeight: getFontSize(14),
                    }]} variant="labelSmall">
                        Озвучення назв книг, розділів та поточного прогресу читання.
                    </Text>

                    <View style={styles.row}>
                        <Text style={{
                            color: theme.colors.onSurface,
                            fontSize: getFontSize(16),
                            lineHeight: getFontSize(22),
                        }} variant="titleMedium">
                            Зворотний аудіозв'язок
                        </Text>

                        <Switch
                            value={settings.voiceAction}
                            onValueChange={() => {
                                setSetting('voiceAction', !settings.voiceAction);
                                speak("Зворотний аудіо зв'язок:" + (settings.voiceAction ? "вимкнено" : "увімкнено"));
                            }}
                            color={theme.colors.accent}
                        />
                    </View>

                    <Text style={[styles.lable, {
                        color: theme.colors.onSurface,
                        fontSize: getFontSize(11),
                        lineHeight: getFontSize(14),
                    }]} variant="labelSmall">
                        Супровід голосом навігації по меню та взаємодії з кнопками.
                    </Text>

                </View>

                <View style={styles.row}>
                    <Text style={{
                        color: theme.colors.onSurface,
                        fontSize: getFontSize(16),
                        lineHeight: getFontSize(22),
                    }} variant="titleMedium">
                        Спеціальний шрифт
                    </Text>
                    <Switch
                        value={settings.isDyslexicFont}
                        onValueChange={(isDyslexic) => {
                            setSetting('isDyslexicFont', !settings.isDyslexicFont)
                            if (settings.voiceAction) {
                                speak(isDyslexic ? "Спеціальний шрифт увімкнено" : "Спеціальний шрифт вимкнено");
                            }
                        }}
                        color={theme.colors.accent}
                    />
                </View>
                <Text style={[styles.lable, {
                    color: theme.colors.onSurface,
                    fontSize: getFontSize(11),
                    lineHeight: getFontSize(14),
                }]} variant="labelSmall">
                    Використовувати шрифт, адаптований для комфортного читання при дислексії.
                </Text>

                <View style={styles.row}>
                    <Text style={{
                        color: theme.colors.onSurface,
                        fontSize: getFontSize(16),
                        lineHeight: getFontSize(22),
                    }} variant="titleMedium">
                        Спеціальна тема
                    </Text>
                    <Switch
                        value={currentTheme === "inclusive"}
                        onValueChange={(isInclusive) => {
                            const nextTheme = isInclusive ? "inclusive" : "dark";
                            setTheme(nextTheme);
                            setSetting('inclusive', !settings.inclusive)

                            if (settings.voiceAction) {
                                speak(isInclusive ? "Спеціальну тему увімкнено" : "Спеціальну тему вимкнено");
                            }
                        }}
                        color={theme.colors.accent}
                    />
                </View>
                <Text style={[styles.lable, {
                    color: theme.colors.onSurface,
                    fontSize: getFontSize(11),
                    lineHeight: getFontSize(14),
                }]} variant="labelSmall">
                    Використовувати тему, адаптовану для комфортного читання при дислексії та дольтанізмі.
                </Text>

                <Divider style={{ marginVertical: 10 }} />

                <View style={styles.row}>
                    <Text style={{
                        color: theme.colors.onSurface,
                        fontSize: getFontSize(16),
                        lineHeight: getFontSize(22),
                    }} variant="titleMedium">
                        Розмір тексту
                    </Text>
                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                            {FONT_SCALE.map((size) => (
                                <Button
                                    key={size}
                                    mode={settings.fontScale === size ? "contained" : "text"}
                                    onPress={() => {
                                        setSetting('fontScale', size);
                                        hideModal();
                                        if (settings.voiceAction) {
                                            speak(`Встановлено масштаб ${size}`);
                                        }
                                    }}
                                    style={{ marginVertical: 2 }}
                                    contentStyle={{ justifyContent: 'flex-start' }}
                                    labelStyle={{ fontSize: 16 * size }}
                                >
                                    {size === 1 ? "Стандартний" : `Збільшений (x${size})`}
                                </Button>
                            ))}
                        </Modal>
                    </Portal>
                    <Button
                        icon="format-size"
                        mode="text"
                        contentStyle={{ flexDirection: 'row-reverse' }}
                        labelStyle={{ fontSize: getFontSize(14) }}
                        onPress={() => {
                            showModal()
                            if (settings.voiceAction) {
                                speak("Відкрито модальне вікно")
                            }
                        }}
                    >
                        {`Поточний: x${settings.fontScale}`}
                    </Button>
                </View>
                <Text style={[styles.lable, {
                    color: theme.colors.onSurface,
                    fontSize: getFontSize(11),
                    lineHeight: getFontSize(14),
                }]} variant="labelSmall">
                    Налаштування масштабу відображення тексту в книгах та інтерфейсі.
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingHorizontal: 8,
    },
    lable: {
        paddingHorizontal: 8,
        marginTop: 4,
    }
})