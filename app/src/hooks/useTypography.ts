import { useSettings } from "../context/SettingsContext";

export const useTypography = () => {
  const { settings } = useSettings(); 

  const getFontSize = (baseSize: number) => {
    return baseSize * (settings?.fontScale || 1);
  };

  return { getFontSize };
};