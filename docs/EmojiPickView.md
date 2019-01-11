# 表情选择视图

位于`src/component/EmojiPickView.js`。

展示了一个表情选择的视图，可以横向滚动，有删除按钮用于删除之前输入的表情，可以传入如下参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| key | string | 指定使用的[表情包主键](Emoji) |
| onPickEmoji | (text: string, isDelete: boolean) => void | 选中表情后的回调 |
| style | any | 整体视图的自定义样式 |
| itemSize | number | 表情项的大小 |
| tabViewHeight | number | 下方Tab栏的高度 |