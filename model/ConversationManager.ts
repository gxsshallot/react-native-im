import * as Conversation from './Conversation';
import * as Message from './Message';

/**
 * 会话管理器的抽象基类。
 */
export abstract class Base {
    /**
     * 会话映射关系，以会话ID为索引。
     */
    protected items: {[imId: string]: Conversation.Base} = {};

    /**
     * 初始化管理器。
     * @param forceUpdate 是否强制刷新会话列表。
     */
    public abstract async init(forceUpdate: boolean): Promise<void>;

    /**
     * 反初始化管理器。
     * @param forceClear 是否强制清除本地持久化数据。
     */
    public abstract async uninit(forceClear: boolean): Promise<void>;

    /**
     * 刷新会话列表。
     */
    public abstract async load(): Promise<void>;

    /**
     * 获取会话列表。
     */
    public abstract get(): Conversation.Base[];

    /**
     * 创建一个会话。
     * @param members 人员ID列表，为字符串或单元素数组时为单聊，为数组且长度大于2的时候为群聊。
     */
    public abstract async createOne(members: string | string[]): Promise<Conversation.Base>;

    /**
     * 删除一个会话。
     * @param imId 待删除的会话ID。
     */
    public abstract async deleteOne(imId: string): Promise<void>;

    /**
     * 从外界收到普通消息的处理方法。
     * @param originMessage 外界IM的SDK收到的原始消息。
     */
    public abstract async onMessageReceived(originMessage: Message.Origin): Promise<Message.General>;
}