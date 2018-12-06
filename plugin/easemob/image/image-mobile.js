import { MessageType } from '../constant';
import { isMobile, convertBasicMessage, generateBasicMessage } from '../util';

export function isMobileImage(message) {
    return isMobile(message) && message.body.type === MessageType.Image;
}

export function convertMobileImage(message) {
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

export function generateImage({imId, chatType, data}) {
    const message = generateBasicMessage(imId, chatType, data);
    message.body.type = MessageType.Image;
    message.body.localPath = data.localPath;
    return message;
}