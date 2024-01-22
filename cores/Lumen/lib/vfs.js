let templateFsLayout = {
  Root: {
    Lumen: {
      logs: {
        "README.md": "This folder stores logs for each Lumen session.",
      },
      config: {
        "settings.json": JSON.stringify({
          // wallpaper: "/assets/Wallpaper.png",
          // theme: "dark",
        }),
      },
    },
    Workspace: {
      Notes: {},
      Documents: {},
    },
  },
};

const Vfs = {
  // The file system is represented as a nested object, where each key is a folder or file name
  // and the value is either a string (for file contents) or another object (for a subfolder)
  fileSystem: {},
  save(reason = "generic save") {
    localStorage.setItem("fs", JSON.stringify(this.fileSystem));
    this.fileSystem = JSON.parse(localStorage.getItem("fs"));

    // Lumen-specific Global VFS Events
    document.dispatchEvent(new CustomEvent("lumen.vfs-refresh"), {
      detail: { reason },
    });
  },
  importFS(fsObject = templateFsLayout) {
    if (!localStorage.getItem("fs") && fsObject === templateFsLayout) {
      this.fileSystem = fsObject;
    } else if (fsObject !== templateFsLayout) {
      this.fileSystem = fsObject;
    } else {
      this.fileSystem = JSON.parse(localStorage.getItem("fs"));
    }
    this.save("imported");
    return this.fileSystem;
  },
  exportFS() {
    return this.fileSystem;
  },
  // Helper function to get the parent folder of a given path
  getParentFolder(path) {
    const parts = path.split("/");
    parts.pop();
    return parts.join("/");
  },
  // function to tell you if stored data is a file or a folder
  whatIs(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    let current = fsObject;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        return null;
      }
      current = current[part];
    }
    if (typeof current !== "string") {
      return "dir";
    } else {
      return "file";
    }
  },
  // Function to get the contents of a file at a given path
  readFile(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    let current = fsObject;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        return null;
      }
      current = current[part];
    }
    if (typeof current !== "string") {
      return null;
    }
    return current;
  },
  // Function to write to a file at a given path
  writeFile(path, contents, fsObject = this.fileSystem) {
    const parts = path.split("/");
    const filename = parts.pop();
    let current = fsObject;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        current[part] = {};
      }
      current = current[part];
    }
    current[filename] = contents;
    this.save("wrote file");
  },
  // Function to create a new folder at a given path
  createFolder(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    const foldername = parts.pop();
    let current = fsObject;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        current[part] = {};
      }
      current = current[part];
    }
    current[foldername] = {};
    this.save("created folder");
  },
  // Function to delete a file or folder at a given path
  delete(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    const filename = parts.pop();
    const parentPath = this.getParentFolder(path);
    let parent = fsObject;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof parent[part] === "undefined") {
        return;
      }
      parent = parent[part];
    }
    delete parent[filename];
    this.save("deleted file");
  },
  // Function to list all files and folders at a given path
  list(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    let current = fsObject;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        return null;
      }
      current = current[part];
    }
    return Object.keys(current).map((m) => {
      return { item: m, type: this.whatIs(path + "/" + m) };
    });
  },
};

export default Vfs;
