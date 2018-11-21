import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropType from 'prop-types';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        key: PropType.string.isRequired,
        onPickEmoji: PropType.func,
        style: PropType.any,
        itemSize: PropType.number,
        tabViewHeight: PropType.number,
    };

    static defaultProps = {
        itemSize: 42,
        tabViewHeight: 30,
    };

    DeleteItem = '__emoji_pick_delete__';
    PlaceholderItem = '__emoji_pick_placeholder__';

    constructor(props) {
        super(props);
        this.state = {
            width: undefined,
            height: undefined,
            curIndex: 0,
        };
    }

    render() {
        const {style, tabViewHeight, key} = this.props;
        const tabStyle = {
            height: tabViewHeight,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: delegate.style.seperatorLineColor,
        };
        const emojis = delegate.model.Emoji.getPartEmojis(key);
        const collection = this._dataSource(emojis);
        return (
            <View onLayout={this._onLayout} style={[styles.view, style]}>
                {this._renderScrollView(collection)}
                <View style={[styles.tabview, tabStyle]}>
                    <delegate.component.SegmentControl
                        length={collection.pages}
                        currentIndex={this.state.curIndex}
                    />
                </View>
            </View>
        );
    }

    _renderScrollView = (collection) => {
        return (
            <ScrollView
                ref={v => this.scrollView = v}
                style={styles.scrollview}
                automaticallyAdjustContentInsets={false}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={this._onContentHorizontalScrollEnd}
                scrollEventThrottle={16}
            >
                {collection.data.map(this._renderPage.bind(this, collection))}
            </ScrollView>
        );
    };

    _renderPage = (collection, obj, index) => {
        const {marginH, marginV, numColumns} = collection;
        return (
            <FlatList
                key={index}
                style={{marginHorizontal: marginH, marginVertical: marginV}}
                data={obj}
                renderItem={this._renderItem}
                numColumns={numColumns}
                keyExtractor={item => item.text}
                showsVerticalScrollIndicator={false}
            />
        );
    };

    _renderItem = ({item}) => {
        const {text, image} = item;
        const style = {
            width: this.props.itemSize,
            height: this.props.itemSize,
        };
        if (text === this.PlaceholderItem) {
            return <View style={style} />;
        }
        return (
            <TouchableOpacity onPress={this._clickEmoji.bind(this, text)}>
                <View style={[styles.itemview, style]}>
                    <Image style={styles.icon} source={image} />
                </View>
            </TouchableOpacity>
        );
    };
    
    _onContentHorizontalScrollEnd = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.floor(offsetX / this.state.width);
        if (newIndex !== this.state.curIndex) {
            this.setState({
                curIndex: newIndex,
            });
        }
    };

    _clickEmoji = (text) => {
        const {onPickEmoji} = this.props;
        onPickEmoji && onPickEmoji(text, text === this.DeleteItem);
    };

    _onLayout = (event) => {
        const {width, height} = event.nativeEvent.layout;
        this.setState({
            width: width,
            height: height,
        });
    };

    _dataSource = (emojis) => {
        const [numColumns, marginH] = this._columnCount();
        const [numRows, marginV] = this._rowCount();
        const pageSize = numColumns * numRows - 1;
        const pages = (emojis.length - 1) / pageSize + 1;
        const dataArr = [];
        for (let i = 0; i < pages; i++) {
            const arr = emojis.slice(i * pageSize, (i + 1) * pageSize);
            if (arr.length < pageSize) {
                const gap = pageSize - arr.length;
                for (let j = 0; j < gap; j++) {
                    arr.push({text: this.PlaceholderItem});
                }
            }
            arr.push({
                text: this.DeleteItem,
                image: require('./image/emoji_delete.png'),
            });
            dataArr.push(arr);
        }
        return {data: dataArr, numRows, numColumns, marginH, marginV, pageSize, pages};
    };

    _columnCount = () => {
        const width = this.state.width;
        const minMarginH = 15;
        const numColumns = Math.floor((width - minMarginH * 2) / this.props.itemSize);
        const marginH = (width - this.props.itemSize * numColumns) / 2;
        return [numColumns, marginH];
    };

    _rowCount = () => {
        const height = this.state.height - this.props.tabViewHeight;
        const minMarginV = 4;
        const numRows = Math.floor((height - minMarginV * 2) / this.props.itemSize);
        const marginV = (height - this.props.itemSize * numRows) / 2;
        return [numRows, marginV];
    };
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    scrollview: {
        flexDirection: 'row',
    },
    tabview: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemview: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 28,
        height: 28,
    },
});