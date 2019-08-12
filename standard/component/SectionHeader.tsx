import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        height: PropTypes.number,
    };

    static defaultProps = {
        height: 32,
    };

    render() {
        const {title, height} = this.props;
        const style = {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: delegate.style.separatorLineColor,
            borderTopWidth: StyleSheet.hairlineWidth,
            height: height,
        };
        return (
            <View style={[styles.section, style]}>
                <Text style={styles.sectionText} numberOfLines={1}>
                    {title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    section: {
        justifyContent: 'center',
        paddingLeft: 16,
        backgroundColor: '#f7f7f9',
    },
    sectionText: {
        fontSize: 14,
        color: '#666666',
    },
});