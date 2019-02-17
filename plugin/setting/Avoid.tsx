import * as React from 'react';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { Typings, Delegate } from '../../src';
import { UiParams, UiResult } from './typings';

export const name = 'IMSettingAvoid';

export function getUi(props: UiParams): UiResult {
    const {key, imId} = props;
    return (
        <AvoidCell
            key={key}
            imId={imId}
        />
    );
}

export interface Props {
    imId: string;
}

export interface State {
    avoid: boolean;
}

export class AvoidCell extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = this._state();
    }

    render() {
        return (
            <Delegate.component.SettingItem
                type={Typings.Component.SettingItemType.Switch}
                title={i18n.t('IMSettingAvoid')}
                data={this.state.avoid}
                onPressSwitch={this._clickConfig.bind(this)}
            />
        );
    }

    protected _state() {
        const {imId} = this.props;
        const {avoid} = Delegate.model.Conversation.getConfig(imId);
        return {avoid};
    }

    protected _clickConfig(avoid: boolean) {
        const {imId} = this.props;
        this.setState({avoid});
        Delegate.model.Conversation.updateConfig(imId, {avoid})
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