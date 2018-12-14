import PropTypes from 'prop-types';
import * as IMStandard from '../../src';

export function DisplayProps(messageProps) {
    return {
        message: PropTypes.shape(messageProps).isRequired,
        isSender: PropTypes.bool.isRequired,
        maxWidth: PropTypes.number,
        enableBubble: PropTypes.func,
        style: PropTypes.any,
    };
};

export const TextMessage = {
    ...IMStandard.Types.BasicMessage,
    data: PropTypes.shape({
        atMemberList: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        text: PropTypes.string,
        isSystem: PropTypes.bool,
    }),
};

export const ImageMessage = {
    ...IMStandard.Types.BasicMessage,
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
    ...IMStandard.Types.BasicMessage,
    data: PropTypes.shape({
        localPath: PropTypes.string,
        remotePath: PropTypes.string,
        duration: PropTypes.number,
    }),
};

export const LocationMessage = {
    ...IMStandard.Types.BasicMessage,
    data: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        address: PropTypes.string,
        name: PropTypes.string,
    }),
};

export const VideoMessage = {
    ...IMStandard.Types.BasicMessage,
    data: PropTypes.shape({
        localPath: PropTypes.string,
        remotePath: PropTypes.string,
        duration: PropTypes.number,
    }),
};

export const FileMessage = {
    ...IMStandard.Types.BasicMessage,
    data: PropTypes.shape({
        localPath: PropTypes.string,
        remotePath: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number,
    }),
};