import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'
import path from 'path'
import { migrate } from 'drizzle-orm/libsql/migrator'

// Load env from .env.local for local runs BEFORE importing db
if (existsSync('.env.local')) loadEnv({ path: '.env.local' })
else loadEnv()

async function main() {
  const { db } = await import('../src/db/client.js').catch(async () =>
    // fallback for tsx path resolution without .js
    await import('../src/db/client')
  )
  const migrationsFolder = path.resolve(process.cwd(), 'drizzle')
  await migrate(db, { migrationsFolder })
  console.log('✅ Migrations applied')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
