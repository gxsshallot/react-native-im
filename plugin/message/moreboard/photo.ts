import * as ImagePicker from 'react-native-full-image-picker';
import { Typings } from '../../../src';

export type ImageResult = Typings.Action.MoreBoardHandleGeneralResult<Typings.Message.ImageBody>;

export type ImageParams = Typings.Action.MoreBoardHandlePressParams<Typings.Message.ImageBody>;

export type VideoResult = Typings.Action.MoreBoardHandleGeneralResult<Typings.Message.VideoBody>;

export type VideoParams = Typings.Action.MoreBoardHandlePressParams<Typings.Message.VideoBody>;

export type callbackParams = Array<{uri: string}>;

export const takePhoto: ImageResult = {
    text: '照片',
    icon: require('./image/more_photo.png'),
    onPress: (params: ImageParams) => {
        ImagePicker.getAlbum({
            autoConvertPath: true,
            maxSize: 1,
            canEdit: true,
            callback: (items: callbackParams) => onPhotoViewFinish<Typings.Message.ImageBody>(false, params.onDataChange, items),
        });
    },
};

export const takeVideo: VideoResult = {
    text: '视频',
    icon: require('./image/more_video.png'),
    onPress: (params: VideoParams) => {
        ImagePicker.getVideo({
            canEdit: true,
            callback: (items: callbackParams) => onPhotoViewFinish<Typings.Message.VideoBody>(true, params.onDataChange, items),
        });
    },
};

export const takeCamera: ImageResult = {
    text: '拍摄',
    icon: require('./image/more_camera.png'),
    onPress: (params: ImageParams) => {
        ImagePicker.getCamera({
            maxSize: 1,
            canEdit: true,
            callback: (items: callbackParams) => onPhotoViewFinish<Typings.Message.ImageBody>(false, params.onDataChange, items),
        });
    },
};

function onPhotoViewFinish<T extends {localPath?: string}>(
    isVideo: boolean,
    onDataChange: (data: T) => void,
    items: callbackParams
) {
    if (items.length === 0) {
        return;
    }
    items.forEach(({uri}) => {
        onDataChange({localPath: uri} as T);
    });
}