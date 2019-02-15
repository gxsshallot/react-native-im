import React from 'react';
import Toast from 'react-native-root-toast';
import ActionSheet from 'react-native-general-actionsheet';
import * as ImagePicker from 'react-native-full-image-picker';
import i18n from 'i18n-js';
import * as IMStandard from '../../src';

export const name = 'IMSettingGroupAvatar';

export function getUi(props) {
    const {key, imId, chatType} = props;
    const isGroup = chatType === IMStandard.Constant.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupAvatar = IMStandard.Delegate.model.Group.getAvatar(imId);
    const avatar = !groupAvatar ? undefined : {
        uri: IMStandard.Delegate.func.fitUrlForAvatarSize(groupAvatar, 30),
    };
    const groupOwner = IMStandard.Delegate.model.Group.getOwner(imId);
    const isOwner = isGroup && groupOwner === IMStandard.Delegate.user.getMine().userId;
    return (
        <IMStandard.Delegate.component.SettingItem
            key={key}
            type={IMStandard.Constant.SettingItemType.Image}
            title={i18n.t('IMSettingGroupAvatar')}
            data={avatar}
            onPressLine={isOwner ? _clickGroupAvatar.bind(this, props) : undefined}
        />
    );
}

function _clickGroupAvatar(props) {
    const options = {
        maxSize: 1,
        canEdit: true,
        callback: _onImagePickerFinish.bind(this, props),
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

function _onImagePickerFinish(props, data) {
    if (!data || data.length === 0) {
        return;
    }
    const {imId, onDataChange} = props;
    IMStandard.Delegate.func.uploadImages(data.map(i => i.uri))
        .then(([url]) => IMStandard.Delegate.model.Group.changeAvatar(imId, url))
        .then(() => {
            onDataChange && onDataChange();
        })
        .catch(() => {
            Toast.show(i18n.t('IMToastError', {
                action: i18n.t('IMSettingGroupAvatarChange'),
            }));
        });
}