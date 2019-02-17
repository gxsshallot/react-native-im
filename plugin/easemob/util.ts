export function convertBasicMessage(message) {
    const newMessage = {};
    newMessage.conversationId = message.conversationId;
    newMessage.messageId = message.messageId;
    newMessage.innerId = message.ext ? message.ext.innerId : undefined;
    newMessage.status = message.status;
    newMessage.from = message.from;
    newMessage.to = message.to;
    newMessage.localTime = message.localTime;
    newMessage.timestamp = message.timestamp;
    return newMessage;
}