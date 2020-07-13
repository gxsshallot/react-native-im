import React from 'react';
import { InteractionManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import PickList from 'react-native-picklist';
import i18n from 'i18n-js';
import ArrowImage from '@hecom/image-arrow';
import ChooseUserFromOrgPage from './ChooseUserFromOrg';
import delegate from '../delegate';
import * as Types from '../proptype';
import * as PageKeys from '../pagekey';

export default class extends React.Component {
    static navigationOptions = function (options) {
        if (PickList.initialized(options)) {
            return PickList.navigationOptions(options);
        } else {
            return {
                title: i18n.t('IMCommonPageTitle'),
            };
        }
    };

    // static propTypes = {
    //     ...ChooseUserFromOrgPage.propTypes,
    //     dataSource: PropTypes.arrayOf(PropTypes.shape(Types.ImUser)),
    // };

    static defaultProps = {
        ...ChooseUserFromOrgPage.defaultProps,
    };

    constructor(props) {
        super(props);
        this.state = {
            users: props.dataSource,
 	        selectedIds: props.selectedIds
        };
	   this.idKey = 'userId';
    }

    componentDidMount() {
        if (!this.state.users) {
            delegate.contact.loadAllUser(true)
                .then((users) => {
                    const {excludedUserIds, hasSelf} = this.props;
                    if (Array.isArray(excludedUserIds) && excludedUserIds.length > 0) {
                        users = users.filter(item => excludedUserIds.indexOf(item.userId) < 0);
                    }
                    if (!hasSelf) {
                        const meUserId = delegate.user.getMine().userId;
                        users = users.filter(item => item.userId !== meUserId);
                    }
                    this.setState({users});
                })
                .catch(() => {
                    Toast.show(i18n.t('IMToastError', {
                        action: i18n.t('IMLoadOrganization')
                    }));
                });
        }
    }

    render() {
        const {navigation, title, selectedIds, multiple, dataSource, showBottomView} = this.props;
        return this.state.users !== undefined && (
            <PickList
		ref={(ref) => (this.pickList = ref)}
                navigation={navigation}
                title={title}
                multilevel={false}
                multiselect={multiple}
                showBottomView={showBottomView}
                data={this.state.users}
                onFinish={this._onFinish.bind(this)}
                renderHeader={dataSource ? undefined : this._renderHeader.bind(this)}
                rightTitle={multiple ? delegate.config.buttonOK : undefined}
                searchKeys={[delegate.config.pinyinField]}
                labelKey={'name'}
                idKey={'userId'}
                selectedIds={selectedIds}
                split={this._splitSections.bind(this)}
                sectionListProps={{
                    initialNumToRender: 20,
                    renderSectionHeader: this._renderSectionHeader.bind(this),
                }}
		        customView={this._getCustomView}
                refreshSingleCell= {false}
                renderRow={this._renderRow}
            />
        );
    }

    _renderSectionHeader({section}) {
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
    }

    _renderHeader() {
        const style = {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: delegate.style.separatorLineColor,
        };
        return (
            <View style={styles.row}>
                <TouchableOpacity onPress={this._clickHeader.bind(this)}>
                    <View style={[styles.container, style]}>
                        <Text style={styles.text}>
                            {i18n.t('IMPageChooseUserSelectFromOrg')}
                        </Text>
                        <ArrowImage style={styles.icon} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _splitSections(users) {
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
    }

    _onFinish(nodes) {
        this._selectedOnFinish(nodes);
        nodes = nodes
            .reduce((prv, cur) => [...prv, ...cur.getLeafChildren()], [])
            .map(node => node.getInfo().userId);
        this.props.onSelectData && this.props.onSelectData(nodes);
    }

    _clickHeader() {
        const selectedIds = this._getCurrentSelectedIdKeys('userId');
        const onSelectDataFunc = (nodes, notBack = false) => {
	    if(notBack){
                this._refreshBackData(nodes, this.idKey);
                return;
          }
        this.props.onSelectData && this.props.onSelectData(nodes);
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.goBack();
        });
        };
        const {title, multiple, hasSelf, parentOrgId, excludedUserIds, spaceHeight} = this.props;
        this.props.navigation.navigate(PageKeys.ChooseUserFromOrg,{
                title, multiple, hasSelf, parentOrgId, excludedUserIds, selectedIds, spaceHeight,
                firstTitleLine: delegate.user.getMine().entName,
                onSelectData: onSelectDataFunc,
            });
    }
    _getCustomView  = (data, renderRow) => null;

    _renderRow  = (treeNode, props) => null;

    _selectedOnFinish = (nodes) => null;

    _getCurrentSelectedIdKeys = (idKey) => [];

    _refreshBackData = (nodes) => []
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
