import * as React from 'react';
import { ViewStyle, StyleProp, ImageURISource, ImageRequireSource } from 'react-native';
import { General, GeneralBody, Body, Origin } from './Message';
import { ChatType } from './Conversation';

export interface DisplayState<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
    isSender: boolean;
}

export interface DisplayHandleParams<T extends Body = GeneralBody> {
    ref: (ref: DisplayHandleResult | null) => void;
    message: General<T>;
    isSender: boolean;
    maxWidth: number;
    enableBubble: (status: boolean) => void;
    style: StyleProp<ViewStyle>;
}

export interface DisplayHandleResult<T extends Body = GeneralBody> extends React.ComponentClass<DisplayHandleParams<T>> {
    onPress?: () => void;
}

export type ParseState = Origin;

export type ParseHandleParams = Origin;

export type ParseHandleResult<T extends Body = GeneralBody> = General<T>;

export interface AbstractState<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
}

export interface AbstractHandleParams<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
}

export type AbstractHandleResult = string;

export interface SendState<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
    ext: {[key: string]: any};
}

export interface SendHandleParams<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
    ext: {[key: string]: any};
}

export type SendHandleResult = Promise<Origin>;

export interface MoreBoardState {
    imId: string;
    chatType: ChatType;
    action: string;
}

export interface MoreBoardHandlePressParams<T extends Body = GeneralBody> {
    onDataChange: (body: T) => void;
}

export interface MoreBoardHandleGeneralResult<T extends Body = GeneralBody> {
    text: string;
    icon: ImageURISource | ImageRequireSource;
    onPress: (params: MoreBoardHandlePressParams) => void;
}

export interface MoreBoardHandleResult<T extends Body = GeneralBody> extends MoreBoardHandleGeneralResult<T> {
    messageType: number;
}