import AsyncStorage from '@hecom/storage';
import * as Typings from './typings';
import * as Model from './model';
import * as Components from './component';
import * as Pages from './page';
import * as PageKeys from './pagekey';
import * as Utils from './util';
import * as Render from './render';
import Delegate from './delegate';

function setup_common_page() {
    Delegate.page[PageKeys.ChatDetail] = Pages.ChatDetailPage;
    Delegate.page[PageKeys.ChatList] = Pages.ChatListPage;
    Delegate.page[PageKeys.ChatSetting] = Pages.ChatSettingPage;
    Delegate.page[PageKeys.ChooseConversation] = Pages.ChooseConversationPage;
    Delegate.page[PageKeys.ChooseUser] = Pages.ChooseUserPage;
    Delegate.page[PageKeys.ChooseUserFromOrg] = Pages.ChooseUserFromOrgPage;
    Delegate.page[PageKeys.ContactList] = Pages.ContactListPage;
    Delegate.page[PageKeys.GroupList] = Pages.GroupListPage;
    Delegate.page[PageKeys.GroupMembers] = Pages.GroupMembersPage;
    Delegate.page[PageKeys.GroupAnnouncementEdit] = Pages.GroupAnnouncementEditPage;
    Delegate.page[PageKeys.Search] = Pages.SearchPage;
    Delegate.page[PageKeys.SearchMore] = Components.SearchList;
    Delegate.page[PageKeys.GroupNameEdit] = Pages.GroupNameEdit;
}

function setup_common_render() {
    Delegate.render.renderBadge = Render.renderBadge;
}

function setup_common_component() {
    Delegate.component.AvatarImage = Components.AvatarImage;
    Delegate.component.AvatarList = Components.AvatarList;
    Delegate.component.BaseMessage = Components.BaseMessage;
    Delegate.component.BottomBar = Components.BottomBar;
    Delegate.component.ConversationCell = Components.ConversationCell;
    Delegate.component.DetailListView = Components.DetailListView;
    Delegate.component.EmojiPickView = Components.EmojiPickView;
    Delegate.component.FakeSearchBar = Components.FakeSearchBar;
    Delegate.component.ListCell = Components.ListCell;
    Delegate.component.MessageBubble = Components.MessageBubble;
    Delegate.component.MessageMenu = Components.MessageMenu;
    Delegate.component.MoreBoard = Components.MoreBoard;
    Delegate.component.SearchList = Components.SearchList;
    Delegate.component.SectionHeader = Components.SectionHeader;
    Delegate.component.SeekBarSectionList = Components.SeekBarSectionList;
    Delegate.component.SegmentControl = Components.SegmentControl;
    Delegate.component.SelectList = Components.SelectList;
    Delegate.component.SettingItem = Components.SettingItem;
    Delegate.component.HeaderCell = Components.HeaderCell;
    Delegate.component.FixedSectionList = Components.FixedSectionList;
}

function setup_common_model() {
    AsyncStorage.setPrefix(Typings.Storage.Part, Typings.Storage.Part);
    Delegate.model.Conversation = Model.Conversation;
    Delegate.model.Emoji = Model.Emoji;
    Delegate.model.External = Model.External;
    Delegate.model.Group = Model.Group;
    Delegate.model.Message = Model.Message;
    Delegate.model.Setting = Model.Setting;
}

function login(forceUpdate: boolean) {
    return Promise.all([
        Delegate.model.Conversation.init(forceUpdate),
        Delegate.model.Group.init(forceUpdate)
    ]);
}

function logout(forceClear: boolean) {
    return Promise.all([
        Delegate.model.Conversation.uninit(forceClear),
        Delegate.model.Group.uninit(forceClear)
    ]);
}

export {
    Model,
    Typings,
    Components,
    Pages,
    PageKeys,
    Utils,
    Delegate,
    setup_common_page,
    setup_common_component,
    setup_common_model,
    setup_common_render,
    login,
    logout,
};
