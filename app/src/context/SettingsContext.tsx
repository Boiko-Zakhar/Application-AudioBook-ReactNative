import { createContext, ReactNode, useContext, useState } from "react";

const settingsState = ({
    voiceMeta: false,
    voiceAction: false,
    isDyslexicFont: false,
    inclusive: false,
    fontScale: 1,
});

export type SettingType = typeof settingsState;
export type SettingKey = keyof SettingType;

interface SettingsContextType {
    settings: SettingType;
    setSetting: <K extends SettingKey>(key: K, value: SettingType[K]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<SettingType>(settingsState);

    const setSetting = <K extends SettingKey>(key: K, value: SettingType[K]) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <SettingsContext.Provider value={{ settings, setSetting }}>
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