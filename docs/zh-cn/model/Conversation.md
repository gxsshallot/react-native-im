# 会话

这是一个管理会话信息的模块，包括会话列表，以及每一个会话的信息和配置。

接口如下：

* `name`：模块名称。
* `defaultConfig`：默认[会话配置](zh-cn/struct/Conversation#会话配置)。
* `init(forceUpdate)`：初始化模块，`forceUpdate`表示是否强制更新，如不强制更新，则只从AsyncStorage中读取。
* `uninit(forceClear)`：反初始化模块，`forceClear`表示是否清除持久化存储。
* `load()`：加载会话列表。
* `loadItem(imId, chatType)`：加载并更新单个会话。
* `isValid(imId, chatType)`：判断指定会话是否有效。
* `get()`：获取会话列表。
* `getOne(imId, enableExport)`：获取指定[会话对象](zh-cn/struct/Conversation#会话对象]，默认开启导出功能。
* `getConfig(imId)`：获取指定会话的[会话配置](zh-cn/struct/Conversation#会话配置)。
* `getName(imId)`：获取指定会话的名称，若不存在，则返回`undefined`。
* `updateConfig(imId, config)`：更新指定会话的[会话配置](zh-cn/struct/Conversation#会话配置)。
* `updateMessage(imId, message)`：更新指定会话的最新[消息](zh-cn/struct/Conversation#消息)。
* `deleteOne(imId)`：删除指定会话。
* `createOne(members)`：创建一个会话，传入成员列表，如果只有一个成员，则是单聊，否则是群聊。
* `markReadStatus(imId, chatType, status)`：标记指定会话为已读/未读状态，status为true表示标记已读，为false表示标记未读。