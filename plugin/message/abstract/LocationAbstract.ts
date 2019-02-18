import { Typings, Delegate } from '../../../src';

export type Params = Typings.Action.AbstractHandleParams<Typings.Message.Location>;

export type Result = Typings.Action.AbstractHandleResult;

export default function (params: Params): Result {
    const myUserId = Delegate.user.getMine().userId;
    const { message } = params;
    const isSend = message.from === myUserId;
    if (isSend) {
        return '[我的位置]';
    } else {
        const user = Delegate.user.getUser(message.from);
        return '[' + user.name + '的位置]';
    }
}