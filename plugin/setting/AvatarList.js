import React from 'react';
import * as IMStandard from '../../src';
import { onAddMembers, onRemoveMembers } from './GeneralUpdate';

export const name = 'IMSettingAvatarList';

export function getUi(props) {
    const {key, imId, chatType, navigation} = props;
    const isGroup = chatType === IMStandard.Constant.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupMembers = IMStandard.Delegate.model.Group.getMembers(imId);
    const groupAllowAdd = IMStandard.Delegate.model.Group.getAllowAdd(imId);
    const groupOwner = IMStandard.Delegate.model.Group.getOwner(imId);
    const isOwner = isGroup && groupOwner === IMStandard.Delegate.user.getMine().userId;
    return (
        <IMStandard.Delegate.component.AvatarList
            key={key}
            data={groupMembers}
            owner={groupOwner}
            onAddMembers={(members) => onAddMembers(props, members)}
            onRemoveMembers={(members) => onRemoveMembers(props, members)}
            canAdd={isOwner || groupAllowAdd}
            canRemove={isOwner}
            navigation={navigation}
        />
    );
}