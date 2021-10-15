import React, {ReactNode} from 'react';
import {ImageRequireSource, ImageURISource} from 'react-native';
import {Props as BadgeProps} from '@hecom/badge';
import * as Component from './Component';
import * as Contact from './Contact';
import * as Conversation from './Conversation';
import * as Group from './Group';
import * as Message from './Message';

export interface PagePart {
    [key: string]: React.ComponentClass
}

export interface renderPart {
    renderBadge: (avoid: boolean, count: number) => ReactNode
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
    updateConfig: (imId: string, chatType: Conversation.ChatType, config: Conversation.ConfigUpdate, localOnly: boolean) => Promise<void>;
    updateMessage: (imId: string, message: Message.General) => Promise<void>;
    deleteOne: (imId: string) => Promise<void>;
    createOne: (memberUserIds: string | string[]) => Promise<Conversation.Item>;
    markReadStatus: (imId: string, chatType: Conversation.ChatType, status: boolean) => Promise<void>;
    recallMessage: (imId: string, message: Message.General) => Promise<void>;
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
    getAnnouncement: (groupId: string) => string;
    getAvatar: (groupId: string) => string | void;
    getAllowInvites: (groupId: string) => boolean;
    createOne: (memberUserIds: string[]) => Promise<Group.Item>;
    destroyOne: (groupId: string) => Promise<void>;
    deleteOne: (groupId: string) => Promise<void>;
    quitOne: (groupId: string) => Promise<void>;
    addMembers: (groupId: string, memberUserIds: string[]) => Promise<string[]>;
    removeMembers: (groupId: string, memberUserIds: string[]) => Promise<string[]>;
    changeName: (groupId: string, newName: string) => Promise<string>;
    changeAnnouncement: (groupId: string, newAnnouncement: string) => Promise<string>;
    changeAvatar: (groupId: string, newAvatarUrl: string) => Promise<string>;
    changeAllowInvites: (groupId: string, allowInvites: boolean) => Promise<boolean>;
    changeOwner: (groupId: string, newOwnerId: string) => Promise<{ owner: string; members: string[] }>;
    showGroupDataRecord: (imId: String) => Promise<void>;
}

export interface MessageModelPart {
    name: string,
    sendMessage: (imId: string, chatType: Conversation.ChatType, message: Message.General, ext: object, isSystem: boolean) => Promise<void>
    sendMultiMessage: (imId: string, chatType: Conversation.ChatType, messages: Array<Message.General>) => Promise<void>
    insertSystemMessage: (imId: string, chatType: Conversation.ChatType, text: string, localTime: number, timestamp: number, innerId?: string) => Promise<void>
}

export interface EmojiModelPart {
    name: string,
    getPartEmojis: (key: string) => any
}

export interface ExternalModelPart {

}

export interface ExternalModelSetting {

}

export interface ModelPart {
    Conversation: ConversationModelPart;
    Group: GroupModelPart;
    Message: MessageModelPart;
    Emoji: EmojiModelPart;
    External: ExternalModelPart;
    Setting: ExternalModelSetting;
}

export interface ContactPart {
    loadAllUser: (returnValue: boolean) => Promise<Contact.User[] | void>;
    loadAllOrg: (returnValue: boolean) => Promise<Contact.Org[] | void>;
    loadUserOrgTree: (hasSelf: boolean, parentOrgId: string | void, excludedUserIds: string[]) => Promise<Contact.Tree>;
    loadStarUser: () => Promise<Contact.User[]>;
}

export interface UserPart {
    getMine: () => Contact.CurrentUser;
    getUser: (userId: string) => Contact.User;
}

export interface ConversationApiPart {
    loadList: () => Promise<Conversation.Base[]>;
    loadItem: (imId: string, chatType: Conversation.ChatType, autoCreate: boolean) => Promise<Conversation.Origin>;
    deleteOne: (imId: string) => Promise<void>;
    updateConfig: (imId: string, config: Conversation.ConfigUpdate) => Promise<Conversation.Config>;
    markAllRead: (imId: string, chatType: Conversation.ChatType) => Promise<void>;
    markLatestUnread: (imId: string, chatType: Conversation.ChatType) => Promise<void>;
    deleteAllMessages: (imId: string, chatType: Conversation.ChatType) => Promise<void>;
    updateMessageExt: (messageId: string, ext: Object) => Promise<void>;
    loadMessage: (params: {
        imId: string;
        chatType: Conversation.ChatType;
        lastMessage: Message.General;
        count: number;
    }) => Promise<Message.Origin[]>;
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
    loadList: () => Promise<Group.Item[]>;
    loadItem: (groupId: string) => Promise<Group.Item>;
    createOne: (memberUserIds: string[]) => Promise<Group.Item>;
    destroyOne: (groupId: string) => Promise<void>;
    quitOne: (groupId: string) => Promise<void>;
    addMembers: (groupId: string, memberUserIds: string[]) => Promise<void>;
    removeMembers: (groupId: string, memberUserIds: string[]) => Promise<void>;
    changeName: (groupId: string, newName: string) => Promise<void>;
    changeAnnouncement: (groupId: string, newAnnouncement: string) => Promise<void>;
    changeAvatar: (groupId: string, newAvatarUrl: string) => Promise<void>;
    changeAllowInvites: (groupId: string, newAllowInvites: boolean) => Promise<void>;
    changeOwner: (groupId: string, newOwnerId: string) => Promise<void>;
    showGroupDataRecord: (imId: String) => Promise<void>;
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
    playVideo: (uri: string) => void;
    getVideoMetaData: (uri: string) => Promise<any>;
    // uploadImages: unset('func.uploadImages'),
}

export interface StylePart {
    viewBackgroundColor: string;
    separatorLineColor: string;
}

export interface PropsPart {
    badgeProps: BadgeProps
}

export interface ConfigPart {
    pinyinField: string;
    titleLoading: string;
    buttonOK: string;
    useStarUser?: boolean;
    messageType: {
        text: number;
        voice: number;
        system: number;
    };
}
