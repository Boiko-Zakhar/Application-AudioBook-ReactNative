global.Buffer = global.Buffer || require('buffer').Buffer;

import IconCommunity from "@/app/src/assets/images/IconCommunity";
import IconHome from "@/app/src/assets/images/IconHome";
import IconLibrary from "@/app/src/assets/images/IconLibrary";
import { useTheme } from "@/app/src/context/ThemeContext";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useTypography } from "../src/hooks/useTypography";

export default function tabLayout() {
    const { theme } = useTheme();
    const { getFontSize } = useTypography();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.muted,

                    tabBarLabelStyle: {
                        fontSize: 12
                    },

                    tabBarStyle: {
                        backgroundColor: theme.colors.surface,
                        borderTopWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                        marginBottom: 10,
                    },

                    tabBarLabel: ({ focused, color, children }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Text
                                style={{
                                    color,
                                    fontSize: getFontSize(12),
                                    fontFamily: focused ? theme.text.bold.fontFamily : theme.text.regular.fontFamily,
                                    paddingBottom: 4,
                                }}

                            >
                                {children}
                            </Text>

                            {focused && (
                                <View
                                    style={{
                                        width: 30,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: theme.colors.primary,
                                        marginTop: 2,
                                    }}
                                />
                            )}
                        </View>

                    ),
                }}
            >
                <Tabs.Screen
                    name="Library"
                    options={{
                        title: "Бібліотека",
                        tabBarIcon: ({ color, size }) => <IconLibrary stroke={color} width={size} height={size} />
                    }}

                />

                <Tabs.Screen
                    name="Home"
                    options={{
                        title: "Слухати",
                        tabBarIcon: ({ color, size }) => <IconHome fill={color} width={size} height={size} />
                    }}
                />

                <Tabs.Screen
                    name="Community"
                    options={{
                        title: "Спільнота",
                        tabBarIcon: ({ color, size }) => <IconCommunity stroke={color} width={size} height={size} />
                    }}
                />

                <Tabs.Screen
                    name="Settings"
                    options={{
                        href: null,
                        headerShown: true,
                        title: "Налаштування",
                        headerStyle: {
                            backgroundColor: theme.colors.surface,
                        },
                        headerTitleStyle: {
                            fontFamily: theme.text.bold.fontFamily,
                            fontSize: getFontSize(18),
                            color: theme.colors.onSurface
                        },
                        headerTintColor: theme.colors.onSurface,
                    }}
                />
            </Tabs>
        </View>

    )
}