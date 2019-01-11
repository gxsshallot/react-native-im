# 基本展示单元格

单元格的基本展示单位，可以是单个会话，也可以是群组单元格或者联系人单元格。参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| avatar | string \| ImageSourcePropType \| {imId: string, chatType: number} | 头像信息，可以是URL或者图片源，或者是一个会话的信息 |
| title | string \| ReactElement \| Array\<ReactElement\> | 主标题，可以是字符串或自定义视图 |
| labels | Array\<{name: string, color: string}\> | 主标题右侧的标签，包括标签名称和颜色 |
| subTitle | string \| ReactElement \| Array | 副标题，可以是字符串或自定义视图 |
| onClick | () => void | 点击事件回调方法 |
| onLongPress | () => void | 长按事件回调方法 |
| right | ReactElement \| Array\<ReactElement\> \| () => ReactElement \| Array\<ReactElement\> | 右侧的视图，可以是自定义视图，或者视图函数 |
| style | any | 内容的自定义样式 |