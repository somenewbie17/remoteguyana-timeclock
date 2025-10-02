export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { lucia } from '@/auth/lucia'

export async function POST() {
  const cookieStore = await cookies()
  const blank = lucia.createBlankSessionCookie()
  cookieStore.set(blank.name, blank.value, blank.attributes)
  return NextResponse.json({ ok: true })
}
