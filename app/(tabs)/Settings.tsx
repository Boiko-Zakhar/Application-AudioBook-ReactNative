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
    const { getFontSize } = useTypography();

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const FONT_SCALE = [1.0, 1.2, 1.5];

    const getLineHeight = (size: number) => size * (settings.isDyslexicFont ? 1.6 : 1.3);

    useFocusEffect(
        useCallback(() => {
            if (settings.voiceAction) {
                speak("Екран налаштувань");
            }
        }, [settings.voiceAction])
    );

    const containerStyle = { 
        backgroundColor: theme.colors.surface, 
        padding: 20, 
        marginHorizontal: 20,
        borderRadius: 15,
        maxHeight: '70%' 
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                
                <View style={styles.section}>
                    <Text style={{
                        fontFamily: theme.text.green.fontFamily,
                        color: theme.colors.onSurface,
                        fontSize: getFontSize(24),
                        lineHeight: getLineHeight(getFontSize(24)),
                        marginBottom: 10,
                    }}>
                        Інклюзивність
                    </Text>

                    <View style={styles.settingItem}>
                        <View style={styles.row}>
                            <Text style={[styles.title, { 
                                fontSize: getFontSize(18), 
                                lineHeight: getLineHeight(getFontSize(18)),
                                color: theme.colors.onSurface 
                            }]}>
                                Голосові метадані
                            </Text>
                            <Switch
                                value={settings.voiceMeta}
                                onValueChange={() => {
                                    const nextValue = !settings.voiceMeta;
                                    setSetting('voiceMeta', nextValue);
                                    if (settings.voiceAction) {
                                        speak(`Голосові метадані ${nextValue ? "увімкнено" : "вимкнено"}`);
                                    }
                                }}
                                color={theme.colors.accent}
                            />
                        </View>
                        <Text style={[styles.label, { 
                            fontSize: getFontSize(13), 
                            lineHeight: getLineHeight(getFontSize(13)),
                            color: theme.colors.onSurfaceVariant 
                        }]}>
                            Озвучення назв книг, розділів та поточного прогресу читання.
                        </Text>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.row}>
                            <Text style={[styles.title, { 
                                fontSize: getFontSize(18), 
                                lineHeight: getLineHeight(getFontSize(18)),
                                color: theme.colors.onSurface 
                            }]}>
                                Зворотний аудіозв'язок
                            </Text>
                            <Switch
                                value={settings.voiceAction}
                                onValueChange={() => {
                                    const nextValue = !settings.voiceAction;
                                    setSetting('voiceAction', nextValue);
                                    speak(`Зворотний аудіозв'язок ${nextValue ? "увімкнено" : "вимкнено"}`);
                                }}
                                color={theme.colors.accent}
                            />
                        </View>
                        <Text style={[styles.label, { 
                            fontSize: getFontSize(13), 
                            lineHeight: getLineHeight(getFontSize(13)),
                            color: theme.colors.onSurfaceVariant 
                        }]}>
                            Супровід голосом навігації по меню та взаємодії з кнопками.
                        </Text>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.row}>
                            <Text style={[styles.title, { 
                                fontSize: getFontSize(18), 
                                lineHeight: getLineHeight(getFontSize(18)),
                                color: theme.colors.onSurface 
                            }]}>
                                Спеціальний шрифт
                            </Text>
                            <Switch
                                value={settings.isDyslexicFont}
                                onValueChange={(isDyslexic) => {
                                    setSetting('isDyslexicFont', isDyslexic);
                                    if (settings.voiceAction) {
                                        speak(isDyslexic ? "Спеціальний шрифт увімкнено" : "Спеціальний шрифт вимкнено");
                                    }
                                }}
                                color={theme.colors.accent}
                            />
                        </View>
                        <Text style={[styles.label, { 
                            fontSize: getFontSize(13), 
                            lineHeight: getLineHeight(getFontSize(13)),
                            color: theme.colors.onSurfaceVariant 
                        }]}>
                            Використовувати шрифт, адаптований для комфортного читання при дислексії.
                        </Text>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.row}>
                            <Text style={[styles.title, { 
                                fontSize: getFontSize(18), 
                                lineHeight: getLineHeight(getFontSize(18)),
                                color: theme.colors.onSurface 
                            }]}>
                                Спеціальна тема
                            </Text>
                            <Switch
                                value={currentTheme === "inclusive"}
                                onValueChange={(isInclusive) => {
                                    const nextTheme = isInclusive ? "inclusive" : "dark";
                                    setTheme(nextTheme);
                                    setSetting('inclusive', isInclusive);
                                    if (settings.voiceAction) {
                                        speak(isInclusive ? "Спеціальну тему увімкнено" : "Спеціальну тему вимкнено");
                                    }
                                }}
                                color={theme.colors.accent}
                            />
                        </View>
                        <Text style={[styles.label, { 
                            fontSize: getFontSize(13), 
                            lineHeight: getLineHeight(getFontSize(13)),
                            color: theme.colors.onSurfaceVariant 
                        }]}>
                            Використовувати тему, адаптовану для комфортного читання при дислексії та дальтонізмі.
                        </Text>
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    <View style={styles.settingItem}>
                        <View style={styles.row}>
                            <Text style={[styles.title, { 
                                fontSize: getFontSize(18), 
                                lineHeight: getLineHeight(getFontSize(18)),
                                color: theme.colors.onSurface 
                            }]}>
                                Розмір тексту
                            </Text>
                            <Button
                                icon="format-size"
                                mode="text"
                                contentStyle={{ flexDirection: 'row-reverse' }}
                                labelStyle={{ fontSize: getFontSize(14) }}
                                onPress={() => {
                                    showModal();
                                    if (settings.voiceAction) speak("Вибір масштабу тексту");
                                }}
                            >
                                {`x${settings.fontScale}`}
                            </Button>
                        </View>
                        <Text style={[styles.label, { 
                            fontSize: getFontSize(13), 
                            lineHeight: getLineHeight(getFontSize(13)),
                            color: theme.colors.onSurfaceVariant 
                        }]}>
                            Налаштування масштабу відображення тексту в книгах та інтерфейсі.
                        </Text>
                    </View>
                </View>

                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <Text style={{ 
                            fontSize: 20, 
                            marginBottom: 15, 
                            textAlign: 'center', 
                            color: theme.colors.onSurface,
                            fontWeight: 'bold' 
                        }}>
                            Оберіть масштаб
                        </Text>
                        {FONT_SCALE.map((size) => (
                            <Button
                                key={size}
                                mode={settings.fontScale === size ? "contained" : "text"}
                                onPress={() => {
                                    setSetting('fontScale', size);
                                    hideModal();
                                    if (settings.voiceAction) speak(`Встановлено масштаб ${size}`);
                                }}
                                style={{ marginVertical: 6 }}
                                labelStyle={{ fontSize: 16 * size }}
                            >
                                {size === 1 ? "Стандартний" : `Збільшений (x${size})`}
                            </Button>
                        ))}
                    </Modal>
                </Portal>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 15, 
    },
    section: {
        marginBottom: 20,
    },
    settingItem: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        flex: 1,
        paddingRight: 10,
        fontWeight: '600',
    },
    label: {
        paddingRight: 10,
    }
});