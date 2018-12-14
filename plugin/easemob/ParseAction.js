import { IMConstant } from 'react-native-im-easemob';
import * as IMStandard from '../../src';
import { convertBasicMessage } from './util';

export default function () {
    const parseActions = [
        [isText, convertText],
        [isImage, convertImage],
        [isLocation, convertLocation],
        [isVideo, convertVideo],
        [isVoice, convertVoice],
    ];
    parseActions.forEach(([specialFunc, handleFunc, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.Parse,
            undefined,
            (message) => specialFunc(message),
            (message) => handleFunc(message),
            priority,
        );
    });
}

const isText = (message) => isFunc(message, IMConstant.MessageType.text);
const isImage = (message) => isFunc(message, IMConstant.MessageType.image);
const isLocation = (message) => isFunc(message, IMConstant.MessageType.location);
const isVideo = (message) => isFunc(message, IMConstant.MessageType.video);
const isVoice = (message) => isFunc(message, IMConstant.MessageType.voice);

function isFunc(message, messageType) {
    return message.body.type === messageType;
}

function convertText(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = IMConstant.MessageType.text;
    newMessage.data = {
        text: message.body.text,
        atMemberList: message.ext ? message.ext.atMemberList : undefined,
        isSystem: message.ext ? message.ext.isSystemMessage : false,
    };
    return newMessage;
}

function convertImage(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = IMConstant.MessageType.image;
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

function convertLocation(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = IMConstant.MessageType.location;
    newMessage.data = {
        latitude: message.body.latitude,
        longitude: message.body.longitude,
        address: message.body.address,
        name: message.ext ? message.ext.name : '',
    };
    return newMessage;
}

function convertVideo(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = IMConstant.MessageType.video;
    newMessage.data = {
        localPath: message.body.localPath,
        remotePath: message.body.remotePath,
    };
    return newMessage;
}

function convertVoice(message) {
    const newMessage = convertBasicMessage(message);
    newMessage.type = IMConstant.MessageType.voice;
    newMessage.data = {
        localPath: message.body.localPath,
        remotePath: message.body.remotePath,
        duration: message.body.duration,
    };
    return newMessage;
}