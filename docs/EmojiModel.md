# 表情

这是管理表情的模块，表情由表情包和具体表情组成，每一个表情包中，有多个具体的表情，每一个表情都是由文本和图片组成的。

表情包和其中的具体表情都是有序的。

具体接口如下：

* `addPart: (key: string, params: object) => void`：添加一个表情包，`key`是表情包的主键，`params`是表情包的其它参数，不包括具体表情。
* `deletePart: (key: string) => void`：删除一个表情包，`key`是表情包的主键。
* `addEmoji: (key: string, text: string, image: string | number) => void`：添加一个具体表情到指定的表情包中，表情图片可以是一个`require`的本地图片，或者是一个URL。
* `deleteEmoji: (key: string, text) => void`：在指定的表情包中移除一个表情。
* `getAllParts: () => Array<EmojiPart>`：获取所有表情包的信息，返回的信息中不包括具体表情。
* `getPartEmojis: (key: string) => Array<{text: string, image: string | number}>`：获取指定表情包的所有具体表情。
* `getEmoji: (text: string, key: string = undefined) => string | number | void`：根据表情文本，获取具体表情，可以指定在某一表情包中，如果`key`为`undefined`，则表示在全部表情包中查找，返回具体表情的表情图片。