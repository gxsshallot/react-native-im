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
            addOne: unset('im.conversation.addOne'),
            deleteOne: unset('im.conversation.deleteOne'),
            updateConfig: unset('im.conversation.updateConfig'),
            markAllRead: unset('im.conversation.markAllRead'),
            markLatestUnread: unset('im.conversation.markLatestUnread'),
            loadMessage: unset('im.conversation.loadMessage'),
            deleteMessage: unset('im.conversation.deleteMessage'),
            recallMessage: unset('im.conversation.recallMessage'),
        },
        group: {
            loadList: unset('im.group.loadList'),
            loadItem: unset('im.group.loadItem'),
            createOne: unset('im.group.createOne'),
            destroyOne: unset('im.group.destroyOne'),
            quitOne: unset('im.group.quitOne'),
            addMembers: unset('im.group.addMembers'),
            removeMembers: unset('im.group.removeMembers'),
            changeName: unset('im.group.changeName'),
            changeAvatar: unset('im.group.changeAvatar'),
            changeOwner: unset('im.group.changeOwner'),
        },
    },
    func: {
        pushToLocationViewPage: unset('func.pushToLocationViewPage'),
        pushToLocationChoosePage: unset('func.pushToLocationChoosePage'),
        pushToUserDetailPage: unset('func.pushToUserDetailPage'),
        fitUrlForAvatarSize: unset('func.fitUrlForAvatarSize'),
        getDefaultUserHeadImage: unset('func.getDefaultUserHeadImage'),
        uploadImages: unset('func.uploadImages'),
    },
    style: {
        viewBackgroundColor: 'white',
        separatorLineColor: 'gray',
    },
    config: {
        pinyinField: 'pinyin',
        titleLoading: '加载中',
        buttonOK: '确定',
        messageType: {
            text: null,
            voice: null,
            system: null,
        },
    },
    option: {
    },
};

function unset(message) {
    return () => {
        throw new Error('Please set the interface delegate.' + message);
    };
}