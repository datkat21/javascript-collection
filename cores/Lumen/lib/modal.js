import Html from "./html.js";

export default {
  /**
   * The base modal function.
   */
  modal: function (
    title,
    content,
    parent = "body",
    contentIsHtml = false,
    ...buttons
  ) {
    if (content === undefined && title) {
      content = "" + title;
      title = "Alert";
    }

    let modalContent = new Html("div").class("modal-content");
    let modalHeader = new Html("div").class("modal-header");
    let modalBody = new Html("div").class("modal-body");
    modalContent.appendMany(modalHeader, modalBody);

    const x = new Html("div").class("modal").append(modalContent);

    new Html("span").text(title).appendTo(modalHeader);
    if (contentIsHtml === false) {
      new Html("span").html(content).appendTo(modalBody);
    } else {
      content.appendTo(modalBody);
    }
    new Html("div").class("flex-group").appendTo(modalBody);

    for (let i = 0; i < buttons.length; i++) {
      let button = buttons[i];
      if (!button.text || !button.callback)
        throw new Error("Invalid button configuration");

      const b = new Html("button").text(button.text).on("click", (e) => {
        x.class("closing");
        setTimeout(() => {
          x.cleanup();
          button.callback(e);
        }, 350);
      });

      if (button.type && button.type === "primary") b.class("primary");

      b.appendTo(modalContent.elm.querySelector(".flex-group"));
    }

    x.appendTo(parent);

    const focusableElements = x.elm.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="checkbox"], input[type="radio"], select'
    );
    this.elementsArray = Array.prototype.slice.call(focusableElements);
    this.elementsArray.forEach((el) => {
      el.setAttribute("tabindex", "0");
    });

    this.elementsArray[0].addEventListener("keydown", (e) => {
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        this.elementsArray[this.elementsArray.length - 1].focus();
      }
    });
    this.elementsArray[this.elementsArray.length - 1].addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Tab" && !e.shiftKey) {
          e.preventDefault();
          this.elementsArray[0].focus();
        }
      }
    );
    this.elementsArray[0].focus();
  },
  /**
   * Show an "OK" pop-up modal.
   * @param {string} title
   * @param {string} content
   * @param {HTMLElement | Html} parent
   * @returns
   */
  alert: function (title, content, parent = "body") {
    return new Promise((res, _rej) => {
      this.modal(title, content, parent, false, {
        text: "OK",
        callback: (_) => res(true),
      });
    });
  },
  /**
   * Show a Yes/No input modal.
   * @param {string} title the title
   * @param {string} content the content
   * @param {HTMLElement | Html} parent Parent
   * @returns Promise&lt;boolean&gt;
   */
  prompt: function (title, content, parent = "body") {
    return new Promise((res, _rej) => {
      this.modal(
        title,
        content,
        parent,
        false,
        {
          text: "Yes",
          type: "primary",
          callback: (_) => res(true),
        },
        {
          text: "No",
          callback: (_) => res(false),
        }
      );
    });
  },
  /**
   * Show a text pop up asking for text input.
   * @param {string} title Title
   * @param {string} description Description
   * @param {string} placeholder Auto-filed text
   * @param {HTMLElement | Html} parent Parent
   * @returns Promise&lt;boolean&gt;
   */
  input: function (title, description, placeholder, parent = "body") {
    let wrapper = new Html("div").class("col");
    /* span */ new Html("span").text(description).appendTo(wrapper);
    let input = new Html("input")
      .attr({ type: "text", placeholder, tabindex: 0 })
      .appendTo(wrapper);

    return new Promise((res, _rej) => {
      this.modal(
        title,
        wrapper,
        parent,
        true,
        {
          text: "OK",
          type: "primary",
          callback: (_) => {
            res(input.elm.value);
          },
        },
        {
          text: "Cancel",
          callback: (_) => res(false),
        }
      );
    });
  },
};
