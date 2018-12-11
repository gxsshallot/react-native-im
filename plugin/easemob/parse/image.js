import { MessageType } from '../constant';
import { isMobile, convertBasicMessage } from '../util';

export function isImage(message) {
    return message.body.type === MessageType.Image;
}

export function convertImage(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Image;
    newMessage.data = {
        localPath: null,
        remotePath: message.body.remotePath,
        thumbnailLocalPath: null,
        thumbnailRemotePath: null,
        size: {
            width: message.body.size && message.body.size.width,
            height: message.body.size && message.body.size.height,
        },
    };
    return newMessage;
}