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
        thumbnailPath: message.body.remotePath,
        previewPath: message.body.remotePath,
        remotePath: message.body.remotePath,
        size: {
            message.body.size.width,
            message.body.size.height,
        },
    };
    return newMessage;
}