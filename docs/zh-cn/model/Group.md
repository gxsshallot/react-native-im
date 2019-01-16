# 群组

这是一个管理群组的模块，包括群组列表，以及每一个群组的信息和配置。

接口如下：

* `name: string`：模块名称。
* `init(forceUpdate)`：初始化模块，`forceUpdate`表示是否强制更新，如不强制更新，则只从AsyncStorage中读取。
* `uninit(forceClear)`：反初始化模块，`forceClear`表示是否清除持久化存储。
* `load()`：加载群组列表。
* `loadItem(groupId)`：加载指定[群组信息](Group#群组)。
* `get()`：获取群组列表。
* `findByGroupId(groupId, enableExport)`：获取指定[群组信息](Group#群组)，默认开启导出功能。
* `getOwner(groupId)`：获取指定群组的群主ID。
* `getMembers(groupId, hasOwner)`：获取指定群组的群成员ID列表，使用`hasOwner`表示是否包含群主。
* `getName(groupId, autoConjWhenEmpty)`：获取指定群组的名称，若不存在，则返回`undefined`或自动连接群成员名称作为群组名称。
* `getAvatar(groupId)`：获取指定群组的自定义头像。
* `getAllowAdd(groupId)`：获取指定群组的是否允许添加成员配置。
* `createOne(memberUserIds)`：创建一个群组，传入成员列表。
* `destroyOne(groupId)`：解散指定群聊。
* `quitOne(groupId)`：退出指定群聊。
* `addMembers(groupId, memberUserIds)`：在指定群组中添加一个或多个群成员。
* `removeMembers(groupId, memberUserIds)`：在指定群组中删除一个或多个群成员。
* `changeName(groupId, newName)`：修改指定群组的群名称。
* `changeAvatar(groupId, newAvatarUrl)`：修改指定群组的群头像。
* `changeOwner(groupId, newOwnerId)`：修改指定群组的群主。
* `changeAllowAdd(groupId, isAllowAdd)`：修改指定群组的允许添加成员配置。