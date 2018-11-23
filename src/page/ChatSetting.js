import React from 'react';
import { Alert, InteractionManager, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import NaviBar, { getSafeAreaInset } from 'react-native-pure-navigation-bar';
import Toast from 'react-native-root-toast';
import ActionSheet from 'react-native-general-actionsheet';
import * as ImagePicker from 'react-native-full-image-picker';
import * as PageKeys from '../pagekey';
import * as Constant from '../constant';
import * as Types from '../proptype';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        ...Types.BasicConversation,
    };

    static defaultProps = {};

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
        const title = this.isGroup ? '群设置' : '聊天设置'
        return (
            <View style={[styles.view, style]}>
                <NaviBar title={title} />
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

    _renderGroupMemberSection = () => {
        const {groupMembers, groupOwner} = this.state;
        const isOwner = this.isGroup && groupOwner === delegate.user.getMine().userId;
        return (
            <View style={styles.section}>
                <delegate.component.AvatarList
                    data={groupMembers}
                    owner={groupOwner}
                    onAddMembers={this._onAddMembers}
                    onRemoveMembers={this._onRemoveMembers}
                    canAdd={true}
                    canRemove={isOwner}
                    navigation={this.props.navigation}
                />
                {this._renderSeparatorLine()}
                <delegate.component.SettingItem
                    type={Constant.SettingItemType.Text}
                    title={'全体成员(' + groupMembers.length + ')'}
                    onPressLine={this._clickAllMembers}
                />
            </View>
        );
    };

    _renderGroupNameAvatarSection = () => {
        const {groupName, groupAvatar} = this.state;
        const avatar = !groupAvatar ? undefined : {
            uri: delegate.func.fitUrlForAvatarSize(groupAvatar, 30);
        };
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
                    onPressLine={isOwner ? this._clickGroupAvatar : undefined}
                />
                {this._renderSeparatorLine()}
            </View>
        );
    };

    _renderCommonSection = () => {
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
    };

    _renderPrompt = () => {
        return (
            <delegate.component.Prompt
                title={'请输入群聊名称'}
                textInputProps={{secureTextEntry: false}}
                visible={this.state.showPrompt}
                onCancel={() => this.setState({showPrompt: false})}
                onSubmit={this._clickName}
            />
        );
    };

    _renderBottom = () => {
        const isOwner = this.isGroup && this.state.groupOwner === delegate.user.getMine().userId;
        const text = isOwner ? '解散' : '退出';
        const inset = getSafeAreaInset();
        return (
            <View style={[styles.bottom, {bottom: inset.bottom}]}>
                {this._renderButton(text + '群聊', this._clickLeave.bind(this, isOwner, text))}
                {isOwner && <View style={styles.separator} />}
                {isOwner && this._renderButton('转交群主', this._clickTransferOwner)}
            </View>
        );
    };

    _renderButton = (text, onPress) => {
        return (
            <TouchableHighlight
                style={styles.btn}
                activeOpacity={0.9}
                onPress={onPress}
            >
                <View>
                    <Text style={styles.btntext}>
                        {text}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    };

    _renderSeparatorLine = () => {
        const style = {
            backgroundColor: delegate.style.seperatorLineColor,
            height: StyleSheet.hairlineWidth,
        };
        return <View style={style} />;
    };

    _clickAllMembers = () => {
        this.props.navigation.navigate({
            routeName: PageKeys.GroupMembers,
            params: {
                groupId: this.props.imId,
                members: this.state.groupMembers,
                adminList: [this.state.groupOwner],
                canDelete: this.state.groupOwner === delegate.user.getMine().userId,
            },
        });
    };

    _clickLeave = (isOwner, text) => {
        let promise;
        if (isOwner) {
            promise = delegate.model.Group.destroyOne(this.props.imId);
        } else {
            promise = delegate.model.Group.quitOne(this.props.imId);
        }
        return promise
            .then(() => {
                Toast.show(text + '成功');
                const routes = this.props.navgation.state.routes;
                const routeName = routes.length >= 3 ? routes[routes.length - 3].routeName : PageKeys.ChatList;
                this.props.navigation.navigate({
                    routeName: routeName,
                    params: {},
                });
            })
            .catch(() => {
                Toast.show(text + '失败');
            });
    };

    _clickName = (newName) => {
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
    };

    _clickTransferOwner = () => {
        const dataSource = this.state.groupMembers
            .filter(userId => userId !== delegate.user.getMine().userId)
            .map(userId => delegate.user.getUser(userId))
        this.props.navigation.navigate({
            routeName: PageKeys.ChooseUser,
            params: {
                title: '选择群成员',
                multiple: false,
                dataSource: dataSource,
                onSelectData: this._onTransferOwnerAlert,
                selectedIds: [],
            },
        })
    };
    
    _clickGroupAvatar = () => {
        const options = {
            maxSize: 1,
            canEdit: true,
            callback: this._onImagePickerFinish,
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
    };

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
    };

    _onAddMembers = (members) => {
        if (this.isGroup) {
            delegate.model.Group.addMembers(this.props.imId, members)
                .then((newMembers) => {
                    this.setState({groupMembers: newMembers});
                })
                .catch(error => {
                    Toast.show('添加成员失败');
                });
        } else {
            const newMembers = [this.props.imId, ...members];
            delegate.model.Conversation.createOne(newMembers)
                .then(({imId, chatType}) => {
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
            this.props.navigation.navigate({
                routeName: PageKeys.ChatList,
                params: {},
            });
        }
    };

    _onRemoveMembers = (members) => {
        delegate.model.Group.removeMembers(this.props.imId, members)
            .then((newMembers) => {
                this.setState({
                    groupMembers: newMembers,
                });
            })
            .catch(() => {
                Toast.show('删除群成员失败');
            });
    };

    _onImagePickerFinish = (data) => {
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
    };

    _onTransferOwnerAlert = (data) => {
        const {groupMembers} = this.state;
        const newOwner = delegate.user.getUser(data[0]);
        Alert.alert('转交群主给:', newOwner.name,
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: this._onTransferOwner.bind(this, newOwner),
                }
            ],
            {cancelable: true});
    };

    _onTransferOwner = (newOwner) => {
        delegate.model.Group.changeOwner(group, newOwner.userId)
            .then(({members, owner}) => {
                Toast.show('转交成功');
                this.setState({groupMembers: [owner, ...members], groupOwner: owner});
            })
            .catch(() => {
                Toast.show('转交失败');
            });
    };
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
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    btntext: {
        color: 'red',
        fontSize: 18,
    },
    separator: {
        width: StyleSheet.hairlineWidth,
        height: 50,
        backgroundColor: '#e5e5e5',
    },
});