/**
 * @author xieyanghao
 * @date 2020-2020/3/3-12:20 下午
 */
"use strict";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let test = document.getElementById("test");
let globalID;
let stars = [];

class Star{
    constructor(x, y, v, width) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.width = width;
    }

    fall(ctx, i){
        if (this.y - this.width > canvas.height) {
            stars.splice(i, 1);
            return;
        }
        ctx.save();
        ctx.fillStyle = "black";
        this.y += this.v;
        ctx.fillRect(this.x, this.y, this.width, this.width);
        ctx.restore();
    }

    clear(ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.width);
    }
}

function animation() {
    // exit condition
    if (stars.length ===0) {
        cancelAnimationFrame(globalID);
        globalID = undefined;
        btn.innerText = "开始播放";
        return;
    }
    // do something
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = stars.length - 1; i >= 0; i--) {
        stars[i].clear(ctx);
    }
    for (let i = stars.length - 1; i >= 0; i--) {
        stars[i].fall(ctx, i);
    }
    // star.fall(ctx);
    globalID = requestAnimationFrame(animation);
}

btn.addEventListener("click", function (ev) {
    if (stars.length === 0) {
        stars = Array.from({length: 150}, () => {
            let x = parseInt(Math.random() * 600);
            let y = parseInt(Math.random() * 100);
            let v = parseInt(Math.random() * 5 + 2);
            let w = parseInt(Math.random() * 20 + 5);
            return new Star(x, y, v, w, ctx);
        });
    }

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
    stars = Array.from({length: 150}, () => {
        let x = parseInt(Math.random() * 600);
        let y = parseInt(Math.random() * 100);
        let v = parseInt(Math.random() * 5 + 2);
        let w = parseInt(Math.random() * 30 + 15);
        return new Star(x, y, v, w, ctx);
    });
    while (stars.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // for (let i = stars.length - 1; i >= 0; i--) {
        //     stars[i].clear(ctx);
        // }
        for (let i = stars.length - 1; i >= 0; i--) {
            stars[i].fall(ctx, i);
        }
    }
    console.timeEnd("fall");
});