import { IMConstant } from 'react-native-im-easemob';
import { Model, Typings } from '../../standard';
import { convertBasicMessage } from './util';

export default function () {
    type ActionItem = [
        (message: Typings.Message.Origin) => boolean,
        (message: Typings.Message.Origin) => Typings.Message.General
    ];
    const parseActions: ActionItem[] = [
        [isText, convertText],
        [isImage, convertImage],
        [isLocation, convertLocation],
        [isVideo, convertVideo],
        [isVoice, convertVoice],
    ];
    parseActions.forEach(([special, handle]) => {
        Model.Action.Parse.registerSpecial([], special, handle);
    });
}

const isText = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.text);
const isImage = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.image);
const isLocation = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.location);
const isVideo = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.video);
const isVoice = (message: Typings.Message.Origin) => isFunc(message, IMConstant.MessageType.voice);

function isFunc(message: Typings.Message.Origin, messageType: number): boolean {
    return message && message.body && message.body.type === messageType;
}

function convertText(message: Typings.Message.Origin) {
    return convertBasicMessage<Typings.Message.TextBody>(
        message,
        IMConstant.MessageType.text,
        {
            text: message.body.text,
            atMemberList: message.ext ? message.ext.atMemberList : [],
            isSystem: message.ext ? message.ext.isSystemMessage : false,
            quoteMsg: message.ext ? message.ext.quoteMsg : undefined,
        }
    );
}

function convertImage(message: Typings.Message.Origin) {
    return convertBasicMessage<Typings.Message.ImageBody>(
        message,
        IMConstant.MessageType.image,
        {
            localPath: message.body.localPath,
            remotePath: message.body.remotePath,
            thumbnailLocalPath: message.body.thumbnailLocalPath,
            thumbnailRemotePath: message.body.thumbnailRemotePath,
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
            shouldRead: message.ext.shouldRead,
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