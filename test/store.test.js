import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadAccountAvatar, safeAvatarUrl } from '../src/client/account.js'
import { createBrandStore, customFooterEnabled, DEFAULT_NAME, footerIconOf, normalizeBrand, STORAGE_KEY } from '../src/client/store.js'

const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

test('brand settings default to the DS Bot name and the built-in footer icon', () => {
  const value = normalizeBrand(null)
  assert.equal(value.name, DEFAULT_NAME)
  assert.equal(value.brandIcon, '')
  assert.equal(value.footerMode, 'default')
  assert.equal(footerIconOf(value), '')
  assert.equal(customFooterEnabled(value), false)
})

test('brand settings keep a valid name and image and reject other values', () => {
  const value = normalizeBrand({ name: `  ${'A'.repeat(50)}  `, brandIcon: image, footerMode: 'brand' })
  assert.equal(value.name.length, 40)
  assert.equal(value.brandIcon, image)
  assert.equal(footerIconOf(value), image)
  assert.equal(customFooterEnabled(value), true)
  assert.equal(normalizeBrand({ brandIcon: 'data:text/plain;base64,AA' }).brandIcon, '')
})

test('the footer can follow the signed-in account without storing its avatar', () => {
  const value = normalizeBrand({ footerMode: 'account', footerIcon: image })
  assert.equal(value.footerMode, 'account')
  assert.equal(footerIconOf(value), '')
  assert.equal(customFooterEnabled(value), true)
})

test('the store survives a reload and follows footer choices', () => {
  const values = new Map()
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  const store = createBrandStore(storage)
  assert.deepEqual(store.getSnapshot(), normalizeBrand(null))
  store.set({ name: 'My Team', brandIcon: image, footerMode: 'custom', footerIcon: image })
  assert.equal(values.has(STORAGE_KEY), true)
  assert.deepEqual(createBrandStore(storage).getSnapshot().name, 'My Team')
  assert.equal(footerIconOf(store.getSnapshot()), image)
  store.reset()
  assert.equal(store.getSnapshot().name, DEFAULT_NAME)
})

test('account avatars are resolved at runtime and limited to web URLs', async () => {
  assert.equal(safeAvatarUrl('https://example.com/avatar.png'), 'https://example.com/avatar.png')
  assert.equal(safeAvatarUrl('javascript:alert(1)'), '')
  assert.equal(safeAvatarUrl('data:image/png;base64,AA'), '')
  const calls = []
  const ctx = {
    locale: { getSnapshot: () => ({ active: 'zh-CN' }) },
    remote: {
      account: {
        getProfile: async metadata => {
          calls.push(metadata)
          return { ok: true, value: { status: 'ready', value: { avatarUrl: 'https://example.com/me.png' } } }
        },
      },
    },
  }
  assert.equal(await loadAccountAvatar(ctx), 'https://example.com/me.png')
  assert.equal(calls[0].locale, 'zh-CN')
  assert.equal(typeof calls[0].timezoneOffsetSeconds, 'number')
  ctx.remote.account.getProfile = async () => ({ ok: true, value: { status: 'ready', value: { avatarUrl: null } } })
  assert.equal(await loadAccountAvatar(ctx), '')
  const unavailable = { get remote() { throw new Error('not injected') } }
  assert.equal(await loadAccountAvatar(unavailable), '')
})
