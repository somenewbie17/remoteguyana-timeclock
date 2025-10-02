export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const vars = [
    'TURSO_DATABASE_URL',
    'TURSO_AUTH_TOKEN',
    'RESEND_API_KEY',
    'RESEND_FROM',
    'CRON_SECRET',
  ] as const
  const present = Object.fromEntries(vars.map((k) => [k, Boolean(process.env[k])]))
  return Response.json({ ok: true, present })
}
