import React from 'react';
import { Image, Keyboard, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import NaviBar from '@hecom/react-native-pure-navigation-bar';
import SearchBar from 'react-native-general-searchbar';
import AsyncStorage from '@hecom/storage';
import { KeyboardAwareFlatList, KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import { Storage } from '../typings';
import delegate from '../delegate';

export default class extends React.Component {
    static propTypes = {
        searchText: PropTypes.string,
        searchHint: PropTypes.string,
        showHistory: PropTypes.bool,
        historyKey: PropTypes.string,
        doSearch: PropTypes.func.isRequired,
        doCustomSearch: PropTypes.func,
        onItemClick: PropTypes.func,
        itemKey: PropTypes.string,
        maxHistoryLength: PropTypes.number,
        maxSectionItemLength: PropTypes.number,
        onSectionFooterClick: PropTypes.func,
    };

    static defaultProps = {
        searchText: '',
        maxHistoryLength: 10,
        maxSectionItemLength: 5,
        showHistory: true,
        historyKey: 'search_history',
    };

    constructor(props) {
        super(props);
        this.state = {
            result: null,
            searchHistory: [],
            searchText: props.searchText,
        };
    }

    componentDidMount() {
        this.props.historyKey && this._initHistory();
        this.state.searchText && this._submit();
    }

    render() {
        const {
            renderSectionHeader,
            showHistory,
            ItemSeparatorComponent = this._renderDefaultSeparator,
            SectionSeparatorComponent = this._renderDefaultSeparator,
        } = this.props;
        const {result} = this.state;
        const List = renderSectionHeader ? KeyboardAwareSectionList : KeyboardAwareFlatList;
        return (
            <View style={styles.view}>
                <NaviBar
                    titleCenter={false}
                    style={naviBarStyle}
                    navbarHeight={50}
                    title={this._renderSearchBar()}
                />
                {showHistory && !result ? this._renderHistory() : (
                    <>
                        <List
                            {...this.props}
                            data={result || []}
                            sections={result || []}
                            ListEmptyComponent={this._renderEmpty('没有结果')}
                            renderSectionFooter={this._renderSectionFooter}
                            renderItem={this._renderResultItem()}
                            ItemSeparatorComponent={ItemSeparatorComponent}
                            SectionSeparatorComponent={SectionSeparatorComponent}
                        />
                        <SafeAreaView />
                    </>
                )}
            </View>
        );
    }

    _renderSearchBar = () => {
        const {searchHint} = this.props;
        return (
            <SearchBar
                style={searchBarStyle}
                placeholder={searchHint}
                autoFocus={true}
                searchText={this.state.searchText}
                canClear={true}
                onSubmitEditing={this._submit}
                onChangeText={this._onChangeSearchText}
            />
        );
    };

    _renderHistory = () => {
        return this.state.searchHistory.length > 0 ? (
            <View style={styles.list}>
                <View style={styles.listHeaderContainer}>
                    <Text style={styles.listHeaderText}>
                        {'搜索历史'}
                    </Text>
                    <TouchableOpacity
                        style={styles.clearHistoryBtn}
                        onPress={this._clearHistory}
                    >
                        <Image
                            style={styles.clearHistoryImage}
                            source={require('./image/delete.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.historyContainer}>
                    {this.state.searchHistory.map(this._renderHistoryRow)}
                </View>
            </View>
        ) : this._renderEmpty('暂无搜索历史');
    };

    _renderHistoryRow = (searchText) => {
        return (
            <TouchableHighlight
                key={searchText}
                style={styles.historyItemContainer}
                onPress={this._clickHistory.bind(this, searchText)}
            >
                <Text style={styles.historyItemText}>
                    {searchText}
                </Text>
            </TouchableHighlight>
        );
    };

    _renderSectionFooter = ({section: {title, hasMore}}) => {
        if (this.props.maxSectionItemLength && hasMore) {
            const onPress = () => {
                const {onSectionFooterClick} = this.props;
                onSectionFooterClick && onSectionFooterClick({
                    title,
                    searchText: this.state.searchText,
                });
            };
            return (
                <TouchableHighlight onPress={onPress}>
                    <View style={styles.footer}>
                        <Image
                            style={styles.footerImage}
                            source={require('./image/search.png')}
                        />
                        <Text style={styles.footerText}>
                            {'更多' + title}
                        </Text>
                    </View>
                </TouchableHighlight>
            );
        } else {
            return null;
        }
    };

    _renderResultItem = (renderItem = this.props.renderItem) => ({item, index}) => {
        const {onItemClick, itemKey} = this.props;
        const {searchText} = this.state;
        const onPress = () => {
            this._addHistory(item[itemKey]);
            onItemClick({item, index, searchText});
        };
        return onItemClick ? (
            <TouchableHighlight onPress={onPress}>
                {renderItem({item, index, searchText})}
            </TouchableHighlight>
        ) : renderItem({item, index, searchText});
    };

    _renderEmpty = (text) => {
        return (
            <View style={styles.emptyContainer}>
                <Image
                    style={styles.emptyImage}
                    source={require('./image/empty_search.png')}
                />
                <Text style={styles.emptyText}>
                    {text}
                </Text>
            </View>
        );
    };

    _renderDefaultSeparator = () => {
        const style = {
            backgroundColor: delegate.style.separatorLineColor,
        };
        return <View style={[styles.separator, style]} />;
    };

    _clickHistory = (searchText) => {
        this.setState({searchText}, () => {
            this._submit();
        });
    };

    _onChangeSearchText = (searchText) => {
        if (searchText === this.state.searchText) {
            return;
        }
        const state = {searchText};
        if (!searchText) {
            state.result = null;
        }
        this.setState(state, () => {
            this.props.searchOnTextChange && this._submit();
        });
    };

    _initHistory = () => {
        const myUserId = delegate.user.getMine().userId;
        return AsyncStorage.get([myUserId, this.props.historyKey], Storage.Part)
            .then((result) => {
                this.setState({searchHistory: result || []});
            })
            .catch(() => {
                console.log(this.props.historyKey + ' Failed');
            });
    };

    _addHistory = (text) => {
        const getNewHistory = () => {
            const history = [...this.state.searchHistory];
            if (history.indexOf(text) < 0) {
                history.unshift(text);
                if (history.length > this.props.maxHistoryLength) {
                    history.pop();
                }
            }
            return history;
        };
        if (this.props.historyKey) {
            const myUserId = delegate.user.getMine().userId;
            const history = getNewHistory();
            AsyncStorage.set([myUserId, this.props.historyKey], history, Storage.Part)
                .then(() => {
                    this.setState({searchHistory: history});
                });
        } else {
            const history = getNewHistory();
            this.setState({searchHistory: history});
        }
    };

    _clearHistory = () => {
        if (this.props.historyKey) {
            const myUserId = delegate.user.getMine().userId;
            AsyncStorage.set([myUserId, this.props.historyKey], [], Storage.Part)
                .then(() => {
                    this.setState({searchHistory: []});
                });
        } else {
            this.setState({searchHistory: []});
        }
    };

    _submit = (event) => {
        const text = event ? event.nativeEvent.text : this.state.searchText;
        if (text === undefined || text.length === 0) {
            return;
        }
        this.props.doCustomSearch && this.props.doCustomSearch(text).then((result) => {
            if (result && result.length > 0) {
                let stateResult = this.state.result || [];
                //去重
                stateResult = stateResult.filter((itemO) => {
                    return result.filter((itemT) => {
                        return itemO.title === itemT.title;
                    }).length == 0
                });
                stateResult.unshift(...result);
                this.setState({ result: stateResult });
            }
        })
        !this.props.onItemClick && this._addHistory(text);
        !this.props.searchOnTextChange && Keyboard.dismiss();
        const result = this.props.doSearch(text).filter(i => i);
        if (this.props.maxSectionItemLength) {
            result.forEach((section) => {
                const hasMore = section.data.length > this.props.maxSectionItemLength;
                if (hasMore) {
                    section.data = section.data.splice(0, this.props.maxSectionItemLength);
                }
                section.hasMore = hasMore;
            });
        }
        result.forEach((item) => {
            item.renderItem = item.renderItem && this._renderResultItem(item.renderItem);
        });
        this.setState({result});
    };
}

const naviBarStyle = {
    titleContainer: {
        paddingHorizontal: 0,
    },
    buttonView: {
        paddingHorizontal: 0,
    },
    gobackView: {
        paddingRight: 0,
    },
};

const searchBarStyle = {
    view: {
        flex: 1,
        backgroundColor: 'white',
        height: 42,
    },
    inputView: {
        backgroundColor: '#f7f7f9',
    },
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
    },
    emptyImage: {
        marginTop: 100,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 14,
        color: '#999999',
    },
    list: {
        flex: 1,
        backgroundColor: 'white',
    },
    listHeaderContainer: {
        height: 30,
        backgroundColor: '#eff1f1',
        alignItems: 'center',
        flexDirection: 'row',
    },
    listHeaderText: {
        flex: 1,
        marginLeft: 16,
        fontSize: 13,
        color: '#999999',
    },
    clearHistoryBtn: {
        height: 30,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearHistoryImage: {
        width: 18,
        height: 18,
    },
    historyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
    },
    historyItemContainer: {
        margin: 8,
        paddingVertical: 3,
        paddingHorizontal: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#666666'
    },
    historyItemText: {
        fontSize: 14,
        color: '#666666',
    },
    footer: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    footerText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 4,
    },
    footerImage: {
        width: 14,
        height: 14,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
    },
});
