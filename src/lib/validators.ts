import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const clockSchema = z.object({
  shiftId: z.string().uuid().optional()
})

export const correctionCreateSchema = z.object({
  shiftId: z.string().uuid(),
  target: z.enum(['in','out']),
  proposedTimeLocal: z.string(),
  notes: z.string().optional()
})

export const correctionDecisionSchema = z.object({
  decision: z.enum(['approved','denied']),
  managerNotes: z.string().optional()
})
