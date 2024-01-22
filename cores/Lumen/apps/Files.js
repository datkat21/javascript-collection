import winsys from "../lib/winsys.js";
import Html from "../lib/html.js";
import Vfs from "../lib/vfs.js";
import ContextMenu from "../lib/ctxmenu.js";
import Filetypes from "../lib/filetypes.js";
import Modal from "../lib/modal.js";

const Win = winsys.data.win;

export default {
  run(Main) {
    console.log("Files");

    function endTask() {
      x.close();
      Main.end();
    }
    Main.setEnd(endTask);

    let x = new Win({
      title: "Files",
      onclose: endTask,
    });
    
    // Set up window switching
    Main.setMainWindow(x);

    const wrapper = Html.from(x.window).queryHtml(".win-content");
    const title = Html.from(x.window).queryHtml(".win-titlebar .title");

    wrapper.classOn("no-pad");

    let filesTable = new Html("table").class("w-100").appendTo(wrapper);

    let filesTableHead = new Html("thead")
      .appendTo(filesTable)
      .append(
        new Html("tr").appendMany(
          new Html("th").text("File").class("w-100"),
          new Html("th").text("Kind")
        )
      );

    let filesTableBody = new Html("tbody").appendTo(filesTable);

    Vfs.importFS();

    let currentPath = "Root";
    // let selectedItem = "";

    function renderFileList() {
      updateTitle();
      filesTableBody.clear();
      // for (let i = 0; i < C.app.list.size; i++) {
      if (currentPath !== "Root") {
        addFileRow({ item: "..", type: "dir", special: true });
      }
      for (const file of Vfs.list(currentPath)) {
        // console.log(file);
        addFileRow(file);
      }
    }

    function changeDirectory(file, reRender = true) {
      if (file.item === ".." && file.special === true) {
        // If the special .. is clicked, go back
        let path = currentPath.split("/");
        path.pop();
        currentPath = path.join("/");
      } else {
        currentPath += `/${file.item}`;
      }
      reRender && renderFileList();
    }

    function addFileRow(file = { item: "", type: "", special: false }) {
      const fileInfo = Filetypes.fileInfo(file.item, file.type);

      filesTableBody.append(
        new Html("tr").appendMany(
          new Html("td").class("w-100").appendMany(
            new Html("a")
              .class("w-100", "block")
              .text(file.item)
              .append(
                new Html("span")
                  .class("translucent")
                  .text(file.type === "dir" ? "/" : "")
              )
              .on("contextmenu", (e) => {
                e.preventDefault();
                ContextMenu.new(e.clientX, e.clientY, [
                  {
                    item: "Open",
                    select() {
                      selectFile(file);
                    },
                  },
                  {
                    item: "Copy path",
                    select() {
                      let x = new Html("textarea").val(
                        currentPath + "/" + file.item
                      );
                      if (file.item === ".." && file.special === true) {
                        let y = currentPath.split("/");
                        y.pop();
                        x.val(y.join("/"));
                      }
                      // Select the text field
                      x.elm.select();
                      x.elm.setSelectionRange(0, 99999); // For mobile devices

                      // Copy the text inside the text field
                      navigator.clipboard.writeText(x.getValue());
                    },
                  },
                  {
                    item: "Rename",
                    select() {
                      const result = prompt(
                        `Rename ${file.item} to...`,
                        file.item
                      );
                      console.log(result);
                    },
                  },
                  {
                    item: "Delete",
                    select() {
                      console.log(
                        "File to be delete",
                        `${currentPath}/${file.item}`
                      );
                    },
                  },
                ]);
              })
              .on("click", (e) => {
                selectFile(file);
              })
          ),
          new Html("td").text(
            fileInfo !== undefined ? fileInfo.name : Filetypes.generic.name
          )
        )
      );
    }

    function updateTitle() {
      title.text("Files - " + currentPath);
    }

    async function selectFile(file) {
      if (file.type === "dir") {
        // Open folder
        changeDirectory(file);
      } else {
        // Open file
        // Todo...
        const fileInfo = Filetypes.fileInfo(file.item);

        if (fileInfo !== undefined) {
          console.log(fileInfo);

          if (fileInfo.opensWith) {
            Main.startApp(fileInfo.opensWith, {
              file: currentPath + "/" + file.item,
            });
          }
        } else {
          // Attempt to open in notepad
          let result = await Modal.prompt(
            "Open file",
            "This file does not have an app associated.\nWould you like to try with Notepad?",
            document.body
          );
          if (result === true) {
            Main.startApp("Notepad", {
              file: currentPath + "/" + file.item,
            });
          }
          // alert("unknown file type");
        }
      }
    }

    renderFileList();

    document.addEventListener("lumen.vfs-refresh", renderFileList);

    return { exitCode: 0 };
  },
};
