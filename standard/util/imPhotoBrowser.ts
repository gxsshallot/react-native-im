import { PhotoBrowserPage } from 'react-native-photo-browse';

function initIMPhotoBrowser(defaultProps: PhotoBrowserPage.defaultProps) {
    try {
        PhotoBrowserPage.defaultProps = defaultProps;
    } catch (e) {
    }
}

export {initIMPhotoBrowser}
