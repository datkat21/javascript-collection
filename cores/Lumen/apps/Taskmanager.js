import winsys from "../lib/winsys.js";
import Html from "../lib/html.js";
import modal from "../lib/modal.js";

const Win = winsys.data.win;

export default {
  run(Main) {
    console.log("Taskmanager");

    let intervalTimer = 0;

    function endTask() {
      Main.end();
      x.close();
      clearInterval(intervalTimer);
    }
    Main.setEnd(endTask);

    let x = new Win({
      title: "Taskmanager",
      onclose: endTask,
    });

    // Set up window switching
    Main.setMainWindow(x);

    const wrapper = Html.from(x.window)
      .queryHtml(".win-content")
      .classOn("no-pad", "col");

    const tableWrapper = new Html("div").class("fg", "ovh").appendTo(wrapper);

    let taskListDiv = new Html("table").classOn("w-100").appendTo(tableWrapper);

    let taskLaunchDiv = new Html("div")
      .classOn("row", "gap", "fs0", "container")
      .appendTo(wrapper);

    let taskLaunchInput = new Html("input").attr({
      type: "text",
      placeholder: "App name",
    });
    let taskLaunchButton = new Html("button")
      .text("Launch")
      .on("click", (e) => {
        Main.startApp(taskLaunchInput.getValue());
      });

    taskLaunchDiv.appendMany(taskLaunchInput, taskLaunchButton);

    taskListDiv.appendMany(
      new Html("thead").appendMany(
        new Html("tr").appendMany(
          new Html("th").text("Application name"),
          new Html("th").text("Manage")
        )
      ),
      new Html("tbody").appendMany()
    );

    const tableRow = taskListDiv.queryHtml("tbody");

    function renderTaskList() {
      tableRow.clear();
      // for (let i = 0; i < C.app.list.size; i++) {
      for (const app of Main.appList.values()) {
        // console.log(app);
        let entry = tableRow.append(
          new Html("tr").appendMany(
            new Html("td").text(app.name),
            new Html("td").appendMany(
              new Html("button").text("End").on("click", (e) => {
                if (app.end !== null) app.end();
                else
                  modal.alert(
                    "Error",
                    "This app does not support remote termination :(",
                    wrapper
                  );
              })
            )
          )
        );
      }
    }

    renderTaskList();

    intervalTimer = setInterval(renderTaskList, 1000);

    return { exitCode: 0 };
  },
};
