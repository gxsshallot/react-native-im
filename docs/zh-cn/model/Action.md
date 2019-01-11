# 操作

这个模块主要是动态注册各种处理函数的，每一个操作类型代表一大类操作。

## API

### register

注册一个处理函数，当特殊状态函数成立时，进行调用。

| 参数 | 类型 | 说明 |
| :-: | :-: | :- |
| action | string | 在constant/action.js中定义的操作类型 |
| messageType | number | 你可以自定义的消息类型 |
| specialFunc | (state: any) => boolean | 特殊状态函数，其中state是待判断的IM消息体 |
| handleFunc | (params: any) => any | 处理函数，其中params是处理的参数，包括IM消息体和其他设置，请看具体场景的match方法 |
| priority | number | 优先级，默认为0 |

函数返回注册的句柄，用于取消注册。

### unregister

取消注册一个处理函数。

| 参数 | 类型 | 说明 |
| :-: | :-: | :- |
| action | string | 在constant/action.js中定义的操作类型 |
| messageType | number | 你可以自定义的消息类型 |
| handleId | string | 注册的句柄 |

函数返回取消成功或失败。

### match

对一个场景进行匹配，根据state判断条件是否成立，成立则调用相应的handle函数对params进行处理，返回处理结果。

| 参数 | 类型 | 说明 |
| :-: | :-: | :- |
| action | string | 在constant/action.js中定义的操作类型 |
| messageType | number | 你可以自定义的消息类型 |
| state | Message | 待判断的IM消息体 |
| params | any | 处理的调用参数，包括IM消息体和其他设置 |

函数返回调用处理函数的结果。

## Display

将[标准消息](struct/Conversation#消息)展示成UI组件。

默认部分：按照消息的类型来进行划分，注册处理方式时，可以用消息类型作为二级分区。

特殊处理判断：传递`message`为[标准消息](struct/Conversation#消息)，返回布尔值表示是否匹配成功。

处理方式：

不传递处理参数，直接获取注册时放置进去的视图类。

然后在[消息气泡框](MessageBubble)组件中，动态用获得的视图类，创建组件实例，创建时传递`props`为组件参数，格式如下：

| 参数 | 类型 | 说明 |
| :-: | :-: | :- |
| message | [ImMessage](struct/Conversation#消息) | 标准消息 |
| isSender | boolean | 是否是发送方 |
| maxWidth | number | 组件的最大宽度 |
| enableBubble | (status: boolean) => void | 启用/隐藏气泡的回调方法 |
| style | any | 自定义视图样式 |

即视图的属性包含上述属性。如果要实现点击事件，则在视图类中，添加`onPress = () => {...};`方法即可。

## Parse

解析操作，将原始消息，转换为[标准消息](struct/Conversation#消息)。

特殊处理判断：传递`message`为原始消息，返回布尔值表示是否匹配成功。

处理方式：传递`message`为原始消息，返回`newMessage`为[标准消息](struct/Conversation#消息)。

## Send

将[标准消息](struct/Conversation#消息)发送到指定会话。

默认部分：按照消息的类型来进行划分，注册处理方式时，可以用消息类型作为二级分区。

特殊处理判断：传递处理的参数，返回布尔值表示是否匹配成功。

处理方式：

传递参数，由处理函数处理后，返回一个包含新消息的Promise。参数格式如下：

| 参数 | 类型 | 说明 |
| :-: | :-: | :- |
| imId | string | 消息的[会话ID](struct/Conversation#会话对象) |
| chatType | number | 消息的[会话类型](struct/Conversation#会话类型) |
| message | [ImMessage](struct/Conversation#消息) | 标准消息 |
| ext | object | 扩展字段 |

## Abstract

将[标准消息](struct/Conversation#消息)缩略成摘要信息，展示在会话的单元格中。

默认部分：按照消息的类型来进行划分，注册处理方式时，可以用消息类型作为二级分区。

特殊处理判断：传递`message`为[标准消息](struct/Conversation#消息)，返回布尔值表示是否匹配成功。

处理方式：

传递参数，由处理函数处理后，返回一个字符串用于文本展示。参数格式如下：

| 参数 | 类型 | 说明 |
| :-: | :-: | :- |
| imId | string | 消息的[会话ID](struct/Conversation#会话对象) |
| chatType | number | 消息的[会话类型](struct/Conversation#会话类型) |
| message | [ImMessage](struct/Conversation#消息) | 标准消息 |

## MoreBoard

在聊天详情页面的底部更多面板中展示的项的配置信息。