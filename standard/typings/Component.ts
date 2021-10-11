import { StyleProp, ViewStyle, ImageURISource, ImageRequireSource } from 'react-native';
import * as Props from './Props';
import * as Message from './Message';
import {Typings} from '../../standard'

export interface AvatarImageProps extends Props.Conversation {
    style?: StyleProp<ViewStyle>;
}

export interface AvatarListProps extends Props.Navigation {
    owner: string;
    data: string[];
    canAdd: boolean;
    canRemove: boolean;
    tempProps: Typings.Action.Setting.Params;
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

export interface BaseMessageProps extends Props.Navigation, Props.Conversation {
    isSelected: boolean;
    hasCheckBox: boolean;
    position: number;
    showTime: boolean;
    message: Message.General;
    onShowMenu: (params: ShowMenuParams) => void;
    onLongPressAvatar:(params: Message.General) => void;
    changeSelectState:(oriSelectState:boolean, msg: Message.General) => void;
}

export interface SendMessageParams<T = any> {
    type: number;
    body: T;
}

export interface BottomBarProps extends Props.Navigation, Props.Conversation {
    onSendMessage: (message: SendMessageParams) => void;
    batchOptionMode: boolean;
    onBatchForward:()=>void;
}

export interface ConversationCellProps extends Props.Navigation, Props.Conversation {
    separatorLeft: number;
}

export interface MessageBubbleProps extends Props.Navigation, Props.Conversation {
    isSender: boolean;
    message: Message.General;
    onShowMenu: (params: ShowMenuParams) => void;
    touchable: boolean;
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

export enum SettingItemType {
    Image = 0,
    Text,
    Switch,
}

export interface SettingItemProps {
    title: string;
    type: SettingItemType;
    data?: string | ImageURISource | ImageRequireSource | boolean | void;
    onPressLine?: () => void;
    onPressSwitch?: (status: boolean) => void;
}
