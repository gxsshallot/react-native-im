# 添加更多面板

位于`src/component/MoreBoard.js`。

详情页面的下方添加更多面板，参数请参见[详情页底部输入栏](BottomBar)的参数。

用于`defaultProps`的参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| getItems | (imId: string, chatType: number) => Array\<string\> | 获取配置的面板项列表 |