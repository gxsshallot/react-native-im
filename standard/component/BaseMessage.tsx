import React from 'react';
import {EmitterSubscription, ActivityIndicator, Image, ImageStyle, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import Listener from '@hecom/listener';
import Toast from 'react-native-root-toast';
import {Component, Event, Message} from '../typings';
import delegate from '../delegate';

export type Props = Component.BaseMessageProps;
export type ListenerObjType = EmitterSubscription;

export interface State {
    showMembersName: boolean;
}

export default class extends React.PureComponent<Props, State> {
    protected updateEvent: string[];
    protected listenUpdate: ListenerObjType | void = null;

    constructor(props: Props) {
        super(props);
        this.updateEvent = [Event.Base, Event.Conversation, props.imId];
        this.state = {
            showMembersName: this._showMembersName(),
        };
    }

    componentDidMount() {
        this.listenUpdate = Listener.register(this.updateEvent, this._onUpdate.bind(this));
    }

    componentWillUnmount() {
        this.listenUpdate && Listener.unregister(this.updateEvent, this.listenUpdate);
    }

    render() {
        const {position} = this.props;
        let msgContent = null;
        if (position < 0) {
            msgContent = this._renderLeft();
        } else if (position > 0) {
            msgContent = this._renderRight();
        } else {
            msgContent = this._renderCenter();
        }
        return (
            <View style={styles.message}>
                {msgContent}
            </View>
        );
    }

    protected _renderLeft() {
        const {message, onShowMenu, messages} = this.props;
        const user = delegate.user.getUser(message.from);
        return (
            <View style={styles.rowLeft}>
                {this._renderAvatar(styles.avatarLeft)}
                <View>
                    {this.state.showMembersName && (
                        <Text style={styles.userName}>
                            {user.name}
                        </Text>
                    )}
                    <delegate.component.MessageBubble
                        imId={this.props.imId}
                        chatType={this.props.chatType}
                        isSender={false}
                        message={message}
                        messages={messages}
                        onShowMenu={onShowMenu}
                        navigation={this.props.navigation}
                    />
                </View>
            </View>
        );
    }

    protected _renderRight() {
        const {message, onShowMenu, messages} = this.props;
        const status = message.status;
        let leftItem = null;
        if (status === Message.Status.Delivering ||
            status === Message.Status.Pending) {
            leftItem = (
                <ActivityIndicator
                    size='small'
                    color='#999999'
                />
            );
        } else if (status === Message.Status.Failed) {
            leftItem = (
                <TouchableWithoutFeedback onPress={this._resend.bind(this)}>
                    <Image
                        source={require('./image/send_fail.png')}
                        style={styles.messageStatusImage}
                    />
                </TouchableWithoutFeedback>
            );
        }
        return (
            <View style={styles.rowRight}>
                {leftItem}
                <delegate.component.MessageBubble
                    imId={this.props.imId}
                    chatType={this.props.chatType}
                    isSender={true}
                    message={message}
                    messages={messages}
                    onShowMenu={onShowMenu}
                    navigation={this.props.navigation}
                />
                {this._renderAvatar(styles.avatarRight)}
            </View>
        );
    }

    protected _renderCenter() {
        const {message: {data: {text}}} = this.props;
        return (
            <Text style={styles.center}>
                {text}
            </Text>
        );
    }

    protected _renderAvatar(style: ImageStyle) {
        const {position, message} = this.props;
        const user = position < 0 ?
            delegate.user.getUser(message.from) :
            delegate.user.getMine();
        const {userId, avatar, imId} = user;
        const defaultImage = delegate.func.getDefaultUserHeadImage(userId);
        const size = 41;
        const innerStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
        };
        const image = avatar
            ? {uri: delegate.func.fitUrlForAvatarSize(avatar, size)}
            : defaultImage;
        return (
            <TouchableWithoutFeedback
                onPress={() => delegate.func.pushToUserDetailPage(imId)}
                onLongPress={() => this.props.onLongPressAvatar && this.props.onLongPressAvatar(this.props.message)}
            >
                <Image
                    style={[styles.userImage, innerStyle, style]}
                    source={image}
                />
            </TouchableWithoutFeedback>
        );
    }

    protected _resend() {
        const {imId, chatType, message} = this.props;
        delegate.model.Message.sendMessage(imId, chatType, message, {})
            .then(() => {
                Toast.show('发送成功');
            });
    }

    protected _showMembersName() {
        const config = delegate.model.Conversation.getConfig(this.props.imId);
        return config.showMembersName;
    }

    protected _onUpdate() {
        this.setState({
            showMembersName: this._showMembersName(),
        });
    }
}

const styles = StyleSheet.create({
    message: {
        marginVertical: 9,
    },
    rowRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rowLeft: {
        flex: 1,
        flexDirection: 'row',
    },
    avatarLeft: {
        marginLeft: 12,
        marginRight: 4,
    },
    avatarRight: {
        marginRight: 12,
        marginLeft: 7,
    },
    userImage: {
        overflow: 'hidden',
    },
    userName: {
        color: 'gray',
        fontSize: 12,
        marginLeft: 9,
        marginBottom: 4,
    },
    center: {
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 4,
        color: '#999999',
        fontSize: 13,
    },
    messageStatusImage: {
        width: 20,
        height: 20,
    },
});