import React from 'react';
import { StyleSheet, Text } from 'react-native';
import * as PageKeys from '../pagekey';
import { Conversation } from '../typings';
import delegate from '../delegate';

export default class extends React.PureComponent {
    // static propTypes = {
    //     ...Types.Navigation,
    //     canSearchContact: PropTypes.bool,
    //     canSearchGroup: PropTypes.bool,
    // };

    static defaultProps = {
        canSearchContact: true,
        canSearchGroup: true,
    };

    constructor(props) {
        super(props);
        if (props.canSearchGroup) {
            const groups = delegate.model.Group.get();
            groups.forEach((group) => {
                const {groupId} = group;
                if (!group.name) {
                    group.name = delegate.model.Group.getName(groupId);
                }
                if (!group.memberObjList) {
                    group.memberObjList = delegate.model.Group.getMembers(groupId)
                        .map((userId) => delegate.user.getUser(userId));
                }
            });
            this.groups = groups;
        }
        if (props.canSearchContact) {
            this.employees = [];
        }
        this.multi = props.canSearchContact && props.canSearchGroup;
    }

    componentDidMount() {
        delegate.contact.loadAllUser(true)
            .then((users) => this.employees = users);
    }

    render() {
        const hints = [];
        if (this.props.canSearchContact) {
            hints.push('员工');
        }
        if (this.props.canSearchGroup) {
            hints.push('群聊');
        }
        const hint = '搜索' + hints.join('、');
        const props = {
            renderSectionHeader: this._renderSectionHeader,
            onItemClick: this._onItemClick,
            keyExtractor: (item) => item.code || item.groupId,
            itemKey: 'name',
            searchOnTextChange: true,
        };
        const onFooterClick = ({title, searchText}) => {
            this.props.navigation.navigate(PageKeys.SearchMore, {
                ...props,
                showHistory: false,
                searchHint: title,
                searchText: searchText,
                maxSectionItemLength: 0,
                doSearch: title === '通讯录' ? this._searchFromContacts : this._searchFromGroup,
            });
        };
        return (
            <delegate.component.SearchList
                {...props}
                doSearch={this._doSearch}
                searchHint={hint}
                onSectionFooterClick={onFooterClick}
            />
        );
    }

    _doSearch = (text) => {
        const result = [];
        if (this.props.canSearchContact) {
            result.push(...this._searchFromContacts(text));
        }
        if (this.props.canSearchGroup) {
            result.push(...this._searchFromGroup(text));
        }
        return result;
    };

    _searchFromGroup = (text) => {
        const result = this.groups
            .filter((group) => {
                const {name = '', name_py = '', memberObjList} = group;
                group.matchInMember = memberObjList
                    .find((user) => {
                        const {name = '', name_py = ''} = user;
                        return name.includes(text) || name_py.includes(text);
                    });
                return name.includes(text) || name_py.includes(text) || group.matchInMember;
            });
        return result.length > 0 ? [{
            title: this.multi ? '群聊' : undefined,
            data: result,
            renderItem: this._renderGroupItem
        }] : [];
    };

    _searchFromContacts = (text) => {
        const result = this.employees
            .filter((user) => {
                let r = false;
                r = r || user.name.includes(text);
                r = r || user.name_py && user.name_py.includes(text);
                r = r || user.phone && user.phone.includes(text);
                r = r || user.dept && user.dept.name && user.dept.name.includes(text);
                r = r || user.email && user.email.toLowerCase().includes(text.toLowerCase());
                return r;
            })
            .sort((a, b) => a.name_py ? a.name_py.localeCompare(b.name_py) : -1);
        return result.length > 0 ? [{
            title: this.multi ? '通讯录' : undefined,
            data: result,
            renderItem: this._renderContactItem
        }] : [];
    };

    _renderGroupItem = ({item, searchText}) => {
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
                .map(user => {
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
                avatar={{imId: item.groupId, chatType: Conversation.ChatType.Group}}
                title={title}
                subTitle={subTitle}
            />
        );
    };

    _renderContactItem = ({item, searchText}) => {
        const length = searchText.length;
        let titleIndex, subTitleIndex;
        let title = item.name, subTitle = item.title;
        if ((titleIndex = title.indexOf(searchText)) > -1) {
            title = [
                <Text key={1}>
                    {title.substring(0, titleIndex)}
                </Text>,
                <Text key={2} style={styles.text}>
                    {searchText}
                </Text>,
                <Text key={3}>
                    {title.substring(titleIndex + length)}
                </Text>
            ];
        }
        if (subTitle && (subTitleIndex = subTitle.indexOf(searchText)) > -1) {
            subTitle = [
                <Text key={1}>
                    {subTitle.substring(0, subTitleIndex)}
                </Text>,
                <Text key={2} style={styles.text}>
                    {searchText}
                </Text>,
                <Text key={3}>
                    {subTitle.substring(subTitleIndex + length)}
                </Text>
            ];
        }
        return (
            <delegate.component.ListCell
                avatar={{imId: item.userId, chatType: Conversation.ChatType.Single}}
                title={title}
                subTitle={subTitle}
            />
        );
    };

    _renderSectionHeader = ({section: {title}}) => {
        if (title) {
            return <delegate.component.SectionHeader title={title} />;
        } else {
            return null;
        }
    };

    _onItemClick = ({item}) => {
        const type = item.groupId ? Conversation.ChatType.Group : Conversation.ChatType.Single;
        this.props.navigation.navigate({
            routeName: PageKeys.ChatDetail,
            params: {
                imId: item.groupId || item.userId,
                chatType: type,
            },
        });
    };
}

const styles = StyleSheet.create({
    text: {
        color: '#e15151',
    },
});