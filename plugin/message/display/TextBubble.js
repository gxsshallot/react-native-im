import React from 'react';
import { StyleSheet, Platform, Text } from 'react-native';
import { DisplayProps, TextMessage } from '../proptype';

export default class extends React.PureComponent {
    static propTypes = DisplayProps(TextMessage);

    componentDidMount() {
        this.props.enableBubble && this.props.enableBubble(true);
    }
    
    render() {
        const {message: {data: {text}}} = this.props;
        // TODO 表情和URL、电话支持，居中对齐
        return (
            <Text style={styles.text}>
                {text}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        marginBottom: 12,
        marginTop: 12,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'transparent',
        ...Platform.select({
            android: {textAlignVertical: 'center',},
            ios: {lineHeight: 18,},
        }),
    },
});