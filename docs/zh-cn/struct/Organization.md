# 组织架构

在一个IM应用中，每个用户有一个自己的imId，是用于跟IM服务器进行交互的唯一标识。

每一个用户，同样有自己的通讯录列表，通讯录中，可以是按部门划分，也可以就自己一个部门。

故我们定义如下数据结构：

## 用户

参见`src/proptype.js`中的`ImUser`对象。

| 属性 | 类型 | 必须 | 描述 |
| :-: | :-: | :-: | :- |
| userId | string | 是 | 用户的imId，是其在IM中的唯一标识 |
| name | string | 否 | 用户的名称 |
| name_py | string | 否 | 用户名称的拼音，用于搜索 |
| dept | ImOrg | 否 | 用户的所属部门信息 |
| avatar | string | 否 | 用户的自定义头像URL |
| phone | string | 否 | 用户的电话号码 |
| email | string | 否 | 用户的邮箱 |

## 部门

参见`src/proptype.js`中的`ImOrg`对象。

| 属性 | 类型 | 必须 | 描述 |
| :-: | :-: | :-: | :- |
| orgId | string | 是 | 部门的唯一标识 |
| name | string | 否 | 部门名称 |
| name_py | string | 否 | 部门名称的拼音，用于搜索 |
| dept | ImOrg | 否 | 上级部门的信息 |