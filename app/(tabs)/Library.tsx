import { useAudioPlayer } from 'expo-audio'; // Імпорт плеєра
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton } from "react-native-paper";

// Імпорти з вашого проекту
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from 'expo-router';
import { Book, useLibrary } from "../src/features/home/hook/useLibrary";
// Перевірте, чи правильний шлях до компонента PlayerControls

export default function Library() {
  const { theme } = useTheme();

  // 1. Підключаємо нашу бібліотеку
  const { books, addBook, removeBook } = useLibrary();

  // 2. Стан: Яка книга зараз вибрана?
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  // Стан для UI плеєра
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // 3. Ініціалізуємо плеєр
  // Якщо книга не вибрана, передаємо порожній рядок
  const player = useAudioPlayer(currentBook?.uri || '');

  // 4. Логіка синхронізації плеєра (оновлення часу, автоперемикання)
  useEffect(() => {
    if (!player) return;

    setIsPlaying(player.playing);

    // Таймер для оновлення повзунка
    const interval = setInterval(() => {
      if (player.playing) {
        setCurrentTime(player.currentTime);
      }
    }, 500);

    // Слухач подій плеєра
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

  const router = useRouter(); // 2. Ініціалізуємо роутер
  
  const openPlayer = (book: Book) => {
    // 3. Переходимо на екран плеєра і передаємо дані книги
    // Ми перетворюємо об'єкт на рядок JSON, щоб безпечно передати його через URL
    router.push({
      pathname: "/Home",
      params: { bookData: JSON.stringify(book) }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Хедер і кнопка додавання (без змін) */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text.regular.color }]}>Моя Бібліотека</Text>
        <Button mode="contained" onPress={addBook} icon="plus">Додати</Button>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItemWrapper}>
            <TouchableOpacity
              style={[styles.bookItem, { backgroundColor: theme.text.muted.color || '#e0e0e0' }]}
              onPress={() => openPlayer(item)} // 4. Викликаємо навігацію при кліку
            >
              <View style={styles.iconContainer}>
                <Text style={{ fontSize: 24 }}>📖</Text>
              </View>
              <View style={styles.bookInfo}>
                <Text numberOfLines={1} style={[styles.bookTitle, { color: theme.text.regular.color }]}>
                  {item.title}
                </Text>
                <Text style={{ color: 'gray' }}>Аудіокнига</Text>
              </View>
            </TouchableOpacity>

            <IconButton icon="trash-can-outline" size={20} onPress={() => removeBook(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 40, // Відступ для статусбару
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  bookItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  bookItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  iconContainer: { marginRight: 15 },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 50 },

  // Стилі для плеєра знизу
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  }
});