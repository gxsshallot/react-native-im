/**
 * 消息发送状态。
 */
export enum Status {
    Pending = 0,
    Delivering = 1,
    Succeed = 2,
    Failed = 3,
}

/**
 * 所有消息体的基类。
 */
export interface Body {}

/**
 * 通用消息体。
 */
export interface GeneralBody extends Body {
    [key: string]: any;
}

/**
 * 通用消息。
 */
export interface General<T extends Body = GeneralBody> {
    /**
     * 会话ID。
     */
    conversationId: string;
    /**
     * 消息ID，由IM的SDK生成。
     * 未发送之前是空，发送后或接收的消息不为空。
     */
    messageId?: string;
    /**
     * 内部消息ID，用于发送过程中的消息唯一标识。
     */
    innerId?: string;
    /**
     * 消息发送状态。
     */
    status: Status;
    /**
     * 消息类型。
     */
    type: number;
    /**
     * 发送人ID。
     */
    from: string;
    /**
     * 接收人ID。
     */
    to: string;
    /**
     * 本地时间戳，单位是毫秒。
     */
    localTime: number;
    /**
     * 远程时间戳，单位是毫秒。
     */
    timestamp: number;
    /**
     * 消息体，根据消息类型有所不同。
     */
    data: T;
}

/**
 * IM的SDK中的原始消息对象。
 */
export interface Origin {
    [key: string]: any;
}