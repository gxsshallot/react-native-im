# 代理

这个是用户需要主要设置的地方，包含了内部页面或者组件，要使用的方法、配置信息等，部分有默认值，部分没有，可以在APP启动或者合适时机进行替换。

使用方法：

```javascript
import { IMStandard } from 'react-native-im';

IMStandard.Delegate.xxx.yyy = ... ;
```

这里`xxx`代表分类，`yyy`代表具体的方法或配置项，可以参照下方说明或`src/delegate.js`源文件进行配置。

另外，一些方法的值预置了`unset`方法，在被调用时抛出一个异常，也可以用来快速的通知使用人员进行相应的配置。

## 选项(Option)

主要是功能的开关，用于表示是否启用某项功能。

## 页面(page)

用于用户注册导航时使用，是一个对象，[键](PageKey)代表导航的Key，值是页面对应的类。

预置使用内部页面，可以继承内部页面进行重写方法，然后设置到相应键上。

使用内部页面的方法：

```javascript
import { IMStandard } from 'react-native-im';

IMStandard.setup_common_page();
```

## 组件(component)

一些内部使用的通用组件，这是一个对象，键是组件的标识，值是组件的UI类。

预置使用内部组件，可以继承内部组件进行重写方法，然后设置到相应键上。

使用内部组件的方法：

```javascript
import { IMStandard } from 'react-native-im';

IMStandard.setup_common_component();
```

## 模块(model)

一些模块，这是一个对象，键是组件的标识，值是模块的导出集合。

预置使用内部模块，可以继承内部模块进行重写方法，然后设置到相应键上。

使用内部模块的方法：

```javascript
import { IMStandard } from 'react-native-im';

IMStandard.setup_common_model();
```

## 通讯录(contact)

通讯录是当前用户可以主动发起聊天的用户列表，可以有部门结构。这个用户列表与全部用户可能并不完全相同，因为有可能有部分用户是当前用户无权限发起聊天的，只能被动接收聊天。

包括如下接口：

