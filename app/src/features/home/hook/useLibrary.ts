import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer, } from 'buffer';
import * as Crypto from 'expo-crypto';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { useEffect, useState } from 'react';

const jsmediatags = require('jsmediatags/dist/jsmediatags.min.js');

export interface Chapter {
    id: string;
    title: string;
    uri: string;
}

export interface Book {
    id: string;
    title: string;
    image: string | null;
    chapters: Chapter[];
}

const getAlbumArt = async (fileUri: string): Promise<string | null> => {
    try {
        const audioFile = new File(fileUri);

        const arrayBuffer = await audioFile.arrayBuffer();
        const dataArray = Buffer.from(arrayBuffer);

        return new Promise((resolve) => {
            new jsmediatags.Reader(dataArray).read({
                onSuccess: (tag: any) => {
                    const picture = tag.tags.picture;
                    if (!picture) return resolve(null);

                    const { data, format } = picture;
                    const base64Img = Buffer.from(data).toString('base64');
                    resolve(`data:${format};base64,${base64Img}`);
                },
                onError: (error: any) => {
                    console.log('ID3 Error:', error);
                    resolve(null);
                }
            });
        });
    } catch (e) {
        console.error("Не вдалося обробити файл через новий API:", e);
        return null;
    }
};

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
                type: 'audio/*', // Дозволяємо всі файли (щоб уникнути глюків з Google Drive)
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) return;

            const sortedAssets = result.assets.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
            );

            // Створюємо папку книги
            const bookId = Crypto.randomUUID();
            const bookFolderName = `Book_${bookId}`;
            const bookDir = new Directory(libraryDir.uri, bookFolderName);

            if (!bookDir.exists) await bookDir.create();

            const newChapters: Chapter[] = [];
            let albumArt: string | null = null;

            for (let i = 0; i < sortedAssets.length; i++) {
                const asset = sortedAssets[i];
                const safeName = asset.name.replace(/[^a-z0-9._-]/gi, '_');
                
                const sourceFile = new File(asset.uri);
                const destFile = new File(bookDir, safeName);

                await sourceFile.move(destFile);

                if (i === 0) {
                    albumArt = await getAlbumArt(destFile.uri);
                }

                newChapters.push({
                    id: Crypto.randomUUID(),
                    title: asset.name.replace(/\.[^/.]+$/, ""),
                    uri: destFile.uri
                });
            }

            const firstFileName = newChapters[0].title;
            const bookTitle = firstFileName
                .replace(/(глава|chapter|пролог|prologue|частина|part|розділ)/gi, ' ')
                .replace(/[0-9-_]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim() || firstFileName;

            const newBook: Book = {
                id: bookId,
                title: bookTitle.length > 0 ? bookTitle : "Нова аудіокнига",
                image: albumArt, 
                chapters: newChapters,
            };

            const updatedBooks = [...books, newBook];
            setBooks(updatedBooks);

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