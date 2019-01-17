import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Toast from 'react-native-root-toast';
import Listener from 'react-native-general-listener';
import * as PageKeys from '../pagekey';
import delegate from '../delegate';
import * as Constant from '../constant';
import i18n from '../../language';

export default class extends React.PureComponent {
    static navigationOptions = function () {
        return {
            title: i18n.t('IMPageChatListTitle')
        };
    };

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
        };
    }

    componentDidMount() {
        this._refresh();
        this.listenListUpdate = Listener.registerWithSubEvent(
            [Constant.BaseEvent, Constant.ConversationEvent],
            this._refresh.bind(this)
        );
    }

    componentWillUnmount() {
        Listener.unregister(
            [Constant.BaseEvent, Constant.ConversationEvent],
            this.listenListUpdate
        );
    }

    render() {
        const listStyle = {
            flex: 1,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: delegate.style.separatorLineColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: delegate.style.separatorLineColor,
        };
        return this.state.dataSource !== null && (
            <SwipeListView
                useFlatList={true}
                disableRightSwipe={true}
                closeOnRowBeginSwipe={true}
                style={listStyle}
                data={this.state.dataSource}
                renderItem={this._renderRow.bind(this)}
                renderHiddenItem={this._renderHiddenItem.bind(this)}
                ListHeaderComponent={this._renderFakeSearchBar()}
                rightOpenValue={-225}
                keyExtractor={item => item.imId}
            />
        );
    }

    _renderRow({item, index}) {
        const isBottom = index === this.state.dataSource.length - 1;
        const separatorLeft = !isBottom ? 75 : -1;
        return (
            <delegate.component.ConversationCell
                imId={item.imId}
                chatType={item.chatType}
                separatorLeft={separatorLeft}
                navigation={this.props.navigation}
            />
        );
    }

    _renderHiddenItem({item}, rowMap) {
        const config = delegate.model.Conversation.getConfig(item.imId);
        const isRead = !(item.unreadMessagesCount > 0);
        const markTitle = isRead ? '标记未读' : '标记已读';
        return (
            <View style={styles.hidden}>
                {this._renderButton(rowMap, item,
                    config.top ? '取消置顶' : '置顶',
                    {backgroundColor: 'blue'},
                    this._clickTop.bind(this, item, config),
                )}
                {this._renderButton(rowMap, item, markTitle,
                    {backgroundColor: 'green'},
                    this._clickMarkReadStatus.bind(this, item, !isRead),
                )}
                {this._renderButton(rowMap, item, '删除',
                    {backgroundColor: '#e15151'},
                    this._clickDelete.bind(this, item),
                )}
            </View>
        );
    }

    _renderButton(rowMap, item, text, style, onPress) {
        return (
            <TouchableOpacity
                onPress={function () {
                    rowMap[item.imId].closeRow();
                    onPress && onPress();
                }}
                style={[styles.btn, style]}
            >
                <Text style={styles.btnText}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }

    _renderFakeSearchBar() {
        return (
            <delegate.component.FakeSearchBar
                onFocus={this._clickSearch.bind(this)}
                placeholder={'搜索'}
            />
        );
    }

    _refresh() {
        const dataSource = delegate.model.Conversation.get();
        this.setState({dataSource});
    }

    _clickTop(item, config) {
        const top = !config.top;
        delegate.model.Conversation.updateConfig(item.imId, {top})
            .catch(function () {
                Toast.show('置顶失败，请稍后重试');
            });
    }

    _clickMarkReadStatus(item, status) {
        delegate.model.Conversation.markReadStatus(item.imId, item.chatType, status);
    }

    _clickDelete(item) {
        delegate.model.Conversation.deleteOne(item.imId);
    }

    _clickSearch() {
        this.props.navigation.navigate({
            routeName: PageKeys.Search,
            params: {},
        });
    }
}

const styles = StyleSheet.create({
    hidden: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btn: {
        justifyContent: 'center',
        alignSelf: 'stretch',
        alignItems: 'center',
        width: 75,
        height: 64,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
    }
});