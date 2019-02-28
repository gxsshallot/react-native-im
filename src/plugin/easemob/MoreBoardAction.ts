import { IMConstant } from 'react-native-im-easemob';
import { Delegate, Model, Typings } from '../../standard';
import * as StandardMessage from '../message';

export default function () {
    type ActionItem = [string, Typings.Action.MoreBoard.GeneralResult, number];
    const moreboardActions: ActionItem[] = [
        ['photo', StandardMessage.MoreBoard.takePhoto, IMConstant.MessageType.image],
        ['camera', StandardMessage.MoreBoard.takeCamera, IMConstant.MessageType.image],
        ['video', StandardMessage.MoreBoard.takeVideo, IMConstant.MessageType.video],
        ['location', StandardMessage.MoreBoard.chooseLocation, IMConstant.MessageType.location],
    ];
    moreboardActions.forEach(([action, handle, messageType]) => {
        Model.Action.MoreBoard.registerDefault(action, {...handle, messageType});
    });
    // 默认值设置
    Delegate.component.MoreBoard.defaultProps.getItems = () =>
        ['photo', 'camera', 'video', 'location'];
}