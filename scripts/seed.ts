import 'dotenv/config'
import { db } from '@/db/client'
import { users } from '@/db/schema'
import { hashPassword } from '@/lib/hash'
import { eq } from 'drizzle-orm'

async function upsertUser(id: string, email: string, role: 'employee'|'manager', first: string, last: string, pw: string) {
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing) return existing
  const passwordHash = await hashPassword(pw)
  const row = { id, email, passwordHash, role, firstName: first, lastName: last, timezone: 'America/Guyana' }
  await db.insert(users).values(row)
  return row
}

async function main() {
  await upsertUser(crypto.randomUUID(), 'manager@example.com', 'manager', 'Maya', 'Manager', 'manager123')
  await upsertUser(crypto.randomUUID(), 'employee@example.com', 'employee', 'Eli', 'Employee', 'employee123')
  console.log('Seed complete: manager@example.com/manager123, employee@example.com/employee123')
}

main().catch((e) => { console.error(e); process.exit(1) }).then(() => process.exit(0))
