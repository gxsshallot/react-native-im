import { Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import * as IMStandard from '../../src';
import getGeneralButton from './GeneralButton';
import i18n from '../../language';

export const name = 'IMSettingTransferOwner';

export function getUi(props) {
    const {key, imId, chatType} = props;
    const isGroup = chatType === IMStandard.Constant.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupOwner = IMStandard.Delegate.model.Group.getOwner(imId);
    const isOwner = isGroup && groupOwner === IMStandard.Delegate.user.getMine().userId;
    if (!isOwner) {
        return null;
    }
    return getGeneralButton(key, i18n.t('IMSettingTransferOwner'), function () {
        _clickTransferOwner(props);
    });
}

function _clickTransferOwner(props) {
    const {imId, navigation} = props;
    const groupMembers = IMStandard.Delegate.model.Group.getMembers(imId);
    const dataSource = groupMembers
        .filter(userId => userId !== IMStandard.Delegate.user.getMine().userId)
        .map(userId => IMStandard.Delegate.user.getUser(userId));
    navigation.navigate({
        routeName: IMStandard.PageKeys.ChooseUser,
        params: {
            title: i18n.t('IMSettingChooseGroupMember'),
            multiple: false,
            dataSource: dataSource,
            onSelectData: function (data) {
                _onTransferOwnerAlert(props, data);
            },
            selectedIds: [],
        },
    });
}

function _onTransferOwnerAlert(props, data) {
    const newOwner = IMStandard.Delegate.user.getUser(data[0]);
    Alert.alert('转交群主给:', newOwner.name, [
        {text: i18n.t('IMCommonCancel')},
        {text: i18n.t('IMCommonOK'), onPress: function () {
            _onTransferOwner(props, newOwner);
        }}
    ], {cancelable: true});
}

function _onTransferOwner(props, newOwner) {
    const {imId, onDataChange} = props;
    IMStandard.Delegate.model.Group.changeOwner(imId, newOwner.userId)
        .then(() => {
            Toast.show(i18n.t('IMToastSuccess', {
                action: i18n.t('IMSettingTransferOwnerAction')
            }));
            onDataChange && onDataChange();
        })
        .catch(() => {
            Toast.show(i18n.t('IMToastError', {
                action: i18n.t('IMSettingTransferOwnerAction')
            }));
        });
}