import React from 'react';
import { Image, ImageRequireSource, ImageURISource, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Conversation } from '../../model';
import delegate from '../../delegate';

/**
 * 组件的属性。
 */
export interface Props extends Conversation.Props {
    /**
     * 自定义外部视图样式。
     */
    style?: StyleProp<ViewStyle>;
    /**
     * 视图的边长，头像长宽相等，(仅用于defaultProps)。
     */
    edge: number;
    /**
     * 内部小头像的间距，(仅用于defaultProps)。
     */
    internal: number;
}

/**
 * 头像组件，可以根据聊天类型，展示单聊和群聊的头像。
 * 其中单聊头像为人员头像，群聊头像为多个人员头像组合。
 */
export default class extends React.Component<Props> {
    static defaultProps = {
        edge: 48.0,
        internal: 2,
    };

    /**
     * 群聊时的头像布局行数和每行人员头像数量信息。
     */
    protected groupLayout = [
        {layout: [1], lines: 1},
        {layout: [2], lines: 1},
        {layout: [1, 3], lines: 2},
        {layout: [2, 4], lines: 2},
    ];

    render() {
        const {edge, internal, style} = this.props;
        const {lines, avatar, layout} = this._getLayout();
        let innerView = null;
        if (layout) {
            const len = layout.reduce((prv, cur) => Math.max(prv, cur.length), lines);
            const itemEdge = (edge - internal * (len - 1)) / len;
            innerView = layout.map(this._renderRow.bind(this, itemEdge));
        } else if (avatar) {
            innerView = this._renderGroupAvatar(avatar);
        }
        return (
            <View style={[styles.view, {width: edge, height: edge}, style]}>
                {innerView}
            </View>
        );
    }

    /**
     * 渲染群组自定义头像。
     * @param avatar 自定义头像。
     * @protected
     */
    protected _renderGroupAvatar(avatar: ImageRequireSource | ImageURISource) {
        const {edge} = this.props;
        if (delegate.API.User.fitAvatarForSize) {
            avatar = delegate.API.User.fitAvatarForSize(avatar, edge);
        }
        return this._renderImage(edge, avatar);
    }

    /**
     * 渲染一行用户头像。
     * @param height 行的高度。
     * @param rowIds 待渲染的用户ID列表。
     * @param index 视图的Key。
     * @protected
     */
    protected _renderRow(height: number, rowIds: string[], index: number) {
        const marginTop = index > 0 ? this.props.internal : 0;
        return (
            <View key={index} style={[styles.row, {height, marginTop}]}>
                {rowIds.map(this._renderItem.bind(this, height))}
            </View>
        );
    }

    /**
     * 渲染单个用户头像。
     * @param itemEdge 头像大小。
     * @param userId 用户ID。
     * @param index 视图的Key。
     * @protected
     */
    protected _renderItem(itemEdge: number, userId: string, index: number) {
        const image = this._toImage(userId, itemEdge);
        const marginLeft = index > 0 ? this.props.internal : 0;
        let defaultImage = delegate.API.User.getDefaultUserHeadImage(userId);
        if (delegate.API.User.fitAvatarForSize) {
            defaultImage = delegate.API.User.fitAvatarForSize(defaultImage, itemEdge);
        }
        return this._renderImage(itemEdge, image, defaultImage, {marginLeft}, index);
    }

    /**
     * 通用的渲染图片方法。
     * @param edge 图片大小。
     * @param sourceImage 图片内容。
     * @param defaultImage 默认图片内容。
     * @param style 自定义样式
     * @param key 视图的Key。
     * @protected
     */
    protected _renderImage(
        edge: number,
        sourceImage: ImageRequireSource | ImageURISource,
        defaultImage?: ImageRequireSource | ImageURISource,
        style?: StyleProp<ImageStyle>,
        key?: number
    ) {
        return (
            <Image
                key={key}
                source={sourceImage}
                defaultSource={defaultImage}
                style={[styles.cell, {
                    width: edge,
                    height: edge,
                    borderRadius: edge / 2.0,
                }, style]}
            />
        );
    }

    /**
     * 将用户Id转换为对应的图片。
     * @param userId 用户ID。
     * @param itemEdge 图片大小。
     * @protected
     */
    protected _toImage(userId: string, itemEdge: number) {
        let image: ImageRequireSource | ImageURISource;
        const user = delegate.API.User.getUser(userId);
        if (user.avatar) {
            if (delegate.API.User.fitAvatarForSize) {
                image = delegate.API.User.fitAvatarForSize(user.avatar, itemEdge);
            } else {
                image = user.avatar;
            }
        } else {
            image = delegate.API.User.getDefaultUserHeadImage(user.userId);
        }
        return image;
    }

    /**
     * 获取布局信息，返回对象中：lines表示行数。
     * 如果存在avatar，则表示直接使用图片。
     * 否则使用layout，这是个二维数组，表示每一行每一列的用户头像信息，每个元素是用户ID。
     * @protected
     */
    protected _getLayout() {
        const {imId, chatType} = this.props;
        // 群聊判断是否有自定义头像
        if (chatType === Conversation.ChatType.Group) {
            const group = delegate.Manager.Group.getOne(imId);
            const avatar = group.avatar();
            // 有自定义头像，直接使用。
            if (avatar) {
                return {
                    lines: 1,
                    avatar: avatar,
                };
            }
            // 没有自定义头像，用群主+群成员的用户ID代替表示。
            else {
                const members = group.members(true);
                const lens = Math.min(members.length, this.groupLayout.length);
                const item = this.groupLayout[lens - 1];
                const layoutIds = item.layout.map((num, index) => {
                    return index === 0 ?
                        members.slice(0, num) :
                        members.slice(item.layout[index - 1], num);
                });
                return {
                    lines: item.lines,
                    layout: layoutIds,
                };
            }
        }
        // 单聊直接使用用户ID表示头像。
        else {
            return {
                lines: 1,
                layout: [[imId]],
            };
        }
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'transparent',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cell: {
        overflow: 'hidden',
    },
});