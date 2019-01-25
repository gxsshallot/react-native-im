import AsyncStorage from 'react-native-general-storage';
import Listener from 'react-native-general-listener';
import * as Constant from '../constant';
import { simpleExport } from '../util';
import delegate from '../delegate';

const rootNode = {};

/**
 * 会话模块的标识。
 */
export const name = 'im-conversation';

/**
 * 会话的默认配置信息。
 */
export const defaultConfig = {
    top: false,
    showMembersName: true,
    avoid: false,
};

/**
 * 初始化模块。
 * @param {boolean} forceUpdate 是否强制重载会话列表
 */
export function init(forceUpdate) {
    const cachePromise = AsyncStorage.getKeys(keys(), Constant.StoragePart)
        .then((items) => {
            Object.values(items).forEach((item) => {
                rootNode[item.imId] = item;
            });
        });
    if (forceUpdate) {
        return load()
            .catch(() => cachePromise);
    } else {
        return cachePromise;
    }
}

/**
 * 反初始化模块。
 * @param {boolean} forceClear 是否清除持久化存储
 */
export function uninit(forceClear) {
    const keys = Object.keys(rootNode);
    keys.forEach(imId => delete rootNode[imId]);
    if (forceClear) {
        const promises = keys.map(imId => deleteData(imId));
        return Promise.all(promises);
    } else {
        return Promise.resolve();
    }
}

/**
 * 重新加载全部会话。
 */
export function load() {
    return delegate.im.conversation.loadList()
        .then((result) => {
            const promises = result.map((item) => loadItem(item.imId, item.chatType));
            return Promise.all(promises);
        });
}

/**
 * 加载并更新会话信息。
 * @param {string} imId 会话ID
 * @param {number} chatType 会话类型
 */
export function loadItem(imId, chatType) {
    return delegate.im.conversation.loadItem(imId, chatType, true)
        .then((result) => {
            const message = !result.latestMessage ? undefined : 
                delegate.model.Action.match(
                    Constant.Action.Parse,
                    undefined,
                    result.latestMessage,
                    result.latestMessage,
                );
            result.latestMessage = message;
            result.unreadMessagesCount = result.unreadMessagesCount || 0;
            if (!rootNode[imId]) {
                rootNode[imId] = {
                    ...result,
                    config: {
                        ...defaultConfig,
                        ...result.config || {},
                    },
                };
            } else {
                rootNode[imId].unreadMessagesCount = result.unreadMessagesCount;
                if (rootNode[imId].latestMessage) {
                    if (result.latestMessage) {
                        const {localTime: l1} = rootNode[imId].latestMessage;
                        const {localTime: l2} = result.latestMessage;
                        if (l1 < l2) {
                            rootNode[imId].latestMessage = result.latestMessage;
                        }
                    }
                } else {
                    rootNode[imId].latestMessage = result.latestMessage;
                }
            }
            return writeData(imId);
        })
        .then(() => {
            const isGroup = chatType === Constant.ChatType.Group;
            const group = isGroup ? delegate.model.Group.findByGroupId(imId) : null;
            if (isGroup && !group) {
                return delegate.model.Group.loadItem(imId);
            }
        })
        .then(() => {
            return rootNode[imId];
        })
}

/**
 * 判断会话是否有效，如果用户、群组或者会话不存在，则认为是无效会话。
 * @param {string} imId 会话ID
 * @param {number} chatType 会话类型
 */
export function isValid(imId, chatType) {
    let item;
    if (chatType === Constant.ChatType.Single) {
        item = delegate.user.getUser(imId);
    } else if (chatType === Constant.ChatType.Group) {
        item = delegate.model.Group.findByGroupId(imId, false);
    }
    return !!item && !!getOne(imId, false);
}

/**
 * 获取会话列表，按照置顶和最新消息时间戳排序。
 */
export function get() {
    const originItems = Object.values(rootNode);
    const validItems = originItems.filter(item => isValid(item.imId, item.chatType));
    const sortedItems = validItems
        .sort((a, b) => {
            const aTop = a.config.top;
            const bTop = b.config.top;
            const index = bTop - aTop;
            if (index !== 0) {
                return index;
            } else if (a.latestMessage || b.latestMessage) {
                a = (a.latestMessage || {}).timestamp || 0;
                b = (b.latestMessage || {}).timestamp || 0;
                return a > b ? -1 : a < b ? 1 : 0;
            } else {
                return a.imId.localeCompare(b.imId);
            }
        });
    return simpleExport(sortedItems);
}

/**
 * 获取指定会话。
 * @param {string} imId 会话ID
 * @param {boolean} enableExport 是否导出副本，默认为true，在模块内部使用一般不导出副本
 */
export function getOne(imId, enableExport = true) {
    if (enableExport) {
        return simpleExport(rootNode[imId]);
    } else {
        return rootNode[imId];
    }
}

/**
 * 获取会话配置。
 * @param {string} imId 会话ID
 */
