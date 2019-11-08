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
    config?: Config;
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
export type ConfigUpdate = Partial<Config>;

/**
 * Conversation item part with a converted latest message.
 */
export interface ItemPart extends Base {
    unreadMessagesCount: number;
    config: Config;
    atMe: number;
    latestMessage: Message.General | void;
}

/**
 * Conversation item with a converted latest message.
 */
export interface Item extends ItemPart {
}

/**
 * Conversation item with an origin message.
 */
export interface Origin extends Partial<Item> {
}