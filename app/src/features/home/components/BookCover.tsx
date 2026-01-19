import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, TouchableRipple } from 'react-native-paper';

interface BookCoverProps {
    imageSource: any;
    accentColor: string;
    isPlaying: boolean;
    onTogglePlay: () => void;
}

export const BookCover = ({
    imageSource,
    accentColor,
    isPlaying,
    onTogglePlay,
}: BookCoverProps) => {
    return (
        <TouchableRipple
            onPress={() => onTogglePlay()}
            rippleColor="rgba(0, 0, 0, .32)" 
            style={{ borderRadius: 10 }} 
        >
            <View style={styles.imageBook} >
                <Image
                    source={imageSource}
                    style={{ width: '100%', height: '100%', borderRadius: 10 }}
                />
                <IconButton
                    style={styles.overlayButton}
                    icon={() => isPlaying
                        ? <FontAwesome name="pause" color={accentColor} size={32} />
                        : <FontAwesome name="play" color={accentColor} size={32} />
                    }
                />
            </View>
        </TouchableRipple>
    );
};

const styles = StyleSheet.create({
    imageBook: {
        position: 'relative',
        marginTop: 15,
        width: 375,
        height: 420,
        marginBottom: 15,
    },
    overlayButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -22.5 }, { translateY: -22.5 }],
        borderRadius: 5,
    },
});