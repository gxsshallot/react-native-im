# 聊天设置页面

位于`src/page/ChatSetting.js`。

这是聊天设置页面，单聊和群聊都使用这个页面，有些模块只有在群聊状态下可见，内部更多是调用[群组模块](GroupModel)和[会话模块](ConversationModel)进行业务操作。

参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| imId | string | [会话ID](struct/Conversation#会话对象) |
| chatType | number | [会话类型](struct/Conversation#会话类型) |