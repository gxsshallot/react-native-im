import { Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { Typings, Delegate, PageKeys } from '../../src';
import getGeneralButton from './GeneralButton';
import { UiParams, UiResult } from './typings';

export const name = 'IMSettingTransferOwner';

export function getUi(props: UiParams): UiResult {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    if (!isOwner) {
        return null;
    }
    return getGeneralButton(key, i18n.t('IMSettingTransferOwner'), () => _clickTransferOwner(props));
}

function _clickTransferOwner(props: UiParams) {
    const {imId, navigation} = props;
    const groupMembers = Delegate.model.Group.getMembers(imId);
    const myUserId = Delegate.user.getMine().userId;
    const dataSource = groupMembers
        .filter(userId => userId !== myUserId)
        .map(userId => Delegate.user.getUser(userId));
    navigation.navigate({
        routeName: PageKeys.ChooseUser,
        params: {
            title: i18n.t('IMSettingChooseGroupMember'),
            multiple: false,
            dataSource: dataSource,
            onSelectData: (data: string[]) => _onTransferOwnerAlert(props, data),
            selectedIds: [],
        },
    });
}

function _onTransferOwnerAlert(props: UiParams, data: string[]) {
    const newOwner = Delegate.user.getUser(data[0]);
    Alert.alert('转交群主给:', newOwner.name, [
        {text: i18n.t('IMCommonCancel')},
        {text: i18n.t('IMCommonOK'), onPress: () => _onTransferOwner(props, newOwner)},
    ], {cancelable: true});
}

async function _onTransferOwner(props: UiParams, newOwner: Typings.Contact.User): Promise<void> {
    const {imId, onDataChange} = props;
    try {
        await Delegate.model.Group.changeOwner(imId, newOwner.userId);
        Toast.show(i18n.t('IMToastSuccess', {
            action: i18n.t('IMSettingTransferOwnerAction')
        }));
        onDataChange();
    } catch (err) {
        Toast.show(i18n.t('IMToastError', {
            action: i18n.t('IMSettingTransferOwnerAction')
        }));
    }
}