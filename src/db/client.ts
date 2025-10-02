import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url) throw new Error('TURSO_DATABASE_URL is not set')

export const libsql = createClient({ url, authToken })
export const db = drizzle(libsql)
