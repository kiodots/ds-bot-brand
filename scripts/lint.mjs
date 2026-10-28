import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const plugin = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const candidates = [
  process.env.DSH_HARNESS,
  join(plugin, '..', '..', 'ds-bot', 'dev', 'harness'),
  join(plugin, '..', '..', 'deepseek-harness'),
]
const bin = candidates.filter(Boolean).map(dir => join(dir, 'node_modules', 'oxlint', 'bin', 'oxlint')).find(existsSync)
if (!bin) {
  console.error('lint: no oxlint found; run ds-bot npm run harness, or set DSH_HARNESS')
  process.exit(2)
}
const result = spawnSync(process.execPath, [bin, '-c', '.oxlintrc.json', 'index.js', 'src', 'scripts', 'test'], { cwd: plugin, stdio: 'inherit' })
if (result.error) console.error(`lint: ${result.error.message}`)
process.exit(result.status ?? 1)
