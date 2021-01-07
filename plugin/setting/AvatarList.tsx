import React from 'react';
import {Delegate, Typings} from '../../standard';
import {onAddMembers, onRemoveMembers} from './GeneralUpdate';

export const name = 'IMSettingAvatarList';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType, navigation} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    const members = isGroup ? Delegate.model.Group.getMembers(imId) : [imId];
    const owner = isGroup ? Delegate.model.Group.getOwner(imId) : undefined;
    const allowAdd = isGroup ? Delegate.model.Group.getAllowInvites(imId) : true;
    const isOwner = isGroup ? owner === Delegate.user.getMine().userId : true;
    return (
        <Delegate.component.AvatarList
            key={key}
            data={members}
            owner={owner}
            onAddMembers={(memberUserIds: string[]) => onAddMembers(props, memberUserIds)}
            onRemoveMembers={(memberUserIds: string[]) => onRemoveMembers(props, memberUserIds)}
            canAdd={isOwner || allowAdd}
            canRemove={isOwner}
            navigation={navigation}
            tempProps={props}
        />
    );
}