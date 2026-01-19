import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { IconItem } from '../types';

interface HomeHeaderProps {
  leftIcons: IconItem[];
  rightIcons: IconItem[];
  activeIcons: Record<string, boolean>; 
  onToggleIcon: (id: string) => void;   
}

export const HomeHeader = ({ leftIcons, rightIcons, activeIcons, onToggleIcon }: HomeHeaderProps) => {

  const renderIcons = (icons: IconItem[]) => (
    icons.map((item) => {
      const isActive = activeIcons[item.id];
      const CurrentIconComponent = isActive ? item.ActiveIcon : item.Icon;
      const currentFill = isActive ? item.activeFill : item.defaultFill;

      return (
        <IconButton
          key={item.id}
          icon={() => <CurrentIconComponent width={24} height={24} fill={currentFill} />}
          onPress={() => {
            onToggleIcon(item.id);
            item.onPress();
          }}
          size={10}
        />
      );
    })
  );

  return (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        {renderIcons(leftIcons)}
      </View>
      <View style={styles.iconContainer}>
        {renderIcons(rightIcons)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    paddingLeft: 21,
    paddingRight: 21,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});