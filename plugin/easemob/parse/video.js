import { MessageType } from '../constant';
import { convertBasicMessage } from '../util';

export function isVideo(message) {
    return message.body.type === MessageType.Video;
}

export function convertVideo(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Video;
    newMessage.data = {
        localPath: message.body.localPath,
        remotePath: message.body.remotePath,
    };
    return newMessage;
}