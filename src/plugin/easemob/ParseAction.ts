import { IMConstant } from 'react-native-im-easemob';
import { Delegate, Typings } from '../../standard';
import { convertBasicMessage } from './util';

export default function () {
    const parseActions = [
        {special: isText, handle: convertText, priority: undefined},
        {special: isImage, handle: convertImage, priority: undefined},
        {special: isLocation, handle: convertLocation, priority: undefined},
        {special: isVideo, handle: convertVideo, priority: undefined},
        {special: isVoice, handle: convertVoice, priority: undefined},
    ];
    parseActions.forEach(({special, handle, priority}) => {
        Delegate.model.Action.Parse.register(
            undefined,
            special,
            handle,
            priority
        );
    });
}

const isText = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.text);
const isImage = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.image);
const isLocation = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.location);
const isVideo = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.video);
const isVoice = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.voice);

function isFunc(message: Typings.Message.Origin, messageType: number): boolean {
    return message.body.type === messageType;
}

function convertText(message: Typings.Message.Origin) {
    return convertBasicMessage<Typings.Message.TextBody>(
        message,
        IMConstant.MessageType.text,
        {
            text: message.body.text,
            atMemberList: message.ext ? message.ext.atMemberList : undefined,
            isSystem: message.ext ? message.ext.isSystemMessage : false,
        }
    );
}

function convertImage(message: Typings.Message.Origin) {
    return convertBasicMessage<Typings.Message.ImageBody>(
        message,
        IMConstant.MessageType.image,
        {
            localPath: undefined,
            remotePath: message.body.remotePath,
            thumbnailLocalPath: undefined,
            thumbnailRemotePath: undefined,
            size: {
                width: message.body.size && message.body.size.width,
                height: message.body.size && message.body.size.height,
            },
        }
    );
}

function convertLocation(message: Typings.Message.Origin) {
    return convertBasicMessage<Typings.Message.LocationBody>(
        message,
        IMConstant.MessageType.location,
        {
            latitude: message.body.latitude,
            longitude: message.body.longitude,
            address: message.body.address,
            name: message.ext ? message.ext.name : '',
        }
    );
}

function convertVideo(message: Typings.Message.Origin) {
    return convertBasicMessage<Typings.Message.VideoBody>(
        message,
        IMConstant.MessageType.video,
        {
            localPath: message.body.localPath,
            remotePath: message.body.remotePath,
            duration: 0, // TODO duration
        }
    );
}

function convertVoice(message: Typings.Message.Origin) {
    return convertBasicMessage<Typings.Message.VoiceBody>(
        message,
        IMConstant.MessageType.voice,
        {
            localPath: message.body.localPath,
            remotePath: message.body.remotePath,
            duration: message.body.duration,
        }
    );
}