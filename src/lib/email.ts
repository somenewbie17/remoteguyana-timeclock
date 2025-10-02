import { Resend } from 'resend'

const defaultFrom = 'RemoteGuyana Timeclock <no-reply@remoteguyana.dev>'
const FROM = process.env.RESEND_FROM ?? defaultFrom

export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { id: 'dry-run', to, subject } as { id: string; to: string; subject: string }
  const resend = new Resend(apiKey)
  const r = await resend.emails.send({ from: FROM, to, subject, html })
  if (r.error) throw new Error(r.error.message)
  return r
}
