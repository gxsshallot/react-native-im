import { NavigationContainerRef } from '@react-navigation/native';
import * as Conversation from './Conversation';

export interface Navigation {
    navigation: NavigationContainerRef;
}

export interface Refresh {
    apiRefresh?: (status: boolean) => void;
}

export type Conversation = Conversation.Base;