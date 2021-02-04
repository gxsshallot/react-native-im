import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { getSafeAreaInset } from '@hecom/react-native-pure-navigation-bar';
import i18n from 'i18n-js';
import { Component } from '../typings';
import * as PageKeys from '../pagekey';
import delegate from '../delegate';
import { AllMembers } from 'react-native-im/plugin/setting';

export type Props = Component.AvatarListProps;

export default class extends React.PureComponent<Props> {
    protected readonly add = '__add__';
    protected readonly remove = '__remove__';
    protected readonly padding = 16;
    protected readonly itemEdge = 50;
    protected itemMargin = 0;

    constructor(props: Props) {
        super(props);
        this._onOrientationChange = this._onOrientationChange.bind(this);
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this._onOrientationChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this._onOrientationChange);
    }

    render() {
        const dataSource = this._getDataSource();
        const {tempProps} = this.props;
        return (
            <View>
                {dataSource.map(this._renderRow.bind(this))}
                {AllMembers.getUi(tempProps)}
            </View>
        );
    }

    protected _renderRow(rowData: string[], rowIndex: number) {
        return (
            <View
                key={rowIndex}
                style={[styles.row, {paddingHorizontal: this.padding}]}
            >
                {rowData.map(this._renderItem.bind(this))}
            </View>
        );
    }

    protected _renderItem(item: string, index: number) {
        const ownerImage = require('./image/group_owner.png');
        const {title, image, isOwner} = this._getItemStatus(item);
        const imageStyle = {
            width: this.itemEdge,
            height: this.itemEdge,
            borderRadius: this.itemEdge / 2,
        };
        return (
            <TouchableOpacity
                key={index}
                onPress={this._onItemPress.bind(this, item)}
                activeOpacity={0.8}
            >
                <View style={[styles.item, {marginHorizontal: this.itemMargin}]}>
                    <Image
                        style={imageStyle}
                        source={image}
                    />
                    {isOwner && (
                        <Image
                            source={ownerImage}
                            style={[styles.owner, imageStyle]}
                        />
                    )}
                    {title && (
                        <Text style={[styles.text, {width: this.itemEdge}]} numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    protected _onOrientationChange() {
        this.forceUpdate();
    }

    protected _calculateColumn(): number {
        const {width, height} = Dimensions.get('window');
        const safeInset = getSafeAreaInset();
        const innerWidth = width - safeInset.left - safeInset.right;
        let column = 0;
        if (width > height) {
            const preInternal = 30;
            column = Math.floor((innerWidth + preInternal) * 1.0 / (this.itemEdge + preInternal));
        } else {
            column = 5;
        }
        this.itemMargin = (innerWidth - column * this.itemEdge - this.padding * 2) * 1.0 / (column * 2);
        return column;
    }

    protected _getDataSource(): string[][] {
        const column = this._calculateColumn();
        const maxRow = 6;
        const {canAdd, canRemove, data} = this.props;
        const showCount = column * maxRow - (canAdd ? 1 : 0) - (canRemove ? 1 : 0);
        const newData = [...data.slice(0, showCount)];
        if (canAdd) {
            newData.push(this.add);
        }
        if (data.length > 1 && canRemove) {
            newData.push(this.remove);
        }
        let index = 0;
        const result = [];
        while (index < newData.length) {
            result.push(newData.slice(index, index += column));
        }
        return result;
    }

    protected _getItemStatus(rowItem: string) {
        let title = '', isOwner = false, image = null;
        if (rowItem === this.add || rowItem === this.remove) {
            title = null;
            isOwner = false;
            image = rowItem === this.add ?
                require('./image/groupset_add.png') :
                require('./image/groupset_lost.png');
        } else {
            const item = delegate.user.getUser(rowItem);
            title = item.name;
            isOwner = this.props.owner === item.userId;
            if (item.avatar && item.avatar.length > 0) {
                image = {uri: delegate.func.fitUrlForAvatarSize(item.avatar, this.itemEdge)};
            } else {
                image = delegate.func.getDefaultUserHeadImage(item.userId);
            }
        }
        return {title, image, isOwner};
    }

    protected _onItemPress(rowItem: string) {
        if (rowItem === this.add) {
            this.props.navigation.navigate(PageKeys.ChooseUser,{
                    title: i18n.t('IMSettingChooseGroupMember'),
                    multiple: true,
                    onSelectData: this.props.onAddMembers,
                    selectedIds: [],
                    excludedUserIds: this.props.data,
                });
        } else if (rowItem === this.remove) {
            const dataSource = this.props.data
                .filter(item => item !== this.props.owner)
                .map(item => delegate.user.getUser(item));
            this.props.navigation.navigate(PageKeys.ChooseUser,{
                    title: i18n.t('IMSettingChooseGroupMember'),
                    multiple: true,
                    onSelectData: this.props.onRemoveMembers,
                    selectedIds: [],
                    dataSource: dataSource,
		            hideRecentlyPerson: true
                });
        } else {
            delegate.func.pushToUserDetailPage(rowItem);
        }
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    item: {
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
        textAlign: 'center',
    },
    owner: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
