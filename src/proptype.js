import PropTypes from 'prop-types';
import * as Constant from './constant';

export const BasicMessage = {
    conversationId: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
    status: PropTypes.oneOf(Object.values(Constant.Status)),
    type: PropTypes.number.isRequired,
    from: PropTypes.string,
    to: PropTypes.string,
    timestamp: PropTypes.number,
    data: PropTypes.any,
};