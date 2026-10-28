// Generated from src/client by `npm run build` (scripts/build-client.mjs). Do not edit by hand.
window.__ModuleLoader__.load({
  id: 'ds-brand',
  factory: (require) => {
const module = { exports: {} }
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.js
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/store.js
var STORAGE_KEY = "ds-brand:v1";
var DEFAULT_NAME = "DS Bot";
var MAX_NAME = 40;
var IMAGE = /^data:image\/(?:png|jpeg|webp|gif);base64,/i;
var image = (value) => typeof value === "string" && value.length <= 16e4 && IMAGE.test(value) ? value : "";
function normalizeBrand(value) {
  const raw = value && typeof value === "object" ? value : {};
  const name = typeof raw.name === "string" ? raw.name.trim().slice(0, MAX_NAME) : "";
  const footerMode = raw.footerMode === "brand" || raw.footerMode === "custom" || raw.footerMode === "account" ? raw.footerMode : "default";
  return {
    name: name || DEFAULT_NAME,
    brandIcon: image(raw.brandIcon),
    footerMode,
    footerIcon: image(raw.footerIcon)
  };
}
function footerIconOf(value) {
  const brand = normalizeBrand(value);
  if (brand.footerMode === "brand") return brand.brandIcon;
  if (brand.footerMode === "custom") return brand.footerIcon;
  return "";
}
function customFooterEnabled(value) {
  return normalizeBrand(value).footerMode !== "default";
}
function createBrandStore(storage) {
  const listeners = /* @__PURE__ */ new Set();
  const read = () => {
    try {
      return normalizeBrand(JSON.parse(storage?.getItem(STORAGE_KEY) ?? "{}"));
    } catch {
      return normalizeBrand(null);
    }
  };
  let value = read();
  const publish = (next) => {
    value = normalizeBrand(next);
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
    }
    for (const listener of listeners) listener(value);
  };
  return {
    getSnapshot: () => value,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set(next) {
      publish(next);
    },
    reset() {
      publish(null);
    }
  };
}

// src/client/dom.js
var NAME_STYLE = "font-weight:600;font-size:14px";
function markOf(brand) {
  return brand.querySelector(".bt-brand-whale");
}
function nameOf(brand) {
  const direct = [...brand.children].filter((node2) => node2 !== markOf(brand));
  return direct.at(-1) ?? null;
}
function applyBrand(document2, value, customize = "Customize sidebar") {
  for (const brand of document2.querySelectorAll(".bt-brand")) {
    const mark = markOf(brand);
    if (mark !== null) {
      let image2 = mark.querySelector(":scope > img[data-ds-brand-image]");
      if (value.brandIcon === "") {
        image2?.remove();
        mark.removeAttribute("data-ds-brand-image");
      } else {
        if (image2 === null) {
          image2 = document2.createElement("img");
          image2.dataset.dsBrandImage = "";
          image2.alt = "";
          image2.draggable = false;
          mark.append(image2);
        }
        if (image2.getAttribute("src") !== value.brandIcon) image2.setAttribute("src", value.brandIcon);
        mark.setAttribute("data-ds-brand-image", "");
      }
    }
    const name = nameOf(brand);
    if (name !== null) {
      if (!name.hasAttribute("data-ds-brand-name")) name.setAttribute("data-ds-brand-name", "");
      if (!name.getAttribute("style")?.includes("font-weight:600")) name.setAttribute("style", NAME_STYLE);
      const text = value.name || DEFAULT_NAME;
      if (name.textContent !== text) name.textContent = text;
    }
    if (brand.title !== customize) brand.title = customize;
    if (brand.getAttribute("role") !== "button") brand.setAttribute("role", "button");
    if (brand.tabIndex !== 0) brand.tabIndex = 0;
  }
}
function watchBrand(document2, apply2) {
  const run = () => apply2();
  const observer = new MutationObserver(run);
  observer.observe(document2.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class"] });
  run();
  return () => observer.disconnect();
}
function installBrandShortcut(document2, open) {
  const click = (event) => {
    const brand = event.target instanceof Element ? event.target.closest(".bt-brand") : null;
    if (brand === null) return;
    event.preventDefault();
    event.stopPropagation();
    open();
  };
  const key = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const brand = event.target instanceof Element ? event.target.closest(".bt-brand") : null;
    if (brand === null) return;
    event.preventDefault();
    open();
  };
  document2.addEventListener("click", click, true);
  document2.addEventListener("keydown", key, true);
  return () => {
    document2.removeEventListener("click", click, true);
    document2.removeEventListener("keydown", key, true);
  };
}

// src/client/image.js
var IMAGE2 = /^image\/(png|jpeg|webp|gif)$/;
var MAX_FILE = 25 * 1024 * 1024;
var MAX_URL = 16e4;
async function brandImage(file) {
  if (!IMAGE2.test(file.type)) throw new Error("Choose a PNG, JPEG, WebP, or GIF image");
  if (file.size > MAX_FILE) throw new Error("Choose an image smaller than 25 MB");
  const bitmap = await createImageBitmap(file);
  const side = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = side;
  const context = canvas.getContext("2d");
  context.imageSmoothingQuality = "high";
  const scale = Math.min(side / bitmap.width, side / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  context.drawImage(bitmap, Math.round((side - width) / 2), Math.round((side - height) / 2), width, height);
  bitmap.close?.();
  for (const quality of [0.92, 0.8, 0.65]) {
    const url = canvas.toDataURL("image/webp", quality);
    if (url.startsWith("data:image/webp") && url.length < MAX_URL) return url;
  }
  const png = canvas.toDataURL("image/png");
  if (png.length < MAX_URL) return png;
  throw new Error("That image is too large");
}

// src/client/dialog.js
function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== void 0) element.textContent = text;
  return element;
}
function setPreview(box, src, fallback) {
  box.replaceChildren();
  if (src) {
    const image2 = node("img");
    image2.src = src;
    image2.alt = "";
    box.append(image2);
  } else {
    box.textContent = fallback;
  }
}
function preview(src, fallback) {
  const box = node("span", "brandkit-preview");
  setPreview(box, src, fallback);
  return box;
}
function fileChoice(label, onChange) {
  const input = node("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp,image/gif";
  input.hidden = true;
  const button = node("button", "brandkit-button", label);
  button.type = "button";
  button.onclick = () => input.click();
  input.onchange = () => {
    const file = input.files?.[0];
    input.value = "";
    if (file !== void 0) onChange(file);
  };
  return { input, button };
}
function openBrandDialog({ document: document2, value, onSave, onReset, loadAccountAvatar: loadAccountAvatar2, t }) {
  document2.querySelector("dialog.brandkit-dialog")?.close();
  let draft = { ...value };
  const dialog = node("dialog", "brandkit-dialog");
  const form = node("form", "brandkit-form");
  form.method = "dialog";
  dialog.append(form);
  const head = node("div", "brandkit-head");
  const copy = node("div");
  copy.append(node("h2", "brandkit-title", t("title")));
  copy.append(node("p", "brandkit-hint", t("hint")));
  const close = node("button", "brandkit-x", "×");
  close.type = "button";
  close.setAttribute("aria-label", t("close"));
  close.onclick = () => dialog.close();
  head.append(copy, close);
  const nameField = node("label", "brandkit-field");
  nameField.append(node("span", "brandkit-label", t("name")));
  const name = node("input", "brandkit-input");
  name.value = draft.name;
  name.maxLength = 40;
  name.placeholder = DEFAULT_NAME;
  nameField.append(name);
  const brandRow = node("div", "brandkit-field");
  brandRow.append(node("span", "brandkit-label", t("image")));
  const brandLine = node("div", "brandkit-row");
  const brandPreview = preview(draft.brandIcon, (draft.name || DEFAULT_NAME).slice(0, 1).toUpperCase());
  const brandUpload = fileChoice(t("choose"), async (file) => {
    try {
      draft.brandIcon = await brandImage(file);
      setPreview(brandPreview, draft.brandIcon, "");
    } catch (error) {
      window.alert(t(error instanceof Error ? error.message : String(error)));
    }
  });
  const clearBrand = node("button", "brandkit-button", t("reset"));
  clearBrand.type = "button";
  clearBrand.onclick = () => {
    draft.brandIcon = "";
    setPreview(brandPreview, "", (name.value || DEFAULT_NAME).slice(0, 1).toUpperCase());
  };
  brandLine.append(brandPreview, brandUpload.button, clearBrand, brandUpload.input);
  brandRow.append(brandLine);
  const footerField = node("label", "brandkit-field");
  footerField.append(node("span", "brandkit-label", t("footer")));
  const footer = node("select", "brandkit-select");
  footer.append(
    new Option(t("footerDefault"), "default"),
    new Option(t("footerAccount"), "account"),
    new Option(t("footerBrand"), "brand"),
    new Option(t("footerCustom"), "custom")
  );
  footer.value = draft.footerMode;
  const footerRow = node("div", "brandkit-row");
  const footerPreview = preview(draft.footerMode === "brand" ? draft.brandIcon : draft.footerMode === "custom" ? draft.footerIcon : "", "•");
  let previewRevision = 0;
  const refreshFooterPreview = () => {
    const revision = ++previewRevision;
    if (footer.value === "account") {
      setPreview(footerPreview, "", "…");
      void loadAccountAvatar2().then((src) => {
        if (revision === previewRevision && footer.value === "account") setPreview(footerPreview, src, "•");
      }).catch(() => {
        if (revision === previewRevision && footer.value === "account") setPreview(footerPreview, "", "•");
      });
      return;
    }
    setPreview(footerPreview, footer.value === "brand" ? draft.brandIcon : footer.value === "custom" ? draft.footerIcon : "", "•");
  };
  const footerUpload = fileChoice(t("choose"), async (file) => {
    try {
      draft.footerIcon = await brandImage(file);
      draft.footerMode = "custom";
      footer.value = "custom";
      refreshFooterPreview();
    } catch (error) {
      window.alert(t(error instanceof Error ? error.message : String(error)));
    }
  });
  footerRow.append(footerPreview, footerUpload.button, footerUpload.input);
  footer.onchange = () => {
    draft.footerMode = footer.value;
    refreshFooterPreview();
  };
  footerField.append(footer, footerRow);
  const actions = node("div", "brandkit-actions");
  const reset = node("button", "brandkit-button", t("resetAll"));
  reset.type = "button";
  reset.onclick = () => {
    onReset();
    dialog.close();
  };
  const right = node("div", "brandkit-actions-right");
  const cancel = node("button", "brandkit-button", t("cancel"));
  cancel.type = "button";
  cancel.onclick = () => dialog.close();
  const save = node("button", "brandkit-primary", t("save"));
  save.type = "submit";
  save.onclick = (event) => {
    event.preventDefault();
    onSave({
      ...draft,
      name: name.value.trim() || DEFAULT_NAME,
      footerMode: footer.value
    });
    dialog.close();
  };
  right.append(cancel, save);
  actions.append(reset, right);
  form.append(head, nameField, brandRow, footerField, actions);
  document2.body.append(dialog);
  dialog.addEventListener("close", () => dialog.remove(), { once: true });
  dialog.showModal();
  refreshFooterPreview();
  name.focus();
  name.select();
}

// src/client/styles.js
var BRAND_CSS = `
.bt-brand-whale[data-ds-brand-image]{display:block;width:22px;height:22px;flex:none;overflow:hidden}
.bt-brand-whale[data-ds-brand-image]>:not(img){display:none!important}
.bt-brand-whale[data-ds-brand-image]>img{display:block;width:100%;height:100%;object-fit:contain}
.bt-brand[role=button]{cursor:pointer}
.brandkit-dialog{width:min(520px,calc(100vw - 32px));max-height:calc(100vh - 48px);padding:0;border:1px solid var(--dsw-alias-border-l2,#8a8a8a55);border-radius:18px;background:var(--dsw-alias-bg-base,#191a1c);color:var(--dsw-alias-label-primary,#f5f6f8);box-shadow:0 24px 70px #0008;font:13px/1.45 system-ui,sans-serif}
.brandkit-dialog::backdrop{background:#0008;backdrop-filter:blur(4px)}
.brandkit-form{display:flex;flex-direction:column;gap:18px;padding:22px}
.brandkit-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}
.brandkit-title{margin:0;font-size:18px;line-height:1.3}
.brandkit-hint{margin:4px 0 0;color:var(--dsw-alias-label-tertiary,#9da0a8)}
.brandkit-x{width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:inherit;font-size:20px;cursor:pointer}
.brandkit-x:hover{background:var(--dsw-alias-interactive-bg-hover,#ffffff12)}
.brandkit-field{display:flex;flex-direction:column;gap:8px}
.brandkit-label{font-weight:600}
.brandkit-input,.brandkit-select{width:100%;box-sizing:border-box;height:38px;padding:0 11px;border:1px solid var(--dsw-alias-border-l3,#7778);border-radius:10px;background:var(--dsw-alias-bg-base,#202124);color:inherit;font:inherit}
.brandkit-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.brandkit-preview{width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:12px;background:var(--dsw-alias-bg-skeleton,#ffffff0d);overflow:hidden;font-weight:700}
.brandkit-preview img{width:100%;height:100%;object-fit:contain}
.brandkit-button,.brandkit-primary{height:34px;padding:0 14px;border:1px solid var(--dsw-alias-border-l3,#7778);border-radius:9px;background:transparent;color:inherit;font:inherit;cursor:pointer}
.brandkit-button:hover{background:var(--dsw-alias-interactive-bg-hover,#ffffff12)}
.brandkit-primary{border-color:transparent;background:var(--dsw-alias-button-primary-fill,#4d6bfe);color:var(--dsw-alias-label-primary-foreground,#fff);font-weight:600}
.brandkit-actions{display:flex;justify-content:space-between;gap:12px;padding-top:2px}
.brandkit-actions-right{display:flex;gap:8px}
.brandkit-preview[data-icon="brand"] img,.brandkit-preview[data-icon="footer"] img{display:block}
.dsb-footer-mark{width:36px;height:36px;border-radius:50%;display:inline-grid;place-items:center;overflow:hidden;background:color-mix(in srgb,currentColor 5%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 13%,transparent)}
.dsb-footer-mark img{width:100%;height:100%;object-fit:contain}
.dsb-footer-mark img[data-account]{object-fit:cover}
.dsb-footer-default{display:inline-grid;place-items:center}
@media (max-width:600px){.brandkit-form{padding:18px}.brandkit-actions{align-items:stretch}.brandkit-actions-right{flex:1;justify-content:flex-end}}
`;

// src/client/account.js
var ACCOUNT_CLIENT_VERSION = "0.2.1-rc.2";
function safeAvatarUrl(value) {
  if (typeof value !== "string" || value.length > 4096) return "";
  try {
    const url = new URL(value, globalThis.location?.href ?? "https://deepseek.invalid/");
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}
async function loadAccountAvatar(ctx, signal) {
  let account;
  try {
    account = ctx?.remote?.account;
  } catch {
    return "";
  }
  if (typeof account?.getProfile !== "function" || signal?.aborted) return "";
  let locale = "en";
  try {
    locale = ctx.locale?.getSnapshot?.().active || locale;
  } catch {
  }
  try {
    const result = await account.getProfile({
      version: ACCOUNT_CLIENT_VERSION,
      locale,
      timezoneOffsetSeconds: -(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60
    });
    if (signal?.aborted || result?.ok !== true || result.value?.status !== "ready") return "";
    return safeAvatarUrl(result.value.value?.avatarUrl);
  } catch {
    return "";
  }
}

// src/client/index.js
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var inject = ["slots", "locale", "remote", "remote.account"];
var TEXT = {
  en: {
    title: "Sidebar branding",
    hint: "Change the name and pictures shown in the DS Bot sidebar.",
    close: "Close",
    name: "Sidebar name",
    image: "Sidebar image",
    choose: "Choose image…",
    reset: "Reset",
    footer: "Bottom-left icon",
    footerDefault: "DS Bot default",
    footerAccount: "Use signed-in account avatar",
    footerBrand: "Use sidebar image",
    footerCustom: "Choose another image",
    resetAll: "Reset all",
    cancel: "Cancel",
    save: "Save",
    settings: "Sidebar branding",
    customize: "Customize…",
    "Choose a PNG, JPEG, WebP, or GIF image": "Choose a PNG, JPEG, WebP, or GIF image",
    "Choose an image smaller than 25 MB": "Choose an image smaller than 25 MB",
    "That image is too large": "That image is too large"
  },
  zh: {
    title: "侧栏品牌",
    hint: "修改 DS Bot 侧栏显示的名称和图片。",
    close: "关闭",
    name: "侧栏名称",
    image: "侧栏图标",
    choose: "选择图片…",
    reset: "重置",
    footer: "左下角图标",
    footerDefault: "DS Bot 默认图标",
    footerAccount: "使用当前登录账户头像",
    footerBrand: "使用侧栏图标",
    footerCustom: "选择其他图片",
    resetAll: "全部重置",
    cancel: "取消",
    save: "保存",
    settings: "侧栏品牌",
    customize: "自定义…",
    "Choose a PNG, JPEG, WebP, or GIF image": "请选择 PNG、JPEG、WebP 或 GIF 图片",
    "Choose an image smaller than 25 MB": "请选择小于 25 MB 的图片",
    "That image is too large": "图片太大了"
  }
};
function installStyle(document2) {
  const style = document2.createElement("style");
  style.dataset.dsBrand = "";
  style.textContent = BRAND_CSS;
  document2.head.append(style);
  return () => style.remove();
}
function syncNative(value) {
  const bridge = globalThis.dsBotApp;
  if (typeof bridge?.setIcon !== "function") return;
  void Promise.resolve(bridge.setIcon(value.brandIcon)).catch(() => {
  });
}
function apply(ctx) {
  const document2 = globalThis.document;
  const store = createBrandStore(globalThis.localStorage);
  ctx.effect(() => ctx.locale.register("ds-brand", TEXT), "ds-brand: dictionaries");
  const t = ctx.locale.bind("ds-brand");
  const open = () => openBrandDialog({
    document: document2,
    value: store.getSnapshot(),
    onSave: (value) => store.set(value),
    onReset: () => store.reset(),
    loadAccountAvatar: () => loadAccountAvatar(ctx),
    t
  });
  ctx.effect(() => installStyle(document2), "ds-brand: styles");
  ctx.effect(() => watchBrand(document2, () => applyBrand(document2, store.getSnapshot(), t("hint"))), "ds-brand: sidebar");
  ctx.effect(() => installBrandShortcut(document2, open), "ds-brand: editor shortcut");
  ctx.effect(() => {
    const sync = (value) => {
      applyBrand(document2, value, t("hint"));
      syncNative(value);
    };
    sync(store.getSnapshot());
    return store.subscribe(sync);
  }, "ds-brand: saved branding");
  ctx.effect(() => {
    let release;
    let registered = false;
    const sync = () => {
      const wanted = customFooterEnabled(store.getSnapshot());
      if (!wanted) {
        release?.();
        release = void 0;
        registered = false;
        return;
      }
      if (registered) return;
      const Mark = () => {
        const value = (0, import_react.useSyncExternalStore)(store.subscribe, store.getSnapshot);
        const [accountAvatar, setAccountAvatar] = (0, import_react.useState)("");
        const account = value.footerMode === "account";
        (0, import_react.useEffect)(() => {
          if (!account) {
            setAccountAvatar("");
            return void 0;
          }
          let live = true;
          let refreshing = false;
          const controller = new AbortController();
          const refresh = () => {
            if (refreshing) return;
            refreshing = true;
            void loadAccountAvatar(ctx, controller.signal).then((url) => {
              if (live) setAccountAvatar(url);
            }).catch(() => {
              if (live) setAccountAvatar("");
            }).finally(() => {
              refreshing = false;
            });
          };
          const onVisibility = () => {
            if (document2.visibilityState === "visible") refresh();
          };
          refresh();
          window.addEventListener("focus", refresh);
          document2.addEventListener("visibilitychange", onVisibility);
          return () => {
            live = false;
            controller.abort();
            window.removeEventListener("focus", refresh);
            document2.removeEventListener("visibilitychange", onVisibility);
          };
        }, [account]);
        const icon = footerIconOf(value) || (account ? accountAvatar : "");
        return icon === "" ? (0, import_react.createElement)("span", { className: "dsb-footer-default" }, (0, import_react.createElement)(import_dsh_client_ui_primitives.FishLogo, { size: 24 })) : (0, import_react.createElement)("span", { className: "dsb-footer-mark" }, (0, import_react.createElement)("img", {
          src: icon,
          alt: "",
          draggable: false,
          "data-account": account || void 0
        }));
      };
      release = ctx.slots.inject("settings.trigger", () => ctx.slots.register({
        name: "settings.trigger",
        priority: -200
      }, Mark));
      registered = true;
    };
    sync();
    const off = store.subscribe(sync);
    return () => {
      off();
      release?.();
    };
  }, "ds-brand: settings trigger");
  ctx.effect(() => ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "ds-brand",
    order: 40,
    priority: -200
  }, function BrandSettingsRow() {
    return (0, import_react.createElement)("button", {
      type: "button",
      className: "brandkit-button",
      style: { width: "100%", justifyContent: "space-between", display: "flex", alignItems: "center" },
      onClick: open
    }, (0, import_react.createElement)("span", null, t("settings")), (0, import_react.createElement)("span", null, t("customize")));
  })), "ds-brand: settings row");
}
return Object.defineProperty({ ...module.exports }, Symbol.toStringTag, { value: 'Module' })
  },
})
