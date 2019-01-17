import React from 'react';
import { Alert, InteractionManager, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import { StackActions } from 'react-navigation';
import { getSafeAreaInset } from 'react-native-pure-navigation-bar';
import Toast from 'react-native-root-toast';
import ActionSheet from 'react-native-general-actionsheet';
import * as ImagePicker from 'react-native-full-image-picker';
import * as PageKeys from '../pagekey';
import * as Constant from '../constant';
import * as Types from '../proptype';
import delegate from '../delegate';
import i18n from '../../language';

export default class extends React.PureComponent {
    static navigationOptions = function ({navigation}) {
        const {chatType} = navigation.state.params;
        const isGroup = chatType === Constant.ChatType.Group;
        const title = isGroup ? i18n.t('IMPageChatSettingTitleGroup') : i18n.t('IMPageChatSettingTitleSingle');
        return {title};
    };

    static propTypes = {
        ...Types.BasicConversation,
        ...Types.Navigation,
        buttons: PropTypes.arrayOf(PropTypes.string),
    };

    static defaultProps = {
        buttons: [],
    };

    constructor(props) {
        super(props);
        const {imId, chatType} = props;
        this.isGroup = chatType === Constant.ChatType.Group;
        const state = {};
        if (this.isGroup) {
            state.groupMembers = delegate.model.Group.getMembers(imId);
            state.groupAvatar = delegate.model.Group.getAvatar(imId);
            state.groupName = delegate.model.Group.getName(imId, false);
            state.groupOwner = delegate.model.Group.getOwner(imId);
            state.groupAllowAdd = delegate.model.Group.getAllowAdd(imId);
        }
        this.state = {
            ...delegate.model.Conversation.getConfig(imId),
            ...state,
        };
    }

    render() {
        const style = {
            backgroundColor: delegate.style.viewBackgroundColor,
        };
        return (
            <View style={[styles.view, style]}>
                <ScrollView style={styles.scrollView}>
                    {this.isGroup && this._renderGroupMemberSection()}
                    <View style={styles.section}>
                        {this.isGroup && this._renderGroupNameAvatarSection()}
                        {this._renderCommonSection()}
                    </View>
                    {this.state.showPrompt && this._renderPrompt()}
                </ScrollView>
                {this.isGroup && this._renderBottom()}
            </View>
        );
    }

    _renderGroupMemberSection() {
        const {groupMembers, groupOwner} = this.state;
        const isOwner = this.isGroup && groupOwner === delegate.user.getMine().userId;
        return (
            <View style={styles.section}>
                <delegate.component.AvatarList
                    data={groupMembers}
                    owner={groupOwner}
                    onAddMembers={this._onAddMembers.bind(this)}
                    onRemoveMembers={this._onRemoveMembers.bind(this)}
                    canAdd={isOwner || this.state.groupAllowAdd}
                    canRemove={isOwner}
                    navigation={this.props.navigation}
                />
                {this._renderSeparatorLine()}
                <delegate.component.SettingItem
                    type={Constant.SettingItemType.Text}
                    title={'全体成员(' + groupMembers.length + ')'}
                    onPressLine={this._clickAllMembers.bind(this)}
                />
            </View>
        );
    }

    _renderGroupNameAvatarSection() {
        const {groupName, groupAvatar, groupOwner} = this.state;
        const avatar = !groupAvatar ? undefined : {
            uri: delegate.func.fitUrlForAvatarSize(groupAvatar, 30),
        };
        const isOwner = this.isGroup && groupOwner === delegate.user.getMine().userId;
        const showNameLineFunc = !isOwner ? undefined : () => {
            this.setState({showPrompt: true});
        };
        return (
            <View>
                <delegate.component.SettingItem
                    type={Constant.SettingItemType.Text}
                    title={'群聊名称'}
                    data={groupName}
                    onPressLine={showNameLineFunc}
                />
                {this._renderSeparatorLine()}
                <delegate.component.SettingItem
                    type={Constant.SettingItemType.Image}
                    title={'群头像'}
                    data={avatar}
                    onPressLine={isOwner ? this._clickGroupAvatar.bind(this) : undefined}
                />
                {this._renderSeparatorLine()}
                {isOwner && (
                    <delegate.component.SettingItem
                        type={Constant.SettingItemType.Switch}
                        title="允许添加成员"
                        data={this.state.groupAllowAdd}
                        onPressSwitch={this._clickChangeAllowAdd.bind(this)}
                    />
                )}
                {isOwner && this._renderSeparatorLine()}
            </View>
        );
    }

    _renderCommonSection() {
        return (
            <View>
                <delegate.component.SettingItem
                    type={Constant.SettingItemType.Switch}
                    title="置顶聊天"
                    data={this.state.top}
                    onPressSwitch={top => this._clickConfig({top})}
                />
                {this._renderSeparatorLine()}
                <delegate.component.SettingItem
                    type={Constant.SettingItemType.Switch}
                    title="消息免打扰"
                    data={this.state.avoid}
                    onPressSwitch={avoid => this._clickConfig({avoid})}
                />
            </View>
        );
    }

    _renderPrompt() {
        return (
            <delegate.component.Prompt
                title={'请输入群聊名称'}
                textInputProps={{secureTextEntry: false}}
                visible={this.state.showPrompt}
                onCancel={() => this.setState({showPrompt: false})}
                onSubmit={this._clickName.bind(this)}
            />
        );
    }

    _renderBottom() {
        const isOwner = this.isGroup && this.state.groupOwner === delegate.user.getMine().userId;
        const text = isOwner ? '解散' : '退出';
        const inset = getSafeAreaInset();
        const buttons = [];
        this.props.buttons.forEach((button, index) => {
            const view = delegate.model.Setting.match(button, {
                ...this.props,
                key: index,
                onDataChange: this._onDataChange.bind(this),
            });
            if (!view) {
                return;
            }
            buttons.push(view);
            buttons.push((
                <View
                    style={styles.separator}
                    key={index + this.props.buttons.length}
                />
            ));
        });
        const views = buttons.length > 0 ? buttons.slice(0, buttons.length - 1) : buttons;
        return buttons.length > 0 && (
            <View style={[styles.bottom, {bottom: inset.bottom}]}>
                {views}
            </View>
        );
    }

    _renderSeparatorLine() {
        const style = {
            backgroundColor: delegate.style.separatorLineColor,
            height: StyleSheet.hairlineWidth,
        };
        return <View style={style} />;
    }

    _onDataChange() {
        const state = {}
        if (this.isGroup) {
            state.groupMembers = delegate.model.Group.getMembers(imId);
            state.groupAvatar = delegate.model.Group.getAvatar(imId);
            state.groupName = delegate.model.Group.getName(imId, false);
            state.groupOwner = delegate.model.Group.getOwner(imId);
            state.groupAllowAdd = delegate.model.Group.getAllowAdd(imId);
        }
        this.setState({
            ...delegate.model.Conversation.getConfig(imId),
            ...state,
        });
    };

    _clickAllMembers() {
        this.props.navigation.navigate({
            routeName: PageKeys.GroupMembers,
            params: {
                groupId: this.props.imId,
                members: this.state.groupMembers,
                admins: [this.state.groupOwner],
                canAdd: true,
                canRemove: this.state.groupOwner === delegate.user.getMine().userId,
                onAddMembers: this._onAddMembers.bind(this),
                onRemoveMembers: this._onRemoveMembers.bind(this),
            },
        });
    }

    _clickChangeAllowAdd(isAllowAdd) {
        delegate.model.Group.changeAllowAdd(this.props.imId, isAllowAdd)
            .then((result) => {
                this.setState({groupAllowAdd: result});
            })
            .catch(() => {
                Toast.show('更改设置失败');
            });
    }

    _clickName(newName) {
        this.setState({
            showPrompt: false,
        });
        if (!newName || newName.length === 0) {
            Toast.show('群聊名称不能为空');
            return;
        }
        delegate.model.Group.changeName(this.props.imId, newName)
            .then((result) => {
                this.setState({groupName: result});
            })
            .catch(() => {
                Toast.show('更改群聊名称失败');
            });
    }

    _clickGroupAvatar() {
        const options = {
            maxSize: 1,
            canEdit: true,
            callback: this._onImagePickerFinish.bind(this),
        };
        const actions = ['拍照', '从相册选择', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: actions,
            cancelButtonIndex: actions.length - 1,
        }, (clickIndex) => {
            if (clickIndex >= actions.length - 1) {
                return;
            }
            if (clickIndex === 0) {
                ImagePicker.getCamera(options);
            } else if (clickIndex === 1) {
                ImagePicker.getAlbum(options);
            }
        });
    }

    _clickConfig = (newConfig) => {
        this.setState(newConfig);
        delegate.model.Conversation.updateConfig(this.props.imId, newConfig)
            .catch(() => {
                Toast.show('更新设置失败');
            })
            .finally(() => {
                const config = delegate.model.Conversation.getConfig(this.props.imId);
                this.setState(config);
            });
    }

    _onAddMembers(members) {
        if (this.isGroup) {
            return delegate.model.Group.addMembers(this.props.imId, members)
                .then(() => {
                    const newMembers = delegate.model.Group.getMembers(this.props.imId);
                    this.setState({groupMembers: newMembers});
                    return newMembers;
                })
                .catch(() => {
                    Toast.show('添加成员失败');
                });
        } else {
            const newMembers = [this.props.imId, ...members];
            return delegate.model.Conversation.createOne(newMembers)
                .then(({imId, chatType}) => {
                    this.props.navigation.navigate({
                        routeName: PageKeys.ChatList,
                        params: {},
                    });
                    InteractionManager.runAfterInteractions(() => {
                        this.props.navigation.navigate({
                            routeName: PageKeys.ChatDetail,
                            params: {
                                imId: imId,
                                chatType: chatType,
                            },
                        });
                    });
                })
                .catch(() => {
                    Toast.show('创建群聊失败');
                });
        }
    }

    _onRemoveMembers(members) {
        return delegate.model.Group.removeMembers(this.props.imId, members)
            .then(() => {
                const newMembers = delegate.model.Group.getMembers(this.props.imId);
                this.setState({groupMembers: newMembers});
                return newMembers;
            })
            .catch(() => {
                Toast.show('删除群成员失败');
            });
    }

    _onImagePickerFinish(data) {
        if (!data || data.length === 0) {
            return;
        }
        delegate.func.uploadImages(data.map(i => i.uri))
            .then(([url]) => delegate.model.Group.changeAvatar(this.props.imId, url))
            .then((newUrl) => {
                this.setState({
                    groupAvatar: newUrl,
                });
            })
            .catch(() => {
                Toast.show('设置头像失败');
            });
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    section: {
        marginTop: 10,
        backgroundColor: 'white',
    },
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 50,
    },
    separator: {
        width: StyleSheet.hairlineWidth,
        height: 50,
        backgroundColor: '#e5e5e5',
    },
});