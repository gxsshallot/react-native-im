import * as React from 'react';
import { Image, Keyboard, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, EmitterSubscription, TextStyle, NativeSyntheticEvent, TextInputSelectionChangeEventData, TextInputKeyPressEventData, KeyboardEvent } from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import Toast from 'react-native-root-toast';
import { getSafeAreaInset } from 'react-native-pure-navigation-bar';
import i18n from 'i18n-js';
import { Component, Contact, Message } from '../typings';
import * as Constant from '../constant';
import * as PageKeys from '../pagekey';
import delegate from '../delegate';

export type Props = Component.BottomBarProps;

export interface State {
    message: string;
    keyboardHeight: number;
    showEmojiView: boolean;
    showMoreBoard: boolean;
    showSpeech: boolean;
    isRecording: boolean;
}

export default class extends React.PureComponent<Props, State> {
    static defaultProps = {};

    protected readonly isIos = Platform.OS === 'ios';
    protected selectedEmojiArr: string[] = [];
    protected atMemberList: Contact.User[] = [];
    protected textLocation = 0;
    protected listenKeyboardShow: EmitterSubscription | void = undefined;
    protected listenKeyboardHide: EmitterSubscription | void = undefined;
    protected textInput: TextInput | null = null;
    
    state = {
        message: '',
        keyboardHeight: 0,
        showEmojiView: false,
        showMoreBoard: false,
        showSpeech: false,
        isRecording: false,
    };

    componentDidMount() {
        this.listenKeyboardShow = Keyboard.addListener('keyboardWillShow', this._keyboardShow.bind(this));
        this.listenKeyboardHide = Keyboard.addListener('keyboardWillHide', this._keyboardHide.bind(this));
    }

    componentWillUnmount() {
        this.listenKeyboardShow && this.listenKeyboardShow.remove();
        this.listenKeyboardHide && this.listenKeyboardHide.remove();
    }

    render() {
        return (
            <SafeAreaView style={styles.safeview}>
                <View style={styles.container}>
                    {this._renderLeftBtn()}
                    {this._renderInputView()}
                    {this._renderRightBtn()}
                </View>
                {this._renderBottomView()}
            </SafeAreaView>
        );
    }

    public dismiss() {
        Keyboard.dismiss();
        this.setState({
            showMoreBoard: false,
            showEmojiView: false,
        });
    }

    public changeInputText(imId: string, text: string) {
        const user = delegate.user.getUser(imId);
        const newText = '@' + user.name + ' : "' + text + '"\n' + '-----\n' + delegate.user.getMine().name + ': ';
        this.setState({
            message: newText,
        });
        this.atMemberList.push(user);
        this.textInput && this.textInput.focus();
    }

