import * as MessageTypes from './Message';

export enum ChatType {
    Single = 0,
    Group = 1,
}

export interface BasicItem {
    imId: string;
    chatType: ChatType;
}

export interface Config {
    showMembersName: boolean;
    top: boolean;
    avoid: boolean;
}

export interface ConfigUpdate {
    showMembersName?: boolean;
    top?: boolean;
    avoid?: boolean;
}

export interface Item extends BasicItem {
    unreadMessagesCount: number;
    config: Config;
    atMe: boolean;
    latestMessage?: MessageTypes.General;
}

export type List = Item[];

export interface OriginItem extends BasicItem {
    unreadMessagesCount?: number;
    config?: Config;
    atMe?: boolean;
    latestMessage?: MessageTypes.Origin;
}