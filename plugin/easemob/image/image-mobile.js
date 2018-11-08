import { MessageType } from '../constant';
import { isMobile, convertBasicMessage } from '../util';

export function isMobileImage(message) {
    return isMobile(message) && message.body.type === MessageType.Image;
}

export function convertMobileImage(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Image;
    newMessage.data = {
        localPath: message.body.localPath,
        remotePath: message.body.remotePath,
        thumbnailLocalPath: null,
        thumbnailRemotePath: null,
        size: {
            width: message.body.size.width,
            height: message.body.size.height,
        },
    };
    return newMessage;
}