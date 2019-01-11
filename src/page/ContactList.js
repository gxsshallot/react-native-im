import React from 'react';
import { Alert, InteractionManager, LayoutAnimation, Linking, StyleSheet, TouchableOpacity, View, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import NaviBar, { forceInset } from 'react-native-pure-navigation-bar';
import { IconFontImage } from 'core/common';
import * as Constant from '../constant';
import * as PageKeys from '../pagekey';
import { mapListToSection } from '../util';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        itemHeight: PropTypes.number,
        getHeaderConfig: PropTypes.func,
    };

    static defaultProps = {
        itemHeight: 64,
    };
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._loadData();
        });
    }

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
    
    _renderList = () => {
        const {itemHeight} = this.props;
        return (
            <delegate.component.SeekBarSectionList
                style={styles.list}
                sections={this.state.data}
                renderItem={this._renderItem}
                headerHeight={itemHeight * 3}
                keyExtractor={item => item.code}
                separatorStyle={styles.separator}
                ListHeaderComponent={this._renderHeader}
                separatorHeight={StyleSheet.hairlineWidth}
                stickySectionHeadersEnabled={true}
                itemHeight={itemHeight}
                sectionHeight={delegate.component.SectionHeader.defaultProps.height}
                renderSectionHeader={this._renderSectionHeader}
                initialNumToRender={20}
            />
        );
    };

    _renderSectionHeader = ({section: {title}}) => {
        return <delegate.component.SectionHeader title={title} />;
    }

    _renderHeader = () => {
        return this.state.items.map(({title, subTitle, onClick, icon}, index) => (
            <delegate.component.ListCell
                key={index}
                title={title}
                subTitle={subTitle}
                onClick={onClick}
                avatar={icon}
                style={this._itemStyle()}
                right={(
                    <delegate.component.ArrowImage style={styles.arrow} />
                )}
            />
        ));
    };

    _renderItem = (row) => {
        const item = row.item;
        return (
            <delegate.component.ListCell
                style={this._itemStyle()}
                avatar={{imId: item.userId, chatType: Constant.ChatType.Single}}
                title={item.name}
                subTitle={item.dept && item.dept.name}
                right={this._renderRight(item)}
                onClick={this._clickItem.bind(this, item)}
            />
        );
    };

    _renderRight = (item) => {
        const { phone } = item;
        return phone && phone.length > 0 ? (
            <TouchableOpacity
                style={styles.phoneBtn}
                onPress={this._clickPhone.bind(this, phone)}
            >
                {IconFontImage.renderImage('e623', styles.phone)}
            </TouchableOpacity>
        ) : undefined;
    };

    _loadData = () => {
        const loadUser = delegate.contact.loadAllUser(true);
        const loadOrg = delegate.contact.loadAllOrg(false);
        return Promise.all([loadUser, loadOrg])
            .then(([users]) => {
                const data = mapListToSection(users, delegate.config.pinyinField);
                const {getHeaderConfig} = this.props;
                const items = getHeaderConfig ? getHeaderConfig({users, sections: data}) : [];
                LayoutAnimation.easeInEaseOut();
                this.setState({data, items});
            });
    };

    _clickItem = (item) => {
        delegate.func.pushToUserDetailPage(item.imId);
    };

    _clickSearchBar = () => {
        this.props.navigation.navigate({
            routeName: PageKeys.Search,
            params: {},
        });
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

    _itemStyle = () => {
        return {
            height: this.props.itemHeight,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: delegate.style.separatorLineColor,
        };
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
        height: 24,
        color: '#e15151',
    },
    phoneBtn: {
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    list: {
        backgroundColor: 'white',
    },
    separator: {
        marginLeft: 80,
    },
    arrow: {
        marginLeft: 10,
        marginRight: 0,
    },
});