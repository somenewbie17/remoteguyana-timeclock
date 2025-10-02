// Minimal doc-friendly smoke flow using fetch; requires server running and DB configured
const BASE = 'http://localhost:3000'

async function post(path: string, body: any, headers: Record<string, string> = {}) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body)
  })
  const text = await res.text()
  let json: any
  try { json = JSON.parse(text) } catch { json = text }
  return { status: res.status, json }
}

async function main() {
  console.log('NOTE: This script demonstrates API calls. Login cookie handling is not automated here.')
  console.log('1) Log in via browser at /login using employee@example.com / employee123')
  console.log('2) POST /api/clock/in and /api/clock/out from your app UI (or add cookie handling here)')
  console.log('3) Manager approves corrections at /manager')
}

main()
