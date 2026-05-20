import IconBookmark from '@/app/src/assets/images/IconBookmark';
import IconChange from '@/app/src/assets/images/IconChange';
import IconClockActive from '@/app/src/assets/images/IconClockActive';
import IconLock from '@/app/src/assets/images/IconLock';
import IconToShare from '@/app/src/assets/images/IconToShare';
import { useSettings } from '@/app/src/context/SettingsContext';
import { useTheme } from '@/app/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useTypography } from '../../hooks/useTypography';
import { speak } from '../speech';
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

const BookProgressSimple = ({ theme, bookTitle, chapterIndex, totalChapters, onPress }: any) => {
    const { getFontSize } = useTypography();

    return (
        <Pressable
            onPress={onPress}
        >
            <View pointerEvents="none" style={styles.brogresBarBook}>
                <Text
                    style={{
                        color: theme.colors.onSurface,
                        fontSize: getFontSize(16),
                        lineHeight: getFontSize(22),
                        textAlign: 'center'
                    }}
                    numberOfLines={1}
                >
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

                <Text style={{
                    color: theme.colors.primary,
                    fontSize: getFontSize(14)
                }}>
                    Глава {(chapterIndex || 0) + 1} з {totalChapters || 0}
                </Text>
            </View>
        </Pressable>
    )
};

