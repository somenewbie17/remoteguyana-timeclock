export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { lucia } from '@/auth/lucia'
import { loginSchema } from '@/lib/validators'

export async function POST(req: Request) {
  const json = await req.json()
  const parsed = loginSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  const { email, password } = parsed.data
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
  const { verifyPassword } = await import('@/lib/hash')
  const ok = await verifyPassword(user.passwordHash, password)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
  const session = await lucia.createSession(user.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', `${sessionCookie.name}=${sessionCookie.value}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV==='production'?'; Secure':''}`)
  return res
}
