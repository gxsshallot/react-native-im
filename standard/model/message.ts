import Listener from '@hecom/listener';
import * as Action from './action';
import { Message, Conversation, Event } from '../typings';
import { guid } from '../util';
import delegate from '../delegate';

export const name = 'im-message';
const interval = 3 * 60 * 1000;

export async function sendMultiMessage(
    imId: string,
    chatType:Conversation.ChatType,
    messages: Array<Message.General> = []
):Promise<void> {
    messages.forEach((message, index)=>{
        sendMessage(imId, chatType, message, {}, false, index === 0);
    })
}

export async function sendMessage(
    imId: string,
    chatType: Conversation.ChatType,
    message: Message.General,
    ext: object = {},
    isSystem: boolean = false,
    autoTimestamp: boolean = true,
): Promise<void> {
    ext = {...ext, innerId: message.innerId};
    const sendEventName = [Event.Base, Event.SendMessage, imId];
    if (!delegate.model.Conversation.getOne(imId, false)) {
        await delegate.model.Conversation.loadItem(imId, chatType);
    }
    if (!isSystem && autoTimestamp){
        const timeMessage = await insertTimeMessage(imId, chatType, message);
        timeMessage && Listener.trigger(sendEventName, timeMessage);
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

export async function insertTimeMessage(
    imId: string,
    chatType: Conversation.ChatType,
    message: Message.General,
): Promise<Message.General | void> {
    await insertTimeMessageLokc()
    insertTimeMessageLokcFlag = true;
    return insertTimeMessageAsync(imId, chatType, message)
    .finally(()=> {
        insertTimeMessageLokcFlag = false;
    })
}

async function insertTimeMessageAsync(
    imId: string,
    chatType: Conversation.ChatType,
    message: Message.General,
): Promise<Message.General | void> {
    const [forwardMessage] = await delegate.im.conversation.loadMessage({ imId, chatType, lastMessage: message, count: 1 });
    if (forwardMessage &&
         message.timestamp - forwardMessage.timestamp < interval &&
          Math.floor(new Date(forwardMessage.timestamp).getMinutes() / 3) === Math.floor(new Date(message.timestamp).getMinutes() / 3)) {
        return;
    }
    const promise = _insertTimeMessage(imId, chatType, message);
    if (!promise) {
        throw new Error('暂不支持发送该消息类型');
    }
    const newOriginMessage = await promise;
    return Action.Parse.get([], newOriginMessage, newOriginMessage);
}

let insertTimeMessageLokcFlag = false;
async function insertTimeMessageLokc(): Promise<void> {
    return new Promise((resolve) => {
        const time = (func: { (value?: void | PromiseLike<void> | undefined): void; (): void; }) => {
            if (insertTimeMessageLokcFlag) {
                setTimeout(() => {
                    time(func)
                }, 0);
            } else {
                func()
            }
        }
        time(resolve)
    })
}

export async function insertTimeInMessage(
    imId: string,
    chatType: Conversation.ChatType,
    message1: Message.General,
    message2: Message.General,
): Promise<Message.General | void> {
    if (!(message1 && message2)) {
        return;
    }

    const delta = message1.timestamp - message2.timestamp;
    let addTimeMessage;
    if (delta < 0) {
        addTimeMessage = message2;
    } else {
        addTimeMessage = message1;
    }
     if (-interval < delta && delta < interval) {
        const oldTime = new Date(message2.timestamp).getMinutes();
        const newTime = new Date(message1.timestamp).getMinutes();
        if (Math.floor(oldTime / 3) === Math.floor(newTime / 3)) {
            return;
        }
    }

    const promise = _insertTimeMessage(imId, chatType, message1);
    if (!promise) {
        throw new Error('暂不支持发送该消息类型');
    }
    const newOriginMessage = await promise;
    return Action.Parse.get([], newOriginMessage, newOriginMessage);
}

async function _insertTimeMessage(
    imId: string,
    chatType: Conversation.ChatType,
    message: Message.General){
    const timeMessage = {
        conversationId: imId,
        messageId: null,
        innerId: guid(),
        status: Message.Status.Succeed,
        type: delegate.config.messageType.text,
        from: delegate.user.getMine().userId,
        to: imId,
        localTime: Date.now() - 1,
        timestamp: message.timestamp - 1,
        data: {
            text: '',
            isSystem: true,
        },
    };
    return Action.Send.get(
        timeMessage.type,
        {imId, chatType, message: timeMessage, ext: {}},
        {imId, chatType, message: timeMessage, ext: {}},
    );
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
