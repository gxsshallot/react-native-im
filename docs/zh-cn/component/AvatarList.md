# 群设置中的头像列表

这是一个群设置的头像列表，用于展示当前群的成员，横竖屏状态下都是最多三行，但是竖屏最多5列。并且根据参数，来控制是否显示加减人员的操作。

| 名称 | 描述 |
| :-: | :-: |
| owner | 群主的userId |
| data | 用于展示的群成员的userId列表 |
| canAdd | 是否可以添加群成员，默认为true |
| canRemove | 是否可以删除群成员，默认为true |
| onAddMembers | 添加群成员的回调方法，传回已添加的群成员userId列表 |
| onRemoveMembers | 删除群成员的回调方法，传回已删除的群成员userId列表 |
| navigation | react-navigation在props中传递的导航器 |