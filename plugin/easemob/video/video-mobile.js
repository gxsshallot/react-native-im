import { MessageType } from '../constant';
import { isMobile, convertBasicMessage, generateBasicMessage } from '../util';

export function isMobileVideo(message) {
    return isMobile(message) && message.body.type === MessageType.Video;
}

export function convertMobileVideo(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Video;
    newMessage.data = {
        localPath: message.body.localPath,
        remotePath: message.body.remotePath,
    };
    return newMessage;
}

export function generateVideo({imId, chatType, data}) {
    const message = generateBasicMessage(imId, chatType, data);
    message.body.type = MessageType.Video;
    message.body.localPath = data.localPath;
    return message;
}