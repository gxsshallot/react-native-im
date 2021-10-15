import React from 'react';
import {
    Alert,
    Image,
    InteractionManager,
    LayoutAnimation,
    Linking,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import NaviBar, {forceInset} from '@hecom/react-native-pure-navigation-bar';
import ArrowImage from '@hecom/image-arrow';
import Listener from '@hecom/listener';
import * as PageKeys from '../pagekey';
import {mapListToSection} from '../util';
import {Conversation, Event} from '../typings';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        itemHeight: PropTypes.number,
        getHeaderConfig: PropTypes.func,
    };

    static defaultProps = {
        itemHeight: 70,
    };

    listener: any;

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (delegate.config.useStarUser) {
            this.listener = Listener.register([Event.Base, Event.StarUserChange], this._onStarUserChange);
        }
        InteractionManager.runAfterInteractions(() => {
            this._loadData();
        });
        Dimensions.addEventListener('change', this._onOrientationChange.bind(this));
    }

    componentWillUnmount() {
        this.listener && Listener.unregister([Event.Base, Event.StarUserChange], this.listener);
        Dimensions.removeEventListener('change', this._onOrientationChange.bind(this));
    }

    _onOrientationChange = () => {
        this.forceUpdate();
    };

    render() {
        const style = {
            backgroundColor: delegate.style.viewBackgroundColor,
        };
        return (
            <View style={[styles.view, style]}>
                <NaviBar title={'通讯录'} />
                <delegate.component.FakeSearchBar
                    onFocus={this._clickSearchBar}
                    placeholder={'搜索'}
                />
                <SafeAreaView
                    style={styles.safeview}
                    forceInset={forceInset(0, 1, 1, 1)}
                >
                    {Array.isArray(this.state.data) ? this._renderList() : null}
                </SafeAreaView>
            </View>
        );
    }

    _rowRenderer = (data) => {
        let subTitle = data.dept && data.dept.name;
        if (data.title) {
            subTitle += (subTitle ? ' | ' : '') + data.title
        }
        return (
            <>
                <delegate.component.ListCell
                    avatar={{ imId: data.userId, chatType: Conversation.ChatType.Single }}
                    title={data.name}
                    subTitle={subTitle}
                    right={this._renderRight(data)}
                    onClick={this._clickItem.bind(this, data)}
                />
                {this.renderSeparator()}
            </>
        );
    }

    _renderList = () => {
        const {itemHeight} = this.props;
        const {items = []} = this.state;
        let { width } = Dimensions.get("window");
        return (
            <delegate.component.FixedSectionList
                style={styles.list}
                sections={this.state.data}
                renderItem={this._rowRenderer}
                headerHeight={itemHeight * items.length}
                renderHeaderComponent={this._renderHeader}
                hasHeader={true}
                itemHeight={itemHeight + StyleSheet.hairlineWidth}
                sectionHeight={delegate.component.SectionHeader.defaultProps.height}
                renderSectionHeader={this._renderSectionHeader}
                itemWidth= {width}
                renderAheadOffset= {itemHeight * 20}
            />
        );
    };

    renderSeparator = () => {
        return <View style={styles.separator} />
    }

    _renderSectionHeader = (title) => {
        return <delegate.component.SectionHeader title={title} />;
    };

    _renderHeader = () => {
        return this.state.items.map(({title, subTitle, onClick, icon, showBranchTop, showBranchBottom}, index) => (
            <delegate.component.HeaderCell
                key={index}
                title={title}
                subTitle={subTitle}
                onClick={onClick}
                avatar={icon}
                showBranchTop={showBranchTop}
                showBranchBottom={showBranchBottom}
                right={<ArrowImage style={styles.arrow} />}
            />
        ));
    };

    _renderItem = (row) => {
        const item = row.item;
        let subTitle = item.dept && item.dept.name;
        if (item.title) {
            subTitle += (subTitle ? ' | ' : '') + item.title
        }
        return (
            <delegate.component.ListCell
                avatar={{imId: item.userId, chatType: Conversation.ChatType.Single}}
                title={item.name}
                subTitle={subTitle}
                right={this._renderRight(item)}
                onClick={this._clickItem.bind(this, item)}
            />
        );
    };

    _renderRight = (item) => {
        const {phone} = item;
        return phone && phone.length > 0 ? (
            <TouchableOpacity
                style={styles.phoneBtn}
                onPress={this._clickPhone.bind(this, phone)}
            >
                <Image
                    source={require('./image/phone.png')}
                    style={styles.phone}
                />
            </TouchableOpacity>
        ) : undefined;
    };

    _loadData = () => {
        const loadUser = delegate.contact.loadAllUser(true);
        const loadOrg = delegate.contact.loadAllOrg(false);
        const loadStarUser = delegate.config.useStarUser ? delegate.contact.loadStarUser() : Promise.resolve();
        return Promise.all([loadUser, loadOrg, loadStarUser])
            .then(([users, , starUsers = []]) => {
                let data: Array<{}>;
                if (users.length < 100000) {
                    data = mapListToSection(users, delegate.config.pinyinField);
                    if (starUsers.length > 0) {
                        data.unshift({key: '☆', title: '星标好友', data: starUsers});
                    }
                } else {
                    data = []
                }
                const {getHeaderConfig} = this.props;
                const items = getHeaderConfig ? getHeaderConfig({users, sections: data}) : [];
                LayoutAnimation.easeInEaseOut();
                this.setState({data, items});
            });
    };

    _clickItem = (item) => {
        delegate.func.pushToUserDetailPage(item.imId);
    };

    _onStarUserChange = () => {
        delegate.contact.loadStarUser()
            .then(starUsers => {
                const {data} = this.state;
                if (Array.isArray(data) && data.length > 0) {
                    const first = data[0];
                    if (first.key === '☆') {
                        if (starUsers.length === 0) {
                            data.shift();
                        } else {
                            first.data = starUsers;
                        }
                    } else {
                        data.unshift({key: '☆', title: '星标好友', data: starUsers});
                    }
                    this.setState({data: [...data]});
                }
            });
    };

    _clickSearchBar = () => {
        this.props.navigation.navigate( PageKeys.Search, {});
    };

    _clickPhone = (phone) => {
        const url = "tel:" + phone;
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    Alert.alert('', '当前设备无法拨打电话', [{
                        text: '确定'
                    }]);
                } else {
                    Linking.openURL(url);
                }
            })
            .catch(err => {
                Toast.show(err.message);
            });
    };
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    safeview: {
        flex: 1,
        backgroundColor: 'white',
    },
    phone: {
        width: 24,
        height: 24,
    },
    phoneBtn: {
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        backgroundColor: 'white',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 74,
        backgroundColor: delegate.style.separatorLineColor,
    },
    arrow: {
        marginLeft: 10,
        marginRight: 0,
    },
});