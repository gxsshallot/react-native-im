import React, { RefObject } from 'react';
import {Dimensions, ImageSourcePropType, PixelRatio, TouchableWithoutFeedback, View} from 'react-native';
import ImageCapInset from '@hecom/react-native-image-capinsets';
import * as Model from '../model';
import {Action, Component} from '../typings';
import delegate from '../delegate';
import { QuoteMsgBubble } from '../../plugin/message/display';

export interface Props extends Component.MessageBubbleProps {
    leftBubble: ImageSourcePropType;
    rightBubble: ImageSourcePropType;
}

export interface State {
    enableBubble: boolean;
}

export default class extends React.PureComponent<Props, State> {
    static defaultProps = {
        leftBubble: require('./image/message_bubble_left.png'),
        rightBubble: require('./image/message_bubble_right.png'),
    };

    protected readonly paddingHorizontal = 5;
    protected bubble: RefObject<View> = React.createRef();
    protected innerView: Action.Display.Result | null = null;

    state: State = {
        enableBubble: false,
    };

    render() {
        const {isSender, touchable, leftBubble, rightBubble, message} = this.props;
        const bubbleImage = isSender ? rightBubble : leftBubble;
        const maxWidth = Dimensions.get('window').width / 3 * 2;
        const paddingLeft = isSender ? 0 : this.paddingHorizontal;
        const paddingRight = isSender ? this.paddingHorizontal : 0;
        const innerMaxWidth = maxWidth - paddingLeft - paddingRight;
        const ratio = PixelRatio.get();
        const rootAlignItems = isSender?'flex-end':'flex-start';
        return (
            <View style={{ flexDirection: 'column',alignItems: rootAlignItems}}>
                <TouchableWithoutFeedback
                    disabled={touchable}
                    onPress={this._onPress.bind(this)}
                    onLongPress={this._onLongPress.bind(this)}
                >
                    <View ref={this.bubble} style={{ flexDirection: 'row' }}>
                        {this.state.enableBubble ? (
                            <View>
                                <ImageCapInset
                                    capInsets={{ top: 84 / ratio, left: 39 / ratio, bottom: 30 / ratio, right: 39 / ratio }}
                                    resizeMode='stretch'
                                    source={bubbleImage}
                                    style={{ maxWidth, paddingLeft, paddingRight }}
                                >
                                    {this._renderMessage(innerMaxWidth)}
                                </ImageCapInset>
                            </View>

                        ) : (
                                <View style={{ maxWidth, paddingLeft, paddingRight }}>
                                    {this._renderMessage(innerMaxWidth)}
                                </View>
                            )}
                        {!isSender && this._renderRedFlag()}
                    </View>
                </TouchableWithoutFeedback>
                <QuoteMsgBubble
                    message={message}
                    maxWidth={maxWidth}
                    paddingLeft={paddingLeft}
                    paddingRight={paddingRight}
                    innerMaxWidth={innerMaxWidth}
                />
            </View>
        );
    }

    protected _renderRedFlag() {
        if (this.props.message.data.shouldRead) {
            return (
                <View style={{
                    backgroundColor: 'red',
                    width: 5,
                    height: 5,
                    borderRadius: 10,
                    marginLeft: 5,
                    alignSelf: 'center',
                }}/>
            )
        } else {
            return null;
        }
    }

    protected _renderMessage(maxWidth: number) {
        const {message, isSender, messages} = this.props;
        const state = {
            imId: this.props.imId,
            chatType: this.props.chatType,
            message: message,
            isSender: isSender,
        };
        const params = {
            ref: (ref: Action.Display.Result | null) => {
                this.innerView = ref;
            },
            message, messages, isSender, maxWidth, style: {},
            enableBubble: this._enableBubble.bind(this),
        };
        const displayView = Model.Action.Display.get(
            message.type,
            state,
            undefined,
        );
        return React.createElement(displayView, params);
    }

    protected _enableBubble(status: boolean) {
        this.setState({enableBubble: status});
    }

    protected _onPress() {
        const {message, message: {messageId, type}} = this.props;
        //语音消息删除未读标志
        if (type == 5 && messageId) {
            let ext = {shouldRead: false};
            delegate.im.conversation.updateMessageExt(messageId, ext);
        }
        message.data.shouldRead = false;
        this.forceUpdate();
        if (this.innerView && this.innerView.onPress) {
            this.innerView.onPress();
        }
    }

    protected _onLongPress() {
        const {message, isSender, onShowMenu} = this.props;
        if (!!this.bubble.current) {
            const param = {
                ref: this.bubble,
                isSender: isSender,
                message: message,
            };
            onShowMenu(param);
        }
    }
}
