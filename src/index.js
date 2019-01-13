import AsyncStorage from 'react-native-general-storage';
import * as Constant from './constant';
import * as Model from './model';
import * as Types from './proptype';
import * as Components from './component';
import * as Pages from './page';
import * as PageKeys from './pagekey';
import * as Utils from './util';
import Delegate from './delegate';
import Option from './option';

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
    Delegate.page[PageKeys.Search] = Pages.SearchPage;
    Delegate.page[PageKeys.SearchMore] = Components.SearchList;
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
    Delegate.component.Popover = Components.Popover;
    Delegate.component.Prompt = Components.Prompt;
    Delegate.component.SearchList = Components.SearchList;
    Delegate.component.SectionHeader = Components.SectionHeader;
    Delegate.component.SeekBarSectionList = Components.SeekBarSectionList;
    Delegate.component.SegmentControl = Components.SegmentControl;
    Delegate.component.SelectList = Components.SelectList;
    Delegate.component.SettingItem = Components.SettingItem;
}

function setup_common_model() {
    AsyncStorage.setPrefix(Constant.StoragePart, Constant.StoragePart);
    Delegate.model.Action = Model.Action;
    Delegate.model.Conversation = Model.Conversation;
    Delegate.model.Emoji = Model.Emoji;
    Delegate.model.External = Model.External;
    Delegate.model.Group = Model.Group;
    Delegate.model.Message = Model.Message;
}

function login(forceUpdate) {
    return Promise.all([
        Delegate.model.Conversation.init(forceUpdate),
        Delegate.model.Group.init(forceUpdate)
    ]);
}

function logout(forceClear) {
    return Promise.all([
        Delegate.model.Conversation.uninit(forceClear),
        Delegate.model.Group.uninit(forceClear)
    ]);
}

export {
    Constant,
    Model,
    Types,
    Components,
    Pages,
    PageKeys,
    Utils,
    Delegate,
    Option,
    setup_common_page,
    setup_common_component,
    setup_common_model,
    login,
    logout,
};