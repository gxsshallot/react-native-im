# 可滑动索引列表

用于在列表的右侧，展示一个可以滑动的字母A-Z的索引列表，可以传入如下参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| sections | Array | 列表项 |
| getSectionTitle | (item: any) => string | 将列表中的每一项转换为可展示的标题 |
| onItemChange | (index: number) => void | 点击列表中的项的回调方法 |
| itemStyle | any | 自定义一项的样式 |
| style | any | 自定义视图整体样式 |