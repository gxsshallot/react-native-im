import { StackActions } from 'react-navigation';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { Typings, Delegate } from '../../standard';
import getGeneralButton from './GeneralButton';
import { UiParams, UiResult } from './typings';

export const name = 'IMSettingLeaveGroup';

export function getUi(props: UiParams): UiResult {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    const text = isOwner ? i18n.t('IMSettingLeaveGroupDestroy') : i18n.t('IMSettingLeaveGroupQuit');
    return getGeneralButton(key, text, () => _clickLeave(props, text, isOwner));
}

async function _clickLeave(props: UiParams, text: string, isOwner: boolean): Promise<void> {
    const {imId, navigation} = props;
    try {
        if (isOwner) {
            await Delegate.model.Group.destroyOne(imId);
        } else {
            await Delegate.model.Group.quitOne(imId);
        }
        Toast.show(i18n.t('IMToastSuccess', {action: text}));
        const action = StackActions.pop({n: 2});
        navigation.dispatch(action);
    } catch (err) {
        Toast.show(i18n.t('IMToastError', {action: text}));
    }
}