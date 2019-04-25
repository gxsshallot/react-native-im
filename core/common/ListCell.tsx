import React from 'react';
import { GestureResponderEvent, Image, ImageRequireSource, ImageURISource, StyleProp, StyleSheet, Text, TouchableHighlight, View, ViewStyle } from 'react-native';
import { Conversation } from '../../model';
import delegate from '../../delegate';

export interface Props {
    /**
     * 头像，可以是图片信息，也可以是人员/群组信息。
     */
    avatar: ImageRequireSource | ImageURISource | Conversation.Props;
    /**
     * 主标题，可以是字符串，也可以是一个或多个视图。
     */
    title: string | React.ReactElement | React.ReactElement[];
    /**
     * 一组标签，位于主标题右侧，包括标签名称和颜色。
     */
    labels: Array<{
        name: string;
        color: string;
        backgroundColor: string;
    }>;
    /**
     * 副标题，可以是字符串，也可以是一个或多个视图。
     */
    subTitle: string | React.ReactElement | React.ReactElement[];
    /**
     * 右侧视图，可以是一个或多个视图，也可以是函数动态生成视图。
     */
    right: React.ReactElement | React.ReactElement[] |
        (() => React.ReactElement | React.ReactElement[]),
    /**
     * 点击单元格的回调事件。
     * @param event 手势响应事件。
     */
    onClick(event: GestureResponderEvent): void;
    /**
     * 长按单元格的回调事件。
     * @param event 手势响应事件。
     */
    onLongPress(event: GestureResponderEvent): void;
    /**
     * 自定义外部样式。
     */
    style?: StyleProp<ViewStyle>;
}

/**
 * 会话单元格视图。
 */
export default class extends React.PureComponent<Props> {
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
                    {!!subTitle && (
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