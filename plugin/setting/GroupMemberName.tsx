import React from 'react';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { Typings, Delegate } from '../../standard';

export const name = 'IMSettingGroupMemberName';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    return (
        <GroupMemberNameCell
            key={key}
            imId={imId}
            chatType={chatType}
        />
    );
}

export interface Props {
    imId: string;
    chatType: Typings.Conversation.ChatType;
}

export interface State {
    showMembersName: boolean;
}

export class GroupMemberNameCell extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = this._state();
    }

    render() {
        return (
            <Delegate.component.SettingItem
                type={Typings.Component.SettingItemType.Switch}
                title={i18n.t('IMSettingGroupMemberName')}
                data={this.state.showMembersName}
                onPressSwitch={this._clickConfig.bind(this)}
            />
        );
    }

    protected _state() {
        const {imId} = this.props;
        const {showMembersName} = Delegate.model.Conversation.getConfig(imId);
        return {showMembersName};
    }

    protected _clickConfig(showMembersName: boolean) {
        const {imId, chatType} = this.props;
        this.setState({showMembersName});
        Delegate.model.Conversation.updateConfig(imId, chatType, {showMembersName})
            .catch(() => {
                Toast.show(i18n.t('IMToastError', {
                    action: i18n.t('IMSettingConfigChange'),
                }));
            })
            .finally(() => {
                this.setState(this._state());
            });
    }
}