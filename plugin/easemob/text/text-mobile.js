import { MessageType } from '../constant';
import { isMobile, convertBasicMessage } from '../util';

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