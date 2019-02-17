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

* `Conversation`：管理会话信息的模块接口，包括会话列表，以及每一个会话的信息和配置。
  * `name`：模块名称。
  * `defaultConfig`：默认会话配置。
  * `init`：初始化模块，`forceUpdate`表示是否强制更新，如不强制更新，则只从AsyncStorage中读取。
  * `uninit`：反初始化模块，`forceClear`表示是否清除持久化存储。
  * `load`：加载会话列表。
  * `loadItem`：加载并更新单个会话。
  * `isValid`：判断指定会话是否有效。
  * `get`：获取会话列表。
  * `getOne`：获取指定会话对象，默认开启导出功能。
  * `getConfig`：获取指定会话的会话配置。
  * `getName`：获取指定会话的名称，若不存在，则返回`undefined`。
  * `updateConfig`：更新指定会话的会话配置。
  * `updateMessage`：更新指定会话的最新消息。
  * `deleteOne`：删除指定会话。
  * `createOne`：创建一个会话，传入成员列表，如果只有一个成员，则是单聊，否则是群聊。
  * `markReadStatus`：标记指定会话为已读/未读状态，status为true表示标记已读，为false表示标记未读。
* `Group`：管理群组的模块接口，包括群组列表，以及每一个群组的信息和配置。
  * `name`：模块名称。
  * `init`：初始化模块，`forceUpdate`表示是否强制更新，如不强制更新，则只从AsyncStorage中读取。
  * `uninit`：反初始化模块，`forceClear`表示是否清除持久化存储。
  * `load`：加载群组列表。
  * `loadItem`：加载指定群组信息。
  * `get`：获取群组列表。
  * `findByGroupId`：获取指定群组信息，默认开启导出功能。
  * `getOwner`：获取指定群组的群主ID。
  * `getMembers`：获取指定群组的群成员ID列表，使用`hasOwner`表示是否包含群主。
  * `getName`：获取指定群组的名称，若不存在，则返回`undefined`或自动连接群成员名称作为群组名称。
  * `getAvatar`：获取指定群组的自定义头像。
  * `getAllowInvites`：获取指定群组的是否允许添加成员配置。
  * `createOne`：创建一个群组，传入成员列表。
  * `destroyOne`：解散指定群聊。
  * `quitOne`：退出指定群聊。
  * `addMembers`：在指定群组中添加一个或多个群成员。
  * `removeMembers`：在指定群组中删除一个或多个群成员。
  * `changeName`：修改指定群组的群名称。
  * `changeAvatar`：修改指定群组的群头像。
  * `changeAllowInvites`：修改指定群组的允许添加成员配置。
  * `changeOwner`：修改指定群组的群主。

## 通讯录(contact)

通讯录是当前用户可以主动发起聊天的用户列表，可以有部门结构。这个用户列表与全部用户可能并不完全相同，因为有可能有部分用户是当前用户无权限发起聊天的，只能被动接收聊天。

包括如下接口：

* `loadAllUser`：这里`returnValue`表示是否返回数据，返回数组的元素是用户信息。
* `loadAllOrg`：这里`returnValue`表示是否返回数据，返回数组的元素是部门信息。
* `loadUserOrgTree`：获取通讯录的员工部门树，非叶节点为部门，叶节点为员工，部门中的`children`字段表示子节点列表。这里的参数分别是是否包含自己、父部门Id、排除的人员Id列表。因为如果人员和部门数据量很大的话，用自带的内部算法建树复杂度是很高的，可以通过外部方式直接传入树，或使用更深层次的联系快速建树。
* `loadStarUser`：获取标星的联系人列表。

## 用户(user)

可以从全部用户之中，获取信息，包括当前用户信息和指定用户信息，统一使用`userId`作为标识。

包括如下接口：

* `getMine`：获取当前用户信息。
* `getUser`：获取指定用户信息。

## 聊天(im)

