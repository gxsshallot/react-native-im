import { IMConstant, ChatManager } from 'react-native-im-easemob';
import * as IMStandard from '../../src';

export default function () {
    const sendActions = [
        [IMConstant.MessageType.text, sendText],
        [IMConstant.MessageType.image, sendImage],
        [IMConstant.MessageType.location, sendLocation],
        [IMConstant.MessageType.video, sendVideo],
        [IMConstant.MessageType.voice, sendVoice],
        [IMConstant.MessageType.file, sendFile],
    ];
    sendActions.forEach(([messageType, sendFunc, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.Send,
            messageType,
            undefined,
            sendFunc,
            priority,
        );
    });
}

function sendText({imId, chatType, message, ext = {}}) {
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

function sendImage({imId, chatType, message, ext = {}}) {
    return ChatManager.sendImage(
        imId,
        chatType,
        message.data.localPath,
        ext,
    );
}

function sendVoice({imId, chatType, message, ext = {}}) {
    return ChatManager.sendVoice(
        imId,
        chatType,
        message.data.localPath,
        message.data.duration,
        ext,
    );
}

function sendVideo({imId, chatType, message, ext = {}}) {
    return ChatManager.sendVideo(
        imId,
        chatType,
        message.data.localPath,
        undefined,
        undefined,
        ext,
    );
}

function sendFile({imId, chatType, message, ext = {}}) {
    return ChatManager.sendFile(
        imId,
        chatType,
        message.data.localPath,
        ext,
    );
}

function sendLocation({imId, chatType, message, ext = {}}) {
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