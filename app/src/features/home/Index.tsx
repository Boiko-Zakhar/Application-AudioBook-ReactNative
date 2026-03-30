import IconBookmark from '@/assets/images/IconBookmark';
import IconChange from '@/assets/images/IconChange';
import IconClock from '@/assets/images/IconClock';
import IconClockActive from '@/assets/images/IconClockActive';
import IconImage from '@/assets/images/IconImage';
import IconLock from '@/assets/images/IconLock';
import IconToShare from '@/assets/images/IconToShare';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { BookCover } from './components/BookCover';
import { HomeHeader } from './components/HomeHeader';
import { PlayerControls } from './components/PlayerControls';
import type { Book } from './hook/useLibrary';



interface IconProps {
    width: number;
    height: number;
    fill: string;
}

interface IconItem {
    id: string;
    Icon: React.FC<IconProps>;
    ActiveIcon: React.FC<IconProps>;
    defaultFill: string;
    activeFill: string;
    onPress: () => void;
}

const BookProgressSimple = ({ theme, bookTitle, chapterIndex, totalChapters }: any) => (
    <View pointerEvents="none" style={styles.brogresBarBook}>
        <Text style={theme.text.regular} numberOfLines={1}>
            {bookTitle ?? "Невідома книга"}
        </Text>

        <Slider
            style={{ width: 200, height: 5, transform: [{ scaleY: 1.9 }, { scaleX: 1.9 }] }}
            minimumValue={0}
            maximumValue={totalChapters > 0 ? totalChapters : 1}
            value={(chapterIndex || 0) + 1}
            disabled={false}
            minimumTrackTintColor={theme.colors.accent}
            maximumTrackTintColor={theme.colors.textGreen}
            thumbTintColor="transparent"
        />

        <Text style={theme.text.green}>
            Глава {(chapterIndex || 0) + 1} з {totalChapters || 0}
        </Text>
    </View>
);

