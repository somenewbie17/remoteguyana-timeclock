export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { correctionRequests, clockEvents, users } from '@/db/schema'
import { getSession } from '@/auth/lucia'
import { correctionDecisionSchema } from '@/lib/validators'
import { eq } from 'drizzle-orm'
import { sendEmail } from '@/lib/email'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { session, user } = await getSession()
  if (!session || !user || (user as any).role !== 'manager') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await _.json().catch(() => ({}))
  const parsed = correctionDecisionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const id = params.id
  const [reqRow] = await db.select().from(correctionRequests).where(eq(correctionRequests.id, id)).limit(1)
  if (!reqRow) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { decision, managerNotes } = parsed.data
  if (decision === 'approved') {
    const existing = await db.select().from(clockEvents).where(eq(clockEvents.userId, reqRow.userId))
    const match = existing.find(e => e.shiftId === reqRow.shiftId && e.type === reqRow.target)
    if (match) {
      await db.update(clockEvents).set({ occurredAtUtc: reqRow.proposedTimeUtc, notes: 'Corrected by manager' }).where(eq(clockEvents.id, match.id))
    } else {
      await db.insert(clockEvents).values({
        id: crypto.randomUUID(),
        userId: reqRow.userId,
        shiftId: reqRow.shiftId,
        type: reqRow.target as 'in'|'out',
        occurredAtUtc: reqRow.proposedTimeUtc,
        source: 'admin',
        notes: 'Added by manager approval'
      })
    }
  }

  await db.update(correctionRequests).set({ status: decision, managerId: user.id, managerNotes: managerNotes ?? null, decidedAt: new Date().toISOString() }).where(eq(correctionRequests.id, id))

  const [emp] = await db.select().from(users).where(eq(users.id, reqRow.userId)).limit(1)
  if (emp) {
    await sendEmail(emp.email, `Correction ${decision}`, `<p>Your correction request was ${decision}. Notes: ${managerNotes ?? ''}</p>`)
  }
  return NextResponse.json({ ok: true })
}
