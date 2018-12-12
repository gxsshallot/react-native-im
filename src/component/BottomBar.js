import React from 'react';
import { Image, Keyboard, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import SoundRecorder from 'react-native-sound-recorder';
import Toast from 'react-native-root-toast';
import { getSafeAreaInset, forceInset } from 'react-native-pure-navigation-bar';
import * as Types from '../proptype';
import * as Constant from '../constant';
import * as PageKeys from '../pagekey';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        ...Types.BasicConversation,
        ...Types.Navigation,
        onSendMessage: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.isIos = Platform.OS === 'ios';
        this.selectedEmojiArr = [];
        this.atMemberList = [];
        this.textLocation = 0;
        this.state = {
            message: '',
            keyboardHeight: 0,
            showEmojiView: false,
            showMoreBoard: false,
            showSpeech: false,
            isRecording: false,
        };
    }

    componentDidMount() {
        this.show = Keyboard.addListener('keyboardWillShow', this._keyboardShow);
        this.hide = Keyboard.addListener('keyboardWillHide', this._keyboardHide);
    }

    componentWillUnmount() {
        this.show && this.show.remove();
        this.hide && this.hide.remove();
    }

    render() {
        return (
            <SafeAreaView style={styles.safeview} forceInset={forceInset(0, 1, 1, 1)}>
                <View style={styles.container}>
                    {this._renderLeftBtn()}
                    {this._renderInputView()}
                    {this._renderRightBtn()}
                </View>
                {this._renderBottomView()}
            </SafeAreaView>
        );
    }

    _renderLeftBtn = () => {
        const icon = this.state.showSpeech ?
            require('./image/chat_keyboard.png') :
            require('./image/chat_sound.png');
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={this._onSwitchSpeechKeyboard}
            >
                <Image style={styles.icon} source={icon} />
            </TouchableOpacity>
        );
    };

    _renderInputView = () => {
        return (
            <View style={styles.inputBorder} minHeight={36}>
                {!this.state.showSpeech ? (
                    <TextInput
                        ref={ref => this.textInput = ref}
                        multiline={true}
                        style={styles.input}
                        value={this.state.message}
                        onSelectionChange={this._onSelectionChange}
                        onChangeText={this._onChangeText}
                        onFocus={this._onFocus}
                        onKeyPress={this._onKeyPress}
                    />
                ) : (
                    <TouchableHighlight
                        underlayColor={'#d7d8d8'}
                        onPressIn={this._onStartRecording}
                        onPressOut={this._onEndRecording}
                    >
                        <View style={styles.sound}>
                            <Text style={styles.soundText}>
                                {this.state.isRecording ? '松开 结束' : '按住 说话'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                )}
            </View>
        );
    };

    _renderRightBtn = () => {
        const firstIcon = this.state.showEmojiView ?
            require('./image/chat_keyboard.png') :
            require('./image/chat_emoji.png');
        const secondIcon = this.state.showMoreBoard ?
            require('./image/chat_keyboard.png') :
            require('./image/chat_add.png');
        const isEmpty = !this.state.message || this.state.message.length === 0;
        return (
            <View style={styles.left}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this._onSwitchEmojiKeyboard}
                >
                    <Image style={styles.emoji} source={firstIcon} />
                </TouchableOpacity>
                {isEmpty ? (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._onSwitchMoreKeyboard}
                    >
                        <Image style={styles.add} source={secondIcon} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._onSendMessageText}
                        style={styles.sendtouch}
                    >
                        <View style={styles.sendView}>
                            <Text style={styles.sendText}>
                                {'发送'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    _renderBottomView = () => {
        if (this.state.showEmojiView) {
            return (
                <delegate.component.EmojiPickView
                    style={{height: 240}}
                    onPickEmoji={this._onPickEmoji}
                />
            );
        } else if (this.state.showMoreBoard) {
            return <delegate.component.MoreBoard {...this.props} />;
        } else {
            return <View style={{height: this.state.keyboardHeight}} />;
        }
    };

    _onSendMessageText = () => {
        let atMemberList;
        const all = this.atMemberList.filter(item => item.imId === Constant.atAll);
        if (all.length > 0) {
            atMemberList = Constant.atAll;
        } else {
            const memberMap = this.atMemberList
                .reduce((prv, cur) => {
                    if (!prv[cur.userId]) {
                        prv[cur.userId] = cur;
                    }
                    return prv;
                }, {});
            atMemberList = Object.values(memberMap);
        }
        const message = {
            type: delegate.config.messageType.text,
            body: {
                text: this.state.message,
                atMemberList: atMemberList,
            },
        };
        this.props.onSendMessage(message);
        this.setState({
            message: '',
        });
        // 如果有发送失败逻辑,需要在收到消息的时候清空
        this.atMemberList = [];
    };

    _onStartRecording = () => {
        this.setState({isRecording: true});
        const option = !this.isIos ? {
            format: SoundRecorder.FORMAT_AAC_ADTS,
            encoder: SoundRecorder.ENCODER_AAC
        } : {};
        const time = new Date().getTime();
        const filepath = SoundRecorder.PATH_CACHE + '/test_' + time + '.aac';
        SoundRecorder.start(filepath, option)
            .then(() => {
                console.log('started recording');
            });
    };

    _onEndRecording = () => {
        this.setState({isRecording: false});
        const {onSendMessage} = this.props;
        SoundRecorder.stop()
            .then((result) => {
                console.log('stopped recording, audio file saved at: ' + result.path);
                const time = parseInt(result.duration / 1000);
                if (time < 1) {
                    Toast.show('录音时间太短');
                    return;
                }
                const message = {
                    type: delegate.config.messageType.voice,
                    body: {
                        duration: result.duration,
                        localPath: result.path,
                    },
                };
                onSendMessage(message);
            });
    };

    _onPickEmoji = (text, isDelete) => {
        let message;
        if (isDelete) {
            const str = this.state.message;
            const lastCharacter = str.substring(str.length - 1);
            if (lastCharacter === ']') {
                const sIndex = str.lastIndexOf('[');
                const emojiText = str.substring(sIndex, str.length);
                if (this.selectedEmojiArr.indexOf(emojiText) !== -1) {
                    message = str.substring(0, sIndex);
                } else {
                    message = str.substring(0, str.length - 1);
                }
            } else {
                message = str.substring(0, str.length - 1);
            }
        } else {
            this.selectedEmojiArr.push(text);
            message = this.state.message + text;
        }
        this.setState({
            message: message,
        });
    };

    _onChangeText = (text) => {
        const oldText = this.state.message;
        let newText = text;
        const isInput = oldText.length < newText.length;
        if (!isInput) {
            // Android上 onChangeText和onSelectionChange方法的调用顺序与iOS不同
            const textLocation = this.isIos ? this.textLocation : this.textLocation - 1;
            const lastChar = oldText.charAt(textLocation);
            if (lastChar === ' ') {
                const leftStr = oldText.slice(0, textLocation);
                const atIndex = leftStr.lastIndexOf('@');
                if (atIndex !== -1) {
                    const targetStr = leftStr.slice(atIndex + 1, textLocation);
                    const memberIndex = this.atMemberList.map(item => item.name).indexOf(targetStr);
                    if (memberIndex !== -1) {
                        const rightStr = oldText.slice(textLocation);
                        newText = oldText.slice(0, atIndex) + rightStr;
                        delete this.atMemberList[memberIndex];
                    }
                }
            }
        }
        this.setState({
            message: newText,
        });
    };

    _onSelectData = (data) => {
        const text = this.state.message;
        const newText = text.slice(0, this.textLocation) + data[0].name + ' ' + text.slice(this.textLocation);
        this.setState({
            message: newText,
        });
        this.atMemberList.push(data[0]);
        this.textInput.focus();
    };

    _onSelectionChange = (event) => {
        const {nativeEvent: {selection: {start, end}}} = event;
        if (start === end) {
            this.textLocation = start;
        }
    };

    _onKeyPress = (event) => {
        const {nativeEvent: {key}} = event;
        if (key === '@' && this.props.isGroup) {
            const members = delegate.model.Group.getMembers(props.imId);
            const dataSource = members
                .filter(userId => userId !== delegate.user.getMine().userId)
                .map(userId => delegate.user.getUser(userId));
            this.props.navigation.navigate({
                routeName: PageKeys.ChooseUser,
                params: {
                    title: '选择@的人',
                    multiple: false,
                    onSelectData: this._onSelectData,
                    selectedIds: [],
                    dataSource: dataSource,
                },
            });
        }
    };

    _onFocus = () => {
        this.setState({
            showMoreBoard: false,
            showSpeech: false,
            showEmojiView: false,
        });
    };

    _onSwitchEmojiKeyboard = () => {
        if (!this.state.showEmojiView) {
            Keyboard.dismiss();
        } else {
            this.textInput && this.textInput.focus();
        }
        this.setState({
            showEmojiView: !this.state.showEmojiView,
            showSpeech: false,
            showMoreBoard: false,
        });
    };

    _onSwitchMoreKeyboard = () => {
        if (!this.state.showMoreBoard) {
            Keyboard.dismiss();
        } else {
            this.textInput && this.textInput.focus();
        }
        this.setState({
            showMoreBoard: !this.state.showMoreBoard,
            showSpeech: false,
            showEmojiView: false,
        });
    };

    _onSwitchSpeechKeyboard = () => {
        if (!this.state.showSpeech) {
            Keyboard.dismiss();
        }
        if (this.isIos) {
            this.setState({
                showSpeech: !this.state.showSpeech,
                showEmojiView: false,
                showMoreBoard: false,
            });
        } else {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
                .then(granted => granted ? PermissionsAndroid.RESULTS.GRANTED :
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO))
                .then(granted => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.setState({
                            showSpeech: !this.state.showSpeech,
                            showEmojiView: false,
                            showMoreBoard: false,
                        });
                    } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                        // do nothing
                    } else {
                        Toast.show('您未设置录音权限，请去设置中打开');
                    }
                });
        }
    };

    _keyboardShow = (e) => {
        const offset = getSafeAreaInset().bottom;
        this.setState({
            keyboardHeight: e.endCoordinates.height - offset,
        });
    };

    _keyboardHide = () => {
        this.setState({
            keyboardHeight: 0,
        });
    };

    changeInputText = (imId, text) => {
        const user = Model.organization.alluser.findByImId(imId);
        const newText = '@' + user.name + ' : "' + text + '"\n' + '-----\n' + Model.userinfo.part.name() + ': ';
        this.setState({
            message: newText,
        });
        this.atMemberList.push(user);
        this.textInput.focus();
    };
}

