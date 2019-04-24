import * as Message from './Message';

/**
 * 会话聊天类型。
 */
export enum ChatType {
    /**
     * 单聊。
     */
    Single = 0,
    /**
     * 群聊。
     */
    Group = 1,
}

/**
 * 会话的基本属性，用于页面或组件间传递属性。
 */
export interface Props {
    /**
     * 会话ID。
     */
    imId: string;
    /**
     * 会话聊天类型。
     */
    chatType: ChatType;
}

/**
 * 会话的配置信息。
 */
export interface Config {
    /**
     * 是否置顶。
     */
    top: boolean;
}

/**
 * 会话的基础信息。
 */
export interface Item extends Props, Config {
    /**
     * 最新消息，如不存在则表示是空会话。
     */
    latestMessage: Message.General | null;
    /**
     * 未读消息数。
     */
    unreadMessageCount: number;
    /**
     * 是否@我。
     */
    atMe: boolean;
}

/**
 * 会话的抽象基类。
 */
export abstract class Base {
    /**
     * 会话的基础信息。
     */
    protected item: Item;

    /**
     * 构造函数。
     * @param conversation 传入的会话基本信息。
     */
    protected constructor(conversation: Item) {
        this.item = conversation;
    }

    /**
     * 更新会话信息。
     */
    public abstract async update(): Promise<void>;

    /**
     * 判断会话是否有效。
     */
    public abstract isValid(): boolean;

    /**
     * 获取会话ID。
     */
    public abstract get imId(): string;

    /**
     * 获取会话类型。
     */
    public abstract get chatType(): ChatType;

    /**
     * 获取会话名称。
     */
    public abstract get name(): string;

    /**
     * 获取未读消息数。
     */
    public abstract get unreadMessageCount(): number;

    /**
     * 获取是否@我。
     */
    public abstract get atMe(): boolean;

    /**
     * 设置是否@我。
     * @param newAtMe 新的状态。
     */
    public abstract set atMe(newAtMe: boolean);

    /**
     * 获取是否置顶。
     */
    public abstract get top(): boolean;

    /**
     * 设置是否置顶。
     * @param isTop 新的置顶状态。
     */
    public abstract async setTop(isTop: boolean): Promise<boolean>;

    /**
     * 更新最新消息。
     * @param latestMessage 会话的最新消息。
     */
    public abstract async updateLatestMessage(latestMessage: Message.General): Promise<void>;

    /**
     * 发送普通消息。
     * @param message 消息对象。
     */
    public abstract async sendMessage(message: Message.General): Promise<Message.General>;

    /**
     * 根据已有消息，选择是否插入时间消息，如果插入，返回插入后的时间消息对象。
     * @param message 已有消息。
     */
    public abstract async insertTimeMessage(message: Message.General): Promise<Message.General | void>;

    /**
     * 插入系统消息。
     * @param message 系统消息对象。
     */
    public abstract async insertSystemMessage(message: Message.General): Promise<Message.General>;

    /**
     * 从外界收到普通消息的处理方法。
     * @param originMessage 外界IM的SDK收到的原始消息。
     */
    public abstract async onMessageReceived(originMessage: Message.Origin): Promise<Message.General>;
}

/**
 * IM的SDK的原始会话对象。
 */
export interface Origin {
    [key: string]: any;
}