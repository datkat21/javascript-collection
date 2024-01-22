import winsys from "../lib/winsys.js";
import Html from "../lib/html.js";

const Win = winsys.data.win;

export default {
  run(Main) {
    console.log("Test App");

    function endTask() {
      x.close();
      Main.end();
    }
    Main.setEnd(endTask);

    let x = new Win({
      title: "Test app",
      onclose: endTask,
    });

    // Set up window switching
    Main.setMainWindow(x);

    const wrapper = Html.from(x.window).queryHtml(".win-content");

    wrapper.appendMany(
      new Html("p").text("Welcome to Lumen!"),
      new Html("button").text("Taskmanager").on("click", (e) => {
        Main.startApp("Taskmanager");
      }),
      new Html("button").text("Notepad").on("click", (e) => {
        Main.startApp("Notepad");
      }),
      new Html("button").text("Settings").on("click", (e) => {
        Main.startApp("Settings");
      }),
      new Html("button").text("Files").on("click", (e) => {
        Main.startApp("Files");
      }),
      new Html("button").text("Paint").on("click", (e) => {
        Main.startApp("Paint");
      })
    );

    return { exitCode: 0 };
  },
};
