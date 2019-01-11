# 群或个人的头像图片

一个头像组件，可以是一个用户的头像，或者一个群组的头像。

这个组件需要使用`React.Component`，而不是`React.PureComponent`，因为有时候，群组的人员会有增减，这时的Props属性没有变化，但是展示的UI需要有变化。

传入参数如下所示：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| imId | string | 会话唯一标识，可以是一个用户ID或者群组ID |
| chatType | number | 聊天类型 |
| style | ViewStyle | 自定义外部样式 |