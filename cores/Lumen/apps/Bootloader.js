import Settings from "./Settings.js";
import Html from "../lib/html.js";
import ctxmenu from "../lib/ctxmenu.js";

export default {
  run(Main) {
    console.log("blr");

    Main.startApp("TestApp");

    Settings.prepareDesktop();

    // Handle alt-tab (or in this case Backtick-tab)
    let tabcontainer = new Html("div")
      .styleJs({
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
        pointerEvents: "none",
      })
      .appendTo("body");
    let isTabDown = false;
    let isBktDown = false;
    let ctxMenus = [];
    let index = 0;
    let lastSelectedWindow = 0;
    // ` + Tab handler
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;

      if (e.key === "Tab") {
        isTabDown = true;
        e.preventDefault();
      }
      if (e.key === "`") isBktDown = true;

      if (isTabDown && isBktDown) {
        // Show menu
        if (ctxMenus[0] === undefined) {
          let array = Array.from(Main.appList.values()).map((app) => {
            if (app.activeWindow === undefined) return null;
            return { item: app.name, select: (_) => {} };
          });
          ctxMenus.push(
            ctxmenu.new(0, 0, [...array], "Open Windows", tabcontainer, false)
          );
          index = lastSelectedWindow;
          if (array.length > index) index = 0;
          ctxMenus[0].elm.children[1]?.classList.add("over");
        } else {
          let c = Array.from(ctxMenus[0].elm.children);
          let length = c.length - 1;
          index++;
          if (index > length - 1) {
            index = 0;
          }
          c.forEach((e, i) => {
            let x = Html.from(e);
            x.classOff("over");
            if (i - 1 === index) x.classOn("over");
          });
          // console.log(index);
        }
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.repeat) return;

      if (e.key === "Tab") isTabDown = false;
      if (e.key === "`") isBktDown = false;

      if (isBktDown === false && isTabDown === false) {
        let c = Array.from(Main.appList.values())
          .map((app) => {
            if (app.activeWindow === undefined) return null;
            return app.activeWindow;
          })
          .filter((n) => n !== null);

        lastSelectedWindow = index;

        c[index].focus();

        ctxMenus.forEach((ctxMenu, i) => {
          ctxMenu.cleanup();
          ctxMenus.splice(i, 1);
        });
      }
    });

    return { exitCode: 0 };
  },
};
