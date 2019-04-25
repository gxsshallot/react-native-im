/* eslint-disable */
import Config from './config';
import * as API from './api';
import * as Model from './model';

// @ts-ignore 外部初始化，这里不设置接口
const ConversationAPI: API.Conversation.Interface = {};
// @ts-ignore 外部初始化，这里不设置接口
const GroupAPI: API.Group.Interface = {};
// @ts-ignore 外部初始化，这里不设置接口
const UserAPI: API.User.Interface = {};

// @ts-ignore 外部初始化，这里不设置接口
const ConversationManager: Model.ConversationManager.Interface = {};
// @ts-ignore 外部初始化，这里不设置接口
const GroupManager: Model.GroupManager.Interface = {};

export default {
    Config: Config,
    API: {
        Conversation: ConversationAPI,
        Group: GroupAPI,
        User: UserAPI,
    },
    Manager: {
        Conversation: ConversationManager,
        Group: GroupManager,
    },
}