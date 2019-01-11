# 详情页底部输入栏

位于`src/component/BottomBar.js`。

很简单的一个UI类，展示一个右箭头，可以传入如下参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| imId | string | [会话ID](struct/Conversation#会话对象) |
| chatType | number | [会话类型](struct/Conversation#会话类型) |
| onSendMessage | ({type: number, body: object}) => void | 发送消息的回调方式，传回一个对象，包含消息类型和消息体 |
| navigation | object | 导航器 |