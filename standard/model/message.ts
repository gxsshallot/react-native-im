import Listener from '@hecom/listener';
import * as Action from './action';
import { Message, Conversation, Event } from '../typings';
import { guid } from '../util';
import delegate from '../delegate';

export const name = 'im-message';

export async function sendMultiMessage(
    imId: string,
    chatType:Conversation.ChatType,
    messages: Array<Message.General> = []
):Promise<void> {
    messages.forEach((message)=>{
        sendMessage(imId, chatType, message, {}, false);
    })
}

export async function sendMessage(
    imId: string,
    chatType: Conversation.ChatType,
    message: Message.General,
    ext: object = {},
    isSystem: boolean = false,
): Promise<void> {
    ext = {...ext, innerId: message.innerId};
    const sendEventName = [Event.Base, Event.SendMessage, imId];
    if (!delegate.model.Conversation.getOne(imId, false)) {
        await delegate.model.Conversation.loadItem(imId, chatType);
    }
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
    const newMessage = newOriginMessage ? Action.Parse.get([], newOriginMessage, newOriginMessage) : message;
    Listener.trigger(sendEventName, newMessage);
    await delegate.model.Conversation.updateMessage(imId, newMessage);
}

export async function insertSystemMessage(
    imId: string,
    chatType: Conversation.ChatType,
    text: string,
    localTime: number,
    timestamp: number,
    innerId?: string,
): Promise<void> {
    const systemMessage: Message.General = {
        conversationId: imId,
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
