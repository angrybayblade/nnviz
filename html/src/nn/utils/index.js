let draw = {
    Circle: function (data = { x: 0, y: 0, r: 0, c: 0 }, ctx) {
        ctx.beginPath();
        ctx.arc(data.x, data.y, data.r, 0, Math.PI * 2, false);
        ctx.fillStyle = data.c;
        ctx.closePath();
        ctx.fill();
    },
    Rect: function (data = { x: 0, y: 0, w: 0, h: 0 }, ctx) {
        ctx.beginPath();
        ctx.rect(data.x, data.y, data.w, data.h);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#333333";
        ctx.closePath();
        ctx.stroke();
    },
    Line: function (data = { x0: 0, x1: 0, y0: 0, y1: 0, c: "rgba(255,255,255,0.1)", t: 0.1 }, ctx) {
        ctx.beginPath();
        ctx.moveTo(data.x0, data.y0);
        ctx.lineTo(data.x1, data.y1);
        ctx.lineWidth = data.t;
        ctx.strokeStyle = data.c;
        ctx.closePath();
        ctx.stroke();
    }
};

export {draw};