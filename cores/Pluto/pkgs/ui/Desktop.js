export default {
  name: "Desktop",
  description: "Backdrop user interface",
  ver: 1, // Compatible with core v1
  type: "process",
  optInToEvents: true,
  exec: async function (Root) {
    let wrapper; // Lib.html | undefined
    let MyWindow;

    console.log("Hello from example package", Root.Lib);

    wrapper = new Root.Lib.html("div").appendTo("body").class("desktop");

    Root.Lib.setOnEnd(function () {
      clearInterval(timeInterval);
      wrapper.cleanup();
    });

    let Html = Root.Lib.html;

    let vfs = await Root.Core.startPkg("lib:VirtualFS");
    await vfs.importFS();

    let appearanceConfig = JSON.parse(
      await vfs.readFile("Root/Pluto/config/appearanceConfig.json")
    );

    let wallpaper = "./assets/wallpapers/default.svg";

    if (appearanceConfig.wallpaper) {
      wallpaper = appearanceConfig.wallpaper;
    }

    let background = new Html()
      .style({
        "background-image": "url(" + wallpaper + ")",
        "background-size": "cover",
        "background-attachment": "fixed",
        "background-repeat": "no-repeat",
        "background-position": "center",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        transition: "opacity 2s linear",
        opacity: "0",
        width: "100%",
        height: "100%",
        position: "absolute",
        "z-index": "-1",
      })
      .appendTo(wrapper);

    async function refresh() {
      background.style({
        opacity: 1,
        display: "block",
        "z-index": -1,
      });

      let mouseSpace = {
        x: 0,
        y: 0,
      };

      const desktopDirectory = "Root/Desktop";
      const fileList = await vfs.list(desktopDirectory);

      const iconsWrapper = new Root.Lib.html("div")
        .class("desktop-apps")
        .appendTo(wrapper);

      function createDesktopIcon(fileName, icon, fn) {
        const mouse = { x: 0, y: 0 };
        let lastTapTime = 0;
        let iconWrapper = new Root.Lib.html("div")
          .class("desktop-icon")
          .append(
            new Root.Lib.html("div").html(Root.Lib.icons[icon]).class("icon")
          )
          .append(
            new Root.Lib.html("div")
              .append(new Root.Lib.html().text(fileName).class("text"))
              .class("text-wrapper")
          )
          .appendTo(iconsWrapper)
          .on("dblclick", (_) => fn(Root.Core))
          .on("touchstart", (e) => {
            const currentTime = new Date().getTime();
            const tapInterval = currentTime - lastTapTime;

            if (tapInterval < 300 && tapInterval > 0) {
              fn(Root.Core);
              e.preventDefault();
            }

            lastTapTime = currentTime;
          });
        return iconWrapper;
      }

      let FileMappings = await Root.Lib.loadLibrary("FileMappings");

      for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];

        let mapping = await FileMappings.retrieveAllMIMEdata(
          desktopDirectory + "/" + file.item,
          vfs
        );

        createDesktopIcon(mapping.name, mapping.icon, mapping.onClick);
      }
    }

    const preloadImage = new Image();
    preloadImage.src = wallpaper;
    preloadImage.addEventListener("load", refresh);

    let dock = new Root.Lib.html("div").appendTo(wrapper).class("dock");

    let menuButton = new Root.Lib.html("button")
      .class("toolbar-button")
      .html(
        `<svg width="24" height="24" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 15.3713C12.7949 15.3713 15.8713 12.2949 15.8713 8.5C15.8713 4.70511 12.7949 1.62874 9 1.62874C5.20511 1.62874 2.12874 4.70511 2.12874 8.5C2.12874 12.2949 5.20511 15.3713 9 15.3713ZM9 17C13.6944 17 17.5 13.1944 17.5 8.5C17.5 3.80558 13.6944 0 9 0C4.30558 0 0.5 3.80558 0.5 8.5C0.5 13.1944 4.30558 17 9 17Z" fill="currentColor"/></svg>`
      )
      .appendTo(dock);

    let menuIsOpen = false;
    let menuIsToggling = false;
    let menuElm;

    function onClickDetect(ev) {
      if (ev.target.closest(".menu")) {
      } else toggleMenu();
    }

    function onFullClickDetect(ev) {
      if (ev.target.closest(".menu")) {
        if (ev.button === 0) {
          if (ev.target.closest("button") || ev.target.closest(".app")) {
            toggleMenu();
          }
        }
      }
    }

    let FileMappings = await Root.Lib.loadLibrary("FileMappings");

    async function toggleMenu() {
      if (menuIsToggling) {
        return; // Return early if menu is currently toggling
      }

      menuIsToggling = true;
      menuIsOpen = !menuIsOpen;

      const userData = {
        username: 'Local User',
        pfp: 'assets/pfp.svg',
        onlineAccount: false
      };

      if (menuIsOpen === true) {
        window.addEventListener("mousedown", onClickDetect);
        window.addEventListener("click", onFullClickDetect);
        window.addEventListener("touchstart", onClickDetect);
        window.addEventListener("touchend", onFullClickDetect);
        if (!menuElm) {
          // Create menu element if it doesn't exist
          const desktopApps = (await vfs.list("Root/Desktop"))
            .filter((f) => f.item.endsWith(".shrt"))
            .map((f) => {
              return { type: "desktop", item: f.item };
            });
          const installedApps = (await vfs.list("Root/Pluto/apps"))
            .filter((f) => f.item.endsWith(".app"))
            .map((f) => {
              return { type: "installed", item: f.item };
            });

          const apps = [...installedApps, ...desktopApps];

          const appsHtml = await Promise.all(
            apps.map(async (app) => {
              // console.log(app);
              let icon = "box",
                name = app.item,
                description = null;

              if (app.type === "desktop") {
                const data = await FileMappings.retrieveAllMIMEdata(
                  "Root/Desktop/" + app.item
                );

                icon = data.icon;
                name = data.name;
                description = data.fullName;
              }

              return new Html("div")
                .class("app")
                .appendMany(
                  new Html("div").class("app-icon").html(Root.Lib.icons[icon]),
                  new Html("div")
                    .class("app-text")
                    .appendMany(
                      new Html("div").class("app-heading").text(name),
                      description !== null
                        ? new Html("div")
                            .class("app-description")
                            .text(description)
                        : null
                    )
                )
                .on("click", async (e) => {
                  if (app.type === "desktop") {
                    // View the shortcut file
                    try {
                      let shrt = JSON.parse(
                        await vfs.readFile("Root/Desktop/" + app.item)
                      );

                      // console.log(shrt);

                      if (shrt.fullName) {
                        await Root.Core.startPkg(shrt.fullName, true, true);
                      }
                    } catch (e) {
                      console.log("Couldn't load the application");
                    }
                  } else {
                    try {
                      const appData = await vfs.readFile(
                        "Root/Pluto/apps/" + app.item
                      );
                      await Root.Core.startPkg(
                        "data:text/javascript;base64," + btoa(appData),
                        false,
                        true
                      );
                    } catch (e) {
                      console.log("Couldn't load the application");
                    }
                  }
                });
            })
          );

          menuElm = new Html("div").class("menu").appendMany(
            new Html("div").class("me").appendMany(
              new Html("div").class("pfp").style({
                "--url": `url(${userData.pfp})`,
              }),
              new Html("div")
                .class("text")
                .appendMany(
                  new Html("div").class("heading").text(userData.username),
                  new Html("div")
                    .class("subheading")
                    .text(
                      userData.onlineAccount === true
                        ? "Zeon Account"
                        : "Local Account"
                    )
                ),
              new Root.Lib.html("button")
                .class("small")
                .html(Root.Lib.icons.wrench)
                .on("click", (e) => {
                  Root.Core.startPkg("apps:Settings", true, true);
                }),
              new Root.Lib.html("button")
                .class("small")
                .html(Root.Lib.icons.lock)
                .on("click", async (e) => {
                  let ls = await Root.Core.startPkg(
                    "ui:LockScreen",
                    true,
                    true
                  );
                  ls.loader();
                })
            ),
            new Html("div")
              .class("spacer")
              .appendMany(
                new Html("div").class("space"),
                new Html("div").text("Apps"),
                new Html("div").class("space")
              ),
            new Html("div").class("apps").appendMany(...appsHtml)
          );

          dock.elm.insertBefore(menuElm.elm, dock.elm.lastChild);
        }

        menuElm.classOn("opening");
        setTimeout(() => {
          menuElm.classOff("opening");
          menuIsToggling = false;
        }, 500);
      } else {
        window.removeEventListener("mousedown", onClickDetect);
        window.removeEventListener("touchstart", onClickDetect);
        if (menuElm) {
          menuElm.classOn("closing");
          setTimeout(() => {
            menuElm.cleanup();
            menuElm = null; // Reset menu element reference
            menuIsToggling = false;
          }, 500);
        }
      }
    }

    menuButton.on("click", toggleMenu);

    let dockItems = new Root.Lib.html("div").class("items").appendTo(dock);
    let dockItemsList = [];

    /* quickAccessButton */
    let timeInterval = -1;
    let pastMinute = 0;

    function updateTime() {
      let x = new Date();
      let hours = x.getHours().toString().padStart(2, "0");
      let minutes = x.getMinutes().toString().padStart(2, "0");
      if (pastMinute === minutes) return;
      pastMinute = minutes;
      let timeString = `${hours}:${minutes}`;
      quickAccessButton.text(timeString);
    }

    const quickAccessButton = new Root.Lib.html("div")
      .class("toolbar-button")
      .text("..:..")
      .appendTo(dock);

    updateTime();
    timeInterval = setInterval(updateTime, 1000);

    function createButton(pid, name, onclickFocusWindow) {
      dockItemsList[pid] = new Html()
        .class("dock-item")
        .appendTo(dockItems)
        .on(
          "click",
          (_) =>
            onclickFocusWindow &&
            onclickFocusWindow.focus &&
            onclickFocusWindow.focus()
        )
        .text(name);
    }

    Root.Core.processList
      .filter((n) => n !== null)
      .forEach((a) => {
        if (
          a.name.startsWith("system:") ||
          a.name.startsWith("ui:") ||
          a.name.startsWith("services:")
        )
          return;
        if (!a.proc) return;

        createButton(a.pid, a.proc.name);
      });

    let isCurrentlyChangingWallpaper = false;
    let wallpaperToChangeTo = "";

    // Start the startup apps

    if (await vfs.exists("Root/Pluto/startup")) {
      let startupApps = await vfs.readFile("Root/Pluto/startup").then((e) => {
        return e.split("\n").filter((e) => e !== "");
      });

      if (startupApps.length >= 1) {
        for (let i = 0; i < startupApps.length; i++) {
          let file = startupApps[i];
          let mapping = await FileMappings.retrieveAllMIMEdata(file, vfs);
          console.log(mapping);
          mapping.onClick(Root.Core);
        }
      }
    }

    // scan for dangerous files
    let settingsConfig = JSON.parse(
      await vfs.readFile("Root/Pluto/config/settingsConfig.json")
    );
    console.log(settingsConfig);
    if (settingsConfig === null) {
      await vfs.writeFile(
        "Root/Pluto/config/settingsConfig.json",
        `{"warnSecurityIssues": true}`
      );
      settingsConfig = JSON.parse(
        await vfs.readFile("Root/Pluto/config/settingsConfig.json")
      );
    }

    function smoothlySwapBackground(to) {
      wallpaperToChangeTo = to;
      background.style({
        "background-image": "url(" + wallpaperToChangeTo + ")",
      });
    }

    const WindowSystem = await Root.Lib.loadLibrary("WindowSystem");

    console.log("winSys", WindowSystem, Root.Core.windowsList);

    return Root.Lib.setupReturns(async (m) => {
      try {
        // Got a message
        const { type, data } = m;
        switch (type) {
          case "setWallpaper":
            if (data === "default") {
              appearanceConfig = JSON.parse(
                await vfs.readFile("Root/Pluto/config/appearanceConfig.json")
              );
              smoothlySwapBackground(appearanceConfig.wallpaper);
            } else {
              smoothlySwapBackground(data);
            }
            break;
          case "refresh":
            break;
          case "coreEvent":
            console.log("Desktop received core event", data);

            if (
              data.data.name.startsWith("system:") ||
              data.data.name.startsWith("ui:") ||
              data.data.name.startsWith("services:")
            )
              return;
            if (data.type === "pkgStart") {
              if (dockItemsList[data.data.pid]) return;
              const p = Root.Core.windowsList.find(
                (p) => p.options.pid === data.data.pid
              );
              if (p) {
                console.log("winSys", p);
                createButton(data.data.pid, data.data.proc.name, p);
              }
            } else if (data.type === "pkgEnd") {
              console.log("Cleanup pid", data.data.pid);
              dockItemsList[data.data.pid].cleanup();
              dockItemsList[data.data.pid] = null;
              console.log("Removed", data.data.pid);
            }
            break;
          case "wsEvent":
            if (data.type === "focusedWindow") {
              if (data.data === undefined) return;
              const p = data.data.options.pid;
              dockItemsList
                .filter((n) => n !== null)
                .forEach((pa) => {
                  pa.classOff("selected");
                });
              if (dockItemsList[p] !== undefined)
                if (dockItemsList[p] !== null)
                  dockItemsList[p].classOn("selected");
                else console.log("?!");
            }
            break;
        }
      } catch (e) {
        console.log("desktop oops", e);
      }
    });
  },
};
