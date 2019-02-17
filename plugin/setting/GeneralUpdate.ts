import { InteractionManager } from 'react-native';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import * as IMStandard from '../../src';

export function onAddMembers(props, members) {
    const {imId, chatType, onDataChange, navigation} = props;
    const isGroup = chatType === IMStandard.Constant.ChatType.Group;
    if (isGroup) {
        return IMStandard.Delegate.model.Group.addMembers(imId, members)
            .then(() => {
                const newMembers = IMStandard.Delegate.model.Group.getMembers(imId);
                onDataChange && onDataChange();
                return newMembers;
            })
            .catch(() => {
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMSettingAddGroupMember'),
                }));
            });
    } else {
        const newMembers = [imId, ...members];
        return IMStandard.Delegate.model.Conversation.createOne(newMembers)
            .then(({imId, chatType}) => {
                navigation.navigate({
                    routeName: IMStandard.PageKeys.ChatList,
                    params: {},
                });
                InteractionManager.runAfterInteractions(() => {
                    navigation.navigate({
                        routeName: IMStandard.PageKeys.ChatDetail,
                        params: {
                            imId: imId,
                            chatType: chatType,
                        },
                    });
                });
            })
            .catch(() => {
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMCreateGroup'),
                }));
            });
    }
}

export function onRemoveMembers(props, members) {
    const {imId, onDataChange} = props;
    return IMStandard.Delegate.model.Group.removeMembers(imId, members)
        .then(() => {
            const newMembers = IMStandard.Delegate.model.Group.getMembers(imId);
            onDataChange && onDataChange();
            return newMembers;
        })
        .catch(() => {
            Toast.show(i18n.t('IMToastError', {
                action: i18n.t('IMSettingRemoveGroupMember'),
            }));
        });
}