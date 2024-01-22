import { PopEffect } from "./MouseEffect.js";
import Html from "../html.js";

export default function MousePointer(props = { events: true }) {
  if (props.events !== true) return;

  const mp = new Html("div").styleJs({
    border: "0.15rem solid #ffffff",
    borderRadius: "50%",
    position: "fixed",
    top: "0",
    left: "0",
    transform: "translate(-50%,-50%)",
    width: "1rem",
    height: "1rem",
    transition: "width 0.15s var(--easing), height 0.15s var(--easing)",
    zIndex: "999999",
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  const middleDot = new Html("div").appendTo(mp).styleJs({
    border: "0.1rem solid #ffffff",
    borderRadius: "50%",
    // position: "fixed",
    // top: "0",
    // left: "0",
    // transform: "translate(-50%,-50%)",
    width: "0",
    height: "0",
    // transition: 'width 0.15s var(--easing), height 0.15s var(--easing)',
    // zIndex: '999999',
    // pointerEvents: 'none'
  });

  // Ignore right click
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // MP8-style off-screen pointer detection
  window.addEventListener("mouseout", (e) => {
    mp.classOn("off-screen");
  });
  window.addEventListener("mouseover", (e) => {
    mp.classOff("off-screen");
  });

  // let mpSize

  window.addEventListener("mousemove", (e) => {
    mp.styleJs({
      top: e.clientY + "px",
      left: e.clientX + "px",
      // transform: `translate(${e.clientX}px, ${e.clientY}px)`,
    });
  });
  window.addEventListener("mousedown", (e) => {
    mp.styleJs({
      width: "0rem",
      height: "0rem",
    });

    window.onbeforeunload = function (e) {
      e.preventDefault();
      return false;
    };
  });
  window.addEventListener("mouseup", (e) => {
    mp.styleJs({
      width: "1rem",
      height: "1rem",
    });
    PopEffect(e.clientX + "px", e.clientY + "px", e.button);
  });

  return mp;
}
