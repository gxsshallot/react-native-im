import * as Specials from 'specials';

const rootNode = {};

export function register(action, handleFunc) {
    return Specials.register(rootNode, [action], undefined, handleFunc);
}

export function unregister(action) {
    return Specials.unregister(rootNode, [action]);
}

export function match(action, params) {
    return Specials.get(rootNode, [action], undefined, params);
}