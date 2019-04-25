import { Conversation, Message } from '../model';

/**
 * 会话相关的外部公共接口。
 */
export interface Interface {
    /**
     * 获取会话列表。
     */
    loadList(): Promise<Conversation.Item[]>;

    /**
     * 获取指定会话的信息。
     * @param imId 会话ID。
     * @param chatType 会话聊天类型。
     * @param autoCreate 是否自动创建会话。
     */
    loadItem(
        imId: string,
        chatType: Conversation.ChatType,
        autoCreate: boolean
    ): Promise<Conversation.Item>;

    /**
     * 删除指定会话。
     * @param imId 待删除的会话ID。
     */
    deleteOne(imId: string): Promise<void>;

    /**
     * 更新会话配置信息。
     * @param imId 会话ID。
     * @param config 新的配置信息。
     */
    updateConfig(
        imId: string,
        config: Partial<Conversation.Config>
    ): Promise<Partial<Conversation.Config>>;

    /**
     * 标记指定会话的全部消息已读。
     * @param imId 会话ID。
     * @param chatType 会话聊天类型。
     */
    markAllRead(
        imId: string,
        chatType: Conversation.ChatType
    ): Promise<void>;

    /**
     * 标记指定会话为未读。
     * @param imId 会话ID。
     * @param chatType 会话聊天类型。
     */
    markLatestUnread(
        imId: string,
        chatType: Conversation.ChatType
    ): Promise<void>;

    /**
     * 加载会话中的消息。
     * @param imId 会话ID。
     * @param chatType 会话聊天类型。
     * @param lastMessage 最后一条消息。
     * @param count 加载数量。
     */
    loadMessage(
        imId: string,
        chatType: Conversation.ChatType,
        lastMessage: Message.General,
        count: number
    ): Promise<Message.Origin[]>;

    /**
     * 删除指定消息。
     * @param imId 会话ID。
     * @param chatType 会话聊天类型。
     * @param message 待删除的消息。
     */
    deleteMessage(
        imId: string,
        chatType: Conversation.ChatType,
        message: Message.General
    ): Promise<void>;

    /**
     * 撤回指定消息。
     * @param imId 会话ID。
     * @param chatType 会话聊天类型。
     * @param message 待撤回的消息。
     */
    recallMessage(
        imId: string,
        chatType: Conversation.ChatType,
        message: Message.General
    ): Promise<void>;
}