import Listener from 'react-native-general-listener';
import * as Constant from '../constant';
import delegate from '../delegate';

/**
 * 从外部接收到消息的处理方法。
 * @param {object} originMessage 原始消息体
 */
export function onMessageReceived(originMessage) {
    const message = delegate.model.Action.match(
        Constant.Action.Parse,
        undefined,
        originMessage,
        originMessage,
    );
    if (!message) {
        return Promise.reject('无法处理该消息');
    }
    const imId = message.conversationId;
    const isSingle = !!delegate.user.getUser(imId);
    const chatType = isSingle ? Constant.ChatType.Single : Constant.ChatType.Group;
    let promise;
    if (!delegate.model.Conversation.getOne(imId, false)) {
        promise = delegate.model.Conversation.loadItem(imId, chatType);
    } else {
        promise = Promise.resolve();
    }
    return promise
        .then(() => delegate.model.Conversation.updateMessage(imId, message))
        .then(() => {
            Listener.trigger(
                [Constant.BaseEvent, Constant.ReceiveMessageEvent, imId],
                message
            );
            return {chatType, ...message};
        });
}

export function onRecallMessage(imId, chatType, fromUserId, messageId, localTime, timestamp) {
    const user = getOperatorName(fromUserId);
    const text = user + '撤回了一条消息';
    const deletePromise = delegate.im.conversation.deleteMessage({imId, chatType, message: {messageId}});
    const systemPromise = delegate.model.Message.insertSystemMessage(imId, Constant.ChatType.Group, text, localTime, timestamp);
    return Promise.all([deletePromise, systemPromise]);
}

export function onGroupCreate(groupId, localTime, timestamp) {
    return groupUpdateOperation(groupId, undefined, localTime, timestamp);
}

export function onUserJoin(groupId, invitorId, userJoinedIds, localTime, timestamp) {
    const invitor = getOperatorName(invitorId);
    const users = userJoinedIds
        .map(userId => getOperatorName(userId))
        .join(',');
    const text = invitor + '邀请' + users + '加入了群聊';
    return Promise.all(groupUpdateOperation(groupId, text, localTime, timestamp));
}

export function onUserLeave(groupId, operatorId, userLeavedIds, localTime, timestamp) {
    const users = userLeavedIds
        .map(userId => getOperatorName(userId))
        .join(',');
    const isUserQuit = userLeavedIds.length === 1 && userLeavedIds[0] === operatorId;
    const text =  users + (isUserQuit ? '退出了群聊' : '被移出群聊');
    return Promise.all(groupUpdateOperation(groupId, text, localTime, timestamp));
}

export function onUpdateName(groupId, updatorId, newGroupName, localTime, timestamp) {
    const updator = getOperatorName(updatorId);
    const text = updator + '修改群名称为' + newGroupName;
    return Promise.all(groupUpdateOperation(groupId, text, localTime, timestamp));
}

export function onUpdateOwner(groupId, newOwnerId, localTime, timestamp) {
    const user = getOperatorName(newOwnerId);
    const text = '群主已经更换为' + user;
    return Promise.all(groupUpdateOperation(groupId, text, localTime, timestamp));
}

export function onGroupDelete(groupId, localTime, timestamp) {
    const text = '群主解散了群聊';
    const deletePromise = delegate.model.Conversation.deleteOne(groupId);
    return Promise.all([...groupUpdateOperation(groupId, text, localTime, timestamp), deletePromise]);
}

export function getOperatorName(userId) {
    const isMe = userId === delegate.user.getMine().userId;
    return isMe ? '你' : delegate.user.getUser(userId).name;
}

export function groupUpdateOperation(groupId, text, localTime, timestamp) {
    const promises = [];
    const loadPromise = delegate.model.Group.loadItem(groupId);
    promises.push(loadPromise);
    if (text && text.length > 0) {
        const systemPromise = delegate.model.Message.insertSystemMessage(groupId, Constant.ChatType.Group, text, localTime, timestamp);
        promises.push(systemPromise);
    }
    return promises;
}