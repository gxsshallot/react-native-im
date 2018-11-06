import { MessageType } from '../constant';
import { isWeb, convertBasicMessage } from '../util';

export function isWebText(message) {
    const ext = message.ext;
    return isWeb(message) && !ext.extend_message_body && !ext.emoji && message.body.type === MessageType.Text;
}

export function convertWebText(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Text;
    newMessage.data = {
        text: message.body.text,
    };
    return newMessage;
}