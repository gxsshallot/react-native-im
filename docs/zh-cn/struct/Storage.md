# 存储

采用[react-native-general-storage](https://github.com/gaoxiaosong/react-native-general-storage)作为持久化存储的类，这个库是支持多级层次的存储结构，并支持分区存储。

存储分区放在`src/constant.js`中，其中`StoragePart`是分区的键。

* 会话：`src/model/conversation.js`，在`StoragePart`分区的`im.conversation`中存储。
* 群组：`src/model/group.js`，在`StoragePart`分区的`im.group`中存储。
* 搜索历史：`src/component/SearchList.js`，在`StoragePart`分区的`search_history`中存储。