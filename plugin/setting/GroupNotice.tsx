import React from 'react';
import { View } from 'react-native';
import i18n from 'i18n-js';
import { Typings, Delegate } from '../../standard';

export const name = 'IMSettingGroupNotice';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType, onDataChange} = props;
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
        const {groupNotice, isOwner} = this.props;
        const showNoticePageFunc = !isOwner ? undefined : this._clickNotice.bind(this, groupNotice);
        let title = i18n.t('IMSettingGroupNotice')
        return (
            <View>
                <Delegate.component.SettingItem
                    type={Typings.Component.SettingItemType.Text}
                    title={title}
                    data={groupNotice}
                    onPressLine={showNoticePageFunc}
                />
            </View>
        );
    }

    protected _clickNotice(newNotice: string) {
        if (!newNotice) {
            newNotice = ''
        }
        const {imId, onDataChange} = this.props;

    }
}
