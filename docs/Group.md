# 群组

包含多个用户的组织，区别于会话。会话可以是基于一个群组的聊天，也可以是基于一个用户的聊天。

群组对象包含如下属性：

| 名称 | 类型 | 必须 | 描述 |
| :-: | :-: | :-: | :- |
| groupId | string | 是 | 群组标识 |
| name | string | 否 | 群组自定义名称，如果没有，则使用所有成员的名字拼音拼成群组名称 |
| name_py | string | 否 | 群组自定义名称的拼音，用于搜索 |
| avatar | string | 否 | 群组自定义头像的URL地址 |
| owner | string | 是 | 群主的[用户ID](Organization#用户) |
| members | Array\<string\> | 是 | 群成员的[用户ID](Organization#用户)列表，长度至少是1 |
| createdOn | number | 否 | 群组的创建时间，用于展示 |