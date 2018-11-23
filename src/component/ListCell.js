import React from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import * as Types from '../proptype';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        avatar: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.shape(Types.BasicConversation),
            PropTypes.shape({
                uri: PropTypes.string,
            })
        ]),
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
        labels: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            color: PropTypes.string,
        })),
        subTitle: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
            PropTypes.array
        ]),
        onClick: PropTypes.func,
        onLongPress: PropTypes.func,
        right: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element),
            PropTypes.func,
        ]),
    };

    static defaultProps = {
        labels: [],
    };

    render() {
        const {onClick, onLongPress} = this.props;
        const content = this._renderContent();
        return onClick || onLongPress ? (
            <TouchableHighlight onPress={onClick} onLongPress={onLongPress}>
                {content}
            </TouchableHighlight>
        ) : content;
    }

    _renderContent = () => {
        const {style, subTitle, right} = this.props;
        return (
            <View style={[styles.container, style]}>
                {this._renderIcon()}
                <View style={styles.layout}>
                    {this._renderTitleLine()}
                    {subTitle && (
                        <Text style={styles.subTitle} numberOfLines={1}>
                            {subTitle}
                        </Text>
                    )}
                </View>
                {typeof right === 'function' ? right() : right}
            </View>
        );
    };

    _renderTitleLine = () => {
        const {title, labels} = this.props;
        return (
            <View style={styles.titleline}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                {labels.map(this._renderLabel)}
            </View>
        );
    };
    
    _renderIcon = () => {
        const {avatar} = this.props;
        const isAvatar = Object.prototype.isPrototypeOf(avatar) && avatar.imId;
        if (isAvatar) {
            return (
                <delegate.component.AvatarImage
                    {...avatar}
                    style={styles.avatar}
                />
            );
        } else {
            const src = typeof avatar === 'string' ?
                {uri: delegate.func.fitUrlForAvatarSize(avatar, 48)} :
                avatar;
            return <Image style={styles.icon} source={src} />;
        }
    };

    _renderLabel = ({name, color}, index) => {
        return (
            <View key={index} style={[styles.label, {borderColor: color}]}>
                <Text style={[styles.labelText, {color}]}>
                    {name}
                </Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        backgroundColor: 'white',
    },
    icon: {
        height: 48,
        width: 48,
        borderRadius: 24,
        overflow: 'hidden',
    },
    avatar: {
    },
    layout: {
        flex: 1,
        marginLeft: 13,
        height: 68,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    titleline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        color: '#333333',
    },
    label: {
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    labelText: {
        paddingHorizontal: 2,
        fontSize: 13,
    },
    subTitle: {
        fontSize: 14,
        color: '#999999',
        marginTop: 8,
    },
});