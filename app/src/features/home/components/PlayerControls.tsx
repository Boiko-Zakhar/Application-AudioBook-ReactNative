import IcontBack from '@/assets/images/IconBack';
import IconFastForward from '@/assets/images/IconFastForward';
import IconForward from '@/assets/images/IconForward';
import IconRewind from '@/assets/images/IconRewind';
import { useSettings } from '@/context/SettingsContext';
import Slider from '@react-native-community/slider';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { speak } from '../../speach';

interface ChapterItem {
    id: string;
    title: string;
}

interface PlayerControlsProps {
    currentTime: number;
    duration: number;
    theme: any;
    chapters: ChapterItem[];
    currentChapterIndex: number;
    rate: number;
    onChangeSpeed: () => void;
    onChapterSelect: (index: number) => void;
    onSeek: (value: number) => void;
    onRewind: (seconds: number) => void;
    onForward: (seconds: number) => void;
    onNextFile: () => void;
    onBackFile: () => void;
}

export const PlayerControls = ({
    currentTime,
    duration,
    theme,
    chapters = [],
    currentChapterIndex,
    rate = 1.0,
    onChangeSpeed,
    onChapterSelect,
    onSeek,
    onRewind,
    onForward,
    onNextFile,
    onBackFile
}: PlayerControlsProps) => {
    const { settings } = useSettings();
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: theme.colors.background, padding: 20, marginHorizontal: 50, maxHeight: '50%' };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <View style={styles.management}>
            <View style={styles.timeManagement}>
                <View style={styles.leftGrupBtt}>
                    <View style={styles.bttGrup}>
                        <IconButton
                            style={{ margin: 0, padding: 0 }}
                            icon={() => <IconRewind width={32} height={32} fill={theme.colors.accent} />}
                            onPress={() => onRewind(60)}
                        />
                        <Text style={theme.text.muted}>1хв</Text>
                    </View>
                    <View style={styles.bttGrup}>
                        <IconButton
                            style={{ margin: 0, padding: 0 }}
                            icon={() => <IconRewind width={32} height={32} fill={theme.colors.accent} />}
                            onPress={() => onRewind(15)}
                        />
                        <Text style={theme.text.muted}>15с</Text>
                    </View>
                </View>

                <View style={styles.midlBtt}>
                    <Button
                        mode="text"
                        onPress={onChangeSpeed}
                        labelStyle={{
                            fontFamily: theme.text.bold.fontFamily,
                            fontSize: 32,
                            fontWeight: '400',
                            color: theme.colors.textBlack
                        }}
                    >
                        {rate}X
                    </Button>
                </View>

                <View style={styles.rightsGrupBtt}>
                    <View style={styles.bttGrup}>
                        <IconButton
                            style={{ margin: 0, padding: 0 }}
                            icon={() => <IconFastForward width={32} height={32} fill={theme.colors.accent} />}
                            onPress={() => onForward(15)}
                        />
                        <Text style={theme.text.muted}>15с</Text>
                    </View>
                    <View style={styles.bttGrup}>
                        <IconButton
                            style={{ margin: 0, padding: 0 }}
                            icon={() => <IconFastForward width={32} height={32} fill={theme.colors.accent} />}
                            onPress={() => onForward(60)}
                        />
                        <Text style={theme.text.muted}>1хв</Text>
                    </View>
                </View>
            </View>

            <View style={styles.timeSlider}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration ?? 1}
                    value={currentTime}
                    onSlidingComplete={(value) => {
                        onSeek(value);

                        if (settings.voiceAction) {
                            const mins = Math.floor(value / 60);
                            const secs = Math.trunc(value % 60);
                            speak(`Встановлено час: ${mins} хвилин ${secs} секунд`);
                        }
                    }}
                    minimumTrackTintColor={theme.colors.accent}
                    thumbTintColor={theme.colors.accent}
                    maximumTrackTintColor={theme.colors.textGreen}
                />
                <View style={styles.time}>
                    <Text style={theme.text.green}>{formatTime(currentTime)}</Text>
                    <Text style={theme.text.green}>{formatTime(duration)}</Text>
                </View>
            </View>

            <View style={styles.fileGrupBtt}>
                <IconButton
                    style={{ margin: 0, padding: 0 }}
                    icon={() => <IcontBack width={32} height={32} fill={theme.colors.accent} />}
                    onPress={() => onBackFile()}
                />

                <View style={styles.centerWrapper}>
                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                            <FlatList
                                data={chapters}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <Button
                                        textColor={theme.colors.textBlack}
                                        onPress={() => {
                                            onChapterSelect(index);
                                            hideModal();
                                        }}
                                        style={{ marginBottom: 5 }}
                                    >
                                        {item.title}
                                    </Button>
                                )}
                            />
                        </Modal>
                    </Portal>
                    <Button
                        icon="chevron-down"
                        contentStyle={{ flexDirection: 'row-reverse' }}
                        textColor={theme.colors.textBlack}
                        onPress={showModal}
                    >
                        {chapters[currentChapterIndex]?.title || 'Виберіть розділ'}
                    </Button>
                </View>

                <IconButton
                    style={{ margin: 0, padding: 0 }}
                    icon={() => <IconForward width={32} height={32} fill={theme.colors.accent} />}
                    onPress={() => onNextFile()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    management: {
        paddingLeft: 20,
        paddingRight: 20
    },
    timeManagement: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftGrupBtt: {
        flexDirection: 'row',
        gap: 21
    },
    rightsGrupBtt: {
        flexDirection: 'row',
        gap: 21
    },
    bttGrup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    timeSlider: { marginTop: 15, justifyContent: 'center', alignItems: 'center', gap: 8 },
    slider: { width: '69%', height: 10, transform: [{ scaleY: 1.6 }, { scaleX: 1.6 }] },
    time: { width: 320, flexDirection: 'row', justifyContent: 'space-between' },
    fileGrupBtt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    centerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
