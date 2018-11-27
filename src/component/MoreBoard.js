import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import * as Types from '../proptype';
import * as Constant from '../constant';

export default class extends React.PureComponent {
    static propTypes = {
        ...Types.BasicConversation,
        getItems: PropTypes.func,
        onDataChange: PropTypes.func.isRequired,
        navigation: PropTypes.any,
    };

    static defaultProps = {};

    itemWidth = 60;
    
    render() {
        const { imId, chatType, getItems } = this.props;
        const allItems = getItems(imId, chatType);
        return (
            <View style={styles.view}>
                {items.map((rowData, rowIndex) => (
                    <View key={rowIndex} style={styles.rowContainer}>
                        {rowData.map((item, itemIndex) => {
                            if (item.text) {
                                return this._renderItem(item, itemIndex);
                            } else {
                                return this._renderEmptyItem(itemIndex);
                            }
                        })}
                    </View>
                ))}
            </View>
        );
    }

    _renderItem = (item, index) => {
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
        return <View key={index} style={styles.cellEmpty} />;
    };

    _onDataChange = (messageType, messageBody) => {
        const {onDataChange} = this.props;
        onDataChange && onDataChange({
            type: messageType,
            body: messageBody,
        });
    };
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: '#f5f5f6',
        height: 240,
        borderTopColor: '#dddddd',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    rowContainer: {
        flexDirection: 'row',
        paddingHorizontal: 29,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cellContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 21,
    },
    cellEmpty: {
        width: 60,
        height: 60,
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