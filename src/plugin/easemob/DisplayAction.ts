import { IMConstant } from 'react-native-im-easemob';
import { Model } from '../../standard';
import * as StandardMessage from '../message';

export default function () {
    const displayActions = [
        [[], StandardMessage.Display.GeneralBubble],
        [IMConstant.MessageType.text, StandardMessage.Display.TextBubble],
        [IMConstant.MessageType.image, StandardMessage.Display.ImageBubble],
        [IMConstant.MessageType.location, StandardMessage.Display.LocationBubble],
        [IMConstant.MessageType.video, StandardMessage.Display.VideoBubble],
        [IMConstant.MessageType.voice, StandardMessage.Display.VoiceBubble],
    ];
    displayActions.forEach(function ([messageType, handleFunc]) {
        Model.Action.Display.registerDefault(messageType, handleFunc);
    });
}