# 事件

采用[@hecom/listener](https://github.com/hecom-rn/listener)作为事件监听的类，这个库是支持多级层次的事件结构，并支持对所有下级事件的监听。

事件类型都放在`src/constant.js`中，其中`BaseEvent`代表基础事件类型，是每个事件的根类型。

* 会话更新：`[BaseEvent, ConversationEvent, imId]`，如果不传会话ID，则表示会话列表更新。无数据。
* 未读消息数更新：`[BaseEvent, UnreadCountEvent, imId]`，如果不传会话ID，则表示全部会话的未读消息数。数据是未读消息数。
* 群组信息更新：`[BaseEvent, GroupEvent, groupId]`，如果不传群组ID，则表示群组列表更新。无数据。
* 发送消息：`[BaseEvent, SendMessageEvent, imId]`。数据是一个[消息](zh-cn/struct/Conversation#消息)对象。
* 接收消息：`[BaseEvent, ReceiveMessageEvent, imId]`。数据是一个[消息](zh-cn/struct/Conversation#消息)对象。
* 撤回消息：`[BaseEvent, RecallMessageEvent, imId]`。数据是一个[消息](zh-cn/struct/Conversation#消息)对象。