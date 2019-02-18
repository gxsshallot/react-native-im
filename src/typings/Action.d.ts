import { ViewStyle, StyleProp, ImageURISource, ImageRequireSource } from 'react-native';
import { General, Body } from './Message';
import { ChatType } from './Conversation';

export interface DisplayHandleParams<T = General> {
    message: T;
    isSender: boolean;
    maxWidth: number;
    enableBubble: (status: boolean) => void;
    style: StyleProp<ViewStyle>;
}

export interface DisplayHandleResult<T = General> extends React.Component<DisplayHandleParams<T>> {
    onPress?: () => void;
}

export interface AbstractHandleParams<T = General> {
    chatType: ChatType;
    message: T;
}

export type AbstractHandleResult = string;

export interface MoreBoardHandlePressParams<T = Body> {
    onDataChange: (body: T) => void;
}

export interface MoreBoardHandleGeneralResult<T = Body> {
    text: string;
    icon: ImageURISource | ImageRequireSource;
    onPress: (params: MoreBoardHandlePressParams) => void;
}

export interface MoreBoardHandleResult<T = Body> extends MoreBoardHandleGeneralResult<T> {
    messageType: number;
}