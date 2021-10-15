import React from 'react';
import {
    Alert,
    BackHandler,
    Clipboard,
    Image,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Toast from 'react-native-root-toast';
import Listener from '@hecom/listener';
import i18n from 'i18n-js';
import * as PageKeys from '../pagekey';
import * as Model from '../model';
import {DateUtil, guid} from '../util';
import {Conversation, Event, Message} from '../typings';
import delegate from '../delegate';
import {StackActions} from '@react-navigation/native';
import {IMConstant} from 'react-native-im-easemob';

interface ChatDetailProps {
    imId: string
    chatType: number
}

export default class ChatDetail extends React.PureComponent<ChatDetailProps> {
    static navigationOptions = function({ route }) {
        const { _title_, _right_, _marginHorizontal_, _left_ } = route.params;
        const titleContainerStyle = !!_marginHorizontal_ ? { marginHorizontal: _marginHorizontal_ } : {};
        return {
            headerLeft: _left_,
            title: _title_,
            headerRight: _right_,
            headerTitleContainerStyle: {
                ...titleContainerStyle
            },
        };
    };

    static defaultProps = {};

    selectMessages= Array<Message.General>();
    listeners = new Array(5);
    isGroup: boolean;
    pageCount: number;

    constructor(props: ChatDetailProps) {
        super(props);
        this.isGroup = props.chatType === Conversation.ChatType.Group;
        this.pageCount = delegate.component.DetailListView.defaultProps.pageSize;
        this.state = {
            listKey: guid(),
            messages: [],
            keyboardShow: false,
            menuShow: false,
            menuRef: null,
            actionList: [],
            hasCheckBox: false,
            refresh: false,
        };
    }

    componentDidMount() {
        this._setNaviBar();
        this._registerListener();
    }

    componentWillUnmount() {
        this._unRegisterListener();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.imId !== this.props.imId) {
            this.isGroup = this.props.chatType === Conversation.ChatType.Group;
            this._setNaviBar();
            this._unRegisterListener();
            this._registerListener();
            this.setState({listKey: guid()});
        }
    }

    _registerListener = () => {
        BackHandler.addEventListener('hardwareBackPress', this._onBackPress);
        [
            [Event.SendMessage, this._onReceiveMessage.bind(this)],
            [Event.ReceiveMessage, this._onReceiveMessage.bind(this)],
            this.isGroup && [Event.Group, this._setNaviBar.bind(this)],
            [Event.GroupLeave, this._userLeave.bind(this)],
        ].filter(i => !!i).forEach(([eventType, func], index) => {
            this.listeners[index] = Listener.register(
                [Event.Base, eventType, this.props.imId],
                func
            );
        });
        const index = this.listeners.length;
        this.listeners[index] = Keyboard.addListener(
            'keyboardDidShow',
            this._setKeyboardStatus.bind(this, true)
        );
        this.listeners[index + 1] = Keyboard.addListener(
            'keyboardWillHide',
            this._setKeyboardStatus.bind(this, false)
        );
    };

    _unRegisterListener = () => {
        BackHandler.removeEventListener('hardwareBackPress', this._onBackPress);
        this.listeners.forEach(listener => listener && listener.remove());
    };

    _onBackPress = () => {
        const { hasCheckBox } = this.state;
        if(hasCheckBox){
            this.selectMessages.length=0;
            this.setState({hasCheckBox:false});
        }else {
            this.props.navigation.goBack();
        }
        return true;
    };

    _onBatchForward = () => {
        if (this.selectMessages.length < 1) {
            Toast.show('请选择消息');
            return;
        }
        this.selectMessages.forEach(value=>{
            value.data.quoteMsg=undefined;
        });
        if (this.selectMessages.findIndex(msg => msg.type == delegate.config.messageType.voice) >= 0) {
            Alert.alert('', '你选择的消息中，语音特殊消息不能转发给朋友，是否继续？', [
                { text: '取消', onPress: null },
                {
                    text: '继续',
                    onPress: () => {
                        let removeIndex = this.selectMessages.findIndex(msg => msg.type == delegate.config.messageType.voice);
                        while (removeIndex >= 0) {
                            this.selectMessages.splice(removeIndex, 1);
                            removeIndex = this.selectMessages.findIndex(msg => msg.type == delegate.config.messageType.voice);
                        }
                        if (this.selectMessages.length > 0) {
                            this.props.navigation.navigate(PageKeys.ChooseConversation, {
                                title: i18n.t('IMPageChooseConversationTitle'),
                                onSelectData:
                                    this._onSelectConversation.bind(this, this.selectMessages,()=>{
                                        this.selectMessages.length = 0;
                                        this.setState({ hasCheckBox: false });
                                    }),
                                excludedIds: [this.props.imId]
                            });
                        }

                    }
                }
            ]);
            return;
        }
        this.props.navigation.navigate(PageKeys.ChooseConversation, {
            title: i18n.t('IMPageChooseConversationTitle'),
            onSelectData:
                this._onSelectConversation.bind(this, this.selectMessages,()=>{
                    this.selectMessages.length = 0;
                    this.setState({ hasCheckBox: false });
                }),
            excludedIds: [this.props.imId]
        });
    };

    render() {
        const { imId, chatType } = this.props;
        return (
            <View style={[styles.view, { backgroundColor: delegate.style.viewBackgroundColor }]}>
                <SafeAreaView
                    style={styles.innerview}
                >
                    <TouchableWithoutFeedback
                        disabled={!this.state.keyboardShow}
                        style={styles.touch}
                        onPress={() => this.bottomBar.dismiss()}
                    >
                        {this._renderContent()}
                    </TouchableWithoutFeedback>
                </SafeAreaView>
                <delegate.component.BottomBar
                    ref={ref => this.bottomBar = ref}
                    imId={imId}
                    chatType={chatType}
                    onSendMultiMessage={this._onSendMultiMessage.bind(this, imId, chatType)}
                    onSendMessage={this._onSendMessage.bind(this, imId, chatType)}
                    navigation={this.props.navigation}
                    batchOptionMode={this.state.hasCheckBox}
                    onBatchForward={this._onBatchForward}
                />
                <delegate.component.MessageMenu
                    menuShow={this.state.menuShow}
                    menuRef={this.state.menuRef}
                    onClose={this._onCloseMenu.bind(this)}
                    actionList={this.state.actionList}
                />
            </View>
        );
    }

    _setNaviBar() {
        const { imId } = this.props;
        let title;
        let marginHorizontal;
        if (this.isGroup) {
            const groupName = delegate.model.Group.getName(imId, false) || i18n.t('IMCommonChatTypeGroup');
            title = groupName + ' (' + delegate.model.Group.getMembers(imId).length + ')';
            marginHorizontal = 97;
        } else {
            title = delegate.user.getUser(imId).name;
            marginHorizontal = 50;
        }
        this.props.navigation.setParams({
            _left_: this._renderLeftElement.bind(this),
            _title_: title,
            _right_: this._renderRightElement.bind(this),
            _marginHorizontal_: marginHorizontal
        });
    }

    _renderContent() {
        const {imId} = this.props;
        const conversation = delegate.model.Conversation.getOne(imId, false)
        return (
            <View style={styles.container}>
                <delegate.component.DetailListView
                    key={this.state.listKey}
                    ref={ref => this.list = ref}
                    style={styles.fixedList}
                    renderItem={this._renderItem}
                    onLoadPage={this._refresh.bind(this)}
                    oldUnreadMessageCount={Math.min(100, (!conversation ? 0 : conversation.unreadMessagesCount))}
                />
                <View style={styles.flexList}/>
            </View>
        );
    }

    _renderLeftElement() {
        const { navigation } = this.props;
        const backImage = require('./image/nav_back.png');
        return (<TouchableOpacity
                onPress={() => {
                    const { hasCheckBox } = this.state;
                    if(hasCheckBox){
                        this.selectMessages.length=0;
                        this.setState({hasCheckBox:false});
                    }else {
                        navigation.goBack();
                    }
                }}
                activeOpacity={0.8}
            >
                <Image
                    source={backImage}
                    style={styles.leftImage}
                />
            </TouchableOpacity>
        );
    }

    _renderRightElement() {
        const {imId, chatType} = this.props;
        const onSendMsg = this._onSendMessage.bind(this, imId, chatType)
        const moreImage = require('./image/showMore.png');
        return (<TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate(PageKeys.ChatSetting, {
                        imId: imId,
                        chatType: chatType,
                        onSendMessage: onSendMsg,
                    });
                }}
                activeOpacity={0.8}
            >
                <Image
                    source={moreImage}
                    style={styles.rightImage}
                />
            </TouchableOpacity>
        )
    }

    _setKeyboardStatus(status) {
        this.setState({
            keyboardShow: status,
        }, () => {
            if (status) {
                this.list.scrollToTop();
            }
        });
    }

    protected async _refresh(oldData, pageSize = this.pageCount) {
        const isFirst = !oldData || oldData.length <= 0;
        const lastMessage = isFirst ? undefined : this.lastMessage;
        const loadPromise = delegate.im.conversation.loadMessage({
            imId: this.props.imId,
            chatType: this.props.chatType,
            lastMessage: lastMessage,
            count: pageSize,
        });
        const markPromise = this._markAllRead();
        let [message] = await Promise.all([loadPromise, markPromise]);
        const result = message
            .map(item => Model.Action.Parse.get(undefined, item, item))
            // 历史数据中存在的时间消息可能导致isEnd计算错误
            .filter((item) => !!item && !(item.data.isSystem && item.data.text.length <= 0))
            .sort((a, b) => a.timestamp >= b.timestamp ? -1 : 1);
        if (result && result.length > 0) {
            this.lastMessage = result[result.length - 1];
        }
        return {
            data: result,
            isEnd: message.length < pageSize,
        };
    }

    _userLeave(data) {
        const { reason } = data;
        let message = '';
        if (reason == 0) {
            message = '您已被移出群聊';
        } else if (reason == 2) {
            message = '群聊已解散';
        }

        if (message.length > 0) {
            this._unRegisterListener();
            Alert.alert('提示', message, [
                {
                    text: i18n.t('IMCommonOK'), onPress: () => {
                        this.props.navigation.dispatch(
                            StackActions.popToTop({})
                        );
                    }
                },
            ]);
        }
    }

    _insertMessageToList(message) {
        console.log(message);
        const messages = Array.isArray(message) ? message : [message];
        this.list.insert(messages);
    }

    _onReceiveMessage(message) {
        this._insertMessageToList(message);
        this._markAllRead()
    }

    _onSendMultiMessage(imId, chatType, {type, bodies}) {
        const messages = bodies.map(body => this._generateMessage(type, body));
        this._sendMessage(imId, chatType, messages, delegate.model.Message.sendMultiMessage);
    }

    _onSendMessage(imId, chatType, { type, body, ...other }, sendCallBackFunc?) {
        const message = this._generateMessage(type, body, other);
        this._sendMessage(imId, chatType, message, delegate.model.Message.sendMessage, sendCallBackFunc);
    }

    _sendMessage(imId, chatType, message, sendFunc, sendCallBackFunc?) {
        const isCurrent = this.props.imId === imId;
        sendFunc(imId, chatType, message)
            .then(() => {
                if (isCurrent) {
                    this._markAllRead();
                } else {
                    Toast.show(i18n.t('IMToastSuccess', {
                        action: i18n.t('IMCommonSendMessage')
                    }));
                }
                sendCallBackFunc&&sendCallBackFunc();
            })
            .catch(() => {
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMCommonSendMessage')
                }));
                sendCallBackFunc&&sendCallBackFunc();
            });
    }

    _onShowMenu(params) {
        const {ref, isSender, message} = params;
        const messageType = message.type;
        const actionList = [];
        const interval = (new Date().getTime() - message.timestamp) / 1000;
        const canRecall = interval < 5 * 60;
        if (messageType === delegate.config.messageType.text) {
            actionList.push({title: '复制', action: this._onCopy.bind(this, message)});
        }
        if (messageType != delegate.config.messageType.voice){
            actionList.push({
                title: '引用',
                action: this._onQuote.bind(this, message)
            });
        }
        actionList.push({title: '转发', action: this._onForward.bind(this, message)});
        actionList.push({ title: '多选', action: this._onForwardMultiMessage.bind(this, message) });
        if (isSender && canRecall) {
            actionList.push({title: '撤回', action: this._onRecall.bind(this, message)});
        }
        this.setState({
            menuShow: true,
            menuRef: ref,
            actionList: actionList,
        });
    }

    _onCloseMenu() {
        this.setState({menuShow: false});
    }

    _onCopy(message) {
        const text = message.data.text;
        Clipboard.setString(text);
        Toast.show('复制成功');
    }

    _onForward(message) {
        message.data.quoteMsg=undefined;
        this.props.navigation.navigate(PageKeys.ChooseConversation, {
            title: i18n.t('IMPageChooseConversationTitle'),
            onSelectData: this._onSelectConversation.bind(this, message,undefined),
            excludedIds: [this.props.imId]
        });
    }

    async _onRecall(message) {
        const {imId, chatType} = this.props;
        await delegate.model.External.onRecallMessage(
            imId,
            chatType,
            delegate.user.getMine().userId,
            message
        );
        await delegate.im.conversation.recallMessage({imId, chatType, message});
    }

    _onQuote(item) {
        // this.bottomBar.changeInputText(item.from, item.data.text);
        this.bottomBar.quoteMsg(item);
    }

    _onSelectConversation(message, sendCallBackFunc, conversations) {
        if (message instanceof Array) {
            message.forEach((value, index, array) => {
                const {messageId,innerId, ...others}=value
                this._onSendMessage(
                    conversations[0].imId,
                    conversations[0].chatType,
                    { ...others, body: value.data },
                    index === message.length - 1 ? sendCallBackFunc : undefined
                );
            });
        } else {
            const {messageId,innerId, ...others}=message
            this._onSendMessage(
                conversations[0].imId,
                conversations[0].chatType,
                { ...others, body: message.data },
                sendCallBackFunc
            );
        }
    }

    protected async _markAllRead() {
        const {imId, chatType} = this.props;
        return await delegate.model.Conversation.markReadStatus(imId, chatType, true);
    }

    _renderItem=({ item, index }, messageList) => {
        const isMe = item.from === delegate.user.getMine().userId;
        const position = item.data.isSystem ? 0 : isMe ? 1 : -1;
        const { hasCheckBox } = this.state;
        if (item.data.isSystem && item.data.text.length <= 0) {
            return <View/>
        }
        return (
            <delegate.component.BaseMessage
                imId={this.props.imId}
                chatType={this.props.chatType}
                position={position}
                showTime={DateUtil.needShowTime(messageList[index + 1], item)}
                message={item}
                hasCheckBox={hasCheckBox}
                isSelected={this._isMessageSelected(item)}
                messages={messageList}
                changeSelectState={this._onChangeSelectState}
                onShowMenu={this._onShowMenu.bind(this)}
                navigation={this.props.navigation}
                onLongPressAvatar={this._onLongPressAvatar}
            />
        );
    }

    _onLongPressAvatar = (params: Message.General) => {
        if (this.props.chatType !== Conversation.ChatType.Group) {
            return;
        }
        const isMe = params.from === delegate.user.getMine().userId;
        const canResponse = params.data.isSystem ? 0 : isMe ? 0 : 1;
        if (canResponse) {
            this.bottomBar.insertAtMember([params.from])
        }
    }

    _generateMessage(type, body, others = {}) {
        if (type == IMConstant.MessageType.image && body && body.mineType && body.mineType.startsWith('video')) {
            type = IMConstant.MessageType.video;
        }
        return {
            conversationId: this.props.imId,
            messageId: undefined,
            innerId: guid(),
            status: Message.Status.Pending,
            type: type,
            from: delegate.user.getMine().userId,
            to: this.props.imId,
            localTime: new Date().getTime(),
            timestamp: new Date().getTime(),
            data: body,
            ...others,
        };
    }

    _onForwardMultiMessage(msg: Message.General) {
        this.selectMessages.push(msg);
        this._switchMultiSelect();
    }

    _switchMultiSelect = () => {
        const { hasCheckBox: oldCheckState } = this.state;
        this.setState({
            hasCheckBox: !oldCheckState
        });
    };

    _isMessageSelected=(msg: Message.General)=>{
        const removeIndex = this.selectMessages.findIndex(((value, index, iter) => value.messageId===msg.messageId));
        return removeIndex>=0;
    }

    _onChangeSelectState=(oriState:boolean,msg: Message.General)=>{
        if(oriState){
            this._unSelectMessage(msg);
        }else {
            this._selectMessage(msg)
        }
    }

    _selectMessage = (msg: Message.General) => {
        this.selectMessages.push(msg);
        this.setState({ refresh: !this.state.refresh });
    };

    _unSelectMessage = (msg: Message.General) => {
        const removeIndex = this.selectMessages.findIndex(((value, index, iter) => value.messageId === msg.messageId));
        this.selectMessages.splice(removeIndex,1);
        this.setState({ refresh: !this.state.refresh });
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    innerview: {
        flex: 1,
    },
    fixedList: {
        flex: 0,
    },
    flexList: {
        flex: 10000,
    },
    touch: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    rightImage: {
        width: 24,
        height: 24,
        right: 10,
    },
    leftImage: {
        marginLeft: 14,
        width: 18,
        height: 16,
    }
});
