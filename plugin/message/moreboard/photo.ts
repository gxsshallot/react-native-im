import * as ImagePicker from 'react-native-full-image-picker';

export const takePhoto = {
    text: '照片',
    icon: require('./image/more_photo.png'),
    onPress: ({onDataChange}) => {
        ImagePicker.getAlbum({
            autoConvertPath: true,
            maxSize: 1,
            canEdit: true,
            callback: onPhotoViewFinish.bind(this, false, onDataChange),
        });
    },
};

export const takeVideo = {
    text: '视频',
    icon: require('./image/more_video.png'),
    onPress: ({onDataChange}) => {
        ImagePicker.getVideo({
            canEdit: true,
            callback: onPhotoViewFinish.bind(this, true, onDataChange),
        });
    },
};

export const takeCamera = {
    text: '拍摄',
    icon: require('./image/more_camera.png'),
    onPress: ({onDataChange}) => {
        ImagePicker.getCamera({
            maxSize: 1,
            canEdit: true,
            callback: onPhotoViewFinish.bind(this, false, onDataChange),
        });
    },
};

function onPhotoViewFinish(isVideo, onDataChange, items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return;
    }
    items.forEach(({uri}) => {
        onDataChange && onDataChange({localPath: uri});
    });
}