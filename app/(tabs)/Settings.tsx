import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, View } from "react-native";
import { Divider, Switch, Text } from 'react-native-paper';

export default function Settings() {
    const { theme } = useTheme();
    const { settings, toggleSetting } = useSettings();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <View>
                <Text style={{ color: theme.colors.textBlack }} variant="titleLarge">
                    Інклюзивність
                </Text>

                <View style={styles.row}>
                    <Text style={{ color: theme.colors.textBlack }} variant="titleMedium">
                        Голосові метадані
                    </Text>

                    <Switch
                        value={settings.voiceMeta}
                        onValueChange={() => toggleSetting('voiceMeta')}
                        color={theme.colors.accent}
                    />
                </View>

                <Text style={[styles.lable, { color: theme.colors.textBlack }]} variant="labelSmall">
                    Озвучення назв книг, розділів та поточного прогресу читання.
                </Text>

                <View style={styles.row}>
                    <Text style={{ color: theme.colors.textBlack }} variant="titleMedium">
                        Зворотний аудіозв'язок
                    </Text>

                    <Switch
                        value={settings.voiceAction}
                        onValueChange={() => toggleSetting('voiceAction')}
                        color={theme.colors.accent}
                    />
                </View>

                <Text style={[styles.lable, { color: theme.colors.textBlack }]} variant="labelSmall">
                    Супровід голосом навігації по меню та взаємодії з кнопками.
                </Text>

            </View>

            <Divider />

            <View style={styles.row}>
                <Text style={{ color: theme.colors.textBlack }} variant="titleMedium">
                    Сповіщення
                </Text>
                <Switch
                    value={settings.isNotifications}
                    onValueChange={() => toggleSetting('isNotifications')}
                    color={theme.colors.accent}
                />
            </View>
            <Divider />

            <View style={styles.row}>
                <Text style={{ color: theme.colors.textBlack }} variant="titleMedium">
                    Біометрія (FaceID/TouchID)
                </Text>
                <Switch
                    value={settings.isBiometrics}
                    onValueChange={() => toggleSetting('isBiometrics')}
                    color={theme.colors.accent}
                />
            </View>
            <Divider />

        </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    }
})