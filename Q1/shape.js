/**
 * @author xieyanghao
 * @date 2020-2020/3/3-11:57 上午
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
        this.count = 10000;
        this.width = width;
        this.init(ctx);
    }

    init(ctx){
        // ctx.fillRect(this.x, 0, this.width, this.width);
        this.draw(ctx);
    }

    fall(ctx){
        if (this.count <=0) {
            this.count = 1000000;
            return;
        } else {
            this.count--;
        }

        // 原路径重绘
        // ctx.save();
        // ctx.fillStyle = "white";
        // this.draw(ctx);
        // ctx.fill();
        // ctx.restore();
        // 记录左上角，右下角，小范围重绘
        ctx.clearRect(this.x-35, this.y, 70, 25);
        this.y += this.v;
        this.draw(ctx);
        ctx.fill();
        // ctx.fillRect(this.x, this.y, this.width, this.width);
    }

    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x+20, this.y);
        ctx.lineTo(this.x+35, this.y+10);
        ctx.lineTo(this.x+20, this.y+25);
        ctx.lineTo(this.x-35, this.y + 10);
        ctx.closePath();
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

test.addEventListener("click", function () {
    console.time("fall");
    star.fall(ctx);
    console.timeEnd("fall");
});