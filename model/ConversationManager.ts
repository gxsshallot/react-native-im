import * as Conversation from './Conversation';
import * as Message from './Message';

/**
 * 会话管理器的公共接口。
 */
export interface Interface {
    /**
     * 初始化管理器。
     * @param forceUpdate 是否强制刷新会话列表。
     */
    init(forceUpdate: boolean): Promise<void>;

    /**
     * 反初始化管理器。
     * @param forceClear 是否强制清除本地持久化数据。
     */
    uninit(forceClear: boolean): Promise<void>;

    /**
     * 刷新会话列表。
     */
    load(): Promise<void>;

    /**
     * 获取会话列表。
     */
    get(): Conversation.Interface[];

    /**
     * 根据会话ID查找会话，确定存在，如不存在，则抛出异常。
     * @param imId 会话ID。
     */
    getOne(imId: string): Conversation.Interface;

    /**
     * 根据会话ID查找会话，不确定是否存在。
     * @param imId 会话ID。
     */
    findByImId(imId: string): Conversation.Interface | void;

    /**
     * 创建一个会话。
     * @param members 人员ID列表，为字符串或单元素数组时为单聊，为数组且长度大于2的时候为群聊。
     */
    createOne(members: string | string[]): Promise<Conversation.Interface>;

    /**
     * 删除一个会话。
     * @param imId 待删除的会话ID。
     */
    deleteOne(imId: string): Promise<void>;

    /**
     * 从外界收到普通消息的处理方法。
     * @param originMessage 外界IM的SDK收到的原始消息。
     */
    onMessageReceived(originMessage: Message.Origin): Promise<Message.General>;
}