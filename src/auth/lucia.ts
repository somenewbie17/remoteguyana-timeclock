import { Lucia, TimeSpan } from 'lucia'
import { cookies } from 'next/headers'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from '@/db/client'
import { sessions, users } from '@/db/schema'

export const lucia = new Lucia(new DrizzleSQLiteAdapter(db, sessions, users), {
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    name: 'rg_session',
    attributes: {
      secure: process.env.NODE_ENV === 'production'
    }
  },
  getUserAttributes: (data) => ({
    email: (data as any).email,
    role: (data as any).role,
    firstName: (data as any).firstName,
    lastName: (data as any).lastName,
    timezone: (data as any).timezone
  })
})

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value
  if (!sessionId) return { session: null, user: null }
  const { session, user } = await lucia.validateSession(sessionId)
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }
  if (!session) {
    const blank = lucia.createBlankSessionCookie()
    cookieStore.set(blank.name, blank.value, blank.attributes)
  }
  return { session, user }
}

export type AuthUser = {
  id: string
  email: string
  role: 'employee'|'manager'
  firstName: string
  lastName: string
  timezone: string
}
