import React from 'react';
import { Image, StyleSheet, Switch, Text, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import ArrowImage from '@hecom/image-arrow';
import * as Constant from '../constant';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        type: PropTypes.oneOf(Object.values(Constant.SettingItemType)),
        data: PropTypes.any,
        onPressLine: PropTypes.func,
        onPressSwitch: PropTypes.func,
    };

    render() {
        const {onPressLine} = this.props;
        return onPressLine ? (
            <TouchableHighlight
                underlayColor={delegate.style.separatorLineColor}
                onPress={onPressLine}
            >
                {this._renderLine()}
            </TouchableHighlight>
        ) : this._renderLine();
    }

    _renderLabel(title) {
        return (
            <View style={styles.titleview}>
                <Text numberOfLines={1} style={styles.title}>
                    {title}
                </Text>
            </View>
        );
    }

    _renderLine() {
        const {title, type, onPressLine} = this.props;
        const hasArrow = type !== Constant.SettingItemType.Switch && onPressLine;
        return (
            <View style={styles.container}>
                <View style={styles.line}>
                    {this._renderLabel(title)}
                    <View style={styles.content}>
                        {this._renderContent()}
                    </View>
                    {hasArrow && <ArrowImage />}
                </View>
            </View>
        );
    }

    _renderContent() {
        const {type, data, onPressSwitch} = this.props;
        if (type === Constant.SettingItemType.Text) {
            return (
                <Text numberOfLines={1} style={styles.subtitle}>
                    {data}
                </Text>
            );
        } else if (type === Constant.SettingItemType.Image) {
            return (
                <Image
                    style={styles.image}
                    source={data}
                />
            );
        } else if (type === Constant.SettingItemType.Switch) {
            return (
                <Switch
                    onValueChange={onPressSwitch}
                    value={data}
                />
            );
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    line: {
        height: 48,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    titleview: {
        height: 48,
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        color: '#333333',
    },
    subtitle: {
        fontSize: 14,
        color: '#aaaaaa',
        marginHorizontal: 12,
    },
    image: {
        width: 30,
        height: 30,
        marginHorizontal: 12,
    },
});