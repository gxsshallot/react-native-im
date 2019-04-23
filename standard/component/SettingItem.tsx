import React from 'react';
import { Image, StyleSheet, Switch, Text, View, TouchableHighlight, ImageURISource, ImageRequireSource } from 'react-native';
import ArrowImage from '@hecom/image-arrow';
import { Component } from '../typings';
import delegate from '../delegate';

export type Props = Component.SettingItemProps;

export default class extends React.PureComponent<Props> {
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

    protected _renderLine() {
        const {title, type, onPressLine} = this.props;
        const hasArrow = type !== Component.SettingItemType.Switch && onPressLine;
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

    protected _renderLabel(title: string) {
        return (
            <View style={styles.titleview}>
                <Text numberOfLines={1} style={styles.title}>
                    {title}
                </Text>
            </View>
        );
    }

    protected _renderContent() {
        const {type, onPressSwitch} = this.props;
        if (type === Component.SettingItemType.Text) {
            const {data = ''} = this.props;
            return (
                <Text numberOfLines={1} style={styles.subtitle}>
                    {data as string}
                </Text>
            );
        } else if (type === Component.SettingItemType.Image) {
            const {data} = this.props;
            return data ? (
                <Image
                    style={styles.image}
                    source={data as ImageURISource | ImageRequireSource}
                />
            ) : null;
        } else if (type === Component.SettingItemType.Switch) {
            const {data = false} = this.props;
            return (
                <Switch
                    onValueChange={onPressSwitch}
                    value={data as boolean}
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
        width: 120,
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