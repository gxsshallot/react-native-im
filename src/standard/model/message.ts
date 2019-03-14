import Listener from 'react-native-general-listener';
import * as Action from './action';
import { Message, Conversation, Event } from '../typings';
import { guid } from '../util';
import delegate from '../delegate';

export async function sendMessage(
    imId: string,
    chatType: Conversation.ChatType,
    message: Message.General,
    ext: object = {},
    isSystem: boolean = false
): Promise<void> {
    ext = {...ext, innerId: message.innerId};
    const sendEventName = [Event.Base, Event.SendMessage, imId];
    if (!delegate.model.Conversation.getOne(imId, false)) {
        await delegate.model.Conversation.loadItem(imId, chatType);
    }
    const timeMessage = await insertTimeMessage(imId, chatType, message);
    timeMessage && Listener.trigger(sendEventName, timeMessage);
    await delegate.model.Conversation.updateMessage(imId, message);
    // 事件发送之前，先触发通知，加入详情列表中，发送后再更新状态
    !isSystem && Listener.trigger(sendEventName, message);
    const promise = Action.Send.get(
        message.type,
        {imId, chatType, message, ext},
        {imId, chatType, message, ext}
    );
    if (!promise) {
        throw new Error('暂不支持发送该消息类型');
    }
    const newOriginMessage = await promise;
    const newMessage = Action.Parse.get([], newOriginMessage, newOriginMessage);
    Listener.trigger(sendEventName, newMessage);
    await delegate.model.Conversation.updateMessage(imId, newMessage);
}

export async function insertTimeMessage(
    imId: string,
    chatType: Conversation.ChatType,
    message: Message.General
): Promise<Message.General> {
    const conversation = delegate.model.Conversation.getOne(imId, false);
    if (conversation.latestMessage) {
        const oldMessage = conversation.latestMessage;
        const delta = message.localTime - oldMessage.localTime;
        if (delta <= 0) {
            return;
        } else if (delta < 3 * 60 * 1000) {
            const oldTime = new Date(oldMessage.localTime).getMinutes();
            const newTime = new Date(message.localTime).getMinutes();
            if (Math.floor(oldTime / 3) === Math.floor(newTime / 3)) {
                return;
            }
        }
    }
    const timeMessage = {
        conversationId: imId,
        messageId: null,
        innerId: guid(),
        status: Message.Status.Succeed,
        type: delegate.config.messageType.text,
        from: delegate.user.getMine().userId,
        to: imId,
        localTime: message.localTime - 1,
        timestamp: message.localTime - 1,
        data: {
            text: '',
            isSystem: true,
        },
    };
    const promise = Action.Send.get(
        timeMessage.type,
        {imId, chatType, message: timeMessage, ext: {}},
        {imId, chatType, message: timeMessage, ext: {}},
    );
    if (!promise) {
        throw new Error('暂不支持发送该消息类型');
    }
    const newOriginMessage = await promise;
    const newMessage = Action.Parse.get([], newOriginMessage, newOriginMessage);
    return newMessage;
}

export async function insertSystemMessage(
    imId: string,
    chatType: Conversation.ChatType,
    text: string,
    localTime: number,
    timestamp: number,
    innerId?: string,
): Promise<void> {
    const systemMessage = {
        conversationId: imId,
        messageId: null,
        innerId: innerId || guid(),
        status: Message.Status.Succeed,
        type: delegate.config.messageType.text,
        from: delegate.user.getMine().userId,
        to: imId,
        localTime: localTime,
        timestamp: timestamp,
        data: {
            text: text,
            isSystem: true,
        },
    };
    await sendMessage(imId, chatType, systemMessage, {}, true);
}