export function getConfig(imId) {
    const item = getOne(imId, false);
    return simpleExport(item && item.config || defaultConfig);
}

/**
 * 获取会话名称。
 * @param {string} imId 会话ID
 */
export function getName(imId) {
    const item = getOne(imId, false);
    if (!item) {
        return undefined;
    }
    if (item.chatType === Constant.ChatType.Group) {
        return delegate.model.Group.getName(imId, true);
    } else if (item.chatType === Constant.ChatType.Single) {
        const user = delegate.user.getUser(imId);
        return user ? user.name : undefined;
    } else {
        return undefined;
    }
}

/**
 * 更新会话配置。
 * @param {string} imId 会话ID
 * @param {object} config 新会话配置
 */
export function updateConfig(imId, config) {
    const newConfig = {
        ...getConfig(imId, false),
        ...config,
    };
    return delegate.im.conversation.updateConfig(imId, newConfig)
        .then((result) => {
            rootNode[imId].config = result;
            Listener.trigger([Constant.BaseEvent, Constant.ConversationEvent, imId]);
            return writeData(imId);
        });
}

/**
 * 更新会话最新消息。
 * @param {*} imId 会话ID
 * @param {*} message 最新消息
 */
export function updateMessage(imId, message) {
    const item = getOne(imId);
    rootNode[imId].latestMessage = message;
    const isFromMe = message.from === delegate.user.getMine().userId;
    // 群聊，并且是别人发的消息，需要判断是否@了当前用户
    if (item.chatType === Constant.ChatType.Group && !isFromMe) {
        let hasAtMe = false;
        if (message.data && message.data.atMemberList) {
            const {atMemberList} = message.data;
            if (atMemberList === Constant.atAll) {
                hasAtMe = true;
            } else {
                const index = message.data.atMemberList
                    .indexOf(delegate.user.getMine().userId);
                hasAtMe = index >= 0;
            }
        }
        rootNode[imId].atMe = hasAtMe;
    }
    Listener.trigger([Constant.BaseEvent, Constant.ConversationEvent, imId]);
    return loadItem(imId, item.chatType)
        .then(() => {
            Listener.trigger([Constant.BaseEvent, Constant.UnreadCountEvent, imId]);
            onUnreadCountChanged();
        });
}

/**
 * 删除会话。
 * @param {string} imId 会话ID
 */
export function deleteOne(imId) {
    if (!getOne(imId, false)) {
        return Promise.resolve();
    }
    return delegate.im.conversation.deleteOne(imId)
        .then(() => {
            delete rootNode[imId];
            Listener.trigger([Constant.BaseEvent, Constant.ConversationEvent]);
            return deleteData(imId);
        });
}

/**
 * 创建一个会话，根据members长度判断单聊或者群聊。
 * @param {string[]} members 成员的UserID列表
 */
export function createOne(members) {
    members = Array.isArray(members) ? members : [members];
    const isGroup = members.length > 1;
    const chatType = isGroup ? Constant.ChatType.Group : Constant.ChatType.Single;
    let promise;
    if (isGroup) {
        promise = delegate.model.Group.createOne(members)
            .then((result) => {
                const groupId = result.groupId;
                return loadItem(result.groupId, chatType);
            });
    } else {
        if (getOne(members[0], false)) {
            promise = Promise.resolve(getOne(members[0], true));
        } else {
            promise = loadItem(members[0], Constant.ChatType.Single);
        }
    }
    return promise;
}

/**
 * 标记会话状态。
 * @param {string} imId 会话ID
 * @param {number} chatType 会话类型
 * @param {boolean} status 已读/未读状态。
 */
export function markReadStatus(imId, chatType, status) {
    let promise;
    if (status) {
        promise = delegate.im.conversation.markAllRead(imId, chatType);
    } else {
        promise = delegate.im.conversation.markLatestUnread(imId, chatType);
    }
    return promise
        .then(() => {
            if (!getOne(imId, false)) {
                return;
            }
            rootNode[imId].unreadMessagesCount = status ? 0 : 1;
            rootNode[imId].atMe = false;
            Listener.trigger([Constant.BaseEvent, Constant.UnreadCountEvent, imId]);
            onUnreadCountChanged();
            return writeData(imId);
        });
}

function onUnreadCountChanged() {
    const count = Object.values(rootNode)
        .reduce((prv, cur) => {
            const isAvoid = cur.config.avoid;
            if (!isAvoid) {
                prv += cur.unreadMessagesCount;
            }
            return prv;
        }, 0);
    Listener.trigger([Constant.BaseEvent, Constant.UnreadCountEvent], count);
}

function writeData(imId) {
    return AsyncStorage.set(keys(imId), rootNode[imId], Constant.StoragePart);
}

function deleteData(imId) {
    return AsyncStorage.remove(keys(imId), Constant.StoragePart);
}

function keys(imId) {
    const myUserId = delegate.user.getMine().userId;
    return [myUserId, name, imId].filter(i => i);
}