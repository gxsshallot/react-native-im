import React from 'react';
import { LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import NaviBar from '@hecom/react-native-pure-navigation-bar';
import SearchBar from 'react-native-general-searchbar';
import ActionSheet from 'react-native-general-actionsheet';
import * as PageKeys from '../pagekey';
import { mapListToSection } from '../util';
import { Conversation } from '../typings';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        groupId: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(PropTypes.string).isRequired,
        admins: PropTypes.arrayOf(PropTypes.string).isRequired,
        canAdd: PropTypes.bool,
        canRemove: PropTypes.bool,
        onAddMembers: PropTypes.func.isRequired,
        onRemoveMembers: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.allMembers = this._generateSections(props.members, props.admins);
        this.state = {
            searchText: '',
            members: props.members,
            admins: props.admins,
        };
    }

    render() {
        const {canAdd} = this.props;
        const rights = {};
        if (canAdd) {
            rights.rightElement = '添加';
            rights.onRight = this._onRight;
        }
        const data = this._filterBySearchText(this.state.searchText);
        return (
            <View style={styles.container}>
                <NaviBar title={'群成员'} {...rights} />
                <SearchBar
                    searchText={this.state.searchText}
                    canClear={true}
                    onChangeText={this._onChangeText}
                />
                <delegate.component.SeekBarSectionList
                    sections={data}
                    itemHeight={64}
                    sectionHeight={25}
                    renderSectionHeader={this._renderSectionHeader}
                    renderItem={this._renderItem}
                    stickySectionHeadersEnabled={true}
                    keyExtractor={item => item.userId}
                />
            </View>
        );
    }

    _renderSectionHeader = ({section: {title}}) => {
        return <delegate.component.SectionHeader title={title} />;
    };

    _renderItem = ({item}) => {
        const title = this._renderSearchItem(item.name);
        const subTitle = this._renderSearchItem(item.dept && item.dept.name);
        const longPresses = {};
        if (!item.disableRemove && this.props.canRemove) {
            longPresses.onLongPress = this._onLongPress.bind(this, item);
        }
        return (
            <delegate.component.ListCell
                title={title}
                subTitle={subTitle}
                labels={item.label}
                avatar={{imId: item.imId, chatType: Conversation.ChatType.Single}}
                {...longPresses}
            />
        );
    };

    _renderSearchItem = (text = '') => {
        const index = text.indexOf(this.state.searchText);
        return !text || index < 0 ? text : [
            <Text key={1}>
                {text.substring(0, index)}
            </Text>,
            <Text key={2} style={styles.text}>
                {this.state.searchText}
            </Text>,
            <Text key={3}>
                {text.substring(index + this.state.searchText.length)}
            </Text>
        ];
    };

    _onLongPress = (item) => {
        ActionSheet.showActionSheetWithOptions({
            options: ['删除' + item.name, '取消'],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1,
        }, (index) => {
            if (index === 0) {
                this._onRemoveMembers([item.userId]);
            }
        });
    };
    
    _generateSections = (members, admins) => {
        members = members || this.state.members;
        admins = admins || this.state.admins;
        const adminSet = new Set(admins);
        const memberObjs = members
            .filter(memberId => !adminSet.has(memberId))
            .map(memberId => delegate.user.getUser(memberId))
            .filter(i => i);
        const list = mapListToSection(memberObjs, delegate.config.pinyinField);
        return [
            {
                key: '☆',
                title: '☆',
                data: admins
                    .map((adminId) => {
                        const user = delegate.user.getUser(adminId);
                        if (user) {
                            user.label = [{
                                name: '群主',
                                color: '#00ffff',
                            }];
                            user.disableRemove = true;
                            return user;
                        } else {
                            return null;
                        }
                    })
                    .filter(i => i)
            },
            ...list
        ]
            .filter(section => section.data.length > 0);
    };

    _onRight = () => {
        const excludedUserIds = this.allMembers
            .reduce((prv, cur) => prv.concat(cur.data.map(i => i.userId)), []);
        this.props.navigation.navigate( PageKeys.ChooseUser,{
                title: '添加群成员',
                multiple: true,
                excludedUserIds: excludedUserIds,
                selectedIds: [],
                onSelectData: this._onAddMembers,
            });
    };

    _onAddMembers = (memberIds) => {
        this.props.onAddMembers(memberIds)
            .then((newMembers) => {
                this.allMembers = this._generateSections(newMembers, undefined);
                this.setState({members: newMembers});
            });
    };

    _onRemoveMembers = (memberIds) => {
        this.props.onRemoveMembers(memberIds)
            .then((newMembers) => {
                this.allMembers = this._generateSections(newMembers, undefined);
                this.setState({members: newMembers});
            });
    };

    _filterBySearchText = (text) => {
        if (!text) {
            return this.allMembers;
        } else {
            const field = delegate.config.pinyinField;
            return this.allMembers
                .map(({title, data}) => {
                    const result = data.filter((user) =>
                        user.name.includes(text) ||
                        user.dept && user.dept.name && user.dept.name.includes(text) ||
                        user.phone && user.phone.includes(text) ||
                        user[field] && user[field].includes(text)
                    );
                    return result.length > 0 ? {title, data: result} : undefined;
                })
                .filter(i => i);
        }
    };

    _onChangeText = (text) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            searchText: text,
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});