聊天分类主要包括关于聊天的功能，包括如下小的分类：

### 会话(conversation)

对于会话部分的操作，如下所示：

* `loadList`：加载会话列表，返回一个Promise，包含会话对象的数组。
* `loadItem`：获取一个会话，指定会话ID和会话类型，`autoCreate`表示不存在的时候是否自动创建会话，返回一个包含会话对象的Promise。
* `deleteOne`：删除指定会话，可以从本地删除，也可以同时从服务器删除，返回一个空的Promise。
* `updateConfig`：更新指定会话配置，返回包含新的会话配置的Promise。
* `markAllRead`：标记指定会话为已读状态。
* `markLatestUnread`：标记指定会话最近一条消息为未读状态。
* `loadMessage`：获取指定会话的消息列表，可以指定上一次最后一条消息的ID，和每次获取的数量，返回原始消息的Promise。
* `deleteMessage`：删除本地的指定消息。
* `recallMessage`：撤回指定消息，负责发送远程通知，告诉对方撤回消息。

### 群组(group)

对于聊天群组的操作，如下所示：

* `loadList`：加载群组列表，返回一个包含群组对象数组的Promise。
* `loadItem`：获取一个群组信息，指定群组ID，返回一个包含群组对象的Promise。
* `createOne`：创建一个群组，`memberUserIds`表示群成员ID列表，返回一个包含群组对象的Promise。如果已经存在该群，则返回已存在的群的信息。
* `destroyOne`：解散一个群组，群主的操作。
* `quitOne`：退出一个群组，群成员的操作。
* `addMembers`：在指定群组中添加多个群成员。
* `removeMembers`：在指定群组中移除多个群成员。
* `changeName`：在指定群组中改变群名称，`newName`表示新的群名称。
* `changeAvatar`：在指定群组中改变群头像，`newAvatarUrl`表示新的群头像的URL地址。
* `changeAllowInvites`：更改是否允许其他人添加成员设置。
* `changeOwner: (groupId: string, ownerId: string) => Promise`：在指定群组中改变群主，`ownerId`表示新的群主的用户ID，返回一个空的Promise。

## 功能(func)

包括一些业务上的功能，如下所示：

* `pushToLocationViewPage: (params: locationMessageBody) => void`：跳转到定位展示页面，参数类型`locationMessageBody`是[定位消息的data字段格式的对象](PluginMessage#定位消息)。
* `pushToLocationChoosePage: ({onChoose: (poiInfo: locationMessageBody) => void}) => void`：跳转到定位选择页面，参数onChoose中的返回参数类型`locationMessageBody`是[定位消息的data字段格式的对象](PluginMessage#定位消息)。
* `pushToUserDetailPage`：跳转到指定用户的详情页面。
* `fitUrlForAvatarSize`：给定自定义头像的URL和要展示的大小，返回指定大小图片的URL，用于经过图片优化的头像展示。
* `getDefaultUserHeadImage`：返回指定用户的默认本地头像，如果userId为空，则返回当前用户默认本地头像。
* `uploadImages: (filepaths: Array<string>) => Promise<Array<string>>`：批量上传本地图片，filepaths为一个本地图片地址的数组，返回的Promise中，结果为图片上传后的远程URL地址数组。

## 样式(style)

一些全局的样式配置，包括如下键：

* `viewBackgroundColor`：页面的默认背景色。
* `separatorLineColor`：分隔线的默认颜色。

## 配置(config)

一些全局的配置信息，包括如下配置：

* `pinyinField`：在[用户信息](zh-cn/struct/Organization#用户)中，被用于拼音检索的字段名称，预置为`'pinyin'`。这是因为前端一般不直接做中文转拼音，而是由后台接口返回，前端直接使用即可。
* `titleLoading`：在进入页面后，数据还没有准备好的时候，页面导航条标题显示的`加载中`字样。
* `buttonOK`：确定按钮的文本。
* `messageType`：消息类型的实际数值设置。