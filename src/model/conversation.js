import AsyncStorage from 'react-native-general-storage';
import Listener from 'react-native-general-listener';
import * as Constant from '../constant';
import { simpleExport } from '../util';
import delegate from '../delegate';

const types = {
    list: 'ConversationList',
    sendMessageEvent: 'ListenSendMessageEvent'
};

const rootNode = {
    [types.list]: {},
    [types.sendMessageEvent]: null,
};

export const name = 'im.conversation';

export function init(forceUpdate) {
    rootNode[types.sendMessageEvent] = Listener.registerWithSubEvent(
        [Constant.BaseEvent, Constant.SendMessageEvent],
        (data) => {
            const imId = data[Listener.innerEventType][2];
            if (getOne(imId, false)) {
                updateMessage(imId, data);
            } else {
                addOne(imId, data.chatType, data, true);
            }
        },
    );
    return AsyncStorage.get(keys(types.list), Constant.StoragePart)
        .then(result => {
            if (result) {
                rootNode[types.list] = result;
            }
            if (forceUpdate) {
                return load();
            }
        });
}

export function uninit() {
    rootNode[types.list] = {};
    Listener.unregister(
        [Constant.BaseEvent, Constant.SendMessageEvent],
        rootNode[types.sendMessageEvent]
    );
}

// 加载远程全部会话，只有重新登陆才会调用
export function load() {
    return delegate.im.conversation.loadList()
        .then((result) => {
            rootNode[types.list] = result
                .reduce((prv, cur) => {
                    prv[cur.imId] = {
                        ...cur,
                        config: {
                            ...defaultConfig,
                            ...(cur.config || {}),
                        },
                        unreadMessagesCount: cur.unreadMessagesCount || 0,
                    };
                    return prv;
                }, {});
            writeData(types.list);
        })
        .catch((err) => {
            Toast.show('加载会话列表失败');
        });
}

// 会话的默认配置信息
export const defaultConfig = {
    showMembersName: true,
    top: false,
    avoid: false,
};

// 判断会话是否有效
export function isValid(imId, chatType) {
    let item;
    if (chatType === Constant.ChatType.Single) {
        item = delegate.user.getUser(imId);
    } else if (chatType === Constant.ChatType.Group) {
        item = delegate.model.Group.findByGroupId(imId, false);
    }
    return !!item && !!getOne(imId, false);
}

// 获取会话列表，按照置顶和最新消息时间戳排序
export function get() {
    const items = Object.values(rootNode[types.list])
        .filter(item => isValid(item.imId, item.chatType))
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
    return simpleExport(items);
}

// 获取指定会话
export function getOne(imId, enableExport = true) {
    if (enableExport) {
        return simpleExport(rootNode[types.list][imId]);
    } else {
        return rootNode[types.list][imId];
    }
}

// 获取会话配置
export function getConfig(imId) {
    const item = getOne(imId, false);
    return simpleExport(item && item.config || defaultConfig);
}

// 获取会话名称
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

// 更新会话配置
export function updateConfig(imId, config) {
    const newConfig = {...getConfig(imId, false), ...config};
    return delegate.im.conversation.updateConfig(imId, newConfig)
        .then((result) => {
            rootNode[types.list][imId].config = result;
            writeData(types.list);
            Listener.trigger([Constant.BaseEvent, Constant.ConversationUpdateEvent, imId]);
            return result;
        });
}

// 更新最新消息
export function updateMessage(imId, message) {
    const item = getOne(imId);
    rootNode[types.list][imId].latestMessage = message;
    if (item.chatType === Constant.ChatType.Group) {
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
        rootNode[types.list][imId].atMe = hasAtMe;
    }
    Listener.trigger([Constant.BaseEvent, Constant.ConversationUpdateEvent, imId]);
    return delegate.im.conversation.loadItem(imId, item.chatType, true)
        .then((result) => {
            rootNode[types.list][imId].unreadMessagesCount = result.unreadMessagesCount || 0;
            Listener.trigger(
                [Constant.BaseEvent, Constant.UnreadMessageCountChangeEvent, imId],
                rootNode[types.list][imId].unreadMessagesCount
            );
            onUnreadCountChanged();
            writeData(types.list);
        })
        .catch((err) => {
            writeData(types.list);
            throw err;
        });
}

