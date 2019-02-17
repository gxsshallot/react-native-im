import { StyleProp, ViewStyle } from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Conversation from './Conversation';
import * as Message from './Message';

export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationRoute>;
}

export interface RefreshProps {
    apiRefresh?: (status: boolean) => void;
}

export type ConversationProps = Conversation.BasicItem;

export interface AvatarImageProps extends ConversationProps {
    style?: StyleProp<ViewStyle>;
}

export interface AvatarListProps extends NavigationProps {
    owner: string;
    data: string[];
    canAdd: boolean;
    canRemove: boolean;
    onAddMembers: (newMemberUserIds: string[]) => void;
    onRemoveMembers: (deletedMemberUserIds: string[]) => void;
}

export interface ShowMenuRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ShowMenuParams {
    rect: ShowMenuRect;
    isSender: boolean;
    message: Message.General;
}

export interface BaseMessageProps extends ConversationProps {
    position: number;
    message: Message.General;
    onShowMenu: (params: ShowMenuParams) => void;
}

export interface SendMessageParams<T = any> {
    type: number;
    body: T;
}

export interface BottomBarProps extends NavigationProps, ConversationProps {
    onSendMessage: (message: SendMessageParams) => void;
}

export interface MessageBubbleProps {
    isSender: boolean;
    message: Message.General;
    onShowMenu: (params: ShowMenuParams) => void;
}

export interface MenuAction {
    title: string;
    action: () => void;
}

export interface MessageMenuProps {
    menuShow: boolean;
    menuRect: ShowMenuRect;
    actionList: MenuAction[];
    onClose: () => void;
}