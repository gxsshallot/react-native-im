import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class extends React.PureComponent {
    static propTypes = {
        onLoadPage: PropTypes.func.isRequired,
        style: PropTypes.any,
    };

    static defaultProps = {
        pageSize: 20,
    };

    ids: Set<string>;
    innerIds: Set<string>;

    constructor(props) {
        super(props);
        this.ids = new Set();
        this.innerIds = new Set();
        this.state = {
            data: [],
            isEnd: false,
            isLoading: false,
        };
    }

    componentDidMount() {
        this._loadPage();
    }

    render() {
        return (
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
                keyExtractor={item => item.messageId || item.innerId}
                {...this.props}
                renderItem={(arg) => this.props.renderItem(arg, this.state.data)}
            />
        );
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

    insert = (newMessages) => {
        const data = [...this.state.data];
        const toInsert = newMessages.reduce((prv, cur) => {
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
        this.setState({data: result}, this.scrollToTop);
    };
}

const styles = StyleSheet.create({
    content: {
        paddingTop: 10,
        paddingBottom: 10,
    },
});