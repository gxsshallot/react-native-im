# 选择人员页面

位于`src/page/ChooseUser.js`。

这是一个封装了`react-native-picklist`库的页面，用于选择一个或多个人员，支持从外部传入数据，而不是读取整个通讯录人员列表。

该页面支持所有[从部门选择人员页面的参数](ChooseUserFromOrgPage)，其余参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| dataSource | Array\<ImUser\> | 自定义数据源，如果不传，则使用整个通讯录人员列表 |