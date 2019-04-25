import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Conversation from './Conversation';

export interface Refresh {
    apiRefresh?: (status: boolean) => void;
}

export type Conversation = Conversation.Base;