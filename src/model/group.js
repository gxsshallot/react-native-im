import Toast from 'react-native-root-toast';
import AsyncStorage from 'react-native-general-storage';
import Listener from 'react-native-general-listener';
import * as Constant from '../constant';
import { simpleExport } from '../util'
import delegate from '../delegate';

const rootNode = {};

/**
 * 群组模块名称。
 */
export const name = 'im-group';

/**
 * 初始化模块。
 * @param {boolean} forceUpdate 是否强制重载群组列表
 */
export function init(forceUpdate) {
    return AsyncStorage.getKeys(keys(), Constant.StoragePart)
        .then((items) => {
            Object.values(items).forEach((item) => {
                rootNode[item.groupId] = item;
            });
            if (forceUpdate) {
                return load();
            }
        });
}

/**
 * 反初始化模块。
 * @param {boolean} forceClear 是否清除持久化存储
 */
export function uninit(forceClear) {
    const keys = Object.keys(rootNode);
    keys.forEach(groupId => delete rootNode[groupId]);
    if (forceClear) {
        const promises = keys.map(groupId => deleteData(groupId));
        return Promise.all(promises);
    } else {
        return Promise.resolve();
    }
}

/**
 * 重新加载群组列表。
 */
export function load() {
    return delegate.im.group.loadList()
        .then((result) => {
            const promises = result.map((item) => {
                rootNode[item.groupId] = groupHandle(item);
                return writeData(item.groupId);
            });
            return Promise.all(promises);
        })
        .catch((err) => {
            Toast.show('加载群列表失败');
        });
}

/**
 * 加载群组详情。
 * @param {string} groupId 群组ID
 */
export function loadItem(groupId) {
    return delegate.im.group.loadItem(groupId)
        .then((result) => {
            if (result) {
                rootNode[result.groupId] = groupHandle(result);
                Listener.trigger([Constant.BaseEvent, Constant.GroupEvent, result.groupId]);
                return writeData(groupId);
            } else {
                return deleteOne(groupId);
            }
        })
        .catch((err) => {
            Toast.show('加载群详情失败');
        });
}

/**
 * 获取群组列表。
 */
export function get() {
    const items = Object.values(rootNode);
    return simpleExport(items);
}

/**
 * 查找指定群组。
 * @param {string} groupId 群组ID
 * @param {boolean} enableExport 是否导出副本，默认为true，在模块内部使用一般不导出副本
 */
export function findByGroupId(groupId, enableExport = true) {
    if (enableExport) {
        return simpleExport(rootNode[groupId]);
    } else {
        return rootNode[groupId];
    }
}

/**
 * 获取群主用户信息。
 * @param {string} groupId 群组ID
 */
export function getOwner(groupId) {
    const group = findByGroupId(groupId, false);
    return group ? group.owner : undefined;
}

/**
 * 获取群组成员列表。
 * @param {string} groupId 群组ID
 * @param {boolean} hasOwner 是否包含群主
 */
export function getMembers(groupId, hasOwner = true) {
    const group = findByGroupId(groupId, false);
    if (!group) {
        return undefined;
    }
    const members = [];
    if (hasOwner && group.owner) {
        members.push(group.owner);
    }
    group.members.forEach(item => members.push(item));
    return members;
}

/**
 * 获取群组名称。
 * @param {string} groupId 群组ID
 * @param {boolean} autoConjWhenEmpty 是否自动连接群组成员名称
 */
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

/**
 * 获取群组头像。
 * @param {string} groupId 群组ID
 */
export function getAvatar(groupId) {
    const group = findByGroupId(groupId, false);
    return group ? group.avatar : undefined;
}

/**
 * 创建一个群组。
 * @param {string[]} memberUserIds 成员ID列表
 */
export function createOne(memberUserIds) {
    return delegate.im.group.createOne(memberUserIds)
        .then((result) => {
            const promises = [];
            if (!findByGroupId(result.groupId, false)) {
                rootNode[result.groupId] = result;
                promises.push(Promise.resolve(result));
                promises.push(writeData(result.groupId));
            } else {
                const group = findByGroupId(result.groupId, true);
                promises.push(Promise.resolve(group));
            }
            return Promise.all(promises);
        })
        .then(([result]) => result);
}

