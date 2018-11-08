export default {
    page: {},
    component: {},
    contact: {
        loadAllUser: unset('contact.loadAllUser'),
        loadAllOrg: unset('contact.loadAllOrg'),
    },
    user: {
        getMine: unset('user.getMine'),
        getUser: unset('user.getUser'),
    },
    style: {
        viewBackgroundColor: 'white',
        seperatorLineColor: 'gray',
    },
    config: {
        pinyinField: 'pinyin',
        titleLoading: '加载中',
        buttonOK: '确定',
    },
};

function unset(message) {
    return () => {
        throw new Error('Please set the interface delegate.' + message);
    };
}