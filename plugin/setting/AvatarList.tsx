import * as React from 'react';
import { Typings, Delegate } from '../../src';
import { UiParams, UiResult } from './typings';
import { onAddMembers, onRemoveMembers } from './GeneralUpdate';

export const name = 'IMSettingAvatarList';

export function getUi(props: UiParams): UiResult {
    const {key, imId, chatType, navigation} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupMembers = Delegate.model.Group.getMembers(imId);
    const groupAllowAdd = Delegate.model.Group.getAllowInvites(imId);
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    return (
        <Delegate.component.AvatarList
            key={key}
            data={groupMembers}
            owner={groupOwner}
            onAddMembers={(memberUserIds: string[]) => onAddMembers(props, memberUserIds)}
            onRemoveMembers={(memberUserIds: string[]) => onRemoveMembers(props, memberUserIds)}
            canAdd={isOwner || groupAllowAdd}
            canRemove={isOwner}
            navigation={navigation}
        />
    );
}