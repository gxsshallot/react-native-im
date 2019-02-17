import { StackActions } from 'react-navigation';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import * as IMStandard from '../../src';
import getGeneralButton from './GeneralButton';

export const name = 'IMSettingLeaveGroup';

export function getUi(props) {
    const {key, imId, chatType} = props;
    const isGroup = chatType === IMStandard.Constant.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupOwner = IMStandard.Delegate.model.Group.getOwner(imId);
    const isOwner = isGroup && groupOwner === IMStandard.Delegate.user.getMine().userId;
    const text = isOwner ? i18n.t('IMSettingLeaveGroupDestroy') : i18n.t('IMSettingLeaveGroupQuit');
    return getGeneralButton(key, text, function () {
        _clickLeave(props, text, isOwner);
    });
}

function _clickLeave(props, text, isOwner) {
    const {imId, navigation} = props;
    let promise;
    if (isOwner) {
        promise = IMStandard.Delegate.model.Group.destroyOne(imId);
    } else {
        promise = IMStandard.Delegate.model.Group.quitOne(imId);
    }
    return promise
        .then(() => {
            Toast.show(i18n.t('IMToastSuccess', {action: text}));
            const action = StackActions.pop({n: 2});
            navigation.dispatch(action);
        })
        .catch(() => {
            Toast.show(i18n.t('IMToastError', {action: text}));
        });
}