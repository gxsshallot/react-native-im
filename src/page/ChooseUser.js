import React from 'react';
import { InteractionManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import PickList from 'react-native-picklist';
import NaviBar from 'react-native-pure-navigation-bar';
import ArrowImage from '@hecom/image-arrow';
import ChooseUserFromOrgPage from './ChooseUserFromOrg';
import delegate from '../delegate';
import * as Types from '../proptype';
import * as PageKeys from '../pagekey';

export default class extends React.PureComponent {
    static navigationOptions = PickList.navigationOptions;

    static propTypes = {
        ...ChooseUserFromOrgPage.propTypes,
        dataSource: PropTypes.arrayOf(PropTypes.shape(Types.ImUser)),
        labelSelectUserFromOrg: PropTypes.string,
    };

    static defaultProps = {
        ...ChooseUserFromOrgPage.defaultProps,
        labelSelectUserFromOrg: '按部门选同事',
    };

    constructor(props) {
        super(props);
        this.state = {
            users: props.dataSource,
        };
    }

    componentDidMount() {
        if (!this.state.users) {
            delegate.contact.loadAllUser(true)
                .then((users) => {
                    this.setState({users});
                })
                .catch(() => {
                    Toast.show(this.props.labelLoadError);
                });
        }
    }

    render() {
        const {title, selectedIds, multiple, dataSource} = this.props;
        return this.state.users !== undefined ? (
            <PickList
                title={title}
                multilevel={false}
                multiselect={multiple}
                showBottomView={false}
                data={this.state.users}
                onFinish={this._onFinish}
                renderHeader={dataSource ? undefined : this._renderHeader}
                rightTitle={multiple ? delegate.config.buttonOK : undefined}
                searchKeys={[delegate.config.pinyinField]}
                labelKey={'name'}
                idKey={'userId'}
                selectedIds={selectedIds}
                split={this._splitSections}
                sectionListProps={{
                    initialNumToRender: 20,
                    renderSectionHeader: this._renderSectionHeader,
                }}
                navigation={this.props.navigation}
            />
        ) : <NaviBar title={delegate.config.titleLoading} />;
    }

    _renderSectionHeader = ({section}) => {
        const style = {
            backgroundColor: delegate.style.viewBackgroundColor,
        };
        return (
            <View style={[styles.section, style]}>
                <Text style={styles.sectionHeader}>
                    {section.title}
                </Text>
            </View>
        );
    };

    _renderHeader = () => {
        const style = {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: delegate.style.separatorLineColor,
        };
        return (
            <View style={styles.row}>
                <TouchableOpacity onPress={this._clickHeader}>
                    <View style={[styles.container, style]}>
                        <Text style={styles.text}>
                            {this.props.labelSelectUserFromOrg}
                        </Text>
                        <ArrowImage style={styles.icon} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _splitSections = (users) => {
        const {excludedUserIds, hasSelf} = this.props;
        if (Array.isArray(excludedUserIds) && excludedUserIds.length > 0) {
            users = users.filter(item => excludedUserIds.indexOf(item.getId()) < 0);
        }
        if (!hasSelf) {
            const meUserId = delegate.user.getMine().userId;
            users = users.filter(item => item.getId() !== meUserId);
        }
        const flusers = users
            .reduce((prv, cur) => {
                const value = cur.getInfo()[delegate.config.pinyinField];
                let fl = value && value.length > 0 ? value[0].toUpperCase() : '#';
                if (!/^[A-Z]$/.test(fl)) {
                    fl = '#';
                }
                if (prv[fl]) {
                    prv[fl].push(cur);
                } else {
                    prv[fl] = [cur];
                }
                return prv;
            }, {});
        users = Object.keys(flusers)
            .sort((a, b) => {
                if (a === '#') {
                    return 1;
                } else if (b === '#') {
                    return -1;
                } else {
                    return a < b ? -1 : 1;
                }
            })
            .map(fl => {
                const v = flusers[fl]
                    .sort((a, b) => {
                        const va = a.getInfo()[delegate.config.pinyinField];
                        const vb = b.getInfo()[delegate.config.pinyinField];
                        return va === vb ? 0 : va < vb ? -1 : 1;
                    });
                return {
                    title: fl,
                    data: v,
                };
            });
        return users;
    };

    _onFinish = (nodes) => {
        nodes = nodes
            .reduce((prv, cur) => [...prv, ...cur.getLeafChildren()], [])
            .map(node => node.getInfo().userId);
        this.props.onSelectData && this.props.onSelectData(nodes);
    };

    _clickHeader = () => {
        const onSelectDataFunc = (nodes) => {
            this.props.onSelectData && this.props.onSelectData(nodes);
            InteractionManager.runAfterInteractions(() => {
                this.props.navigation.goBack();
            });
        };
        this.props.navigation.navigate({
            routeName: PageKeys.ChooseUserFromOrg,
            params: {
                ...this.props,
                firstTitleLine: 'IM测试', // TODO 修改企业名称
                onSelectData: onSelectDataFunc,
            },
        });
    };
}

const styles = StyleSheet.create({
    row: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
    },
    container: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    section: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    sectionHeader: {
        fontSize: 16,
        color: '#999999',
    },
    text: {
        fontSize: 16,
        color: '#333333',
    },
    icon: {
        marginLeft: 10,
        marginRight: 0,
    },
});