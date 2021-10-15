import React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { Typings, Delegate } from '../../standard';

export const name = 'IMSettingGroupDataInfo';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupName = Delegate.model.Group.getName(imId, false);
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    return (
        <GroupDataInfoCell
            key={key}
            isOwner={isOwner}
            groupName={groupName}
            imId={imId}
        />
    );
}

export interface Props {
    isOwner: boolean;
    groupName: string | void;
    imId: string;
}

export interface State {
}

export class GroupDataInfoCell extends React.PureComponent<Props,State> {
    state: State = {
    };

    render() {
        return (
            <View>
                <Delegate.component.SettingItem
                    type={Typings.Component.SettingItemType.Text}
                    title={i18n.t('IMSettingGroupDataInfo')}
                    data={""}
                    onPressLine={this._clickLine.bind(this)}
                />
            </View>
        );
    }
    
    protected _clickLine() {
        const {imId} = this.props;
        Delegate.model.Group.showGroupDataRecord(imId)
            .catch(() => {
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMSettingGroupDataInfo'),
                }));
            });
    }
}