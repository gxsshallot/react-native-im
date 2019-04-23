import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DateUtil } from '../util';

export default class extends React.PureComponent {
    static propTypes = {
        time: PropTypes.number.isRequired,
    };

    render() {
        return (
            <Text style={styles.text} numberOfLines={1}>
                {DateUtil.showDateTime(this.props.time, true)}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        alignSelf: 'center',
        backgroundColor: '#D4D4D4',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4,
        color: '#FFFFFF',
        marginBottom: 10,
        fontSize: 11,
        overflow: 'hidden',
    },
});