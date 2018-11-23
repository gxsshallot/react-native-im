import Toast from 'react-native-root-toast';
import AsyncStorage from 'react-native-general-storage';
import Listener from 'react-native-general-listener';
import * as Constant from '../constant';
import { simpleExport } from '../util'
import delegate from '../delegate';

const types = {
    list: 'GroupList',
};

const rootNode = {
    [types.list]: {},
};

export const name = 'im.group';

export function init(forceUpdate) {
    return AsyncStorage.get(keys(types.list), Constant.StoragePart)
        .then((result) => {
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
}

// 重新加载群列表
export function load() {
    return delegate.im.group.loadList()
        .then((result) => {
            rootNode[types.list] = result
                .reduce((prv, cur) => {
                    prv[cur.groupId] = cur;
                    return prv;
                }, {});
            writeData(types.list);
            Listener.trigger([Constant.BaseEvent, Constant.GroupUpdateEvent]);
        })
        .catch((err) => {
            if (global.__DEV__) {
                Toast.show(err.message);
            } else {
                Toast.show('加载群列表失败');
            }
        });
}

// 加载群详情
export function loadDetail(groupId) {
    return delegate.im.group.loadItem(groupId)
        .then((result) => {
            if (result) {
                rootNode[types.list][result.groupId] = result;
                writeData(types.list);
                Listener.trigger([Constant.BaseEvent, Constant.GroupUpdateEvent, result.groupId]);
            } else {
                deleteOne(groupId);
            }
        })
        .catch((err) => {
            if (global.__DEV__) {
                Toast.show(err.message);
            } else {
                Toast.show('加载群详情失败');
            }
        });
}

// 获取群列表
export function get() {
    const items = Object.values(rootNode[types.list]);
    return simpleExport(items);
}

// 根据groupId查找指定群
export function findByGroupId(groupId, enableExport = true) {
    if (enableExport) {
        return simpleExport(rootNode[types.list][groupId]);
    } else {
        return rootNode[types.list][groupId];
    }
}

// 获取群主用户信息
export function getOwner(groupId) {
    const group = findByGroupId(groupId, false);
    return group ? group.owner : undefined;
}

// 获取群成员列表，hasOwner表示是否包含群主
export function getMembers(groupId, hasOwner = true) {
    const group = findByGroupId(groupId, false);
    if (!group) {
        return undefined;
    }
    const members = [];
    if (hasOwner && group.owner) {
        members.push(group.owner);
    }
    if (group.members) {
        group.members.forEach(item => members.push(item));
    }
    return members;
}

// 获取群名称，控制是否自动连接
export function getName(groupId, autoConjWhenEmpty = true) {
    const group = findByGroupId(groupId, false);
    if (!group) {
        return undefined;
    }
    if (group.name) {
        return group.name;
    }
    if (autoConjWhenEmpty) {
        const members = getMembers(groupId, true);
        return members
            .map(member => {
                const user = delegate.user.getUser(member);
                return user ? user.name : '';
            })
            .join('、');
    } else {
        return '';
    }
}

// 获取群头像
export function getAvatar(groupId) {
    const group = findByGroupId(groupId, false);
    return group ? group.avatar : undefined;
}

// 创建群聊
export function createOne(members) {
    return delegate.im.group.createOne(members)
        .then((result) => {
            if (!findByGroupId(result.groupId)) {
                rootNode[types.list][result.groupId] = result;
                writeData(types.list);
            }
            return result;
        });
}

// 解散群聊
export function destroyOne(groupId) {
    return delegate.im.group.destroyOne(groupId)
        .then(() => {
            deleteOne(groupId);
            delegate.model.Conversation.deleteOne(groupId);
        });
}

// 退出群聊
export function quitOne(groupId) {
    return delegate.im.group.quitOne(groupId)
        .then(() => {
            deleteOne(groupId);
            delegate.model.Conversation.deleteOne(groupId);
        })
}

// 添加群成员
export function addMembers(groupId, members) {
    return delegate.im.group.addMembers(groupId, members)
        .then(() => {
            const newMembers = [...rootNode[types.list][groupId], ...members];
            changeGroupInfo({members: Array.from(new Set(newMembers))});
            return newMembers;
        });
}

// 删除群成员
export function removeMembers(groupId, members) {
    return delegate.im.group.removeMembers(groupId, members)
        .then(() => {
            const oldMembers = rootNode[types.list][groupId].members;
            const newMembers = oldMembers.filter(id => members.indexOf(id) < 0);
            changeGroupInfo({members: newMembers});
            return newMembers;
        });
}

// 更改群名称
export function changeName(groupId, newName) {
    return delegate.im.group.changeName(groupId, newName)
        .then(() => {
            changeGroupInfo({name: newName});
            return newName;
        });
}

// 更改群头像
export function changeAvatar(groupId, newAvatarUrl) {
    return delegate.im.group.changeAvatar(groupId, newAvatarUrl)
        .then(() => {
            changeGroupInfo({avatar: newAvatarUrl});
            return newAvatarUrl;
        });
}

// 转交群主
export function changeOwner(groupId, newOwnerId) {
    return delegate.im.group.changeOwner(groupId, newOwnerId)
        .then(() => {
            const newMembers = getMembers(groupId, true)
                .filter(id => id !== newOwnerId)
            const result = {
                owner: newOwnerId,
                members: newMembers,
            };
            changeGroupInfo(groupId, result);
            return result;
        });
}

// 更新群信息
function changeGroupInfo(groupId, newGroupInfo) {
    rootNode[types.list][groupId] = {
        ...rootNode[types.list][groupId],
        ...newGroupInfo,
    };
    writeData(types.list);
    Listener.trigger([Constant.BaseEvent, Constant.GroupUpdateEvent, groupId]);
}

// 在本地删除群聊
function deleteOne(groupId) {
    if (groupId) {
        delete rootNode[types.list][groupId];
    }
    writeData(types.list);
    Listener.trigger([Constant.BaseEvent, Constant.GroupUpdateEvent]);
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