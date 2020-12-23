import React from 'react';
import Toast from 'react-native-root-toast';
import ActionSheet from 'react-native-general-actionsheet';
import * as ImagePicker from '@hecom-rn/react-native-full-image-picker';
import i18n from 'i18n-js';
import { Typings, Delegate } from '../../standard';

export const name = 'IMSettingGroupAvatar';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupAvatar = Delegate.model.Group.getAvatar(imId);
    const avatar = !groupAvatar ? undefined : {
        uri: Delegate.func.fitUrlForAvatarSize(groupAvatar, 30),
    };
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    if (!isOwner) {
        return null;
    }
    return (
        <Delegate.component.SettingItem
            key={key}
            type={Typings.Component.SettingItemType.Image}
            title={i18n.t('IMSettingGroupAvatar')}
            data={avatar}
            onPressLine={isOwner ? () => _clickGroupAvatar(props) : undefined}
        />
    );
}

function _clickGroupAvatar(props: Typings.Action.Setting.Params) {
    const options = {
        maxSize: 1,
        canEdit: true,
        callback: (data: Array<{uri: string}>) => _onImagePickerFinish(props, data),
    };
    const actions = [
        i18n.t('IMCommonTakeCamera'),
        i18n.t('IMCommonSelectFromPhotoLibrary'),
        i18n.t('IMCommonCancel')
    ];
    ActionSheet.showActionSheetWithOptions({
        options: actions,
        cancelButtonIndex: actions.length - 1,
    }, (clickIndex) => {
        if (clickIndex >= actions.length - 1) {
            return;
        }
        if (clickIndex === 0) {
            ImagePicker.getCamera(options);
        } else if (clickIndex === 1) {
            ImagePicker.getAlbum(options);
        }
    });
}

function _onImagePickerFinish(props: UiParams, data: Array<{uri: string}>) {
    if (!data || data.length === 0) {
        return;
    }
    const {imId, onDataChange} = props;
    Delegate.func.uploadImages(data.map(i => i.uri))
        .then(([url]) => Delegate.model.Group.changeAvatar(imId, url))
        .then(() => {
            onDataChange();
        })
        .catch(() => {
            Toast.show(i18n.t('IMToastError', {
                action: i18n.t('IMSettingGroupAvatarChange'),
            }));
        });
}