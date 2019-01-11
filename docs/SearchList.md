# 搜索列表组件/搜索更多页面

基础的搜索组件，包括记录搜索历史，将搜索结果分区展示(支持设置分区内部的最大数量)，并支持点击事件，可以传入如下参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| searchText | string | 默认搜索内容 |
| searchHint | string | 搜索框提示文字 |
| showHistory | boolean | 是否展示搜索历史 |
| historyKey | string | 搜索历史记录存储的key，需要保证唯一，否则可能引起数据混乱 |
| doSearch | (text: string) => Array | 执行搜索方法，返回数据 |
| onItemClick | ({item: any, index: number, searchText: string}) => void | 搜索结果项点击回调，当设置该属性时，搜索列表添加默认点击事件，只在点击结果项时保存历史记录；当未设置该属性时，搜索列表没有默认点击事件，在进行搜索动作时直接保存历史记录 |
| itemKey | string | 作为历史记录保存的item的属性 |
| maxHistoryLength | number | 最大搜索历史记录数 |
| maxSectionItemLength | number | 使用分组搜索结果时，用于控制每个分组的最多条目数 |
| onSectionFooterClick | ({title: string, searchText: string}) => void | 分区底部的点击事件 |

其余属性请参见[FlatList](https://reactnative.cn/docs/flatlist/)和[SectionList](https://reactnative.cn/docs/sectionlist/)，我们使用`renderSectionHeader`参数是否存在来区分二者。