const HomeScreen = () => {
    const { theme } = useTheme();

    const { bookData } = useLocalSearchParams();
    const book: Book | null = bookData ? JSON.parse(bookData as string) : null;

    const [chapterIndex, setChapterIndex] = useState(0);
    const currentChapter = book?.chapters?.[chapterIndex];

    const [initialSeekTime, setInitialSeekTime] = useState<number | null>(null);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);

    const player = useAudioPlayer(currentChapter?.uri || '');

    const [speed, setSpeed] = useState(1.0);

    const status = useAudioPlayerStatus(player);
    const [activeIcons, setActiveIcons] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    }, []);

    useEffect(() => {
        if (status.didJustFinish) {
            handleNextChapter();
        }
    }, [status.didJustFinish]);

    useEffect(() => {
        if (chapterIndex > 0 && !player.playing && status.isLoaded) {
            player.play();
        }
    }, [chapterIndex, status.isLoaded]);

    useEffect(() => {
        const loadProgress = async () => {
            if (!book?.id) {
                setIsLoadingProgress(false);
                return;
            }
            try {
                const jsonString = await AsyncStorage.getItem(`progress_${book.id}`);
                if (jsonString !== null) {
                    const data = JSON.parse(jsonString);

                    setChapterIndex(Number(data.chapterIndex) || 0);

                    if (data.currentTime && data.currentTime > 0) {
                        setInitialSeekTime(data.currentTime);
                    }
                } else {
                    setChapterIndex(0);
                }
            } catch (e) {
                console.error("Помилка завантаження прогресу", e);
            } finally {
                setIsLoadingProgress(false);
            }
        };
        loadProgress();
    }, [book?.id]);

    useEffect(() => {
        if (!status.isLoaded) return;

        if (initialSeekTime !== null) {
            player.seekTo(initialSeekTime);
            setInitialSeekTime(null);
            return;
        }

        if (!isLoadingProgress && !status.playing && initialSeekTime === null) {
            player.play();
        }

    }, [status.isLoaded, initialSeekTime, isLoadingProgress]);

    const lastSavedTime = useRef(0);

    useEffect(() => {
        const saveProgress = async () => {
            if (!book?.id) return;

            const current = status.currentTime || 0;

            if (Math.abs(current - lastSavedTime.current) < 5) {
                return;
            }

            const progressData = {
                chapterIndex: chapterIndex,
                currentTime: current,
                lastUpdated: new Date()
            };

            try {
                await AsyncStorage.setItem(`progress_${book.id}`, JSON.stringify(progressData));
                lastSavedTime.current = current;
            } catch (e) {
                console.error("Помилка збереження", e);
            }
        };

        if (!isLoadingProgress) {
            saveProgress();
        }
    }, [chapterIndex, book?.id, isLoadingProgress, status.currentTime]);

    useEffect(() => {
        if (!player || !status.isLoaded) return;

        if (Math.abs(player.playbackRate - speed) > 0.05) {
            try {
                player.setPlaybackRate(speed);
            } catch (e) {
                console.warn("Не вдалося встановити швидкість:", e);
            }
        }
    }, [status.isLoaded, player, speed]); 

    const handleChangeSpeed = () => {
        const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
        const currentIndex = speeds.indexOf(speed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];

        setSpeed(newSpeed);

        if (player) {
            player.setPlaybackRate(newSpeed);
        }
    };

    const handleTogglePlay = () => {
        if (player.playing) player.pause();
        else player.play();
    };

    const handleSeek = (value: number) => {
        player.seekTo(value);
    };

    const handleRewind = (seconds: number) => {
        const newTime = Math.max(0, status.currentTime - seconds);
        player.seekTo(newTime);
    };

    const handleForward = (seconds: number) => {
        const newTime = Math.min(status.duration || 0, status.currentTime + seconds);
        player.seekTo(newTime);
    };

    const handleNextChapter = () => {
        if (book && book.chapters && chapterIndex < book.chapters.length - 1) {
            setChapterIndex(prev => prev + 1);
        } else {
            player.seekTo(0);
            player.pause();
        }
    };

    const handleBackChapter = () => {
        if (!book || !book.chapters) return;

        if (status.currentTime > 3) {
            player.seekTo(0);
            return;
        }

        if (chapterIndex > 0) {
            setChapterIndex(prev => prev - 1);
        } else {
            player.seekTo(0);
        }
    };

    const toggleIconState = (id: string) => {
        setActiveIcons(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- КОНФІГУРАЦІЯ ІКОНОК ---
    const leftIcons: IconItem[] = [
        { id: 'clock', Icon: IconClock, ActiveIcon: IconClock, defaultFill: theme.colors.muted, activeFill: theme.colors.accent, onPress: () => console.log('Clock pressed') },
        { id: 'lock', Icon: IconLock, ActiveIcon: IconClockActive, defaultFill: theme.colors.muted, activeFill: theme.colors.red, onPress: () => console.log('Lock pressed') },
        { id: 'image', Icon: IconImage, ActiveIcon: IconImage, defaultFill: theme.colors.muted, activeFill: theme.colors.accent, onPress: () => console.log('Image pressed') },
    ];

    const rightIcons: IconItem[] = [
        { id: 'share', Icon: IconToShare, ActiveIcon: IconToShare, defaultFill: theme.colors.muted, activeFill: theme.colors.accent, onPress: () => console.log('Share pressed') },
        { id: 'change', Icon: IconChange, ActiveIcon: IconToShare, defaultFill: theme.colors.muted, activeFill: theme.colors.accent, onPress: () => console.log('Change pressed') },
        { id: 'bookmark', Icon: IconBookmark, ActiveIcon: IconBookmark, defaultFill: theme.colors.muted, activeFill: theme.colors.accent, onPress: () => console.log('Bookmark pressed') },
    ];

    if (!book) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
                <Text style={{ color: theme.text.muted.color }}>Книгу не вибрано</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <HomeHeader
                leftIcons={leftIcons}
                rightIcons={rightIcons}
                activeIcons={activeIcons}
                onToggleIcon={toggleIconState}
            />

            <BookProgressSimple
                theme={theme}
                bookTitle={book.title}
                chapterIndex={chapterIndex}
                totalChapters={book.chapters.length}
            />

            <BookCover
                imageSource={book ? book.image : require('@/assets/images/frame.png')}
                accentColor={theme.colors.accent}
                isPlaying={status.playing}
                onTogglePlay={handleTogglePlay}
            />

            <PlayerControls
                currentTime={status.currentTime}
                duration={status.duration ?? 0}
                theme={theme}
                chapters={book?.chapters || []}
                currentChapterIndex={chapterIndex}
                rate={speed}
                onChangeSpeed={handleChangeSpeed}
                onChapterSelect={(index) => setChapterIndex(index)}
                onSeek={handleSeek}
                onRewind={handleRewind}
                onForward={handleForward}
                onNextFile={handleNextChapter}
                onBackFile={handleBackChapter}
            />
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 35,
        paddingBottom: 5
    },

    brogresBarBook: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 21,
        paddingRight: 21,
    },
});