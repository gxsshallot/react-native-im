import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Client } from 'react-native-im-easemob';
import { IMStandard } from 'react-native-im';
import * as Constant from './Constant';

export default class extends React.PureComponent {
    static navigationOptions = {
        title: '首页',
    };

    componentDidMount() {
        if (Constant.Account && Constant.Password) {
            IMStandard.Delegate.user.getMine = () => ({userId: Constant.Account});
            Client.login(Constant.Account, Constant.Password)
                .then(() => IMStandard.login(true));
        }
    }

    render() {
        return (
            <View style={styles.view}>
                <TouchableOpacity onPress={this._loginSucceed}>
                    <Text>
                        {'Login'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    _loginSucceed = () => {
        this.props.navigation.navigate(IMStandard.PageKeys.ChatList);
    };
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});