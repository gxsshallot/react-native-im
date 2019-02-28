import { General, GeneralBody, Body } from '../Message';
import { ChatType } from '../Conversation';

export interface State<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
}

export interface Params<T extends Body = GeneralBody> {
    imId: string;
    chatType: ChatType;
    message: General<T>;
}

export type Result = string;