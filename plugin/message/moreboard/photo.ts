import * as ImagePicker from '@hecom-rn/react-native-full-image-picker';
import { Typings } from '../../../standard';

export type ImageResult = Typings.Action.MoreBoard.GeneralResult<Typings.Message.ImageBody>;

export type ImageParams = Typings.Action.MoreBoard.PressParams<Typings.Message.ImageBody>;

export type VideoResult = Typings.Action.MoreBoard.GeneralResult<Typings.Message.VideoBody>;

export type VideoParams = Typings.Action.MoreBoard.PressParams<Typings.Message.VideoBody>;

export type callbackParams = Array<{uri: string}>;

export const takePhoto: ImageResult = {
    text: '照片',
    icon: require('./image/more_photo.png'),
    onPress: (params: ImageParams) => {
        ImagePicker.getAlbum({
            autoConvertPath: true,
            maxSize: 9,
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