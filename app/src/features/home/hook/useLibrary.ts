import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer, } from 'buffer';
import { Asset } from 'expo-asset';
import * as Crypto from 'expo-crypto';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { readAsStringAsync } from 'expo-file-system/legacy';
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

export const useLibrary = () => {
    const [books, setBooks] = useState<Book[]>([]);
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
            console.error("Folder error:", e);
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

    const saveAlbumArt = async (fileUri: string, bookId: string, bookDir: Directory): Promise<string | null> => {
        try {
            const bytesToRead = 1500 * 1024;

            const partialBase64 = await readAsStringAsync(fileUri, {
                encoding: "base64",
                position: 0,          
                length: bytesToRead,
            });

            const buffer = Buffer.from(partialBase64, 'base64');

            return new Promise((resolve) => {
                new jsmediatags.Reader(buffer).read({
                    onSuccess: async (tag: any) => {
                        const picture = tag?.tags?.picture;
                        if (!picture) {
                            const defaultAssets = Asset.fromModule(require('@/app/src/assets/images/frame.jpg'));
                            return resolve(defaultAssets.uri);
                        }

                        const { data, format } = picture;
                        const base64Img = Buffer.from(data).toString('base64');

                        const isPng = format === 'image/png';
                        const ext = isPng ? 'png' : 'jpg';
                        const coverFile = new File(bookDir, `cover_${bookId}.${ext}`);

                        await coverFile.write(base64Img, { encoding: 'base64' });

                        resolve(coverFile.uri);
                    },
                    onError: (error: any) => {
                        console.log('ID3 Error (processed):', error.info || error.type);
                        const defaultAssets = Asset.fromModule(require('@/app/src/assets/images/frame.jpg'));
                        resolve(defaultAssets.uri);
                    }
                });
            });
        } catch (e) {
            console.error("Cover processing failed:", e);
            return null;
        }
    };

    // --- THE MAIN FUNCTION OF ADDING ---
    const addBook = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) return;

            const sortedAssets = result.assets.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
            );

            const bookId = Crypto.randomUUID();
            const bookFolderName = `Book_${bookId}`;
            const bookDir = new Directory(libraryDir.uri, bookFolderName);

            if (!bookDir.exists) await bookDir.create();

            const newChapters: Chapter[] = [];
            let albumArtUri: string | null = null;

            for (let i = 0; i < sortedAssets.length; i++) {
                const asset = sortedAssets[i];
                const safeName = asset.name.replace(/[^a-z0-9._-]/gi, '_');

                const sourceFile = new File(asset.uri);
                const destFile = new File(bookDir, safeName);

                await sourceFile.move(destFile);

                if (i === 0) {
                    albumArtUri = await saveAlbumArt(destFile.uri, bookId, bookDir)
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
                image: albumArtUri,
                chapters: newChapters,
            };

            const updatedBooks = [...books, newBook];
            setBooks(updatedBooks);

            await AsyncStorage.setItem('myBooks', JSON.stringify(updatedBooks));

            console.info(`Successfully added: ${newBook.title} (${newChapters.length} chapters)`);

        } catch (error) {
            console.error('Error adding:', error);
            alert("Error adding. Check your phone's memory.");
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