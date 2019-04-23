import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import i18n from 'i18n-js';
import { Typings } from '../../../standard';

export type Props = Typings.Action.Display.Params;

export default class extends React.PureComponent<Props> {
    componentDidMount() {
        this.props.enableBubble(true);
    }
    
    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.text}>
                    {i18n.t('IMToastMessageNotSupport')}
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