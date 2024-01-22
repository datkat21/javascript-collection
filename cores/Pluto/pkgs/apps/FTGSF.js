export default {
  name: "FTGSF",
  description: "Generates shortcuts for applications on the Desktop.",
  ver: 1, // Compatible with core v1
  type: "process",
  exec: async function (Root) {
    let wrapper; // Lib.html | undefined

    console.log("generating shortcuts for applications on the desktop");

    const vfs = await Root.Lib.loadLibrary("VirtualFS");
    await vfs.importFS();

    let shortcutsList = [
      { name: "Example App", icon: "box", fullName: "apps:Example" },
      { name: "DevEnv", icon: "fileJson", fullName: "apps:DevEnv" },
      { name: "App Store", icon: "package", fullName: "apps:AppStore" },
    ];
    
    for (let i = 0; i < shortcutsList.length; i++) {
      await vfs.writeFile(
        "Root/Desktop/" + shortcutsList[i].name.replace(" ", "") + ".shrt",
        JSON.stringify(shortcutsList[i])
      );
    }
    Root.Lib.setOnEnd();
    Root.Lib.onEnd();

    return Root.Lib.setupReturns((m) => {
      console.log("Example received message: " + m);
    });
  },
};