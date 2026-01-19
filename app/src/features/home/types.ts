import React from 'react';

export interface IconProps {
    width: number;
    height: number;
    fill: string;
}

export interface IconItem {
    id: string;
    Icon: React.FC<IconProps>;
    ActiveIcon: React.FC<IconProps>;
    defaultFill: string;
    activeFill: string;
    onPress: () => void;
}