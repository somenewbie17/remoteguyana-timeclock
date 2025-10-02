export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { clockEvents } from '@/db/schema'
import { getSession } from '@/auth/lucia'
import { clockSchema } from '@/lib/validators'

export async function POST(req: Request) {
  const { session, user } = await getSession()
  if (!session || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const json = await req.json().catch(() => ({}))
  const parsed = clockSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const id = crypto.randomUUID()
  await db.insert(clockEvents).values({
    id,
    userId: user.id,
    shiftId: parsed.data.shiftId ?? null,
    type: 'out',
    occurredAtUtc: new Date().toISOString(),
    source: 'web'
  })
  return NextResponse.json({ ok: true, id })
}
