import React from 'react';
import {FlatList, StyleProp, StyleSheet, Text, TouchableHighlight, View, ViewStyle} from 'react-native';
import PropTypes from 'prop-types';
import {Delegate} from "react-native-im/standard/index";

export default class extends React.PureComponent {
    static propTypes = {
        onLoadPage: PropTypes.func.isRequired,
        style: PropTypes.any,
        newUnreadMessageCount: PropTypes.number,
        oldUnreadMessageCount: PropTypes.number,
    };

    static defaultProps = {
        pageSize: 20,
        oldUnreadMessageCount: 0,
        newUnreadMessageCount: 0,
    };

    ids: Set<string>;
    innerIds: Set<string>;
    listOffsetY = 0;
    totalOldUnreadCount = 0;//记录当前未读的历史消息数量，当下拉获取全部未读消息后，此值减至0，右上角获取未读消息按钮隐藏。

    constructor(props) {
        super(props);
        this.ids = new Set();
        this.innerIds = new Set();
        this.totalOldUnreadCount = props.oldUnreadMessageCount;
        this.state = {
            data: [],
            isEnd: false,
            isLoading: false,
            newUnreadMessageCount: props.newUnreadMessageCount,
            oldUnreadMessageCount: props.oldUnreadMessageCount,
        };
        this._scrollToShowNewUnreadMessage = this._scrollToShowNewUnreadMessage.bind(this);
        this._scrollToShowOldUnreadMessage = this._scrollToShowOldUnreadMessage.bind(this);
        this._loadPage = this._loadPage.bind(this);
        this._renderMoreMessageElement = this._renderMoreMessageElement.bind(this);
    }

    componentDidMount() {
        this._loadPage();
    }

    render() {
        return (
            <View style={styles.content}>
                <FlatList
                    ref={ref => this.innerList = ref}
                    inverted={true}
                    bounces={false}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                    initialNumToRender={this.props.pageSize}
                    data={this.state.data}
                    onEndReachedThreshold={0.3}
                    onEndReached={this._loadPage}
                    onScroll={(event) => {
                        this.listOffsetY = event.nativeEvent.contentOffset.y
                        if (this.listOffsetY <= 30 && this.state.newUnreadMessageCount > 0) {
                            this.setState({newUnreadMessageCount: 0});
                        }
                    }}
                    keyExtractor={item => item.messageId || item.innerId}
                    {...this.props}
                    renderItem={(arg) => this.props.renderItem(arg, this.state.data)}
                />
                {this.state.oldUnreadMessageCount > 12 && this._renderMoreMessageElement({top: 10}, this.state.oldUnreadMessageCount, this._scrollToShowOldUnreadMessage.bind(this))}
                {this.state.newUnreadMessageCount > 0 && this._renderMoreMessageElement({bottom: 10}, this.state.newUnreadMessageCount, this._scrollToShowNewUnreadMessage.bind(this))}
            </View>
        );
    }

    _renderMoreMessageElement(style: StyleProp<ViewStyle>, count: number, callback: () => void) {
        let desc = count > 99 ? '99+' : count.toString()
        return (
            <TouchableHighlight
                style={[styles.moreMessage, style]}
                underlayColor={'#d7d8d8'}
                onPress={callback}
            >
                <View style={styles.moreMessageContainer}>
                    <Text style={styles.moreMessageText}>
                        {desc}条新消息
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }

    _scrollToShowNewUnreadMessage() {
        this.setState({newUnreadMessageCount: 0}, this.scrollToTop);
    }

    _scrollToShowOldUnreadMessage() {
        this._loadPage()
    }

    _loadPage = () => {
        if (this.state.isEnd || this.state.isLoading) {
            return;
        }
        this.setState({isLoading: true});
        return this.props.onLoadPage(this.state.data, this.props.pageSize)
            .then(({data, isEnd, isAllData}) => {
                data = data.reduce((prv, cur) => {
                    const {messageId, innerId} = cur;
                    if (messageId && this.ids.has(messageId) ||
                        innerId && this.innerIds.has(innerId)) {
                        return prv;
                    } else {
                        messageId && this.ids.add(messageId);
                        innerId && this.innerIds.add(innerId);
                        prv.push(cur);
                        return prv;
                    }
                }, []);
                if (isAllData) {
                    data = [...data];
                } else {
                    data = [...this.state.data, ...data];
                }

                this.setState({
                    data: data,
                    isEnd: isEnd,
                    isLoading: false,
                });
            }).catch(() => {
                this.setState({
                    data: [],
                    isEnd: false,
                    isLoading: false,
                });
            })
    };

    scrollToTop = (animated = false) => {
        setTimeout(() => {
            this.innerList && this.innerList.scrollToOffset({offset: 0, animated});
        }, 200);
    };

    scrollToBottom = (animated = false) => {
        setTimeout(() => {
            this.innerList && this.innerList.scrollToEnd({animated: animated});
        }, 200);
    };

    insert = (newMessages) => {
        const data = [...this.state.data];
        //是否有我自己发送的，如果有，直接自动scroll到底
        let hasFromMe = false
        const me = Delegate.user.getMine().userId
        const toInsert = newMessages.reduce((prv, cur) => {
            if (!hasFromMe && me && cur.from && me == cur.from) {
                hasFromMe = true
            }
            const {messageId, innerId} = cur;
            if (messageId && this.ids.has(messageId) ||
                innerId && this.innerIds.has(innerId)) {
                const index = data.findIndex((i) => {
                    return messageId && i.messageId === messageId ||
                        innerId && i.innerId === innerId;
                });
                data[index] = cur;
                return prv;
            } else {
                this.ids.add(messageId);
                this.innerIds.add(innerId);
                prv.push(cur);
                return prv;
            }
        }, []);
        const result = [...toInsert.reverse(), ...data];
        if (!hasFromMe && this.listOffsetY > 30 && newMessages && newMessages.length > 0) {
            this.setState({data: result, newUnreadMessageCount: newMessages.length});
        } else {
            this.setState({data: result, newUnreadMessageCount: 0}, this.scrollToTop);
        }
    };
}

const styles = StyleSheet.create({
    content: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    moreMessage: {
        position: 'absolute',
        backgroundColor: 'red',
        right: 10,
        width: 120,
        height: 40,
    },
    moreMessageContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    moreMessageImage: {
    },
    moreMessageText: {
        fontSize: 14,
        color: '#333333',
        marginVertical: 0,
    },
});
