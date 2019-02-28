import { ImageURISource, ImageRequireSource } from 'react-native';
import { GeneralBody, Body } from '../Message';
import { ChatType } from '../Conversation';

export interface State {
    imId: string;
    chatType: ChatType;
    action: string;
}

export type Params = void;

export interface PressParams<T extends Body = GeneralBody> {
    onDataChange: (body: T) => void;
}

export interface GeneralResult<T extends Body = GeneralBody> {
    text: string;
    icon: ImageURISource | ImageRequireSource;
    onPress: (params: PressParams<T>) => void;
}

export interface Result<T extends Body = GeneralBody> extends GeneralResult<T> {
    messageType: number;
}