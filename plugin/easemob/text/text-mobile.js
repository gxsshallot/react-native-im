import { MessageType } from '../constant';
import { isMobile, convertBasicMessage, generateBasicMessage } from '../util';

export function isMobileText(message) {
    return isMobile(message) && message.body.type === MessageType.Text;
}

export function convertMobileText(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Text;
    newMessage.data = {
        text: message.body.text,
    };
    return newMessage;
}

export function generateText({imId, chatType, data}) {
    const message = generateBasicMessage(imId, chatType, data);
    message.body.type = MessageType.Text;
    message.body.text = data.text;
    return message;
}