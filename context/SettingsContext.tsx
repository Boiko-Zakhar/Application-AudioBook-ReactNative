import { createContext, ReactNode, useContext, useState } from "react";

const settingsState = ({
    voiceMeta: false,
    voiceAction: false,
    isNotifications: false,
    isBiometrics: false,
});

export type SettingType = typeof settingsState;
export type SettingKey = keyof SettingType;

interface SettingsContextType {
    settings: SettingType;
    toggleSetting: (key: SettingKey) => void; 
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<SettingType>(settingsState);

    const toggleSetting = (key: SettingKey) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <SettingsContext.Provider value={{ settings, toggleSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};