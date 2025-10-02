import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from '@/lib/hash'

describe('hash', () => {
  it('hashes and verifies', async () => {
    const h = await hashPassword('secret')
    expect(await verifyPassword(h, 'secret')).toBe(true)
    expect(await verifyPassword(h, 'nope')).toBe(false)
  })
})
