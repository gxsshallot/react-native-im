import * as IMStandard from '../../src';
import * as LeaveGroup from './LeaveGroup';
import * as TransferOwner from './TransferOwner';
import getGeneralButton from './GeneralButton';

export function setup() {
    const actions = [
        [LeaveGroup.name, LeaveGroup.getUi],
        [TransferOwner.name, TransferOwner.getUi],
    ];
    actions.forEach(function ([name, getUi]) {
        IMStandard.Delegate.model.Setting.register(name, getUi);
    });
};

export {
    LeaveGroup,
    TransferOwner,
    getGeneralButton,
};