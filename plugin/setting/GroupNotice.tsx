import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import i18n from 'i18n-js';
import { Typings, Delegate, PageKeys } from '../../standard';
import delegate from "react-native-im/standard/delegate";
import ArrowImage from '@hecom/image-arrow';

export const name = 'IMSettingGroupNotice';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType, onDataChange, navigation} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupNotice = Delegate.model.Group.getNotice(imId);
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    return (
        <GroupNoticeCell
            key={key}
            isOwner={isOwner}
            groupNotice={groupNotice}
            imId={imId}
            navigation={navigation}
            onDataChange={onDataChange}
        />
    );
}

export interface Props {
    isOwner: boolean;
    groupNotice: string | void;
    imId: string;
    onDataChange: () => void;
}

export interface State {
}

export class GroupNoticeCell extends React.PureComponent<Props, State> {
    state: State = {
    };

    render() {
        const {groupNotice} = this.props;
        let title = i18n.t('IMSettingGroupNotice')
        const hasContent = groupNotice != null && groupNotice.length > 0;
        return (
            <TouchableHighlight
                underlayColor={delegate.style.separatorLineColor}
                onPress={() => this._clickNotice()}
            >
                <View style={styles.container}>
                    <View style={styles.line}>
                        {this._renderLabel(title)}
                        <ArrowImage />
                    </View>
                    {hasContent && this._renderContent(groupNotice)}
                </View>
            </TouchableHighlight>
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

    protected _renderContent(text: string) {
        return (
            <View style={styles.content}>
                <Text numberOfLines={2} style={styles.subtitle}>
                    {text}
                </Text>
            </View>
        );
    }

    protected _clickNotice() {
        const {imId, onDataChange, isOwner, groupNotice, navigation} = this.props;
        const curNotice = (!groupNotice) ? groupNotice : ''

        navigation.navigate( PageKeys.GroupNoticeEdit, {
            groupId: imId,
            groupNotice: curNotice,
            canEdit: isOwner,
            onDataChange: onDataChange,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    line: {
        height: 48,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 10,
        alignItems: 'center',
    },
    titleview: {
        height: 48,
        width: 120,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        color: '#333333',
    },
    subtitle: {
        fontSize: 14,
        color: '#aaaaaa',
    },
});
