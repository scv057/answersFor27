# save和restore有哪些常见的用法？

在写save和restore有哪些用法之前，先搞清楚，他们是干什么的。刚接触canvas的时候，发现了这个方法，以为牛逼啊，这样实现撤销就简单了，后来发现没用，仔细阅读了一下文档，他这里的状态管理，指的是canvas的绘制状态，绘制状态指的是与绘制相关的绘制上下文的属性集合，而不是图像的状态。
为什么使用绘制状态栈来管理，我想原因有以下几点：
1. 涉及多个属性，使用绘制栈方便管理。
2. 剪裁区域只能通过绘制栈进行恢复。
3. 对于一些特殊的状态，想要恢复属性需要进行复杂的计算，不容易手动计算。

查阅MDN，绘制状态所包含的属性，主要有以下这些：
- the current transformation matrix
- The current clipping region
- The current dash list
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

### transformation matrix
第一大类矩阵转变，在这一块，利用好save，与restore，可以方便的实现翻转，旋转，平移，缩放，变形等操作。这大致就属于上面第三类，不容易计算那种。
```javascript
// 你画一个歪了的icon
ctx.save();
ctx.translate(x+width/2,y+height/2);
ctx.rotate(angle*Math.PI/180);
ctx.drawImage(img,-width/2,-height/2,width,height);

//此时你想画一个正常位置的icon,通过坐标系计算恢复有点麻烦，restore一下。
ctx.restore();
ctx.drawImage(img,-width/2,-height/2,width,height);
```


### clipping region
canvas中有一个功能是裁剪，通过裁剪功能，可以实现裁剪区域。裁剪区域是canvas中由路径（可以称之为裁剪路径）所定义的一块区域，所有的绘图操作都限制在本区域内,区域之外的绘制效果会被忽略。默认情况下，可以认为剪辑区域就是canvas的整个绘图表面。除非你创建路径并调用clip()函数来显式的设定剪辑区域，否则默认的剪辑区域不会影响canvas中所绘制的内容。一旦设置了剪辑区域，在canvas中绘制的所有内容都将局限在剪辑区域内，这也意味着在剪辑区域以外进行绘制是没有任何效果的。
```javascript
    ctx.fillStyle = "black";
    ctx.fillRect(400, 400, 100, 100);
    ctx.rect(420, 420, 50, 50);
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "white";
    ctx.fillRect(400, 400, 100, 100);
    ctx.restore();
    ctx.lineWidth = 10;
    ctx.moveTo(400, 400);
    ctx.lineTo(500, 500);
    ctx.stroke();
```


### attributes
对属性值的保存是最常用的情况，比如你想画一个层叠的卡片，但为了区分度，每个卡片的样式不太一样，包括，背景颜色，阴影字体什么的。这时候通过restore可以快速的复原前面一个状态。不用将多个属性重新修改一遍。
```javascript
ctx.fillStyle = "#FA6900";
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
ctx.shadowBlur = 4;
ctx.shadowColor = "rgba(204,204,204,0.5";
ctx.fillRect(10,10,300,50);

ctx.save();
ctx.fillStyle = "#E0E4CD";
ctx.shadowOffsetX = 10;
ctx.shadowOffsetY = 10;
ctx.shadowBlur = 4;
ctx.shadowColor = "rgba(204,204,204,0.5";
ctx.fillRect(40,40,300,50);
ctx.restore();
```