    protected _renderLeftBtn() {
        const icon = this.state.showSpeech ?
            require('./image/chat_keyboard.png') :
            require('./image/chat_sound.png');
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={this._onSwitchSpeechKeyboard.bind(this)}
            >
                <Image style={styles.icon} source={icon} />
            </TouchableOpacity>
        );
    }

    protected _renderInputView() {
        return (
            <View style={styles.inputBorder}>
                {!this.state.showSpeech ? (
                    <TextInput
                        ref={ref => this.textInput = ref}
                        multiline={true}
                        style={styles.input}
                        value={this.state.message}
                        onSelectionChange={this._onSelectionChange.bind(this)}
                        onChangeText={this._onChangeText.bind(this)}
                        onFocus={this._onFocus.bind(this)}
                        onKeyPress={this._onKeyPress.bind(this)}
                        underlineColorAndroid={'transparent'}
                        autoCorrect={false}
                    />
                ) : (
                    <TouchableHighlight
                        underlayColor={'#d7d8d8'}
                        onPressIn={this._onStartRecording.bind(this)}
                        onPressOut={this._onEndRecording.bind(this)}
                    >
                        <View style={styles.sound}>
                            <Text style={styles.soundText}>
                                {this.state.isRecording ? i18n.t('IMComponentBottomBarVoiceRelease') : i18n.t('IMComponentBottomBarVoicePress')}
                            </Text>
                        </View>
                    </TouchableHighlight>
                )}
            </View>
        );
    }

    protected _renderRightBtn() {
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
                    onPress={this._onSwitchEmojiKeyboard.bind(this)}
                >
                    <Image style={styles.emoji} source={firstIcon} />
                </TouchableOpacity>
                {isEmpty ? (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._onSwitchMoreKeyboard.bind(this)}
                    >
                        <Image style={styles.add} source={secondIcon} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._onSendMessageText.bind(this)}
                        style={styles.sendtouch}
                    >
                        <View style={styles.sendView}>
                            <Text style={styles.sendText}>
                                {i18n.t('IMCommonSend')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    protected _renderBottomView() {
        if (this.state.showEmojiView) {
            return (
                <delegate.component.EmojiPickView
                    height={240}
                    onPickEmoji={this._onPickEmoji.bind(this)}
                />
            );
        } else if (this.state.showMoreBoard) {
            return <delegate.component.MoreBoard {...this.props} />;
        } else {
            return <View style={{height: this.state.keyboardHeight}} />;
        }
    }

    protected _onSendMessageText() {
        let atMemberList: Message.AtList;
        const all = this.atMemberList.filter(item => item.imId === Message.AtAll);
        if (all.length > 0) {
            atMemberList = Message.AtAll;
        } else {
            const memberMap = this.atMemberList
                .reduce((prv: {[key: string]: Contact.User}, cur: Contact.User) => {
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
        this.setState({message: ''});
        this.atMemberList = [];
    }

    protected _onStartRecording() {
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
    }

    protected _onEndRecording() {
        this.setState({isRecording: false});
        const {onSendMessage} = this.props;
        SoundRecorder.stop()
            .then((result) => {
                console.log('stopped recording, audio file saved at: ' + result.path);
                const time = Math.floor(result.duration / 1000);
                if (time < 1) {
                    Toast.show(i18n.t('IMComponentBottomBarVoiceTooShort'));
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
    }

    protected _onPickEmoji(text: string, isDelete: boolean) {
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
        this.setState({message});
    }

    protected _onChangeText(text: string) {
        const oldText = this.state.message;
        let newText = text;
        const isInput = oldText.length < newText.length;
        if (!isInput) {
            // 'onChangeText' and 'onSelectionChange' sequence is different between iOS and Android
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
        this.setState({message: newText});
    }

    protected _onSelectData(data: string[]) {
        const item = delegate.user.getUser(data[0]);
        const text = this.state.message;
        const newText = text.slice(0, this.textLocation) + item.name + ' ' + text.slice(this.textLocation);
        this.setState({message: newText});
        this.atMemberList.push(item);
        this.textInput && this.textInput.focus();
    }

    protected _onSelectionChange(event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) {
        const {nativeEvent: {selection: {start, end}}} = event;
        if (start === end) {
            this.textLocation = start;
        }
    }

    protected _onKeyPress(event: NativeSyntheticEvent<TextInputKeyPressEventData>) {
        const {nativeEvent: {key}} = event;
        if (key === '@' && this.props.chatType === Constant.ChatType.Group) {
            const members = delegate.model.Group.getMembers(this.props.imId);
            const dataSource = members
                .filter(userId => userId !== delegate.user.getMine().userId)
                .map(userId => delegate.user.getUser(userId));
            this.props.navigation.navigate({
                routeName: PageKeys.ChooseUser,
                params: {
                    title: i18n.t('IMComponentBottomBarChooseAtPerson'),
                    multiple: false,
                    onSelectData: this._onSelectData.bind(this),
                    selectedIds: [],
                    dataSource: dataSource,
                },
            });
        }
    }

    protected _onFocus() {
        this.setState({
            showMoreBoard: false,
            showSpeech: false,
            showEmojiView: false,
        });
    }

    protected _onSwitchEmojiKeyboard() {
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
    }

    protected _onSwitchMoreKeyboard() {
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
    }

    protected _onSwitchSpeechKeyboard() {
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
                        Toast.show(i18n.t('IMCommonNoRecordAuthority'));
                    }
                });
        }
    }

    protected _keyboardShow(event: KeyboardEvent) {
        const offset = getSafeAreaInset().bottom;
        this.setState({
            keyboardHeight: event.endCoordinates.height - offset,
        });
    }

    protected _keyboardHide() {
        this.setState({
            keyboardHeight: 0,
        });
    }
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
            ios: {lineHeight: 20},
            android: {textAlignVertical: 'center'}
        }),
        height: 40,
        marginHorizontal: 5,
    } as TextStyle,
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