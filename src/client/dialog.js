import { brandImage } from './image.js'
import { DEFAULT_NAME } from './store.js'

function node(tag, className, text) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text !== undefined) element.textContent = text
  return element
}

function setPreview(box, src, fallback) {
  box.replaceChildren()
  if (src) {
    const image = node('img')
    image.src = src
    image.alt = ''
    box.append(image)
  } else {
    box.textContent = fallback
  }
}

function preview(src, fallback) {
  const box = node('span', 'brandkit-preview')
  setPreview(box, src, fallback)
  return box
}

function fileChoice(label, onChange) {
  const input = node('input')
  input.type = 'file'
  input.accept = 'image/png,image/jpeg,image/webp,image/gif'
  input.hidden = true
  const button = node('button', 'brandkit-button', label)
  button.type = 'button'
  button.onclick = () => input.click()
  input.onchange = () => {
    const file = input.files?.[0]
    input.value = ''
    if (file !== undefined) onChange(file)
  }
  return { input, button }
}

export function openBrandDialog({ document, value, onSave, onReset, loadAccountAvatar, t }) {
  document.querySelector('dialog.brandkit-dialog')?.close()
  let draft = { ...value }
  const dialog = node('dialog', 'brandkit-dialog')
  const form = node('form', 'brandkit-form')
  form.method = 'dialog'
  dialog.append(form)

  const head = node('div', 'brandkit-head')
  const copy = node('div')
  copy.append(node('h2', 'brandkit-title', t('title')))
  copy.append(node('p', 'brandkit-hint', t('hint')))
  const close = node('button', 'brandkit-x', '×')
  close.type = 'button'
  close.setAttribute('aria-label', t('close'))
  close.onclick = () => dialog.close()
  head.append(copy, close)

  const nameField = node('label', 'brandkit-field')
  nameField.append(node('span', 'brandkit-label', t('name')))
  const name = node('input', 'brandkit-input')
  name.value = draft.name
  name.maxLength = 40
  name.placeholder = DEFAULT_NAME
  nameField.append(name)

  const brandRow = node('div', 'brandkit-field')
  brandRow.append(node('span', 'brandkit-label', t('image')))
  const brandLine = node('div', 'brandkit-row')
  const brandPreview = preview(draft.brandIcon, (draft.name || DEFAULT_NAME).slice(0, 1).toUpperCase())
  const brandUpload = fileChoice(t('choose'), async file => {
    try {
      draft.brandIcon = await brandImage(file)
      setPreview(brandPreview, draft.brandIcon, '')
    } catch (error) {
      window.alert(t(error instanceof Error ? error.message : String(error)))
    }
  })
  const clearBrand = node('button', 'brandkit-button', t('reset'))
  clearBrand.type = 'button'
  clearBrand.onclick = () => {
    draft.brandIcon = ''
    setPreview(brandPreview, '', (name.value || DEFAULT_NAME).slice(0, 1).toUpperCase())
  }
  brandLine.append(brandPreview, brandUpload.button, clearBrand, brandUpload.input)
  brandRow.append(brandLine)

  const footerField = node('label', 'brandkit-field')
  footerField.append(node('span', 'brandkit-label', t('footer')))
  const footer = node('select', 'brandkit-select')
  footer.append(
    new Option(t('footerDefault'), 'default'),
    new Option(t('footerAccount'), 'account'),
    new Option(t('footerBrand'), 'brand'),
    new Option(t('footerCustom'), 'custom'),
  )
  footer.value = draft.footerMode
  const footerRow = node('div', 'brandkit-row')
  const footerPreview = preview(draft.footerMode === 'brand' ? draft.brandIcon : draft.footerMode === 'custom' ? draft.footerIcon : '', '•')
  let previewRevision = 0
  const refreshFooterPreview = () => {
    const revision = ++previewRevision
    if (footer.value === 'account') {
      setPreview(footerPreview, '', '…')
      void loadAccountAvatar().then(src => {
        if (revision === previewRevision && footer.value === 'account') setPreview(footerPreview, src, '•')
      }).catch(() => {
        if (revision === previewRevision && footer.value === 'account') setPreview(footerPreview, '', '•')
      })
      return
    }
    setPreview(footerPreview, footer.value === 'brand' ? draft.brandIcon : footer.value === 'custom' ? draft.footerIcon : '', '•')
  }
  const footerUpload = fileChoice(t('choose'), async file => {
    try {
      draft.footerIcon = await brandImage(file)
      draft.footerMode = 'custom'
      footer.value = 'custom'
      refreshFooterPreview()
    } catch (error) {
      window.alert(t(error instanceof Error ? error.message : String(error)))
    }
  })
  footerRow.append(footerPreview, footerUpload.button, footerUpload.input)
  footer.onchange = () => {
    draft.footerMode = footer.value
    refreshFooterPreview()
  }
  footerField.append(footer, footerRow)

  const actions = node('div', 'brandkit-actions')
  const reset = node('button', 'brandkit-button', t('resetAll'))
  reset.type = 'button'
  reset.onclick = () => {
    onReset()
    dialog.close()
  }
  const right = node('div', 'brandkit-actions-right')
  const cancel = node('button', 'brandkit-button', t('cancel'))
  cancel.type = 'button'
  cancel.onclick = () => dialog.close()
  const save = node('button', 'brandkit-primary', t('save'))
  save.type = 'submit'
  save.onclick = (event) => {
    event.preventDefault()
    onSave({
      ...draft,
      name: name.value.trim() || DEFAULT_NAME,
      footerMode: footer.value,
    })
    dialog.close()
  }
  right.append(cancel, save)
  actions.append(reset, right)

  form.append(head, nameField, brandRow, footerField, actions)
  document.body.append(dialog)
  dialog.addEventListener('close', () => dialog.remove(), { once: true })
  dialog.showModal()
  refreshFooterPreview()
  name.focus()
  name.select()
}
