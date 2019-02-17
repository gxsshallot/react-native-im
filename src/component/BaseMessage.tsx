import * as React from 'react';
import { Image, StyleSheet, Text, View, TouchableWithoutFeedback, ActivityIndicator, ImageStyle } from 'react-native';
import Listener, { ListenerObjType } from 'react-native-general-listener';
import Toast from 'react-native-root-toast';
import { Component } from '../typings';
import * as Constant from '../constant';
import delegate from '../delegate';

export type Props = Component.BaseMessageProps;

export interface State {
    showMembersName: boolean;
}

export default class extends React.PureComponent<Props, State> {
    protected updateEvent: string[];
    protected listenUpdate: ListenerObjType | void = undefined;

    constructor(props: Props) {
        super(props);
        this.updateEvent = [Constant.BaseEvent, Constant.ConversationEvent, props.imId];
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
        let msgContent;
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
        const {message, onShowMenu} = this.props;
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
                        isSender={false}
                        message={message}
                        onShowMenu={onShowMenu}
                    />
                </View>
            </View>
        );
    }

    protected _renderRight() {
        const {message, onShowMenu} = this.props;
        const status = message.status;
        let leftItem = null;
        if (status === Constant.Status.Delivering ||
            status === Constant.Status.Pending) {
            leftItem = (
                <ActivityIndicator
                    size='small'
                    color='#999999'
                />
            );
        } else if (status === Constant.Status.Failed) {
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
                    isSender={true}
                    message={message}
                    onShowMenu={onShowMenu}
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
        const {userId, avatar} = user;
        const defaultImage = delegate.func.getDefaultUserHeadImage(userId);
        const size = 36;
        const innerStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
        };
        const image = avatar
            ? {uri: delegate.func.fitUrlForAvatarSize(avatar, size)}
            : defaultImage;
        return (
            <Image
                style={[styles.userImage, innerStyle, style]}
                source={image}
                defaultSource={defaultImage}
            />
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
        marginTop: 10,
        marginBottom: 10,
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
        marginLeft: 10,
        marginRight: 3,
    },
    avatarRight: {
        marginRight: 10,
        marginLeft: 3,
    },
    userImage: {
        marginTop: 2,
        overflow: 'hidden',
    },
    userName: {
        color: 'gray',
        marginLeft: 10,
        marginTop: 2,
        marginBottom: 5,
    },
    center: {
        alignSelf: 'center',
        backgroundColor: '#D4D4D4',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4,
        overflow: 'hidden',
        color: '#FFFFFF',
        marginBottom: 10,
        fontSize: 11,
    },
    messageStatusImage: {
        width: 20,
        height: 20,
    },
});