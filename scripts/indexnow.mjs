// Tell IndexNow search engines (Bing — which also feeds Copilot and ChatGPT search —
// Yandex, Seznam, Naver…) which URLs changed, right after a deploy.
//
//   node scripts/indexnow.mjs           # URLs whose <lastmod> is within the last 3 days (+ home/blog pages)
//   node scripts/indexnow.mjs --all     # every URL in the sitemap
//
// Reads dist/sitemap.xml, so run it after `npm run build`. The key is the public/<32-hex>.txt file
// (its content is the key itself); search engines fetch it to verify the site owns the key.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const host = readFileSync(join(root, 'src/data/profile.ts'), 'utf8').match(/url: 'https:\/\/([^']+)'/)[1]
const keyFile = readdirSync(join(root, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
if (!keyFile) throw new Error('No IndexNow key file in public/')
const key = keyFile.slice(0, -4)

const xml = readFileSync(join(root, 'dist/sitemap.xml'), 'utf8')
const all = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, u]) => ({
  loc: u.match(/<loc>([^<]+)<\/loc>/)[1].replace(/&amp;/g, '&'),
  lastmod: u.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]
}))

const since = Date.now() - 3 * 24 * 3600 * 1000
const always = new Set([`https://${host}/`, `https://${host}/en/`, `https://${host}/blog/`, `https://${host}/en/blog/`])
const urls = process.argv.includes('--all')
  ? all.map((u) => u.loc)
  : all.filter((u) => always.has(u.loc) || (u.lastmod && Date.parse(u.lastmod) >= since)).map((u) => u.loc)

if (!urls.length) {
  console.log('IndexNow: nothing changed recently')
  process.exit(0)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${keyFile}`, urlList: urls.slice(0, 10000) })
})
console.log(`IndexNow: submitted ${urls.length} URL(s) for ${host} → HTTP ${res.status}`)
// 200/202 = accepted. 422/403 usually mean the key file is not live yet; don't fail the deploy for it.
if (res.status >= 500) process.exitCode = 1
