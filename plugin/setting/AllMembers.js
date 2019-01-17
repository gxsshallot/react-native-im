import React from 'react';
import * as IMStandard from '../../src';
import { onAddMembers, onRemoveMembers } from './GeneralUpdate';
import i18n from '../../language';

export const name = 'IMSettingAllMembers';

export function getUi(props) {
    const {key, imId, chatType} = props;
    const isGroup = chatType === IMStandard.Constant.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupMembers = IMStandard.Delegate.model.Group.getMembers(imId);
    return (
        <IMStandard.Delegate.component.SettingItem
            key={key}
            type={IMStandard.Constant.SettingItemType.Text}
            title={i18n.t('IMSettingAllMembers', {length: groupMembers.length})}
            onPressLine={_clickAllMembers.bind(this, props)}
        />
    );
}

function _clickAllMembers(props) {
    const {imId, navigation} = props;
    const groupMembers = IMStandard.Delegate.model.Group.getMembers(imId);
    const groupOwner = IMStandard.Delegate.model.Group.getOwner(imId);
    navigation.navigate({
        routeName: IMStandard.PageKeys.GroupMembers,
        params: {
            groupId: imId,
            members: groupMembers,
            admins: [groupOwner],
            canAdd: true,
            canRemove: groupOwner === IMStandard.Delegate.user.getMine().userId,
            onAddMembers: (members) => onAddMembers(props, members),
            onRemoveMembers: (members) => onRemoveMembers(props, members),
        },
    });
}