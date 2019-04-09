import React from 'react';
import { Image, StyleSheet, View, Text, Platform, TextStyle } from 'react-native';
import { Typings, Delegate } from '../../../standard';

export type Props = Typings.Action.Display.Params<Typings.Message.TextBody>;

export default class extends React.PureComponent<Props> {
    protected textArr: string[];

    constructor(props: Props) {
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
        this.props.enableBubble(true);
    }
    
    render() {
        // TODO URL、电话支持，居中对齐
        return (
            <View style={styles.view}>
                {this.textArr.map(this._renderItem.bind(this))}
            </View>
        );
    }

    _renderItem(text: string, index: number) {
        const emojiImage = Delegate.model.Emoji.getEmoji(text);
        if (this._isEmoji(text) && emojiImage) {
            const isEmoji = index > 0 ? this._isEmoji(this.textArr[index - 1]) : false;
            const style = isEmoji ? {
                marginLeft: 3,
            } : {};
            return (
                <Image
                    key={index}
                    source={emojiImage}
                    style={[styles.image, style]}
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

    protected _isEmoji(text: string) {
        return text[0] === '[' && text[text.length - 1] === ']';
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'transparent',
        paddingHorizontal: 13,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 17,
        backgroundColor: 'transparent',
        ...Platform.select({
            android: {textAlignVertical: 'center'},
            ios: {lineHeight: 21},
        }),
        overflow: 'hidden',
    } as TextStyle,
    image: {
        width: 18,
        height: 18,
        marginVertical: 1,
        marginRight: 3,
        backgroundColor: 'transparent',
    },
});