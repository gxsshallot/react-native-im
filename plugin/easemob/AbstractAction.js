import { IMConstant } from 'react-native-im-easemob';
import * as IMStandard from '../../src';
import * as StandardMessage from '../message';

export default function () {
    const abstractActions = [
        [undefined, (_) => ''],
        [IMConstant.MessageType.text, StandardMessage.Abstract.TextAbstract],
        [IMConstant.MessageType.image, StandardMessage.Abstract.ImageAbstract],
        [IMConstant.MessageType.location, StandardMessage.Abstract.LocationAbstract],
        [IMConstant.MessageType.video, StandardMessage.Abstract.VideoAbstract],
        [IMConstant.MessageType.voice, StandardMessage.Abstract.VoiceAbstract],
        [IMConstant.MessageType.file, StandardMessage.Abstract.FileAbstract],
    ];
    abstractActions.forEach(([messageType, abstractFunc, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.Abstract,
            messageType,
            undefined,
            abstractFunc,
            priority,
        );
    });
}