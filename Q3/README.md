# 总结一下canvas的其他使用小技巧

这个问题有点宽泛。一下不知道从哪说起，想了一下，大概从性能，还有API两个方面来讲一下使用技巧把。

### 性能

##### 离屏幕渲染
简单的说就是创建一个离屏canvas，然后在这个canvas上绘制好一整块图像，最终放到视图canvas中，适合于每一帧图画运算复杂的图形。chrome在69版本有一个官方的[OffscreenCanvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas/OffscreenCanvas)，与worker结合，可以达到进行图像绘制的同时不阻塞的效果。

##### 分层画布
将画布分层，可以避免部分内容改变造成的大量重绘，能大幅度提高性能。比如涂鸦，可以将源图像设为背景，这样一个减少计算量，二个减少储存空间的占用，更容易实现undo等功能，等最终要导出的时候，一次性将两层绘制在一起。

##### 一次性绘制
绘制操作的性能消耗比较高，我们可以把路径先画好，最后一起绘画。

##### 使用requestAnimationFrame执行动画
requestAnimationFrame是个好东西，他能根据屏幕的刷新率来调整绘图次数，而且在页面不激活的情况下暂停调用，提升性能与节省电量，与定时器相比，在时间上也更准确。

##### 避免使用浮点数
使用浮点数做坐标，往往会出现奇奇怪怪的结果，计算机处理浮点数的运算也比整数要来的慢。


### API

##### save与restore
用好save与restore能更方便的进行绘制状态的管理。

##### clip
通过clip可以实现区域的绘制，当截取图片内某些奇怪的形状时非常好用，比如你想将目标图片内一个五角星的形状的内容截取出来。你只要在canvas上剪切出五角星，然后之间将整块图片画进去，clip后的canvas只会将区域内的内容画上去。

##### transform
利用transform可以轻松的实现旋转，翻转，缩放，等一系列效果。其数学原理就是矩阵的计算。
![matrix](https://91happy.oss-cn-shenzhen.aliyuncs.com/imgs/matrix.jpg)

##### globalCompositeOperation
[属性参考mdn](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing)
利用好这个属性，可以玩很多好玩的，比如刮刮卡，就是使用了"destination-out"这一属性。
[刮刮卡](https://github.com/laoxielearnsth/ilovejs/tree/master/canvas/guaguaka)
