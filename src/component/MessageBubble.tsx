import * as React from 'react';
import { TouchableWithoutFeedback, View, Dimensions, ImageSourcePropType } from 'react-native';
import ImageCapInset from 'react-native-image-capinsets';
import { Component } from '../typings';
import delegate from '../delegate';

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

    protected readonly paddingHorizontal = 7;
    protected bubble: View | null = null;
    protected innerView: View | null = null;
    
    state: State = {
        enableBubble: false,
    };

    render() {
        const {isSender, leftBubble, rightBubble} = this.props;
        const bubbleImage = isSender ? rightBubble : leftBubble;
        const maxWidth = Dimensions.get('window').width / 3 * 2;
        const paddingLeft = isSender ? 0 : this.paddingHorizontal;
        const paddingRight = isSender ? this.paddingHorizontal : 0;
        const innerMaxWidth = maxWidth - paddingLeft - paddingRight;
        return (
            <TouchableWithoutFeedback
                onPress={this._onPress.bind(this)}
                onLongPress={this._onLongPress.bind(this)}
            >
                <View ref={ref => this.bubble = ref}>
                    {this.state.enableBubble ? (
                        <ImageCapInset
                            capInsets={{top: 37, left: 13, bottom: 10, right: 13}}
                            resizeMode='stretch'
                            source={bubbleImage}
                            style={{maxWidth, paddingLeft, paddingRight}}
                        >
                            {this._renderMessage(innerMaxWidth)}
                        </ImageCapInset>
                    ) : (
                        <View style={{maxWidth, paddingLeft, paddingRight}}>
                            {this._renderMessage(innerMaxWidth)}
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    protected _renderMessage(maxWidth: number) {
        const {message, isSender} = this.props;
        const state = {
            imId: this.props.imId,
            chatType: this.props.chatType,
            message: message,
            isSender: isSender,
        };
        const params = {
            ref: (ref: View | null) => {this.innerView = ref;},
            message: message,
            isSender: isSender,
            enableBubble: this._enableBubble.bind(this),
            maxWidth: maxWidth,
            style: {},
        };
        const displayView = delegate.model.Action.Display.match(
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
        if (this.innerView && this.innerView.onPress) {
            this.innerView.onPress();
        }
    }

    protected _onLongPress() {
        const {message, isSender, onShowMenu} = this.props;
        this.bubble && this.bubble.measure((width: number, height: number, px: number, py: number) => {
            const param = {
                rect: {x: px, y: py, width: width, height: height},
                isSender: isSender,
                message: message,
            };
            onShowMenu(param);
        });
    }
}