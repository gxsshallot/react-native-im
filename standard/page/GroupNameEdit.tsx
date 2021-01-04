import React from 'react';
import {Keyboard, Platform, Image ,StyleSheet, Text, TextInput, Dimensions, View} from 'react-native';
import PropTypes from 'prop-types';
import NaviBar, {getSafeAreaInset} from '@hecom/react-native-pure-navigation-bar';
import {Delegate} from "react-native-im/standard/index";
import Toast from "react-native-root-toast";
import i18n from 'i18n-js';
import Navigation from "@hecom/navigation/src/index";
import delegate from "react-native-im/standard/delegate";

const { width, height } = Dimensions.get('window');

export default class extends React.PureComponent {
    private keyboardDidShowListener: any;
    private keyboardDidHideListener: any;
    private isDisable = true

    static propTypes = {
        groupId: PropTypes.string.isRequired,
        groupName: PropTypes.string.isRequired,
        onDataChange: PropTypes.func.isRequired,
    };

    state = {
        keyBoardHeight: 0,
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        }
    }
    componentWillUnmount() {
        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }
    protected _keyboardDidShow(e) {
        if (Platform.OS === 'ios') {
            this.setState({
                keyBoardHeight: e.endCoordinates.height
            });
        }
    }
    protected _keyboardDidHide() {
        if (Platform.OS === 'ios') {
            this.setState({
                keyBoardHeight: 0
            });
        }
    }

    render() {
        const { groupName } = this.props;
        // const rights = {};
        // rights.rightElement = '保存';
        //     if (this.isDisable) {
        //         rights.rightElementDisable = true;
        //     } else {
        //         rights.onRight = this._onRight;
        //     }
        const safeArea = getSafeAreaInset();
        const marginStyle = {marginBottom: Math.max(this.state.keyBoardHeight, 10) + safeArea.bottom};
        return (
            <View style={styles.container}>
                <NaviBar title={''} autoCloseKeyboard={true} hasSeperatorLine={false}/>
                <Text style={styles.titleText}>{'修改群聊名称'}</Text>
                <View style={styles.topLineView} />
                <View style={styles.backView}>
                    {this._renderIcon()}
                    <TextInput
                        style={styles.input}
                        defaultValue={groupName}
                        maxLength={2000}
                        multiline={false}
                        clearButtonMode={'while-editing'}
                        placeholder='请输入群名'
                        onChangeText={(text) => {
                            this.isDisable = false
                            this.setState({text})
                        }}
                        autoFocus={true}
                    />
                </View>
                <View style={styles.bottomLineView} />
                <View style={[styles.buttonView,marginStyle]}>
                        <Text style={styles.button} onPress={() => {
                            if (!this.isDisable) {
                                this._onRight()
                            } else {
                                Navigation.pop();
                            }
                        }}>
                            {'完成'}
                        </Text>
                    </View>
            </View>
        );
    }

    protected _onRight = () => {
        // const {groupId, onDataChange} = this.props;
        let newName = this.state.text;
        if (!newName) {
            newName = ''
        }
        this.props.apiRefresh(true);
    
            if (!newName || newName.length === 0) {
                Toast.show(i18n.t('IMSettingGroupNameNotEmpty'));
                return;
            }
            const {groupId, onDataChange} = this.props;
            Delegate.model.Group.changeName(groupId, newName)
                .then(() => {
                    this.props.apiRefresh(false);
                    onDataChange();
                    Toast.show('保存成功');
                    Navigation.pop();
                })
                .catch(() => {
                    this.props.apiRefresh(false);
                    Toast.show(i18n.t('IMToastError', {
                        action: i18n.t('IMSettingGroupNameChange'),
                    }));
                });
    };

    _renderIcon = () => {
        const {groupAvatar} = this.props;
        const isAvatar = Object.prototype.isPrototypeOf(groupAvatar) && groupAvatar.imId;
        if (isAvatar) {
            return (
                <Delegate.component.AvatarImage
                    {...groupAvatar}
                    style={styles.avatar}
                />
            );
        } else {
            const src = typeof groupAvatar === 'string' ?
                {uri: delegate.func.fitUrlForAvatarSize(groupAvatar, 48)} :
                groupAvatar;
            return <Image style={styles.icon} source={src} />;
        }
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        position: 'absolute',
        height: height,
        width: width,
    },
    backView: {
        top: 108,
        left: 20,
        width: width - 40,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    topLineView: {
        height: 1,
        width: width - 40,
        left: 20,
        top: 100,
        backgroundColor: 'rgba(25,31,37,0.08)',
    },
    bottomLineView: {
        height: 1,
        width: width - 40,
        left: 20,
        top: 115,
        backgroundColor: 'rgba(25,31,37,0.08)',
    },
    input: {
        fontSize: 14,
        justifyContent: 'center',
        marginTop: 10,
        marginHorizontal: 12,
        ...Platform.select({
            android: { textAlignVertical: 'top' },
        }),
        flex: 1,
    },
    avatar: {
        
    },
    icon: {
        height: 48,
        width: 48,
        borderRadius: 24,
        overflow: 'hidden',
    },
    titleText: {
        height: 40,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign:'center',
        top: 60,
        left: 0,
        width: width,
    },
    button: {
        color: 'rgba(24, 144, 255, 1)',
        fontSize: 15,
        textAlign: 'center',
        width: 120,
    },
    buttonView: {
        backgroundColor: 'rgba(25,31,37,0.08)',
        height: 40,
        width: 150,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        top: 150,
        left: (width - 150)/2,
    },
});
