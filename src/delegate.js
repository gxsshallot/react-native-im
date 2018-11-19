export default {
    page: {},
    component: {},
    model: {},
    contact: {
        loadAllUser: unset('contact.loadAllUser'),
        loadAllOrg: unset('contact.loadAllOrg'),
    },
    user: {
        getMine: unset('user.getMine'),
        getUser: unset('user.getUser'),
    },
    im: {
        conversation: {
            loadList: unset('im.conversation.loadList'),
            loadItem: unset('im.conversation.loadItem'),
            addToList: unset('im.conversation.addToList'),
            removeFromList: unset('im.conversation.removeFromList'),
            deleteOne: unset('im.conversation.deleteOne'),
            updateConfig: unset('im.conversation.updateConfig'),
        },
        group: {
            loadList: unset('im.group.loadList'),
            loadItem: unset('im.group.loadItem'),
            createOne: unset('im.group.createOne'),
            destroyOne: unset('im.group.destroyOne'),
            quitOne: unset('im.group.quitOne'),
        },
    },
    func: {
        pushToLocationViewPage: unset('func.pushToLocationViewPage'),
        pushToUserDetailPage: unset('func.pushToUserDetailPage'),
        fitUrlForAvatarSize: unset('util.fitUrlForAvatarSize'),
        getDefaultUserHeadImage: unset('util.getDefaultUserHeadImage'),
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