const IMAGE = /^image\/(png|jpeg|webp|gif)$/
const MAX_FILE = 25 * 1024 * 1024
const MAX_URL = 160_000

export async function brandImage(file) {
  if (!IMAGE.test(file.type)) throw new Error('Choose a PNG, JPEG, WebP, or GIF image')
  if (file.size > MAX_FILE) throw new Error('Choose an image smaller than 25 MB')
  const bitmap = await createImageBitmap(file)
  const side = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = side
  const context = canvas.getContext('2d')
  context.imageSmoothingQuality = 'high'
  const scale = Math.min(side / bitmap.width, side / bitmap.height)
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  context.drawImage(bitmap, Math.round((side - width) / 2), Math.round((side - height) / 2), width, height)
  bitmap.close?.()
  for (const quality of [0.92, 0.8, 0.65]) {
    const url = canvas.toDataURL('image/webp', quality)
    if (url.startsWith('data:image/webp') && url.length < MAX_URL) return url
  }
  const png = canvas.toDataURL('image/png')
  if (png.length < MAX_URL) return png
  throw new Error('That image is too large')
}
