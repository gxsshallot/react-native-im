import React from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getSafeAreaInset} from '@hecom/react-native-pure-navigation-bar';
import * as Model from '../model';
import BottomBar from './BottomBar';

export default class extends React.PureComponent {
    static propTypes = {
        ...BottomBar.propTypes,
    };

    static defaultProps = {
        getItems: () => [],
    };

    itemWidth = 60;
    lineHeight = 120;
    innerHorizontal = 30;

    render() {
        const {imId, chatType, getItems} = this.props;
        const allItems = getItems(imId, chatType);
        const {width, height} = Dimensions.get('window');
        let pageSize;
        if (width < height) {
            pageSize = 8;
        } else {
            const safeInset = getSafeAreaInset();
            pageSize = Math.floor((width - safeInset.left - safeInset.right - this.innerHorizontal * 2) / this.itemWidth) * 2;
        }
        const count = Math.floor((allItems.length - 1) / pageSize) + 1;
        const style = {
            height: this.lineHeight * 2,
        };
        return (
            <View style={[styles.view, style]}>
                {new Array(count).fill(1).map((_, pageNumber) => {
                    return this._renderPage(allItems, pageNumber, pageSize);
                })}
            </View>
        );
    }

    _renderPage = (allItems, pageNumber, pageSize) => {
        const func = (base, size) => {
            const items = [];
            for (let i = base; i < base + size; i++) {
                if (i < allItems.length) {
                    items.push(allItems[i]);
                } else {
                    items.push(null);
                }
            }
            return items;
        };
        const base = pageNumber * pageSize;
        const upLine = func(base, pageSize / 2);
        const downLine = func(base + pageSize / 2, pageSize / 2);
        return (
            <View key={pageNumber} style={{paddingHorizontal: this.innerHorizontal}}>
                <View style={[styles.rowContainer]}>
                    {upLine.map(this._renderCell)}
                </View>
                <View style={[styles.rowContainer]}>
                    {downLine.map(this._renderCell)}
                </View>
            </View>
        );
    };

    _renderCell = (item, index) => {
        if (item === null) {
            return this._renderEmptyItem(index);
        } else {
            return this._renderItem(item, index);
        }
    };

    _renderItem = (action, index) => {
        const item = Model.Action.MoreBoard.get(
            action,
            {imId: this.props.imId, chatType: this.props.chatType, action},
            undefined
        );
        if (!item) {
            return this._renderEmptyItem(index);
        }
        const onPressParams = {
            onDataChange: this._onDataChange.bind(this, item.messageType),
            navigation: this.props.navigation,
        };
        return (
            <TouchableOpacity
                key={index}
                activeOpacity={0.6}
                onPress={item.onPress.bind(this, onPressParams)}
            >
                <View style={styles.cellContainer}>
                    <View style={styles.cellImgContainer}>
                        <Image
                            style={styles.cellImage}
                            source={item.icon}
                        />
                    </View>
                    <Text numberOfLines={1} style={styles.cellText}>
                        {item.text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    _renderEmptyItem = (index) => {
        const style = {
            width: this.itemWidth,
            height: this.lineHeight,
        };
        return <View key={index} style={style} />;
    };

    _onDataChange = (messageType, messageBody) => {
        if (Array.isArray(messageBody)) {
            this.props.onSendMultiMessage({type: messageType, bodies: messageBody})
        } else {
            this.props.onSendMessage({
                type: messageType,
                body: messageBody,
            });
        }
    };
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: '#f5f5f6',
        borderTopColor: '#dddddd',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cellContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 21,
    },
    cellImgContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#dfdfdf',
        borderRadius: 12,
        overflow: 'hidden',
    },
    cellImage: {
        width: 35,
        height: 35,
    },
    cellText: {
        marginTop: 7,
        fontSize: 12,
        width: 55,
        color: '#999999',
        textAlign: 'center'
    },
});