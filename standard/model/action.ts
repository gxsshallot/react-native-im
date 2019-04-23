import * as Specials from 'specials';
import { Action } from '../typings';

export const Display = Specials.getInstance<
    Action.Display.State,
    Action.Display.Params,
    Action.Display.Result
>();

export const Parse = Specials.getInstance<
    Action.Parse.State,
    Action.Parse.Params,
    Action.Parse.Result
>();

export const Send = Specials.getInstance<
    Action.Send.State,
    Action.Send.Params,
    Action.Send.Result
>();

export const Abstract = Specials.getInstance<
    Action.Abstract.State,
    Action.Abstract.Params,
    Action.Abstract.Result
>();

export const MoreBoard = Specials.getInstance<
    Action.MoreBoard.State,
    Action.MoreBoard.Params,
    Action.MoreBoard.Result
>();