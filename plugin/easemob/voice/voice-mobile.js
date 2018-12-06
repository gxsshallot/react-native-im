import { MessageType } from '../constant';
import { isMobile, convertBasicMessage, generateBasicMessage } from '../util';

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

export function generateVoice({imId, chatType, data}) {
    const message = generateBasicMessage(imId, chatType, data);
    message.body.type = MessageType.Voice;
    message.body.localPath = data.localPath;
    message.body.duration = data.duration;
    return message;
}