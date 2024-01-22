export function setHue(val) {
  document.documentElement.style.setProperty("--hue", val);
}

export function setSaturation(val) {
  document.documentElement.style.setProperty("--sat", val + "%");
}

export function setLightness(val) {
  document.documentElement.style.setProperty("--lit", val + "%");
  if (val > 49) {
    document.documentElement.style.setProperty("--text", "#000");
  } else {
    document.documentElement.style.setProperty("--text", "#fff");
  }
}

export function calculateColors() {
    // /* Colors */
    // --backdrop: hsl(var(--hue), calc(var(--sat) * 1.6), calc(var(--lit) * 0.35));
    // --under: hsl(var(--hue), var(--sat), calc(var(--lit) * 0.26));
    // --root: hsl(var(--hue), var(--sat), calc(var(--lit) * 0.43));
    // --header: hsl(var(--hue), var(--sat), calc(var(--lit) * 0.56));
    // --outline: hsl(var(--hue), var(--sat), var(--lit));
    // --text: hsl(0, 0%, 100%);
    // /* --text-transparent: hsla(0, 0%, 100%, 0.5); */
    // --text-transparent: hsla(var(--hue), 100%, calc(var(--lit) * 1.9), 0.5);
    // --text-light: hsl(0, 0%, 100%);
    // --neutral-dark: hsl(
    //   var(--hue),
    //   calc(var(--sat) * 1.38),
    //   calc(var(--lit) * 0.8)
    // );
    // --neutral: hsl(var(--hue), calc(var(--sat) * 1.38), calc(var(--lit) * 1.3));
    // --neutral-focus: hsl(
    //   var(--hue),
    //   calc(var(--sat) * 1.38),
    //   calc(var(--lit) * 1.6)
    // );
    // --neutral-text: hsl(var(--hue), 100%, calc(var(--lit) * 1.8));
  
    // accent-color: hsl(var(--hue), var(--sat), var(--lit));
}
