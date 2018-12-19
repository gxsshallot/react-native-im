import * as EMSDK from 'react-native-im-easemob';
import * as IMStandard from '../../src';
import * as EMUtil from './util';
import setup_parse_action from './ParseAction';
import setup_display_action from './DisplayAction';
import setup_abstract_action from './AbstractAction';
import setup_moreboard_action from './MoreBoardAction';
import setup_send_action from './SendAction';
import setup_im_conversation_delegate from './IMConversationDelegate';
import setup_im_group_delegate from './IMGroupDelegate';

export function setup() {
    setup_parse_action();
    setup_display_action();
    setup_abstract_action();
    setup_moreboard_action();
    setup_send_action();
    setup_im_conversation_delegate();
    setup_im_group_delegate();
    // 代理设置
    IMStandard.Delegate.config.messageType.text = EMSDK.IMConstant.MessageType.text;
    IMStandard.Delegate.config.messageType.voice = EMSDK.IMConstant.MessageType.voice;
    IMStandard.Delegate.config.messageType.system = EMSDK.IMConstant.MessageType.command;
}

export {
    EMSDK,
    EMUtil,
};