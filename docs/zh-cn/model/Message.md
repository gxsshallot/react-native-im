# 消息

一些发送消息的处理函数。

接口如下：

* `sendMessage(imId, chatType, message, ext, isSystem)`：发送消息。
* `insertTimeMessage(imId, chatType, message)`：根据指定消息，插入时间标签到会话中。
* `insertSystemMessage(imId, chatType, text, localTime, timestamp)`：插入系统消息，调用`sendMessage`方法实现。