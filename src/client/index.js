import { createElement as h, useEffect, useState, useSyncExternalStore } from 'react'
import { FishLogo } from '@deepseek-ai/dsh-client-ui-primitives'
import { createBrandStore, customFooterEnabled, footerIconOf } from './store.js'
import { applyBrand, installBrandShortcut, watchBrand } from './dom.js'
import { openBrandDialog } from './dialog.js'
import { BRAND_CSS } from './styles.js'
import { loadAccountAvatar } from './account.js'

export const inject = ['slots', 'locale', 'remote', 'remote.account']

const TEXT = {
  en: {
    title: 'Sidebar branding',
    hint: 'Change the name and pictures shown in the DS Bot sidebar.',
    close: 'Close',
    name: 'Sidebar name',
    image: 'Sidebar image',
    choose: 'Choose image…',
    reset: 'Reset',
    footer: 'Bottom-left icon',
    footerDefault: 'DS Bot default',
    footerAccount: 'Use signed-in account avatar',
    footerBrand: 'Use sidebar image',
    footerCustom: 'Choose another image',
    resetAll: 'Reset all',
    cancel: 'Cancel',
    save: 'Save',
    settings: 'Sidebar branding',
    customize: 'Customize…',
    'Choose a PNG, JPEG, WebP, or GIF image': 'Choose a PNG, JPEG, WebP, or GIF image',
    'Choose an image smaller than 25 MB': 'Choose an image smaller than 25 MB',
    'That image is too large': 'That image is too large',
  },
  zh: {
    title: '侧栏品牌',
    hint: '修改 DS Bot 侧栏显示的名称和图片。',
    close: '关闭',
    name: '侧栏名称',
    image: '侧栏图标',
    choose: '选择图片…',
    reset: '重置',
    footer: '左下角图标',
    footerDefault: 'DS Bot 默认图标',
    footerAccount: '使用当前登录账户头像',
    footerBrand: '使用侧栏图标',
    footerCustom: '选择其他图片',
    resetAll: '全部重置',
    cancel: '取消',
    save: '保存',
    settings: '侧栏品牌',
    customize: '自定义…',
    'Choose a PNG, JPEG, WebP, or GIF image': '请选择 PNG、JPEG、WebP 或 GIF 图片',
    'Choose an image smaller than 25 MB': '请选择小于 25 MB 的图片',
    'That image is too large': '图片太大了',
  },
}

function installStyle(document) {
  const style = document.createElement('style')
  style.dataset.dsBrand = ''
  style.textContent = BRAND_CSS
  document.head.append(style)
  return () => style.remove()
}

function syncNative(value) {
  const bridge = globalThis.dsBotApp
  if (typeof bridge?.setIcon !== 'function') return
  void Promise.resolve(bridge.setIcon(value.brandIcon)).catch(() => {})
}

export function apply(ctx) {
  const document = globalThis.document
  const store = createBrandStore(globalThis.localStorage)
  ctx.effect(() => ctx.locale.register('ds-brand', TEXT), 'ds-brand: dictionaries')
  const t = ctx.locale.bind('ds-brand')
  const open = () => openBrandDialog({
    document,
    value: store.getSnapshot(),
    onSave: value => store.set(value),
    onReset: () => store.reset(),
    loadAccountAvatar: () => loadAccountAvatar(ctx),
    t,
  })

  ctx.effect(() => installStyle(document), 'ds-brand: styles')
  ctx.effect(() => watchBrand(document, () => applyBrand(document, store.getSnapshot(), t('hint'))), 'ds-brand: sidebar')
  ctx.effect(() => installBrandShortcut(document, open), 'ds-brand: editor shortcut')
  ctx.effect(() => {
    const sync = value => {
      applyBrand(document, value, t('hint'))
      syncNative(value)
    }
    sync(store.getSnapshot())
    return store.subscribe(sync)
  }, 'ds-brand: saved branding')

  // Only occupy the Settings trigger when the user changed it. With the default
  // choice DS Bot's own trigger remains untouched.
  ctx.effect(() => {
    let release
    let registered = false
    const sync = () => {
      const wanted = customFooterEnabled(store.getSnapshot())
      if (!wanted) {
        release?.()
        release = undefined
        registered = false
        return
      }
      if (registered) return
      const Mark = () => {
        const value = useSyncExternalStore(store.subscribe, store.getSnapshot)
        const [accountAvatar, setAccountAvatar] = useState('')
        const account = value.footerMode === 'account'
        useEffect(() => {
          if (!account) {
            setAccountAvatar('')
            return undefined
          }
          let live = true
          let refreshing = false
          const controller = new AbortController()
          const refresh = () => {
            if (refreshing) return
            refreshing = true
            void loadAccountAvatar(ctx, controller.signal).then(url => {
              if (live) setAccountAvatar(url)
            }).catch(() => {
              if (live) setAccountAvatar('')
            }).finally(() => { refreshing = false })
          }
          const onVisibility = () => {
            if (document.visibilityState === 'visible') refresh()
          }
          refresh()
          window.addEventListener('focus', refresh)
          document.addEventListener('visibilitychange', onVisibility)
          return () => {
            live = false
            controller.abort()
            window.removeEventListener('focus', refresh)
            document.removeEventListener('visibilitychange', onVisibility)
          }
        }, [account])
        const icon = footerIconOf(value) || (account ? accountAvatar : '')
        return icon === ''
          ? h('span', { className: 'dsb-footer-default' }, h(FishLogo, { size: 24 }))
          : h('span', { className: 'dsb-footer-mark' }, h('img', {
            src: icon,
            alt: '',
            draggable: false,
            'data-account': account || undefined,
          }))
      }
      release = ctx.slots.inject('settings.trigger', () => ctx.slots.register({
        name: 'settings.trigger',
        priority: -200,
      }, Mark))
      registered = true
    }
    sync()
    const off = store.subscribe(sync)
    return () => {
      off()
      release?.()
    }
  }, 'ds-brand: settings trigger')

  // A second entry point in DSH's General settings, for windows where the
  // sidebar brand is not visible. This row never changes the host or account.
  ctx.effect(() => ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'ds-brand',
    order: 40,
    priority: -200,
  }, function BrandSettingsRow() {
    return h('button', {
      type: 'button',
      className: 'brandkit-button',
      style: { width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center' },
      onClick: open,
    }, h('span', null, t('settings')), h('span', null, t('customize')))
  })), 'ds-brand: settings row')
}
