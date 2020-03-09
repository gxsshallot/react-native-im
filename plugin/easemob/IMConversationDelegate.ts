import { ChatManager, IMConstant } from 'react-native-im-easemob';
import { Delegate, Typings } from '../../standard';

export default function () {
    Delegate.im.conversation.loadList = () => {
        return ChatManager.getAllConversations()
            .then((result: Typings.Message.Origin) => {
                result = result.map((item) => ({
                    ...item,
                    imId: item.conversationId,
                    chatType: item.type,
                }));
                return result;
            });
    };
    Delegate.im.conversation.loadItem = (imId, chatType, autoCreate) => {
        return ChatManager.getConversation(imId, chatType, autoCreate)
            .then((result) => {
                return {
                    ...result,
                    imId: result.conversationId,
                    chatType: result.type,
                };
            });
    };
    Delegate.im.conversation.deleteOne = (imId) => {
        return ChatManager.deleteConversation(imId);
    };
    Delegate.im.conversation.deleteAllMessages = (imId, chatType) => {
        return ChatManager.deleteAllMessages(imId, chatType);
    };
    Delegate.im.conversation.updateMessageExt = (messageId, ext) => {
        return ChatManager.updateMessageExt(messageId, ext);
    };
    // TODO updateConfig
    Delegate.im.conversation.markAllRead = (imId, chatType) => {
        return ChatManager.markAllMessagesAsRead(imId, chatType);
    };
    // TODO markLatestUnread
    Delegate.im.conversation.loadMessage = (params) => {
        const {imId, chatType, lastMessage, count} = params;
        return ChatManager.loadMessages(
            imId,
            chatType,
            lastMessage ? lastMessage.messageId : undefined,
            count,
            IMConstant.MessageSearchDirection.up
        );
    };
    Delegate.im.conversation.deleteMessage = (params) => {
        const {imId, chatType, message: {messageId}} = params;
        return ChatManager.deleteMessage(imId, chatType, messageId);
    };
    Delegate.im.conversation.recallMessage = (params) => {
        const {imId, chatType, message: {messageId}} = params;
        return ChatManager.recallMessage(imId, chatType, messageId);
    };
}