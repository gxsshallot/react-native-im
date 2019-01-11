# 选择会话页面

位于`src/page/ChooseConversation.js`。

这是一个封装了`react-native-picklist`库的页面，用于选择一个或多个会话，支持单选和多选。

参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| title | string | 标题 |
| allowMulti | boolean | 是否允许多选 |
| selectedIds | Array\<string\> | 预置已选中的会话ID |
| onSelectData | (selectedIds: Array\<Conversation\>) => void | 选中数据的回调方法，返回选中的[会话对象](Conversation#会话对象)数组 |