# save和restore有哪些常见的用法？

在写save和restore有哪些用法之前，先搞清楚，他们是干什么的。刚接触canvas的时候，发现了这个方法，以为牛逼啊，这样实现撤销就简单了，后来发现没用，仔细阅读了一下文档，他这里的状态管理，指的是canvas的绘制状态，绘制状态指的是与绘制相关的绘制上下文的属性集合，而不是图像的状态。

查阅MDN，绘制状态所包含的属性，主要有以下这些：
- the current transformation matrix
- The current clipping region.
- The current dash list.
- The current values of the following attributes:
 - strokeStyle,
 - fillStyle,
 - globalAlpha, 
 - lineWidth,
 - lineCap,
 - lineJoin,
 - miterLimit, 
 - lineDashOffset,
 - shadowOffsetX,
 - shadowOffsetY,
 - shadowBlur,
 - shadowColor,
 - globalCompositeOperation,
 - font,
 - textAlign,
 - textBaseline, 
 - direction,
 - imageSmoothingEnabled.

知道有以上那些属性，就可以开始整花活了。