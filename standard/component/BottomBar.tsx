import {getSafeAreaInset} from '@hecom/react-native-pure-navigation-bar';
import i18n from 'i18n-js';
import React from 'react';
import {
    EmitterSubscription,
    Image,
    Keyboard,
    KeyboardEvent,
    NativeSyntheticEvent,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TextInputSelectionChangeEventData,
    TextStyle,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Toast from 'react-native-root-toast';
import SoundRecorder from 'react-native-sound-recorder';
import delegate from '../delegate';
import * as PageKeys from '../pagekey';
import {Component, Contact, Conversation, Message} from '../typings';
import {IMConstant} from 'react-native-im-easemob';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export type Props = Component.BottomBarProps;

export interface State {
    message: string;
    keyboardHeight: number;
    showEmojiView: boolean;
    showMoreBoard: boolean;
    showSpeech: boolean;
    isRecording: boolean;
    showQuote: boolean;
    quoteMsg: Message.General | undefined;
}

export default class extends React.PureComponent<Props, State> {
    static defaultProps = {};

    protected readonly isIos = Platform.OS === 'ios';
    protected selectedEmojiArr: string[] = [];
    protected atMemberList: Contact.User[] = [];
    protected textLocation = 0;
    protected listenKeyboardShow: EmitterSubscription | void = null;
    protected listenKeyboardHide: EmitterSubscription | void = null;
    protected textInput: TextInput | null = null;


    state = {
        message: '',
        keyboardHeight: 0,
        showEmojiView: false,
        showMoreBoard: false,
        showSpeech: false,
        isRecording: false,
        showQuote: true,
        quoteMsg: undefined,
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
        const { batchOptionMode, onBatchForward } = this.props;
        return batchOptionMode ? (
            <SafeAreaView style={styles.safeview}>
                <TouchableWithoutFeedback onPress={()=>onBatchForward()}>
                    <View style={styles.container}>
                        <Text style={styles.btnText}>转发</Text>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        ) : (<SafeAreaView style={styles.safeview}>
                <View style={styles.container}>
                    {this._renderLeftBtn()}
                    <View style={styles.msgContainer}>
                        {this._renderInputView()}
                        {this._renderQuoteView()}
                    </View>
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

    public quoteMsg(msg: Message.General) {
        this.setState({
            quoteMsg: msg,
        });
        this.textInput && this.textInput.focus();
    }

    public changeInputText(imId: string, text: string) {
        const user = delegate.user.getUser(imId);
        const newText = '@' + user.name + ' ';
        this.setState({
            message: newText,
        });
        this.atMemberList.push(user);
        this.textInput && this.textInput.focus();
    }

    public insertAtMember(userId: string) {
        const text = this.state.message;
        const newText = text.slice(0, this.textLocation) + '@' + text.slice(this.textLocation);;
        this.setState({ message: newText }, () => {
            this.textLocation++;
            this._onSelectData([userId]);
        });
    }

    protected _renderLeftBtn() {
        const icon = this.state.showSpeech ?
            require('./image/chat_keyboard.png') :
            require('./image/chat_sound.png');
        const touchStyle = {
            marginHorizontal: 4,
        };
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={this._onSwitchSpeechKeyboard.bind(this)}
                style={[styles.leftIconTouch, touchStyle]}
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
    protected _renderQuoteView() {
        if(this.state.showSpeech ){
            return;
        }
        let quoteMsg: Message.General | undefined = this.state.quoteMsg;
        var msgDesc: String = '';
        if (quoteMsg != undefined) {
            switch (quoteMsg.type) {
                case IMConstant.MessageType.text:
                    msgDesc = (quoteMsg as Message.General).data.text;
                    break;
                case IMConstant.MessageType.image:
                    msgDesc='[图片]';
                    break;
                case IMConstant.MessageType.video:
                    msgDesc='[视频]';
                    break;
                case IMConstant.MessageType.location:
                    msgDesc='[位置]';
                    break;
                case IMConstant.MessageType.file:
                    msgDesc='[文件]';
                    break;
                case IMConstant.MessageType.material:
                    msgDesc='[资料]';
                    break;
            }
        }
        return quoteMsg ?
            (<View style={styles.quoteTextBorder}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.quoteText} >
                    {/* {delegate.user.getUser('test__c_v2011_1122225706').name + ':'} */}

                    {delegate.user.getUser((quoteMsg as Message.General).from).name + ':' +msgDesc}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this._onQuoteMsgDel.bind(this)}
                    style={[styles.delIconTouch]}
                >
                    <Image
                        source={require('./image/clear.png')}
                        style={styles.delIcon}
                    />
                </TouchableOpacity>
            </View>)
            : undefined
    }

    protected _renderRightBtn() {
        const firstIcon = this.state.showEmojiView ?
            require('./image/chat_keyboard.png') :
            require('./image/chat_emoji.png');
        const secondIcon = this.state.showMoreBoard ?
            require('./image/chat_keyboard.png') :
            require('./image/chat_add.png');
        const isEmpty = !this.state.message || this.state.message.length === 0;
        const touchStyle = {
            marginHorizontal: 2,
        };
        return (
            <View style={styles.right}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this._onSwitchEmojiKeyboard.bind(this)}
                    style={[styles.iconTouch, touchStyle]}
                >
                    <Image style={styles.icon} source={firstIcon} />
                </TouchableOpacity>
                {isEmpty ? (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._onSwitchMoreKeyboard.bind(this)}
                        style={[styles.iconTouch, touchStyle]}
                    >
                        <Image style={styles.icon} source={secondIcon} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._onSendMessageText.bind(this)}
                        style={styles.sendTouch}
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
            return <View style={{ height: this.state.keyboardHeight }} />;
        }
    }

    protected _onSendMessageText() {
        let atMemberList: Message.AtList = [];
        const all = this.atMemberList.filter(item => item.imId === Message.AtAll);
        if (all.length > 0) {
            atMemberList = Message.AtAll;
        } else {
            const memberMap = this.atMemberList
                .reduce((prv: { [key: string]: Contact.User }, cur: Contact.User) => {
                    if (!prv[cur.userId]) {
                        prv[cur.userId] = cur;
                    }
                    return prv;
                }, {});
            atMemberList = Object.keys(memberMap);
        }
        const message = {
            type: delegate.config.messageType.text,
            body: {
                text: this.state.message,
                atMemberList: atMemberList,
                quoteMsg:this.state.quoteMsg,
            },
        };
        this.props.onSendMessage(message);
        this.setState({ message: '', quoteMsg: undefined });
        this.atMemberList = [];
    }

    protected _onStartRecording() {
        this.setState({ isRecording: true });
        const option = !this.isIos ? {
            format: SoundRecorder.FORMAT_AAC_ADTS,
            encoder: SoundRecorder.ENCODER_AAC
        } : {};
        const time = new Date().getTime();
        const filepath = SoundRecorder.PATH_CACHE + '/test_' + time + '.aac';
        SoundRecorder.start(filepath, option);
    }

    protected _onEndRecording() {
        this.setState({ isRecording: false });
        const { onSendMessage } = this.props;
        SoundRecorder.stop()
            .then((result) => {
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
        let message = '';
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
        this.setState({ message });
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
        this.setState({ message: newText });
    }

    protected _onSelectData(data: string[]) {
        const dataFirst = data[0];
        let item = {};
        if (dataFirst === Message.AtAll) {
            item.imId = Message.AtAll;
            item.name = i18n.t('IMPageChooseUserAll');
        } else {
            item = delegate.user.getUser(data[0]);
        }
        const text = this.state.message;
        const newText = text.slice(0, this.textLocation) + item.name + ' ' + text.slice(this.textLocation);
        this.setState({ message: newText });
        this.atMemberList.push(item);
        this.textInput && this.textInput.focus();
    }

    protected _onSelectionChange(event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) {
        const { nativeEvent: { selection: { start, end } } } = event;
        if (start === end) {
            this.textLocation = start;
        }
    }

    protected _onKeyPress(event: NativeSyntheticEvent<TextInputKeyPressEventData>) {
        const { nativeEvent: { key } } = event;
        if (key === '@' && this.props.chatType === Conversation.ChatType.Group) {
            const members = delegate.model.Group.getMembers(this.props.imId);
            const dataSource = members
                .filter(userId => userId !== delegate.user.getMine().userId)
                .map(userId => delegate.user.getUser(userId));
            const groupOwner = delegate.model.Group.getOwner(this.props.imId);
            const isOwner = groupOwner === delegate.user.getMine().userId;
            this.props.navigation.navigate(PageKeys.ChooseUser, {
                title: i18n.t('IMComponentBottomBarChooseAtPerson'),
                multiple: false,
                onSelectData: this._onSelectData.bind(this),
                selectedIds: [],
                dataSource: dataSource,
                showAtAll: isOwner,
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

    protected _onQuoteMsgDel() {
        this.setState({
            quoteMsg: undefined,
        })
    }

    protected _onSwitchSpeechKeyboard() {
        if (!this.state.showSpeech) {
            Keyboard.dismiss();
        }
        if (this.isIos) {
            check(PERMISSIONS.IOS.MICROPHONE)
                .then(result => result === RESULTS.GRANTED ? RESULTS.GRANTED :
                    request(PERMISSIONS.IOS.MICROPHONE))
                .then(result => {
                    if (result === RESULTS.GRANTED) {
                        this.setState({
                            showSpeech: !this.state.showSpeech,
                            showEmojiView: false,
                            showMoreBoard: false,
                        });
                    } else if (result === RESULTS.DENIED) {
                        // do nothing
                    } else {
                        Toast.show(i18n.t('IMCommonNoRecordAuthority'));
                    }
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
    },
    leftIconTouch: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    iconTouch: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    icon: {
        width: 26,
        height: 26,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    sendTouch: {
        marginRight: 4,
        marginBottom: 12,
    },
    sendView: {
        height: 32,
        width: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#07c160',
        borderRadius: 4,
        overflow: 'hidden',
    },
    sendText: {
        fontSize: 15,
        color: 'white',
    },
    sound: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    soundText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#565656',
    },

    msgContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        flex: 1,
    },
    inputBorder: {
        marginTop: 9,
        marginBottom: 13,
        backgroundColor: '#fcfcfc',
        overflow: 'hidden',
        borderRadius: 4,
    },
    input: {
        fontSize: 16,
        ...Platform.select({
            ios: { lineHeight: 20 },
            android: { textAlignVertical: 'center' }
        }),
        minHeight: 30,
        maxHeight: 120,
        marginHorizontal: 5,
    } as TextStyle,
    quoteTextBorder: {
        flexDirection: "row",
        marginBottom: 13,
        backgroundColor: '#cccccc',
        overflow: 'hidden',
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingEnd: 6,
        height: 30,
    },
    quoteText: {
        flex: 1,
        fontSize: 13,
        ...Platform.select({
            ios: { lineHeight: 20 },
            android: { textAlignVertical: 'center' }
        }),
        marginEnd: 10,
        marginHorizontal: 5,
    } as TextStyle,
    delIconTouch: {
        width: 25,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    delIcon: {
        width: 16,
        height: 16,
    },
    btnText: {
        fontSize:17,
        flex:1,
        color:'black',
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        ...Platform.select({
            ios:{
                lineHeight:40,
            },
            android:{
            }
        }),
        height: 40, // TODO
    },
});