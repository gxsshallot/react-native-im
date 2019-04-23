import * as Specials from 'specials';
import { Action } from '../typings';

const instance = Specials.getInstance<
    Action.Setting.State,
    Action.Setting.Params,
    Action.Setting.Result
>();

export default instance;