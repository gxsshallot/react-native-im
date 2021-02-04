import React from 'react';
import i18n from 'i18n-js';
import { Typings, Delegate, PageKeys } from '../../standard';
import { onAddMembers, onRemoveMembers } from './GeneralUpdate';
import { Dimensions, TouchableHighlight, StyleSheet, View, Text} from 'react-native';
import { getSafeAreaInset } from '@hecom/react-native-pure-navigation-bar';

export const name = 'IMSettingAllMembers';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupMembers = Delegate.model.Group.getMembers(imId);
    if (groupMembers.length <= showMaxColumn(props)) {
        return null;
    }

    return (
        <AllMembersCell
            key={key}
            title={i18n.t('IMSettingAllMembers', {length: groupMembers.length})}
            onPressLine={() => _clickAllMembers(props)}
        />
    );
}

function showMaxColumn(props: Typings.Action.Setting.Params): number {
    const {imId} = props;
    const {width, height} = Dimensions.get('window');
    const safeInset = getSafeAreaInset();
    const innerWidth = width - safeInset.left - safeInset.right;
    const groupOwner = Delegate.model.Group.getOwner(imId);
    let itemEdge = 50;
    let column = 0;
    if (width > height) {
        const preInternal = 30;
        column = Math.floor((innerWidth + preInternal) * 1.0 / (itemEdge + preInternal));
    } else {
        column = 5;
    }
    let canAdd = true;
    let canRemove = groupOwner === Delegate.user.getMine().userId;
    const maxRow = 6;
    const showCount = column * maxRow - (canAdd ? 1 : 0) - (canRemove ? 1 : 0);
    return showCount;
}

function _clickAllMembers(props: Typings.Action.Setting.Params): void {
    const {imId, navigation} = props;
    const groupMembers = Delegate.model.Group.getMembers(imId);
    const groupOwner = Delegate.model.Group.getOwner(imId);
    navigation.navigate( PageKeys.GroupMembers, {
            groupId: imId,
            members: groupMembers,
            admins: [groupOwner],
            canAdd: true,
            canRemove: groupOwner === Delegate.user.getMine().userId,
            onAddMembers: (memberUserIds: string[]) => onAddMembers(props, memberUserIds),
            onRemoveMembers: (memberUserIds: string[]) => onRemoveMembers(props, memberUserIds),
        });
}

export interface Props {
    title: string;
    onPressLine?: () => void;
}

export interface State {
    allowInvites: boolean;
}

export class AllMembersCell extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {onPressLine} = this.props;
        return onPressLine ? (
            <TouchableHighlight
                underlayColor={Delegate.style.separatorLineColor}
                onPress={onPressLine}
            >
                {this._renderLine()}
            </TouchableHighlight>
        ) : this._renderLine();
    }

    protected _renderLine() {
        const {title} = this.props;
        return (
            <View style={styles.container}>
                {/* <View style={styles.line}>
                    
                </View> */}
                {this._renderLabel(title)}
            </View>
        );
    }

    protected _renderLabel(title: string) {
        return (
            <View style={styles.titleview}>
                <Text numberOfLines={1} style={styles.title}>
                    {title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',

    },
    line: {
        height: 48,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },

    titleview: {
        height: 48,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        color: '#333333',
        textAlign:'center',
    },
});