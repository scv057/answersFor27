# 一个物体在canvas上逐步下落，怎样才能避免整画布重绘？

### 简单形状，简单背景
这道题初看非常简单，就是实现一个物体下坠，同时要保证不整个画布重绘。那我把物体的上一步位置记录下来，然后每次清除上一次的状态。

```javascript
// 大概是下面这个样子
class Box { 
    constructor(){}
    init(){}
    fall(){}
    clearPre(){}
    draw(){}
}
```

### 复杂形状
这看起来非常容易，让我们尝试让事情变得稍微复杂一点。如果，这个物体是个不规则形状的物体，应该如何避免整个画布的重绘。
这里我采用了两种方法去解决这个问题，一种是 原路径重绘，第二种是记录不规则形状的左上角与右下角，通过计算，变成一个小矩形的重绘，通过测试可以看出来，第二种效率更高一些。大概高了0.02~0.03毫秒之间。不过主要消耗都在计算上面，不涉及到重绘，但是还是提供了一些价值，画多条路径不如整块重绘。

### 复杂背景
再进一步，目前我们都是在简单，单调背景下进行，如果背景是个复杂图案呢？我们应该怎么做？
先给出一般方法：
```javascript
/**
 * @description 将图像复原为之前的状态，储存接下来的背景，画上物体。
 */
function fall(){
    if (y >canvas.height) y = -20;
    ctx.putImageData(pre, 240, y);
    y += 1;
    pre = ctx.getImageData(240, y, 20, 20);
    ctx.fillRect(240, y, 20, 20);
}
```
那么有没有更聪明的方法呢？我想是有的，我们直接把绘制的物体和背景分离，使其下坠，在最后如果有需要的画再将齐合成。
测了一下运行时间。
从对比的结果来看，循环10000次，两种方法都还是很快，不过差了一个数量级，简单背景下循环10000次0.05到0.09毫秒之间，复杂背景下要0.5~0.8ms之间，可见getImageData还是比价消耗计算的。

### 多数量
最后，如果我们同时有多个物体一起下落呢？
```javascript
    stars = Array.from({length: 150}, () => {
        let x = parseInt(Math.random() * 600);
        let y = parseInt(Math.random() * 100);
        let v = parseInt(Math.random() * 5 + 2);
        let w = parseInt(Math.random() * 30 + 15);
        return new Star(x, y, v, w, ctx);
    });
    
    // 清除整块画布，然后进行单个的重绘
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 单个进行上一个位置的清除
    for (let i = stars.length - 1; i >= 0; i--) {
        stars[i].clear(ctx);
    }
    // 重绘
    for (let i = stars.length - 1; i >= 0; i--) {
        stars[i].fall(ctx, i);
    }
```
最终测试对比两种，发现效率上也相差不大，如果局部重绘块增多的画，全局重绘效果更好一点。

综上，对于不同的情况，应该选择对应的解决方案，以达到性能优化的目的。