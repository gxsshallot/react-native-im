import React from 'react';
import { Clipboard, Keyboard, SafeAreaView, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import NaviBar, { forceInset } from 'react-native-pure-navigation-bar';
import * as PageKeys from '../pagekey';
import { ChatManager, IMConstant } from 'react-native-im-easemob';
import Toast from 'react-native-root-toast';
import Listener from 'react-native-general-listener';
import * as Types from '../proptype';
import * as Constant from '../constant';
import { guid, DateUtil } from '../util';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        ...Types.BasicConversation,
        ...Types.Navigation,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.isGroup = props.chatType === Constant.ChatType.Group;
        this.pageCount = delegate.component.DetailListView.defaultProps.pageSize;
        this.events = [
            [Constant.ReceiveMessageEvent, this._onReceiveMessage],
            [Constant.RecallMessageEvent, this._onExchangeMessage],
            [Constant.SystemMessageEvent, this._insertSystemMessage],
        ];
        this.listeners = new Array(this.events.length);
        this.state = {
            messages: [],
            keyboardShow: false,
            menuShow: false,
            menuRect: {},
            actionList: [],
        };
    }

    componentDidMount() {
        this.keyboardShow = Keyboard.addListener(
            'keyboardDidShow',
            this._setKeyboardStatus.bind(this, true)
        );
        this.keyboardHide = Keyboard.addListener(
            'keyboardWillHide',
            this._setKeyboardStatus.bind(this, false)
        );
        this.events.forEach(([eventType, func], index) => {
            this.listeners[index] = Listener.register(
                [Constant.BaseEvent, eventType, this.props.imId],
                func
            );
        });
    }

    componentWillUnmount() {
        this.keyboardShow && this.keyboardShow.remove();
        this.keyboardHide && this.keyboardHide.remove();
        this.events.forEach(([eventType], index) => {
            const listener = this.listeners[index];
            listener && Listener.unregister(
                [Constant.BaseEvent, eventType, this.props.imId],
                listener
            );
        });
    }

    render() {
        const {imId, chatType} = this.props;
        return (
            <View style={[styles.view, {backgroundColor: delegate.style.viewBackgroundColor}]}>
                {this._renderNaviBar()}
                <SafeAreaView
                    style={styles.innerview}
                    forceInset={forceInset(0, 1, 0, 1)}
                >
                    <TouchableWithoutFeedback
                        style={styles.touch}
                        onPress={() => Keyboard.dismiss()}
                    >
                        <View style={styles.container}>
                            <delegate.component.DetailListView
                                ref={ref => this.list = ref}
                                style={{flex: 0}}
                                renderItem={this._renderItem}
                                onLoadPage={this._refresh}
                            />
                            <View style={{flex: 10000}} />
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
                <delegate.component.BottomBar
                    ref={ref => this.bottomBar = ref}
                    imId={imId}
                    chatType={chatType}
                    onSendMessage={this._onSendMessage.bind(this, imId, chatType)}
                    navigation={this.props.navigation}
                />
                <delegate.component.MessageMenu
                    menuShow={this.state.menuShow}
                    menuRect={this.state.menuRect}
                    onClose={this._onCloseMenu}
                    actionList={this.state.actionList}
                />
            </View>
        );
    }

    _renderNaviBar = () => {
        const {imId} = this.props;
        let title;
        if (this.isGroup) {
            const groupName = delegate.model.Group.getName(imId, false);
            title = (groupName ? groupName : '群聊') + ' ('
                + delegate.model.Group.getMembers(imId).length + ')';
        } else {
            title = delegate.user.getUser(imId).name;
        }
        return (
            <NaviBar
                title={title}
                rightElement={this._renderRightElement()}
                onRight={this._onRight}
            />
        );
    };

    _renderRightElement = () => {
        return ['设置'];
    };

    _onRight = () => {
        this.props.navigation.navigate({
            routeName: PageKeys.ChatSetting,
            params: {
                imId: this.props.imId,
                chatType: this.props.chatType,
            },
        });
    };

    _setKeyboardStatus = (status) => {
        this.setState({
            keyboardShow: status,
        }, () => {
            if (status) {
                this.list.scrollToTop();
            }
        });
    };

    _refresh = (oldData, pageSize) => {
        const isFirst = !oldData || oldData.length <= 0;
        const lastMessageId = isFirst ? undefined : this.lastMessageId;
        const loadPromise = delegate.im.conversation.loadMessage({
            imId: this.props.imId,
            chatType: this.props.chatType,
            lastMessageId: lastMessageId,
            count: this.pageCount,
        });
        const markPromise = this._markAllRead();
        return Promise.all([loadPromise, markPromise])
            .then(([result, _]) => {
                result = result
                    .map(item => {
                        return delegate.model.Action.match(
                            Constant.Action.Parse,
                            undefined,
                            item,
                            item,
                        );
                    })
                    .sort((a, b) => a.localTime >= b.localTime ? -1 : 1);
                if (result && result.length > 0) {
                    this.lastMessageId = result[result.length - 1].messageId;
                }
                return {
                    data: result.reverse(),
                    isEnd: result.length < this.pageCount,
                };
            });
    };

    _insertMessageToList = (message) => {
        console.log(message);
        this.list.insert([message]);
    };

    _onReceiveMessage = (message) => {
        this._insertMessageToList(message);
    };

    _onSendMessage = (imId, chatType, {type, body}) => {
        const isCurrent = this.props.imId === imId;
        const message = this._generateMessage(type, body);
        if (isCurrent) {
            this._insertMessageToList(originMessage);
            this._markAllRead();
        }
        return delegate.model.Conversation.sendMessage(imId, chatType, message, {})
            .then((newMessage) => {
                if (isCurrent) {
                    this._insertMessageToList(newMessage);
                    this._markAllRead();
                } else {
                    Toast.show('发送成功');
                }
            })
            .catch((err) => {
                Toast.show(err);
            });
    };

    _onShowMenu = (param) => {
        const {rect, isSender, originMessage} = param;
        const messageType = originMessage.body.type;
        const actionList = [];
        // const interval = (new Date().getTime() - originMessage.timestamp) / 1000;
        // const canRecall = interval < 5 * 60;
        if (messageType === IMConstant.MessageType.text) {
            actionList.push({title: '复制', action: this._onCopy.bind(this, originMessage)});
            this.isGroup && !isSender && actionList.push({
                title: '引用',
                action: this._onQuote.bind(this, originMessage)
            });
        }
        actionList.push({title: '转发', action: this._onForward.bind(this, originMessage)});
        // if (isSender && canRecall) {
        //     actionList.push({title: '撤回', action: this._onRecall.bind(this, originMessage)});
        // }
        this.setState({
            menuShow: true,
            menuRect: rect,
            actionList: actionList,
        });
    };

    _onCloseMenu = () => {
        this.setState({menuShow: false});
    };

    _onCopy = (data) => {
        const text = data.body.text;
        Clipboard.setString(text);
    };

    _onForward = (data) => {
        this.props.navigation.navigate({
            routeName: PageKeys.ChooseConversation,
            params: {
                onSelectData: this._onSelectConversation.bind(this, data),
            },
        });
    };

    _onRecall = (data) => {
        const {imId, chatType} = this.props;
        if (Model.app.env() !== Constant.environment.test178) {
            global.standard.im.message.remove(data, chatType);
        }
        this._onExchangeMessage({text: '你撤回了一条消息', ext: {body: {message: data}}});
        const appName = global.standard.im.constant.cmd_message.IM_MESSAGE;
        ChatManager.sendCmd(imId, chatType, appName, {
            appName,
            body: {message: data, type: global.standard.im.constant.type.recall_message}
        });
    };

    _onExchangeMessage = (cmdMessage) => {
        const data = cmdMessage.ext.body.message;
        const {chatType} = this.props;
        delegate.im.conversation.deleteMessage(data.to, chatType, data.messageId);
        const message = {
            conversationId: data.to,
            chatType,
            ext: {
                isSystem: true,
                [global.standard.im.message.constant.inner_id]: guid()
            },
            from: data.from,
            localTime: data.localTime,
            status: IMConstant.MessageStatus.succeed,
            timestamp: data.timestamp,
            to: data.to,
            body: {type: IMConstant.MessageType.text, text: cmdMessage.text},
            messageId: data.messageId,
        };
        this.list.recallMessage(message, data.messageId);
        ChatManager.insertSystemMessage(
            data.to,
            chatType,
            cmdMessage.text,
            data.timestamp,
            data.localTime
        )
            .then((newMessage) => {
                this.list.recallMessage(newMessage, data.messageId);
            });
    };

    _insertSystemMessage = (cmdMessage) => {
        const {ext: {body}, to, timestamp, localTime, text} = cmdMessage;
        const message = {
            imId: body.groupId,
            chatType: this.props.chatType,
            ext: {
                isSystem: true,
                [global.standard.im.message.constant.inner_id]: guid(),
            },
            from: to,
            localTime,
            status: IMConstant.MessageStatus.succeed,
            timestamp,
            to: this.props.imId,
            body: {type: IMConstant.MessageType.text, text},
            messageId: cmdMessage.messageId,
        };
        this._insertMessageToList(message);
        this._markAllRead();
    };

    _onQuote = (item) => {
        this.bottomBar.changeInputText(item.from, item.data.text);
    };

    _onSelectConversation = (data, conversations) => {
        this._onSendMessage(
            conversations[0].imId,
            conversations[0].chatType,
            {type: data.type, body: data.body}
        );
    };

    _markAllRead = () => {
        const {imId, chatType} = this.props;
        return delegate.model.Conversation.markReadStatus(imId, chatType, true);
    };

    _renderItem = ({item}) => {
        const isMe = item.from === delegate.user.getMine().userId;
        const position = item.data.isSystem ? 0 : isMe ? 1 : -1;
        if (item.data.isSystem && item.data.text.length <= 0) {
            item.data.text = DateUtil.showDate(item.localTime, true);
        }
        return (
            <delegate.component.BaseMessage
                imId={this.props.imId}
                chatType={this.props.chatType}
                position={position}
                message={item}
                onShowMenu={this._onShowMenu}
            />
        );
    };

    _generateMessage = (type, body, others) => {
        return {
            conversationId: this.props.imId,
            messageId: undefined,
            innerId: guid(),
            status: Constant.Status.Pending,
            type: type,
            from: delegate.user.getMine().userId,
            to: imId,
            localTime: new Date().getTime(),
            timestamp: new Date().getTime(),
            data: body,
            ...others,
        };
    };
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    innerview: {
        flex: 1,
    },
    touch: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});