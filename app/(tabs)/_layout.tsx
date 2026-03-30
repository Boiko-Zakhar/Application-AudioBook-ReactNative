global.Buffer = global.Buffer || require('buffer').Buffer;

import IconCommunity from "@/assets/images/IconCommunity";
import IconHome from "@/assets/images/IconHome";
import IconLibrary from "@/assets/images/IconLibrary";
import { useTheme } from "@/context/ThemeContext";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function tabLayout() {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: theme.colors.accent,
                    tabBarInactiveTintColor: theme.colors.muted,

                    tabBarLabelStyle: {
                        fontSize: 12
                    },

                    tabBarStyle: {
                        backgroundColor: theme.colors.background,
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
                                    fontSize: 12,
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
                                        backgroundColor: theme.colors.accent,
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
            </Tabs>
        </View>

    )
}