import { Delegate, PageKeys } from '../../src';
import * as AllMembers from './AllMembers';
import * as AllowInvite from './AllowInvite';
import * as AvatarList from './AvatarList';
import * as Avoid from './Avoid';
import * as GroupAvatar from './GroupAvatar';
import * as GroupName from './GroupName';
import * as LeaveGroup from './LeaveGroup';
import * as Top from './Top';
import * as TransferOwner from './TransferOwner';
import getGeneralButton from './GeneralButton';
import Prompt from './Prompt';

export function setup() {
    const actions = [
        [AllMembers.name, AllMembers.getUi],
        [AllowInvite.name, AllowInvite.getUi],
        [AvatarList.name, AvatarList.getUi],
        [Avoid.name, Avoid.getUi],
        [GroupAvatar.name, GroupAvatar.getUi],
        [GroupName.name, GroupName.getUi],
        [LeaveGroup.name, LeaveGroup.getUi],
        [Top.name, Top.getUi],
        [TransferOwner.name, TransferOwner.getUi],
    ];
    actions.forEach(function ([name, getUi]) {
        Delegate.model.Setting.register(name, getUi);
    });
    Delegate.page[PageKeys.ChatSetting].defaultProps.sections = [
        [AvatarList.name, AllMembers.name],
        [GroupName.name, GroupAvatar.name, AllowInvite.name, Top.name, Avoid.name]
    ];
    Delegate.page[PageKeys.ChatSetting].defaultProps.buttons = [
        LeaveGroup.name,
        TransferOwner.name,
    ];
}

export {
    AllMembers,
    AllowInvite,
    AvatarList,
    Avoid,
    GroupAvatar,
    GroupName,
    LeaveGroup,
    Top,
    TransferOwner,
    getGeneralButton,
    Prompt,
};