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
    newMessage.status = message.status;
    newMessage.from = message.from;
    newMessage.to = message.to;
    newMessage.timestamp = message.timestamp;
    return newMessage;
}