# 安装

## 主模块

```shell
npm install react-native-im
```

## 国际化

## 环信插件(可选)

安装环信的SDK：

```shell
npm install react-native-im-easemob
```

iOS的`Podfile`中，需要添加如下设置：

```ruby
pod 'react-native-im-easemob', :podspec => '../node_modules/react-native-im-easemob/react-native-im-easemob.podspec'
pod 'Hyphenate', '= 3.5.1'
pod 'MJExtension', :git => 'https://github.com/hecom-rn/MJExtension.git', :commit => 'cd3de71c4955935a762a46e59d90160991f5fa92'
```

在工程中的适当位置，导入环信插件的设置接口：

```javascript
import * as Easemob from 'react-native-im/plugin/easemob';

Easemob.setup(); // 设置环信的接口
```

其余内容参见[环信插件说明](zh-cn/plugin/PluginEasemob)