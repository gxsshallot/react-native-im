import { IMConstant } from 'react-native-im-easemob';
import * as IMStandard from '../../src';
import * as StandardMessage from '../message';

export default function () {
    const displayActions = [
        [undefined, StandardMessage.Display.GeneralBubble],
        [IMConstant.MessageType.text, StandardMessage.Display.TextBubble],
        [IMConstant.MessageType.image, StandardMessage.Display.ImageBubble],
        [IMConstant.MessageType.location, StandardMessage.Display.LocationBubble],
        [IMConstant.MessageType.video, StandardMessage.Display.VideoBubble],
        [IMConstant.MessageType.voice, StandardMessage.Display.VoiceBubble],
    ];
    displayActions.forEach(([messageType, handleFunc, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.Display,
            messageType,
            undefined,
            handleFunc,
            priority,
        );
    });
}