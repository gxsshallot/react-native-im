import Config from './config';
import * as API from './api';
import * as Model from './model';

interface Delegate {
    Config: typeof Config;
    API: {
        Conversation: API.Conversation.Interface;
        Group: API.Group.Interface;
    };
    Manager: {
        Conversation: Model.ConversationManager.Interface;
        Group: Model.GroupManager.Interface;
    };
}

let delegate: Delegate | null = null;

export default delegate;

/**
 * 设置新的代理。
 * @param d 新的代理实例。
 */
export function setDelegate(d: Delegate) {
    delegate = d;
}