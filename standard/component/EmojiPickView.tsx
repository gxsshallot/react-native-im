import React from 'react';
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import delegate from '../delegate';

interface Props {
    key: string;
    height: number;
    onPickEmoji: () => void;
    style: any;
    itemSize: number;
    tabViewHeight: number;
}

interface State {
    width: number;
    curIndex: number;
}

export default class extends React.PureComponent<Props, State> {
    static defaultProps = {
        itemSize: 42,
        tabViewHeight: 30,
    };

    DeleteItem = '__emoji_pick_delete__';
    PlaceholderItem = '__emoji_pick_placeholder__';

    scrollView: ScrollView;

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            curIndex: 0,
        };
    }

    render() {
        const {style, tabViewHeight, key, height} = this.props;
        const tabStyle = {
            height: tabViewHeight,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: delegate.style.separatorLineColor,
        };
        const emojis = delegate.model.Emoji.getPartEmojis(key);
        const collection = this._dataSource(emojis);
        const isValid = this.state.width > 0;
        return (
            <View onLayout={this._onLayout} style={[styles.view, {height}, style]}>
                {this._renderScrollView(collection)}
                <View style={[styles.tabview, tabStyle]}>
                    {isValid && (
                        <delegate.component.SegmentControl
                            length={collection.pages}
                            currentIndex={this.state.curIndex}
                        />
                    )}
                </View>
            </View>
        );
    }

    _renderScrollView = (collection) => {
        const {height} = this.props;
        return (
            <ScrollView
                ref={v => this.scrollView = v}
                style={[styles.scrollview, {height}]}
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
        const {width, height} = Dimensions.get('window')
        return (
            <FlatList
                key={index + (width > height ? 'h' : 'v')}
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
            return <View style={style}/>;
        }
        return (
            <TouchableOpacity onPress={this._clickEmoji.bind(this, text)}>
                <View style={[styles.itemview, style]}>
                    <Image style={styles.icon} source={image}/>
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
        const {width} = event.nativeEvent.layout;
        this.setState({
            width: width,
        });
    };

    _dataSource = (emojis) => {
        const [numColumns, marginH] = this._columnCount();
        const [numRows, marginV] = this._rowCount();
        const pageSize = numColumns * numRows - 1;
        const pages = Math.ceil(emojis.length / pageSize);
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
        const height = this.props.height - this.props.tabViewHeight;
        const minMarginV = 4;
        const numRows = Math.floor((height - minMarginV * 2) / this.props.itemSize);
        const marginV = (height - this.props.itemSize * numRows) / 2;
        return [numRows, marginV];
    };
}

const styles = StyleSheet.create({
    view: {},
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
