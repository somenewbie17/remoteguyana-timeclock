export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { correctionRequests, shifts } from '@/db/schema'
import { getSession } from '@/auth/lucia'
import { correctionCreateSchema } from '@/lib/validators'
import { localHHmmToUtcISOString } from '@/lib/time'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const { session, user } = await getSession()
  if (!session || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const json = await req.json().catch(() => ({}))
  const parsed = correctionCreateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const { shiftId, target, proposedTimeLocal, notes } = parsed.data
  const [shift] = await db.select().from(shifts).where(eq(shifts.id, shiftId)).limit(1)
  if (!shift || shift.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const proposedUtc = localHHmmToUtcISOString(shift.date!, proposedTimeLocal, (user as any).timezone)
  const id = crypto.randomUUID()
  await db.insert(correctionRequests).values({
    id,
    userId: user.id,
    shiftId,
    target,
    proposedTimeUtc: proposedUtc,
    employeeNotes: notes ?? null,
    status: 'pending'
  })
  return NextResponse.json({ ok: true, id })
}
