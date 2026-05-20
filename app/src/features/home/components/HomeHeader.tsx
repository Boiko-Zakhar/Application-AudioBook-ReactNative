import React from 'react';
import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { IconItem } from '../types';

interface HomeHeaderProps {
  leftIcons: IconItem[];
  rightIcons: IconItem[];
  activeIcons: Record<string, boolean>;
  onToggleIcon: (id: string) => void;
  isLocked: boolean;
}

export const HomeHeader = ({ leftIcons, rightIcons, activeIcons, onToggleIcon, isLocked }: HomeHeaderProps) => {

  const renderIcons = (icons: IconItem[]) => (
    icons.map((item) => {
      const isActive = activeIcons[item.id];
      const CurrentIconComponent = isActive ? item.ActiveIcon : item.Icon;
      const currentFill = isActive ? item.activeFill : item.defaultFill;

      if (item.id === 'lock') {
        return (
          <Pressable
            key={item.id}
            onPress={() => {
              if (!isLocked) {
                onToggleIcon(item.id);
                item.onPress();
              }
            }}
            onLongPress={() => {
              if (isLocked) {
                Vibration.vibrate(100);
                onToggleIcon(item.id);
                item.onPress();
              }
            }}
            delayLongPress={1000}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <CurrentIconComponent width={24} height={24} fill={currentFill} />
          </Pressable>
        );
      }

      return (
        <Pressable
          key={item.id}
          onPress={() => {
            onToggleIcon(item.id);
            item.onPress();
          }}
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <CurrentIconComponent width={24} height={24} fill={currentFill} />
        </Pressable>
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
    gap: 10,
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});