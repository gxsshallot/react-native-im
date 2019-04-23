import { Typings, Delegate } from '../../../standard';

export type Params = Typings.Action.Abstract.Params<Typings.Message.LocationBody>;

export type Result = Typings.Action.Abstract.Result;

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