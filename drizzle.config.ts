import type { Config } from 'drizzle-kit'
import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'

// Ensure envs are loaded when running drizzle-kit
if (existsSync('.env.local')) loadEnv({ path: '.env.local' })
else loadEnv()

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? '',
    authToken: process.env.TURSO_AUTH_TOKEN
  }
} satisfies Config
