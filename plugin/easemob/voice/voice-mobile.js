import { MessageType } from '../constant';
import { isMobile, convertBasicMessage } from '../util';

export function isMobileVoice(message) {
    return isMobile(message) && message.body.type === MessageType.Voice;
}

export function convertMobileVoice(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Voice;
    newMessage.data = {
        localPath: message.body.localPath,
        remotePath: message.body.remotePath,
        duration: message.body.duration,
    };
    return newMessage;
}