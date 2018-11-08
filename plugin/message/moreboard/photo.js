import * as ImagePicker from 'react-native-full-image-picker';

export const takePhoto = {
    text: '照片',
    icon: require('./image/more_gallery.png'),
    onPress: (onDataChange) => {
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
    icon: require('./image/more_movie.png'),
    onPress: (onDataChange) => {
        ImagePicker.getVideo({
            canEdit: true,
            callback: onPhotoViewFinish.bind(this, true, onDataChange),
        });
    },
};

export const takeCamera {
    text: '拍摄',
    icon: require('./image/more_take_pic.png'),
    onPress: (onDataChange) => {
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