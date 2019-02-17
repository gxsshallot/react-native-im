import { ChatManager, IMConstant } from 'react-native-im-easemob';
import * as IMStandard from '../../src';

export default function () {
    IMStandard.Delegate.im.conversation.loadList = () => {
        return ChatManager.getAllConversations()
            .then((result) => {
                console.log(result);
                result = result.map((item) => ({
                    ...item,
                    imId: item.conversationId,
                    chatType: item.type,
                }));
                return result;
            });
    };
    IMStandard.Delegate.im.conversation.loadItem = (imId, chatType, autoCreate) => {
        return ChatManager.getConversation(imId, chatType, autoCreate)
            .then((result) => {
                return {
                    ...result,
                    imId: result.conversationId,
                    chatType: result.type,
                };
            });
    };
    IMStandard.Delegate.im.conversation.deleteOne = (imId) => {
        return ChatManager.deleteConversation(imId);
    };
    // TODO updateConfig
    IMStandard.Delegate.im.conversation.markAllRead = (imId, chatType) => {
        return ChatManager.markAllMessagesAsRead(imId, chatType);
    };
    // TODO markLatestUnread
    IMStandard.Delegate.im.conversation.loadMessage = (params) => {
        const {imId, chatType, lastMessageId, count} = params;
        return ChatManager.loadMessages(
            imId,
            chatType,
            lastMessageId,
            count,
            IMConstant.MessageSearchDirection.up
        );
    };
    IMStandard.Delegate.im.conversation.deleteMessage = (params) => {
        const {imId, chatType, message: {messageId}} = params;
        return ChatManager.deleteMessage(imId, chatType, messageId);
    };
    // TODO recallMessage
}