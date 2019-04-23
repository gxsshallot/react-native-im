import React from 'react';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { Typings, Delegate } from '../../standard';

export const name = 'IMSettingAllowInvite';

export function getUi(props: Typings.Action.Setting.Params): Typings.Action.Setting.Result {
    const {key, imId, chatType} = props;
    const isGroup = chatType === Typings.Conversation.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupOwner = Delegate.model.Group.getOwner(imId);
    const isOwner = groupOwner === Delegate.user.getMine().userId;
    if (!isOwner) {
        return null;
    }
    return (
        <AllowInviteCell
            key={key}
            imId={imId}
        />
    );
}

export interface Props {
    imId: string;
}

export interface State {
    allowInvites: boolean;
}

export class AllowInviteCell extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = this._state();
    }

    render() {
        return (
            <Delegate.component.SettingItem
                type={Typings.Component.SettingItemType.Switch}
                title={i18n.t('IMSettingAllowInvite')}
                data={this.state.allowInvites}
                onPressSwitch={this._clickConfig.bind(this)}
            />
        );
    }

    protected _state() {
        const {imId} = this.props;
        const allowInvites = Delegate.model.Group.getAllowInvites(imId);
        return {allowInvites};
    }

    protected _clickConfig(allowInvites: boolean) {
        const {imId} = this.props;
        this.setState({allowInvites});
        Delegate.model.Group.changeAllowInvites(imId, allowInvites)
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