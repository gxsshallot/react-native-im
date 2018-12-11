import PropTypes from 'prop-types';
import * as Constant from './constant';

export const BasicMessage = {
    conversationId: PropTypes.string.isRequired,
    messageId: PropTypes.string,
    innerId: PropTypes.string,
    status: PropTypes.oneOf(Object.values(Constant.Status)),
    type: PropTypes.number.isRequired,
    from: PropTypes.string,
    to: PropTypes.string,
    localTime: PropTypes.number,
    timestamp: PropTypes.number,
    data: PropTypes.any,
};

export const ImOrg = {
    orgId: PropTypes.string.isRequired,
    name: PropTypes.string,
    name_py: PropTypes.string,
    dept: PropTypes.shape(ImOrg),
};

export const ImUser = {
    userId: PropTypes.string.isRequired,
    name: PropTypes.string,
    name_py: PropTypes.string,
    dept: PropTypes.shape(ImOrg),
    avatar: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
};

export const ConversationConfig = {
    showMembersName: PropTypes.bool,
    top: PropTypes.bool,
    avoid: PropTypes.bool,
};

export const BasicConversation = {
    imId: PropTypes.string.isRequired,
    chatType: PropTypes.oneOf(Object.values(Constant.ChatType)),
};

export const Conversation = {
    ...BasicConversation,
    config: PropTypes.shape(ConversationConfig),
    latestMessage: PropTypes.shape(BasicMessage),
    unreadMessagesCount: PropTypes.number,
    atMe: PropTypes.bool,
};

export const Group = {
    groupId: PropTypes.string.isRequired,
    name: PropTypes.string,
    name_py: PropTypes.string,
    avatar: PropTypes.string,
    owner: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.string),
    createdOn: PropTypes.number,
};