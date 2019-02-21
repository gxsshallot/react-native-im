import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Conversation from './Conversation';

export interface Navigation {
    navigation: NavigationScreenProp<NavigationRoute>;
}

export interface Refresh {
    apiRefresh?: (status: boolean) => void;
}

export type Conversation = Conversation.Base;