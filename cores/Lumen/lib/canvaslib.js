import Html from "./html.js";

export default class Canvas {
  canvas;
  ctx;
  paint;
  resize;
  constructor(width = 150, height = 150) {
    // Create the canvas and initialize it
    this.canvas = new Html("canvas").attr({ width, height });

    // Grab context
    this.ctx = this.canvas.elm.getContext("2d");

    this.paint = function (
      pos = { x: 0, y: 0, w: 1, h: 1 },
      color = "rgb(0, 0, 0)"
    ) {
      // this.ctx.fillStyle = color;
      // this.ctx.fillRect(pos.x, pos.y, pos.w, pos.h);

      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = pos.w;
      this.ctx.lineCap = 'round';
  
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    };

    this.resize = function(w, h) {
      this.canvas.elm.width = w;
      this.canvas.elm.height = h;
    }
  }
}
