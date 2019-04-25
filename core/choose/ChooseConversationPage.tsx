import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PickList, { PickListRowUtil } from 'react-native-picklist';
import Tree from 'general-tree';
import i18n from 'i18n-js';
import Common, { CommonType, PageKey } from '../common';
import { Conversation } from '../../model';
import delegate from '../../delegate';

export interface Props extends CommonType.Page {
    /**
     * 已选中的项的会话ID列表。
     */
    selectedIds: string[];
    /**
     * 排除项的会话ID列表。
     */
    excluededIds: string[];
    /**
     * 选中后的回调处理方法。
     * @param items 选中会话ID的列表。
     */
    onSelectData(items: string[]): void;
    /**
     * 标题，(仅用于defaultProps)。
     */
    title: string;
    /**
     * 是否允许多选，(仅用于defaultProps)。
     */
    allowMulti: boolean;
}

export interface State {
    /**
     * 是否是多选状态。
     */
    multi: boolean;
}

/**
 * 选择会话页面。
 */
export default class extends React.PureComponent<Props, State> {
    static navigationOptions = PickList.navigationOptions;

    static defaultProps = {
        selectedIds: [],
        excludedIds: [],
        title: i18n.t('IMPageChooseConversationTitle'),
        allowMulti: true,
    };

    /**
     * 会话列表数据源。
     */
    protected dataSource: Data[];

    /**
     * 已选中的会话ID列表。
     */
    protected selectedIndexs: string[];

    constructor(props: Props) {
        super(props);
        this.selectedIndexs = Array.from(new Set(props.selectedIds));
        this.dataSource = delegate.Manager.Conversation.get()
            .filter(item => props.excluededIds.indexOf(item.imId()) < 0)
            .map(item => ({
                ...item.getItem(),
                label: item.name(),
            }));
        this.state = {
            multi: false,
        };
    }

    render() {
        const {title} = this.props;
        let rightTitle, rightClick;
        // 当前是多选状态
        if (this.state.multi) {
            rightTitle = i18n.t('IMCommonSingleSelect');
            rightClick = this._clickChangeMulti.bind(this, false);
        }
        // 当前是单选状态且允许多选
        else if (this.props.allowMulti) {
            rightTitle = i18n.t('IMCommonMultiSelect');
            rightClick = this._clickChangeMulti.bind(this, true);
        }
        return (
            <PickList
                title={title}
                multilevel={false}
                multiselect={this.state.multi}
                data={this.dataSource}
                renderRow={this._renderRow.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                onFinish={this._onFinish.bind(this)}
                showBottomView={this.state.multi}
                showSearchView={true}
                selectedIds={this.selectedIndexs}
                idKey={'imId'}
                labelKey={'label'}
                rightTitle={rightTitle}
                rightClick={rightClick}
                navigation={this.props.navigation}
            />
        );
    }

    /**
     * 渲染视图的头部创建新会话按钮。
     * @protected
     */
    protected _renderHeader() {
        const style = {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: delegate.Config.Style.separatorLineColor,
        };
        return (
            <View style={styles.row}>
                <TouchableOpacity onPress={this._clickHeader.bind(this)}>
                    <View style={[styles.container, style]}>
                        <Text style={styles.text} numberOfLines={1}>
                            {i18n.t('IMPageChooseConversationCreateNew')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * 渲染一行会话视图。
     * @param treeNode 会话的树节点，包括其信息
     * @protected
     */
    protected _renderRow(treeNode: Tree) {
        const style = {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: delegate.Config.Style.separatorLineColor,
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
            <Common.ListCell
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

    /**
     * 点击改变多选状态。
     * @param status 新的多选状态。
     * @protected
     */
    protected _clickChangeMulti(status: boolean) {
        this.setState({
            multi: status,
        });
    }

    /**
     * 点击头部创建新会话按钮的动作。
     * @protected
     */
    protected _clickHeader() {
        this.props.navigation.navigate({
            routeName: PageKey.ChooseUser,
            // TODO 检查选择人员页面参数
            params: {
                title: i18n.t('IMPageChooseConversationCreateNew'),
                multiple: true,
                onSelectData: this._onCreateNew.bind(this),
                selectedIds: [],
            },
        });
    }

    /**
     * 创建新会话操作。
     * @param members 人员ID列表。
     * @protected
     */
    protected async _onCreateNew(members: string[]): Promise<void> {
        if (!members || members.length <= 0) {
            return;
        }
        const item = await delegate.Manager.Conversation.createOne(members);
        this.props.onSelectData([item.imId()]);
        this.props.navigation.goBack();
    }
}

interface Data extends Conversation.Item {
    label: string;
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