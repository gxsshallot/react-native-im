import * as Specials from 'specials';

const rootNode = {};

/**
 * 注册一个处理函数，当特殊状态函数成立时，进行调用。
 * @param {string} action 在constant/action.js中定义的操作类型。
 * @param {number} messageType 你可以自定义的消息类型。
 * @param {function} specialFunc 特殊状态函数，(state) => boolean，其中state是待判断的IM消息体。
 * @param {function} handleFunc 处理函数，(params) => any，其中params是处理的参数，包括IM消息体和其他设置，请看具体场景的match方法。
 * @param {number} priority 优先级，默认为0。
 * @returns {string} 注册的句柄，用于取消注册。
 */
export function register(action, messageType, specialFunc, handleFunc, priority) {
    return Specials.register(rootNode, [action, messageType], specialFunc, handleFunc, priority);
}

/**
 * 取消注册一个处理函数。
 * @param {string} action 在constant/action.js中定义的操作类型。
 * @param {number} messageType 你可以自定义的消息类型。
 * @param {string} handleId 注册的句柄。
 * @returns {boolean} 取消成功或失败。
 */
export function unregister(action, messageType, handleId) {
    return Specials.unregister(rootNode, [action, messageType], handleId);
}

/**
 * 对一个场景进行匹配，根据state判断条件是否成立，成立则调用相应的handle函数对params进行处理，返回处理结果。
 * @param {string} action 在constant/action.js中定义的操作类型。
 * @param {number} messageType 你可以自定义的消息类型。
 * @param {object} state 待判断的IM消息体。
 * @param {object} params 处理的调用参数，包括IM消息体和其他设置。
 * @returns {any} 调用处理函数的结果。
 */
export function match(action, messageType, state, params) {
    return Specials.get(rootNode, [action, messageType], state, params);
}