import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import PickList, { PickListRowUtil } from '@hecom/react-native-picklist';
import i18n from 'i18n-js';
import * as PageKeys from '../pagekey';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static navigationOptions = PickList.navigationOptions;

    static propTypes = {
        title: PropTypes.string,
        allowMulti: PropTypes.bool,
        selectedIds: PropTypes.arrayOf(PropTypes.string),
        excludedIds: PropTypes.arrayOf(PropTypes.string),
        onSelectData: PropTypes.func,
    };

    static defaultProps = {
        title: i18n.t('IMPageChooseConversationTitle'),
        allowMulti: true,
        selectedIds: [],
        excludedIds: [],
    };

    constructor(props) {
        super(props);
        this.selectedIndexs = Array.from(new Set(props.selectedIds));
        const dataSource = delegate.model.Conversation.get()
            .filter(item => props.excludedIds.indexOf(item.imId) < 0)
            .map(item => ({
                ...item,
                label: delegate.model.Conversation.getName(item.imId),
            }));
        this.state = {
            dataSource: dataSource,
            multi: false,
        };
    }

    render() {
        const {title} = this.props;
        const rights = {};
        if (this.state.multi) {
            rights.rightTitle = i18n.t('IMCommonSingleSelect');
            rights.rightClick = this._clickChangeMulti.bind(this, false);
        } else if (this.props.allowMulti) {
            rights.rightTitle = i18n.t('IMCommonMultiSelect');
            rights.rightClick = this._clickChangeMulti.bind(this, true);
        }
        return this.state.dataSource === undefined ? null : (
            <PickList
                title={title}
                multilevel={false}
                multiselect={this.state.multi}
                data={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                onFinish={this._onFinish.bind(this)}
                showBottomView={this.state.multi}
                showSearchView={true}
                selectedIds={this.selectedIndexs}
                idKey={'imId'}
                labelKey={'label'}
                {...rights}
                navigation={this.props.navigation}
            />
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
                            {i18n.t('IMPageChooseConversationCreateNew')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderRow(treeNode) {
        const style = {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: delegate.style.separatorLineColor,
        };
        const info = treeNode.getInfo();
        const isSelected = treeNode.isFullSelect();
        let image = undefined;
        if (this.state.multi) {
            if (isSelected) {
                image = (
                    <Image
                        source={PickListRowUtil.select_image()}
                        style={styles.image}
                    />
                );
            } else {
                image = (
                    <Image
                        source={PickListRowUtil.notselect_image()}
                        style={styles.image}
                    />
                );
            }
        }
        return (
            <delegate.component.ListCell
                style={style}
                avatar={{imId: info.imId, chatType: info.chatType}}
                title={delegate.model.Conversation.getName(info.imId)}
                right={image}
            />
        );
    }

    _onFinish(selectedTreeNodes) {
        const selectedInfos = selectedTreeNodes.map(treeNode => treeNode.getInfo());
        this.props.onSelectData && this.props.onSelectData(selectedInfos);
    }

    _clickChangeMulti(status) {
        this.setState({
            multi: status,
        });
    }

    _clickHeader() {
        this.props.navigation.navigate(PageKeys.ChooseUser, {
                title: i18n.t('IMPageChooseConversationCreateNew'),
                multiple: true,
                onSelectData: this._onCreateNew.bind(this),
                selectedIds: [],
            });
    }

    _onCreateNew(data, label) {
        if (!data || data.length <= 0) {
            return;
        }
        delegate.model.Conversation.createOne(data)
            .then(({imId, chatType}) => {
                const items = [{imId, chatType, label}];
                this.props.onSelectData && this.props.onSelectData(items);
                this.props.navigation.goBack();
            });
    }
}

const styles = StyleSheet.create({
    image: {
        width: 18,
        height: 18,
        borderRadius: 9,
        marginRight: 16,
    },
    row: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
    },
    container: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#333333',
    },
});