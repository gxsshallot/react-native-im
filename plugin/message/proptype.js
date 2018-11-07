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
        thumbnailPath: PropTypes.string,
        remotePath: PropTypes.string,
    }),
};