import winsys from "../lib/winsys.js";
import Html from "../lib/html.js";

const Win = winsys.data.win;

export default {
  run(Main) {
    function endTask() {
      Main.end();
    }

    let x = new Win({
      title: "My app",
      onclose: endTask,
    });

    const wrapper = Html.from(x.window).queryHtml(".win-content");

    // Use wrapper from here.
    // Good luck in making your own apps!

    return { exitCode: 0 };
  },
};
