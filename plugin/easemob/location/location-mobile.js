import { MessageType } from '../constant';
import { isMobile, convertBasicMessage } from '../util';

export function isMobileLocation(message) {
    return isMobile(message) && message.body.type === MessageType.Location;
}

export function convertMobileLocation(message) {
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