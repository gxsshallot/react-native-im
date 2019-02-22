import * as Specials from 'specials';
import { Action } from '../typings';

const rootNode: Specials.RootType = {};

export const Display = getActions<
    Action.DisplayState,
    Action.DisplayHandleParams,
    Action.DisplayHandleResult
>('display');

export const Parse = getActions<
    Action.ParseState,
    Action.ParseHandleParams,
    Action.ParseHandleResult
>('parse');

export const Send = getActions<
    Action.SendState,
    Action.SendHandleParams,
    Action.SendHandleResult
>('send');

export const Abstract = getActions<
    Action.AbstractState,
    Action.AbstractHandleParams,
    Action.AbstractHandleResult
>('abstract');

export const MoreBoard = getActions<
    Action.MoreBoardState,
    void,
    Action.MoreBoardHandleResult
>('moreboard');

function getActions<S, P, R>(action: string) {
    return {
        register: function (
            messageType?: number | string,
            specialFunc?: (state: S) => boolean,
            handleFunc?: R | ((params: P) => R),
            priority?: number
        ): string | void {
            return Specials.register(rootNode, [action, messageType], specialFunc, handleFunc, priority);
        },
        unregister: function (
            messageType?: number | string,
            handleId?: string
        ): boolean {
            return Specials.unregister(rootNode, [action, messageType], handleId);
        },
        match: function (
            messageType?: number | string,
            state?: S,
            params?: P
        ): R {
            return Specials.get(rootNode, [action, messageType], state, params);
        },
    };
}