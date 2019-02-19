export type DeliverStatus = 0 | 1 | 2 | 3;

export interface Body {}

export interface GeneralBody extends Body {
    [key: string]: any;
}

export interface General<T extends Body = GeneralBody> {
    conversationId: string;
    messageId?: string;
    innerId?: string;
    status: DeliverStatus;
    type: number;
    from: string;
    to: string;
    localTime: number;
    timestamp: number;
    data: T;
}

export type GeneralList = General[];

export interface Origin {
    [key: string]: any;
}

export type OriginList = Origin[];

export interface TextBody extends Body {
    atMemberList: string | string[];
    text: string;
    isSystem: boolean;
}

export type Text = General<TextBody>;

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

export type Image = General<ImageBody>;

export interface VoiceBody extends Body {
    localPath: string;
    remotePath: string;
    duration: number;
}

export type Voice = General<VoiceBody>;

export interface LocationBody extends Body {
    latitude: number;
    longitude: number;
    address: string;
    name: string;
}

export type Location = General<LocationBody>;

export interface VideoBody extends Body {
    localPath?: string;
    remotePath?: string;
    duration: number;
}

export type Video = General<VideoBody>;

export interface FileBody extends Body {
    localPath?: string;
    remotePath?: string;
    name: string;
    size: number;
}

export type File = General<FileBody>;