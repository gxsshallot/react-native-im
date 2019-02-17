import * as React from 'react';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import * as IMStandard from '../../src';

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
                data={this.state.allowInvites}
                onPressSwitch={this._clickConfig.bind(this)}
            />
        );
    }

    _state() {
        const {imId} = this.props;
        const allowInvites = IMStandard.Delegate.model.Group.getAllowInvites(imId);
        return {allowInvites};
    }

    _clickConfig(allowInvites) {
        const {imId} = this.props;
        this.setState({allowInvites});
        IMStandard.Delegate.model.Group.changeAllowInvites(imId, allowInvites)
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