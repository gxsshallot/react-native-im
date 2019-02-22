import { Typings, Delegate } from '../../../standard';

export type Params = Typings.Action.AbstractHandleParams<Typings.Message.TextBody>;

export type Result = Typings.Action.AbstractHandleResult;

export default function (params: Params): Result {
    const {chatType, message} = params;
    let prefix = '';
    if (chatType === Typings.Conversation.ChatType.Group) {
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
}