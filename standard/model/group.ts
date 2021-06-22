import AsyncStorage from '@hecom/storage';
import Listener from '@hecom/listener';
import { Group, Event, Storage } from '../typings';
import { simpleExport } from '../util';
import delegate from '../delegate';

const rootNode: {[groupId: string]: Group.Item} = {};

export const name = 'im-group';

export async function init(forceUpdate: boolean): Promise<void> {
    const getCache = async function (): Promise<void> {
        const items = await AsyncStorage.getKeys(keys(), Storage.Part);
        Object.values(items).forEach((item) => {
            rootNode[item.groupId] = item;
        });
    };
    if (forceUpdate) {
        await load().catch(() => getCache());
    } else {
        await getCache();
    }
}

export async function uninit(forceClear: boolean): Promise<void> {
    const groupIds = Object.keys(rootNode);
    groupIds.forEach(groupId => delete rootNode[groupId]);
    if (forceClear) {
        const promises = groupIds.map(groupId => deleteData(groupId));
        await Promise.all(promises);
    }
}

export async function load(): Promise<void> {
    const result = await delegate.im.group.loadList();
    const promises = result.map((item) => {
        rootNode[item.groupId] = groupHandle(item);
        return writeData(item.groupId);
    });
    await Promise.all(promises);
}

export async function loadItem(groupId: string): Promise<void> {
    const result = await delegate.im.group.loadItem(groupId);
    if (result) {
        rootNode[groupId] = groupHandle(result);
        Listener.trigger([Event.Base, Event.Group, groupId]);
        await writeData(groupId);
    } else {
        await deleteOne(groupId);
    }
}

export function get(): Group.Item[] {
    const items = Object.values(rootNode);
    return simpleExport(items);
}

export function findByGroupId(groupId: string, enableExport: boolean = true): Group.Item | void {
    if (enableExport) {
        return simpleExport(rootNode[groupId]);
    } else {
        return rootNode[groupId];
    }
}

export function getOwner(groupId: string): string {
    const group = findByGroupId(groupId, false);
    return group ? group.owner : '';
}

export function getMembers(groupId: string, hasOwner: boolean = true): string[] {
    const group = findByGroupId(groupId, false);
    if (group) {
        return [
            ...hasOwner && group.owner ? [group.owner] : [],
            ...group.members
        ];
    } else {
        return [];
    }
}

export function getName(groupId: string, autoConj: boolean = true): string | void {
    const group = findByGroupId(groupId, false);
    if (group) {
        if (group.name) {
            return group.name;
        }
        if (autoConj) {
            return getMembers(groupId, true)
                .map((userId) => delegate.user.getUser(userId).name || '')
                .join('、');
        } else {
            return '';
        }
    } else {
        return null;
    }
}

export function getAnnouncement(groupId: string): string {
    const group = findByGroupId(groupId, false);
    return (group && group.announcement) ? group.announcement : '';
}

export function getAvatar(groupId: string): string | void {
    const group = findByGroupId(groupId, false);
    return group ? group.avatar : null;
}

export function getAllowInvites(groupId: string): boolean {
    const group = findByGroupId(groupId, false);
    return group ? !!group.allowInvites : false;
}

export async function createOne(memberUserIds: string[]): Promise<Group.Item> {
    const result = await delegate.im.group.createOne(memberUserIds);
    const {groupId} = result;
    const item = findByGroupId(groupId, true);
    if (item) {
        return item;
    }
    const group = groupHandle(result);
    rootNode[groupId] = group;
    await writeData(groupId);
    return simpleExport(group);
}

export async function destroyOne(groupId: string): Promise<void> {
    await delegate.im.group.destroyOne(groupId);
    await deleteOne(groupId);
    await delegate.model.Conversation.deleteOne(groupId);
}

export async function quitOne(groupId: string): Promise<void> {
    await delegate.im.group.quitOne(groupId);
    await deleteOne(groupId);
    await delegate.model.Conversation.deleteOne(groupId);
}

export async function addMembers(groupId: string, memberUserIds: string[]): Promise<string[]> {
    await delegate.im.group.addMembers(groupId, memberUserIds);
    const members = [...rootNode[groupId].members, ...memberUserIds];
    return changeGroupInfo(groupId, {members}, members);
}

export async function removeMembers(groupId: string, memberUserIds: string[]): Promise<string[]> {
    await delegate.im.group.removeMembers(groupId, memberUserIds);
    const oldMembers = rootNode[groupId].members;
    const members = oldMembers.filter(userId => memberUserIds.indexOf(userId) < 0);
    return changeGroupInfo(groupId, {members}, members);
}

export async function changeName(groupId: string, newName: string): Promise<string> {
    await delegate.im.group.changeName(groupId, newName);
    return changeGroupInfo(groupId, {name: newName}, newName);
}

export async function showGroupDataRecord(imId:string) {
    await delegate.im.group.showGroupDataRecord(imId)
}

export async function changeAnnouncement(groupId: string, newAnnouncement: string): Promise<string> {
    await delegate.im.group.changeAnnouncement(groupId, newAnnouncement);
    return changeGroupInfo(groupId, {announcement: newAnnouncement}, newAnnouncement);
}

export async function changeAvatar(groupId: string, newAvatarUrl: string): Promise<string> {
    await delegate.im.group.changeAvatar(groupId, newAvatarUrl);
    return changeGroupInfo(groupId, {avatar: newAvatarUrl}, newAvatarUrl);
}

export async function changeAllowInvites(groupId: string, allowInvites: boolean): Promise<boolean> {
    await delegate.im.group.changeAllowInvites(groupId, allowInvites);
    return changeGroupInfo(groupId, {allowInvites}, allowInvites);
}

export async function changeOwner(groupId: string, newOwnerId: string): Promise<{owner: string; members: string[]}> {
    await delegate.im.group.changeOwner(groupId, newOwnerId);
    const newMembers = getMembers(groupId, true)
        .filter(id => id !== newOwnerId);
    const result = {
        owner: newOwnerId,
        members: newMembers,
    };
    return changeGroupInfo(groupId, result, result);
}

async function changeGroupInfo<T>(
    groupId: string,
    newGroupInfo: {[key: string]: any},
    promiseResult: T
): Promise<T> {
    rootNode[groupId] = {
        ...rootNode[groupId],
        ...newGroupInfo,
    };
    Listener.trigger([Event.Base, Event.Group, groupId]);
    await writeData(groupId);
    return promiseResult;
}

export async function deleteOne(groupId: string): Promise<void> {
    if (groupId) {
        delete rootNode[groupId];
    }
    Listener.trigger([Event.Base, Event.Group]);
    await deleteData(groupId);
}

function groupHandle(group: Group.Item): Group.Item {
    return {
        ...group,
        members: group.members || [],
    };
}

async function writeData(groupId: string): Promise<void> {
    await AsyncStorage.set(keys(groupId), rootNode[groupId], Storage.Part);
}

async function deleteData(groupId: string): Promise<void> {
    await AsyncStorage.remove(keys(groupId), Storage.Part);
}

function keys(groupId?: string): string[] {
    const myUserId = delegate.user.getMine().userId;
    if (groupId) {
        return [myUserId, name, groupId];
    } else {
        return [myUserId, name];
    }
}
