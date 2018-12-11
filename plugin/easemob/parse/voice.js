import { MessageType } from '../constant';
import { convertBasicMessage } from '../util';

export function isVoice(message) {
    return message.body.type === MessageType.Voice;
}

export function convertVoice(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Voice;
    newMessage.data = {
        localPath: message.body.localPath,
        remotePath: message.body.remotePath,
        duration: message.body.duration,
    };
    return newMessage;
}