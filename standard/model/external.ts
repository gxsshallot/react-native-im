import Listener from '@hecom/listener';
import { Message, Conversation, Event } from '../typings';
import * as Action from './action';
import delegate from '../delegate';

export interface ProcessedMessage<T extends Message.Body = Message.GeneralBody>
    extends Message.General<T> {
    chatType: Conversation.ChatType;
}

export async function onMessageReceived(
    originMessage: Message.Origin
): Promise<ProcessedMessage> {
    //语音消息插入未读标志
    //语音消息插入未点击标志
    const {ext} = originMessage;
    if (ext &&
        ext.extend_message_body &&
        ext.extend_message_body.messageType &&
        ext.extend_message_body.messageType == 5) {
        originMessage.ext.shouldRead = true;
        delegate.im.conversation.updateMessageExt(originMessage.messageId, originMessage.ext);
    }
    
    const message = Action.Parse.get([], originMessage, originMessage);
    if (!message) {
        throw new Error('无法处理该消息');
    }
    const imId = message.conversationId;
    const chatType = message.chatType;
    if (!delegate.model.Conversation.getOne(imId, false)) {
        await delegate.model.Conversation.loadItem(imId, chatType);
    }
    const timeMessage = await delegate.model.Message.insertTimeMessage(imId, chatType, message);
    timeMessage && Listener.trigger([Event.Base, Event.SendMessage, imId], timeMessage);
    await delegate.model.Conversation.updateMessage(imId, message);
    Listener.trigger(
        [Event.Base, Event.ReceiveMessage, imId],
        message
    );
    return {chatType, ...message};
}

export async function onRecallMessage(
    imId: string,
    chatType: Conversation.ChatType,
    fromUserId: string,
    message: Message.General
): Promise<void> {
    const {messageId, localTime, timestamp, innerId} = message;
    const user = getOperatorName(fromUserId);
    const text = user + '撤回了一条消息';
    await delegate.im.conversation.deleteMessage({imId, chatType, message: {messageId}});
    await delegate.model.Conversation.recallMessage(imId, message);
    await delegate.model.Message.insertSystemMessage(imId, Conversation.ChatType.Group, text, localTime, timestamp, innerId);
}

export async function onGroupCreate(
    groupId: string,
    localTime: number,
    timestamp: number
): Promise<void> {
    await groupUpdateOperation(groupId, null, localTime, timestamp);
    const conversation = delegate.model.Conversation.getOne(groupId, false);
    const group = delegate.model.Group.findByGroupId(groupId, false);
    if (!conversation && group && group.owner === delegate.user.getMine().userId) {
        await delegate.model.Conversation.loadItem(groupId, Conversation.ChatType.Group);
        Listener.trigger([Event.Base, Event.Conversation, groupId]);
    }
}

export async function onUserJoin(
    groupId: string,
    invitorId: string,
    userJoinedIds: string[],
    localTime: number,
    timestamp: number
): Promise<void> {
    const invitor = getOperatorName(invitorId);
    const users = userJoinedIds
        .map(userId => getOperatorName(userId))
        .join(',');
    const text = invitor + '邀请' + users + '加入了群聊';
    await groupUpdateOperation(groupId, text, localTime, timestamp);
}

export async function onUserLeave(
    groupId: string,
    operatorId: string,
    userLeavedIds: string[],
    localTime: number,
    timestamp: number
): Promise<void> {
    const users = userLeavedIds
        .map(userId => getOperatorName(userId))
        .join(',');
    const isUserQuit = userLeavedIds.length === 1 && userLeavedIds[0] === operatorId;
    const text =  users + (isUserQuit ? '退出了群聊' : '被移出群聊');
    await groupUpdateOperation(groupId, text, localTime, timestamp);
}

export async function onUserDidLeaveGroup(
    group: object,
    reason: number,
){
    if (reason == 0) {
        await delegate.model.Conversation.deleteOne(group.groupId);
        await delegate.model.Group.deleteOne(group.groupId);  
    }
    Listener.trigger([Event.Base, Event.GroupLeave, group.groupId], {group: group, reason: reason});
}

export async function onUpdateName(
    groupId: string,
    updatorId: string,
    newGroupName: string,
    localTime: number,
    timestamp: number
): Promise<void> {
    const updator = getOperatorName(updatorId);
    const text = updator + '修改群名称为' + newGroupName;
    await groupUpdateOperation(groupId, text, localTime, timestamp);
}

export async function onUpdateOwner(
    groupId: string,
    newOwnerId: string,
    localTime: number,
    timestamp: number
): Promise<void> {
    const user = getOperatorName(newOwnerId);
    const text = '群主已经更换为' + user;
    await groupUpdateOperation(groupId, text, localTime, timestamp);
}

export async function onGroupDelete(
    groupId: string,
): Promise<void> {
    await delegate.model.Conversation.deleteOne(groupId);
    await delegate.model.Group.deleteOne(groupId);
}

export function getOperatorName(userId?: string): string {
    const isMe = userId === delegate.user.getMine().userId;
    return isMe ? '你' : delegate.user.getUser(userId).name;
}

export async function groupUpdateOperation(
    groupId: string,
    text: string | void,
    localTime: number,
    timestamp: number
): Promise<void> {
    await delegate.model.Group.loadItem(groupId);
    if (text && text.length > 0) {
        await delegate.model.Message.insertSystemMessage(groupId, Conversation.ChatType.Group, text, localTime, timestamp);
    }
}