/**
 * 解散一个群组。
 * @param {string} groupId 群组ID
 */
export function destroyOne(groupId) {
    return delegate.im.group.destroyOne(groupId)
        .then(() => deleteOne(groupId))
        .then(() => delegate.model.Conversation.deleteOne(groupId));
}

/**
 * 退出一个群组。
 * @param {string} groupId 群组ID
 */
export function quitOne(groupId) {
    return delegate.im.group.quitOne(groupId)
        .then(() => deleteOne(groupId))
        .then(() => delegate.model.Conversation.deleteOne(groupId));
}

/**
 * 添加群组成员。
 * @param {string} groupId 群组ID
 * @param {string[]} memberUserIds 待添加的成员ID列表
 */
export function addMembers(groupId, memberUserIds) {
    return delegate.im.group.addMembers(groupId, memberUserIds)
        .then(() => {
            const members = [...rootNode[groupId].members, ...memberUserIds];
            return changeGroupInfo(groupId, {members}, members);
        });
}

/**
 * 删除群组成员。
 * @param {string} groupId 群组ID
 * @param {string[]} memberUserIds 待删除的成员ID列表
 */
export function removeMembers(groupId, memberUserIds) {
    return delegate.im.group.removeMembers(groupId, memberUserIds)
        .then(() => {
            const oldMembers = rootNode[groupId].members;
            const newMembers = oldMembers.filter(id => memberUserIds.indexOf(id) < 0);
            return changeGroupInfo(groupId, {members: newMembers}, newMembers);
        });
}

/**
 * 更改群组名称。
 * @param {string} groupId 群组ID
 * @param {string} newName 新的群组名称
 */
export function changeName(groupId, newName) {
    return delegate.im.group.changeName(groupId, newName)
        .then(() => {
            return changeGroupInfo(groupId, {name: newName}, newName);
        });
}

/**
 * 更改群组头像。
 * @param {string} groupId 群组ID
 * @param {string} newAvatarUrl 新头像的URL地址
 */
export function changeAvatar(groupId, newAvatarUrl) {
    return delegate.im.group.changeAvatar(groupId, newAvatarUrl)
        .then(() => {
            return changeGroupInfo(groupId, {avatar: newAvatarUrl}, newAvatarUrl);
        });
}

/**
 * 转交群主。
 * @param {string} groupId 群组ID
 * @param {string} newOwnerId 新群主ID
 */
export function changeOwner(groupId, newOwnerId) {
    return delegate.im.group.changeOwner(groupId, newOwnerId)
        .then(() => {
            const newMembers = getMembers(groupId, true)
                .filter(id => id !== newOwnerId)
            const result = {
                owner: newOwnerId,
                members: newMembers,
            };
            return changeGroupInfo(groupId, result, result);
        });
}

/**
 * 更新群组信息。
 * @param {string} groupId 群组ID
 * @param {object} newGroupInfo 新的群组信息对象
 * @param {object} promiseResult Promise的返回结果
 */
function changeGroupInfo(groupId, newGroupInfo, promiseResult) {
    rootNode[groupId] = {
        ...rootNode[groupId],
        ...newGroupInfo,
    };
    Listener.trigger([Constant.BaseEvent, Constant.GroupEvent, groupId]);
    return writeData(groupId)
        .then(() => promiseResult);
}

/**
 * 在本地删除群组。
 * @param {string} groupId 群组ID
 */
function deleteOne(groupId) {
    if (groupId) {
        delete rootNode[groupId];
    }
    Listener.trigger([Constant.BaseEvent, Constant.GroupEvent, groupId]);
    return deleteData(groupId);
}

/**
 * 处理群组信息，保证数据有效性。
 * @param {object} group 群组信息
 */
function groupHandle(group) {
    return {
        ...group,
        members: group.members || [],
    };
}

function writeData(groupId) {
    return AsyncStorage.set(keys(groupId), rootNode[groupId], Constant.StoragePart);
}

function deleteData(groupId) {
    return AsyncStorage.remove(keys(groupId), Constant.StoragePart);
}

function keys(groupId) {
    return [name, groupId].filter(i => i);
}