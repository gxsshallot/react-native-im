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

export const ImageMessage = {
    ...Types.BasicMessage,
    data: PropTypes.shape({
        localPath: PropTypes.string,
        thumbnailPath: PropTypes.string,
        previewPath: PropTypes.string,
        remotePath: PropTypes.string,
        size: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number,
        }),
    }),
};