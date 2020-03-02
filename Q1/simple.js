/**
 * @author xieyanghao
 * @date 2020-2020/2/29-11:58 上午
 * @description 物体在canvas下面下落，如何避免全局重绘的简单情况，如果形状已知
 */
"use strict";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let globalID;

class Star{
    constructor(x, y, v, width, ctx) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.width = width;
        this.init(ctx);
    }

    init(ctx){
        ctx.fillRect(this.x, 0, this.width, this.width);
    }

    fall(ctx){
        ctx.clearRect(this.x, this.y, this.width, this.width);
        ctx.save();
        ctx.fillStyle = "black";
        this.y += this.v;
        ctx.fillRect(this.x, this.y, this.width, this.width);
        ctx.restore();
    }
}

let star = new Star(250, 0, 5, 100, ctx);

function animation() {
    // exit condition
    if (star.y >= 600) {
        globalID = undefined;
        btn.innerText = "开始播放";
        star.y = 0;
        return;
    }
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