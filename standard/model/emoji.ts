import { deepExport } from '../util';

const rootNode = [];
const dataKey = '__inner_emojis__';

export function addPart(key, params) {
    const index = rootNode.findIndex(item => item.key === key);
    if (index < 0) {
        rootNode.push({key, ...params, [dataKey]: []});
    } else {
        rootNode[index] = {...rootNode[index], ...params};
    }
}

export function deletePart(key) {
    const index = rootNode.findIndex(item => item.key === key);
    if (index >= 0) {
        rootNode.splice(index, 1);
    }
}

export function addEmoji(key, text, image) {
    const index = rootNode.findIndex(item => item.key === key);
    if (index < 0) {
        throw new Error('You need addPart first');
    }
    const itemIndex = rootNode[index][dataKey].findIndex(item => item.text === text);
    if (itemIndex < 0) {
        rootNode[index][dataKey].push({text, image});
    } else {
        rootNode[index][dataKey][itemIndex].image = image;
    }
}

export function deleteEmoji(key, text) {
    const index = rootNode.findIndex(item => item.key === key);
    if (index < 0) {
        throw new Error('You must pass a valid key');
    }
    if (!text) {
        throw new Error('You must pass a valid text');
    }
    rootNode[index][dataKey] = rootNode[index][dataKey]
        .filter(item => item.text !== text);
}

export function getAllParts() {
    return rootNode.map(item => ({...item, [dataKey]: null}));
}

export function getPartEmojis(key) {
    const index = rootNode.findIndex(item => item.key === key);
    return index >= 0 ? deepExport(rootNode[index][dataKey]) : null;
}

export function getEmoji(text: string, key?: string) {
    let parts = null;
    if (key) {
        const index = rootNode.findIndex(item => item.key === key);
        if (index < 0) {
            return null;
        }
        parts = [rootNode[index]];
    } else {
        parts = rootNode;
    }
    const items = parts.reduce((prv, cur) => {
        cur[dataKey].forEach(item => prv.push(item));
        return prv;
    }, []);
    const itemIndex = items.findIndex(item => item.text === text);
    return itemIndex < 0 ? null : items[itemIndex].image;
}