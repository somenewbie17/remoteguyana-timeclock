export const runtime = 'nodejs'

import { createClient } from '@libsql/client'

export async function GET() {
  try {
    const url = process.env.TURSO_DATABASE_URL!
    const authToken = process.env.TURSO_AUTH_TOKEN!
    const client = createClient({ url, authToken })
    await client.execute('select 1')
    return Response.json({ ok: true })
  } catch (e: any) {
    console.error('DB health error:', e?.message || e)
    return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
