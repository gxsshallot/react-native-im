import React from 'react';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import * as IMStandard from '../../src';

export const name = 'IMSettingAvoid';

export function getUi(props) {
    const {key, imId} = props;
    return (
        <AvoidCell
            key={key}
            imId={imId}
        />
    );
}

export class AvoidCell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = this._state();
    }

    render() {
        return (
            <IMStandard.Delegate.component.SettingItem
                type={IMStandard.Constant.SettingItemType.Switch}
                title={i18n.t('IMSettingAvoid')}
                data={this.state.avoid}
                onPressSwitch={this._clickConfig.bind(this)}
            />
        );
    }

    _state() {
        const {imId} = this.props;
        const {avoid} = IMStandard.Delegate.model.Conversation.getConfig(imId);
        return {avoid};
    }

    _clickConfig(avoid) {
        const {imId} = this.props;
        this.setState({avoid});
        IMStandard.Delegate.model.Conversation.updateConfig(imId, {avoid})
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