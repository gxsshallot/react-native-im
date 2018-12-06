import { MessageType } from '../constant';
import { isMobile, convertBasicMessage, generateBasicMessage } from '../util';

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

export function generateLocation({imId, chatType, data}) {
    const message = generateBasicMessage(imId, chatType, data);
    message.body.type = MessageType.Location;
    message.body.latitude = data.latitude;
    message.body.longitude = data.longitude;
    message.body.address = data.address;
    message.ext.name = data.name;
    return message;
}