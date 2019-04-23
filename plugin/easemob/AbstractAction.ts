import { IMConstant } from 'react-native-im-easemob';
import { Model } from '../../standard';
import * as StandardMessage from '../message';

export default function () {
    const abstractActions = [
        [[], () => ''],
        [IMConstant.MessageType.text, StandardMessage.Abstract.TextAbstract],
        [IMConstant.MessageType.image, StandardMessage.Abstract.ImageAbstract],
        [IMConstant.MessageType.location, StandardMessage.Abstract.LocationAbstract],
        [IMConstant.MessageType.video, StandardMessage.Abstract.VideoAbstract],
        [IMConstant.MessageType.voice, StandardMessage.Abstract.VoiceAbstract],
        [IMConstant.MessageType.file, StandardMessage.Abstract.FileAbstract],
    ];
    abstractActions.forEach(function ([messageType, abstractFunc]) {
        Model.Action.Abstract.registerDefault(messageType, abstractFunc);
    });
}