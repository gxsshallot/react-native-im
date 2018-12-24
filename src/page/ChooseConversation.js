import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import PickList, { PickListRowUtil } from 'react-native-picklist';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        allowMulti: PropTypes.bool,
        selectedIds: PropTypes.arrayOf(PropTypes.string),
        onSelectData: PropTypes.func,
    };

    static defaultProps = {
        title: '选择聊天',
        allowMulti: true,
    };

    constructor(props) {
        super(props);
        this.selectedIndexs = Array.from(new Set(props.selectedIds));
        this.state = {
            dataSource: delegate.model.Conversation.get(),
            multi: false,
        };
    }

    render() {
        const { title } = this.props;
        const rights = {};
        if (this.state.multi) {
            rights.rightTitle = '单选';
            rights.rightClick = this._clickChangeMulti.bind(this, false);
        } else if (this.props.allowMulti) {
            rights.rightTitle = '多选';
            rights.rightClick = this._clickChangeMulti.bind(this, true);
        }
        return this.state.dataSource === undefined ? null : (
            <PickList
                title={title}
                multilevel={false}
                multiselect={this.state.multi}
                data={this.state.dataSource}
                renderRow={this._renderRow}
                renderHeader={this._renderHeader}
                onFinish={this._onFinish}
                showBottomView={false}
                showSearchView={true}
                selectedIds={this.selectedIndexs}
                idKey='imId'
                {...rights}
            />
        );
    }

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
                            {'创建新聊天'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _renderRow = (treeNode) => {
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
                        source={PickListRowUtil.select_image}
                        style={styles.image}
                    />
                );
            } else {
                image = (
                    <Image
                        source={PickListRowUtil.notselect_image}
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
                onClick={this._clickRow}
            />
        );
    };

    _onFinish = (selectedTreeNodes) => {
        const selectedInfos = selectedTreeNodes.map(treeNode => treeNode.getInfo());
        this.props.onSelectData && this.props.onSelectData(selectedInfos);
    };

    _clickChangeMulti = (status) => {
        this.setState({
            multi: status,
        });
    };

    _clickHeader = () => {
        // TODO
    };
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