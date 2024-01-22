// Lumen Core
// (c) datkat21 2023
// Licensed under GPLv3
const Core = {
  version: {
    num: 0.03,
    codename: "Lumen",
    build: "Alpha",
  },
  app: {
    async run(url, params = null) {
      const appUrl = `./apps/${url}.js`;
      const appData = await import(appUrl);

      if (!appData.default) return;

      if (appData.default.run) {
        const uuid = crypto.randomUUID();

        let procInfo = {
          name: url,
          data: null,
          end: null,
        };

        const appReturn = await appData.default.run({
          startApp: Core.app.run,
          appList: Core.app.list,
          systemInfo: Core.version,
          end: function () {
            // Remove from app list
            Core.app.list.delete(uuid);
          },
          activeWindow: undefined,
          setEnd(fn) {
            if (Core.app.list.get(uuid) === undefined) {
              // pre-launch
              procInfo.end = fn;
            } else {
              // post-launch
              Core.app.list.get(uuid).end = fn;
            }
          },
          setMainWindow(win) {
            if (Core.app.list.get(uuid) === undefined) {
              // pre-launch
              procInfo.activeWindow = win;
            } else {
              // post-launch
              Core.app.list.get(uuid).activeWindow = win;
            }
          },
          params,
        });

        procInfo.data = appReturn;

        Core.app.list.set(uuid, procInfo);
      }
    },
    list: new Map(),
  },
};

Core.version.string = `${Core.version.codename} v${Core.version.num}`;
document.title = `${Core.version.string} (${Core.version.build})`;

await Core.app.run("Bootloader");

console.log("Ready");

window.c = Core;
