import { useSettings } from "@/app/src/context/SettingsContext";
import { useTheme } from "@/app/src/context/ThemeContext";
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { Book, useLibrary } from "../src/features/home/hook/useLibrary";
import { speak } from "../src/features/speech";
import { useTypography } from "../src/hooks/useTypography";

export default function Library() {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const { getFontSize } = useTypography();

  const { books, addBook, removeBook } = useLibrary();
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const player = useAudioPlayer(currentBook?.uri || '');

  useEffect(() => {
    if (!player) return;
    setIsPlaying(player.playing);

    const interval = setInterval(() => {
      if (player.playing) {
        setCurrentTime(player.currentTime);
      }
    }, 500);

    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      setIsPlaying(status.playing);
      setCurrentTime(status.currentTime);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [player]);

  const router = useRouter();

  const openPlayer = (book: Book) => {
    router.push({
      pathname: "/Home",
      params: { bookData: JSON.stringify(book) }
    });
  };
  
  useFocusEffect(
    useCallback(() => {
      if (settings.voiceAction) {
        speak("Екран бібліотеки")
      };
    }, [settings.voiceAction])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={{ 
          color: theme.colors.onSurface, 
          fontSize: getFontSize(20), 
          lineHeight: getFontSize(26),
          letterSpacing: -1 
        }}>
          Моя Бібліотека
        </Text>
        <Button
          style={{ backgroundColor: theme.colors.accent }}
          textColor={theme.colors.background}
          labelStyle={{ fontSize: getFontSize(14) }}
          mode="contained"
          onPress={() => {
            if (settings.voiceAction) {
              speak("Додати книгу");
            }
            addBook();
          }}
          icon="plus"
        >
          Додати
        </Button>
      </View>

      <FlatList
        data={books}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItemWrapper}>
            <TouchableOpacity
              style={[
                styles.bookItem, 
                { backgroundColor: `${theme.colors.muted}40` } 
              ]}
              onPress={() => {
                if (settings.voiceAction) {
                  speak(`Книгу ${item.title} відкрито`);
                }
                openPlayer(item);
              }}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={item.image ? { uri: item.image } : ''}
                  style={styles.imageBook}
                />
              </View>
              <View style={styles.bookInfo}>
                <Text 
                  numberOfLines={2}
                  style={{ 
                    color: theme.colors.onSurface, 
                    fontSize: getFontSize(16), 
                    fontWeight: '600',
                    lineHeight: getFontSize(20)
                  }}
                >
                  {item.title}
                </Text>
                <Text style={{ 
                  color: theme.colors.onSurfaceVariant, 
                  fontSize: getFontSize(12),
                  marginTop: 4 
                }}>
                  Аудіокнига
                </Text>
              </View>
            </TouchableOpacity>

            <IconButton 
              icon="trash-can-outline" 
              iconColor={theme.colors.onSurface}
              size={24} 
              onPress={() => {
                if (settings.voiceAction) {
                  speak(`Видалено книгу: ${item.title}`);
                }
                removeBook(item.id);
              }} 
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageBook: {
    width: 100, 
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#ccc'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 35,
  },
  bookItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  bookItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 100, 
  },
  iconContainer: { alignSelf: 'stretch' },
  bookInfo: { 
    flex: 1, 
    padding: 12,
    justifyContent: 'center' 
  },
});