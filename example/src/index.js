import React from 'react';
import { View, Alert } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Client } from 'react-native-im-easemob';
import { IMStandard, IMPlugin } from 'react-native-im';
import * as Constant from './Constant';
import PageKeys from './PageKeys';
import Home from './Home';
import setI18nConfig from './i18n';

export default function () {
    return App;
}

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        setI18nConfig();
        this.state = {
            app: null,
        };
    }

    componentDidMount() {
        IMStandard.setup_common_model();
        IMStandard.setup_common_component();
        IMStandard.setup_common_page();
        const page = IMStandard.Delegate.page;
        const scenes = Object.keys(page).reduce((prv, cur) => {
            prv[cur] = {screen: page[cur]};
            return prv;
        }, {});
        const AppNavigator = createStackNavigator({
            [PageKeys.Home]: {
                screen: Home,
            },
            ...scenes,
        }, {
            initialRouteName: PageKeys.Home,
        });
        const app = createAppContainer(AppNavigator);
        const {plugin} = this.props;
        if (plugin === 'easemob') {
            IMPlugin.Easemob.setup();
            Client.initWithAppKey(Constant.AppKey)
                .then(() => this.setState({app}))
                .catch(() => Alert.alert('Error', 'Initialize Easemob SDK is failed.'));
        }
    }

    render() {
        const AppContainer = this.state.app;
        return AppContainer ? <AppContainer /> : <View />;
    }
}