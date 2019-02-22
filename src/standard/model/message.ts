import Listener from 'react-native-general-listener';
import * as Constant from '../constant';
import { guid } from '../util';
import delegate from '../delegate';

/**
 * 发送消息。
 * @param {string} imId 会话ID
 * @param {number} chatType 会话类型
 * @param {object} message 消息体
 * @param {object} ext 扩展信息
 * @param {boolean} isSystem 是否是系统消息
 */
export function sendMessage(imId, chatType, message, ext = {}, isSystem = false) {
    ext = {...ext, innerId: message.innerId};
    const sendEventName = [Constant.BaseEvent, Constant.SendMessageEvent, imId];
    let promise;
    if (delegate.model.Conversation.getOne(imId, false)) {
        promise = Promise.resolve();
    } else {
        promise = delegate.model.Conversation.loadItem(imId, chatType);
    }
    return promise
        .then(() => insertTimeMessage(imId, chatType, message))
        .then((timeMessage) => {
            timeMessage && Listener.trigger(sendEventName, timeMessage);
            return delegate.model.Conversation.updateMessage(imId, message);
        })
        .then(() => {
            // 事件发送之前，先触发通知，加入详情列表中，发送后再更新状态
            !isSystem && Listener.trigger(sendEventName, message);
            const promise = delegate.model.Action.Send.match(
                message.type,
                {imId, chatType, message, ext},
                {imId, chatType, message, ext}
            );
            return promise || Promise.reject('暂不支持发送该消息类型');
        })
        .then((newOriginMessage) => {
            const newMessage = delegate.model.Action.Parse.match(
                undefined,
                newOriginMessage,
                newOriginMessage
            );
            Listener.trigger(sendEventName, newMessage);
            return delegate.model.Conversation.updateMessage(imId, newMessage);
        });
}

/**
 * 插入时间标签或不插入(会话一定存在)。
 * @param {string} imId 会话ID
 * @param {number} chatType 会话类型
 * @param {object} message 待判断的消息体
 */
export function insertTimeMessage(imId, chatType, message) {
    const conversation = delegate.model.Conversation.getOne(imId, false);
    let insertTime = true;
    if (conversation.latestMessage) {
        const oldMessage = conversation.latestMessage;
        const delta = message.localTime - oldMessage.localTime;
        if (delta <= 0) {
            insertTime = false;
        } else if (delta < 3 * 60 * 1000) {
            const oldTime = new Date(oldMessage.localTime).getMinutes();
            const newTime = new Date(message.localTime).getMinutes();
            if (Math.floor(oldTime / 3) === Math.floor(newTime / 3)) {
                insertTime = false;
            }
        }
    }
    if (!insertTime) {
        return Promise.resolve();
    }
    const timeMessage = {
        conversationId: imId,
        messageId: undefined,
        innerId: guid(),
        status: Constant.Status.Succeed,
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
    const promise = delegate.model.Action.Send.match(
        timeMessage.type,
        {imId, chatType, message: timeMessage, ext: {}},
        {imId, chatType, message: timeMessage, ext: {}},
    );
    return promise
        .then((newOriginMessage) => {
            const newMessage = delegate.model.Action.Parse.match(
                undefined,
                newOriginMessage,
                newOriginMessage
            );
            return newMessage;
        });
}

/**
 * 插入系统消息。
 * @param {string} imId 会话ID
 * @param {number} chatType 会话类型
 * @param {string} text 文本内容
 * @param {number} localTime 本地时间戳
 * @param {number} timestamp 服务器时间戳
 */
export function insertSystemMessage(imId, chatType, text, localTime, timestamp) {
    const systemMessage = {
        conversationId: imId,
        messageId: undefined,
        innerId: guid(),
        status: Constant.Status.Succeed,
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
    return sendMessage(imId, chatType, systemMessage, {}, true);
}