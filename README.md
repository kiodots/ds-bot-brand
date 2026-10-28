# ds-bot-brand

[English](README.md) | [简体中文](README.zh.md)

`ds-bot-brand` customizes the DS Bot sidebar without replacing the app bundle.
Its package and DSH plugin ID remain `ds-brand` for compatibility with existing
installations.

- the name beside the sidebar mark;
- the sidebar mark;
- the icon of the Settings trigger at the bottom of the sidebar.

The bottom-left icon can use the avatar of the DeepSeek account that is signed
in. The avatar is read from DSH when the icon appears and is not saved in the
plugin's settings. When the account is signed out or its avatar is unavailable,
the DS Bot mark is shown instead.

Click the sidebar brand to open the editor. Changes are kept in the browser's
local storage, so they stay in place when DeepSeek Bot updates the app and the
plugin remains installed in its DSH profile.

The sidebar changes use DSH's public slots and the DS Bot sidebar's stable
`bt-brand` surface. When the desktop preload exposes `dsBotApp.setIcon`, the
brand image is also sent to the window and tray. A future app that does not
expose that optional bridge still gets the sidebar changes.

## Install

For a local profile, add this directory as a dependency and add `ds-brand` to
the profile's bundles, then restart DSH.

```sh
pnpm add file:C:/path/to/DS-Bot/plugins/ds-brand
```

The package's `cordis.patch.yml` inserts the `ds-brand` plugin row.

## Configuration

The editor offers:

- a name, up to 40 characters;
- a sidebar image;
- the default Settings icon, the signed-in account avatar, the same image as
  the sidebar, or a separate Settings image.

Images are resized to a transparent 256 x 256 WebP or PNG before being stored.
