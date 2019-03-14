import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Message } from '../typings';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        onLoadPage: PropTypes.func.isRequired,
        style: PropTypes.any,
    };

    static defaultProps = {
        pageSize: 20,
    };

    constructor(props) {
        super(props);
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
                if (isAllData) {
                    data = [...data];
                } else {
                    data = [...this.state.data, ...data];
                }
                return {
                    data: data,
                    isEnd: isEnd,
                };
            })
            .finally((state = {}) => {
                this.setState({
                    ...state,
                    isLoading: false,
                });
            });
    };

    scrollToTop = (animated = false) => {
        setTimeout(() => {
            this.innerList && this.innerList.scrollToOffset({offset: 0, animated});
        }, 200);
    };

    insert = (newMessages) => {
        const data = this._mergeMessages(newMessages);
        this.setState({data: [...data]}, this.scrollToTop);
    };

    _mergeMessages = (newMessages) => {
        const data = this.state.data.reverse();
        const oldIdMap = {}, oldInnerIdMap = {};
        data.forEach((item, index) => {
            if (item.messageId) {
                oldIdMap[item.messageId] = index;
            }
            if (item.innerId) {
                oldInnerIdMap[item.innerId] = index;
            }
        });
        for (let i = 0; i < newMessages.length; i++) {
            const item = newMessages[i];
            const {messageId, innerId} = item;
            if (oldIdMap[messageId]) {
                data[oldIdMap[messageId]] = item;
            } else if (oldInnerIdMap[innerId]) {
                data[oldInnerIdMap[innerId]] = item;
            } else {
                data.push(item);
            }
        }
        return data.reverse();
    };
}

const styles = StyleSheet.create({
    content: {
        paddingTop: 10,
        paddingBottom: 10,
    },
});