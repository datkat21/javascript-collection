import Html from "./html.js";

export default {
  new(
    items = [{ item: "Nothing", select: () => null }],
    header = "Actions"
  ) {
    const headerItem = new Html("div").class("header").text(header);

    // Create the items
    const itemsMapped = items.filter(i => i !== null).map((i) => {
      return new Html("div")
        .class("item")
        .text(i.item)
        .on('contextmenu', e => {
          e.preventDefault();
        })
        .on("click", (_) => {
          i.select();
        });
    });

    // actual menu
    const sidebar = new Html("div")
      .class("sidebar")
      .appendMany(headerItem, ...itemsMapped);
    return sidebar;
  },
};
