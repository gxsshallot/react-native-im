import * as Specials from 'specials';

const rootNode = {};

export function register(action, messageType, specialFunc, handleFunc, priority) {
    return Specials.register(rootNode, [action, messageType], specialFunc, handleFunc, priority);
}

export function unregister(action, messageType, handleId) {
    return Specials.unregister(rootNode, [action, messageType], handleId);
}

export function match(action, messageType, state, params) {
    return Specials.get(rootNode, [action, messageType], state, params);
}