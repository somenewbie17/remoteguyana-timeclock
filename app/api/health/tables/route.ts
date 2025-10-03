export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { createClient } from '@libsql/client'

export async function GET() {
  try {
    const url = process.env.TURSO_DATABASE_URL!
    const authToken = process.env.TURSO_AUTH_TOKEN!
    const client = createClient({ url, authToken })
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    const tables = res.rows.map((r: any) => r.name)
    return Response.json({ ok: true, tables })
  } catch (e: any) {
    return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
