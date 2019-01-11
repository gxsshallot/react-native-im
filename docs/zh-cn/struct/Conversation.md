# 会话

## 会话类型

用`chatType`来表示，在目前版本中，只支持单聊和群聊两种会话类型：

| 名称 | 取值 | 描述 |
| :-: | :-: | :- |
| Single | 0 | 单聊 |
| Group | 1 | 群聊 |

## 会话配置

每一个会话都包含一个配置，如果不存在，则设置默认配置。

| 名称 | 类型 | 默认值 | 描述 |
| :-: | :-: | :-: | :- |
| showMembersName | boolean | true | 是否在群聊中显示成员名称 |
| top | boolean | false | 是否置顶会话 |
| avoid | boolean | false | 是否免打扰 |

## 会话对象

一个会话的应该包括如下属性：

| 属性 | 类型 | 必须 | 描述 |
| :-: | :-: | :-: | :- |
| imId | string | 是 | 会话ID，可以是一个[ImUser](struct/Organization#用户)的userId或一个群组的groupId |
| chatType | number | 是 | [会话类型](#会话类型) |
| config | [Config](#会话配置) | 否 | 配置信息 |
| latestMessage | [ImMessage](#消息) | 否 | 最新一条消息 |
| unreadMessageCount | number | 否 | 未读消息数 |
| atMe | boolean | 否 | 当前会话中是否有@消息 |

## 消息

在会话中，消息是IM的基本单位，以下列出一个消息的基本结构，对于不同的消息类型，实际的data字段有所不同。

| 属性 | 类型 | 必须 | 描述 |
| :-: | :-: | :-: | :- |
| conversationId | string | 是 | 消息所属的会话ID |
| messageId | string | 否 | 服务端消息的唯一标识 |
| innerId | string | 否 | 内部消息的临时标识 |
| status | number | 是 | [消息的发送状态](#消息发送状态) |
| type | number | 是 | 消息类型 |
| from | string | 是 | 发送方的唯一标识，是一个会话ID或一个人员ID |
| to | string | 是 | 接收方的唯一标识，是一个会话ID或一个人员ID |
| localTime | number | 是 | 消息的本地时间戳，单位是毫秒 |
| timestamp | number | 是 | 消息的服务器时间戳，单位是毫秒 |
| data | any | 是 | 消息的实际数据，根据不同的消息类型有不同的格式 |

### 消息发送状态

| 名称 | 状态 | 取值 |
| :-: | :-: | :-: |
| Pending | 待发送 | 0 |
| Delivering | 发送中 | 1 |
| Succeed | 发送成功 | 2 |
| Failed | 发送失败 | 3 |