# 群成员列表页面

位于`src/page/GroupMembers.js`。

这是一个用来展示群组成员的列表页面，支持添加和删除操作，对于群主有特殊标记。

参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| groupId | string | 群组ID |
| members | Array\<string\> | 群组成员ID列表 |
| admins | Array\<string\> | 管理员ID列表 |
| canAdd | boolean | 是否可以添加成员 |
| canRemove | boolean | 是否可以删除成员 |
| onAddMembers | (data: Array\<string\>) => Promise\<Array\<string\>\> | 添加群成员的回调方法，传回已添加的群成员userId列表，返回新成员的userId列表 |
| onRemoveMembers | (data: Array\<string\>) => Promise\<Array\<string\>\> | 删除群成员的回调方法，传回已删除的群成员userId列表，返回剩余成员的userId列表 |