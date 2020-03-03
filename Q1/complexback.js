/**
 * @author xieyanghao
 * @date 2020-2020/3/3-11:15 上午
 */
"use strict";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let test = document.getElementById("test");
let globalID;
let img = new Image();
img.src = "https://91happy.oss-cn-shenzhen.aliyuncs.com/imgs/avatar.jpg";
img.crossOrigin = "*";


class Star {
    constructor(x, y, v, width, ctx) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.count = 10000;
        this.width = width;
        this.pre = null;
        this.init(ctx);
    }

    init(ctx) {
        ctx.drawImage(img, 0, 0);
        this.pre = ctx.getImageData(this.x, this.y, this.width, this.width);
        ctx.fillRect(this.x, 0, this.width, this.width);
    }

    fall(ctx) {
        if (this.count <=0) {
            this.count = 10000000;
            return;
        } else {
            this.count--;
        }
        ctx.putImageData(this.pre, this.x, this.y);
        this.y = (this.y + this.v) % 600;
        this.pre = ctx.getImageData(this.x, this.y, this.width, this.width);
        ctx.fillRect(this.x, this.y, this.width, this.width);
    }
}

img.onload = function(){
    let star = new Star(250, 0, 5, 100, ctx);

    function animation() {
        // exit condition

        // do something
        star.fall(ctx);
        globalID = requestAnimationFrame(animation);
    }

    btn.addEventListener("click", function (ev) {
        if (globalID) {
            cancelAnimationFrame(globalID);
            globalID = undefined;
            ev.target.innerText = "开始播放";
        } else {
            globalID = requestAnimationFrame(animation);
            ev.target.innerText = "暂停";
        }
    });

    test.addEventListener("click", function () {
        console.time("fall");
        star.fall(ctx);
        console.timeEnd("fall");
    });
};
