# 滑动控制圆点

位于`src/component/SegmentControl.js`。

展示一排圆点，当`ScrollView`横向滚动时，圆点跟着切换高亮状态，可以传入如下参数：

| 名称 | 类型 | 描述 |
| :-: | :-: | :- |
| length | number | 圆点总个数 |
| currentIndex | number | 当前高亮的圆点 |
| color | string | 非高亮圆点的颜色 |
| currentColor | string | 高亮圆点的颜色 |