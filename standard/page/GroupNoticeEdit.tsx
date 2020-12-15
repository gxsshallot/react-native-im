import React from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import NaviBar, {getSafeAreaInset} from '@hecom/react-native-pure-navigation-bar';
import {Delegate} from "react-native-im/standard/index";
import Toast from "react-native-root-toast";
import i18n from 'i18n-js';
import Navigation from "@hecom/navigation/src/index";

export default class extends React.PureComponent {
    private keyboardDidShowListener: any;
    private keyboardDidHideListener: any;

    static propTypes = {
        groupId: PropTypes.string.isRequired,
        groupNotice: PropTypes.string.isRequired,
        canEdit: PropTypes.bool,
        onDataChange: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    state = {
        keyBoardHeight: 0,
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow(e) {
        this.setState({
            keyBoardHeight: e.endCoordinates.height
        });
    }
    _keyboardDidHide() {
        this.setState({
            keyBoardHeight: 0
        });
    }

    render() {
        const {canEdit, groupNotice} = this.props;
        const rights = {};
        if (canEdit) {
            rights.rightElement = '保存';
            rights.onRight = this._onRight;
            // rights.ab
        }
        const safeArea = getSafeAreaInset();
        const marginStyle = {marginBottom: Math.max(this.state.keyBoardHeight, 10) + safeArea.bottom};
        return (
            <View style={styles.container}>
                <NaviBar title={'群公告'} {...rights} autoCloseKeyboard={true}/>
                {canEdit ? (
                    <TextInput
                        style={[styles.input, marginStyle]}
                        defaultValue={groupNotice}
                        multiline={true}
                        placeholder='请输入群公告内容'
                        onChangeText={(text) => this.setState({text})}
                        autoFocus={canEdit}
                    />
                ) : (
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
                        <Text style={[styles.contentText]}>{groupNotice}</Text>
                    </ScrollView>
                )}

            </View>
        );
    }

    _onRight = () => {
        const {groupId, onDataChange} = this.props;
        let notice = this.state.text;
        if (!notice) {
            notice = ''
        }
        this.props.apiRefresh(true);
        Delegate.model.Group.changeNotice(groupId, notice)
            .then(() => {
                this.props.apiRefresh(false);
                onDataChange();
                Toast.show('保存成功');
                Navigation.pop();
            })
            .catch(() => {
                this.props.apiRefresh(false);
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMSettingGroupNoticeChange'),
                }));
            });
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        flex: 1,
        fontSize: 14,
        marginTop: 10,
        marginHorizontal: 12,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    contentText: {
        fontSize: 14,
        color: '#aaaaaa',
        marginHorizontal: 12,
        marginBottom: 10,
        marginTop: 10,
    },
});
