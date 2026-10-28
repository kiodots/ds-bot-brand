import { DEFAULT_NAME } from './store.js'

const NAME_STYLE = 'font-weight:600;font-size:14px'

function markOf(brand) {
  return brand.querySelector('.bt-brand-whale')
}

function nameOf(brand) {
  const direct = [...brand.children].filter(node => node !== markOf(brand))
  return direct.at(-1) ?? null
}

export function applyBrand(document, value, customize = 'Customize sidebar') {
  for (const brand of document.querySelectorAll('.bt-brand')) {
    const mark = markOf(brand)
    if (mark !== null) {
      let image = mark.querySelector(':scope > img[data-ds-brand-image]')
      if (value.brandIcon === '') {
        image?.remove()
        mark.removeAttribute('data-ds-brand-image')
      } else {
        if (image === null) {
          image = document.createElement('img')
          image.dataset.dsBrandImage = ''
          image.alt = ''
          image.draggable = false
          mark.append(image)
        }
        if (image.getAttribute('src') !== value.brandIcon) image.setAttribute('src', value.brandIcon)
        mark.setAttribute('data-ds-brand-image', '')
      }
    }
    const name = nameOf(brand)
    if (name !== null) {
      if (!name.hasAttribute('data-ds-brand-name')) name.setAttribute('data-ds-brand-name', '')
      if (!name.getAttribute('style')?.includes('font-weight:600')) name.setAttribute('style', NAME_STYLE)
      const text = value.name || DEFAULT_NAME
      if (name.textContent !== text) name.textContent = text
    }
    if (brand.title !== customize) brand.title = customize
    if (brand.getAttribute('role') !== 'button') brand.setAttribute('role', 'button')
    if (brand.tabIndex !== 0) brand.tabIndex = 0
  }
}

export function watchBrand(document, apply) {
  const run = () => apply()
  const observer = new MutationObserver(run)
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class'] })
  run()
  return () => observer.disconnect()
}

export function installBrandShortcut(document, open) {
  const click = (event) => {
    const brand = event.target instanceof Element ? event.target.closest('.bt-brand') : null
    if (brand === null) return
    event.preventDefault()
    event.stopPropagation()
    open()
  }
  const key = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const brand = event.target instanceof Element ? event.target.closest('.bt-brand') : null
    if (brand === null) return
    event.preventDefault()
    open()
  }
  document.addEventListener('click', click, true)
  document.addEventListener('keydown', key, true)
  return () => {
    document.removeEventListener('click', click, true)
    document.removeEventListener('keydown', key, true)
  }
}
