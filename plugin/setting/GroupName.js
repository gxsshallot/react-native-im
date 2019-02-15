import React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import * as IMStandard from '../../src';
import Prompt from './Prompt';

export const name = 'IMSettingGroupName';

export function getUi(props) {
    const {key, imId, chatType, onDataChange} = props;
    const isGroup = chatType === IMStandard.Constant.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupName = IMStandard.Delegate.model.Group.getName(imId, false);
    const groupOwner = IMStandard.Delegate.model.Group.getOwner(imId);
    const isOwner = isGroup && groupOwner === IMStandard.Delegate.user.getMine().userId;
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

export class GroupNameCell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPrompt: false,
        };
    }

    render() {
        const {groupName, isOwner} = this.props;
        const showNameLineFunc = !isOwner ? undefined : this._changePromptStatus.bind(this, true);
        return (
            <View>
                <IMStandard.Delegate.component.SettingItem
                    type={IMStandard.Constant.SettingItemType.Text}
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
    
    _changePromptStatus(status) {
        this.setState({showPrompt: status});
    }

    _clickName(newName) {
        this._changePromptStatus(false);
        if (!newName || newName.length === 0) {
            Toast.show(i18n.t('IMSettingGroupNameNotEmpty'));
            return;
        }
        const {imId, onDataChange} = this.props;
        IMStandard.Delegate.model.Group.changeName(imId, newName)
            .then(() => {
                onDataChange && onDataChange();
            })
            .catch(() => {
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMSettingGroupNameChange'),
                }));
            });
    }
}