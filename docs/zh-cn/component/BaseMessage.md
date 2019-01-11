# 消息展示单元格

位于`src/component/BaseMessage.js`。

这是在聊天详情页面使用的消息展示单元格，包括左右的头像，以及重新发送的标识，还有正在发送的圆圈，和消息的展示框。参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| imId | string | 会话唯一标识，可以是一个用户ID或者群组ID |
| chatType | number | 聊天类型 |
| position | number | 消息的位置信息，小于0表示位于左侧，等于0表示位于中间，大于0表示位于右侧 |
| message | [Message](struct/Conversation#消息) | 待展示的消息体 |
| onShowMenu | (rect: {x: number, y: number, width: number, height: number}, isSender: boolean, message: Message) => void | 当前消息显示操作菜单的回调方法 |