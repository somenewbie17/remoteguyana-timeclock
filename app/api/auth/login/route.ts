export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validators'

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = loginSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    const { email, password } = parsed.data

    const { db } = await import('@/db/client')
    const { users } = await import('@/db/schema')
    const { eq } = await import('drizzle-orm')

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })

    const { verifyPassword } = await import('@/lib/hash')
    const ok = await verifyPassword(user.passwordHash, password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })

    const { lucia } = await import('@/auth/lucia')
    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', `${sessionCookie.name}=${sessionCookie.value}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV==='production'?'; Secure':''}`)
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }
}
