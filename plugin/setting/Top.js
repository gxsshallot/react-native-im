import React from 'react';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import * as IMStandard from '../../src';

export const name = 'IMSettingTop';

export function getUi(props) {
    const {key, imId} = props;
    return (
        <TopCell
            key={key}
            imId={imId}
        />
    );
}

export class TopCell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = this._state();
    }

    render() {
        return (
            <IMStandard.Delegate.component.SettingItem
                type={IMStandard.Constant.SettingItemType.Switch}
                title={i18n.t('IMSettingTop')}
                data={this.state.top}
                onPressSwitch={this._clickConfig.bind(this)}
            />
        );
    }

    _state() {
        const {imId} = this.props;
        const {top} = IMStandard.Delegate.model.Conversation.getConfig(imId);
        return {top};
    }

    _clickConfig(top) {
        const {imId} = this.props;
        this.setState({top});
        IMStandard.Delegate.model.Conversation.updateConfig(imId, {top})
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