import React from 'react';
import { Platform, StyleSheet, Text, TextStyle, TouchableWithoutFeedback } from 'react-native';
import { Message } from 'react-native-im/standard/typings';
import { Model as MsgModel } from '../../../standard';

interface Props {
    message: Message.General;
    maxWidth: number,
    paddingLeft: number,
    paddingRight: number,
    innerMaxWidth: number,
}

export default class QuoteMsgBubble extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
    }


    render() {

        const { message: { data: { quoteMsg } }, maxWidth, paddingRight } = this.props;

        return quoteMsg ? (
            <TouchableWithoutFeedback
                onPress={this._onPress.bind(this)}
            >
                <Text
                    style={[styles.quoteText, { maxWidth: maxWidth, paddingLeft: paddingRight, paddingRight: paddingRight }]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                >
                    {(MsgModel.Quote.msgDescResolver.get(quoteMsg.type) as Function)(quoteMsg)}
                </Text>
            </TouchableWithoutFeedback>
        ) : null;
    }

    protected _onPress() {
        const { message: { data: { quoteMsg: quoteMsg } } } = this.props;
        (MsgModel.Quote.msgClickHandleResolver.get(quoteMsg.type) as Function)(quoteMsg);
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    quoteText: {
        height: 20,
        fontSize: 13,
        marginTop: 3,
        paddingTop: 2,
        alignContent: "center",
        paddingBottom: 2,
        borderRadius: 3,
        backgroundColor: '#cccccc',
        ...Platform.select({
            android: { textAlignVertical: 'center' },
        }),
        overflow: 'hidden',
    } as TextStyle,
    view: {
        backgroundColor: 'transparent',
        paddingHorizontal: 13,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
});