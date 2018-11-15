import * as Constant from './constant';
import * as Model from './model';
import * as Types from './proptype';
import * as Components from './component';
import * as Pages from './page';
import * as PageKeys from './pagekey';
import * as Utils from './util';
import Delegate from './delegate';

function setup_common_page() {
    Delegate.page[PageKeys.ChooseUser] = Pages.ChooseUserPage;
    Delegate.page[PageKeys.ChooseUserFromOrg] = Pages.ChooseUserFromOrgPage;
}

function setup_common_component() {
    Delegate.component.ArrowImage = Components.ArrowImage;
    Delegate.component.AvatarImage = Components.AvatarImage;
    Delegate.component.AvatarList = Components.AvatarList;
    Delegate.component.BaseMessage = Components.BaseMessage;
    Delegate.component.FakeSearchBar = Components.FakeSearchBar;
    Delegate.component.ListCell = Components.ListCell;
    Delegate.component.MessageBubble = Components.MessageBubble;
    Delegate.component.SectionHeader = Components.SectionHeader;
    Delegate.component.SettingItem = Components.SettingItem;
    Delegate.component.TimeCell = Components.TimeCell;
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
    setup_common_page,
    setup_common_component,
};