const HomeScreen = () => {
    const router = useRouter();

    const { getFontSize } = useTypography();
    const { settings } = useSettings();
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

    const [visible, setVisible] = useState(false);
    const toggleAlert = () => {
        const nextState = !visible;
        setVisible(nextState);

        if (settings.voiceAction) {
            const message = nextState
                ? "На жаль, ця можливість ще недоступна. Ми працюємо над її додаванням у найближчих оновленнях."
                : "Закрито";
            speak(message);
        }
    };

    const [disablePlayer, setDisablePlayer] = useState(false);
    const toggleControllplayer = () => {
        if (!disablePlayer) {
            setDisablePlayer(true);
            if (settings.voiceAction) speak("Керування заблоковано");
        } else if (disablePlayer) {
            setDisablePlayer(false);
            if (settings.voiceAction) speak("Керування розблоковано");
        }
    };

    const [sleepTimer, setSleepTimer] = useState<number | null>(null);
    const [isSleepDialogVisible, setIsSleepDialogVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);

    useEffect(() => {
        if (sleepTimer !== null && sleepTimer > 0) {
            timerRef.current = setInterval(() => {
                setSleepTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else if (sleepTimer === 0) {
            if (player.playing) {
                player.pause();
                setSelectedMinutes(null);
                if (settings.voiceAction) speak("Таймер завершено, відтворення зупинено");
            }
            setSleepTimer(null);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [sleepTimer, player.playing]);

    const startSleepTimer = (minutes: number) => {
        setSleepTimer(minutes * 60);
        setSelectedMinutes(minutes);
        setIsSleepDialogVisible(false);
        if (settings.voiceAction) speak(`Таймер сну встановлено на ${minutes} хвилин`);
    };

    useEffect(() => {
        if (settings.voiceAction) {
            speak("Швидкість відтворення ікс " + speed + " разів")
        }
    }, [speed])

    useEffect(() => {
        setAudioModeAsync({
            allowsRecording: false,
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            shouldRouteThroughEarpiece: false
        });
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
            player.pause();
        }

    }, [status.isLoaded, initialSeekTime, isLoadingProgress]);

    useEffect(() => {
        if (settings.voiceAction && !status.playing) {
            speak("Пауза");
        }
    }, [status.playing])

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
        else {
            Speech.stop();
            player.play()
        };
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

    const createExpoIcon = (name: keyof typeof Ionicons.glyphMap) => {
        return ({ fill }: { fill?: string }) => (
            <Ionicons name={name} size={24} color={fill} />
        );
    };

    const leftIcons: IconItem[] = [
        {
            id: 'setting',
            Icon: createExpoIcon('settings-outline'),
            ActiveIcon: createExpoIcon('settings-outline'),
            defaultFill: theme.colors.onSurfaceVariant, activeFill: theme.colors.onSurfaceVariant,
            onPress: () => router.navigate("/Settings")
        },
        {
            id: 'lock',
            Icon: IconLock, ActiveIcon: IconClockActive,
            defaultFill: theme.colors.onSurfaceVariant, activeFill: theme.colors.red,
            onPress: () => toggleControllplayer()
        },
        {
            id: 'clock',
            Icon: createExpoIcon('timer-outline'),
            ActiveIcon: createExpoIcon('timer-outline'),
            defaultFill: sleepTimer ? theme.colors.accent : theme.colors.onSurfaceVariant,
            activeFill: sleepTimer ? theme.colors.accent : theme.colors.onSurfaceVariant,
            onPress: () => setIsSleepDialogVisible(true)
        },
    ];

    const rightIcons: IconItem[] = [
        {
            id: 'share',
            Icon: IconToShare,
            ActiveIcon: IconToShare,
            defaultFill: theme.colors.onSurfaceVariant,
            activeFill: theme.colors.onSurfaceVariant,
            onPress: () => toggleAlert()
        },
        {
            id: 'change',
            Icon: IconChange,
            ActiveIcon: IconChange,
            defaultFill: theme.colors.onSurfaceVariant,
            activeFill: theme.colors.onSurfaceVariant,
            onPress: () => toggleAlert()
        },
        {
            id: 'bookmark',
            Icon: IconBookmark,
            ActiveIcon: IconBookmark,
            defaultFill: theme.colors.onSurfaceVariant,
            activeFill: theme.colors.onSurfaceVariant,
            onPress: () => toggleAlert()
        },
    ];

    const lastAnnouncedBookId = useRef<string | null>(null);

    useEffect(
        useCallback(() => {
            const announceArrival = async () => {

                if (settings.voiceMeta && book?.id && status.isLoaded && lastAnnouncedBookId.current !== book.id) {
                    setTimeout(() => {
                        const cMin = Math.floor(status.currentTime / 60);
                        const dMin = Math.floor((status.duration || 0) / 60);

                        const message = `Ви відкрили книгу: ${book.title}. Прослухано ${cMin} з ${dMin} хвилин. Глава ${chapterIndex + 1}`;

                        speak(message);
                        lastAnnouncedBookId.current = book.id;
                    }, 1200);
                }
            };

            announceArrival();
        }, [book?.id, status.isLoaded, settings.voiceMeta, settings.voiceAction])
    );

    useFocusEffect(
        useCallback(() => {
            if (settings.voiceAction) {
                console.log(settings.voiceAction)
                speak("Головний екран");
            }
        }, [settings.voiceAction])

    );

    useEffect(() => {
        if (settings.voiceMeta && chapterIndex !== undefined && lastAnnouncedBookId.current === book?.id) {
            speak(`Глава ${chapterIndex + 1}`);
        }
    }, [chapterIndex]);

    const handleStatusRequest = () => {
        if (settings.voiceMeta) {
            const percent = Math.round((status.currentTime / (status.duration || 1)) * 100);
            const remainingMin = Math.floor(((status.duration || 0) - status.currentTime) / 60);
            speak(`Пройдено ${percent} відсотків. Залишилося приблизно ${remainingMin} хвилин.`);
        }
    };

    if (!book) {
        return (
            <View style={[styles.containerAlert, { paddingTop: 30, backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
                <HomeHeader
                    leftIcons={leftIcons}
                    rightIcons={rightIcons}
                    activeIcons={activeIcons}
                    onToggleIcon={toggleIconState}
                    isLocked={disablePlayer}
                />
                <View style={styles.centeredContent}>
                    <Text style={{ color: theme.text.muted.color, fontSize: getFontSize(16) }}>
                        Книгу не обрано
                    </Text>
                </View>

                <Portal>
                    <Dialog style={{
                        backgroundColor: theme.colors.surface
                    }}
                        visible={visible}
                        onDismiss={toggleAlert}
                    >
                        <Dialog.Title>Повідомлення</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">На жаль, ця можливість ще недоступна. Ми працюємо над її додаванням у найближчих оновленнях.</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={toggleAlert}>Зрозуміло</Button>
                        </Dialog.Actions>
                    </Dialog>

                    <Dialog
                        visible={isSleepDialogVisible}
                        onDismiss={() => setIsSleepDialogVisible(false)}
                        style={{ backgroundColor: theme.colors.surface }}
                    >
                        <Dialog.Title style={{ textAlign: 'center' }}>
                            Таймер сну
                        </Dialog.Title>

                        <Dialog.Content>
                            <View style={styles.timerGrid}>
                                {[15, 30, 45, 60].map((min) => {
                                    const isActive = selectedMinutes === min;
                                    return (
                                        <Pressable
                                            key={min}
                                            onPress={() => startSleepTimer(min)}
                                            style={({ pressed }) => [
                                                styles.timerBox,
                                                {
                                                    backgroundColor: isActive ? theme.colors.accent : '#2C2C2E',
                                                    opacity: pressed ? 0.7 : 1,
                                                },
                                            ]}
                                        >
                                            <Text style={[styles.timerValue, { color: isActive ? '#000' : '#FFF' }]}>
                                                {min}
                                            </Text>
                                            <Text style={[styles.timerUnit, { color: isActive ? '#000' : '#AAA' }]}>
                                                хв
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </Dialog.Content>

                        <Dialog.Actions style={{ justifyContent: 'center', paddingBottom: 15 }}>
                            {sleepTimer !== null ? (
                                <Button
                                    textColor={theme.colors.error}
                                    onPress={() => {
                                        setSleepTimer(null);
                                        setIsSleepDialogVisible(false);
                                        setSelectedMinutes(null);
                                        if (settings.voiceAction) speak("Таймер скинуто.");
                                    }}
                                >
                                    Вимкнути таймер
                                </Button>
                            ) : (
                                <Button
                                    textColor={theme.colors.accent}
                                    onPress={() => {
                                        setIsSleepDialogVisible(false);
                                        if (settings.voiceAction) speak("Закрито.");
                                    }}
                                >
                                    Закрити
                                </Button>
                            )}
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }
    return (
        <View style={[styles.container, { paddingTop: 30, backgroundColor: theme.colors.surface }]}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <HomeHeader
                    leftIcons={leftIcons}
                    rightIcons={rightIcons}
                    activeIcons={activeIcons}
                    onToggleIcon={toggleIconState}
                    isLocked={disablePlayer}
                />

                <BookProgressSimple
                    theme={theme}
                    bookTitle={book.title}
                    chapterIndex={chapterIndex}
                    totalChapters={book.chapters.length}
                    onPress={handleStatusRequest}
                />

                <View
                    style={{ opacity: disablePlayer ? 0.5 : 1 }}
                    pointerEvents={disablePlayer ? 'none' : 'auto'}
                >
                    <BookCover
                        imageSource={book ? book.image : require('@/app/src/assets/images/frame.jpg')}
                        accentColor={theme.colors.accent}
                        isPlaying={status.playing}
                        onTogglePlay={handleTogglePlay}
                    />
                </View>

                <View
                    style={{ opacity: disablePlayer ? 0.5 : 1 }}
                    pointerEvents={disablePlayer ? 'none' : 'auto'}
                >
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

            </ScrollView>

            <Portal>
                <Dialog style={{
                    backgroundColor: theme.colors.surface
                }}
                    visible={visible}
                    onDismiss={toggleAlert}
                >
                    <Dialog.Title>Повідомлення</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">На жаль, ця можливість ще недоступна. Ми працюємо над її додаванням у найближчих оновленнях.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={toggleAlert}>Зрозуміло</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog
                    visible={isSleepDialogVisible}
                    onDismiss={() => setIsSleepDialogVisible(false)}
                    style={{ backgroundColor: theme.colors.surface }}
                >
                    <Dialog.Title style={{ textAlign: 'center' }}>
                        Таймер сну
                    </Dialog.Title>

                    <Dialog.Content>
                        <View style={styles.timerGrid}>
                            {[15, 30, 45, 60].map((min) => {
                                const isActive = selectedMinutes === min;
                                return (
                                    <Pressable
                                        key={min}
                                        onPress={() => startSleepTimer(min)}
                                        style={({ pressed }) => [
                                            styles.timerBox,
                                            {
                                                backgroundColor: isActive ? theme.colors.accent : '#2C2C2E',
                                                opacity: pressed ? 0.7 : 1,
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.timerValue, { color: isActive ? '#000' : '#FFF' }]}>
                                            {min}
                                        </Text>
                                        <Text style={[styles.timerUnit, { color: isActive ? '#000' : '#AAA' }]}>
                                            хв
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </Dialog.Content>

                    <Dialog.Actions style={{ justifyContent: 'center', paddingBottom: 15 }}>
                        {sleepTimer !== null ? (
                            <Button
                                textColor={theme.colors.error}
                                onPress={() => {
                                    setSleepTimer(null);
                                    setIsSleepDialogVisible(false);
                                    setSelectedMinutes(null);
                                    if (settings.voiceAction) speak("Таймер скинуто.");
                                }}
                            >
                                Вимкнути таймер
                            </Button>
                        ) : (
                            <Button
                                textColor={theme.colors.accent}
                                onPress={() => {
                                    setIsSleepDialogVisible(false);
                                    if (settings.voiceAction) speak("Закрито.");
                                }}
                            >
                                Закрити
                            </Button>
                        )}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({

    containerAlert: {
        flex: 4,
        alignItems: 'center',
        paddingBottom: 5,
    },
    container: {
        flex: 1,
        paddingBottom: 5,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
    },
    brogresBarBook: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 21,
        paddingRight: 21,
    },
    timerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 10,
    },
    timerBox: {
        width: '47%',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerValue: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    timerUnit: {
        fontSize: 12,
        marginTop: -2,
    },
});