import { Constant, Delegate } from '../../../src';

export default (params) => {
    const {chatType, message} = params;
    let prefix = '';
    if (chatType === Constant.ChatType.Group) {
        const myUserId = Delegate.user.getMine().userId;
        if (message.from !== myUserId) {
            const user = Delegate.user.getUser(message.from);
            prefix = user.name + ': ';
        }
    }
    if (message.data.text) {
        return prefix + message.data.text;
    } else {
        return prefix;
    }
};