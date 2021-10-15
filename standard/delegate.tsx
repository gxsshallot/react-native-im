import React from 'react';
import {Text, View} from 'react-native';
import {Component, Delegate} from './typings';

function noPromiseDelegate(name: string) {
    return function () {
        return Promise.reject(name + ' not set');
    };
}

function noDataDelegate(name: string) {
    return function () {
        throw new Error(name + ' not set');
    };
}

function noComponentDelegate<P>(name: string) {
    return class extends React.Component<P> {
        render() {
            return (
                <View>
                    <Text>
                        {name + ' not exists'}
                    </Text>
                </View>
            );
        }
    };
}

const page: Delegate.PagePart = {};

const render: Delegate.renderPart = {
    renderBadge: noDataDelegate('renderBadge'),
};

const component: Delegate.ComponentPart = {
    AvatarImage: noComponentDelegate<Component.AvatarImageProps>('AvatarImage'),
    AvatarList: noComponentDelegate<Component.AvatarListProps>('AvatarList'),
    BaseMessage: noComponentDelegate<Component.BaseMessageProps>('BaseMessage'),
    MessageBubble: noComponentDelegate<Component.MessageBubbleProps>('MessageBubble'),
    MessageMenu: noComponentDelegate<Component.MessageMenuProps>('MessageMenu'),
    SettingItem: noComponentDelegate<Component.SettingItemProps>('SettingItem'),
};
const model: Delegate.ModelPart = {
    Conversation: {
        name: '',
        defaultConfig: {
            showMembersName: false,
            top: false,
            avoid: false,
        },
        init: noPromiseDelegate('model.Conversation.init'),
        uninit: noPromiseDelegate('model.Conversation.uninit'),
        load: noPromiseDelegate('model.Conversation.load'),
        loadItem: noPromiseDelegate('model.Conversation.loadItem'),
        isValid: noDataDelegate('model.Conversation.isValid'),
        get: noDataDelegate('model.Conversation.get'),
        getOne: noDataDelegate('model.Conversation.getOne'),
        getConfig: noDataDelegate('model.Conversation.getConfig'),
        getName: noDataDelegate('model.Conversation.getName'),
        updateConfig: noPromiseDelegate('model.Conversation.updateConfig'),
        updateMessage: noPromiseDelegate('model.Conversation.updateMessage'),
        deleteOne: noPromiseDelegate('model.Conversation.deleteOne'),
        createOne: noPromiseDelegate('model.Conversation.createOne'),
        markReadStatus: noPromiseDelegate('model.Conversation.markReadStatus'),
    },
    Group: {
        name: '',
        init: noPromiseDelegate('model.Group.init'),
        uninit: noPromiseDelegate('model.Group.uninit'),
        load: noPromiseDelegate('model.Group.load'),
        loadItem: noPromiseDelegate('model.Group.loadItem'),
        get: noDataDelegate('model.Group.get'),
        findByGroupId: noDataDelegate('model.Group.findByGroupId'),
        getOwner: noDataDelegate('model.Group.getOwner'),
        getMembers: noDataDelegate('model.Group.getMembers'),
        getName: noDataDelegate('model.Group.getName'),
        getAnnouncement: noDataDelegate('model.Group.getAnnouncement'),
        getAvatar: noDataDelegate('model.Group.getAvatar'),
        getAllowInvites: noDataDelegate('model.Group.getAllowInvites'),
        createOne: noPromiseDelegate('model.Group.createOne'),
        destroyOne: noPromiseDelegate('model.Group.destroyOne'),
        quitOne: noPromiseDelegate('model.Group.quitOne'),
        addMembers: noPromiseDelegate('model.Group.addMembers'),
        removeMembers: noPromiseDelegate('model.Group.removeMembers'),
        changeName: noPromiseDelegate('model.Group.changeName'),
        changeAvatar: noPromiseDelegate('model.Group.changeAvatar'),
        changeAllowInvites: noPromiseDelegate('model.Group.changeAllowInvites'),
        changeOwner: noPromiseDelegate('model.Group.changeOwner'),
    },
};
const contact: Delegate.ContactPart = {
    loadAllUser: noPromiseDelegate('contact.loadAllUser'),
    loadAllOrg: noPromiseDelegate('contact.loadAllOrg'),
    loadUserOrgTree: noPromiseDelegate('contact.loadUserOrgTree'),
    loadStarUser: noPromiseDelegate('contact.loadStarUser'),
};
const user: Delegate.UserPart = {
    getMine: noDataDelegate('user.getMine'),
    getUser: noDataDelegate('user.getUser'),
};
const im: Delegate.ApiPart = {
    conversation: {
        loadList: noPromiseDelegate('im.conversation.loadList'),
        loadItem: noPromiseDelegate('im.conversation.loadItem'),
        deleteOne: noPromiseDelegate('im.conversation.deleteOne'),
        updateConfig: noPromiseDelegate('im.conversation.updateConfig'),
        markAllRead: noPromiseDelegate('im.conversation.markAllRead'),
        markLatestUnread: noPromiseDelegate('im.conversation.markLatestUnread'),
        loadMessage: noPromiseDelegate('im.conversation.loadMessage'),
        deleteMessage: noPromiseDelegate('im.conversation.deleteMessage'),
        recallMessage: noPromiseDelegate('im.conversation.recallMessage'),
    },
    group: {
        loadList: noPromiseDelegate('im.group.loadList'),
        loadItem: noPromiseDelegate('im.group.loadItem'),
        createOne: noPromiseDelegate('im.group.createOne'),
        destroyOne: noPromiseDelegate('im.group.destroyOne'),
        quitOne: noPromiseDelegate('im.group.quitOne'),
        addMembers: noPromiseDelegate('im.group.addMembers'),
        removeMembers: noPromiseDelegate('im.group.removeMembers'),
        changeName: noPromiseDelegate('im.group.changeName'),
        changeAvatar: noPromiseDelegate('im.group.changeAvatar'),
        changeAllowInvites: noPromiseDelegate('im.group.changeAllowInvites'),
        changeOwner: noPromiseDelegate('im.group.changeOwner'),
    },
};
const func: Delegate.FuncPart = {
    pushToLocationChoosePage: noDataDelegate('func.pushToLocationChoosePage'),
    pushToUserDetailPage: noDataDelegate('func.pushToUserDetailPage'),
    fitUrlForAvatarSize: noDataDelegate('func.fitUrlForAvatarSize'),
    getDefaultUserHeadImage: noDataDelegate('func.getDefaultUserHeadImage'),
};
const style: Delegate.StylePart = {
    viewBackgroundColor: 'white',
    separatorLineColor: 'gray',
};
const config: Delegate.ConfigPart = {
    pinyinField: 'pinyin',
    titleLoading: '加载中',
    buttonOK: '确定',
    messageType: {
        text: -1,
        voice: -1,
        system: -1,
    },
};

export default {
    page,
    render,
    component,
    model,
    contact,
    user,
    im,
    func,
    style,
    config,
};
