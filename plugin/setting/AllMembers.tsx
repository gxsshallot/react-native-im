import React from 'react';
import i18n from 'i18n-js';
import { Typings, Delegate, PageKeys } from '../../standard';
import { onAddMembers, onRemoveMembers } from './GeneralUpdate';
import { Dimensions } from 'react-native';
import { getSafeAreaInset } from '@hecom/react-native-pure-navigation-bar';

export const name = 'IMSettingAllMembers';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupMembers = Delegate.model.Group.getMembers(imId);
    if (groupMembers.length <= showMaxColumn(props)) {
        return null;
    }
    return (
        <Delegate.component.SettingItem
            key={key}
            type={Typings.Component.SettingItemType.Text}
            title={i18n.t('IMSettingAllMembers', {length: groupMembers.length})}
            onPressLine={() => _clickAllMembers(props)}
        />
    );
}

function showMaxColumn(props: Typings.Action.Setting.Params): number {
    const {imId} = props;
    const {width, height} = Dimensions.get('window');
    const safeInset = getSafeAreaInset();
    const innerWidth = width - safeInset.left - safeInset.right;
    const groupOwner = Delegate.model.Group.getOwner(imId);
    let itemEdge = 50;
    let column = 0;
    if (width > height) {
        const preInternal = 30;
        column = Math.floor((innerWidth + preInternal) * 1.0 / (itemEdge + preInternal));
    } else {
        column = 5;
    }
    let canAdd = true;
    let canRemove = groupOwner === Delegate.user.getMine().userId;
    const maxRow = 6;
    const showCount = column * maxRow - (canAdd ? 1 : 0) - (canRemove ? 1 : 0);
    return showCount;
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