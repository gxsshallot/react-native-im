import { IMConstant } from 'react-native-im-easemob';
import { Delegate } from '../../src';
import * as StandardMessage from '../message';

export default function () {
    const moreboardActions = [
        {action: 'photo', handle: StandardMessage.MoreBoard.takePhoto, type: IMConstant.MessageType.image, priority: undefined},
        {action: 'camera', handle: StandardMessage.MoreBoard.takeCamera, type: IMConstant.MessageType.image, priority: undefined},
        {action: 'video', handle: StandardMessage.MoreBoard.takeVideo, type: IMConstant.MessageType.video, priority: undefined},
        {action: 'location', handle: StandardMessage.MoreBoard.chooseLocation, type: IMConstant.MessageType.location, priority: undefined},
    ];
    moreboardActions.forEach(({action, handle, type, priority}) => {
        Delegate.model.Action.MoreBoard.register(
            action,
            undefined,
            {...handle, messageType: type},
            priority
        );
    });
    // 默认值设置
    Delegate.component.MoreBoard.defaultProps.getItems = () =>
        ['photo', 'camera', 'video', 'location'];
}