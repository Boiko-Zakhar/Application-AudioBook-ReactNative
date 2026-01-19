import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';
// Імпортуємо нові класи для роботи з файлами
import { Directory, File, Paths } from 'expo-file-system';

// Структура: Глава
export interface Chapter {
    id: string;
    title: string;
    uri: string;
}

// Структура: Книга
export interface Book {
    id: string;
    title: string;
    chapters: Chapter[];
}

export const useLibrary = () => {
    const [books, setBooks] = useState<Book[]>([]);

    // Головна папка бібліотеки
    const libraryDir = new Directory(Paths.document, 'AudioBooks');

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await ensureDirExists();
        await loadBooks();
    };

    const ensureDirExists = async () => {
        try {
            if (!libraryDir.exists) await libraryDir.create();
        } catch (e) {
            console.error("Помилка папки:", e);
        }
    };

    const loadBooks = async () => {
        try {
            const storedBooks = await AsyncStorage.getItem('myBooks');
            if (storedBooks) setBooks(JSON.parse(storedBooks));
        } catch (e) {
            console.error(e);
        }
    };

    // --- ГОЛОВНА ФУНКЦІЯ ДОДАВАННЯ ---
    const addBook = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Дозволяємо всі файли (щоб уникнути глюків з Google Drive)
                multiple: true,
                copyToCacheDirectory: true, 
            });

            if (result.canceled || !result.assets || result.assets.length === 0) return;

            // Сортуємо (01, 02, 03...)
            const sortedAssets = result.assets.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
            );

            // Створюємо папку книги
            const bookId = Date.now().toString();
            const bookFolderName = `Book_${bookId}`;
            const bookDir = new Directory(libraryDir.uri, bookFolderName);

            if (!bookDir.exists) await bookDir.create();

            const newChapters: Chapter[] = [];

            for (const fileAsset of sortedAssets) {
                // Очищаємо ім'я файлу
                const safeName = fileAsset.name.replace(/\s+/g, '_');

                const sourceFile = new File(fileAsset.uri); // Кеш
                const destFile = new File(bookDir, safeName); // Постійна пам'ять

                // Переміщуємо файл (move), щоб зекономити місце
                await sourceFile.move(destFile);

                newChapters.push({
                    id: safeName,
                    title: fileAsset.name.replace(/\.[^/.]+$/, ""), // Назва без розширення
                    uri: destFile.uri
                });
            }

            // 👇 ОСЬ ЦЬОГО НЕ ВИСТАЧАЛО У ВАС 👇
            
            // 1. Формуємо назву книги (беремо з першого файлу, чистимо від цифр)
            const firstFileName = newChapters[0].title;
            const bookTitle = firstFileName.replace(/[0-9-_]/g, ' ').trim() || firstFileName;

            // 2. Створюємо об'єкт книги
            const newBook: Book = {
                id: bookId,
                title: bookTitle.length > 0 ? bookTitle : "Нова аудіокнига",
                chapters: newChapters,
            };

            // 3. Оновлюємо список
            const updatedBooks = [...books, newBook];
            setBooks(updatedBooks);
            
            // 4. Зберігаємо в пам'ять телефону
            await AsyncStorage.setItem('myBooks', JSON.stringify(updatedBooks));

            console.log(`Успішно додано: ${newBook.title} (${newChapters.length} глав)`);

        } catch (error) {
            console.error('Помилка додавання:', error);
            alert("Помилка при додаванні. Перевірте пам'ять телефону.");
        }
    };

    const removeBook = async (id: string) => {
        try {
            const bookToDelete = books.find(b => b.id === id);
            if (bookToDelete) {
                const bookFolder = new Directory(libraryDir.uri, `Book_${id}`);
                if (bookFolder.exists) {
                    await bookFolder.delete();
                }
            }
            const updated = books.filter(b => b.id !== id);
            setBooks(updated);
            await AsyncStorage.setItem('myBooks', JSON.stringify(updated));
        } catch (error) {
            console.error(error);
        }
    };

    return { books, addBook, removeBook };
};