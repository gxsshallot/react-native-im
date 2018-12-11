import { MessageType } from '../constant';
import { convertBasicMessage } from '../util';

export function isText(message) {
    return message.body.type === MessageType.Text;
}

export function convertText(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Text;
    newMessage.data = {
        text: message.body.text,
        atMemberList: message.ext ? message.ext.atMemberList : undefined,
    };
    return newMessage;
}