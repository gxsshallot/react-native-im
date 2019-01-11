import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import NaviBar from 'react-native-pure-navigation-bar';
import PickList, { PickListRowUtil } from 'react-native-picklist';
import { deepExport } from '../util';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        firstTitleLine: PropTypes.string,
        multiple: PropTypes.bool,
        hasSelf: PropTypes.bool,
        parentOrgId: PropTypes.string,
        excludedUserIds: PropTypes.arrayOf(PropTypes.string),
        selectedIds: PropTypes.arrayOf(PropTypes.string),
        onSelectData: PropTypes.func,
        labelLoadError: PropTypes.string,
        spaceHeight: PropTypes.number,
    };

    static defaultProps = {
        firstTitleLine: '所有部门',
        multiple: false,
        hasSelf: false,
        parentOrgId: undefined,
        excludedUserIds: [],
        labelLoadError: '加载组织架构失败',
        spaceHeight: 10,
    };

    constructor(props) {
        super(props);
        this.state = {
            tree: undefined,
        };
    }

    componentDidMount() {
        const userPromise = delegate.contact.loadAllUser(true);
        const orgPromise = delegate.contact.loadAllOrg(true);
        Promise.all([userPromise, orgPromise])
            .then(([users, orgs]) => {
                const tree = this._generateTree(users, orgs);
                this.setState({
                    tree: tree,
                });
            })
            .catch(() => {
                Toast.show(this.props.labelLoadError);
            });
    }

    render() {
        const {title, firstTitleLine, selectedIds, multiple} = this.props;
        return this.state.tree !== undefined ? (
            <PickList
                title={title}
                firstTitleLine={firstTitleLine}
                multilevel={true}
                multiselect={multiple}
                data={this.state.tree}
                renderRow={this._renderRow}
                showCount={true}
                onFinish={this._onFinish}
                searchKeys={[delegate.config.pinyinField]}
                selectable={this._selectable}
                labelKey={'name'}
                idKey={'id'}
                selectedIds={selectedIds}
                split={this._splitSection}
                directBackWhenSingle={false}
                sectionListProps={{
                    initialNumToRender: 30,
                    renderSectionFooter: this._renderSectionFooter,
                }}
            />
        ) : <NaviBar title={delegate.config.titleLoading} />;
    }

    _renderSectionFooter = ({section}) => {
        const viewStyle = {
            height: this.props.spaceHeight,
            backgroundColor: delegate.style.separatorLineColor,
        };
        return section.hasFooter ? <View style={viewStyle} /> : null;
    };

    _renderRow = (treeNode, props) => {
        return treeNode.getInfo().userId ?
            PickListRowUtil.multiLevelLeafNode(treeNode, props) :
            PickListRowUtil.multiLevelNotLeafNode(treeNode, props);
    };

    _onFinish = (nodes) => {
        nodes = nodes
            .reduce((prv, cur) => [...prv, ...cur.getLeafChildren()], [])
            .map(node => node.getInfo().userId);
        this.props.onSelectData && this.props.onSelectData(nodes);
    };

    _selectable = (treeNode) => {
        return this.props.multiple || treeNode.getInfo().userId;
    };

    _splitSection = (children) => {
        const notLeafItems = children.filter(treeNode => treeNode.getInfo().orgId);
        const leafItems = children.filter(treeNode => treeNode.getInfo().userId);
        const hasFooter = leafItems.length > 0 && notLeafItems.length > 0;
        return [
            {data: notLeafItems, hasFooter: hasFooter},
            {data: leafItems}
        ];
    };

    _generateTree = (users, orgs) => {
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
            parent.id = parent.orgId;
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
                    item.id = item.userId;
                    parent.children.push(item);
                });
            }
            queue = queue.slice(1);
        }
        return tree;
    };
}