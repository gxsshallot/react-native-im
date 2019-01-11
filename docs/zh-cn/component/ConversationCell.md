# 会话单元格

会话列表的单元格组件，内部监听多个事件，用于刷新当前单元格的展示UI，可以传入如下参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| imId | string | [会话ID](struct/Conversation#会话对象) |
| chatType | number | [会话类型](struct/Conversation#会话类型) |
| separatorLeft | number | 分隔线左边距，如果小于0，则不显示分隔线 |