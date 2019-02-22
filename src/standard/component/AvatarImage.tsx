import * as React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import delegate from '../delegate';
import { Component } from '../typings';
import * as Constant from '../constant';

export default class extends React.Component<Component.AvatarImageProps> {
    protected groupLayout: Layout[] = [
        {layout: [1], lines: 1},
        {layout: [2], lines: 1},
        {layout: [1, 3], lines: 2},
        {layout: [2, 4], lines: 2},
    ];

    render() {
        const {lines, layout} = this._getLayout();
        const len = layout.reduce((prv, cur) => Math.max(prv, cur.length), lines);
        const itemEdge = (edge - internal * (len - 1)) / len;
        return (
            <View style={[styles.view, this.props.style]}>
                {layout.map(this._renderRow.bind(this, itemEdge))}
            </View>
        );
    }

    protected _renderRow(height: number, rowArr: Avatar[], index: number) {
        const marginTop = index > 0 ? internal : 0;
        return (
            <View key={index} style={[styles.row, {height, marginTop}]}>
                {rowArr.map(this._renderItem.bind(this, height))}
            </View>
        );
    }

    protected _renderItem(itemEdge: number, item: Avatar, index: number) {
        const image = this._toImage(item, itemEdge);
        const marginLeft = index > 0 ? internal : 0;
        return (
            <Image
                key={index}
                source={image}
                style={[styles.cell, {
                    width: itemEdge,
                    height: itemEdge,
                    borderRadius: itemEdge / 2.0,
                    marginLeft,
                }]}
            />
        );
    }

    protected _toImage(item: Avatar, itemEdge: number): ImageSourcePropType {
        let image: ImageSourcePropType;
        if (item.userId) {
            const user = delegate.user.getUser(item.userId);
            if (user.avatar) {
                image = {uri: delegate.func.fitUrlForAvatarSize(user.avatar, itemEdge)};
            } else {
                image = delegate.func.getDefaultUserHeadImage(user.userId);
            }
        } else {
            image = {uri: item.avatar};
        }
        return image;
    }

    protected _getLayout(): RenderLine {
        const {imId, chatType} = this.props;
        if (chatType === Constant.ChatType.Group) {
            const avatar = delegate.model.Group.getAvatar(imId);
            if (avatar) {
                return {
                    lines: 1,
                    layout: [[{avatar: avatar}]],
                };
            } else {
                const memberImIds = delegate.model.Group.getMembers(imId, true);
                const lens = Math.min(memberImIds.length, this.groupLayout.length);
                const item = this.groupLayout[lens - 1];
                const layoutIds = item.layout.map((num, index) => {
                    const ids = index === 0 ?
                        memberImIds.slice(0, num) :
                        memberImIds.slice(item.layout[index - 1], num);
                    return ids.map(i => ({userId: i}));
                });
                return {
                    lines: item.lines,
                    layout: layoutIds,
                };
            }
        } else {
            return {
                lines: 1,
                layout: [[{userId: imId}]],
            };
        }
    }
}

export interface Layout {
    layout: number[];
    lines: number;
}

export interface Avatar {
    userId?: string;
    avatar?: string;
}

export interface RenderLine {
    layout: Avatar[][];
    lines: number;
}

const edge = 48.0;
const internal = 2;

const styles = StyleSheet.create({
    view: {
        height: edge,
        width: edge,
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