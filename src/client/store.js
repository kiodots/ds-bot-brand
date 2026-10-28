export const STORAGE_KEY = 'ds-brand:v1'
export const DEFAULT_NAME = 'DS Bot'
const MAX_NAME = 40
const IMAGE = /^data:image\/(?:png|jpeg|webp|gif);base64,/i

const image = value => typeof value === 'string' && value.length <= 160_000 && IMAGE.test(value) ? value : ''

export function normalizeBrand(value) {
  const raw = value && typeof value === 'object' ? value : {}
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, MAX_NAME) : ''
  const footerMode = raw.footerMode === 'brand' || raw.footerMode === 'custom' || raw.footerMode === 'account'
    ? raw.footerMode
    : 'default'
  return {
    name: name || DEFAULT_NAME,
    brandIcon: image(raw.brandIcon),
    footerMode,
    footerIcon: image(raw.footerIcon),
  }
}

export function footerIconOf(value) {
  const brand = normalizeBrand(value)
  if (brand.footerMode === 'brand') return brand.brandIcon
  if (brand.footerMode === 'custom') return brand.footerIcon
  return ''
}

export function customFooterEnabled(value) {
  return normalizeBrand(value).footerMode !== 'default'
}

export function createBrandStore(storage) {
  const listeners = new Set()
  const read = () => {
    try { return normalizeBrand(JSON.parse(storage?.getItem(STORAGE_KEY) ?? '{}')) } catch { return normalizeBrand(null) }
  }
  let value = read()
  const publish = (next) => {
    value = normalizeBrand(next)
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(value)) } catch { /* storage can be unavailable */ }
    for (const listener of listeners) listener(value)
  }
  return {
    getSnapshot: () => value,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    set(next) { publish(next) },
    reset() { publish(null) },
  }
}
