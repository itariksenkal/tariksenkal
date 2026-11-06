// Publish scheduled posts: move every queue/<lang>/<slug>.md whose publishDate has passed
// into src/content/blog/<lang>/. Run daily by .github/workflows/publish-scheduled.yml.
//
//   node scripts/publish-due.mjs            # publish what is due now
//   node scripts/publish-due.mjs --list     # show the queue, publish nothing
//   PUBLISH_NOW=2026-11-20T10:00:00+03:00 node scripts/publish-due.mjs   # pretend it is another time
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const queueDir = path.join(root, 'queue')
const blogDir = path.join(root, 'src/content/blog')
const coverDir = path.join(root, 'src/assets/blog/covers')
const now = process.env.PUBLISH_NOW ? new Date(process.env.PUBLISH_NOW) : new Date()
const listOnly = process.argv.includes('--list')

function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8')
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) throw new Error(`${file}: missing frontmatter`)
  const get = (k) => fm[1].match(new RegExp(`^${k}:\\s*"?([^"\\r\\n]*)"?`, 'm'))?.[1]?.trim()
  const date = new Date(get('publishDate') ?? '')
  if (Number.isNaN(date.valueOf())) throw new Error(`${file}: invalid publishDate`)
  return { title: get('title'), date, translation: get('translation'), cover: get('  src') }
}

const items = []
for (const lang of ['tr', 'en']) {
  const dir = path.join(queueDir, lang)
  if (!fs.existsSync(dir)) continue
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const file = path.join(dir, name)
    items.push({ lang, slug: name.replace(/\.md$/, ''), file, ...frontmatter(file) })
  }
}
items.sort((a, b) => a.date - b.date || a.lang.localeCompare(b.lang))

if (listOnly) {
  for (const it of items)
    console.log(`${it.date.toISOString().slice(0, 16)}  ${it.lang}  ${it.slug}  ${it.date <= now ? '(due)' : ''}`)
  console.log(`${items.length} files in queue`)
  process.exit(0)
}

const due = items.filter((it) => it.date <= now)
const problems = []
for (const it of due) {
  const target = path.join(blogDir, it.lang, `${it.slug}.md`)
  if (fs.existsSync(target)) problems.push(`${it.lang}/${it.slug} already exists in src/content/blog`)
  if (it.cover) {
    const cover = path.join(coverDir, path.basename(it.cover))
    if (!fs.existsSync(cover)) problems.push(`${it.lang}/${it.slug}: missing cover ${path.basename(it.cover)}`)
  }
}
if (problems.length) {
  console.error('Not publishing:\n- ' + problems.join('\n- '))
  process.exit(1)
}

for (const it of due) {
  const target = path.join(blogDir, it.lang, `${it.slug}.md`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.renameSync(it.file, target)
  console.log(`published ${it.lang}/${it.slug} — ${it.title}`)
}
console.log(`${due.length} published, ${items.length - due.length} still queued`)

if (process.env.GITHUB_OUTPUT) {
  const titles = due.filter((it) => it.lang === 'tr').map((it) => it.title).join(' | ')
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `published=${due.length > 0}\ntitles=${titles.replace(/\n/g, ' ')}\n`)
}
