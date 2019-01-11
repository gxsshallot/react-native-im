# 聊天详情的列表

位于`src/component/DetailListView.js`。

这是聊天详情页面使用的列表组件，使用`FlatList`实现的，设置`inverted`为反向展示，集成了列表操作，包括添加和合并消息。

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| onLoadPage | (previousData: Array, pageSize: number) => Promise<{data: Array, isEnd: boolean, isAllData: boolean}> | 加载页面数据的回调，返回一个Promise，包含数据、是否结束、是否是全部数据或新增数据 |
| style | any | 自定义样式 |

专用于`defaultProps`的参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| pageSize | number | 加载数据的页大小 |