export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { shifts, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import * as tz from 'date-fns-tz'
import { addMinutes, isWithinInterval } from 'date-fns'
import { sendEmail } from '@/lib/email'

const sentLog = new Set<string>()

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') // e.g., "Bearer <secret>"
  const x = req.headers.get('x-cron-secret')
  const bearer = auth?.toLowerCase().startsWith('bearer ')
    ? auth.slice(7).trim()
    : undefined
  const provided = x || bearer
  if (!provided || provided !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const now = new Date()
  const in24 = addMinutes(now, 24 * 60)
  const allShifts = await db.select().from(shifts)
  for (const s of allShifts) {
    const [u] = await db.select().from(users).where(eq(users.id, s.userId)).limit(1)
    if (!u || !s.date || !s.startLocal || !s.endLocal) continue
    const before = s.remindBeforeMinutes ?? 15
    const after = s.remindAfterMinutes ?? 15
    const startUtc = tz.fromZonedTime(new Date(`${s.date}T${s.startLocal}:00`), u.timezone)
    const endUtc = tz.fromZonedTime(new Date(`${s.date}T${s.endLocal}:00`), u.timezone)
    const beforeUtc = addMinutes(startUtc, -before)
    const afterUtc = addMinutes(endUtc, after)

    // Use a ±3.5 minute window to tolerate 5-minute cadence jitter (7-minute span)
    const window = 3.5
    for (const [id, when, label] of [
      [`${s.id}:before`, beforeUtc, 'before shift'],
      [`${s.id}:after`, afterUtc, 'after shift']
    ] as const) {
      if (when > in24) continue
      if (isWithinInterval(now, { start: addMinutes(when, -window), end: addMinutes(when, window) })) {
        if (!sentLog.has(id)) {
          await sendEmail(u.email, `Reminder ${label}`, `<p>Your shift ${label} reminder.</p>`)
          sentLog.add(id)
        }
      }
    }
  }
  return NextResponse.json({ ok: true })
}
