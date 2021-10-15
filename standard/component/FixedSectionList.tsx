import React from 'react';
import { Platform, LayoutAnimation, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import delegate from '../delegate';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import StickyContainer from 'recyclerlistview/sticky';

const ViewTypes = {
    CELL: 0,
    SECTION: 1,
    HEADER: 2,
    NULL: 3
};

export interface FixedSectionListProps {
    renderItem: (data: any) => JSX.Element | JSX.Element[] | null;
    renderSectionHeader: (title: String) => JSX.Element | JSX.Element[] | null;
    renderHeaderComponent: () => JSX.Element | JSX.Element[] | null;
    sections: Array<any>;
    itemHeight: number,
    sectionHeight: number,
    headerHeight: number,
    itemWidth: number,
    hasHeader: number,
    renderAheadOffset?: number;
}

export default class extends React.PureComponent<FixedSectionListProps> {

    static defaultProps = {
        headerHeight: 0,
        itemHeight: 0,
        sectionHeight: 0,
        itemWidth: 0,
    };
    _layoutProvider: LayoutProvider;
    headerIndexs: Array<number> = [];
    dataLength = 0;
    _dataProvider: DataProvider;

    constructor(props: FixedSectionListProps) {
        super(props);

        this._dataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });

        this._layoutProvider = new LayoutProvider(
            (index) => {
                if (props.hasHeader && index == 0) {
                    return ViewTypes.HEADER;
                }else if (this.headerIndexs.includes(index)) {
                    return ViewTypes.SECTION;
                } else if (index < this.dataLength) {
                    return ViewTypes.CELL;
                } else {
                    return ViewTypes.NULL;
                }
            },
            (type, dim) => {
                switch (type) {
                    case ViewTypes.SECTION:
                        dim.width = this.props.itemWidth;
                        dim.height = this.props.sectionHeight;
                        break;
                    case ViewTypes.CELL:
                        dim.width = this.props.itemWidth;
                        dim.height = this.props.itemHeight;
                        break;
                    case ViewTypes.HEADER:
                        dim.width = this.props.itemWidth;
                        dim.height = this.props.headerHeight;
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                }
            }
        );
        const dataList = this._setDataList(this.props.sections);
        this.state = {
            dataList: dataList,
            isShowBackTop: false
        }
    }

    _setDataList = (data: Array<any>)=>{
        let arr: Array<any> = [];
        let i = 0
        if (this.props.hasHeader) {
            arr[i] = i;
            i++;
        }

        this.headerIndexs = [];
        data.forEach(element => {
            const header = {key: element.key, title: element.title}
            arr[i] = header;
            this.headerIndexs.push(i);
            i++;
            element.data.forEach((ele: any) => {
                arr[i] = ele;
                i++;
            });
        });
        this.dataLength = arr.length;
        const dataList = this._dataProvider.cloneWithRows(arr);
        return dataList;
    }

    render() {
        const {sections = []} = this.props;
        return (
            <View style={styles.container}>
                <StickyContainer
                    stickyHeaderIndices={this.headerIndexs}
                    overrideRowRenderer={this._rowRenderer.bind(this)}>  
                    <RecyclerListView
                        ref={v => this.list = v}
                        layoutProvider={this._layoutProvider}
                        dataProvider={this.state.dataList}
                        rowRenderer={this._rowRenderer.bind(this)}
                        onScroll={this._onScroll.bind(this)}
                        renderAheadOffset = {this.props.renderAheadOffset}
                        canChangeSize = {true}
                    />
                </StickyContainer>
                {sections && sections.length > 0 && <delegate.component.SelectList
                    sections={['↑'].concat(sections.map(i => i.key))}
                    onItemChange={this._scrollToLocation}
                />}
                {this.state.isShowBackTop && this._renderBackTop()}
            </View>
        );
    }

    _rowRenderer = (type, data)=> {
        switch (type) {
            case ViewTypes.SECTION: {
                return this.props.renderSectionHeader(data.title);
            };
            case ViewTypes.CELL: {
                return this.props.renderItem(data);
            };
            case ViewTypes.HEADER: {
                return this.props.renderHeaderComponent();
            };
            default:
                return null;
        }
    }

    _renderBackTop = () => {
        return (
            <TouchableHighlight
                style={styles.backTop}
                onPress={() => this.list.scrollToTop(false)}
            >
                <View>
                    <Text style={styles.backTopText}>
                        {'返回顶部'}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    };

    _scrollToLocation = (index) => {
        if (index == 0) {
            this.list.scrollToTop(false)
        } else {
            if (index - 1 < this.headerIndexs.length) {
                this.list.scrollToIndex(this.headerIndexs[index - 1], false) 
            }
        }
    };

    _onScroll = (event) => {
        const {contentOffset: {y}, layoutMeasurement: {height}} = event.nativeEvent;
        const needShowBtn = y > height;
        if (needShowBtn && !this.state.isShowBackTop) {
            this._showBackTopBtn(true);
        } else if (!needShowBtn && this.state.isShowBackTop) {
            this._showBackTopBtn(false);
        }
    };

    _showBackTopBtn = (isShow) => {
        Platform.OS === 'ios' && LayoutAnimation.easeInEaseOut();
        this.setState({
            isShowBackTop: isShow,
        });
    };
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
    },
    backTop: {
        borderTopLeftRadius: 13,
        height: 26,
        borderBottomLeftRadius: 13,
        borderWidth: 2,
        borderRightWidth: 0,
        borderColor: '#e15151',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        position: 'absolute',
        right: 0,
        bottom: 48,
    },
    backTopText: {
        color: '#e15151',
        fontSize: 11,
    },
});