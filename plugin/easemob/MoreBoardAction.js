import { IMConstant } from 'react-native-im-easemob';
import * as IMStandard from '../../src';
import * as StandardMessage from '../message';

export default function () {
    const moreboardActions = [
        ['photo', StandardMessage.MoreBoard.takePhoto, IMConstant.MessageType.image],
        ['camera', StandardMessage.MoreBoard.takeCamera, IMConstant.MessageType.image],
        ['video', StandardMessage.MoreBoard.takeVideo, IMConstant.MessageType.video],
        ['location', StandardMessage.MoreBoard.chooseLocation, IMConstant.MessageType.location],
    ];
    moreboardActions.forEach(([action, handleFunc, messageType, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.MoreBoard,
            action,
            undefined,
            {...handleFunc, messageType},
            priority,
        );
    });
    // 默认值设置
    IMStandard.Delegate.component.MoreBoard.defaultProps.getItems = () =>
        ['photo', 'camera', 'video', 'location'];
}