import { MessageType } from '../constant';
import { convertBasicMessage } from '../util';

export function isLocation(message) {
    return message.body.type === MessageType.Location;
}

export function convertLocation(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = MessageType.Location;
    newMessage.data = {
        latitude: message.body.latitude,
        longitude: message.body.longitude,
        address: message.body.address,
        name: message.ext ? message.ext.name : '',
    };
    return newMessage;
}