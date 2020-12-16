import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import i18n from 'i18n-js';
import { Typings, Delegate, PageKeys } from '../../standard';
import delegate from "react-native-im/standard/delegate";
import ArrowImage from '@hecom/image-arrow';

export const name = 'IMSettingGroupAnnouncement';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType, onDataChange, navigation, onSendMessage} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupAnnouncement = Delegate.model.Group.getAnnouncement(imId);
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    return (
        <GroupAnnouncementCell
            key={key}
            isOwner={isOwner}
            groupAnnouncement={groupAnnouncement}
            imId={imId}
            navigation={navigation}
            onDataChange={onDataChange}
            onSendMessage={onSendMessage}
        />
    );
}

export interface Props {
    isOwner: boolean;
    groupAnnouncement: string | void;
    imId: string;
    onDataChange: () => void;
}

export interface State {
}

export class GroupAnnouncementCell extends React.PureComponent<Props, State> {
    state: State = {
    };

    render() {
        const {isOwner, groupAnnouncement} = this.props;
        let title = i18n.t('IMSettingGroupAnnouncement')
        const hasContent = groupAnnouncement != null && groupAnnouncement.length > 0;
        let onPressFunc = (isOwner || hasContent) ? this._clickAnnouncement.bind(this) : this._noSetting.bind(this)
        return (
            <TouchableHighlight
                underlayColor={delegate.style.separatorLineColor}
                onPress={onPressFunc}
            >
                <View style={styles.container}>
                    <View style={styles.line}>
                        {this._renderLabel(title)}
                        {hasContent == false && (
                            <View style={styles.subTitleContainer}>
                                <Text numberOfLines={1} style={styles.subtitle}>
                                    {'未设置'}
                                </Text>
                            </View>
                        )}
                        <ArrowImage />
                    </View>
                    {hasContent && this._renderContent(groupAnnouncement)}
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
                <Text numberOfLines={2} style={styles.contentText}>
                    {text}
                </Text>
            </View>
        );
    }

    protected _clickAnnouncement() {
        const {imId, onDataChange, isOwner, groupAnnouncement, navigation, onSendMessage} = this.props;
        const curAnnouncement = (groupAnnouncement != null) ? groupAnnouncement : ''

        navigation.navigate( PageKeys.GroupAnnouncementEdit, {
            groupId: imId,
            groupAnnouncement: curAnnouncement,
            canEdit: isOwner,
            onDataChange: onDataChange,
            onSendMessage: onSendMessage,
        })
    }

    protected _noSetting() {
        const {imId} = this.props;
        const groupOwner = Delegate.model.Group.getOwner(imId);
        if (groupOwner) {
            const name = Delegate.user.getUser(groupOwner).name;
            if (name && name.length > 0) {
                Alert.alert('', '只有群主' + name +'才能修改群公告', [
                    {
                        text: '我知道了',
                        onPress: () => {},
                    },
                ]);
            }
        }
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
    subTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
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
        marginHorizontal: 12,
    },
    contentText: {
        fontSize: 14,
        color: '#aaaaaa',
    },
});
