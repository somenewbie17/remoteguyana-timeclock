// scripts/add-user.ts
import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'

// Load env early
if (existsSync('.env.local')) loadEnv({ path: '.env.local' })
else loadEnv()

const { db } = await import('@/db/client')
const { users } = await import('@/db/schema')
const { eq } = await import('drizzle-orm')
const { hashPassword } = await import('@/lib/hash')

// Usage: pnpm tsx scripts/add-user.ts "First" "Last" "email@domain.com" "Password123" manager "America/Guyana"
async function main() {
  const [first, last, email, password, role = 'manager', tz = 'America/Guyana'] = process.argv.slice(2)
  if (!first || !last || !email || !password) {
    console.error('Usage: pnpm tsx scripts/add-user.ts <first> <last> <email> <password> [role] [timezone]')
    process.exit(1)
  }
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing.length) {
    console.log('User already exists:', email)
    return
  }
  const id = crypto.randomUUID()
  const passwordHash = await hashPassword(password)
  await db.insert(users).values({
    id,
    firstName: first,
    lastName: last,
    email,
    passwordHash,
    role: role as 'manager' | 'employee',
    timezone: tz
  })
  console.log('Created:', email, 'role:', role, 'id:', id)
}

main().catch((e) => { console.error(e); process.exit(1) })
