/**
 * Message send status.
 */
import {ChatType} from "./Conversation";

export enum Status {
    Pending = 0,
    Delivering = 1,
    Succeed = 2,
    Failed = 3,
}

/**
 * Super message body interface as an empty object.
 */
export interface Body {
}

/**
 * General message body with an indexed key.
 */
export interface GeneralBody extends Body {
    [key: string]: any;
}

/**
 * General message with a body which uses general body as default.
 */
export interface General<T extends Body = GeneralBody> {
    conversationId: string;
    messageId?: string;
    innerId?: string;
    chatType?: ChatType.Single | ChatType.Group;
    direction?: number;
    isRead?: boolean;
    status: Status;
    type: number;
    from: string;
    to: string;
    localTime: number;
    timestamp: number;
    data: T;
}

/**
 * Origin message which we don't know its structure.
 */
export interface Origin {
    [key: string]: any;
}

/**
 * Identity for '@all'.
 */
export const AtAll = '__at_all_message__';

/**
 * '@all' or '@a @b ...', is at members list.
 */
export type AtList = typeof AtAll | string[];

/**
 * Text message body.
 */
export interface TextBody extends Body {
    atMemberList: AtList;
    text: string;
    isSystem: boolean;
    quoteMsg:General|undefined;
}

/**
 * Text message.
 */
export type Text = General<TextBody>;

/**
 * Image message body.
 */
export interface ImageBody extends Body {
    thumbnailLocalPath?: string;
    thumbnailRemotePath?: string;
    localPath?: string;
    remotePath?: string;
    size?: {
        width: number;
        height: number;
    };
}

/**
 * Image message.
 */
export type Image = General<ImageBody>;

/**
 * Voice message body.
 */
export interface VoiceBody extends Body {
    localPath: string;
    remotePath: string;
    duration: number;
    shouldRead?: boolean;
}

/**
 * Voice message.
 */
export type Voice = General<VoiceBody>;

/**
 * Location message body.
 */
export interface LocationBody extends Body {
    latitude: number;
    longitude: number;
    address: string;
    name: string;
}

/**
 * Location message.
 */
export type Location = General<LocationBody>;

/**
 * Video message body.
 */
export interface VideoBody extends Body {
    localPath?: string;
    remotePath?: string;
    duration: number;
    shouldRead?: boolean;
}

/**
 * Video message.
 */
export type Video = General<VideoBody>;

/**
 * File message body.
 */
export interface FileBody extends Body {
    localPath?: string;
    remotePath?: string;
    name: string;
    size: number;
}

/**
 * File message.
 */
export type File = General<FileBody>;