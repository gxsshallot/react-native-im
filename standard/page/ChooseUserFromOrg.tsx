import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import PickList, { PickListRowUtil } from '@hecom/react-native-picklist';
import i18n from 'i18n-js';
import { deepExport } from '../util';
import delegate from '../delegate';

export interface Props {
    title: string;
    firstTitleLine: string;
    multiple: boolean;
    hasSelf: boolean;
    parentOrgId: string;
    excludedUserIds: string[];
    selectedIds: string[];
    onSelectData: (node: object[]) => void;
    spaceHeight: number;
}

export default class extends React.PureComponent<Props> {
    static navigationOptions = function (options) {
        if (PickList.initialized(options)) {
            return PickList.navigationOptions(options);
        } else {
            return {
                title: i18n.t('IMCommonPageTitle'),
            };
        }
    };

    static propTypes = {
        title: PropTypes.string.isRequired,
        firstTitleLine: PropTypes.string,
        multiple: PropTypes.bool,
        hasSelf: PropTypes.bool,
        parentOrgId: PropTypes.string,
        excludedUserIds: PropTypes.arrayOf(PropTypes.string),
        selectedIds: PropTypes.arrayOf(PropTypes.string),
        onSelectData: PropTypes.func,
        spaceHeight: PropTypes.number,
    };

    static defaultProps = {
        multiple: false,
        hasSelf: false,
        parentOrgId: undefined,
        excludedUserIds: [],
        spaceHeight: 10,
    };

    constructor(props) {
        super(props);
        this.state = {
            tree: undefined,
        };
    }

    componentDidMount() {
        let promise;
        if (delegate.contact.loadUserOrgTree) {
            const {hasSelf, parentOrgId, excludedUserIds} = this.props;
            promise = delegate.contact.loadUserOrgTree(hasSelf, parentOrgId, excludedUserIds);
        } else {
            const userPromise = delegate.contact.loadAllUser(true);
            const orgPromise = delegate.contact.loadAllOrg(true);
            promise = Promise.all([userPromise, orgPromise])
                .then(([users, orgs]) => this._generateTree(users, orgs));
        }
        return promise
            .then((tree) => {
                this.setState({tree});
            })
            .catch(() => {
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMLoadOrganization')
                }));
            });
    }

    render() {
        const {navigation, title, firstTitleLine, selectedIds, multiple} = this.props;
        const {tree = []} = this.state;
        let data, titleLine, rawRootPath;
        if (tree.length === 1) {
            data = tree[0].children;
            titleLine = tree[0].name;

            const detpPath = tree[0].dept ? tree[0].dept.path + '/' + tree[0].dept.code :
                (tree[0].path ? tree[0].path : '');
            rawRootPath = detpPath + '/' + tree[0].code;
        } else {
            data = tree;
            titleLine = firstTitleLine;
        }
        return this.state.tree !== undefined && (
            <PickList
                navigation={navigation}
                title={title}
                firstTitleLine={titleLine}
                multilevel={true}
                multiselect={multiple}
                data={data}
                renderRow={this._renderRow.bind(this)}
                showCount={true}
                onFinish={this._onFinish.bind(this)}
                searchKeys={[delegate.config.pinyinField]}
                selectable={this._selectable.bind(this)}
                labelKey={'name'}
                idKey={['userId', 'orgId']}
                selectedIds={selectedIds}
                split={this._splitSection.bind(this)}
                directBackWhenSingle={false}
                sectionListProps={{
                    initialNumToRender: 30,
                    renderSectionFooter: this._renderSectionFooter.bind(this),
                }}
                firstRawRootPath={rawRootPath}
                weakNodeTag={this._weakNodeTag}
                rootPath={(root: any) => {
                    if (root.firstRawRootPath) {
                        return root.firstRawRootPath;
                    }
                    const detpPath = root.dept ? root.dept.path + '/' + root.dept.code : '';
                    return detpPath + '/' + (root.code || '');
                }}
                parentPath={(root: any) => {
                    return root.dept ? root.dept.path + '/' + root.dept.code : '';
                }}
            />
        );
    }

    _renderSectionFooter({section}) {
        const viewStyle = {
            height: this.props.spaceHeight,
            backgroundColor: delegate.style.separatorLineColor,
        };
        return section.hasFooter ? <View style={viewStyle} /> : null;
    }

    _renderRow(treeNode, props) {
        return treeNode.getInfo().userId ?
            PickListRowUtil.multiLevelLeafNode(treeNode, props) :
            PickListRowUtil.multiLevelNotLeafNode(treeNode, props);
    }

    _onFinish(nodes, notBack = false) {
        nodes = nodes
            .reduce((prv, cur) => [...prv, ...cur.getLeafChildren()], [])
            .map(node => node.getInfo().userId);
        this.props.onSelectData && this.props.onSelectData(nodes, notBack);
    }

    _selectable(treeNode) {
        return this.props.multiple || treeNode.getInfo().userId;
    }

    _splitSection(children) {
        const notLeafItems = children.filter(treeNode => treeNode.getInfo().orgId);
        const leafItems = children.filter(treeNode => treeNode.getInfo().userId);
        const hasFooter = leafItems.length > 0 && notLeafItems.length > 0;
        return [
            {data: notLeafItems, hasFooter: hasFooter},
            {data: leafItems}
        ];
    }

    _generateTree(users, orgs) {
        const {hasSelf, parentOrgId, excludedUserIds} = this.props;
        let tree;
        if (parentOrgId && parentOrgId.length > 0) {
            tree = orgs.filter(item => item.orgId === parentOrgId);
        } else {
            const orgIds = orgs.map(item => item.orgId);
            tree = orgs.filter(item => {
                if (!item.dept || !item.dept.orgId) {
                    return true;
                } else {
                    return orgIds.indexOf(item.dept.orgId) < 0;
                }
            });
        }
        tree = deepExport(tree);
        let queue = [...tree];
        const meUserId = delegate.user.getMine().userId;
        while (queue.length > 0) {
            const parent = queue[0];
            parent.children = [];
            // Orgs
            if (orgs) {
                const subdepts = orgs
                    .filter(item => item.dept && item.dept.orgId === parent.orgId)
                    .filter(item => Array.isArray(excludedUserIds) ? excludedUserIds.indexOf(item.orgId) < 0 : true);
                const deptitems = deepExport(subdepts);
                deptitems.forEach(item => {
                    parent.children.push(item);
                    queue.push(item);
                });
            }
            // Users
            if (users) {
                const subusers = users
                    .filter(item => item.dept && item.dept.orgId === parent.orgId)
                    .filter(item => !hasSelf ? item.userId !== meUserId : true)
                    .filter(item => Array.isArray(excludedUserIds) ? excludedUserIds.indexOf(item.userId) < 0 : true);
                const useritems = deepExport(subusers);
                useritems.forEach(item => {
                    parent.children.push(item);
                });
            }
            queue = queue.slice(1);
        }
        return tree;
    }

    _weakNodeTag = () => {
        return (
            <View style={{
                borderColor: '#1890FF',
                borderWidth: 1,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5,
            }}>
                <Text style={{
                    color: '#1890FF',
                    paddingHorizontal: 2,
                    fontSize: 13
                }}>
                    {'兼职'}
                </Text>
            </View>
        )
    };
}