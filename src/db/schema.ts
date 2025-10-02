import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['employee','manager'] as const }).notNull().default('employee'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  timezone: text('timezone').notNull().default('America/Guyana'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const shifts = sqliteTable('shifts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  date: text('date'), // ISO date
  startLocal: text('start_local'), // HH:mm
  endLocal: text('end_local'),
  remindBeforeMinutes: integer('remind_before_minutes').default(15),
  remindAfterMinutes: integer('remind_after_minutes').default(15)
})

export const clockEvents = sqliteTable('clock_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  shiftId: text('shift_id').references(() => shifts.id),
  type: text('type', { enum: ['in','out'] as const }).notNull(),
  occurredAtUtc: text('occurred_at_utc').notNull(),
  source: text('source', { enum: ['web','admin'] as const }).default('web'),
  notes: text('notes')
})

export const correctionRequests = sqliteTable('correction_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  shiftId: text('shift_id').references(() => shifts.id),
  target: text('target', { enum: ['in','out'] as const }).notNull(),
  proposedTimeUtc: text('proposed_time_utc').notNull(),
  employeeNotes: text('employee_notes'),
  status: text('status', { enum: ['pending','approved','denied'] as const }).default('pending'),
  managerId: text('manager_id').references(() => users.id),
  managerNotes: text('manager_notes'),
  decidedAt: text('decided_at')
})

// Lucia auth tables
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: integer('expires_at').notNull()
})

export const userKeys = sqliteTable('user_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  hashedPassword: text('hashed_password')
})
