import * as Specials from 'specials';
import {ChatManager, IMConstant} from 'react-native-im-easemob';
import {Model, Typings} from '../../standard';
import RNFS from 'react-native-fs';

export default function () {
    type ActionItem = [
        number,
        (params: Typings.Action.Send.Params) => Typings.Action.Send.Result
        ];
    const sendActions: ActionItem[] = [
        [IMConstant.MessageType.text, sendText],
        [IMConstant.MessageType.image, sendImage],
        [IMConstant.MessageType.location, sendLocation],
        [IMConstant.MessageType.video, sendVideo],
        [IMConstant.MessageType.voice, sendVoice],
        [IMConstant.MessageType.file, sendFile],
    ];
    sendActions.forEach(([type, func]) => {
        Model.Action.Send.registerSpecial(
            type,
            (_?: Typings.Action.Send.State) => true,
            func,
            Specials.PRIORITY.LOW
        );
    });
}

function sendText(params: Typings.Action.Send.Params<Typings.Message.TextBody>) {
    const {imId, chatType, message, ext} = params;
    if (message.data.isSystem) {
        return ChatManager.insertSystemMessage(
            imId,
            chatType,
            message.data.text,
            message.timestamp,
            message.localTime,
            ext
        );
    } else {
        return ChatManager.sendText(
            imId,
            chatType,
            message.data.text,
            {
                quoteMsg:message.data.quoteMsg,
                atMemberList: message.data.atMemberList,
                ...ext,
            },
        );
    }
}

function sendImage(params: Typings.Action.Send.Params<Typings.Message.ImageBody>) {
    const {imId, chatType, message, ext} = params;
    const {data: {localPath, thumbnailLocalPath}} = message;
    const send = (path: any) => ChatManager.sendImage(imId, chatType, path, ext);
    return RNFS.exists(localPath).then((exist: boolean) => {
        return exist ? send(localPath) : send(thumbnailLocalPath)
    });
}

function sendVoice(params: Typings.Action.Send.Params<Typings.Message.VoiceBody>) {
    const {imId, chatType, message, ext} = params;
    return ChatManager.sendVoice(
        imId,
        chatType,
        message.data.localPath,
        message.data.duration,
        ext,
    );
}

function sendVideo(params: Typings.Action.Send.Params<Typings.Message.VideoBody>) {
    const {imId, chatType, message, ext} = params;
    return ChatManager.sendVideo(
        imId,
        chatType,
        message.data.localPath,
        message.data.remotePath,
        message.data.duration,
        ext,
    );
}

function sendFile(params: Typings.Action.Send.Params<Typings.Message.FileBody>) {
    const {imId, chatType, message, ext} = params;
    return ChatManager.sendFile(
        imId,
        chatType,
        message.data.localPath,
        ext,
    );
}

function sendLocation(params: Typings.Action.Send.Params<Typings.Message.LocationBody>) {
    const {imId, chatType, message, ext} = params;
    return ChatManager.sendLocation(
        imId,
        chatType,
        message.data.latitude,
        message.data.longitude,
        message.data.address,
        message.data.name,
        ext,
    );
}