# 设置项单元格

在聊天设置页面里面，显示的单元格，左面是一个标签，右面可以是文本、图片、Switch开关等。参数如下：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| title | string | 左侧标题 |
| type | [SettingItemType](#设置类型) | 设置类型 |
| data | any | 值，可以是文本、图片、布尔值等 |
| onPressLine | () => void | 行点击的回调方法 |
| onPressSwitch | (value: boolean) => void | Switch开关状态改变的回调方法 |

## 设置类型

实现位于`src/constant.js`中的`SettingItemType`，目前支持三种类型：

* `Text`：文本
* `Image`：图片
* `Switch`：开关