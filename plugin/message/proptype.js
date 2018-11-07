import PropTypes from 'prop-types';
import { Types } from '../../src';

export function DisplayProps(messageProps) {
    return {
        message: PropTypes.shape(messageProps).isRequired,
        isSender: PropTypes.bool.isRequired,
        maxWidth: PropTypes.number,
        enableBubble: PropTypes.func, // (status: boolean) => void
        style: PropTypes.any,
    };
};

export const TextMessage = {
    ...Types.BasicMessage,
    data: PropTypes.shape({
        text: PropTypes.string,
    }),
};

export const ImageMessage = {
    ...Types.BasicMessage,
    data: PropTypes.shape({
        thumbnailLocalPath: PropTypes.string,
        thumbnailRemotePath: PropTypes.string,
        localPath: PropTypes.string,
        remotePath: PropTypes.string,
        size: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number,
        }),
    }),
};

export const VoiceMessage = {
    ...Types.BasicMessage,
    data: PropTypes.shape({
        localPath: PropTypes.string,
        remotePath: PropTypes.string,
        duration: PropTypes.number,
    }),
};

export const LocationMessage = {
    ...Types.BasicMessage,
    data: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        address: PropTypes.string,
        name: PropTypes.string,
    }),
};

export const VideoMessage = {
    ...Types.BasicMessage,
    data: PropTypes.shape({
        localPath: PropTypes.string,
        remotePath: PropTypes.string,
    }),
};

export const FileMessage = {
    ...Types.BasicMessage,
    data: PropTypes.shape({
        localPath: PropTypes.string,
        remotePath: PropTypes.string,
        size: PropTypes.number,
    }),
};