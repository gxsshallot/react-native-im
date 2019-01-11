# 从部门选择人员页面

位于`src/page/ChooseUserFromOrg.js`。

这是一个封装了`react-native-picklist`库的页面，用于从一个复杂的组织架构中，从一个或多个部门选取一个或多个人员。

参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| title | string | 页面标题 |
| firstTitleLine | string | 用于部门层级标签的第一项 |
| multiple | boolean | 是否多选 |
| hasSelf | boolean | 选择的人员中是否包含当前用户 |
| parentOrgId | string | 根部门的orgId，为空则表示所有部门 |
| excludedUserIds | Array\<string\> | 排除掉的人员的userId列表 |
| selectedIds | Array\<string\> | 预置已选中的人员的userId列表 |
| onSelectData | (data: Array\<string\>) => void | 选中后对选择结果的回调，参数是选中人员的userId列表 |
| labelLoadError | string | 加载组织架构错误时提示语 |
| spaceHeight | number | 页面展示时，上方部门和下方人员中间的分隔高度 |