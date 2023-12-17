import Vfs from "../lib/vfs.js";
import winsys from "../lib/winsys.js";
import Html from "../lib/html.js";
import Canvas from "../lib/canvaslib.js";
import Modal from "../lib/modal.js";

const Win = winsys.data.win;

export default {
  run(Main) {
    function endTask() {
      Main.end();
      x.close();
    }
    Main.setEnd(endTask);

    let resizeCanvas;

    let x = new Win({
      title: "Paint",
      width: 540,
      height: 420,
      onclose: endTask,
    });

    // Set up window switching
    Main.setMainWindow(x);

    const wrapper = Html.from(x.window)
      .queryHtml(".win-content")
      .classOn("no-pad", "ovn");

    // Use wrapper from here.
    // Good luck in making your own apps!
    const c = new Canvas();

    let brushes = [
      {
        name: "Pencil",
        xOffset: 0,
        yOffset: 0,
        width: 1,
        height: 1,
      },
      {
        name: "Brush",
        xOffset: -3,
        yOffset: -3,
        width: 6,
        height: 6,
      },
      {
        name: "Eraser",
        xOffset: -3,
        yOffset: -3,
        width: 6,
        height: 6,
        color: "black",
      },
      {
        name: "Large Eraser",
        xOffset: -24,
        yOffset: -24,
        width: 48,
        height: 48,
        color: "black",
      },
    ];

    let currentBrush = brushes[0];

    let toolbar = new Html("div").class("flex-group").appendTo(wrapper);

    let brushSelector = new Html("select")
      .appendMany(
        ...brushes.map((b, id) => {
          return new Html("option").attr({ value: id }).text(b.name);
        })
      )
      .appendTo(toolbar)
      .on("change", (e) => {
        currentBrush = brushes[Number(e.target.value)];
      });

    let saveImgBtn = new Html("button")
      .text("Save image")
      .on("click", async (e) => {
        let result = await Modal.input(
          "Save file",
          "Save to where? (Use Files app to find a location, use action 'Copy path' on the folder.)",
          "Root",
          wrapper
        );
        if (result === false) return;
        let path = result;
        const url = c.canvas.elm.toDataURL();
        Vfs.writeFile(path, url);
        console.log("Saved to", path);
      }).appendTo(toolbar);

    c.canvas.appendTo(wrapper);

    c.canvas.elm.style.background = "black";

    // function convertBrush(x, y) {
    //   return {
    //     x: x + currentBrush.xOffset,
    //     y: y + currentBrush.yOffset,
    //     w: currentBrush.width,
    //     h: currentBrush.height,
    //   };
    // }

    let isMDown = false;

    const draw = (e) => {
      if (!isMDown) {
        return;
      }

      c.ctx.strokeStyle = currentBrush.color || "#ffffff";
      c.ctx.lineWidth = currentBrush.width;
      c.ctx.lineCap = "round";

      c.ctx.lineTo(e.offsetX, e.offsetY);
      c.ctx.stroke();
    };

    c.canvas.on("mousedown", (e) => {
      isMDown = true;
      draw(e);
      // c.paint(convertBrush(e.offsetX, e.offsetY), "#ffffff");
    });
    c.canvas.on("mouseup", (e) => {
      isMDown = false;
      c.ctx.stroke();
      c.ctx.beginPath();
    });
    c.canvas.on("mousemove", draw);

    resizeCanvas = () => {
      c.resize(wrapper.elm.offsetWidth, wrapper.elm.offsetHeight);
    };

    x.options.onresize = resizeCanvas;

    // Rerender canvas on first frame
    requestAnimationFrame(() => {
      resizeCanvas();
    });

    // Example:
    // Paint a :)

    // // Eyes
    // c.paint({ x: 1, y: 0, w: 1, h: 4 }, '#ffffff');
    // c.paint({ x: 5, y: 0, w: 1, h: 4 }, '#ffffff');

    // // Mouth
    // c.paint({ x: 1, y: 5, w: 1, h: 1 }, '#ffffff');
    // c.paint({ x: 2, y: 6, w: 4, h: 1 }, '#ffffff');
    // c.paint({ x: 6, y: 5, w: 1, h: 1 }, '#ffffff');

    return { exitCode: 0 };
  },
};