const styles = StyleSheet.create({
    safeview: {
        flex: 0,
        backgroundColor: '#f5f5f6',
        borderTopColor: '#dddddd',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        maxHeight: 150,
    },
    inputBorder: {
        flex: 1,
        marginVertical: 7,
        backgroundColor: '#fcfcfc',
        overflow: 'hidden',
        alignSelf: 'center',
        borderColor: '#d7d8d8',
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
    },
    input: {
        fontSize: 16,
        ...Platform.select({
            ios: {lineHeight: 16},
            android: {textAlignVertical: 'center'}
        }),
        height: 40,
        marginHorizontal: 5,
    },
    icon: {
        width: 28,
        height: 28,
        marginHorizontal: 10,
        marginVertical: 11,
    },
    emoji: {
        width: 28,
        height: 28,
        marginLeft: 10,
        marginVertical: 11,
    },
    add: {
        width: 28,
        height: 28,
        marginHorizontal: 10,
        marginVertical: 11,
    },
    left: {
        flexDirection: 'row',
    },
    sendtouch: {
        paddingVertical: 7,
        paddingHorizontal: 10,
    },
    sendView: {
        height: 36,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        backgroundColor: '#fc3b39',
        borderRadius: 4,
        overflow: 'hidden',
    },
    sendText: {
        fontSize: 16,
        color: 'white',
    },
    sound: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    soundText: {
        fontSize: 16,
    },
});