# RemoteGuyana Timeclock

Minimal timeclock built with Next.js App Router, Drizzle (Turso SQLite), Lucia auth, Resend, Tailwind, Zod, and Vitest.

## Stack
- Next.js 14 (TypeScript, App Router, Server Actions)
- Drizzle ORM + Turso (libsql)
- Lucia (email + password, Argon2 via oslo/password)
- Resend (email)
- Tailwind CSS with CSS variables (light/dark) primary purple #553BF9
- date-fns/date-fns-tz
- Vitest

## Prerequisites
- Node 18+
- pnpm
- Turso account (database URL + auth token)
- Resend API key

## Setup
1) Copy env

cp .env.local.example .env.local

Fill in:
- TURSO_DATABASE_URL
- TURSO_AUTH_TOKEN
- RESEND_API_KEY
- CRON_SECRET (random string)
- NEXTAUTH_URL (http://localhost:3000)

2) Install deps

pnpm install

3) Generate/Push schema

- Configure drizzle in `drizzle.config.ts` (already set for Turso)
- Run:

pnpm db:push

4) Seed demo users

pnpm seed

Seeds:
- manager@example.com / manager123
- employee@example.com / employee123

5) Run dev

pnpm dev

Open http://localhost:3000

## Vercel Cron
- Create a GET cron hitting /api/cron/reminders every 5 minutes.
- Add header X-CRON-SECRET: your CRON_SECRET.

## Deploy to Vercel
- Set Environment Variables in Vercel project.
- Connect Turso and Resend credentials.
- Add Vercel Cron schedule.

## Tests

pnpm test

## Notes
- All timestamps stored in UTC. Users have IANA timezone (default America/Guyana). date-fns-tz used to convert.
- RLS-like checks enforced in code: employees read/write their own rows; managers can see all.# RemoteGuyana Timeclock

Minimal timeclock built with Next.js App Router, Drizzle (Turso), Lucia auth, Resend emails, Tailwind, Zod, and Vitest.

## Stack
- Next.js 14 App Router (TypeScript)
- Drizzle ORM with Turso (@libsql/client)
- Lucia (email+password) with Argon2 (oslo/password)
- Resend for emails
- Tailwind CSS with CSS variables and dark mode
- Zod for input validation
- date-fns/date-fns-tz for time zones
- Vitest for tests

## Getting started

1) Install dependencies

```sh
pnpm install
```

2) Set environment variables

Copy `.env.local.example` to `.env.local` and fill values:

```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
RESEND_API_KEY=
CRON_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

3) Database setup (Turso)

- Create a Turso DB and auth token (via Turso CLI or dashboard)
- Update `.env.local` with `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
- Push schema and generate migrations (Drizzle):

```sh
pnpm db:push
```

4) Seed demo users

```sh
pnpm seed
```

This creates:
- manager@example.com / password123 (role: manager)
- employee@example.com / password123 (role: employee)

5) Run the app

```sh
pnpm dev
```

Visit http://localhost:3000

## Cron reminders (Vercel Cron)
- Create a Vercel Cron job to hit `/api/cron/reminders` every 5 minutes.
- Add header `X-CRON-SECRET: <your-secret>` and set `CRON_SECRET` env in Vercel.

## Resend email
- Set `RESEND_API_KEY` in env.
- Emails will be sent from the placeholder `no-reply@remoteguyana.example`. Update `src/lib/email.ts`.

## Auth and roles
- Email+password login at `/login`
- Employees can access `/app`
- Managers can access `/manager` and `/shifts`

## Tests

```sh
pnpm test
```

## Deploy to Vercel
- Import this repo into Vercel
- Set environment variables
- Configure Vercel Cron
- Deploy

## Notes
- All timestamps are stored in UTC; users have an IANA timezone string.
- Use date-fns-tz to convert for display and reminder calculations.