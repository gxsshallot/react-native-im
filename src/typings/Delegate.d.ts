import * as React from 'react';
import { ImageURISource, ImageRequireSource } from 'react-native';
import * as Action from './Action';
import * as Component from './Component';
import * as Contact from './Contact';
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
    get: () => Conversation.List;
    getOne: (imId: string, enableExport?: boolean) => Conversation.Item | void;
    getConfig: (imId: string) => Conversation.Config;
    getName: (imId: string) => string | void;
    updateConfig: (imId: string, config: Conversation.ConfigUpdate) => Promise<void>;
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
    get: () => Group.List;
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

interface ActionSet<S, P, R> {
    register(
        messageType?: number | string,
        specialFunc?: (state: S) => boolean,
        handleFunc?: R | ((params: P) => R),
        priority?: number
    ): string | void;
    unregister(
        messageType?: number | string,
        handleId?: string
    ): boolean;
    match(
        messageType?: number | string,
        state?: S,
        params?: P
    ): R;
}

export interface ActionModelPart {
    Display: ActionSet<
        Action.DisplayState,
        Action.DisplayHandleParams,
        Action.DisplayHandleResult
    >;
    Parse: ActionSet<
        Action.ParseState,
        Action.ParseHandleParams,
        Action.ParseHandleResult
    >;
    Send: ActionSet<
        Action.SendState,
        Action.SendHandleParams,
        Action.SendHandleResult
    >;
    Abstract: ActionSet<
        Action.AbstractState,
        Action.AbstractHandleParams,
        Action.AbstractHandleResult
    >;
    MoreBoard: ActionSet<
        Action.MoreBoardState,
        void,
        Action.MoreBoardHandleResult
    >;
}

export interface ModelPart {
    Action: ActionModelPart;
    Conversation: ConversationModelPart;
    Group: GroupModelPart;
}

export interface ContactPart {
    loadAllUser: (returnValue: boolean) => Promise<Contact.UserList | void>;
    loadAllOrg: (returnValue: boolean) => Promise<Contact.OrgList | void>;
    loadUserOrgTree: (hasSelf: boolean, parentOrgId: string | void, excludedUserIds: string[]) => Promise<Contact.Tree>;
    loadStarUser: () => Promise<Contact.UserList>;
}

export interface UserPart {
    getMine: () => Contact.CurrentUser;
    getUser: (userId: string) => Contact.User;
}

export interface ConversationApiPart {
    loadList: () => Promise<Conversation.BasicItem[]>;
    loadItem: (imId: string, chatType: Conversation.ChatType, autoCreate: boolean) => Promise<Conversation.OriginItem>;
    deleteOne: (imId: string) => Promise<void>;
    updateConfig: (imId: string, config: Conversation.ConfigUpdate) => Promise<Conversation.Config>;
    markAllRead: (imId: string, chatType: Conversation.ChatType) => Promise<void>;
    markLatestUnread: (imId: string, chatType: Conversation.ChatType) => Promise<void>;
    loadMessage: (params: {
        imId: string;
        chatType: Conversation.ChatType;
        lastMessageId: string;
        count: number;
    }) => Promise<Message.OriginList>;
    deleteMessage: (params: {
        imId: string;
        chatType: Conversation.ChatType;
        message: Message.General;
    }) => Promise<void>;
    recallMessage: (params: {
        imId: string;
        chatType: Conversation.ChatType;
        message: Message.General;
    }) => Promise<void>;
}

export interface GroupApiPart {
    loadList: () => Promise<Group.List>;
    loadItem: (groupId: string) => Promise<Group.Item>;
    createOne: (memberUserIds: string[]) => Promise<Group.Item>;
    destroyOne: (groupId: string) => Promise<void>;
    quitOne: (groupId: string) => Promise<void>;
    addMembers: (groupId: string, memberUserIds: string[]) => Promise<void>;
    removeMembers: (groupId: string, memberUserIds: string[]) => Promise<void>;
    changeName: (groupId: string, newName: string) => Promise<void>;
    changeAvatar: (groupId: string, newAvatarUrl: string) => Promise<void>;
    changeAllowInvites: (groupId: string, newAllowInvites: boolean) => Promise<void>;
    changeOwner: (groupId: string, newOwnerId: string) => Promise<void>;
}

export interface ApiPart {
    conversation: ConversationApiPart;
    group: GroupApiPart;
}

export interface FuncPart {
    // pushToLocationViewPage: unset('func.pushToLocationViewPage'),
    pushToLocationChoosePage: (params: {
        onChange: (data: Message.LocationBody) => void;
    }) => void;
    pushToUserDetailPage: (userId: string) => void;
    fitUrlForAvatarSize: (avatar: string, size?: number) => string;
    getDefaultUserHeadImage: (userId?: string) => ImageURISource | ImageRequireSource;
    // uploadImages: unset('func.uploadImages'),
}

export interface StylePart {
    viewBackgroundColor: string;
    separatorLineColor: string;
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