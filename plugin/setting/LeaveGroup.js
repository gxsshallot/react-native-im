import * as IMStandard from '../../src';
import getGeneralButton from './GeneralButton';
import i18n from '../../language';

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
        promise = delegate.model.Group.destroyOne(imId);
    } else {
        promise = delegate.model.Group.quitOne(imId);
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