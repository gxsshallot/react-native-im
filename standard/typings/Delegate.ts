import React from 'react';
import * as Component from './Component';
import * as Conversation from './Conversation';
import * as Group from './Group';
import * as Message from './Message';

export interface PagePart {
}

export interface ComponentPart {
    AvatarImage: React.ComponentClass<Component.AvatarImageProps>;
    AvatarList: React.ComponentClass<Component.AvatarListProps>;
    BaseMessage: React.ComponentClass<Component.BaseMessageProps>;
    MessageBubble: React.ComponentClass<Component.MessageBubbleProps>;
    MessageMenu: React.ComponentClass<Component.MessageMenuProps>;
    SettingItem: React.ComponentClass<Component.SettingItemProps>;
}

export interface ConversationModelPart {
    name: string;
    defaultConfig: Conversation.Config;
    init: (forceUpdate: boolean) => Promise<void>;
    uninit: (forceClear: boolean) => Promise<void>;
    load: () => Promise<void>;
    loadItem: (imId: string, chatType: Conversation.ChatType) => Promise<Conversation.Item>;
    isValid: (imId: string, chatType: Conversation.ChatType) => boolean;
    get: () => Conversation.Item[];
    getOne: (imId: string, enableExport?: boolean) => Conversation.Item | void;
    getConfig: (imId: string) => Conversation.Config;
    getName: (imId: string) => string | void;
    updateConfig: (imId: string, chatType: Conversation.ChatType, config: Conversation.ConfigUpdate) => Promise<void>;
    updateMessage: (imId: string, message: Message.General) => Promise<void>;
    deleteOne: (imId: string) => Promise<void>;
    createOne: (memberUserIds: string | string[]) => Promise<Conversation.Item>;
    markReadStatus: (imId: string, chatType: Conversation.ChatType, status: boolean) => Promise<void>;
}

export interface GroupModelPart {
    name: string;
    init: (forceUpdate: boolean) => Promise<void>;
    uninit: (forceClear: boolean) => Promise<void>;
    load: () => Promise<void>;
    loadItem: (groupId: string) => Promise<void>;
    get: () => Group.Item[];
    findByGroupId: (groupId: string, enableExport?: boolean) => Group.Item | void;
    getOwner: (groupId: string) => string;
    getMembers: (groupId: string, hasOwner?: boolean) => string[];
    getName: (groupId: string, autoConj?: boolean) => string | void;
    getAvatar: (groupId: string) => string | void;
    getAllowInvites: (groupId: string) => boolean;
    createOne: (memberUserIds: string[]) => Promise<Group.Item>;
    destroyOne: (groupId: string) => Promise<void>;
    quitOne: (groupId: string) => Promise<void>;
    addMembers: (groupId: string, memberUserIds: string[]) => Promise<string[]>;
    removeMembers: (groupId: string, memberUserIds: string[]) => Promise<string[]>;
    changeName: (groupId: string, newName: string) => Promise<string>;
    changeAvatar: (groupId: string, newAvatarUrl: string) => Promise<string>;
    changeAllowInvites: (groupId: string, allowInvites: boolean) => Promise<boolean>;
    changeOwner: (groupId: string, newOwnerId: string) => Promise<{owner: string; members: string[]}>;
}

export interface ModelPart {
    Conversation: ConversationModelPart;
    Group: GroupModelPart;
}

export interface FuncPart {
    // pushToLocationViewPage: unset('func.pushToLocationViewPage'),
    pushToLocationChoosePage: (params: {
        onChange: (data: Message.LocationBody) => void;
    }) => void;
    // uploadImages: unset('func.uploadImages'),
}

export interface ConfigPart {
    pinyinField: string;
    titleLoading: string;
    buttonOK: string;
    messageType: {
        text: number;
        voice: number;
        system: number;
    };
}