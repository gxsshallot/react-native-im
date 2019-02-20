import * as React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Listener from 'react-native-general-listener';
import { forceInset, getSafeAreaInset } from 'react-native-pure-navigation-bar';
import Badge from '@hecom/badge';
import * as Types from '../proptype';
import * as PageKeys from '../pagekey';
import * as Constant from '../constant';
import { DateUtil } from '../util';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        ...Types.BasicConversation,
        ...Types.Navigation,
        separatorLeft: PropTypes.number.isRequired,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        const {imId, chatType} = props;
        this.events = [
            [Constant.ReceiveMessageEvent, this._onMessageReceive],
            [Constant.SendMessageEvent, this._onMessageSend],
            [Constant.ConversationEvent, this._refresh],
            [Constant.UnreadCountEvent, this._onUnreadCountChange],
        ];
        if (chatType === Constant.ChatType.Group) {
            this.events.push([Constant.GroupEvent, this._refresh]);
        }
        this.state = {
            ...this._stateWithProps(imId),
        };
    }

    componentDidMount() {
        this.listenEvents = this.events
            .map(([eventType, func]) => Listener.register(
                [Constant.BaseEvent, eventType, this.props.imId], func
            ));
    }

    componentWillUnmount() {
        this.events.forEach(([eventType], index) => Listener.unregister(
            [Constant.BaseEvent, eventType, this.props.imId], this.listenEvents[index]
        ));
    }

    render() {
        const {imId, chatType, separatorLeft} = this.props;
        const name = delegate.model.Conversation.getName(imId);
        const content = [];
        this.state.atMe && content.push(this._renderAtMeText());
        this._isSendingMessage() && content.push(this._renderSendMessageText());
        this._isErrorMessage() && content.push(this._renderErrorMessageText());
        this.state.latestMessage && content.push(this._renderLatestMessageText());
        return (
            <SafeAreaView style={styles.view} forceInset={forceInset(0, 1, 0, 1)}>
                <delegate.component.ListCell
                    style={this.state.top && styles.top}
                    avatar={{imId, chatType}}
                    title={name}
                    subTitle={content}
                    right={this._renderRightColumn()}
                    onClick={this._clickRow}
                />
                {separatorLeft >= 0 && this._renderSeparatorLine()}
                {!!this.state.unreadMessagesCount && this._renderBadge()}
            </SafeAreaView>
        );
    }

    _renderBadge = () => {
        const {unreadMessagesCount, avoid} = this.state;
        const {width} = Dimensions.get('window');
        const inset = getSafeAreaInset();
        const style = avoid ? {
            top: 5,
            right: width - 70 - inset.left + 5,
        } : {
            top: 0,
            right: width - 70 - inset.left,
        };
        return (
            <Badge
                count={avoid ? undefined : unreadMessagesCount}
                maxCount={99}
                radius={avoid ? 3 : 8}
                outSpace={2}
                style={[styles.count, style]}
            />
        );
    };

    _renderRightColumn = () => {
        const {avoid, latestMessage} = this.state;
        return (
            <View style={styles.right}>
                <Text style={styles.time}>
                    {latestMessage && DateUtil.showDate(latestMessage.timestamp, false)}
                </Text>
                {avoid && (
                    <View style={styles.silent}>
                        <Image
                            source={require('./image/no_disturb.png')}
                            style={styles.silentIcon}
                        />
                    </View>
                )}
            </View>
        );
    };

    _renderAtMeText = () => {
        return (
            <Text key={'at'} style={styles.atMeText}>
                {'[有人@我]'}
            </Text>
        );
    };

    _renderSendMessageText = () => {
        return (
            <Text key={'send'} style={styles.sendMessageText}>
                {'<-'}
            </Text>
        );
    };

    _renderErrorMessageText = () => {
        return (
            <Text key={'error'} style={styles.errorMessageText}>
                {'! '}
            </Text>
        );
    };

    _renderLatestMessageText = () => {
        const {latestMessage} = this.state;
        const params = {
            imId: this.props.imId,
            chatType: this.props.chatType,
            message: latestMessage
        };
        return delegate.model.Action.Abstract.match(
            latestMessage.type,
            params,
            params
        );
    };

    _renderSeparatorLine = () => {
        const {separatorLeft} = this.props;
        const style = {
            backgroundColor: delegate.style.separatorLineColor,
            marginLeft: separatorLeft,
        };
        return <View style={[styles.separator, style]} />;
    };

    _clickRow = () => {
        this.props.navigation.navigate({
            routeName: PageKeys.ChatDetail,
            params: {
                imId: this.props.imId,
                chatType: this.props.chatType,
            },
        });
    };

    _refresh = () => {
        this.setState({
            ...this._stateWithProps(this.props.imId),
        });
    };

    _stateWithProps = (imId) => {
        const conversation = delegate.model.Conversation.getOne(imId, true);
        return {
            latestMessage: conversation.latestMessage,
            unreadMessagesCount: conversation.unreadMessagesCount,
            atMe: conversation.atMe,
            top: conversation.config.top,
            avoid: conversation.config.avoid,
        };
    };

    _isSendingMessage = () => {
        const {latestMessage} = this.state;
        return latestMessage && (
            latestMessage.status === Constant.Status.Pending ||
            latestMessage.status === Constant.Status.Delivering
        );
    };

    _isErrorMessage = () => {
        const {latestMessage} = this.state;
        return latestMessage && latestMessage.status === Constant.Status.Failed;
    };

    _onUnreadCountChange = () => {
        const conversation = delegate.model.Conversation.getOne(this.props.imId, true);
        const count = conversation.unreadMessagesCount;
        this.setState({
            unreadMessagesCount: count,
        });
    };

    _onMessageReceive = (message) => {
        const {latestMessage} = this.state;
        if (!latestMessage || message.localTime >= latestMessage.localTime) {
            const conversation = delegate.model.Conversation.getOne(this.props.imId, false);
            this.setState({
                latestMessage: message,
                atMe: conversation.atMe,
            });
        }
    };

    _onMessageSend = (message) => {
        const {latestMessage} = this.state;
        if (!latestMessage || message.localTime >= latestMessage.localTime) {
            this.setState({
                latestMessage: message,
                atMe: false,
            });
        }
    };
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'white',
    },
    top: {
        backgroundColor: '#efeff4',
    },
    count: {
        position: 'absolute',
        zIndex: 1,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
    },
    atMeText: {
        color: 'red',
    },
    sendMessageText: {
        color: 'gray',
    },
    errorMessageText: {
        color: 'red',
        fontSize: 16,
    },
    right: {
        marginLeft: 13,
        marginTop: 14,
        alignItems: 'flex-end',
        alignSelf: 'stretch',
    },
    time: {
        fontSize: 11,
        color: "#aaaaaa",
    },
    silent: {
        marginTop: 14,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    silentIcon: {
        width: 14,
        height: 14,
    },
});