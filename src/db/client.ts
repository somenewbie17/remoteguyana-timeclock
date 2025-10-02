import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

// Avoid throwing at import-time during build. Defer errors until the db is actually used.
export const libsql = url ? createClient({ url, authToken }) : (null as any)
export const db = url
	? drizzle(libsql)
	: (new Proxy(
			{},
			{
				get() {
					throw new Error('TURSO_DATABASE_URL is not set')
				}
			}
		) as any)
