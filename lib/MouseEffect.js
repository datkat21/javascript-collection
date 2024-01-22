import Html from "./html.js";

let colors = ["#ffffff", "#0baced", "#fa0bed", "#d0b030", "#0bdb30"];

export function PopEffect(posX, posY, color) {
  new Html("div")
    .styleJs({
      backgroundColor: colors[color],
      position: "absolute",
      top: posY,
      left: posX,
      transform: "translate(-50%, -50%)",
      animation: "pop 0.5s linear",
      borderRadius: "50%",
      pointerEvents: "none",
    })
    .on("animationend", (e) => {
      e.target.remove();
    })
    .appendTo("body");
}

export function HighlightEffect(elm, color = 0, mp = undefined, stacks = 1) {
  elm.styleJs({ overflow: "hidden" });

  let stack = [];

  for (let i = 0; i < stacks; i++) {
    const element = new Html("div")
      .styleJs({
        backgroundColor: colors[color],
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0,
        width: "48px",
        height: "48px",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        transition: "opacity 0.25s var(--easing)",
        pointerEvents: "none",
        filter: "blur(3.5rem)",
      })
      .appendTo(elm);
    stack.push(element);
  }
  // Perform acrylic effect
  elm.on("mousemove", (e) => {
    stack.forEach((stk) =>
      stk.styleJs({ top: e.clientY + "px", left: e.clientX + "px" })
    );
  });
  elm.on("mouseover", (e) => {
    stack.forEach((stk) => stk.styleJs({ opacity: 1 }));

    if (mp !== undefined) {
      mp.classOn("closed");
    }
  });
  elm.on("mouseleave", (e) => {
    stack.forEach((stk) => stk.styleJs({ opacity: 0 }));

    if (mp !== undefined) {
      mp.classOff("closed");
    }
  });
}
