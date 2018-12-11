import * as IMStandard from '../../src';

const mobileType = 0;
const webType = 1;

export function isMobile(message) {
    return getMessageType(message) === mobileType;
}

export function isWeb(message) {
    return getMessageType(message) === webType;
}

function getMessageType(message) {
    const {ext} = message;
    if (ext && ext.weichat && ext.weichat.originType === 'webim') {
        return webType;
    } else {
        return mobileType;
    }
}

export function convertBasicMessage(message) {
    const newMessage = {};
    newMessage.conversationId = message.conversationId;
    newMessage.messageId = message.messageId;
    newMessage.innerId = message.ext ? message.ext.innerId : undefined;
    newMessage.status = message.status;
    newMessage.from = message.from;
    newMessage.to = message.to;
    newMessage.timestamp = message.timestamp;
    return newMessage;
}

export function generateBasicMessage(imId, chatType, data) {
    return {
        conversationId: imId,
        chatType: chatType,
        status: IMStandard.Constant.Status.Pending,
        from: IMStandard.Delegate.user.getMine().userId,
        to: imId,
        localTime: new Date().getTime(),
        timestamp: new Date().getTime(),
        body: {},
        ext: {
            atMemberList: data.atMemberList,
            innerId: IMStandard.Utils.guid(),
        },
    };
}