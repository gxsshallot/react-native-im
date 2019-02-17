import { Contact } from '../typings';

const reg = /[A-Z]/i;

export default function (
    users: Contact.User[],
    firstLetterKey: string,
    sortKey: string = 'name'
) {
    const data = users
        .sort(sort(sortKey))
        .reduce((pre: any, cur: Contact.User) => {
            const letterField = cur[firstLetterKey] || '#';
            const firstField = letterField.substring(0, 1).toUpperCase();
            const firstLetter = reg.test(firstField) ? firstField : '#';
            if (!pre[firstLetter]) {
                pre[firstLetter] = [cur];
            } else {
                pre[firstLetter].push(cur);
            }
            return pre;
        }, {});
    // title用于展示ListSectionHeader，key用于展示右侧索引
    return Object.keys(data)
        .map(key => ({key, title: key, data: data[key]}))
        .sort(sort('title'));
}

function sort(key: string) {
    return function (a: any, b: any) {
        if (a[key] === b[key]) {
            return 0;
        } else {
            return a[key] > b[key] ? 1 : -1;
        }
    };
}