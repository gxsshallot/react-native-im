import React from 'react';
import { Image, StyleSheet, View, Text, Platform } from 'react-native';
import { DisplayProps, TextMessage } from '../proptype';
import * as IMStandard from '../../../src';

export default class extends React.PureComponent {
    static propTypes = DisplayProps(TextMessage);

    constructor(props) {
        super(props);
        const {message: {data: {text}}} = props;
        this.textArr = [];
        let str = '';
        if (text) {
            for (let i = 0; i < text.length; i++) {
                const char = text.charAt(i);
                if (char === '[') {
                    this.textArr.push(str);
                    str = char;
                } else if (char === ']') {
                    str = str + char;
                    this.textArr.push(str);
                    str = '';
                } else {
                    str = str + char;
                }
            }
        }
        if (str.length > 0) {
            this.textArr.push(str);
        }
    }

    componentDidMount() {
        this.props.enableBubble && this.props.enableBubble(true);
    }
    
    render() {
        // TODO URL、电话支持，居中对齐
        return (
            <View style={styles.view}>
                {this.textArr.map(this._renderItem.bind(this))}
            </View>
        );
    }

    _renderItem(text, index) {
        const isEmoji = text[0] === '[' && text[text.length - 1] === ']';
        const emojiImage = IMStandard.Delegate.model.Emoji.getEmoji(text);
        if (isEmoji && emojiImage) {
            return (
                <Image
                    key={index}
                    source={emojiImage}
                    style={styles.image}
                    resizeMode={'contain'}
                />
            );
        } else {
            return (
                <Text key={index} style={styles.text}>
                    {text}
                </Text>
            );
        }
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 16,
        backgroundColor: 'transparent',
        ...Platform.select({
            android: {textAlignVertical: 'center'},
            ios: {lineHeight: 18},
        }),
        overflow: 'hidden',
    },
    image: {
        width: 18,
        height: 18,
        margin: 1,
        backgroundColor: 'transparent',
    },
});