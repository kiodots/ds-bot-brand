const ACCOUNT_CLIENT_VERSION = '0.2.1-rc.2'

export function safeAvatarUrl(value) {
  if (typeof value !== 'string' || value.length > 4096) return ''
  try {
    const url = new URL(value, globalThis.location?.href ?? 'https://deepseek.invalid/')
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

export async function loadAccountAvatar(ctx, signal) {
  let account
  try {
    account = ctx?.remote?.account
  } catch {
    return ''
  }
  if (typeof account?.getProfile !== 'function' || signal?.aborted) return ''
  let locale = 'en'
  try {
    locale = ctx.locale?.getSnapshot?.().active || locale
  } catch { /* the account call can still use the default locale */ }
  try {
    const result = await account.getProfile({
      version: ACCOUNT_CLIENT_VERSION,
      locale,
      timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
    })
    if (signal?.aborted || result?.ok !== true || result.value?.status !== 'ready') return ''
    return safeAvatarUrl(result.value.value?.avatarUrl)
  } catch {
    return ''
  }
}
