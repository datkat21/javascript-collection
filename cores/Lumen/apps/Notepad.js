import Vfs from "../lib/vfs.js";
import Html from "../lib/html.js";
import winsys from "../lib/winsys.js";
import ctxMenu from "../lib/ctxmenu.js";
import Modal from "../lib/modal.js";

const Win = winsys.data.win;

export default {
  async run(Main) {
    let wrapper;
    let NpWindow;

    function onEnd() {
      NpWindow.close();
      Main.end();
    }
    async function checkEnd() {
      if (currentDocument.dirty === true) {
        let result = await Modal.prompt(
          "Warning",
          "You have unsaved changes, are you sure you want to exit?",
          wrapper
        );
        if (result !== true) {
          return false;
        }
      }
      onEnd();
    }
    Main.setEnd(onEnd);

    NpWindow = new Win({
      title: "Notepad",
      content: "",
      width: 340,
      height: 230,
      onclose: checkEnd
    });

    wrapper = NpWindow.window.querySelector(".win-content");

    wrapper.classList.add("row", "o-h", "h-100", "no-pad");

    let currentDocument = {
      path: "",
      dirty: false,
    };

    const updateTitle = (_) =>
      (NpWindow.window.querySelector(".win-titlebar .title").innerText = `${
        currentDocument.dirty === true ? "•" : ""
      } Notepad - ${
        currentDocument.path === ""
          ? "Untitled"
          : currentDocument.path.split("/").pop()
      }`.trim());

    function newDocument(path, content) {
      currentDocument.path = path;
      currentDocument.dirty = false;
      updateTitle();
      // just to be sure (instead of using .text() as that was sometimes not working)
      text.elm.textContent = content;
      text.elm.scrollTop = 0;
    }

    // FileDialog.pickFile and FileDialog.saveFile both take path as an argument and are async
    async function openFile() {
      let file = // await FileDialog.pickFile(
        await Modal.input(
          "Open file",
          "Which file to open? (Use Files app if you can't locate it.)",
          Vfs.getParentFolder(currentDocument.path) || "Root",
          wrapper
        );
      if (file === false) return;
      const type = Vfs.whatIs(file);
      if (type === "dir")
        return await Modal.alert("Error", "Cannot open a directory!", wrapper);
      let content = Vfs.readFile(file);
      newDocument(file, content);
      NpWindow.focus();
    }
    async function saveFile() {
      // make sure the path is not unreasonable
      if (currentDocument.path === "") {
        return saveAs();
      }
      Vfs.writeFile(currentDocument.path, text.elm.value);
      currentDocument.dirty = false;
      console.log("Saved to", currentDocument.path);
      updateTitle();
    }
    async function saveAs() {
      let result = // await FileDialog.saveFile(
        await Modal.input(
          "Save file",
          "Save to where? (Use Files app to find a location.)",
          Vfs.getParentFolder(currentDocument.path) || "Root",
          wrapper
        );
      if (result === false) return false;
      currentDocument.path = result;
      currentDocument.dirty = false;
      Vfs.writeFile(currentDocument.path, text.elm.value);
      console.log("Saved to", currentDocument.path);
      updateTitle();
    }

    async function dirtyCheck() {
      if (currentDocument.dirty === true) {
        let result = await Modal.prompt(
          "Warning",
          "You have unsaved changes, are you sure you want to exit?",
          wrapper
        );
        if (result !== true) {
          return false;
        }
      }
      return true;
    }

    Vfs.importFS();

    let text = new Html("textarea")
      .class("transparent", "container")
      .styleJs({ resize: "none", width: "100%" })
      .text("")
      .attr({ placeholder: "Enter text, or right click for actions" })
      .appendTo(wrapper);

    text.on("contextmenu", (e) => {
      e.preventDefault();
      ctxMenu.new(e.clientX, e.clientY, [
        {
          select: async (_) => {
            // clicking the new document button seems buggy, possibly due to dirty check
            const result = await dirtyCheck();
            if (result === false) return;
            newDocument("", "");
          },
          item: "New",
        },
        {
          select: async (_) => {
            const result = await dirtyCheck();
            if (result === false) return;
            openFile();
          },
          item: "Open...",
        },
        {
          select: async (_) => {
            await saveFile();
          },
          item: "Save",
        },
        {
          select: async (_) => {
            await saveAs();
          },
          item: "Save as...",
        },
        {
          style: {
            "margin-top": "auto",
          },
          select: (_) => {
            checkEnd();
          },
          item: "Close",
        },
      ]);
    });

    text.on("input", (e) => {
      currentDocument.dirty = true;
      updateTitle();
    });

    // return Main.Lib.setupReturns(onEnd, (m) => {
    //     if (typeof m === "object" && m.type && m.type === "loadFile" && m.path) {
    //         newDocument(m.path, vfs.readFile(m.path));
    //     }
    // });

    if (
      Main.params !== null &&
      typeof Main.params === "object" &&
      Main.params.file !== undefined
    ) {
      newDocument(Main.params.file, Vfs.readFile(Main.params.file));
    }

    return { exitCode: 0 };
  },
};
