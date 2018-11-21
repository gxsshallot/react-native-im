import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import delegate from '../delegate';
import * as Types from '../proptype';
import * as Constant from '../constant';

export default class extends React.PureComponent {
    static propTypes = {
        ...Types.BasicConversation,
        style: PropTypes.any,
    };

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

    _renderRow = (height, rowArr, index) => {
        const marginTop = index > 0 ? internal : 0;
        return (
            <View key={index} style={[styles.row, {height, marginTop}]}>
                {rowArr.map(this._renderItem.bind(this, height))}
            </View>
        );
    };

    _renderItem = (itemEdge, item, index) => {
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
    };
    
    _toImage = (item, itemEdge) => {
        if (item.custom) {
            return {uri: item.custom};
        }
        const user = delegate.user.getUser(item.userId);
        let image;
        if (user && user.avatar) {
            image = {uri: delegate.func.fitUrlForAvatarSize(user.avatar, itemEdge)};
        } else {
            const userId = user ? user.userId : null;
            image = delegate.func.getDefaultUserHeadImage(userId);
        }
        return image;
    };

    groupLayout = [
        {layout: [1], lines: 1},
        {layout: [2], lines: 1},
        {layout: [1, 3], lines: 2},
        {layout: [2, 4], lines: 2},
    ];

    _getLayout = () => {
        const {imId, chatType} = this.props;
        if (chatType === Constant.ChatType.Single) {
            return {
                lines: 1,
                layout: [[{userId: imId}]],
            };
        } else if (chatType === Constant.ChatType.Group) {
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
        }
    };
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