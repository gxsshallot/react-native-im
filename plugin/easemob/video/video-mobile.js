import { MessageType } from '../constant';
import { isMobile, convertBasicMessage } from '../util';

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