# ds-bot-brand

[English](README.md) | [简体中文](README.zh.md)

`ds-bot-brand` 用于自定义 DS Bot 侧栏，无需修改或替换桌面端 `app.asar`。
为了兼容已有安装，插件的包名和 DSH 插件 ID 仍为 `ds-brand`。

## 功能

- 修改侧栏左上角显示的名称，最多 40 个字符。
- 替换侧栏左上角图标。
- 修改侧栏左下角的设置入口图标。
- 左下角图标支持四种模式：
  - DS Bot 默认图标；
  - 当前登录账户的 DeepSeek 头像；
  - 复用左上角侧栏图标；
  - 单独选择一张图片。

账户头像在显示时通过 DSH 实时读取，不会把头像 URL 保存到插件设置中。
如果账户未登录、头像不存在或读取失败，会自动回退为 DS Bot 默认图标。

## 使用

点击侧栏左上角的名称或图标即可打开编辑器。也可以从
“设置 → 通用 → 侧栏品牌”进入。

修改结果保存在浏览器的 `localStorage` 中，存储键为 `ds-brand:v1`。只要插件
仍安装在 DS Bot 使用的 DSH profile 中，桌面端版本更新不会清除这些设置。

插件使用 DSH 的公开 slots API 和 DS Bot 侧栏稳定的 `bt-brand` 结构。如果
桌面端 preload 暴露了可选的 `dsBotApp.setIcon`，侧栏图片也会同步到窗口和
托盘；未暴露该接口时，侧栏自定义功能仍然正常工作。

## 安装

将插件目录安装到 DS Bot 使用的 DSH profile：

```sh
pnpm add file:C:/path/to/ds-bot-brand
```

然后在 profile 的 `package.json` 中把插件 ID 加入
`dsh.profile.bundles`：

```json
{
  "dsh": {
    "profile": {
      "bundles": [
        "ds-bot",
        "ds-brand"
      ]
    }
  }
}
```

插件包内的 `cordis.patch.yml` 会自动插入对应的 `ds-brand` 插件条目。
安装完成后重启 DeepSeek Bot。

## 图片处理

选择图片后，插件会将其缩放到 256 × 256，并优先转换为带透明通道的 WebP；
如果 WebP 无法满足大小限制，则回退为 PNG。

支持 PNG、JPEG、WebP 和 GIF，单张原图不能超过 25 MB。

## 开发

```sh
npm ci
npm run build
npm test
npm run lint
```

`client.js` 是由 `src/client/` 生成的构建产物。修改源码后必须运行
`npm run build`，不要直接编辑 `client.js`。

## 许可证

[Apache-2.0](LICENSE)
