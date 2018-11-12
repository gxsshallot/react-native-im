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