import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DisplayProps } from '../proptype';

export default class extends React.PureComponent {
    static propTypes = DisplayProps({});

    static defaultProps = {
        defaultMessage: '当前版本暂不支持该消息',
    };

    componentDidMount() {
        this.props.enableBubble && this.props.enableBubble(true);
    }
    
    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.text}>
                    {this.props.defaultMessage}
                </Text>
            </View>
        );
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
    },
    text: {
        fontSize: 16,
        backgroundColor: 'transparent',
    },
});