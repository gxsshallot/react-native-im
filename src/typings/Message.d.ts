export type DeliverStatus = 0 | 1 | 2 | 3;

export interface Body {
    [key: string]: any;
}

export interface General<T = Body> {
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