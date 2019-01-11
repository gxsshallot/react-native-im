# 联系人列表

位于`src/page/ContactList.js`。

这是一个用于展示通讯录中所有联系人的列表，可以点击搜索栏进行搜索人员或群组，右侧有可滑动的索引列表。

参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| itemHeight | number | 联系人单元格的高度 |
| getHeaderConfig | ({users, sections}) => Array\<{title: string, subTitle: string, onClick: () => void, icon: ImageSourcePropType}\> | 获取联系人列表的自定义顶部区域配置，其中`users`是联系人信息列表，`sections`是分区信息列表 |
