import { Delegate, Model, Typings, PageKeys } from '../../standard';
import * as AllMembers from './AllMembers';
import * as AllowInvite from './AllowInvite';
import * as AvatarList from './AvatarList';
import * as Avoid from './Avoid';
import * as GroupAvatar from './GroupAvatar';
import * as GroupMemberName from './GroupMemberName';
import * as GroupName from './GroupName';
import * as GroupAnnouncement from './GroupAnnouncement';
import * as GroupData from './GroupData';
import * as LeaveGroup from './LeaveGroup';
import * as Top from './Top';
import * as TransferOwner from './TransferOwner';
import getGeneralButton from './GeneralButton';
import Prompt from './Prompt';

export function setup() {
    type ActionItem = [
        string,
        (props: Typings.Action.Setting.Params) => Typings.Action.Setting.Result
    ];
    const actions: ActionItem[] = [
        [AllowInvite.name, AllowInvite.getUi],
        [AvatarList.name, AvatarList.getUi],
        [Avoid.name, Avoid.getUi],
        [GroupData.name,GroupData.getUi],
        [GroupAvatar.name, GroupAvatar.getUi],
        [GroupMemberName.name, GroupMemberName.getUi],
        [GroupName.name, GroupName.getUi],
        [LeaveGroup.name, LeaveGroup.getUi],
        [Top.name, Top.getUi],
        [TransferOwner.name, TransferOwner.getUi],
        [GroupAnnouncement.name, GroupAnnouncement.getUi],
    ];
    actions.forEach(function ([name, getUi]) {
        Model.Setting.registerDefault(name, getUi);
    });
    Delegate.page[PageKeys.ChatSetting].defaultProps.sections = [
        [AvatarList.name],
        [GroupData.name],
        [GroupName.name, GroupAvatar.name, GroupAnnouncement.name, AllowInvite.name, Top.name, Avoid.name, GroupMemberName.name]
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
    GroupData,
    GroupAvatar,
    GroupName,
    GroupAnnouncement,
    LeaveGroup,
    Top,
    TransferOwner,
    getGeneralButton,
    Prompt,
};
