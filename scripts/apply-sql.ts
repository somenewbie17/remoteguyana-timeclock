import { config as loadEnv } from 'dotenv'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import { createClient } from '@libsql/client'

// Load env before creating client
if (existsSync('.env.local')) loadEnv({ path: '.env.local' })
else loadEnv()

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN
if (!url) throw new Error('TURSO_DATABASE_URL is not set in environment')
const client = createClient({ url, authToken })

function splitByBreakpoints(sql: string): string[] {
  return sql
    .split(/--\>\s*statement-breakpoint/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

async function applyFile(filePath: string) {
  const raw = readFileSync(filePath, 'utf8')
  const stmts = splitByBreakpoints(raw)
  for (const stmt of stmts) {
    const sql = stmt.endsWith(';') ? stmt : stmt + ';'
    try {
  await client.execute(sql)
    } catch (err: any) {
      // Ignore table already exists errors to be idempotent
      const msg = String(err?.message || err)
      if (/already exists/i.test(msg)) continue
      throw err
    }
  }
}

async function main() {
  const dir = path.resolve(process.cwd(), 'drizzle')
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
  for (const f of files) {
    await applyFile(path.join(dir, f))
  }
  console.log('✅ Applied SQL migrations from drizzle/*.sql')
}

main().catch((e) => {
  console.error('❌ SQL apply failed:', e)
  process.exit(1)
})