* `loadAllUser: (isAll: boolean) => Promise<ImUser[] | void>`：这里`isAll`表示是否返回数据，返回数组的元素是[用户信息](Organization#用户)。
* `loadAllOrg: (isAll: boolean) => Promise<ImOrg[] | void>`：这里`isAll`表示是否返回数据，返回数组的元素是[部门信息](Organization#部门)。

## 用户(user)

可以从全部用户之中，获取信息，包括当前用户信息和指定用户信息，统一使用`userId`作为标识。

包括如下接口：

* `getMine: () => Promise<ImUser>`：获取当前[用户信息](Organization#用户)。
* `getUser: (userId: string) => Promise<ImUser>`：获取指定[用户信息](Organization#用户)。

## 聊天(im)

聊天分类主要包括关于聊天的功能，包括如下小的分类：

### 会话(conversation)

对于会话部分的操作，如下所示：

* `loadList: () => Promise<Array<Conversation>>`：加载会话列表，返回一个Promise，包含[会话对象](Conversation#会话对象)的数组。
* `loadItem: (imId: string, chatType: ChatType, autoCreate: boolean) => Promise<Conversation>`：获取一个会话，指定会话ID和[会话类型](Conversation#会话类型)，`autoCreate`表示不存在的时候是否自动创建会话，返回一个包含[会话对象](Conversation#会话对象)的Promise。
* `deleteOne: (imId: string) => Promise`：删除指定会话，可以从本地删除，也可以同时从服务器删除，返回一个空的Promise。
* `updateConfig: (imId: string, config: ConversationConfig) => Promise<ConversationConfig>`：更新指定会话配置，返回包含新的[会话配置](Conversation#会话配置)的Promise。
* `markAllRead: (imId: string, chatType: ChatType) => Promise`：标记指定会话为已读状态，返回一个空的Promise。
* `markLatestUnread: (imId: string, chatType: ChatType) => Promise`：标记指定会话最近一条消息为未读状态，返回一个空的Promise。
* `loadMessage: ({imId: string, chatType: ChatType, lastMessageId: string, count: number}) => Promise<Array>`：获取指定会话的消息列表，可以指定上一次最后一条消息的ID，和每次获取的数量，返回原始消息的Promise。
* `deleteMessage: ({imId: string, chatType: ChatType, message: ImMessage}) => Promise`：删除本地的指定消息，返回一个空的Promise。
* `recallMessage: ({imId: string, chatType: ChatType, message: ImMessage}) => Promise`：撤回指定消息，负责发送远程通知，告诉对方撤回消息，返回一个空的Promise。

### 群组(group)

对于聊天群组的操作，如下所示：

* `loadList: () => Promise<Array<Group>>`：加载群组列表，返回一个Promise，包含[群组对象](Group#群组)的数组。
* `loadItem: (groupId: string) => Promise<Group>`：获取一个群组信息，指定群组ID，返回一个包含[群组对象](Group#群组)的Promise。
* `createOne: (members: Array<string>) => Promise<Group>`：创建一个群组，`members`表示群成员ID列表，返回一个包含[群组对象](Group#群组)的Promise。如果已经存在该群，则返回已存在的群的信息。
* `destroyOne: (groupId: string) => Promise`：解散一个群组，群主的操作，返回一个空的Promise，若解散失败，则抛出异常。
* `quitOne: (groupId: string) => Promise`：退出一个群组，群成员的操作，返回一个空的Promise，若退出失败，则抛出异常。
* `addMembers: (groupId: string, members: Array<string>) => Promise`：在指定群组中添加多个群成员，返回一个空的Promise。
* `removeMembers: (groupId: string, members: Array<string>) => Promise`：在指定群组中移除多个群成员，返回一个空的Promise。
* `changeAvatar: (groupId: string, avatar: string) => Promise`：在指定群组中改变群头像，`avatar`表示新的群头像的URL地址，返回一个空的Promise。
* `changeOwner: (groupId: string, ownerId: string) => Promise`：在指定群组中改变群主，`ownerId`表示新的群主的用户ID，返回一个空的Promise。
* `changeName: (groupId: string, name: string) => Promise`：在指定群组中改变群名称，`name`表示新的群名称，返回一个空的Promise。

## 功能(func)

包括一些业务上的功能，如下所示：

* `pushToLocationViewPage: (params: locationMessageBody) => void`：跳转到定位展示页面，参数类型`locationMessageBody`是[定位消息的data字段格式的对象](PluginMessage#定位消息)。
* `pushToLocationChoosePage: ({onChoose: (poiInfo: locationMessageBody) => void}) => void`：跳转到定位选择页面，参数onChoose中的返回参数类型`locationMessageBody`是[定位消息的data字段格式的对象](PluginMessage#定位消息)。
* `pushToUserDetailPage: (userId: string) => void`：跳转到指定用户的详情页面。
* `fitUrlForAvatarSize: (avatar: string, size: number) => string`：给定自定义头像的URL和要展示的大小，返回指定大小图片的URL，用于经过图片优化的头像展示。
* `getDefaultUserHeadImage: (userId?: string) => ImageSourcePropType`：返回指定用户的默认本地头像，如果userId为空，则返回当前用户默认本地头像。
* `uploadImages: (filepaths: Array<string>) => Promise<Array<string>>`：批量上传本地图片，filepaths为一个本地图片地址的数组，返回的Promise中，结果为图片上传后的远程URL地址数组。

## 样式(style)

一些全局的样式配置，包括如下键：

* `viewBackgroundColor`：页面的默认背景色。
* `separatorLineColor`：分隔线的默认颜色。

## 配置(config)

一些全局的配置信息，包括如下配置：

* `pinyinField`：在[用户信息](Organization#用户)中，被用于拼音检索的字段名称，预置为`'pinyin'`。这是因为前端一般不直接做中文转拼音，而是由后台接口返回，前端直接使用即可。
* `titleLoading`：在进入页面后，数据还没有准备好的时候，页面导航条标题显示的`加载中`字样。
* `buttonOK`：确定按钮的文本。
* `messageType`：消息类型的实际数值设置。