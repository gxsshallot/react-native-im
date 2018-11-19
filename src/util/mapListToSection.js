const reg = /[A-Z]/i;

export default function (users, firstLetterKey, sortKey = 'name') {
    const data = users
        .sort(sort.bind(this, sortKey))
        .reduce((pre, cur) => {
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
    return Object.keys(data)
        .map(key => ({key, title: key, data: data[key]}))
        .sort(sort.bind(this, 'title'));
}

const sort = (key, a, b) => {
    if (a[key] === b[key]) {
        return 0;
    } else {
        return a[key] > b[key] ? 1 : -1;
    }
};