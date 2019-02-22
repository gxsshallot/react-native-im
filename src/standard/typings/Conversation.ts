import * as Message from './Message';

/**
 * Chat type of conversation.
 */
export enum ChatType {
    Single = 0,
    Group = 1,
}

/**
 * Base props of one conversation.
 */
export interface Base {
    imId: string;
    chatType: ChatType;
}

/**
 * Conversation config.
 */
export interface Config {
    showMembersName: boolean;
    top: boolean;
    avoid: boolean;
}

/**
 * Conversation update params.
 */
export interface ConfigUpdate {
    showMembersName?: boolean;
    top?: boolean;
    avoid?: boolean;
}

/**
 * Conversation item with a converted latest message.
 */
export interface Item extends Base {
    unreadMessagesCount: number;
    config: Config;
    atMe: boolean;
    latestMessage?: Message.General;
}

/**
 * Conversation item with an origin message.
 */
export interface Origin extends Base {
    unreadMessagesCount?: number;
    config?: Config;
    atMe?: boolean;
    latestMessage?: Message.Origin;
}