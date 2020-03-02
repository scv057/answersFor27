# 事件

在200\*200的画布上实现一个动画，初始状态为中心点一个黑色小圆点(10\*10)，1秒动画扩张原点并占满整个画布。要求：
  a. 使用至少2种方案(即不同的核心知识点)完成扩张的效果
  b. 扩张的贝塞尔曲线入参可以由用户输入


忽略某些限定条件，简化一下问题，问题就变成了，实现一个10\*10的圆，扩散的动画。

```javascript
// 不断的调整r就行
function draw(ctx,r) {
    ctx.clearRect(0, 0, 200, 200);
    ctx.beginPath();
    ctx.arc(100, 100, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}
```

让我们把条件，逐步加进去。事情就变得复杂了，我们最终要实现的是一个类似于，CSS-animation类似的函数。

```javascript
/**
 * @description 自定义动画
 * @param keyframes 绘制关键帧，该问题下为r=10与r=145这两帧
 * @param duration  动画时长
 * @param timingFunc  相对时间，模拟运动状态的拟合函数
 */
function animation(keyframes, duration, timingFunc) {}
```

这里有一个很重要的一部分就是timing-function，已知，CSS中可以以贝塞尔曲线来描述动画的缓动计算，那么贝塞尔曲线是什么呢？他在动画中又有什么物理意义。

### 贝塞尔曲线

贝塞尔曲线（Bezier curve）是计算机图形学中相当重要的参数曲线，它通过一个方程来描述一条曲线，根据方程的最高阶数，又分为线性贝赛尔曲线，二次贝塞尔曲线、三次贝塞尔曲线和更高阶的贝塞尔曲线。他的特点就是顺滑，soft。

这里直接给出相对应的公式:
$$ {一次贝塞尔曲线}
B(t) = (1 - t) * P0 + t * P1,t∈[0,1]
$$

$$
B(t) = (1-t)^2 * P0 + 2t(1-t) * P1 + t^2 * P2,t∈[0,1]
$$

$$
B(t) = (1 - t)^3 * P0 + 3t(1-t)^2 * P1 + 3t^2(1-t) * P2 + t^3 * P3,t∈[0,1]
$$

[参考](https://github.com/hujiulong/blog/issues/1)

参考这个网站[贝塞尔曲线生成](https://cubic-bezier.com/)，很直观的我们可以理解，在动画里，贝塞尔曲线起到的是在相对时间内，描述物体相对应的运动进度。

这里的参数t，并非真正的时间而是一个点(x,y),这里的x轴才代表时间。

![example](https://91happy.oss-cn-shenzhen.aliyuncs.com/imgs/1583122696037.jpg)

这样我们就得把贝塞尔公式转化为
$$
p = f(t),t∈[0,1]
$$
的形式，这里t为时间，p为进度。

查阅了资料,由牛顿积分可以得到

```javascript
export default function generate(p1x, p1y, p2x, p2y) {
    const ZERO_LIMIT = 1e-6;
    const ax = 3 * p1x - 3 * p2x + 1;
    const bx = 3 * p2x - 6 * p1x;
    const cx = 3 * p1x;

    const ay = 3 * p1y - 3 * p2y + 1;
    const by = 3 * p2y - 6 * p1y;
    const cy = 3 * p1y;

    function sampleCurveDerivativeX(t) {
        return (3 * ax * t + 2 * bx) * t + cx;
    }

    function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx) * t;
    }

    function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
    }

    function solveCurveX(x) {
        var t2 = x;
        var derivative;
        var x2;
// https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation // First try a few iterations of Newton's method -- normally very fast.
// http://en.wikipedia.org/wiki/Newton's_method
        for (let i = 0; i < 8; i++) {
// f(t)-x=0
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            derivative = sampleCurveDerivativeX(t2); // == 0, failure
            /* istanbul ignore if */
            if (Math.abs(derivative) < ZERO_LIMIT) {
                break;
            }
            t2 -= x2 / derivative;
        }
// Fall back to the bisection method for reliability. // bisection
// http://en.wikipedia.org/wiki/Bisection_method
        var t1 = 1;
        /* istanbul ignore next */
        var t0 = 0;
        /* istanbul ignore next */
        t2 = x;
        /* istanbul ignore next */
        while (t1 > t0) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            if (x2 > 0) {
                t1 = t2;
            } else {
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
// Failure
            return t2;
        }

    }
    
    function solve(x) {
        return sampleCurveY(solveCurveX(x));
    }

    return solve;
}
```

这样我们就能完成 *p = f(t),t∈[0,1]* 的转换

易知，很多效果都是，调整control-point值得到的，是贝塞尔曲线的特殊形式。通用形式如下

```javascript
/**
 * @description start=[0,0],end=[1,1]
 * @param keyframes
 * @param duration
 * @param cp1 控制点1 cp1[0]∈[0,1]
 * @param cp2 控制点2 cp2[0]∈[0,1]
 */
function animation(keyframes, duration, cp1, cp2){}
```

只要我们往里面传控制点就可以达到设置过度效果了。

全部代码放在[这里](https://github.com/laoxielearnsth/answersFor27/blob/master/Q4/index.html)。

todo
1. 丰富多种类的keyframes
2. 内置一些常用的 timing-function模型
3. 添加 delay 参数
4. 添加 iteration-count 参数