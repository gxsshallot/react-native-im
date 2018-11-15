import React from 'react';
import { ImageBackground, TouchableWithoutFeedback, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import * as Model from '../model';
import * as Constant from '../constant';
import * as Types from '../proptype';

export default class extends React.PureComponent {
    static propTypes = {
        isSender: PropTypes.bool.isRequired,
        message: PropTypes.shape(Types.BasicMessage),
        onShowMenu: PropTypes.func,
        leftBubble: PropTypes.any,
        rightBubble: PropTypes.any,
    }

    static defaultProps = {
        leftBubble: require('./image/message_bubble_left.png'),
        rightBubble: require('./image/message_bubble_right.png'),
    };

    constructor(props) {
        super(props);
        this.state = {
            enableBubble: false,
        };
    }

    render() {
        const {isSender} = this.props;
        const bubbleImage = isSender ? this.props.rightBubble : this.props.leftBubble;
        const maxWidth = Dimensions.get('window').width / 3 * 2;
        const paddingLeft = isSender ? 0 : 7;
        const paddingRight = isSender ? 7 : 0;
        const innerMaxWidth = maxWidth - paddingLeft - paddingRight;
        return (
            <TouchableWithoutFeedback
                onPress={this._onPress}
                onLongPress={this._onLongPress}
            >
                <View ref={ref => this.bubble = ref}>
                    {this.state.enableBubble ? (
                        <ImageBackground
                            capInsets={{top: 30, left: 13, bottom: 30, right: 13}}
                            resizeMode='stretch'
                            source={bubbleImage}
                            style={{maxWidth, paddingLeft, paddingRight}}
                        >
                            {this._renderMessage(innerMaxWidth)}
                        </ImageBackground>
                    ) : (
                        <View style={{maxWidth, paddingLeft, paddingRight}}>
                            {this._renderMessage(innerMaxWidth)}
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _renderMessage = (maxWidth) => {
        const {message, isSender} = this.props;
        const params = {
            ref: (ref) => {this.innerView = ref;},
            message: message,
            isSender: isSender,
            enableBubble: this._enableBubble,
            maxWidth: maxWidth,
        };
        const displayItem = Model.Action.match(
            Constant.Action.Display,
            message.type,
            params,
            undefined,
        );
        return React.createElement(displayItem, params);
    };

    _enableBubble = (status) => {
        this.setState({enableBubble: status});
    };

    _onPress = () => {
        if (this.innerView && this.innerView.onPress) {
            this.innerView.onPress();
        }
    };

    _onLongPress = () => {
        const {message, isSender} = this.props;
        this.bubble.measure((ox, oy, width, height, px, py) => {
            const param = {
                rect: {x: px, y: py, width: width, height: height},
                isSender: isSender,
                message: message,
            };
            this.props.onShowMenu && this.props.onShowMenu(param);
        });
    };
}