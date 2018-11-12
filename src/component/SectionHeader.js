import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
    };

    render() {
        const { title } = this.props;
        const style = {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: delegate.style.seperatorLineColor,
        }
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
        height: 25,
        justifyContent: 'center',
        paddingLeft: 16,
        backgroundColor: '#e1e1e1',
    },
    sectionText: {
        fontSize: 13,
        color: '#666666',
    },
});