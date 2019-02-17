import * as React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { Typings, Delegate } from '../../src';
import Prompt from './Prompt';
import { UiParams, UiResult } from './typings';

export const name = 'IMSettingGroupName';

export function getUi(props: UiParams): UiResult {
    const {key, imId, chatType, onDataChange} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupName = Delegate.model.Group.getName(imId, false);
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    return (
        <GroupNameCell
            key={key}
            isOwner={isOwner}
            groupName={groupName}
            imId={imId}
            onDataChange={onDataChange}
        />
    );
}

export interface Props {
    isOwner: boolean;
    groupName: string | void;
    imId: string;
    onDataChange: () => void;
}

export interface State {
    showPrompt: boolean;
}

export class GroupNameCell extends React.PureComponent<Props, State> {
    state: State = {
        showPrompt: false,
    };

    render() {
        const {groupName, isOwner} = this.props;
        const showNameLineFunc = !isOwner ? undefined : this._changePromptStatus.bind(this, true);
        return (
            <View>
                <Delegate.component.SettingItem
                    type={Typings.Component.SettingItemType.Text}
                    title={i18n.t('IMSettingGroupName')}
                    data={groupName}
                    onPressLine={showNameLineFunc}
                />
                <Prompt
                    visible={this.state.showPrompt}
                    title={i18n.t('IMSettingGroupNameChangeTips')}
                    onCancel={this._changePromptStatus.bind(this, false)}
                    onSubmit={this._clickName.bind(this)}
                    textInputProps={{secureTextEntry: false}}
                />
            </View>
        );
    }
    
    protected _changePromptStatus(status: boolean) {
        this.setState({showPrompt: status});
    }

    protected _clickName(newName: string) {
        this._changePromptStatus(false);
        if (!newName || newName.length === 0) {
            Toast.show(i18n.t('IMSettingGroupNameNotEmpty'));
            return;
        }
        const {imId, onDataChange} = this.props;
        Delegate.model.Group.changeName(imId, newName)
            .then(() => {
                onDataChange();
            })
            .catch(() => {
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMSettingGroupNameChange'),
                }));
            });
    }
}