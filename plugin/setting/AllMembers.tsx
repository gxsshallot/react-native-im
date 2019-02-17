import * as React from 'react';
import i18n from 'i18n-js';
import { Typings, Delegate, Constant, PageKeys } from '../../src';
import { onAddMembers, onRemoveMembers } from './GeneralUpdate';
import { UiParams, UiResult } from './typings';

export const name = 'IMSettingAllMembers';

export function getUi(props: UiParams): UiResult {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.Types.Group;
    if (!isGroup) {
        return null;
    }
    const groupMembers = Delegate.model.Group.getMembers(imId);
    return (
        <Delegate.component.SettingItem
            key={key}
            type={Constant.SettingItemType.Text}
            title={i18n.t('IMSettingAllMembers', {length: groupMembers.length})}
            onPressLine={_clickAllMembers.bind(this, props)}
        />
    );
}

function _clickAllMembers(props: UiParams): void {
    const {imId, navigation} = props;
    const groupMembers = Delegate.model.Group.getMembers(imId);
    const groupOwner = Delegate.model.Group.getOwner(imId);
    navigation.navigate({
        routeName: PageKeys.GroupMembers,
        params: {
            groupId: imId,
            members: groupMembers,
            admins: [groupOwner],
            canAdd: true,
            canRemove: groupOwner === Delegate.user.getMine().userId,
            onAddMembers: (members) => onAddMembers(props, members),
            onRemoveMembers: (members) => onRemoveMembers(props, members),
        },
    });
}