import { db } from '@/db/client'
import { users, shifts } from '@/db/schema'
import { eq } from 'drizzle-orm'

function todayISODate() {
  const d = new Date()
  const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString()
  return iso.slice(0, 10)
}

async function main() {
  const [employee] = await db.select().from(users).where(eq(users.email, 'employee@example.com')).limit(1)
  if (!employee) throw new Error('Seed user employee@example.com not found. Run pnpm seed first.')
  const id = crypto.randomUUID()
  const row = {
    id,
    userId: employee.id,
    date: todayISODate(),
    startLocal: '09:00',
    endLocal: '17:00',
    remindBeforeMinutes: 15,
    remindAfterMinutes: 15,
  }
  await db.insert(shifts).values(row)
  console.log('Created demo shift', row)
}

main().catch((e) => { console.error(e); process.exit(1) }).then(() => process.exit(0))
