const pkg = {
  info: {
    txt: { name: "Text file", opensWith: "notepad" },
    md: { name: "Markdown file", opensWith: "notepad" },
    json: { name: "JSON file", opensWith: "notepad" },
  },
  generic: { name: "File", opensWith: "notepad" },
  fileInfo(fileName = "*.txt", fileType = "file") {
    const info = pkg.info[fileName.split(".").pop().toLowerCase()];

    if (fileType === "dir") return { name: "Directory", opensWith: "Files" };
    else return info;
  },
};

export default pkg;
