import React from 'react';
import {ImageBackground, ImageSourcePropType, FlatList, Image, StyleProp, StyleSheet, Text, TouchableHighlight, View, ViewStyle} from 'react-native';
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
    firstLoadCount = 0;
    reservedData = [];

    constructor(props) {
        super(props);
        this.ids = new Set();
        this.innerIds = new Set();
        this.totalOldUnreadCount = props.oldUnreadMessageCount;
        this.firstLoadCount = Math.max(this.props.oldUnreadMessageCount, this.props.pageSize);
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
        this._loadCount = this._loadCount.bind(this);
        this._renderMoreMessageElement = this._renderMoreMessageElement.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        //点击查看历史未读消息，为了能快速scroll到相应位置，所以这里一次性拉取。
        this._loadCount(this.firstLoadCount);
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
                    initialNumToRender={this.firstLoadCount}
                    data={this.state.data}
                    onEndReachedThreshold={0.3}
                    onEndReached={this._loadPage}
                    onScroll={(event) => {
                        this.listOffsetY = event.nativeEvent.contentOffset.y

                        if (this.listOffsetY <= 30) {
                            if (this.reservedData.length > 0) {
                                const result = [...this.reservedData, ...this.state.data];
                                this.reservedData = [];
                                this.setState({data: result, newUnreadMessageCount: 0});
                            } else if (this.state.newUnreadMessageCount > 0) {
                                this.setState({newUnreadMessageCount: 0});
                            }
                        }
                    }}
                    keyExtractor={item => item.messageId || item.innerId}
                    {...this.props}
                    renderItem={(arg) => this.props.renderItem(arg, this.state.data)}
                />
                {this.state.oldUnreadMessageCount > 12 && this._renderMoreMessageElement({top: 15}, this.state.oldUnreadMessageCount, require('./image/oldUnreadMessage.png'), this._scrollToShowOldUnreadMessage.bind(this))}
                {this.state.newUnreadMessageCount > 0 && this._renderMoreMessageElement({bottom: 15}, this.state.newUnreadMessageCount, require('./image/newUnreadMessage.png'), this._scrollToShowNewUnreadMessage.bind(this))}
            </View>
        );
    }

    _renderMoreMessageElement(style: StyleProp<ViewStyle>, count: number, imageSource: ImageSourcePropType, callback: () => void) {
        let desc = count > 99 ? '99+' : count.toString()
        return (
            <ImageBackground style={[styles.moreMessageContainer, style]}
                             source={require('./image/unreadMessageContainer.png')}>
                <TouchableHighlight
                    style={styles.moreMessage}
                    underlayColor={'#d7d8d8'}
                    onPress={callback}
                >
                    <View style={styles.moreMessageBorder}>
                        <Image style={styles.moreMessageDirection}
                               source={imageSource}
                        />
                        <Text style={styles.moreMessageText}>
                            {desc}条新消息
                        </Text>
                    </View>
                </TouchableHighlight>
            </ImageBackground>
        )
    }

    _scrollToShowNewUnreadMessage() {
        this.setState({newUnreadMessageCount: 0}, this.scrollToTop);
    }

    _scrollToShowOldUnreadMessage() {
        this.setState({oldUnreadMessageCount: 0});
        this.scrollToBottom()
    }

    _loadPage = () => {
        return this._loadCount(this.props.pageSize)
    }

    _loadCount = (onePageSize: number = this.props.pageSize) => {
        if (this.state.isEnd || this.state.isLoading) {
            return;
        }
        this.setState({isLoading: true});
        return this.props.onLoadPage(this.state.data, onePageSize)
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

                if (this.totalOldUnreadCount <= 0 && this.state.oldUnreadMessageCount > 0) {
                    this.setState({data: data, isEnd: isEnd, isLoading: false, oldUnreadMessageCount: 0});
                } else {
                    this.setState({data: data, isEnd: isEnd, isLoading: false});
                }
                this.totalOldUnreadCount = 0;
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
        let hasFromMe = false;
        //记录系统消息的条数，不应该计算进入未读消息。
        let systemMessageCount = 0;
        const me = Delegate.user.getMine().userId;
        const toInsert = newMessages.reduce((prv, cur) => {
            if (!hasFromMe
                && me
                && cur.from
                && me == cur.from
                && cur.data
                && (!(cur.data.isSystem && cur.data.isSystem == true))) {
                hasFromMe = true;
            }
            if (cur.data.isSystem && cur.data.isSystem == true) {
                systemMessageCount += 1;
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
        if (!hasFromMe && this.listOffsetY > 30 && newMessages && newMessages.length > 0) {
            this.reservedData = [...toInsert.reverse(), ...this.reservedData];
            this.setState({newUnreadMessageCount: newMessages.length + this.state.newUnreadMessageCount - systemMessageCount});
        } else {
            const result = [...toInsert.reverse(), ...this.reservedData, ...data];
            this.reservedData = [];
            this.setState({data: result, newUnreadMessageCount: 0}, this.scrollToTop);
        }
    };
}

const styles = StyleSheet.create({
    content: {
    },
    moreMessageContainer: {
        position: 'absolute',
        right: 0,
        width: 120,
        height: 46,
    },
    moreMessage: {
        flex: 1,
        borderTopLeftRadius: 23,
        borderBottomLeftRadius:23,
        left: 5,
    },
    moreMessageBorder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    moreMessageDirection: {
        marginLeft: 8,
    },
    moreMessageText: {
        fontSize: 12,
        color: '#FC6364',
        marginRight: 8,
    },
});
