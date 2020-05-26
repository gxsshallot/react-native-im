import {InteractionManager} from 'react-native';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import {Delegate, PageKeys, Typings} from '../../standard';

export async function onAddMembers(props: Typings.Action.Setting.Params,
                                   memberUserIds: string[]): Promise<void> {
    const {imId, chatType, onDataChange, navigation} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (isGroup) {
        try {
            await Delegate.model.Group.addMembers(imId, memberUserIds);
            onDataChange();
        } catch (err) {
            Toast.show(i18n.t('IMToastError', {
                action: i18n.t('IMSettingAddGroupMember'),
            }));
        }
    } else {
        const newMembers = [imId, ...memberUserIds];
        try {
            const result = await Delegate.model.Conversation.createOne(newMembers);
            navigation.navigate(PageKeys.ChatDetail, {
                    imId: result.imId,
                    chatType: result.chatType,
                });
        } catch (err) {
            Toast.show(i18n.t('IMToastError', {
                action: i18n.t('IMCreateGroup'),
            }));
        }
    }
    return Delegate.model.Group.getMembers(imId);
}

export async function onRemoveMembers(props: Typings.Action.Setting.Params,
                                      memberUserIds: string[]): Promise<void> {
    const {imId, onDataChange} = props;
    try {
        await Delegate.model.Group.removeMembers(imId, memberUserIds);
        onDataChange();
    } catch (err) {
        Toast.show(i18n.t('IMToastError', {
            action: i18n.t('IMSettingRemoveGroupMember'),
        }));
    }
    return Delegate.model.Group.getMembers(imId);
}