import React from 'react';
import i18n from 'i18n-js';
import { Typings, Delegate, PageKeys } from '../../standard';
import { onAddMembers, onRemoveMembers } from './GeneralUpdate';

export const name = 'IMSettingAllMembers';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupMembers = Delegate.model.Group.getMembers(imId);
    return (
        <Delegate.component.SettingItem
            key={key}
            type={Typings.Component.SettingItemType.Text}
            title={i18n.t('IMSettingAllMembers', {length: groupMembers.length})}
            onPressLine={() => _clickAllMembers(props)}
        />
    );
}

function _clickAllMembers(props: Typings.Action.Setting.Params): void {
    const {imId, navigation} = props;
    const groupMembers = Delegate.model.Group.getMembers(imId);
    const groupOwner = Delegate.model.Group.getOwner(imId);
    navigation.navigate( PageKeys.GroupMembers, {
            groupId: imId,
            members: groupMembers,
            admins: [groupOwner],
            canAdd: true,
            canRemove: groupOwner === Delegate.user.getMine().userId,
            onAddMembers: (memberUserIds: string[]) => onAddMembers(props, memberUserIds),
            onRemoveMembers: (memberUserIds: string[]) => onRemoveMembers(props, memberUserIds),
        });
}