// 从本地和远程删除会话
export function deleteOne(imId) {
    if (!getOne(imId, false)) {
        return Promise.resolve();
    }
    return delegate.im.conversation.removeFromList(imId)
        .then(() => delegate.im.conversation.deleteOne(imId))
        .then(() => {
            delete rootNode[types.list][imId];
            writeData(types.list);
            Listener.trigger([Constant.BaseEvent, Constant.ConversationUpdateEvent]);
        });
}

// 添加一个会话到会话列表和远程
export function addOne(imId, chatType, latestMessage, toRemote = true) {
    return delegate.im.conversation.loadItem(imId, chatType, true)
        .then(() => {
            const isGroup = chatType === Constant.ChatType.Group;
            const group = isGroup ? delegate.model.Group.findByGroupId(imId) : null;
            if (isGroup && !group) {
                return delegate.model.Group.load();
            }
        })
        .then(() => {
            rootNode[types.list][imId] = {
                imId: imId,
                chatType: chatType,
                latestMessage: undefined,
                config: {...defaultConfig},
            };
            if (latestMessage) {
                updateMessage(imId, latestMessage);
            } else {
                Listener.trigger([Constant.BaseEvent, Constant.ConversationUpdateEvent, imId]);
            }
            writeData(types.list);
            if (toRemote) {
                return delegate.im.conversation.addToList(imId, chatType);
            }
        });
}

// 创建一个会话，根据users长度判断单聊或者群聊
export function createOne(members) {
    members = Array.isArray(members) ? members : [members];
    const isGroup = members.length > 1;
    let promise;
    if (isGroup) {
        promise = delegate.model.Group.createOne(members)
            .then((result) => ({
                imId: result.groupId,
                chatType: Constant.ChatType.Group,
            }));
    } else {
        promise = delegate.im.conversation.loadItem(
            members[0],
            Constant.ChatType.Single,
            true
        )
            .then(() => ({
                imId: members[0],
                chatType: Constant.ChatType.Single,
            }));
    }
    return promise
        .then(({imId, chatType}) => {
            if (isGroup && !getOne(imId, false)) {
                addOne(imId, chatType, undefined, true);
            }
            return {imId, chatType};
        });
}

// 标记会话为已读/未读
export function markReadStatus(imId, status) {
    let promise;
    if (status) {
        promise = delegate.im.conversation.markAllRead(imId);
    } else {
        promise = delegate.im.conversation.markLatestUnread(imId);
    }
    return promise
        .then(() => {
            if (rootNode[types.list][imId]) {
                rootNode[types.list][imId].unreadMessagesCount = status ? 0 : 1;
                rootNode[types.list][imId].atMe = false;
                Listener.trigger(
                    [Constant.BaseEvent, Constant.UnreadMessageCountChangeEvent, imId],
                    rootNode[types.list][imId].unreadMessagesCount
                );
            }
            onUnreadCountChanged();
        });
}

function onUnreadCountChanged() {
    const count = Object.values(rootNode[types.list])
        .reduce((prv, cur) => {
            const isAvoid = cur.config.avoid;
            if (!isAvoid) {
                prv += cur.unreadMessagesCount;
            }
            return prv;
        }, 0);
    Listener.trigger([Constant.BaseEvent, Constant.UnreadMessageCountChangeEvent], count);
}

function writeData(type, data) {
    if (data) {
        rootNode[type] = data;
    }
    AsyncStorage.set(keys(type), rootNode[type], Constant.StoragePart);
}

function keys(type) {
    return [name, type];
}