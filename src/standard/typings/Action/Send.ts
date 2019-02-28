import { General, GeneralBody, Body, Origin } from '../Message';
import { ChatType } from '../Conversation';

export interface State<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
    ext: {[key: string]: any};
}

export interface Params<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
    ext: {[key: string]: any};
}

export type Result = Promise<Origin>;