import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { General, GeneralBody, Body } from '../Message';
import { ChatType } from '../Conversation';

export interface State<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
    isSender: boolean;
}

export interface Params<T extends Body = GeneralBody> {
    ref: (ref: Result | null) => void;
    message: General<T>;
    isSender: boolean;
    maxWidth: number;
    enableBubble: (status: boolean) => void;
    style: StyleProp<ViewStyle>;
}

export interface Result<T extends Body = GeneralBody> extends React.ComponentClass<Params<T>> {
    onPress?: () => void;
}