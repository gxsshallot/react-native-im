import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import NaviBar, { forceInset } from 'react-native-pure-navigation-bar';
import Listener from 'react-native-general-listener';
import Toast from 'react-native-root-toast';
import * as PageKeys from '../pagekey';
import * as Constant from '../constant';
import * as Types from '../proptype';
import { DateUtil } from '../util';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        ...Types.Navigation,
    };

    static defaultProps = {};
    
    constructor(props) {
        super(props);
        this.state = {
            groups: this._getGroups(),
        };
    }

    componentDidMount() {
        this.listenGroupLoaded = Listener.registerWithSubEvent(
            [Constant.BaseEvent, Constant.GroupEvent],
            this._refresh
        );
        delegate.model.Group.load()
            .then(this._refresh)
            .catch(() => Toast.show('加载群列表失败'));
    }

    componentWillUnmount() {
        Listener.unregister(
            [Constant.BaseEvent, Constant.GroupEvent],
            this.listenGroupLoaded
        );
    }
    
    render() {
        return (
            <View style={styles.view}>
                <NaviBar title='群聊' />
                <delegate.component.FakeSearchBar
                    onFocus={this._clickFakeSearchBar}
                    placeholder={'搜索'}
                />
                <SafeAreaView
                    style={styles.safeview}
                    forceInset={forceInset(0, 1, 1, 1)}
                >
                    <FlatList
                        style={styles.list}
                        data={this.state.groups}
                        renderItem={this._renderItem}
                        keyExtractor={(item) => item.groupId}
                        ListFooterComponent={this._renderFooterComponent()}
                    />
                </SafeAreaView>
            </View>
        );
    }

    _renderItem = ({item}) => {
        return (
            <delegate.component.ListCell
                avatar={{imId: item.groupId, chatType: Constant.ChatType.Group}}
                title={delegate.model.Group.getName(item.groupId)}
                subTitle={'' + item.memberObjList.length + '人'}
                right={this._renderItemRight(item)}
                onClick={this._clickItem.bind(this, item)}
            />
        );
    };

    _renderItemRight = (item) => {
        const text = DateUtil.showDate(item.createdOn, false);
        return (
            <Text style={styles.right}>
                {text}
            </Text>
        );
    };

    _renderFooterComponent = () => {
        return (
            <View style={styles.footerview}>
                <Text style={styles.footertext}>
                    {'' + this.state.groups.length + '个群聊'}
                </Text>
            </View>
        );
    };

    _clickItem = (item) => {
        this.props.navigation.navigate({
            routeName: PageKeys.ChatDetail,
            params: {
                imId: item.groupId,
                chatType: Constant.ChatType.Group,
            },
        });
    };

    _clickFakeSearchBar = () => {
        this.props.navigation.navigate({
            routeName: PageKeys.SearchMore,
            params: {
                keyExtractor: item => item.groupId,
                showHistory: false,
                searchHint: '搜索群名称、群成员',
                maxSectionItemLength: 0,
                doSearch: this._search,
                renderItem: this._renderSearchItem,
            },
        });
    };

    _refresh = () => {
        this.setState({
            groups: this._getGroups()
        });
    };

    _getGroups = () => {
        const groups = delegate.model.Group.get()
            .sort((a, b) => a.createdOn < b.createdOn ? 1 : -1);
        groups.forEach(group => {
            group.memberObjList = delegate.model.Group.getMembers(group.groupId, true)
                .map(userId => delegate.user.getUser(userId));
        });
        return groups;
    };

    _search = (text) => {
        this.searchText = text;
        return this.state.groups
            .filter((group) => {
                const {name = '', name_py = '', memberObjList} = group;
                group.matchInMember = memberObjList
                    .find(({name, name_py = ''}) =>
                        name.includes(text) || name_py.includes(text)
                    );
                return name.includes(text) || name_py.includes(text) || group.matchInMember;
            });
    };

    _renderSearchItem = ({item}) => {
        const searchText = this.searchText;
        const length = searchText.length;
        let title = item.name;
        let subTitle = '共' + item.memberObjList.length + '人';
        const index = title.indexOf(searchText);
        if (index > -1) {
            title = [
                <Text key={1}>
                    {title.substring(0, index)}
                </Text>,
                <Text key={2} style={styles.text}>
                    {searchText}
                </Text>,
                <Text key={3}>
                    {title.substring(index + length)}
                </Text>
            ];
        }
        if (item.matchInMember) {
            const matchUser = item.memberObjList
                .map((user) => {
                    const i = user.name.indexOf(searchText);
                    if (i > -1) {
                        return [
                            <Text key={user.code + '1'}>
                                {user.name.substring(0, i)}
                            </Text>,
                            <Text key={user.code + '2'} style={styles.text}>
                                {searchText}
                            </Text>,
                            <Text key={user.code + '3'}>
                                {user.name.substring(i + length)}
                            </Text>
                        ];
                    } else {
                        return null;
                    }
                })
                .filter(i => !!i)
                .reduce((pre, cur) => {
                    if (pre.length > 0) pre.push('，');
                    return [...pre, ...cur];
                }, []);
            if (matchUser.length > 0) {
                subTitle = ['群成员：'].concat(matchUser);
            }
        }
        return (
            <delegate.component.ListCell
                avatar={{imId: item.groupId, chatType: Constant.ChatType.Group}}
                title={title}
                subTitle={subTitle}
            />
        );
    };
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    safeview: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    text: {
        color: '#e15151',
    },
    footerview: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footertext: {
        fontSize: 14,
        color: '#666',
    },
    right: {
        marginLeft: 13,
        marginTop: 11,
        alignItems: 'flex-end',
        alignSelf: 'stretch',
        fontSize: 11,
        color: "#aaaaaa",
    },
});