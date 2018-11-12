import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { getSafeAreaInset } from 'react-native-pure-navigation-bar';
import * as PageKeys from '../pagekey';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        owner: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.string),
        canAdd: PropTypes.bool,
        canRemove: PropTypes.bool,
        onAddMembers: PropTypes.func,
        onRemoveMembers: PropTypes.func,
        navigation: PropTypes.object.isRequired,
        titleChooseGroupMember: PropTypes.string,
    };

    static defaultProps = {
        canAdd: true,
        canRemove: true,
        titleChooseGroupMember: '选择群成员',
    };

    add = '__add__';
    remove = '__remove__';
    padding = 16;
    itemEdge = 50;
    itemMargin;

    componentDidMount() {
        Dimensions.addEventListener('change', this._onOrientationChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this._onOrientationChange);
    }

    render() {
        const dataSource = this._getDataSource();
        return (
            <View>
                {dataSource.map(this._renderRow)}
            </View>
        );
    }

    _renderRow = (rowData, rowIndex) => {
        return (
            <View
                key={rowIndex}
                style={[styles.row, {paddingHorizontal: this.padding}]}
            >
                {rowData.map(this._renderItem)}
            </View>
        );
    };

    _renderItem = (item, index) => {
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
    };

    _onOrientationChange = () => {
        this.forceUpdate();
    };

    _calculateColumn = () => {
        const {width, height} = Dimensions.get('window');
        const safeInset = getSafeAreaInset();
        const innerWidth = width - safeInset.left - safeInset.right;
        let column;
        if (width > height) {
            const preInternal = 30;
            column = Math.floor((innerWidth + preInternal) * 1.0 / (this.itemEdge + preInternal));
        } else {
            column = 5;
        }
        this.itemMargin = (innerWidth - column * this.itemEdge - this.padding * 2) * 1.0 / (column * 2);
        return column;
    };

    _getDataSource = () => {
        const column = this._calculateColumn();
        const maxRow = 3;
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
    };

    _getItemStatus = (rowItem) => {
        let title, isOwner, image;
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
    };

    _onItemPress = (rowItem) => {
        if (rowItem === this.add) {
            this.props.navigation.navigate({
                routeName: PageKeys.ChooseUser,
                params: {
                    title: this.props.titleChooseGroupMember,
                    multiple: true,
                    onSelectData: this._onAddData,
                    selectedIds: [],
                    excludedUserIds: this.props.data,
                },
            })
        } else if (rowItem === this.remove) {
            const dataSource = this.props.data
                .filter(item => item !== this.props.owner)
                .map(item => delegate.user.getUser(item));
            this.props.navigation.navigate({
                routeName: PageKeys.ChooseUser,
                params: {
                    title: this.props.titleChooseGroupMember,
                    multiple: true,
                    onSelectData: this._onRemoveData,
                    selectedIds: [],
                    dataSource: dataSource,
                },
            });
        } else {
            delegate.func.pushToUserDetailPage(rowItem);
        }
    };

    _onAddData = (data) => {
        this.props.onAddMembers && this.props.onAddMembers(data);
    };

    _onRemoveData = (data) => {
        this.props.onRemoveMembers && this.props.onRemoveMembers(data);
    };
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