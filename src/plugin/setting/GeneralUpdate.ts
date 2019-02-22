import { InteractionManager } from 'react-native';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { UiParams } from './typings';
import { Typings, Delegate, PageKeys } from '../../standard';

export async function onAddMembers(props: UiParams, memberUserIds: string[]): Promise<void> {
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
            const {imId, chatType} = await Delegate.model.Conversation.createOne(newMembers);
            navigation.navigate({
                routeName: PageKeys.ChatList,
                params: {},
            });
            InteractionManager.runAfterInteractions(() => {
                navigation.navigate({
                    routeName: PageKeys.ChatDetail,
                    params: {
                        imId: imId,
                        chatType: chatType,
                    },
                });
            });
        } catch (err) {
            Toast.show(i18n.t('IMToastError', {
                action: i18n.t('IMCreateGroup'),
            }));
        }
    }
}

export async function onRemoveMembers(props: UiParams, memberUserIds: string[]): Promise<void> {
    const {imId, onDataChange} = props;
    try {
        await Delegate.model.Group.removeMembers(imId, memberUserIds);
        onDataChange();
    } catch (err) {
        Toast.show(i18n.t('IMToastError', {
            action: i18n.t('IMSettingRemoveGroupMember'),
        }));
    }
}