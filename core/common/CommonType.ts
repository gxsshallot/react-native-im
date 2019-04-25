import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

export interface Page {
    navigation: NavigationScreenProp<NavigationRoute>;
}