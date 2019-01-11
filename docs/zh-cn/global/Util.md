# 工具

位于`src/util`目录中，有一些全局通用的工具方法。

## simpleExport

简单的深拷贝方法，使用JSON序列化，不支持带`prototype`的类对象。

## deepExport

深拷贝方法，支持对于对象和数组进行深拷贝，采用递归的方法，如果采用JSON序列化和反序列化方法，则对于类实例会有问题。

## DateUtil

一些对于时间的操作函数，包括格式化。底层使用`dateformat`库。

## guid

利用随机数生成一个GUID。

## mapListToSection

将一个用户列表，按照拼音字段的首字母进行分区，然后排序返回。