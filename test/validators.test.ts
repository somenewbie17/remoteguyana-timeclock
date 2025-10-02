import { describe, expect, it } from 'vitest'
import { loginSchema } from '@/lib/validators'

describe('validators', () => {
  it('valid login', () => {
    const r = loginSchema.safeParse({ email: 'a@b.com', password: '123456' })
    expect(r.success).toBe(true)
  })
})
