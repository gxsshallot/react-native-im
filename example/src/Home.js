import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Client } from 'react-native-im-easemob';
import { IMStandard } from 'react-native-im';
import i18n from 'i18n-js';
import ArrowImage from '@hecom/image-arrow';
import * as Constant from './Constant';

export default class extends React.PureComponent {
    static navigationOptions = function () {
        return {
            title: i18n.t('HomeTitle'),
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
    }
    
    componentDidMount() {
        if (Constant.Account && Constant.Password) {
            IMStandard.Delegate.user.getMine = () => ({userId: Constant.Account});
            Client.login(Constant.Account, Constant.Password)
                .then(() => IMStandard.login(true));
        }
    }

    render() {
        return (
            <ScrollView style={styles.view}>
                {this._renderLine(i18n.t('Register'), this._register.bind(this))}
                {this._renderLine(i18n.t('Login'), this._login.bind(this))}
            </ScrollView>
        );
    }

    _renderLine(label, onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.line}>
                    <Text style={styles.text}>
                        {label}
                    </Text>
                    <ArrowImage />
                </View>
            </TouchableOpacity>
        );
    }

    _register() {
        // TODO
    }

    _login() {
        this.props.navigation.navigate(IMStandard.PageKeys.ChatList);
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    line: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#dddddd',
    },
    text: {
        fontSize: 16,
        color: '#333333',
    },
});