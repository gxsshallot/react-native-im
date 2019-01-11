# 消息操作悬浮框

位于`src/component/MessageMenu.js`。

在消息上长按后，弹出的操作悬浮框，可以传入如下参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| menuShow | boolean | 是否展示悬浮框 |
| menuRect | {x: number, y: number, width: number, height: number} | 悬浮框展示的位置和大小 |
| actionList | Array\<{title: string, action: () => void}\> | 按钮列表，每个按钮包括标题和操作方法 |
| onClose | () => void | 关闭时的回调方法 |