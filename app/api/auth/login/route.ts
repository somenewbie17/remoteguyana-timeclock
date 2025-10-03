// app/api/auth/login/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '@/lib/hash'

export async function POST(req: Request) {
  try {
    console.log('[login] start')

    const { email, password } = await req.json()
    const e = String(email || '').trim().toLowerCase()
    const p = String(password || '')

    console.log('[login] input parsed for', e)

    const row = await db.query.users.findFirst({
      where: eq(users.email, e),
      columns: { id: true, passwordHash: true, role: true, firstName: true, lastName: true }
    })

    console.log('[login] querying user')

    if (!row) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })

    console.log('[login] user found', row.id)

    if (!row.passwordHash?.startsWith('$argon2')) {
      console.error('[login] invalid hash format', row.passwordHash?.slice?.(0, 12))
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // IMPORTANT: verify(hash, password)
    const ok = await verifyPassword(row.passwordHash, p)
    if (!ok) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })

    // TODO: restore Lucia session creation and set cookie here
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
