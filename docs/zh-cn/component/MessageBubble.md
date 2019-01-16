# 消息气泡框

位于`src/component/MessageBubble.js`。

这是聊天详情页面的一个消息框，会根据消息的类型去自动匹配展示UI的组件。参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| isSender | boolean | 是否是发送者 |
| message | [Message](zh-cn/struct/Conversation#消息) | 消息体 |
| onShowMenu | (rect: {x: number, y: number, width: number, height: number}, isSender: boolean, message: Message) => void | 当前消息显示操作菜单的回调方法 |
| leftBubble | ImageSourcePropType | 左侧的气泡箭头图标 |
| rightBubble | ImageSourcePropType | 右侧的气泡箭头图标 |