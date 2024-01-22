import winsys from "../lib/winsys.js";
import Html from "../lib/html.js";
import sidebar from "../lib/sidebar.js";
import Vfs from "../lib/vfs.js";
import { setHue, setSaturation, setLightness } from "../lib/theme.js";

const Win = winsys.data.win;

export default {
  prepareDesktop() {
    let settings = {
      appearance: {
        hue: 0,
        sat: 0,
        lit: 0,
      },
    };

    Vfs.importFS();

    try {
      settings = JSON.parse(Vfs.readFile("Root/Lumen/config/settings.json"));

      if (!settings) settings = {};
      if (!settings.appearance)
        settings.appearance = {
          hue: 45,
          sat: 13,
          lit: 23,
        };
    } catch (e) {
      // ...
      console.log(settings);
    }

    console.log(settings);

    setHue(settings.appearance.hue);
    setSaturation(settings.appearance.sat);
    setLightness(settings.appearance.lit);
  },
  run(Main) {
    console.log("Test App");

    function endTask() {
      x.close();
      Main.end();
    }
    Main.setEnd(endTask);
    
    
    let x = new Win({
      title: "Settings",
      width: 400,
      height: 360,
      onclose: endTask,
    });
    
    // Set up window switching
    Main.setMainWindow(x);
    const wrapper = Html.from(x.window).queryHtml(".win-content").class("row");
    let pageContent = new Html("div").class("fg", "w-100", "container");

    function clear() {
      pageContent.clear().classOff('gap');
    }

    let settings = {
      appearance: {
        hue: 45,
        sat: 13,
        lit: 23,
      },
    };

    Vfs.importFS();

    function save() {
      Vfs.writeFile(
        "Root/Lumen/config/settings.json",
        JSON.stringify(settings)
      );
    }

    try {
      settings = JSON.parse(Vfs.readFile("Root/Lumen/config/settings.json"));

      if (!settings) settings = {};
      if (!settings.appearance)
        settings.appearance = {
          hue: 0,
          sat: 0,
          lit: 0,
        };
    } catch (e) {
      // ...
      console.log(settings);
    }

    const pages = [
      {
        item: "Appearance",
        select() {
          clear();

          pageContent.classOn('gap');

          pageContent.appendMany(
            // COLORS
            new Html("div").class("row", "gap", "fs").appendMany(
              new Html("label").text("H"),
              new Html("input")
                .attr({ type: "range", min: 0, max: 360 })
                .on("input", (e) => {
                  setHue(e.target.value);
                  settings.appearance.hue = e.target.value;
                  save();
                }).val(settings.appearance.hue)
            ),
            new Html("div").class("row", "gap", "fs").appendMany(
              new Html("label").text("S"),
              new Html("input")
                .attr({ type: "range", min: 0, max: 100 })
                .on("input", (e) => {
                  setSaturation(e.target.value);
                  settings.appearance.sat = e.target.value;
                  save();
                }).val(settings.appearance.sat)
            ),
            new Html("div").class("row", "gap", "fs").appendMany(
              new Html("label").text("L"),
              new Html("input")
                .attr({ type: "range", min: 10, max: 85 })
                .on("input", (e) => {
                  setLightness(e.target.value);
                  settings.appearance.lit = e.target.value;
                  save();
                }).val(settings.appearance.lit)
            ),
            // END COLORS
          );
        },
      },
      {
        item: "About",
        select() {
          clear();

          new Html("div")
            .class("row", "gap", "fs")
            .appendMany(
              new Html("div").appendMany(
                new Html("img").attr({
                  src: "./assets/logo.svg",
                  width: 56,
                  height: 56,
                })
              ),
              new Html("div")
                .class("col", "js", "gap-sm")
                .appendMany(
                  new Html("h2")
                    .style({ margin: 0 })
                    .text(Main.systemInfo.string),
                  new Html("span").style({ margin: 0 }).text("Version " + Main.systemInfo.build)
                )
            )
            .appendTo(pageContent);

            new Html('p').text('Lumen is licensed under the GPLv3 License. Please redistribute a copy of the code when distributing.').appendTo(pageContent);

          // const credits = [
          //   { role: "Programmer", authors: ["kat21"] },
          // ];

          // new Html("div")
          //   .appendMany(
          //     ...credits.map((c) =>
          //       new Html("p").appendMany(
          //         new Html("b").text(c.role),
          //         ...c.authors.map((a) => new Html("p").text(a))
          //       )
          //     )
          //   )
          //   .appendTo(pageContent);
        },
      },
    ];

    pages[Object.keys(pages)[0]].select();

    const sb = sidebar.new(pages, "Settings");

    sb.appendTo(wrapper);
    pageContent.appendTo(wrapper);

    return { exitCode: 0 };
  },
};
