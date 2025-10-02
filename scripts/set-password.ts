import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'

// Load env early so DB client sees it
if (existsSync('.env.local')) loadEnv({ path: '.env.local' })
else loadEnv()

// Defer imports until after env is loaded
const { db } = await import('@/db/client')
const { users } = await import('@/db/schema')
const { eq } = await import('drizzle-orm')
const { hashPassword } = await import('@/lib/hash')

function genPassword(length = 20) {
  const bytes = new Uint8Array(length)
  ;(globalThis.crypto ?? require('node:crypto').webcrypto).getRandomValues(bytes)
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_' // URL-safe
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

async function main() {
  const [emailArg, passArg] = process.argv.slice(2)
  if (!emailArg) {
    console.error('Usage: pnpm tsx scripts/set-password.ts <email> [newPassword]')
    process.exit(1)
  }
  const email = emailArg
  const [u] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (!u) {
    console.error('No user found with email:', email)
    process.exit(1)
  }
  const password = passArg || genPassword()
  const passwordHash = await hashPassword(password)
  await db.update(users).set({ passwordHash }).where(eq(users.email, email))
  if (passArg) {
    console.log('✅ Password updated for', email)
  } else {
    console.log('✅ Password set for', email, '\nNew password:', password)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
