# 群设置中的头像列表

这是一个群设置的头像列表，用于展示当前群的成员，横竖屏状态下都是最多三行，但是竖屏最多5列。并且根据参数，来控制是否显示加减人员的操作。

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| owner | string | 群主的userId |
| data | Array\<string\> | 用于展示的群成员的userId列表 |
| canAdd | boolean | 是否可以添加群成员，默认为true |
| canRemove | boolean | 是否可以删除群成员，默认为true |
| onAddMembers | (data: Array\<string\>) => void | 添加群成员的回调方法，传回已添加的群成员userId列表 |
| onRemoveMembers | (data: Array\<string\>) => void | 删除群成员的回调方法，传回已删除的群成员userId列表 |
| navigation | any | react-navigation在props中传递的导航器 |
| titleChooseGroupMember | string | 进入添加或删除群成员页面的标题，默认为'选择群成员' |