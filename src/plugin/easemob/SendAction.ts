import { IMConstant, ChatManager } from 'react-native-im-easemob';
import { Delegate, Typings } from '../../standard';

export default function () {
    const sendActions = [
        {type: IMConstant.MessageType.text, func: sendText, priority: undefined},
        {type: IMConstant.MessageType.image, func: sendImage, priority: undefined},
        {type: IMConstant.MessageType.location, func: sendLocation, priority: undefined},
        {type: IMConstant.MessageType.video, func: sendVideo, priority: undefined},
        {type: IMConstant.MessageType.voice, func: sendVoice, priority: undefined},
        {type: IMConstant.MessageType.file, func: sendFile, priority: undefined},
    ];
    sendActions.forEach(({type, func, priority}) => {
        Delegate.model.Action.Send.register(
            type,
            undefined,
            func,
            priority
        );
    });
}

function sendText(params: Typings.Action.SendHandleParams) {
    const {imId, chatType, message, ext} = params;
    if (message.data.isSystem) {
        return ChatManager.insertSystemMessage(
            imId,
            chatType,
            message.data.text,
            message.timestamp,
            message.localTime
        );
    } else {
        return ChatManager.sendText(
            imId,
            chatType,
            message.data.text,
            {
                atMemberList: message.data.atMemberList,
                ...ext,
            },
        );
    }
}

function sendImage(params: Typings.Action.SendHandleParams) {
    const {imId, chatType, message, ext} = params;
    return ChatManager.sendImage(
        imId,
        chatType,
        message.data.localPath,
        ext,
    );
}

function sendVoice(params: Typings.Action.SendHandleParams) {
    const {imId, chatType, message, ext} = params;
    return ChatManager.sendVoice(
        imId,
        chatType,
        message.data.localPath,
        message.data.duration,
        ext,
    );
}

function sendVideo(params: Typings.Action.SendHandleParams) {
    const {imId, chatType, message, ext} = params;
    return ChatManager.sendVideo(
        imId,
        chatType,
        message.data.localPath,
        undefined,
        undefined,
        ext,
    );
}

function sendFile(params: Typings.Action.SendHandleParams) {
    const {imId, chatType, message, ext} = params;
    return ChatManager.sendFile(
        imId,
        chatType,
        message.data.localPath,
        ext,
    );
}

function sendLocation(params: Typings.Action.SendHandleParams) {
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