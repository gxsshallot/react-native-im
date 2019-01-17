import React from 'react';
import Toast from 'react-native-root-toast';
import * as IMStandard from '../../src';
import i18n from '../../language';

export const name = 'IMSettingAllowInvite';

export function getUi(props) {
    const {key, imId, chatType} = props;
    const isGroup = chatType === IMStandard.Constant.ChatType.Group;
    if (!isGroup) {
        return null;
    }
    const groupOwner = IMStandard.Delegate.model.Group.getOwner(imId);
    const isOwner = isGroup && groupOwner === IMStandard.Delegate.user.getMine().userId;
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

export class AllowInviteCell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = this._state();
    }

    render() {
        return (
            <IMStandard.Delegate.component.SettingItem
                type={IMStandard.Constant.SettingItemType.Switch}
                title={i18n.t('IMSettingAllowInvite')}
                data={this.state.allowInvite}
                onPressSwitch={this._clickConfig.bind(this)}
            />
        );
    }

    _state() {
        const {imId} = this.props;
        const allowInvite = IMStandard.Delegate.model.Group.getAllowAdd(imId);
        return {allowInvite};
    }

    _clickConfig(allowInvite) {
        const {imId} = this.props;
        this.setState({allowInvite});
        IMStandard.Delegate.model.Group.changeAllowInvite(imId, allowInvite)
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