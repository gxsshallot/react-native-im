# 外部

这是用于处理从远程接收到的普通消息或控制消息的处理函数集合，包括常见的业务逻辑处理。

接口如下：

* `onMessageReceived(originMessage)`：普通消息的处理。
* `onRecallMessage(imId, chatType, fromUserId, message)`：撤回消息请求的处理。
* `onUserJoin(groupId, invitorId, userJoinedIds, localTime, timestamp)`：用户加入群组请求的处理。
* `onUserLeave(groupId, operatorId, userLeavedIds, localTime, timestamp)`：用户退出群组请求的处理，其中`[operatorId] === userLeavedIds`表示是自己主动退出群聊，其他情况是被管理员移出群聊。
* `onUpdateName(groupId, updatorId, newGroupName, localTime, timestamp)`：更改群组名称请求的处理。
* `onUpdateOwner(groupId, newOwnerId, localTime, timestamp)`：更改群主请求的处理。
* `onGroupDelete(groupId, localTime, timestamp)`：解散群组请求的处理。
* `getOperatorName(userId)`：处理操作人的名称的函数。
* `groupUpdateOperation(groupId, text, localTime, timestamp)`：处理群组信息更新的通用处理函数，`text`为要展示的系统消息。